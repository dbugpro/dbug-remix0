import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Database, Activity, CheckCircle2, AlertCircle, Terminal } from 'lucide-react';
import { cn } from '../utils';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  module: string;
  message: string;
}

export const SessionLogMonitor: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', timestamp: '07:11:01', type: 'success', module: 'adminq', message: 'geo_fence_transition directive signed' },
    { id: '2', timestamp: '07:11:02', type: 'info', module: 'GeoFenceMonitor', message: 'Node transition visualization active: England -> Singapore' },
    { id: '3', timestamp: '07:11:04', type: 'success', module: 'ConstraintAudit', message: 'zero_china_dependencies: 0 CN-dependencies detected' },
    { id: '4', timestamp: '07:11:05', type: 'success', module: 'IdentityCheck', message: 'trailing_period_enforced: dbug. preserved' },
    { id: '5', timestamp: '07:11:06', type: 'info', module: 'SystemHealth', message: 'Neural Load spike stabilized at 33%' },
  ]);

  const [isAggregating, setIsAggregating] = useState(false);

  const startAggregation = () => {
    setIsAggregating(true);
    setTimeout(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).substr(2, 4),
        timestamp: new Date().toLocaleTimeString('en-GB', { hour12: false }),
        type: 'success',
        module: 'LogAggregation',
        message: 'session_log aggregation complete for DBUG 260305 (1)'
      };
      setLogs(prev => [newLog, ...prev]);
      setIsAggregating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <FileText className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-white">Session Log Aggregation</h3>
            <p className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest">Continuity Handoff Protocol</p>
          </div>
        </div>
        <button
          onClick={startAggregation}
          disabled={isAggregating}
          className={cn(
            "px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center space-x-2",
            isAggregating 
              ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          )}
        >
          {isAggregating ? (
            <>
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Aggregating...</span>
            </>
          ) : (
            <>
              <Database className="w-3 h-3" />
              <span>Initiate Aggregation</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { label: 'Session ID', value: 'DBUG 260305 (1)', icon: Terminal },
            { label: 'Log Path', value: 'logs/gft_260305_01.log', icon: FileText },
            { label: 'Integrity', value: '100% Verified', icon: CheckCircle2, color: 'text-emerald-500' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl">
              <div className="flex items-center space-x-3 mb-2">
                <stat.icon className={cn("w-3 h-3", stat.color || "text-zinc-500")} />
                <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">{stat.label}</span>
              </div>
              <div className="text-[10px] font-black text-white uppercase tracking-tight">{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Log Feed */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-xl min-h-[300px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Real-time_Aggregation_Feed</span>
            <div className="h-px flex-1 mx-4 bg-zinc-800" />
            <Activity className="w-3 h-3 text-zinc-600" />
          </div>
          
          <div className="flex-1 space-y-2 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-4 p-3 rounded-xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-all"
                >
                  <div className="mt-1">
                    {log.type === 'success' && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                    {log.type === 'info' && <Activity className="w-3 h-3 text-blue-500" />}
                    {log.type === 'warning' && <AlertCircle className="w-3 h-3 text-amber-500" />}
                    {log.type === 'error' && <AlertCircle className="w-3 h-3 text-red-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tighter">[{log.module}]</span>
                      <span className="text-[8px] font-mono text-zinc-600">{log.timestamp}</span>
                    </div>
                    <p className="text-[10px] text-zinc-300 font-mono leading-relaxed">{log.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
