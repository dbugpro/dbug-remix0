import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Shield, Globe, Zap, Cpu } from 'lucide-react';
import { cn } from '../utils';

export const SystemHealth: React.FC = () => {
  const [metrics, setMetrics] = useState({
    neuralLoad: 42,
    syncIntegrity: 99.9,
    geoFenceStatus: 'COMPLIANT',
    triadAlignment: 100,
    latency: 12
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        neuralLoad: Math.floor(Math.random() * 10) + 35,
        latency: Math.floor(Math.random() * 5) + 10,
        syncIntegrity: 99.8 + Math.random() * 0.2
      }));
    }, 3000);

    const handleSpike = () => {
      setMetrics(prev => ({ ...prev, neuralLoad: 85, latency: 45 }));
      setTimeout(() => {
        setMetrics(prev => ({ ...prev, neuralLoad: 42, latency: 12 }));
      }, 2000);
    };

    window.addEventListener('trigger-entitlement-test', handleSpike);
    window.addEventListener('trigger-landscape-rebuild', handleSpike);
    window.addEventListener('trigger-geofence-transition', handleSpike);

    return () => {
      clearInterval(interval);
      window.removeEventListener('trigger-entitlement-test', handleSpike);
      window.removeEventListener('trigger-landscape-rebuild', handleSpike);
      window.removeEventListener('trigger-geofence-transition', handleSpike);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {/* Neural Load */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <Cpu className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Neural_Load</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-display font-bold text-white">{metrics.neuralLoad}%</div>
          <div className="flex space-x-1 mb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div 
                key={i} 
                className={cn(
                  "w-1 h-3 rounded-full",
                  i <= Math.ceil(metrics.neuralLoad / 20) ? "bg-blue-500" : "bg-zinc-800"
                )} 
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Sync Integrity */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Sync_Integrity</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-display font-bold text-white">{metrics.syncIntegrity.toFixed(1)}%</div>
          <div className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest mb-1">Stable</div>
        </div>
      </motion.div>

      {/* Geo-Fence */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Globe className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Geo_Fence</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-display font-bold text-white">SG_01</div>
          <div className="flex items-center space-x-1 mb-1">
            <Shield className="w-3 h-3 text-amber-500" />
            <span className="text-[8px] font-mono text-amber-500 uppercase tracking-widest">Locked</span>
          </div>
        </div>
      </motion.div>

      {/* Latency */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="p-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
            <Zap className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Latency</span>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-display font-bold text-white">{metrics.latency}ms</div>
          <div className="text-[10px] font-mono text-indigo-500 uppercase tracking-widest mb-1">Optimal</div>
        </div>
      </motion.div>
    </div>
  );
};
