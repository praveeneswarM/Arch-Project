import os
import json
import logging
import aiohttp
import re
from typing import Dict, Any, Optional
from abc import ABC, abstractmethod

logger = logging.getLogger("llm_provider")

class AIProvider(ABC):
    @abstractmethod
    async def generate_json(self, system_prompt: str, user_prompt: str, schema: Optional[Any] = None) -> Dict[str, Any]:
        """Generates a JSON response from the underlying LLM."""
        pass


class OllamaProvider(AIProvider):
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
        self.model = os.getenv("OLLAMA_MODEL", "deepseek-r1:8b")
        logger.info(f"Initialized OllamaProvider using model: {self.model} at {self.base_url}")

    async def generate_json(self, system_prompt: str, user_prompt: str, schema: Optional[Any] = None) -> Dict[str, Any]:
        prompt = f"System:\n{system_prompt}\n\nUser:\n{user_prompt}\n\nOutput ONLY valid JSON. Do NOT include markdown code blocks or additional text."
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.1
            }
        }
        
        try:
            async with aiohttp.ClientSession() as session:
                async with session.post(f"{self.base_url}/api/generate", json=payload, timeout=120) as resp:
                    if resp.status != 200:
                        error_text = await resp.text()
                        logger.error(f"Ollama API error ({resp.status}): {error_text}")
                        raise Exception(f"Ollama failed with status {resp.status}")
                        
                    data = await resp.json()
                    response_text = data.get("response", "")
                    
                    return self._clean_and_parse_json(response_text)
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}. Falling back to mock data.")
            return self._generate_mock_response(system_prompt, user_prompt)

    def _clean_and_parse_json(self, text: str) -> Dict[str, Any]:
        # Strip <think>...</think> tags which DeepSeek outputs
        text = re.sub(r'<think>.*?</think>', '', text, flags=re.DOTALL)
        
        # Strip markdown code block wrappers
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
            
        if text.endswith("```"):
            text = text[:-3]
            
        text = text.strip()
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse JSON from Ollama output: {e}\nRaw Output: {text}")
            raise

    def _generate_mock_response(self, system_prompt: str, user_prompt: str) -> Dict[str, Any]:
        # Same mock implementation to allow fallback
        from utils.openai_client import OpenAIClient
        return OpenAIClient()._generate_mock_response(system_prompt, user_prompt)


class OpenAIProvider(AIProvider):
    def __init__(self):
        from utils.openai_client import OpenAIClient
        self.client = OpenAIClient()
        logger.info("Initialized OpenAIProvider wrapper.")

    async def generate_json(self, system_prompt: str, user_prompt: str, schema: Optional[Any] = None) -> Dict[str, Any]:
        return await self.client.generate_json(system_prompt, user_prompt, schema)


def get_llm_provider() -> AIProvider:
    provider_name = os.getenv("AI_PROVIDER", "ollama").lower()
    if provider_name == "openai":
        return OpenAIProvider()
    return OllamaProvider()
