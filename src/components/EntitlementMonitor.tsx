import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, Database, Server, UserCheck, AlertTriangle } from 'lucide-react';
import { cn } from '../utils';

interface EntitlementPayload {
  id: string;
  origin: 'adminx';
  target: 'adming';
  timestamp: string;
  content: string;
  integrity_hash: string;
  status: 'pending' | 'propagating' | 'validated' | 'failed';
  current_hop: 'adminx' | 'adminq' | 'adming';
}

export const EntitlementMonitor: React.FC = () => {
  const [payloads, setPayloads] = useState<EntitlementPayload[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const startSimulation = useCallback((customId?: string) => {
    if (isSimulating) return;
    setIsSimulating(true);
    
    const newPayload: EntitlementPayload = {
      id: customId || `ENT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      origin: 'adminx',
      target: 'adming',
      timestamp: new Date().toISOString(),
      content: 'ENTITLEMENT_GRANT_V260305',
      integrity_hash: 'sha256:8f3e...2a1b',
      status: 'pending',
      current_hop: 'adminx'
    };

    setPayloads(prev => [newPayload, ...prev].slice(0, 5));

    // Simulate propagation adminx -> adminq
    setTimeout(() => {
      setPayloads(prev => prev.map(p => 
        p.id === newPayload.id ? { ...p, status: 'propagating', current_hop: 'adminq' } : p
      ));
    }, 2000);

    // Simulate validation adminq -> adming
    setTimeout(() => {
      setPayloads(prev => prev.map(p => 
        p.id === newPayload.id ? { ...p, status: 'validated', current_hop: 'adming' } : p
      ));
      setIsSimulating(false);
    }, 4000);
  }, [isSimulating]);

  useEffect(() => {
    const handleRemoteTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ id?: string }>;
      startSimulation(customEvent.detail?.id);
    };
    window.addEventListener('trigger-entitlement-test', handleRemoteTrigger as EventListener);
    return () => window.removeEventListener('trigger-entitlement-test', handleRemoteTrigger as EventListener);
  }, [startSimulation]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Entitlement Distribution</h3>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Cross-Instance Validation</p>
          </div>
        </div>
        <button
          onClick={() => startSimulation()}
          disabled={isSimulating}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20"
        >
          {isSimulating ? 'Simulating...' : 'Trigger Test'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {payloads.map((payload) => (
            <motion.div
              key={payload.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden group"
            >
              {/* Progress Bar Background */}
              <div className="absolute bottom-0 left-0 h-1 bg-zinc-800 w-full" />
              <motion.div 
                initial={{ width: '0%' }}
                animate={{ 
                  width: payload.status === 'validated' ? '100%' : 
                         payload.status === 'propagating' ? '66%' : '33%' 
                }}
                className={cn(
                  "absolute bottom-0 left-0 h-1 transition-all duration-1000",
                  payload.status === 'validated' ? "bg-emerald-500" : "bg-blue-500"
                )}
              />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Payload_ID:</span>
                    <span className="text-xs font-black text-white">{payload.id}</span>
                  </div>
                  <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
                    {payload.timestamp}
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-4 sm:space-x-8">
                  {/* adminx */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                      payload.current_hop === 'adminx' ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                    )}>
                      <Server className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter">adminx</span>
                  </div>

                  <ArrowRight className="w-3 h-3 text-zinc-700" />

                  {/* adminq */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                      payload.current_hop === 'adminq' ? "bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                    )}>
                      <Database className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter">adminq</span>
                  </div>

                  <ArrowRight className="w-3 h-3 text-zinc-700" />

                  {/* adming */}
                  <div className="flex flex-col items-center space-y-2">
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center border transition-all",
                      payload.current_hop === 'adming' ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.3)]" : "bg-zinc-800 border-zinc-700 text-zinc-500"
                    )}>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-tighter">adming</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    payload.status === 'validated' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                    payload.status === 'propagating' ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
                    "bg-zinc-800 text-zinc-500 border-zinc-700"
                  )}>
                    {payload.status}
                  </div>
                  <div className="text-[8px] font-mono text-zinc-700 mt-1 uppercase tracking-tighter">
                    {payload.integrity_hash}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {payloads.length === 0 && (
            <div className="p-12 rounded-3xl border border-dashed border-zinc-800 flex flex-col items-center justify-center text-center space-y-4">
              <AlertTriangle className="w-8 h-8 text-zinc-700" />
              <div className="space-y-1">
                <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No Active Tests</div>
                <p className="text-[10px] text-zinc-700 font-mono uppercase tracking-widest">Trigger a cross-instance entitlement test to begin</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
