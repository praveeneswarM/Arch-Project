"use client";

import React from "react";
import { AlertTriangle, ShieldCheck, Gauge, Layers } from "lucide-react";

interface WarningPanelProps {
  warnings: string[];
  complexityScore: number;
  operationalOverheadScore: number;
  overengineered: boolean;
}

export default function WarningPanel({
  warnings,
  complexityScore,
  operationalOverheadScore,
  overengineered,
}: WarningPanelProps) {
  // Determine color matching for complexity ratings
  const getComplexityColor = (score: number) => {
    if (score < 40) return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
    if (score < 75) return "text-amber-400 border-amber-500/20 bg-amber-500/5";
    return "text-rose-400 border-rose-500/20 bg-rose-500/5";
  };

  return (
    <div className="flex flex-col gap-4 border border-white/5 rounded-2xl glass-panel p-5 h-full">
      {/* Group Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <Gauge className="w-4 h-4 text-indigo-400" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-200 font-sans">
          Complexity & Auditor Analysis
        </h2>
      </div>

      {/* Scores Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Complexity Gauge Card */}
        <div className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center ${getComplexityColor(complexityScore)}`}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-1">Complexity Rating</span>
          <span className="text-2xl font-black font-mono leading-none">{complexityScore}</span>
          <span className="text-[9px] font-mono mt-1 text-gray-500">Scale of 100</span>
        </div>

        {/* Operational Overhead Card */}
        <div className={`border rounded-xl p-3 flex flex-col items-center justify-center text-center ${getComplexityColor(operationalOverheadScore)}`}>
          <span className="text-[10px] uppercase font-mono tracking-widest text-gray-400 mb-1">Ops Overhead</span>
          <span className="text-2xl font-black font-mono leading-none">{operationalOverheadScore}</span>
          <span className="text-[9px] font-mono mt-1 text-gray-500">Scale of 100</span>
        </div>
      </div>

      {/* Overengineering Warning Banner */}
      {overengineered ? (
        <div className="flex items-start gap-3 bg-rose-950/20 border border-rose-500/20 p-3 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.05)]">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5 animate-pulse" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-rose-400 font-sans">Overengineering Flagged!</span>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-mono">
              The ComplexityAuditorAgent detected infrastructural elements excessive for your traffic scale and budget constraints.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 bg-emerald-950/20 border border-emerald-500/20 p-3 rounded-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-emerald-400 font-sans">Optimally Engineered Stack</span>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed font-mono">
              The architecture is aligned with your scale targets, minimizing operational waste.
            </p>
          </div>
        </div>
      )}

      {/* Warnings List */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-44 pr-1">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1">
          <Layers className="w-3 h-3 text-indigo-400" /> System Warnings ({warnings.length})
        </span>
        {warnings.length === 0 ? (
          <p className="text-[10px] text-gray-500 font-mono italic">No auditor warnings triggered.</p>
        ) : (
          warnings.map((warn, i) => (
            <div key={i} className="flex gap-2 text-[10px] font-mono text-amber-300 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg">
              <span className="shrink-0">•</span>
              <p className="leading-normal">{warn}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
