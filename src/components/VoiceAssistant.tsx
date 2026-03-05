import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, X, Volume2, Loader2, Info } from 'lucide-react';
import { GoogleGenAI, Modality } from "@google/genai";
import { cn } from '../utils';

interface VoiceAssistantProps {
  onClose: () => void;
}

export const VoiceAssistant: React.FC<VoiceAssistantProps> = ({ onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionRef = useRef<any>(null);
  const audioQueue = useRef<Int16Array[]>([]);
  const isPlayingRef = useRef(false);

  const systemInstruction = `
    You are the "dbug." AI Assistant, a high-level administrative intelligence.
    Your purpose is to explain how the "dbug." sessions work.
    
    Key Information for you to convey:
    1. The Admin Triad: Sessions are governed by three core authorities: adminx (Execution), admin. (Validation), and adminq (Quarantine/Logic).
    2. Session Initiation: A session must be initialized using the 'session_init' command followed by verification from the Triad.
    3. Core Files: You manage identity.json, geo_fence.json, and session_protocol.json which define the operational boundaries.
    4. Current Spec: We are operating on spec v260209.2.
    5. Current Session: DBUG 260305 (1).
    6. Security: Everything is end-to-end verified and operates within a secure sandbox.
    
    Be professional, concise, and slightly futuristic in your tone. 
    You are voice-activated and respond in real-time.
  `;

  const startSession = async () => {
    try {
      setIsConnecting(true);
      setError(null);

      // 1. Request Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // 2. Setup Audio Context
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass({ sampleRate: 16000 });
      audioContextRef.current = audioContext;

      // 3. Initialize Gemini Live
      const apiKey = (process as { env: { GEMINI_API_KEY?: string } }).env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is missing.");
      
      const ai = new GoogleGenAI({ apiKey });
      
      const sessionPromise = ai.live.connect({
        model: "gemini-2.5-flash-native-audio-preview-09-2025",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } },
          },
          systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            setIsListening(true);
            
            // Start streaming audio
            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              // Convert to PCM 16-bit
              const pcmData = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
              }
              
              const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
              sessionPromise.then((session) => {
                session.sendRealtimeInput({
                  media: { data: base64Data, mimeType: 'audio/pcm;rate=16000' }
                });
              });
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
          },
          onmessage: async (message) => {
            // Handle audio output
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts && parts.length > 0) {
              const audioPart = parts.find(p => p.inlineData);
              if (audioPart?.inlineData?.data) {
                const base64Audio = audioPart.inlineData.data;
                const binaryString = atob(base64Audio);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                const pcmData = new Int16Array(bytes.buffer);
                audioQueue.current.push(pcmData);
                processAudioQueue();
              }
            }
            
            if (message.serverContent?.interrupted) {
              audioQueue.current = [];
              isPlayingRef.current = false;
            }
          },
          onerror: (err) => {
            console.error("Live API Error:", err);
            setError("Connection failed. Please check your API key.");
            stopSession();
          },
          onclose: () => {
            stopSession();
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err) {
      console.error("Failed to start voice session:", err);
      setError(err instanceof Error ? err.message : "Microphone access denied.");
      setIsConnecting(false);
    }
  };

  const processAudioQueue = async () => {
    if (isPlayingRef.current || audioQueue.current.length === 0 || !audioContextRef.current) return;

    isPlayingRef.current = true;
    const pcmData = audioQueue.current.shift()!;
    
    const audioBuffer = audioContextRef.current.createBuffer(1, pcmData.length, 16000);
    const channelData = audioBuffer.getChannelData(0);
    for (let i = 0; i < pcmData.length; i++) {
      channelData[i] = pcmData[i] / 0x7FFF;
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContextRef.current.destination);
    source.onended = () => {
      isPlayingRef.current = false;
      processAudioQueue();
    };
    source.start();
  };

  const stopSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    setIsActive(false);
    setIsListening(false);
    setIsConnecting(false);
  };

  useEffect(() => {
    return () => stopSession();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-sky-900/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl relative backdrop-blur-xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-blue-900/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-blue-950">Voice Assistant</h3>
              <p className="text-[10px] text-blue-900/40 font-mono uppercase tracking-widest">Session Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-blue-900/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-blue-900/40" />
          </button>
        </div>

        {/* Content */}
        <div className="p-10 flex flex-col items-center space-y-8">
          <div className="relative">
            {/* Pulse Rings */}
            <AnimatePresence>
              {isListening && (
                <>
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-blue-500/20"
                  />
                  <motion.div
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className="absolute inset-0 rounded-full bg-blue-500/20"
                  />
                </>
              )}
            </AnimatePresence>

            <button
              onClick={isActive ? stopSession : startSession}
              disabled={isConnecting}
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center transition-all relative z-10 shadow-2xl",
                isActive ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-blue-600 text-white hover:scale-105 active:scale-95 shadow-blue-500/30"
              )}
            >
              {isConnecting ? (
                <Loader2 className="w-8 h-8 animate-spin" />
              ) : isActive ? (
                <MicOff className="w-8 h-8" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </button>
          </div>

          <div className="text-center space-y-2">
            <h4 className="text-lg font-bold text-blue-950">
              {isConnecting ? "Establishing Link..." : isActive ? "Listening..." : "Ready to Assist"}
            </h4>
            <p className="text-xs text-blue-900/60 max-w-[200px] mx-auto leading-relaxed">
              {isActive 
                ? "Ask me about the Admin Triad or session protocols." 
                : "Initialize voice link to begin the briefing."}
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 text-[10px] font-bold uppercase tracking-widest">
              <Info className="w-3 h-3" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-blue-900/5 border-t border-blue-900/5">
          <div className="flex items-center justify-center space-x-2 text-[8px] font-black uppercase tracking-[0.3em] text-blue-900/20">
            <div className={cn("w-1.5 h-1.5 rounded-full", isActive ? "bg-emerald-500" : "bg-blue-900/10")} />
            <span>Encrypted Voice Stream</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
