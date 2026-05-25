"use client";

import React from "react";
import { SecurityFinding, ComplianceCheck } from "../types";
import { Shield, ShieldAlert, CheckCircle2, AlertTriangle, HelpCircle } from "lucide-react";

interface SecurityPanelProps {
  securityScore: number;
  findings: SecurityFinding[];
  compliance: ComplianceCheck[];
}

export default function SecurityPanel({
  securityScore,
  findings,
  compliance,
}: SecurityPanelProps) {
  // Severity styling selectors
  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "text-rose-400 bg-rose-500/5 border-rose-500/20";
      case "medium":
        return "text-amber-400 bg-amber-500/5 border-amber-500/20";
      default:
        return "text-cyan-400 bg-cyan-500/5 border-cyan-500/20";
    }
  };

  const getComplianceStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "compliant":
        return "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
      case "partially compliant":
        return "text-amber-400 border-amber-500/20 bg-amber-500/5";
      default:
        return "text-rose-400 border-rose-500/20 bg-rose-500/5";
    }
  };

  return (
    <div className="flex flex-col gap-4 border border-white/5 rounded-2xl glass-panel p-5 h-full">
      {/* Group Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-200 font-sans">
            DevSecOps Security Audit
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-300 border border-emerald-500/20 px-2 py-0.5 bg-emerald-500/5 rounded-full">
          <span>Score: {securityScore || 85}/100</span>
        </div>
      </div>

      {/* Compliance Section */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono">Compliance Mapping</span>
        <div className="grid grid-cols-2 gap-2">
          {compliance.length === 0 ? (
            <p className="text-[10px] text-gray-500 font-mono italic col-span-2 text-center py-2">
              No compliance checks resolved.
            </p>
          ) : (
            compliance.map((item, idx) => (
              <div key={idx} className={`border p-2.5 rounded-xl flex flex-col ${getComplianceStyle(item.status)}`} title={item.notes}>
                <span className="text-[10px] font-bold font-mono">{item.standard}</span>
                <span className="text-[9px] font-mono mt-0.5 opacity-80">{item.status}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Security Findings List */}
      <div className="flex flex-col gap-2 flex-1 overflow-y-auto max-h-56 pr-1">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono flex items-center gap-1">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" /> Findings & Vulnerabilities ({findings.length})
        </span>
        {findings.length === 0 ? (
          <p className="text-[10px] text-gray-500 font-mono italic">No security vulnerabilities detected.</p>
        ) : (
          findings.map((item, i) => (
            <div key={i} className={`border p-3 rounded-xl flex flex-col gap-1.5 ${getSeverityStyle(item.severity)}`}>
              <div className="flex justify-between items-center text-[9px] font-mono font-bold uppercase tracking-wider">
                <span>Severity: {item.severity}</span>
                <span>Audit Tag</span>
              </div>
              <p className="text-[10px] leading-relaxed font-mono font-sans text-gray-300">{item.description}</p>
              <div className="text-[9px] font-mono opacity-80 border-t border-white/5 pt-1.5 mt-1 text-gray-400">
                <span className="font-bold text-gray-300">Remediation:</span> {item.remediation}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
