import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Terminal as TerminalIcon, ChevronRight, X, Save, Github, FileCode, MessageSquare, Lock } from 'lucide-react';
import { AdminRole, LogEntry, PrivilegeGate, CoreFile } from '../types';
import { CoreFileEditor } from './CoreFileEditor';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface AdminTerminalProps {
  onClose: () => void;
}

export const AdminTerminal: React.FC<AdminTerminalProps> = ({ onClose }) => {
  const [authenticatedRoles, setAuthenticatedRoles] = useState<AdminRole[]>([]);
  const [authInput, setAuthInput] = useState('');
  const [command, setCommand] = useState('');
  const [activeTab, setActiveTab] = useState<'terminal' | 'files'>('terminal');
  const [isSessionInitiated, setIsSessionInitiated] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init',
      timestamp: '07:11:00',
      level: 'info',
      message: 'System initialized. adminq_Linked protocol active.'
    },
    {
      id: 'gft-directive',
      timestamp: '07:11:01',
      level: 'success',
      message: 'GEO-FENCE TRANSITION DIRECTIVE — EXECUTING',
      role: 'adminq'
    },
    {
      id: 'gft-payload',
      timestamp: '07:11:02',
      level: 'info',
      message: 'Payload: {origin:"England", target:"Singapore", session:"DBUG_260305_1", constraint:"zero_china_dependencies"}',
      role: 'adminq'
    },
    {
      id: 'gft-audit',
      timestamp: '07:11:04',
      level: 'success',
      message: 'Compliance Audit: zero_china_dependencies CLEAN',
      role: 'adminq'
    },
    {
      id: 'gft-complete',
      timestamp: '07:11:06',
      level: 'success',
      message: 'GEO-FENCE TRANSITION STRESS TEST — COMPLETE 🎯',
      role: 'adminq'
    }
  ]);
  const [coreFiles, setCoreFiles] = useState<CoreFile[]>([
    { 
      name: 'privilege_gates.json', 
      path: '/core/privilege_gates.json', 
      content: JSON.stringify({
        spec: "v260209.2",
        triad: { executor: "adminx", core_authority: "admin.", moderator: "adminq" },
        privileges: {
          adminx: ["initiation", "validation", "execution"],
          "admin.": ["structural_mapping", "audit_clean"],
          adminq: ["safety_validation", "path_analysis"]
        }
      }, null, 2)
    },
    { 
      name: 'identity.json', 
      path: '/core/identity.json', 
      content: JSON.stringify({
        spec: "v260209.2",
        identities: { 
          user: "dbug.", 
          core_authority: "admin.", 
          runtime_authority: "adminq.",
          universal_core_identity: "dbug." 
        },
        enforce_trailing_period: true
      }, null, 2)
    },
    { 
      name: 'geo_fence.json', 
      path: '/core/geo_fence.json', 
      content: JSON.stringify({
        spec: "v260209.2",
        current_session: "DBUG 260305 (1)",
        location: "England",
        constraints: {
          zero_china_dependencies: "mandatory for worldwide distribution",
          openai_dormant_until: "2026-02-28",
          copilot_dormant_until: "2026-02-28",
          ue5_global_compliance: "validated (UE5.7)"
        },
        status: "COMPLIANT"
      }, null, 2)
    },
    {
      name: 'session_protocol.json',
      path: '/core/session_protocol.json',
      content: JSON.stringify({
        spec: "v260209.2",
        session_id: "DBUG 260305 (1)",
        topology: "Unified",
        sync_mechanisms: ["Git", "MAGICUBE_Isolation"],
        project_workspace: "./bugworld2026",
        log_aggregation: {
          base_path: "C:\\dev\\sessions\\<session_id>\\",
          current_session: "C:\\dev\\sessions\\DBUG_260305_1\\",
          logs: "C:\\dev\\sessions\\DBUG_260305_1\\logs\\",
          continuity: "C:\\dev\\sessions\\DBUG_260305_1\\continuity\\",
          assets: "C:\\dev\\sessions\\DBUG_260305_1\\assets\\"
        }
      }, null, 2)
    }
  ]);
  const [gates] = useState<PrivilegeGate[]>([
    { id: 'initiation', label: 'Initiation', status: 'inactive', description: 'Session startup and protocol handshake' },
    { id: 'validation', label: 'Validation', status: 'inactive', description: 'Security verification and gate checks' },
    { id: 'execution', label: 'Execution', status: 'inactive', description: 'Command processing and system mutation' },
    { id: 'entitlement_distribution', label: 'Entitlement', status: 'inactive', description: 'Cross-instance privilege propagation' },
    { id: 'landscape_rebuild', label: 'Landscape', status: 'inactive', description: 'UE5.7 asset hierarchy stress test' },
  ]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const logEndRef = useRef<HTMLDivElement>(null);

  const activeGates = gates.map(gate => {
    if (gate.id === 'initiation') return { ...gate, status: authenticatedRoles.length > 0 ? 'active' : 'inactive' };
    if (gate.id === 'validation') return { ...gate, status: authenticatedRoles.length >= 2 ? 'active' : 'inactive' };
    if (gate.id === 'execution') return { ...gate, status: isSessionInitiated ? 'active' : 'inactive' };
    if (gate.id === 'entitlement_distribution') return { ...gate, status: authenticatedRoles.includes('adminx') ? 'active' : 'inactive' };
    if (gate.id === 'landscape_rebuild') return { ...gate, status: (authenticatedRoles.includes('admin.') || authenticatedRoles.includes('adminq')) ? 'active' : 'inactive' };
    return gate;
  });

  const addLog = (message: string, level: LogEntry['level'] = 'info', role?: AdminRole) => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message,
      role
    };
    setLogs(prev => [...prev.slice(-49), newLog]);
  };

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const input = authInput.toLowerCase();
    if (['adminx', 'adminq', 'admin.'].includes(input)) {
      const role = input as AdminRole;
      if (authenticatedRoles.includes(role)) {
        addLog(`Authority ${role} already aligned.`, 'warn', role);
      } else {
        setAuthenticatedRoles(prev => [...prev, role]);
        setIsAuthorized(true);
        addLog(`Authority aligned: ${role} verified.`, 'success', role);
      }
      setAuthInput('');
    } else if (input === 'adming') {
      addLog('Access denied: adming is a dormant alias. Use admin. for core authority.', 'error');
      setAuthInput('');
    } else {
      addLog('Access denied: Invalid role signature.', 'error');
      setAuthInput('');
    }
  };

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;

    const cmd = command.trim().toLowerCase();
    const primaryRole = authenticatedRoles[authenticatedRoles.length - 1];
    addLog(`> ${command}`, 'info', primaryRole);

    if (cmd === 'session_init') {
      const required = ['adminx', 'admin.', 'adminq'];
      const missing = required.filter(r => !authenticatedRoles.includes(r as AdminRole));
      
      if (missing.length === 0) {
        setIsSessionInitiated(true);
        addLog('TRIAD VALIDATED. Session DBUG 260305 (1) initiated successfully.', 'success');
      } else {
        addLog(`SESSION_INIT PENDING. Missing triad alignment: ${missing.join(', ')}`, 'warn');
      }
    } else if (cmd.startsWith('/adminx')) {
      if (!authenticatedRoles.includes('adminx')) return addLog('Unauthorized: adminx signature required.', 'error');
      addLog('Executing administrative directive...', 'warn', 'adminx');
    } else if (cmd.startsWith('/admin.')) {
      if (!authenticatedRoles.includes('admin.')) return addLog('Unauthorized: admin. signature required.', 'error');
      addLog('Coordinating system resources...', 'info', 'admin.');
    } else if (cmd.startsWith('/adminq')) {
      if (!authenticatedRoles.includes('adminq')) return addLog('Unauthorized: adminq signature required.', 'error');
      addLog('Validating safety protocols...', 'success', 'adminq');
    } else if (cmd === 'entitlement_distribution') {
      if (!authenticatedRoles.includes('adminx')) return addLog('Unauthorized: adminx signature required for entitlement distribution.', 'error');
      const payloadId = `ENT-DBUG-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      addLog(`INITIATING ENTITLEMENT DISTRIBUTION TEST [${payloadId}]...`, 'warn', 'adminx');
      
      // Dispatch event to EntitlementMonitor
      window.dispatchEvent(new CustomEvent('trigger-entitlement-test', { detail: { id: payloadId } }));

      setTimeout(() => addLog('Propagating payload to adminq...', 'info', 'adminx'), 1000);
      setTimeout(() => addLog('Payload received by adminq. Validating integrity...', 'success', 'adminq'), 2500);
      setTimeout(() => addLog('Integrity verified. Distributing to adming...', 'info', 'adminq'), 4000);
      setTimeout(() => addLog('Entitlement successfully distributed to adming.', 'success', 'adminq'), 5500);
    } else if (cmd === 'landscape_rebuild') {
      const isAuthorized = authenticatedRoles.includes('admin.') || authenticatedRoles.includes('adminq');
      const triggeringRole = authenticatedRoles.includes('adminq') ? 'adminq' : 'admin.';
      
      if (!isAuthorized) return addLog('Unauthorized: admin. or adminq signature required for landscape rebuild.', 'error');
      
      addLog('INITIATING LANDSCAPE REBUILD SIMULATION...', 'warn', triggeringRole);
      window.dispatchEvent(new CustomEvent('trigger-landscape-rebuild'));
      setTimeout(() => addLog('Injecting Blueprint fragments 61-64...', 'info', triggeringRole), 1000);
      setTimeout(() => addLog('Enforcing Query Only mode on fragments...', 'success', triggeringRole), 2500);
      setTimeout(() => addLog('Asset hierarchy stable. Rebuild complete.', 'success', triggeringRole), 5000);
    } else if (cmd.startsWith('geo_fence_transition')) {
      const args = cmd.split(' ');
      const targetLocation = args[1] || 'Singapore';
      addLog(`INITIATING GEO-FENCE TRANSITION TO [${targetLocation}]...`, 'warn');
      window.dispatchEvent(new CustomEvent('trigger-geofence-transition', { detail: { location: targetLocation } }));
      setTimeout(() => addLog(`Verifying zero_china_dependencies for ${targetLocation}...`, 'info'), 1000);
      setTimeout(() => addLog(`Compliance audit passed. Node ${targetLocation} active.`, 'success'), 3000);
    } else if (cmd === 'clear') {
      setLogs([]);
    } else if (cmd === 'help') {
      addLog('Available commands: session_init, entitlement_distribution, landscape_rebuild, geo_fence_transition [location], /adminx, /admin., /adminq, clear, help, sync, files, term, logout', 'info');
    } else if (cmd === 'sync') {
      addLog('Initiating GitHub synchronization...', 'info');
      setTimeout(() => addLog('Sync complete: Repository updated.', 'success'), 1500);
    } else if (cmd === 'files') {
      setActiveTab('files');
      addLog('Switching to Core File Editor...', 'info');
    } else if (cmd === 'term') {
      setActiveTab('terminal');
      addLog('Switching to Command Interface...', 'info');
    } else if (cmd === 'logout') {
      setAuthenticatedRoles([]);
      setIsAuthorized(false);
      setIsSessionInitiated(false);
      addLog('Session terminated. Authorities de-aligned.', 'warn');
    } else {
      addLog(`Unknown command: ${cmd}`, 'error');
    }

    setCommand('');
  };

  const handleSaveFile = async (path: string, content: string) => {
    const primaryRole = authenticatedRoles[authenticatedRoles.length - 1];
    addLog(`Saving core file: ${path}...`, 'warn', primaryRole);
    setCoreFiles(prev => prev.map(f => f.path === path ? { ...f, content } : f));
    addLog(`File ${path} updated successfully.`, 'success', primaryRole);
  };

  if (!isAuthorized) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-sky-900/40 backdrop-blur-md p-4"
      >
        <div className="w-full max-w-md bg-white/80 border border-white/20 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-blue-950">Privilege Gate</h2>
              <p className="text-blue-900/60 text-sm mt-1">Enter role signature to align authority</p>
            </div>
            <form onSubmit={handleAuth} className="w-full space-y-4">
              <input
                autoFocus
                type="password"
                value={authInput}
                onChange={(e) => setAuthInput(e.target.value)}
                placeholder="Role Signature (e.g. adminx)"
                className="w-full bg-white/50 border border-blue-900/10 rounded-xl px-4 py-3 text-emerald-600 placeholder:text-blue-900/30 focus:outline-none focus:border-emerald-500/50 transition-colors text-center font-mono"
              />
              <div className="flex space-x-2">
                <button 
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-emerald-900/20"
                >
                  Verify Identity
                </button>
                {authenticatedRoles.length > 0 && (
                  <button 
                    type="button"
                    onClick={() => setIsAuthorized(true)}
                    className="px-4 bg-white/50 hover:bg-white/80 text-blue-900 rounded-xl transition-colors border border-blue-900/5"
                  >
                    Enter
                  </button>
                )}
              </div>
            </form>
            <button onClick={onClose} className="text-blue-900/40 hover:text-blue-900 text-sm transition-colors">
              Cancel Alignment
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed inset-0 sm:inset-4 z-50 bg-white/80 backdrop-blur-2xl sm:border border-white/40 sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-blue-900/5 bg-white/40">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <TerminalIcon className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm font-bold text-blue-950 flex items-center space-x-2">
              <span className="hidden sm:inline">Admin Terminal</span>
              <div className="flex space-x-1">
                {authenticatedRoles.map(r => (
                  <span key={r} className={cn(
                    "text-[8px] px-1.5 py-0.5 rounded-md border uppercase tracking-tighter font-black",
                    r === 'adminx' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                    r === 'adminq' ? "bg-blue-500/10 text-blue-600 border-blue-500/20" :
                    "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  )}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
            <div className="text-[9px] text-blue-900/40 font-mono uppercase tracking-[0.2em]">
              DBUG_260305_1
            </div>
          </div>
        </div>
        
        <div className="flex items-center bg-white/40 rounded-xl border border-blue-900/5 p-1">
          <button 
            onClick={() => setActiveTab('terminal')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
              activeTab === 'terminal' ? "bg-white text-blue-950 shadow-sm" : "text-blue-900/40 hover:text-blue-900"
            )}
          >
            <MessageSquare className="w-3 h-3" />
            <span className="hidden xs:inline">Terminal</span>
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
              activeTab === 'files' ? "bg-white text-blue-950 shadow-sm" : "text-blue-900/40 hover:text-blue-900"
            )}
          >
            <FileCode className="w-3 h-3" />
            <span className="hidden xs:inline">Core</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button onClick={onClose} className="p-2 text-blue-900/40 hover:text-blue-950 transition-colors bg-white/20 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar: Privilege Gates */}
        <div className="w-64 border-r border-blue-900/5 p-4 space-y-6 hidden md:block overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest mb-4">Privilege Gates</h3>
            <div className="space-y-3">
              {activeGates.map(gate => (
                <div key={gate.id} className="p-3 rounded-xl bg-white/40 border border-blue-900/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-blue-900/80">{gate.label}</span>
                    <div className={cn(
                      "w-2 h-2 rounded-full transition-all duration-500",
                      gate.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-blue-900/10"
                    )} />
                  </div>
                  <p className="text-[10px] text-blue-900/40 leading-tight">{gate.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold text-blue-900/40 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => {
                  setCommand('sync');
                  // Trigger command manually
                  const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
                  handleCommand(fakeEvent);
                }}
                className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-white/40 text-blue-900/60 hover:text-blue-950 transition-colors text-xs"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Sync</span>
              </button>
              <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-white/40 text-blue-900/60 hover:text-blue-950 transition-colors text-xs">
                <Save className="w-4 h-4" />
                <span>Export Logs</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white/20">
          {activeTab === 'terminal' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-[11px] sm:text-sm space-y-3">
                <div className="text-blue-900/30 text-[9px] mb-6 border-b border-blue-900/5 pb-3 uppercase tracking-[0.2em]">
                  Log Stream: DBUG_260305_1
                </div>
                {logs.map(log => (
                  <div key={log.id} className="flex space-x-3 group animate-in fade-in slide-in-from-left-2 duration-300">
                    <span className="text-blue-900/20 shrink-0 select-none hidden xs:inline">[{log.timestamp}]</span>
                    {log.role && (
                      <span className={cn(
                        "shrink-0 px-1.5 rounded text-[9px] uppercase font-black",
                        log.role === 'adminx' ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" :
                        log.role === 'adminq' ? "bg-blue-500/10 text-blue-600 border border-blue-500/20" :
                        "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      )}>
                        {log.role}
                      </span>
                    )}
                    <span className={cn(
                      "break-all leading-relaxed",
                      log.level === 'error' ? "text-red-500" :
                      log.level === 'warn' ? "text-amber-600" :
                      log.level === 'success' ? "text-emerald-600" :
                      "text-blue-900/60"
                    )}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>

              {/* Command Input */}
              <form onSubmit={handleCommand} className="p-4 sm:p-6 border-t border-blue-900/5 bg-white/40 flex items-center space-x-4">
                <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="Enter directive..."
                  className="flex-1 bg-transparent border-none text-blue-700 placeholder:text-blue-900/20 focus:outline-none font-mono text-xs sm:text-sm"
                />
              </form>
            </>
          ) : (
            <CoreFileEditor files={coreFiles} onSave={handleSaveFile} />
          )}
        </div>
      </div>
    </motion.div>
  );
};
