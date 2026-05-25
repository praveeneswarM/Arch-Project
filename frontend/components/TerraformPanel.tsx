"use client";

import React, { useState } from "react";
import { TerraformResponse } from "../types";
import { Copy, Check, Terminal, FileCode, CheckCircle } from "lucide-react";

interface TerraformPanelProps {
  terraform: TerraformResponse | null;
  isLoading: boolean;
}

export default function TerraformPanel({ terraform, isLoading }: TerraformPanelProps) {
  const [activeTab, setActiveTab] = useState<"main" | "variables" | "outputs" | "tfvars" | "guide">("main");
  const [copied, setCopied] = useState(false);

  const getCodeContent = () => {
    if (!terraform) return "";
    switch (activeTab) {
      case "main":
        return terraform.main_tf;
      case "variables":
        return terraform.variables_tf;
      case "outputs":
        return terraform.outputs_tf;
      case "tfvars":
        return terraform.terraform_tfvars;
      case "guide":
        return terraform.instructions;
      default:
        return "";
    }
  };

  const handleCopy = async () => {
    const code = getCodeContent();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
    }
  };

  if (isLoading && !terraform) {
    return (
      <div className="flex flex-col items-center justify-center h-72 border border-white/5 rounded-2xl glass-panel p-6">
        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-mono text-gray-400">Compiling Terraform configurations...</p>
      </div>
    );
  }

  if (!terraform) {
    return (
      <div className="flex flex-col items-center justify-center h-72 border border-white/5 rounded-2xl glass-panel p-6 text-center">
        <FileCode className="w-8 h-8 text-indigo-400/40 mb-3" />
        <p className="text-sm font-semibold text-gray-300 font-sans">No Infrastructure Generated</p>
        <p className="text-xs text-gray-500 max-w-xs mt-1 font-mono">
          Enter cloud specifications on the left to output deployable Terraform.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-white/5 rounded-2xl glass-panel overflow-hidden h-full">
      {/* File Selector Tabs */}
      <div className="bg-background/80 border-b border-white/5 px-4 py-2 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex gap-1.5 min-w-max">
          <button
            onClick={() => setActiveTab("main")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "main" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-gray-400 hover:text-gray-200 border border-transparent"
            }`}
          >
            main.tf
          </button>
          <button
            onClick={() => setActiveTab("variables")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "variables" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-gray-400 hover:text-gray-200 border border-transparent"
            }`}
          >
            variables.tf
          </button>
          <button
            onClick={() => setActiveTab("outputs")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "outputs" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-gray-400 hover:text-gray-200 border border-transparent"
            }`}
          >
            outputs.tf
          </button>
          <button
            onClick={() => setActiveTab("tfvars")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "tfvars" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" : "text-gray-400 hover:text-gray-200 border border-transparent"
            }`}
          >
            terraform.tfvars
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
              activeTab === "guide" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" : "text-gray-400 hover:text-gray-200 border border-transparent"
            }`}
          >
            Operations Guide
          </button>
        </div>

        {/* Action button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-mono border border-white/5 transition-all active:scale-95"
          title="Copy block to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Display Area */}
      <div className="flex-1 bg-background/50 p-4 overflow-y-auto h-96 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center z-10">
            <div className="flex items-center gap-2 bg-background border border-indigo-500/30 px-4 py-2 rounded-xl text-xs font-mono text-indigo-400 animate-pulse-slow">
              <Terminal className="w-4 h-4 animate-spin" />
              <span>Regenerating HCL Stack...</span>
            </div>
          </div>
        )}
        <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap leading-relaxed">
          {getCodeContent()}
        </pre>
      </div>

      {/* Terminal Info Footer */}
      <div className="bg-background/90 px-4 py-2 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-gray-500">
        <span className="flex items-center gap-1">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>Output format: HCL-compliant template files</span>
        </span>
        <span>Scope: Local Directory</span>
      </div>
    </div>
  );
}
