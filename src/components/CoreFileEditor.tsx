import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileJson, Save, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { CoreFile } from '../types';

interface CoreFileEditorProps {
  files: CoreFile[];
  onSave: (path: string, content: string) => void;
}

export const CoreFileEditor: React.FC<CoreFileEditorProps> = ({ files, onSave }) => {
  const [selectedFile, setSelectedFile] = useState<CoreFile | null>(files[0] || null);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      setEditContent(selectedFile.content);
      setError(null);
      setSuccess(false);
    }
  }, [selectedFile]);

  const handleSave = async () => {
    if (!selectedFile) return;
    
    try {
      setIsSaving(true);
      setError(null);
      
      // Validate JSON
      JSON.parse(editContent);
      
      await onSave(selectedFile.path, editContent);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950/50">
      <div className="flex border-b border-white/5 bg-zinc-900/30 overflow-x-auto no-scrollbar">
        {files.map(file => (
          <button
            key={file.path}
            onClick={() => setSelectedFile(file)}
            className={`px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all border-b-2 whitespace-nowrap ${
              selectedFile?.path === file.path 
                ? 'border-blue-500 text-blue-400 bg-blue-500/5' 
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {file.name.split('.')[0]}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col p-4 sm:p-6 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-600">
            <FileJson className="w-3 h-3" />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] truncate max-w-[150px] sm:max-w-none">{selectedFile?.path}</span>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20"
          >
            {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            <span>{isSaving ? 'Saving' : 'Commit'}</span>
          </button>
        </div>

        <div className="flex-1 relative group">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            spellCheck={false}
            className="w-full h-full bg-black/40 border border-white/5 rounded-2xl p-4 sm:p-6 font-mono text-xs sm:text-sm text-zinc-300 focus:outline-none focus:border-blue-500/30 resize-none shadow-inner"
          />
          
          <div className="absolute bottom-4 right-4 flex flex-col items-end space-y-2 pointer-events-none">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] uppercase font-black tracking-widest"
              >
                <AlertCircle className="w-3 h-3" />
                <span>{error}</span>
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] uppercase font-black tracking-widest"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Commit Successful</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
