import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Shield, ShieldCheck, ShieldAlert, MapPin, Navigation, RefreshCw } from 'lucide-react';
import { cn } from '../utils';

interface ComplianceCheck {
  id: string;
  timestamp: string;
  target: string;
  status: 'passed' | 'failed';
  details: string;
}

export const GeoFenceMonitor: React.FC = () => {
  const [location, setLocation] = useState('Singapore');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([
    { id: '4', timestamp: '07:11:05', target: 'Geo_Transition_Singapore', status: 'passed', details: 'Compliance verified for Singapore' },
    { id: '1', timestamp: '06:49:12', target: 'Asset_Origin_Scan', status: 'passed', details: '0 CN-dependencies detected' },
    { id: '2', timestamp: '06:49:15', target: 'API_Endpoint_Audit', status: 'passed', details: 'Worldwide endpoints active' },
    { id: '3', timestamp: '06:49:20', target: 'Identity_Integrity', status: 'passed', details: 'trailing_period_enforced' },
  ]);

  const triggerTransition = useCallback((newLocation: string = 'Singapore') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // Simulate transition
    setTimeout(() => {
      setLocation(newLocation);
      const newCheck: ComplianceCheck = {
        id: Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        target: `Geo_Transition_${newLocation}`,
        status: 'passed',
        details: `Compliance verified for ${newLocation}`
      };
      setComplianceChecks(prev => [newCheck, ...prev.slice(0, 4)]);
      setIsTransitioning(false);
    }, 3000);
  }, [isTransitioning]);

  useEffect(() => {
    const handleRemoteTrigger = (e: Event) => {
      const customEvent = e as CustomEvent;
      triggerTransition(customEvent.detail?.location);
    };
    window.addEventListener('trigger-geofence-transition', handleRemoteTrigger);
    return () => window.removeEventListener('trigger-geofence-transition', handleRemoteTrigger);
  }, [triggerTransition]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <Globe className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Geo-Fence Transition Stress Test</h3>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Zero_China_Dependencies Enforcement</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className={cn(
            "px-3 py-1 rounded-full border flex items-center space-x-2 transition-all duration-500",
            isTransitioning ? "bg-amber-500/10 border-amber-500/30" : "bg-emerald-500/10 border-emerald-500/30"
          )}>
            {isTransitioning ? (
              <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
            ) : (
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
            )}
            <span className={cn(
              "text-[10px] font-black uppercase tracking-widest",
              isTransitioning ? "text-amber-500" : "text-emerald-500"
            )}>
              {isTransitioning ? 'Transitioning...' : 'Compliant'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Location Card */}
        <div className="lg:col-span-1 p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Navigation className="w-32 h-32 text-white" />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center space-x-2 text-zinc-500">
              <MapPin className="w-3 h-3" />
              <span className="text-[10px] font-mono uppercase tracking-widest">Active_Node</span>
            </div>
            <div className="space-y-1">
              <motion.div 
                key={location}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-4xl font-display font-bold text-white"
              >
                {location}
              </motion.div>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Worldwide_Distribution_Node</p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="flex items-center justify-between text-[8px] font-mono text-zinc-600 uppercase tracking-widest">
                <span>Constraint:</span>
                <span className="text-emerald-500">Zero_CN_Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Log */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Compliance_Audit_Log</span>
            <div className="h-px flex-1 mx-4 bg-zinc-800" />
            <Shield className="w-3 h-3 text-zinc-600" />
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {complianceChecks.map((check) => (
                <motion.div
                  key={check.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      check.status === 'passed' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                    )} />
                    <div>
                      <div className="text-[10px] font-black text-white uppercase tracking-tighter">{check.target}</div>
                      <div className="text-[8px] font-mono text-zinc-500">{check.details}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[8px] font-mono text-zinc-600">{check.timestamp}</div>
                    <div className={cn(
                      "text-[8px] font-black uppercase tracking-widest",
                      check.status === 'passed' ? "text-emerald-500" : "text-red-500"
                    )}>
                      {check.status}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-3 h-3 text-zinc-600" />
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Constraint: zero_china_dependencies</span>
          </div>
          <div className="w-px h-3 bg-zinc-800" />
          <div className="flex items-center space-x-2">
            <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Status: Mandatory</span>
          </div>
        </div>
        <div className="text-[8px] font-mono text-zinc-700 uppercase tracking-widest">
          Worldwide_Compliance_Verified_Post_2026-02-28
        </div>
      </div>
    </div>
  );
};
