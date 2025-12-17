import React, { useState, useEffect, useRef } from 'react';

// Fixed BootLoader component
const BootLoader = ({ onComplete }) => {
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear any existing intervals/timeouts
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const steps = [
      "Loading core configuration",
      "Initializing security systems",
      "Starting cache engine",
      "Loading AI models",
      "Initializing blockchain",
      "Connecting to cloud providers",
      "Starting IoT platform",
      "Loading analytics datasets",
      "Initializing quantum simulator",
      "Starting monitoring daemon",
      "Launching API gateway",
      "Loading automation workflows",
      "Preparing deployment systems",
      "Starting backup scheduler",
      "Finalizing initialization"
    ];
    
    let step = 0;
    
    intervalRef.current = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(intervalRef.current);
        setProgress(100);
        
        // Call onComplete after a short delay
        timeoutRef.current = setTimeout(() => {
          onComplete();
        }, 800);
        return;
      }
      
      setLog(prev => [...prev, steps[step]]);
      setProgress(((step + 1) / steps.length) * 100);
      step++;
    }, 100); // Reduced interval for faster boot

    // Cleanup function
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-cyan-500 font-mono text-xs flex flex-col items-center justify-center z-[9999]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
        {/* Hexagon icon without importing it again */}
        <div className="relative z-10 animate-spin text-cyan-400" style={{ width: 96, height: 96 }}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5"
            className="w-full h-full"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl tracking-tighter">QF</div>
      </div>
      
      <div className="w-96 space-y-4">
        <div className="flex justify-between text-[10px] uppercase text-slate-500">
          <span>KERNEL_INIT_SEQUENCE</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-0.5 bg-slate-900 overflow-hidden relative">
          <div 
            className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_20px_currentColor]" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        <div className="h-24 font-mono text-[10px] text-slate-500 flex flex-col-reverse overflow-hidden border-l border-slate-800 pl-3">
          {log.map((l, i) => (
            <div key={i} className="animate-in slide-in-from-left-2 fade-in">
              <span className="text-cyan-600">OK</span> {l}...
            </div>
          )).reverse()}
        </div>
      </div>
    </div>
  );
};

// Alternative: Simpler BootLoader that always works
const SimpleBootLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing QuantumFlow Kernel...");

  useEffect(() => {
    const messages = [
      "Loading core configuration...",
      "Initializing security systems...",
      "Starting cache engine...",
      "Loading AI models...",
      "Initializing blockchain...",
      "Connecting to cloud providers...",
      "Starting IoT platform...",
      "Loading analytics datasets...",
      "Initializing quantum simulator...",
      "Starting monitoring daemon...",
      "Launching API gateway...",
      "Loading automation workflows...",
      "Preparing deployment systems...",
      "Starting backup scheduler...",
      "QuantumFlow OS Ready..."
    ];

    let currentStep = 0;
    const totalSteps = messages.length;
    
    const interval = setInterval(() => {
      if (currentStep < totalSteps) {
        setMessage(messages[currentStep]);
        setProgress(((currentStep + 1) / totalSteps) * 100);
        currentStep++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-cyan-500 font-mono text-sm flex flex-col items-center justify-center z-[9999]">
      <div className="relative mb-8">
        <div className="animate-spin text-cyan-400" style={{ width: 96, height: 96 }}>
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="0.5"
            className="w-full h-full"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl tracking-tighter">QF</div>
      </div>
      
      <div className="w-96 space-y-4">
        <div className="flex justify-between text-xs uppercase text-slate-400">
          <span>BOOT SEQUENCE</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-cyan-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-center text-cyan-300 h-6 flex items-center justify-center">
          {message}
        </div>
        <div className="text-xs text-slate-500 text-center mt-8">
          QuantumFlow OS v19.1 Zenith
        </div>
      </div>
    </div>
  );
};

// Quick test component to verify it works
const TestQuantumFlowOS = () => {
  const [booted, setBooted] = useState(false);
  const [locked, setLocked] = useState(true);

  // Auto-unlock after boot for testing
  useEffect(() => {
    if (booted) {
      const timer = setTimeout(() => {
        setLocked(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [booted]);

  if (!booted) {
    return <SimpleBootLoader onComplete={() => setBooted(true)} />;
  }

  if (locked) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black flex flex-col items-center justify-center">
        <div className="text-center mb-8 animate-pulse">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin" />
          <h1 className="text-4xl font-bold text-white mb-2 tracking-widest">QUANTUMFLOW</h1>
          <p className="text-cyan-400 text-sm">v19.1 Zenith</p>
        </div>
        <button
          onClick={() => setLocked(false)}
          className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-lg transition-colors animate-bounce"
        >
          ▶ START SYSTEM
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="h-full flex flex-col">
        {/* Top Bar */}
        <div className="h-10 bg-black/50 backdrop-blur-sm flex items-center justify-between px-4 border-b border-gray-800">
          <div className="font-bold tracking-wider">QUANTUMFLOW OS</div>
          <div className="text-sm font-mono">
            <span className="text-cyan-400">12:00:00</span> | <span className="text-green-400">100%</span>
          </div>
        </div>
        
        {/* Desktop */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">
            {/* Desktop Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {[
                { name: 'Terminal', icon: '>_', color: 'bg-emerald-900/50' },
                { name: 'File Explorer', icon: '📁', color: 'bg-blue-900/50' },
                { name: 'Nexus Browser', icon: '🌐', color: 'bg-purple-900/50' },
                { name: 'Settings', icon: '⚙️', color: 'bg-gray-800/50' },
                { name: 'Quantum IDE', icon: '{}', color: 'bg-amber-900/50' },
                { name: 'System Monitor', icon: '📊', color: 'bg-cyan-900/50' },
                { name: 'Neural Network', icon: '🧠', color: 'bg-pink-900/50' },
                { name: 'Blockchain', icon: '⛓️', color: 'bg-green-900/50' },
              ].map((app, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-white/5 cursor-pointer transition-all hover:scale-105"
                >
                  <div className={`w-20 h-20 ${app.color} rounded-2xl flex items-center justify-center text-2xl`}>
                    {app.icon}
                  </div>
                  <div className="text-sm font-medium text-center">{app.name}</div>
                </div>
              ))}
            </div>
            
            {/* Status Bar */}
            <div className="mt-12 p-6 bg-black/30 rounded-2xl border border-gray-800">
              <h3 className="text-lg font-bold mb-4 text-cyan-400">System Status</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="text-sm text-gray-400">CPU Usage</div>
                  <div className="text-2xl font-bold text-emerald-400">12%</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="text-sm text-gray-400">Memory</div>
                  <div className="text-2xl font-bold text-blue-400">4.2/16 GB</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="text-sm text-gray-400">Network</div>
                  <div className="text-2xl font-bold text-purple-400">1.2 Gbps</div>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-xl">
                  <div className="text-sm text-gray-400">Uptime</div>
                  <div className="text-2xl font-bold text-amber-400">2:15:33</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Taskbar */}
        <div className="h-16 bg-black/70 backdrop-blur-xl border-t border-gray-800 flex items-center justify-between px-6">
          <button className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl text-sm font-bold hover:from-cyan-700 hover:to-blue-700 transition-all">
            🚀 LAUNCHER
          </button>
          
          <div className="flex gap-3">
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">📁</div>
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">🌐</div>
            <div className="w-12 h-12 bg-gray-800/50 rounded-xl flex items-center justify-center">⚙️</div>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-mono">SYSTEM: <span className="text-green-400">✓ ONLINE</span></div>
            <div className="text-xs text-gray-400">Quantum Kernel v5.15.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestQuantumFlowOS;
