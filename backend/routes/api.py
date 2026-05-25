import asyncio
import logging
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException
from models.schemas import RequirementInput, ArchitectureResponse, TerraformRequest, TerraformResponse, AiAssistRequest

# Agent imports
from agents.requirement_understanding import RequirementUnderstandingAgent
from agents.architecture_reasoning import ArchitectureReasoningAgent
from agents.security_optimization import SecurityOptimizationAgent
from agents.complexity_auditor import ComplexityAuditorAgent
from agents.cost_optimization import CostOptimizationAgent
from agents.architecture_explanation import ArchitectureExplanationAgent

# Core engines
from terraform.engine import TerraformEngine
from utils.llm_provider import get_llm_provider

logger = logging.getLogger("api_routes")
router = APIRouter()

# Reusable client & engine
llm_client = get_llm_provider()
tf_engine = TerraformEngine()

@router.post("/generate-architecture", response_model=ArchitectureResponse)
async def generate_architecture(requirements: RequirementInput):
    """
    Orchestrates the upgraded Multi-Agent AI system:
    Input -> Understood -> Inferred Reasoning -> Security Tiers -> Cost/Complexity Scan
    """
    logger.info("Initializing upgraded autonomous architect pipeline...")
    try:
        understanding_agent = RequirementUnderstandingAgent(client=llm_client)
        understood_reqs = await understanding_agent.analyze(requirements)
        
        reasoning_agent = ArchitectureReasoningAgent(client=llm_client)
        reasoned_plan = await reasoning_agent.reason(understood_reqs)
        
        security_agent = SecurityOptimizationAgent(client=llm_client)
        secured_plan = await security_agent.optimize_security(reasoned_plan, understood_reqs)
        
        nodes = secured_plan.get("updated_nodes", reasoned_plan.get("nodes", []))
        edges = secured_plan.get("updated_edges", reasoned_plan.get("edges", []))
        services = reasoned_plan.get("services", [])
        provider = reasoned_plan.get("cloud_provider", requirements.cloud_provider)
        
        eval_plan = {"nodes": nodes, "edges": edges, "services": services}
        
        complexity_agent = ComplexityAuditorAgent(client=llm_client)
        cost_agent = CostOptimizationAgent(client=llm_client)
        explanation_agent = ArchitectureExplanationAgent(client=llm_client)
        
        complexity_task = complexity_agent.audit(eval_plan, understood_reqs)
        cost_task = cost_agent.optimize(eval_plan, understood_reqs)
        explanation_task = explanation_agent.explain(eval_plan, understood_reqs)
        
        complexity_res, cost_res, explanation_res = await asyncio.gather(
            complexity_task, cost_task, explanation_task
        )
        
        terraform_modules = list(set([n.get("type", "Module") for n in nodes]))
        
        response = ArchitectureResponse(
            nodes=nodes,
            edges=edges,
            services=services,
            cloud_provider=provider,
            cost_estimate=float(cost_res.get("estimated_monthly_cost", 120.0)),
            cost_breakdown=cost_res.get("cost_breakdown", []),
            optimization_recommendations=cost_res.get("optimization_recommendations", []),
            complexity_score=int(complexity_res.get("complexity_score", 45)),
            operational_overhead_score=int(complexity_res.get("operational_overhead_score", 30)),
            overengineered=bool(complexity_res.get("overengineered", False)),
            warnings=complexity_res.get("warnings", []),
            security_score=int(secured_plan.get("security_score", 85)),
            security_findings=secured_plan.get("security_findings", []),
            compliance_checks=secured_plan.get("compliance_checks", []),
            explanation=explanation_res.get("explanation", ""),
            alternatives_considered=explanation_res.get("alternatives_considered", ""),
            justification_for_choices=explanation_res.get("justification_for_choices", ""),
            terraform_modules=terraform_modules
        )
        logger.info("Consolidated security-first autonomous topology.")
        return response
        
    except Exception as e:
        logger.error(f"Upgraded generation pipeline failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-terraform", response_model=TerraformResponse)
async def generate_terraform(request: TerraformRequest):
    """
    Renders HCL configs using the canvas graph as the SINGLE SOURCE OF TRUTH.
    """
    logger.info("Compiling HCL templates directly from the visual canvas graph...")
    try:
        nodes_dict = [node.model_dump() for node in request.nodes]
        edges_dict = [edge.model_dump() for edge in request.edges]
        services_dict = [svc.model_dump() for svc in request.services]
        
        rendered = tf_engine.generate(
            nodes=nodes_dict,
            edges=edges_dict,
            services=services_dict,
            provider=request.cloud_provider
        )
        
        return TerraformResponse(
            main_tf=rendered.get("main_tf", ""),
            variables_tf=rendered.get("variables_tf", ""),
            outputs_tf=rendered.get("outputs_tf", ""),
            terraform_tfvars=rendered.get("terraform_tfvars", ""),
            instructions=rendered.get("instructions", "")
        )
    except Exception as e:
        logger.error(f"HCL compilation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize-cost")
