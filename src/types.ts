export type AdminRole = 'adminx' | 'admin.' | 'adminq';

export interface PrivilegeGate {
  id: string;
  label: string;
  status: 'active' | 'inactive' | 'pending';
  description: string;
}

export interface SessionInfo {
  id: string;
  version: string;
  topology: string;
  status: 'Active' | 'Previous' | 'Standby';
  timestamp: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  message: string;
  role?: AdminRole;
}

export interface CoreFile {
  name: string;
  path: string;
  content: string;
}
