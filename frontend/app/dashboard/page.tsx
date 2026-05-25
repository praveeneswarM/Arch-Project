"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import RequirementForm from "../../components/RequirementForm";
import ArchitectureCanvas from "../../components/ArchitectureCanvas";
import TerraformPanel from "../../components/TerraformPanel";
import WarningPanel from "../../components/WarningPanel";
import CostPanel from "../../components/CostPanel";
import SecurityPanel from "../../components/SecurityPanel";
import ArchitectureExplanationPanel from "../../components/ArchitectureExplanationPanel";
import LoadingScreen from "../../components/LoadingScreen";
import ServiceConfigPanel from "../../components/ServiceConfigPanel";
import { useArchitecture } from "../../hooks/useArchitecture";
import { saveProject, listProjects, deleteProject } from "../../lib/api";
import { 
  Terminal, Shield, DollarSign, BookOpen, Layers, Settings, FileCode, Lock, Cpu, LogOut, Save, FolderOpen, Trash2, CheckCircle2,
  Globe, Server, Database, HardDrive, Key, Activity, Cloud, MessageSquare, BrainCircuit, Plus
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  // Projects state
  const [projectName, setProjectName] = useState("Production Stack");
  const [savedProjects, setSavedProjects] = useState<any[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Active Clicked Node for Config Drawer
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  const {
    loading,
    tfLoading,
    error,
    architecture,
    terraform,
    isApproved,
    triggerGenerate,
    approveArchitecture,
    regenerateArchitecture,
    updateLocalTopology,
    undo,
    redo,
    triggerAiAssist,
  } = useArchitecture();

  const [activeRightTab, setActiveRightTab] = useState<"terraform" | "cost" | "security" | "reasoning" | "warnings">("reasoning");

  // 1. Session token validation
  useEffect(() => {
    const token = localStorage.getItem("archgen_auth_token");
    const user = localStorage.getItem("archgen_username");
    if (!token) {
      router.push("/login");
    } else {
      setAuthToken(token);
      setUsername(user || "User");
      loadSavedProjects(token);
    }
  }, [router]);

  // 2. Load projects
  const loadSavedProjects = async (token: string) => {
    try {
      const projects = await listProjects(token);
      setSavedProjects(projects);
    } catch (err) {
      console.error("Failed to load projects", err);
    }
  };

  // 3. Save Project
  const handleSaveProject = async () => {
    if (!architecture || !authToken) return;
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const payload = {
        id: activeProjectId || undefined,
        name: projectName,
        nodes: architecture.nodes,
        edges: architecture.edges,
        services: architecture.services,
        cloud_provider: architecture.cloud_provider,
        cost_estimate: architecture.cost_estimate
      };

      const result = await saveProject(payload, authToken);
      setSaveSuccess(true);
      if (result.id) {
        setActiveProjectId(result.id);
      }
      loadSavedProjects(authToken);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err: any) {
      setSaveError(err.message || "Failed to save project");
    }
  };

  // 4. Open project file
  const handleOpenProject = (proj: any) => {
    setActiveProjectId(proj.id);
    setProjectName(proj.name);
    setSelectedNode(null);
    
    // Inject coordinates and restore approved HCL compiles
    updateLocalTopology(proj.nodes, proj.edges, proj.services);
    approveArchitecture();
  };

  // 5. Delete project
  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!authToken) return;
    try {
      await deleteProject(projectId, authToken);
      if (activeProjectId === projectId) {
        regenerateArchitecture();
        setActiveProjectId(null);
      }
      loadSavedProjects(authToken);
    } catch (err) {
      console.error("Delete project failure:", err);
    }
  };

  // 6. Session Logout
  const handleLogout = () => {
    localStorage.removeItem("archgen_auth_token");
    localStorage.removeItem("archgen_username");
    router.push("/login");
  };

  // HTML5 Draggable Palette Sidebar helper
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow-type", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  // Configuration Node updates handler
  const handleUpdateNode = useCallback((nodeId: string, updatedData: any) => {
    if (!architecture) return;
    const nextNodes = architecture.nodes.map((node) => {
      if (node.id === nodeId) {
        return {
          ...node,
          data: {
            ...node.data,
            ...updatedData
          }
        };
      }
      return node;
    });
    updateLocalTopology(nextNodes, architecture.edges, architecture.services);
    setSelectedNode(null); // Close panel after updates
  }, [architecture, updateLocalTopology]);

  const isTabLocked = (tabName: string) => {
    if (tabName === "reasoning") return false;
    return !isApproved;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#09090b] text-[#cbd5e1] font-sans">
      
      {/* SaaS Studio Header */}
      <header className="h-16 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between px-6 z-20 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white border border-[#27272a] rounded-lg shadow-md flex items-center justify-center">
            <Cpu className="w-5 h-5 text-black animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm text-slate-100 tracking-wide">ArchGen AI</span>
            <span className="text-[8px] text-slate-500 font-mono tracking-widest uppercase mt-0.5">SaaS Cloud Architect Studio</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] uppercase font-mono text-slate-400">Account:</span>
            <span className="text-xs font-mono font-bold text-white bg-white/5 px-2.5 py-1 border border-[#27272a] rounded-lg">
              @{username}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 hover:bg-white/5 border border-transparent px-3 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-white transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main SaaS Workspace grid layout */}
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-12 p-4 gap-4 overflow-hidden h-[calc(100vh-4rem)]">
        
        {/* ==========================================
            COLUMN 1: Drag-and-Drop Cloud Palette (2 of 12)
           ========================================== */}
        <section className="col-span-1 lg:col-span-2 flex flex-col h-full bg-[#18181b] border border-[#27272a] rounded-2xl p-4 overflow-y-auto shadow-lg select-none">
          <span className="text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-4 border-b border-white/5 pb-2">
            <FolderOpen className="w-3.5 h-3.5 text-sky-400" /> Cloud Palette
          </span>

          <div className="flex flex-col gap-2.5">
            {/* Gateway */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "GatewayNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <Globe className="w-4 h-4 text-cyan-400 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">Gateway</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_app_gateway</span>
              </div>
            </div>

            {/* Frontend */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "FrontendNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <Server className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">Frontend</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_static_web</span>
              </div>
            </div>

            {/* Backend */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "BackendNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">Backend</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_container_app</span>
              </div>
            </div>

            {/* Database */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "DatabaseNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <Database className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">Database</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_postgresql</span>
              </div>
            </div>

            {/* Cache */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "CacheNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <HardDrive className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">Cache</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_redis_cache</span>
              </div>
            </div>

            {/* Storage */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "StorageNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <Cloud className="w-4 h-4 text-rose-400 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">Storage</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_storage_blob</span>
              </div>
            </div>

            {/* KeyVault */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "SecurityNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <Key className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">KeyVault</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_key_vault</span>
              </div>
            </div>

            {/* Monitor */}
            <div 
              draggable 
              onDragStart={(e) => onDragStart(e, "MonitoringNode")}
              className="flex items-center gap-2.5 p-2 bg-[#09090b] border border-[#27272a] hover:border-slate-500 rounded-lg cursor-grab text-[10px] font-mono text-slate-300 transition-all active:scale-95"
            >
              <Activity className="w-4 h-4 text-slate-300 shrink-0" />
              <div className="flex flex-col truncate">
                <span className="font-bold">Monitor</span>
                <span className="text-[7px] text-slate-500 leading-none">azurerm_log_analytics</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==========================================
            COLUMN 2: Config Input & Saved Repos (2 of 12)
           ========================================== */}
        <section className="col-span-1 lg:col-span-2 flex flex-col h-full bg-[#18181b] border border-[#27272a] rounded-2xl p-4 overflow-y-auto shadow-lg gap-6">
          <RequirementForm onSubmit={triggerGenerate} isLoading={loading} />

          {/* SaaS Saves */}
          {architecture && (
            <div className="border-t border-[#27272a] pt-4 flex flex-col gap-3">
              <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Save className="w-3.5 h-3.5 text-indigo-400" /> Save Project
              </span>
              
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="bg-[#09090b] border border-[#27272a] px-3 py-2 rounded-lg text-xs focus:outline-none focus:border-slate-500 text-slate-200 font-mono"
              />

              <button
                onClick={handleSaveProject}
                className="w-full py-2 bg-white hover:bg-slate-100 text-black font-semibold text-[10px] font-mono uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" /> Save Topology
              </button>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg justify-center animate-bounce">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Project Saved!</span>
                </div>
              )}
            </div>
          )}

          {/* Repos list */}
          <div className="border-t border-[#27272a] pt-4 flex flex-col gap-2">
            <span className="text-[9px] font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
              <FolderOpen className="w-3.5 h-3.5 text-sky-400" /> Stored stacks ({savedProjects.length})
            </span>

            <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
              {savedProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpenProject(proj)}
                  className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer hover:bg-white/[0.02] ${
                    activeProjectId === proj.id ? "bg-white/5 border-slate-500" : "bg-[#09090b] border-[#27272a]"
                  }`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-bold text-slate-200 truncate font-mono">{proj.name}</span>
                    <span className="text-[8px] text-slate-500 font-mono mt-0.5 uppercase truncate">
                      {proj.cloud_provider} • ${proj.cost_estimate}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(proj.id, e)}
                    className="p-1 hover:bg-rose-500/10 border border-transparent rounded hover:border-rose-500/20 text-slate-500 hover:text-rose-400 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==========================================
            COLUMN 3: React Flow Visual Studio Canvas (5 of 12)
           ========================================== */}
        <section className="col-span-1 lg:col-span-5 flex flex-col h-full min-h-[450px] lg:min-h-0 relative">
          {loading ? (
            <LoadingScreen />
          ) : architecture ? (
            <ArchitectureCanvas
              initialNodes={architecture.nodes}
              initialEdges={architecture.edges}
              onTopologyChange={updateLocalTopology}
              isApproved={isApproved}
              onApprove={approveArchitecture}
              onRegenerate={regenerateArchitecture}
              undo={undo}
              redo={redo}
              triggerAiAssist={triggerAiAssist}
              onSelectNode={setSelectedNode}
            />
          ) : (
            // Visual Empty State UX
            <div className="w-full h-full border border-[#27272a] rounded-2xl bg-[#18181b] flex flex-col items-center justify-center text-center p-8 relative overflow-hidden shadow-lg">
              <div className="absolute inset-0 bg-cyber-grid bg-cyber-grid-size opacity-10 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-slate-500/5 blur-[90px] pointer-events-none"></div>

              <div className="relative z-10 max-w-sm">
                <div className="w-14 h-14 bg-gradient-to-tr from-slate-200 to-white border border-[#27272a] rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-5">
                  <Cpu className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-base font-bold text-slate-100 tracking-wide font-sans">
                  Autonomous Studio Workspace
                </h3>
                <p className="text-[9px] text-slate-400 font-mono tracking-widest uppercase mt-1 mb-4">
                  Define to provision
                </p>
                <p className="text-xs text-slate-400 leading-normal font-sans mb-6">
                  Describe your application specifications on the left pane to generate an intelligent visual cloud architecture.
                </p>
                <button
                  onClick={regenerateArchitecture}
                  className="bg-white hover:bg-slate-100 text-black text-xs font-mono font-bold px-4 py-2 rounded-lg transition-all shadow active:scale-95 flex items-center gap-1 mx-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-black" />
                  <span>Start Manual Canvas</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ==========================================
            COLUMN 4: Dynamic Service Configurations or Analytics Drawer (3 of 12)
           ========================================== */}
        <section className="col-span-1 lg:col-span-3 flex flex-col h-full overflow-hidden bg-[#18181b] border border-[#27272a] rounded-2xl p-4 shadow-lg relative">
          
          {selectedNode ? (
            // Display Service Config Panel when a node is clicked!
            <ServiceConfigPanel
              node={selectedNode}
              onUpdateNode={handleUpdateNode}
              onClose={() => setSelectedNode(null)}
            />
          ) : (
            // Otherwise display standard tab layouts
            <>
              {/* Tab navigation headers */}
              <div className="flex bg-[#09090b] border border-white/5 rounded-xl p-1 gap-0.5 mb-3 overflow-x-auto shrink-0 select-none">
                <button
                  onClick={() => setActiveRightTab("reasoning")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                    activeRightTab === "reasoning" ? "bg-white/5 text-white border border-white/10" : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <BookOpen className="w-3 h-3" /> Reasoning
                </button>
                <button
                  onClick={() => setActiveRightTab("terraform")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                    activeRightTab === "terraform" ? "bg-white/5 text-white border border-white/10" : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <FileCode className="w-3 h-3" /> HCL
                </button>
                <button
                  onClick={() => setActiveRightTab("cost")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                    activeRightTab === "cost" ? "bg-white/5 text-white border border-white/10" : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <DollarSign className="w-3 h-3" /> FinOps
                </button>
                <button
                  onClick={() => setActiveRightTab("security")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                    activeRightTab === "security" ? "bg-white/5 text-white border border-white/10" : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <Shield className="w-3 h-3" /> Security
                </button>
                <button
                  onClick={() => setActiveRightTab("warnings")}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-[9px] font-mono font-bold flex items-center justify-center gap-1 transition-all ${
                    activeRightTab === "warnings" ? "bg-white/5 text-white border border-white/10" : "text-slate-400 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <Layers className="w-3 h-3" /> Auditor
                </button>
              </div>

              {/* Panel tab content mapping */}
              <div className="flex-1 overflow-hidden relative">
                <div className={`h-full ${isTabLocked(activeRightTab) ? "blur-[3px] select-none pointer-events-none" : ""}`}>
                  {activeRightTab === "reasoning" && (
                    <ArchitectureExplanationPanel
                      explanation={architecture?.explanation ?? ""}
                      alternativesConsidered={architecture?.alternatives_considered ?? ""}
                      justificationForChoices={architecture?.justification_for_choices ?? ""}
                    />
                  )}
                  {activeRightTab === "terraform" && (
                    <TerraformPanel terraform={terraform} isLoading={tfLoading} />
                  )}
                  {activeRightTab === "cost" && (
                    <CostPanel
                      costEstimate={architecture?.cost_estimate ?? 0.0}
                      costBreakdown={architecture?.cost_breakdown ?? []}
                      recommendations={architecture?.optimization_recommendations ?? []}
                      costScore={85}
                    />
                  )}
                  {activeRightTab === "security" && (
                    <SecurityPanel
                      securityScore={architecture?.security_score ?? 0}
                      findings={architecture?.security_findings ?? []}
                      compliance={architecture?.compliance_checks ?? []}
                    />
                  )}
                  {activeRightTab === "warnings" && (
                    <WarningPanel
                      warnings={architecture?.warnings ?? []}
                      complexityScore={architecture?.complexity_score ?? 0}
                      operationalOverheadScore={architecture?.operational_overhead_score ?? 0}
                      overengineered={architecture?.overengineered ?? false}
                    />
                  )}
                </div>

                {/* Approval lock overlay */}
                {isTabLocked(activeRightTab) && (
                  <div className="absolute inset-0 bg-[#18181b]/70 flex flex-col items-center justify-center text-center p-6 z-10 backdrop-blur-[2px] select-none">
                    <div className="w-10 h-10 bg-[#09090b] border border-[#27272a] rounded-full flex items-center justify-center mb-3">
                      <Lock className="w-4 h-4 text-indigo-400" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-100 font-sans tracking-wide">
                      HCL Synthesis Locked
                    </span>
                    <p className="text-[9px] text-slate-400 leading-normal font-sans mt-1 max-w-[200px]">
                      Review the visual diagram layout and click **Approve Architecture** in the canvas header to compile Terraform HCL and run scans.
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

        </section>
      </main>
    </div>
  );
}