async def optimize_cost(request: Dict[str, Any]):
    """
    Runs FinOps scans directly on the current canvas nodes list.
    """
    try:
        nodes = request.get("nodes", [])
        services = request.get("services", [])
        plan = {"nodes": nodes, "services": services}
        reqs = {"expected_users": "user-customized", "monthly_budget": "user-customized"}
        
        cost_agent = CostOptimizationAgent(client=llm_client)
        return await cost_agent.optimize(plan, reqs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/validate-architecture")
async def validate_architecture(request: Dict[str, Any]):
    """
    Runs compliance scans directly on the current canvas nodes list.
    """
    try:
        nodes = request.get("nodes", [])
        services = request.get("services", [])
        plan = {"nodes": nodes, "services": services}
        reqs = {"security_level": "custom"}
        
        security_agent = SecurityOptimizationAgent(client=llm_client)
        return await security_agent.optimize_security(plan, reqs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/explain-architecture")
async def explain_architecture(request: Dict[str, Any]):
    """
    Explains the active canvas setup.
    """
    try:
        nodes = request.get("nodes", [])
        services = request.get("services", [])
        plan = {"nodes": nodes, "services": services}
        reqs = {"application_type": "user-customized"}
        
        explanation_agent = ArchitectureExplanationAgent(client=llm_client)
        return await explanation_agent.explain(plan, reqs)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ai-assist")
async def ai_assist(request: AiAssistRequest):
    """
    Autonomous AI editing actions directly modifying the architecture graph.
    """
    logger.info(f"AI-Assist triggered. Action: {request.action}")
    try:
        nodes = [node.model_dump() for node in request.nodes]
        edges = [edge.model_dump() for edge in request.edges]
        services = [svc.model_dump() for svc in request.services]
        
        action = request.action.lower()
        backend_node_id = next((n["id"] for n in nodes if n["type"] == "BackendNode"), None)
        
        if action == "optimize_security":
            # 1. Inject KeyVault node if absent
            if not any(n["type"] == "SecurityNode" for n in nodes):
                nodes.append({
                    "id": "vault-injected",
                    "type": "SecurityNode",
                    "data": {"label": "Hardware KeyVault secrets", "status": "active"},
                    "position": {"x": 80, "y": 360}
                })
                services.append({
                    "name": "Hardware KeyVault secrets",
                    "category": "security",
                    "description": "Hardware security module secret storage."
                })
                if backend_node_id:
                    edges.append({
                        "id": "e-be-vault-injected",
                        "source": backend_node_id,
                        "target": "vault-injected",
                        "animated": True
                    })
                    
            # 2. Upgrade gateway load balancer to WAF Ingress
            for node in nodes:
                if node["type"] == "GatewayNode":
                    node["data"]["label"] = "Web App Firewall (WAF) Ingress"
                    
        elif action == "add_monitoring":
            # Inject Monitoring node
            if not any(n["type"] == "MonitoringNode" for n in nodes):
                nodes.append({
                    "id": "monitor-injected",
                    "type": "MonitoringNode",
                    "data": {"label": "App Insights Central Monitor", "status": "active"},
                    "position": {"x": 420, "y": 440}
                })
                services.append({
                    "name": "App Insights Central Monitor",
                    "category": "monitoring",
                    "description": "Log Analytics and Application Performance Monitoring."
                })
                if backend_node_id:
                    edges.append({
                        "id": "e-be-monitor-injected",
                        "source": backend_node_id,
                        "target": "monitor-injected",
                        "animated": False
                    })
                    
        elif action == "add_ha":
            # Upgrade database to HA Cluster
            for node in nodes:
                if node["type"] == "DatabaseNode":
                    node["data"]["label"] = "PostgreSQL DB High-Availability Cluster"
                    
            # Spawn secondary replica compute backend
            if backend_node_id and len([n for n in nodes if n["type"] == "BackendNode"]) < 2:
                replica_id = "backend-replica"
                nodes.append({
                    "id": replica_id,
                    "type": "BackendNode",
                    "data": {"label": "API Compute Replica Node", "status": "active"},
                    "position": {"x": 400, "y": 220}
                })
                services.append({
                    "name": "API Compute Replica Node",
                    "category": "backend",
                    "description": "Redundant backend API container replica."
                })
                
                # Connect Gateway to Replica
                gateway_id = next((n["id"] for n in nodes if n["type"] == "GatewayNode"), None)
                if gateway_id:
                    edges.append({
                        "id": f"e-{gateway_id}-{replica_id}",
                        "source": gateway_id,
                        "target": replica_id,
                        "animated": True
                    })
                
                # Connect Replica to Database
                db_id = next((n["id"] for n in nodes if n["type"] == "DatabaseNode"), None)
                if db_id:
                    edges.append({
                        "id": f"e-{replica_id}-{db_id}",
                        "source": replica_id,
                        "target": db_id,
                        "animated": False
                    })
                    
        elif action == "reduce_cost":
            # 1. Downgrade database to basic VM tier
            for node in nodes:
                if node["type"] == "DatabaseNode":
                    node["data"]["label"] = "Basic Relational PostgreSQL"
                    
            # 2. Prune caching layer if present
            nodes = [n for n in nodes if n["type"] != "CacheNode"]
            edges = [e for e in edges if e["source"] != "cache" and e["target"] != "cache"]
            services = [s for s in services if s["category"] != "cache"]

        return {
            "nodes": nodes,
            "edges": edges,
            "services": services
        }
    except Exception as e:
        logger.error(f"AI-Assist execution failure: {e}")
        raise HTTPException(status_code=500, detail=str(e))
