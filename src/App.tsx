import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Terminal, Shield, Zap, LayoutPanelLeft, Mic } from "lucide-react";
import { useState } from "react";
import { AdminTerminal } from "./components/AdminTerminal";
import { VoiceAssistant } from "./components/VoiceAssistant";
import { SystemHealth } from "./components/SystemHealth";
import { EntitlementMonitor } from "./components/EntitlementMonitor";
import { LandscapeMonitor } from "./components/LandscapeMonitor";
import { GeoFenceMonitor } from "./components/GeoFenceMonitor";
import { PhaseRingInterface } from "./components/PhaseRingInterface";
import { SessionLogMonitor } from "./components/SessionLogMonitor";
import { cn } from "./utils";

function App() {
  const [showTerminal, setShowTerminal] = useState(false);
  const [showVoice, setShowVoice] = useState(false);

  return (
    <div className="min-h-screen bg-sky-400 bg-gradient-to-b from-sky-400 to-sky-200 text-blue-950 flex flex-col lg:flex-row selection:bg-blue-500/30 overflow-hidden font-sans">
      {/* Side Status Rail (Desktop) */}
      <aside className="hidden lg:flex w-20 flex-col items-center justify-between py-12 border-r border-blue-900/10 bg-white/10 backdrop-blur-xl relative overflow-hidden">
        <div className="flex flex-col items-center space-y-12 relative z-10">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]"
          >
            <Shield className="w-6 h-6 text-white" />
          </motion.div>
          <div className="writing-mode-vertical-rl rotate-180 text-[10px] font-black uppercase tracking-[0.5em] text-blue-900/40">
            System_Protocol_v2.6
          </div>
        </div>
        <div className="flex flex-col items-center space-y-8 relative z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[8px] font-mono text-blue-900/60 uppercase tracking-widest">Active</span>
          </div>
          <div className="w-px h-12 bg-blue-900/10" />
          <div className="text-[10px] font-mono text-blue-900/40">01</div>
        </div>
        
        {/* Subtle Scanning Line in Rail */}
        <motion.div 
          animate={{ y: ['-100%', '1000%'] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-x-0 h-20 bg-gradient-to-b from-transparent via-white/20 to-transparent pointer-events-none"
        />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col overflow-y-auto">
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        
        {/* Header (Mobile & Desktop) */}
        <header className="p-8 lg:p-12 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="lg:hidden w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              <Shield className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-blue-900/60">Administrative_Interface</h2>
              <div className="text-[10px] font-mono text-blue-900/40 uppercase tracking-widest mt-1">Node_01_SG // Triad_Verified // adminq_Linked</div>
            </div>
          </div>
          <div className="hidden sm:flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-1 h-1 rounded-full bg-emerald-600" />
              <span className="text-[9px] font-mono text-blue-900/60 uppercase tracking-widest">Secure_Link_Active</span>
            </div>
            <div className="text-[9px] font-mono text-blue-900/40">2026.03.05_05:42</div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex-1 flex flex-col items-center justify-center px-8 py-12 lg:px-24 relative z-10">
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left: Branding */}
            <div className="lg:col-span-8 space-y-12 text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="inline-flex items-center space-x-4 mb-8">
                  <div className="h-px w-8 bg-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-700">Operational_Intelligence</span>
                </div>
                
                <h1 className="text-8xl sm:text-9xl lg:text-[11rem] font-display font-bold tracking-[-0.04em] leading-[0.85] mb-10 text-blue-950">
                  dbug<span className="text-blue-600">.</span>
                </h1>
                
                <p className="text-blue-900/70 text-xl sm:text-2xl font-light max-w-2xl leading-tight tracking-tight">
                  The definitive administrative interface for <span className="text-blue-950 italic font-medium">modern operations</span>. 
                  Precision engineered. Beautifully executed.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-6"
              >
                <button
                  onClick={() => setShowTerminal(true)}
                  className="group relative overflow-hidden rounded-full bg-blue-600 px-10 py-5 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  <div className="absolute inset-0 bg-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center space-x-4 text-white transition-colors duration-500">
                    <LayoutPanelLeft className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Initialize_Terminal</span>
                  </div>
                </button>

                <button
                  onClick={() => setShowVoice(true)}
                  className="group relative overflow-hidden rounded-full bg-white/20 border border-blue-900/10 px-10 py-5 transition-all active:scale-95 backdrop-blur-md"
                >
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center space-x-4 text-blue-900 group-hover:text-blue-950 transition-colors duration-500">
                    <Mic className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Voice_Briefing</span>
                  </div>
                </button>
              </motion.div>
            </div>

            {/* Right: Technical Specs / Bento */}
            <div className="lg:col-span-4 space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/40 mb-6">System_Specifications</div>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { icon: Zap, label: "Precision", desc: "Triad Verified", color: "text-blue-600" },
                  { icon: Terminal, label: "Core_Link", desc: "v2.6.0209", color: "text-emerald-600" },
                  { icon: Sparkles, label: "Neural", desc: "Design_System", color: "text-indigo-600" }
                ].map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + idx * 0.1 }}
                    className="p-6 rounded-2xl bg-white/20 border border-blue-900/5 backdrop-blur-xl hover:border-blue-900/10 transition-all group flex items-center space-x-6 shadow-sm"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <item.icon className={cn("w-5 h-5", item.color)} />
                    </div>
                    <div>
                      <div className="font-black text-blue-950 text-[10px] uppercase tracking-[0.2em] mb-0.5">{item.label}</div>
                      <div className="text-[9px] text-blue-900/60 font-mono uppercase tracking-widest">{item.desc}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experimental: System Health Monitor */}
        <section className="px-8 lg:px-24 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px w-8 bg-blue-900/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/40">Experimental_Health_Monitor</span>
            </div>
            <div className="bg-white/10 rounded-[2.5rem] p-8 backdrop-blur-md border border-white/20 shadow-xl">
              <SystemHealth />
            </div>
          </div>
        </section>

        {/* Iteration 02: Entitlement Distribution Test */}
        <section className="px-8 lg:px-24 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px w-8 bg-blue-900/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/40">Iteration_02_Entitlement_Test</span>
            </div>
            <div className="bg-white/10 rounded-[2.5rem] p-8 backdrop-blur-md border border-white/20 shadow-xl">
              <EntitlementMonitor />
            </div>
          </div>
        </section>

        {/* Iteration 03: Landscape Rebuild Simulation */}
        <section className="px-8 lg:px-24 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px w-8 bg-blue-900/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/40">Iteration_03_Landscape_Rebuild</span>
            </div>
            <div className="bg-white/10 rounded-[2.5rem] p-8 backdrop-blur-md border border-white/20 shadow-xl">
              <LandscapeMonitor />
            </div>
          </div>
        </section>

        {/* Iteration 04: Geo-Fence Transition Stress Test */}
        <section className="px-8 lg:px-24 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px w-8 bg-blue-900/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/40">Iteration_04_Geo_Fence_Transition</span>
            </div>
            <div className="bg-white/10 rounded-[2.5rem] p-8 backdrop-blur-md border border-white/20 shadow-xl">
              <GeoFenceMonitor />
            </div>
          </div>
        </section>

        {/* Iteration 05: Phase Ring Modulation */}
        <section className="px-8 lg:px-24 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px w-8 bg-blue-900/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/40">Iteration_05_Phase_Ring_Modulation</span>
            </div>
            <div className="bg-white/10 rounded-[2.5rem] p-8 backdrop-blur-md border border-white/20 shadow-xl">
              <PhaseRingInterface />
            </div>
          </div>
        </section>

        {/* Session Log Aggregation */}
        <section className="px-8 lg:px-24 pb-24 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center space-x-4 mb-8">
              <div className="h-px w-8 bg-blue-900/10" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-900/40">Session_Log_Aggregation</span>
            </div>
            <div className="bg-white/10 rounded-[2.5rem] p-8 backdrop-blur-md border border-white/20 shadow-xl">
              <SessionLogMonitor />
            </div>
          </div>
        </section>

        {/* Footer Marquee */}
        <footer className="border-t border-blue-900/5 bg-white/10 backdrop-blur-sm py-4 relative z-10">
          <div className="overflow-hidden">
            <motion.div 
              animate={{ x: [0, -800] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="flex space-x-12 whitespace-nowrap text-[8px] font-mono uppercase tracking-[0.4em] text-blue-900/40"
            >
              <span>[SYS_LOG] Node_01: Active</span>
              <span>[SEC_LINK] Triad: Verified</span>
              <span>[DATA_LINK] Spec v2.6</span>
              <span>[MEM_SYNC] 100%</span>
              <span>[NET_LINK] 12ms</span>
              <span>[SYS_LOG] Node_01: Active</span>
              <span>[SEC_LINK] Triad: Verified</span>
              <span>[DATA_LINK] Spec v2.6</span>
              <span>[MEM_SYNC] 100%</span>
              <span>[NET_LINK] 12ms</span>
            </motion.div>
          </div>
        </footer>
      </main>

      <AnimatePresence>
        {showTerminal && (
          <AdminTerminal onClose={() => setShowTerminal(false)} />
        )}
        {showVoice && (
          <VoiceAssistant onClose={() => setShowVoice(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
