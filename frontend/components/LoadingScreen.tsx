"use client";

import React, { useEffect, useState } from "react";
import { Terminal, Shield, Sparkles, Database, Code, Cpu, Lock, CheckCircle2 } from "lucide-react";

export default function LoadingScreen() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { name: "Requirement Understanding", desc: "Parsing specifications & scaling limits...", icon: <Terminal className="w-4 h-4 text-sky-400" /> },
    { name: "Security Analysis", desc: "Injecting KeyVaults, WAF firewalls & subnets...", icon: <Shield className="w-4 h-4 text-emerald-400" /> },
    { name: "Cost Optimization", desc: "Estimating budgets & FinOps service tier boundaries...", icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
    { name: "Architecture Planning", desc: "Building Visual React Flow coordinate topologies...", icon: <Cpu className="w-4 h-4 text-indigo-400" /> },
    { name: "Terraform Synthesis", desc: "Locked. Awaiting Architecture Approval...", icon: <Lock className="w-4 h-4 text-slate-500" />, isLocked: true }
  ];

  // Cycle through step ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 2 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="w-full h-full min-h-[500px] border border-white/5 rounded-2xl bg-[#141d30]/90 backdrop-blur-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Premium blue backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-500/10 blur-[80px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm w-full">
        {/* Spinner */}
        <div className="relative flex items-center justify-center w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)] mb-6">
          <Cpu className="w-6 h-6 text-sky-400 animate-spin" style={{ animationDuration: "6s" }} />
          <div className="absolute inset-0 border-2 border-blue-500/40 border-t-transparent rounded-full animate-spin"></div>
        </div>

        <h3 className="text-base font-bold text-slate-100 font-sans tracking-wide">
          Deploying Architect Orchestrator
        </h3>
        <p className="text-[10px] text-sky-400 font-mono tracking-widest uppercase mt-0.5 mb-6">
          Multi-Agent reasoning loop
        </p>

        {/* Stepper Card */}
        <div className="w-full bg-[#0b0f19]/80 border border-white/5 p-4 rounded-xl text-left flex flex-col gap-3.5 shadow-lg">
          {steps.map((step, idx) => {
            const isCompleted = idx < activeStep || (idx === steps.length - 2 && activeStep === steps.length - 2);
            const isActive = idx === activeStep && idx < steps.length - 1;
            const isLocked = step.isLocked;

            return (
              <div key={idx} className="flex items-start gap-3 transition-opacity duration-300">
                <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${
                  isActive ? "bg-blue-500/20 border-blue-500/30 animate-pulse" : isCompleted ? "bg-emerald-500/15 border-emerald-500/25" : "bg-white/5 border-white/5"
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step.icon}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="flex justify-between items-center leading-none">
                    <span className={`text-[11px] font-mono font-bold ${isActive ? "text-blue-400" : isCompleted ? "text-emerald-400" : isLocked ? "text-slate-500" : "text-slate-300"}`}>
                      {step.name}
                    </span>
                    <span className="text-[8px] font-mono tracking-wider uppercase text-slate-500">
                      {isCompleted ? "Success" : isActive ? "Running" : isLocked ? "Locked" : "Pending"}
                    </span>
                  </div>
                  {isActive && (
                    <span className="text-[9px] text-slate-400 font-mono mt-1 animate-pulse">
                      {step.desc}
                    </span>
                  )}
                  {isLocked && !isCompleted && (
                    <span className="text-[9px] text-slate-500 font-mono mt-1">
                      {step.desc}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
