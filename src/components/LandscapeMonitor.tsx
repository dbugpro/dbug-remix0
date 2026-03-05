import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import { Box, Layers, Cpu, Database, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '../utils';

interface BlueprintFragment {
  id: string;
  type: 'fragment';
  status: 'query_only' | 'injecting' | 'stable';
  load: number;
}

export const LandscapeMonitor: React.FC = () => {
  const [fragments, setFragments] = useState<BlueprintFragment[]>([
    { id: '61', type: 'fragment', status: 'stable', load: 12 },
    { id: '62', type: 'fragment', status: 'stable', load: 8 },
    { id: '63', type: 'fragment', status: 'stable', load: 15 },
    { id: '64', type: 'fragment', status: 'stable', load: 10 },
  ]);
  const [isRebuilding, setIsRebuilding] = useState(false);
  const [rebuildProgress, setRebuildProgress] = useState(0);

  const triggerRebuild = useCallback(() => {
    if (isRebuilding) return;
    setIsRebuilding(true);
    setRebuildProgress(0);

    // Simulate fragment injection
    setFragments(prev => prev.map(f => ({ ...f, status: 'injecting' })));

    const interval = setInterval(() => {
      setRebuildProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setFragments(prevF => prevF.map(f => ({ ...f, status: 'stable' })));
          setIsRebuilding(false);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  }, [isRebuilding]);

  useEffect(() => {
    const handleRemoteTrigger = () => triggerRebuild();
    window.addEventListener('trigger-landscape-rebuild', handleRemoteTrigger);
    return () => window.removeEventListener('trigger-landscape-rebuild', handleRemoteTrigger);
  }, [triggerRebuild]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Landscape Rebuild Simulation</h3>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">UE5.7 Asset Hierarchy Stress Test</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isRebuilding && (
            <div className="flex items-center space-x-2">
              <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${rebuildProgress}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
              <span className="text-[10px] font-mono text-blue-500">{rebuildProgress}%</span>
            </div>
          )}
          <button
            onClick={triggerRebuild}
            disabled={isRebuilding}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
          >
            {isRebuilding ? 'Rebuilding...' : 'Trigger Rebuild'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {fragments.map((fragment) => (
          <motion.div
            key={fragment.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "p-4 rounded-2xl border backdrop-blur-md transition-all duration-500",
              fragment.status === 'injecting' ? "bg-blue-500/5 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]" : "bg-zinc-900/40 border-white/5"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Box className={cn("w-3 h-3", fragment.status === 'injecting' ? "text-blue-400" : "text-zinc-500")} />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Fragment_{fragment.id}</span>
              </div>
              {fragment.status === 'stable' ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              ) : (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-3 h-3 text-blue-400" />
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Status:</span>
                <span className={cn(
                  "text-[8px] font-black uppercase tracking-widest",
                  fragment.status === 'stable' ? "text-emerald-500" : "text-blue-400"
                )}>
                  {fragment.status}
                </span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Neural_Load:</span>
                  <span className="text-[8px] font-mono text-zinc-400">{fragment.load}%</span>
                </div>
                <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${fragment.load}%` }}
                    className="h-full bg-zinc-600"
                  />
                </div>
              </div>
            </div>

            {fragment.status === 'injecting' && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 pt-4 border-t border-blue-500/20 flex items-center space-x-2"
              >
                <AlertCircle className="w-3 h-3 text-blue-400" />
                <span className="text-[8px] font-mono text-blue-400 uppercase tracking-tighter animate-pulse">Query_Only_Mode_Enforced</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3 h-3 text-zinc-600" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Engine: UE5.7_Core</span>
          </div>
          <div className="w-px h-3 bg-zinc-800" />
          <div className="flex items-center space-x-2">
            <Database className="w-3 h-3 text-zinc-600" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Hierarchy: Stable</span>
          </div>
        </div>
        <div className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
          No_Production_Path_Contamination_Detected
        </div>
      </div>
    </div>
  );
};
