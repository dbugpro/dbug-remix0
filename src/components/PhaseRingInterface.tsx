import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Target, Zap, Layers, Activity } from 'lucide-react';
import { cn } from '../utils';

interface Phase {
  id: string;
  name: string;
  status: 'active' | 'standby' | 'locked';
  load: number;
  frequency: string;
}

export const PhaseRingInterface: React.FC = () => {
  const [activePhase, setActivePhase] = useState<string>('PH-01');
  const [rotation, setRotation] = useState(0);
  const [phases, setPhases] = useState<Phase[]>([
    { id: 'PH-01', name: 'Neural_Core', status: 'active', load: 42, frequency: '440Hz' },
    { id: 'PH-02', name: 'Sync_Array', status: 'standby', load: 12, frequency: '528Hz' },
    { id: 'PH-03', name: 'Geo_Bridge', status: 'locked', load: 0, frequency: 'N/A' },
    { id: 'PH-04', name: 'Data_Stream', status: 'active', load: 88, frequency: '832Hz' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
      setPhases(prev => prev.map(p => ({
        ...p,
        load: p.status === 'active' ? Math.max(0, Math.min(100, p.load + (Math.random() * 4 - 2))) : p.load
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const currentPhase = phases.find(p => p.id === activePhase) || phases[0];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Radio className="w-4 h-4 text-indigo-500" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Phase Ring Interface</h3>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Multi-Dimensional Frequency Modulation</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
          <span className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest">Link_Established</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Interactive Rings */}
        <div className="lg:col-span-7 flex justify-center items-center py-12 relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full" />
          
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Ring */}
            <motion.div 
              style={{ rotate: rotation }}
              className="absolute inset-0 border border-dashed border-zinc-800 rounded-full" 
            />
            
            {/* Middle Ring */}
            <motion.div 
              style={{ rotate: -rotation * 1.5 }}
              className="absolute inset-8 border border-zinc-800 rounded-full flex items-center justify-center"
            >
              <div className="absolute inset-0 border-t-2 border-indigo-500/30 rounded-full" />
            </motion.div>

            {/* Inner Ring */}
            <motion.div 
              style={{ rotate: rotation * 2 }}
              className="absolute inset-16 border border-dashed border-indigo-500/20 rounded-full"
            />

            {/* Core */}
            <div className="relative z-10 w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              <div className="absolute inset-0 bg-indigo-500/5 animate-pulse rounded-full" />
              <Target className="w-8 h-8 text-indigo-500" />
              
              {/* Orbital Indicators */}
              {phases.map((phase, idx) => (
                <motion.div
                  key={phase.id}
                  animate={{ 
                    rotate: rotation + (idx * 90),
                    scale: activePhase === phase.id ? 1.2 : 1
                  }}
                  className="absolute inset-[-40px] pointer-events-none"
                >
                  <div 
                    className={cn(
                      "absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-zinc-900 shadow-lg pointer-events-auto cursor-pointer transition-all",
                      activePhase === phase.id ? "bg-indigo-500 scale-125" : "bg-zinc-700 hover:bg-zinc-500"
                    )}
                    onClick={() => setActivePhase(phase.id)}
                  />
                </motion.div>
              ))}
            </div>

            {/* Scanning Line */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-1/2 bg-gradient-to-t from-indigo-500/50 to-transparent" />
            </motion.div>
          </div>
        </div>

        {/* Right: Phase Details */}
        <div className="lg:col-span-5 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all relative overflow-hidden group",
                  activePhase === phase.id 
                    ? "bg-indigo-500/10 border-indigo-500/30" 
                    : "bg-zinc-900/40 border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">{phase.id}</span>
                  <div className={cn(
                    "w-1 h-1 rounded-full",
                    phase.status === 'active' ? "bg-indigo-500" : phase.status === 'standby' ? "bg-zinc-500" : "bg-red-500"
                  )} />
                </div>
                <div className="text-[10px] font-black text-white uppercase tracking-widest">{phase.name}</div>
                
                {activePhase === phase.id && (
                  <motion.div 
                    layoutId="phase-active-indicator"
                    className="absolute bottom-0 left-0 h-0.5 bg-indigo-500"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                  />
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Active_Phase_Readout</div>
                  <div className="text-2xl font-display font-bold text-white">{currentPhase.name}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Frequency</div>
                  <div className="text-xl font-display font-bold text-indigo-400">{currentPhase.frequency}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                    <span>Phase_Load_Intensity</span>
                    <span>{currentPhase.load.toFixed(1)}%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentPhase.load}%` }}
                      className="h-full bg-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-zinc-600" />
                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Stability</span>
                    </div>
                    <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Nominal_0.99</div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Layers className="w-3 h-3 text-zinc-600" />
                      <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Layers</span>
                      </div>
                    <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest">Triad_Enforced</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 flex items-center space-x-4">
            <Activity className="w-4 h-4 text-indigo-500" />
            <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">
              Phase ring modulation is currently <span className="text-indigo-400">Synchronized</span> with the neural core. Manual override is disabled by protocol v2.6.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
