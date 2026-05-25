"use client";

import React from "react";
import Link from "next/link";
import { Cpu, ArrowRight, ShieldCheck, Terminal, DollarSign, Layers, BookOpen, ChevronRight, Activity, Code } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div className="bg-[#09090b] text-[#cbd5e1] min-h-screen flex flex-col font-sans relative overflow-hidden">
      
      {/* 1. Subtle global background glow overlays */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-slate-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-blue-500/[0.02] blur-[120px] pointer-events-none"></div>

      {/* 2. Header / Navigation */}
      <header className="h-16 border-b border-[#27272a] bg-[#09090b]/80 backdrop-blur-md sticky top-0 flex items-center justify-between px-6 lg:px-12 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white border border-[#27272a] rounded-lg shadow flex items-center justify-center">
            <Cpu className="w-5 h-5 text-black" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-slate-100 tracking-wide">ArchGen AI</span>
            <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">SaaS Cloud Architect</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/login" className="text-xs font-mono text-slate-400 hover:text-white transition-colors">
            Login
          </Link>
          <Link
            href="/register"
            className="bg-white hover:bg-slate-100 text-black text-xs font-mono font-bold px-4 py-2 rounded-lg transition-all shadow active:scale-95"
          >
            Launch Studio
          </Link>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="px-6 py-20 lg:py-28 max-w-5xl mx-auto text-center relative z-20">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-[#27272a] rounded-full text-[10px] font-mono text-slate-300 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Production-Grade SaaS Engine Active</span>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-tight max-w-4xl"
          >
            Autonomously Design Secure, Scalable Cloud Architectures
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={itemVariants}
            className="text-sm sm:text-base text-slate-400 max-w-2xl mt-6 leading-relaxed font-sans"
          >
            ArchGen AI is a professional cloud architecture studio. Provide your application parameters to generate detailed Azure topologies and export production-ready multi-file Terraform code automatically.
          </motion.p>

          {/* CTAs */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center items-center gap-4 mt-8"
          >
            <Link
              href="/register"
              className="bg-white hover:bg-slate-100 text-black text-xs font-mono font-bold px-6 py-3 rounded-lg flex items-center gap-1.5 transition-all shadow-lg active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="bg-white/5 hover:bg-white/10 border border-[#27272a] text-slate-300 text-xs font-mono px-6 py-3 rounded-lg transition-all"
            >
              Access Dashboard
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* 4. AI WORKFLOW STEPPER SECTION */}
      <section className="py-16 border-t border-b border-[#27272a] bg-[#18181b]/30 relative z-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-center text-lg font-bold text-slate-200 font-sans tracking-wide mb-12">
            The Autonomous Multi-Agent Design Pipeline
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            
            {/* Step 1 */}
            <div className="bg-[#18181b] border border-[#27272a] p-5 rounded-xl flex flex-col justify-between h-40 shadow">
              <div className="flex items-center justify-between text-slate-400">
                <Terminal className="w-5 h-5 text-sky-400" />
                <span className="text-[10px] font-mono font-bold">01</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-200 font-sans">Understanding</span>
                <p className="text-[10px] text-slate-400 leading-normal font-mono mt-1">
                  AI reads descriptions, inferring traffic & constraints.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-[#18181b] border border-[#27272a] p-5 rounded-xl flex flex-col justify-between h-40 shadow">
              <div className="flex items-center justify-between text-slate-400">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span className="text-[10px] font-mono font-bold">02</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-200 font-sans">Reasoning</span>
                <p className="text-[10px] text-slate-400 leading-normal font-mono mt-1">
                  AI decides cache, CDN, compute model, and relational DBs.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-[#18181b] border border-[#27272a] p-5 rounded-xl flex flex-col justify-between h-40 shadow">
              <div className="flex items-center justify-between text-slate-400">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span className="text-[10px] font-mono font-bold">03</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-200 font-sans">SecOps Audit</span>
                <p className="text-[10px] text-slate-400 leading-normal font-mono mt-1">
                  Vaults, private subnets, and WAF protection are injected.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-[#18181b] border border-[#27272a] p-5 rounded-xl flex flex-col justify-between h-40 shadow">
              <div className="flex items-center justify-between text-slate-400">
                <Layers className="w-5 h-5 text-amber-400" />
                <span className="text-[10px] font-mono font-bold">04</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-200 font-sans">Visual Diagram</span>
                <p className="text-[10px] text-slate-400 leading-normal font-mono mt-1">
                  Interactive React Flow graph is rendered for manual editing.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-[#18181b] border border-[#27272a] p-5 rounded-xl flex flex-col justify-between h-40 shadow">
              <div className="flex items-center justify-between text-slate-400">
                <Code className="w-5 h-5 text-indigo-400" />
                <span className="text-[10px] font-mono font-bold">05</span>
              </div>
              <div className="mt-4">
                <span className="text-xs font-bold text-slate-200 font-sans">Terraform</span>
                <p className="text-[10px] text-slate-400 leading-normal font-mono mt-1">
                  Once approved, modular production-grade HCL is compiled.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. METRIC FEATURE LIST */}
      <section className="px-6 py-20 max-w-5xl mx-auto z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 font-sans">Enterprise-Ready Workspace</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Save architectures in MongoDB databases, load saved diagrams, and maintain project version controls.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 font-sans">FinOps Billing Estimates</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Retrieve real-time cost estimations for your cloud components. Recalculates dynamically during topology edits.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center mb-2">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-200 font-sans">AI Decision Reasoning</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Understand why services were chosen. Shows clear architectural justifications and alternative models.
            </p>
          </div>

        </div>
      </section>

      {/* 6. Footer */}
      <footer className="mt-auto border-t border-[#27272a] bg-[#09090b] py-8 text-center text-xs text-slate-500 font-mono">
        <p>© 2026 ArchGen AI SaaS Architect. Enterprise-Grade Cloud Architecture Center.</p>
      </footer>

    </div>
  );
}
