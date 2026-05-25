"use client";

import React, { useState, useEffect } from "react";
import { NodeSchema } from "../types";
import { Sliders, Shield, Database, Cpu, HelpCircle, HardDrive, DollarSign } from "lucide-react";

interface ServiceConfigPanelProps {
  node: NodeSchema;
  onUpdateNode: (nodeId: string, updatedData: { label: string; cost?: string; typeSubText?: string; customMetadata?: any }) => void;
  onClose: () => void;
}

export default function ServiceConfigPanel({
  node,
  onUpdateNode,
  onClose,
}: ServiceConfigPanelProps) {
  const [label, setLabel] = useState(node.data.label);
  const [pricingTier, setPricingTier] = useState("Standard");
  const [minReplicas, setMinReplicas] = useState("1");
  const [maxReplicas, setMaxReplicas] = useState("5");
  const [forceHttps, setForceHttps] = useState(true);
  const [subnetName, setSubnetName] = useState("subnet-default");

  // Synchronize state when selected node changes
  useEffect(() => {
    setLabel(node.data.label);
    const meta = (node.data as any).customMetadata || {};
    setPricingTier(meta.pricingTier || "Standard");
    setMinReplicas(meta.minReplicas || "1");
    setMaxReplicas(meta.maxReplicas || "5");
    setForceHttps(meta.forceHttps !== undefined ? meta.forceHttps : true);
    setSubnetName(meta.subnetName || "subnet-default");
  }, [node]);

  const handleSave = () => {
    // Determine cost rating based on tier selection
    let cost = "~$25/mo";
    switch (node.type) {
      case "BackendNode":
        cost = pricingTier === "Premium" ? "~$150/mo" : pricingTier === "Standard" ? "~$75/mo" : "~$30/mo";
        break;
      case "DatabaseNode":
        cost = pricingTier === "Premium" ? "~$240/mo" : pricingTier === "Standard" ? "~$115/mo" : "~$45/mo";
        break;
      case "CacheNode":
        cost = pricingTier === "Premium" ? "~$90/mo" : pricingTier === "Standard" ? "~$45/mo" : "~$15/mo";
        break;
      case "GatewayNode":
        cost = pricingTier === "Premium" ? "~$120/mo" : pricingTier === "Standard" ? "~$60/mo" : "~$25/mo";
        break;
    }

    onUpdateNode(node.id, {
      label,
      cost,
      typeSubText: node.data.typeSubText,
      customMetadata: {
        pricingTier,
        minReplicas,
        maxReplicas,
        forceHttps,
        subnetName
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 border border-[#27272a] rounded-2xl bg-[#18181b] p-5 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-200 font-sans">
            Service Settings
          </h2>
        </div>
        <button 
          onClick={onClose} 
          className="text-xs font-mono hover:text-white text-slate-500 transition-colors"
        >
          Close
        </button>
      </div>

      {/* Node Component Descriptor */}
      <div className="bg-[#09090b] border border-[#27272a] px-3.5 py-2.5 rounded-xl text-[10px] font-mono">
        <span className="text-slate-500 uppercase tracking-widest leading-none">Class:</span>
        <p className="text-slate-300 mt-0.5">{node.type}</p>
        <span className="text-slate-500 uppercase tracking-widest leading-none mt-2 block">Component ID:</span>
        <p className="text-slate-300 mt-0.5 truncate">{node.id}</p>
      </div>

      {/* Label Edit */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-slate-400 font-medium">Service Name (Label)</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="bg-[#09090b] border border-[#27272a] px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-slate-500 text-slate-200 font-mono"
        />
      </div>

      {/* Pricing Tier Settings */}
      {["BackendNode", "DatabaseNode", "CacheNode", "GatewayNode"].includes(node.type) && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Infrastructure Pricing Tier
          </label>
          <select
            value={pricingTier}
            onChange={(e) => setPricingTier(e.target.value)}
            className="bg-[#09090b] border border-[#27272a] px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-slate-500 text-slate-200 font-sans"
          >
            <option value="Basic">Basic Tier (Cost optimized)</option>
            <option value="Standard">Standard Tier (Standard SLAs)</option>
            <option value="Premium">Premium Tier (Enterprise specs)</option>
          </select>
        </div>
      )}

      {/* Compute Auto-scaling (Backend container exclusive) */}
      {node.type === "BackendNode" && (
        <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-slate-400" /> Min Replicas
            </label>
            <input
              type="number"
              value={minReplicas}
              onChange={(e) => setMinReplicas(e.target.value)}
              className="bg-[#09090b] border border-[#27272a] px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-slate-500 text-slate-200 font-mono"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Cpu className="w-3 h-3 text-slate-400" /> Max Replicas
            </label>
            <input
              type="number"
              value={maxReplicas}
              onChange={(e) => setMaxReplicas(e.target.value)}
              className="bg-[#09090b] border border-[#27272a] px-3 py-1.5 rounded-lg text-xs focus:outline-none focus:border-slate-500 text-slate-200 font-mono"
            />
          </div>
        </div>
      )}

      {/* Network / subnet settings */}
      <div className="flex flex-col gap-1.5 border-t border-white/5 pt-3">
        <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Database className="w-3.5 h-3.5 text-slate-400" /> Virtual Network Subnet
        </label>
        <input
          type="text"
          value={subnetName}
          onChange={(e) => setSubnetName(e.target.value)}
          className="bg-[#09090b] border border-[#27272a] px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-slate-500 text-slate-200 font-mono"
        />
      </div>

      {/* DevSecOps Ingress redirect */}
      <div className="flex items-center justify-between gap-2 border-t border-white/5 pt-3 text-xs">
        <label className="text-slate-400 font-medium flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-slate-400" /> Force Secure TLS / HTTPS
        </label>
        <input
          type="checkbox"
          checked={forceHttps}
          onChange={(e) => setForceHttps(e.target.checked)}
          className="w-4 h-4 border border-[#27272a] bg-[#09090b] rounded"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full mt-4 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-black font-semibold text-xs font-mono uppercase tracking-wider transition-all shadow active:scale-95"
      >
        Save Parameter Changes
      </button>
    </div>
  );
}
