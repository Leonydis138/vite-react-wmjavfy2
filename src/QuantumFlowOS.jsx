import React, { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from 'react';
import { 
  Terminal, Activity, Cpu, Server, Shield, Zap, Database, Lock, 
  Box, Layers, Globe, Wifi, HardDrive, Code, FileText, 
  Share2, GitBranch, Radio, Grid, Clock, AlertTriangle, 
  CheckCircle, Play, Pause, RefreshCw, Hash, Eye, Cloud, 
  Archive, Save, Layout, Command, Hexagon, Wallet, Bitcoin, 
  ChevronRight, Power, Settings, X, ChevronUp, ChevronDown,
  Maximize2, Minimize2, Search, CornerDownLeft, Map, Key,
  Mic, Monitor, Sliders, Thermometer, Folder, File, MoreVertical,
  Move, MessageSquare, Minus, Square, User, LogOut, Aperture,
  FolderPlus, FilePlus, Download, Trash2, Globe2, AlertOctagon,
  Gamepad2, Calculator, List, Battery, Volume2, Music, Video,
  CreditCard, LayoutTemplate, Bell, Unlock, Sun, Moon,
  MessageCircle, StickyNote, Speaker, Headphones, Repeat, Shuffle,
  Users, Send, Paperclip, Fingerprint, Network, Scan, Minimize
} from 'lucide-react';

// ============================================================================
// SYSTEM CONSTANTS
// ============================================================================

const SYSTEM_VERSION = "v19.1 Zenith";
const STORAGE_KEY = "qf_os_v19_root";

const THEMES = {
  CYAN: { 
    id: 'CYAN', name: 'Quantum Blue', 
    primary: 'text-cyan-400', bg_primary: 'bg-cyan-500', 
    border: 'border-cyan-500/30', window_bg: 'bg-[#050a10]/90', 
    header_bg: 'bg-cyan-950/80', accent: 'cyan',
    wallpaper: 'grid'
  },
  PURPLE: { 
    id: 'PURPLE', name: 'Neural Purple', 
    primary: 'text-purple-400', bg_primary: 'bg-purple-500', 
    border: 'border-purple-500/30', window_bg: 'bg-[#0a0510]/90', 
    header_bg: 'bg-purple-950/80', accent: 'purple',
    wallpaper: 'particles'
  },
  EMERALD: { 
    id: 'EMERALD', name: 'Matrix Green', 
    primary: 'text-emerald-400', bg_primary: 'bg-emerald-500', 
    border: 'border-emerald-500/30', window_bg: 'bg-[#000a00]/95', 
    header_bg: 'bg-emerald-950/80', accent: 'emerald',
    wallpaper: 'matrix'
  },
  CRIMSON: { 
    id: 'CRIMSON', name: 'Red Alert', 
    primary: 'text-red-500', bg_primary: 'bg-red-600', 
    border: 'border-red-500/30', window_bg: 'bg-[#100505]/95', 
    header_bg: 'bg-red-950/80', accent: 'red',
    wallpaper: 'radar'
  }
};

const DEFAULT_FS = {
  "home": {
    "admin": {
      "desktop": {
         "todo.md": { type: "file", content: "- Upgrade Kernel\n- Fix Null Pointer in Neural Net" }
      },
      "documents": {
        "manifesto.txt": { type: "file", content: "We are the architects of the new age." },
        "keys.pem": { type: "file", content: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQE..." }
      },
      "code": {
         "quantum.js": { type: "file", content: "class Qubit {\n  constructor() {\n    this.state = [1, 0]; // |0>\n  }\n  hadamard() {\n    // Apply H-gate\n  }\n}" },
         "style.css": { type: "file", content: "body { background: #000; color: #0ff; }" }
      },
      "config": {
         "sys.conf": { type: "file", content: "AUDIO_ENGINE=TRUE\nPHYSICS=ENABLED\nWALLPAPER=LIVE" }
      }
    }
  },
  "sys": {
    "logs": {
      "boot.log": { type: "file", content: "Kernel loaded.\nAudio subsystem initialized.\nNeural link active." }
    }
  }
};

// ============================================================================
// BOOTLOADER (FIXED)
// ============================================================================

const BootLoader = ({ onComplete }) => {
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Steps from Quantumflow.txt
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
    const interval = setInterval(() => {
      if (step >= steps.length) {
        clearInterval(interval);
        setTimeout(onComplete, 800);
        return;
      }
      setLog(prev => [...prev, steps[step]]);
      setProgress(((step + 1) / steps.length) * 100);
      step++;
    }, 150); // Speed of boot

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black text-cyan-500 font-mono text-xs flex flex-col items-center justify-center z-[9999]">
       <div className="relative mb-8">
         <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
         <Hexagon size={96} className="relative z-10 animate-spin text-cyan-400" strokeWidth={0.5} />
         <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl tracking-tighter">QF</div>
       </div>
       
       <div className="w-96 space-y-4">
          <div className="flex justify-between text-[10px] uppercase text-slate-500">
             <span>KERNEL_INIT_SEQUENCE</span>
             <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-0.5 bg-slate-900 overflow-hidden relative">
             <div className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_20px_currentColor]" style={{ width: `${progress}%` }} />
          </div>
          <div className="h-24 font-mono text-[10px] text-slate-500 flex flex-col-reverse overflow-hidden border-l border-slate-800 pl-3">
             {log.map((l, i) => <div key={i} className="animate-in slide-in-from-left-2 fade-in"><span className="text-cyan-600">OK</span> {l}...</div>).reverse()}
          </div>
       </div>
    </div>
  );
};

// ============================================================================
// LIVE WALLPAPER ENGINE
// ============================================================================

const WallpaperEngine = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // -- ANIMATION STATES --
    const particles = Array.from({ length: 50 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 2 + 1
    }));

    const matrixChars = "01010101XYKZ";
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);

    let radarAngle = 0;

    const draw = () => {
      // Clear with trail effect
      ctx.fillStyle = theme.id === 'EMERALD' ? 'rgba(0, 10, 0, 0.1)' : 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (theme.wallpaper === 'particles') {
        ctx.fillStyle = '#a855f7';
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)';
        
        particles.forEach((p, i) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Connect nearby
          particles.slice(i + 1).forEach(p2 => {
             const d = Math.hypot(p.x - p2.x, p.y - p2.y);
             if (d < 150) {
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
             }
          });
        });
      } 
      else if (theme.wallpaper === 'grid') {
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.15)';
        ctx.lineWidth = 1;
        const time = Date.now() / 1000;
        const gridSize = 40;
        
        // Perspective Grid
        for (let y = 0; y < canvas.height; y += gridSize) {
           ctx.beginPath();
           ctx.moveTo(0, y);
           ctx.lineTo(canvas.width, y);
           ctx.stroke();
        }
        // Moving vertical lines
        const offset = (time * 50) % gridSize;
        for (let x = offset; x < canvas.width; x += gridSize) {
           ctx.beginPath();
           ctx.moveTo(x, 0);
           ctx.lineTo(x, canvas.height);
           ctx.stroke();
        }
      }
      else if (theme.wallpaper === 'matrix') {
        ctx.fillStyle = '#0f0';
        ctx.font = '15px monospace';
        for (let i = 0; i < drops.length; i++) {
           const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
           ctx.fillText(text, i * 20, drops[i] * 20);
           if (drops[i] * 20 > canvas.height && Math.random() > 0.975) drops[i] = 0;
           drops[i]++;
        }
      }
      else if (theme.wallpaper === 'radar') {
         const cx = canvas.width / 2;
         const cy = canvas.height / 2;
         radarAngle += 0.02;
         
         // Rings
         ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
         ctx.beginPath(); ctx.arc(cx, cy, 100, 0, Math.PI * 2); ctx.stroke();
         ctx.beginPath(); ctx.arc(cx, cy, 250, 0, Math.PI * 2); ctx.stroke();
         ctx.beginPath(); ctx.arc(cx, cy, 400, 0, Math.PI * 2); ctx.stroke();

         // Sweep
         ctx.save();
         ctx.translate(cx, cy);
         ctx.rotate(radarAngle);
         const grad = ctx.createLinearGradient(0, 0, 400, 0);
         grad.addColorStop(0, 'rgba(239, 68, 68, 0)');
         grad.addColorStop(1, 'rgba(239, 68, 68, 0.5)');
         ctx.fillStyle = grad;
         ctx.beginPath();
         ctx.moveTo(0, 0);
         ctx.arc(0, 0, 400, 0, 0.5);
         ctx.lineTo(0, 0);
         ctx.fill();
         ctx.restore();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
       window.removeEventListener('resize', resize);
       cancelAnimationFrame(animId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

// ============================================================================
// SYSTEM HOOKS
// ============================================================================

const usePersistentState = (key, defaultValue) => {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch { return defaultValue; }
  });
  useEffect(() => localStorage.setItem(key, JSON.stringify(state)), [key, state]);
  return [state, setState];
};

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Window = ({ app, onClose, onMinimize, onMaximize, onFocus, theme, children }) => {
  if (app.minimized) return null;

  return (
    <div 
      className={`absolute flex flex-col rounded-lg overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-200 animate-in fade-in zoom-in-95 ${theme.window_bg} ${theme.border} ${app.active ? 'shadow-' + theme.accent + '-500/20 z-50' : 'z-0 grayscale-[0.3]'}`}
      style={{ 
        left: app.maximized ? 0 : app.x, 
        top: app.maximized ? 0 : app.y, 
        width: app.maximized ? '100%' : app.w, 
        height: app.maximized ? 'calc(100% - 48px)' : app.h,
        zIndex: app.zIndex,
        borderRadius: app.maximized ? 0 : '0.5rem'
      }}
      onMouseDown={() => onFocus(app.id)}
    >
      <div className={`h-9 ${theme.header_bg} border-b ${theme.border} flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing`}>
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-200 uppercase tracking-widest">
           <app.icon size={12} className={theme.primary} />
           {app.title}
        </div>
        <div className="flex items-center gap-1.5">
           <button onClick={(e) => { e.stopPropagation(); onMinimize(app.id); }} className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500 border border-yellow-500/50 transition-colors" />
           <button onClick={(e) => { e.stopPropagation(); onMaximize(app.id); }} className="w-3 h-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/50 transition-colors" />
           <button onClick={(e) => { e.stopPropagation(); onClose(app.id); }} className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 border border-red-500/50 transition-colors" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative flex flex-col">
         {children}
      </div>
    </div>
  );
};

// ============================================================================
// APPS
// ============================================================================

// --- APP: NEXUS IDE ---
const AppIDE = ({ theme, filename, content, path, setFs }) => {
  const [code, setCode] = useState(content || "");
  const [dirty, setDirty] = useState(false);

  const lines = code.split('\n').length;

  const handleSave = () => {
    if (!path) return;
    setFs(prev => {
       const next = JSON.parse(JSON.stringify(prev));
       let ptr = next;
       for (let i = 0; i < path.length - 1; i++) ptr = ptr[path[i]];
       ptr[path[path.length - 1]] = { type: 'file', content: code };
       return next;
    });
    setDirty(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] font-mono text-xs">
       <div className="bg-[#252526] px-3 py-1 flex justify-between items-center border-b border-black text-slate-400 select-none">
          <div className="flex items-center gap-2">
             <FileText size={12} className="text-blue-400" />
             <span>{filename} {dirty && '•'}</span>
          </div>
          <div className="flex gap-3">
             <span className="hover:text-white cursor-pointer" onClick={handleSave}>Save</span>
             <span>UTF-8</span>
             <span>JavaScript</span>
          </div>
       </div>
       <div className="flex-1 flex overflow-hidden">
          {/* Line Numbers */}
          <div className="w-10 bg-[#1e1e1e] border-r border-[#333] text-[#858585] text-right pr-2 pt-4 select-none">
             {Array.from({length: lines}).map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          {/* Editor Area */}
          <textarea 
             className="flex-1 bg-[#1e1e1e] text-[#d4d4d4] p-4 border-none outline-none resize-none leading-relaxed"
             value={code}
             onChange={e => { setCode(e.target.value); setDirty(true); }}
             spellCheck={false}
          />
       </div>
       <div className="bg-[#007acc] text-white px-2 py-0.5 text-[10px] flex justify-between">
          <span>NORMAL</span>
          <span>Ln {lines}, Col 1</span>
       </div>
    </div>
  );
};

// --- APP: TERMINAL ---
const AppTerminal = ({ theme, fs, setFs, openApp }) => {
  const [history, setHistory] = useState([`QuantumFlow Kernel ${SYSTEM_VERSION}`, "Type 'help' for commands."]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(["home", "admin"]);
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView(), [history]);

  const handleCommand = (e) => {
    if (e.key !== 'Enter') return;
    const cmdLine = input.trim();
    setHistory(prev => [...prev, `${cwd.join('/')} $ ${cmdLine}`]);
    setInput("");
    
    if (!cmdLine) return;
    const [cmd, ...args] = cmdLine.split(" ");

    // Core Logic
    if (cmd === "clear") setHistory([]);
    else if (cmd === "help") setHistory(p => [...p, "Commands: ls, cd, mkdir, touch, open, qpm, clear"]);
    else if (cmd === "ls") {
       // Simple LS logic
       let ptr = fs;
       for (const p of cwd) ptr = ptr[p];
       setHistory(p => [...p, Object.keys(ptr || {}).join("  ")]);
    } else {
       setHistory(p => [...p, `Unknown command: ${cmd}`]);
    }
  };

  return (
    <div className="h-full bg-black/95 p-3 font-mono text-xs overflow-y-auto text-slate-300" onClick={() => document.getElementById('term-in')?.focus()}>
      {history.map((l, i) => <div key={i} className="mb-1 break-all">{l}</div>)}
      <div className="flex gap-2 text-emerald-500">
        <span>{cwd.join('/')} $</span>
        <input 
          id="term-in" 
          autoFocus 
          className="bg-transparent border-none outline-none flex-1 text-slate-100" 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          onKeyDown={handleCommand} 
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

// --- APP: FILE EXPLORER ---
const AppExplorer = ({ theme, fs, setFs, openApp }) => {
  const [currentPath, setCurrentPath] = useState(["home", "admin"]);
  const [selected, setSelected] = useState(null);

  const getCurrentDir = () => {
    let dir = fs;
    for (const p of currentPath) dir = dir[p];
    return dir;
  };

  const handleBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const handleDoubleClick = (name, item) => {
    if (item.type === "file") {
      openApp('editor', { 
        filename: name, 
        content: item.content,
        path: [...currentPath, name]
      });
    } else {
      setCurrentPath([...currentPath, name]);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black/50">
      {/* Path Bar */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-black/30">
        <button onClick={handleBack} className="p-1.5 rounded hover:bg-white/10">
          <ChevronUp size={14} className="rotate-270" />
        </button>
        <div className="flex items-center gap-1 text-xs text-slate-400">
          {currentPath.map((p, i) => (
            <React.Fragment key={i}>
              <span 
                className="hover:text-white cursor-pointer"
                onClick={() => setCurrentPath(currentPath.slice(0, i + 1))}
              >
                {p}
              </span>
              {i < currentPath.length - 1 && <ChevronRight size={10} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* File List */}
      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(getCurrentDir() || {}).map(([name, item]) => (
            <div
              key={name}
              className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all ${selected === name ? 'bg-cyan-500/20 border border-cyan-500/50' : 'hover:bg-white/5'}`}
              onClick={() => setSelected(name)}
              onDoubleClick={() => handleDoubleClick(name, item)}
            >
              <div className="p-3 rounded-full bg-white/5 mb-2">
                {item.type === "file" ? (
                  <File size={24} className="text-slate-300" />
                ) : (
                  <Folder size={24} className="text-amber-400" />
                )}
              </div>
              <div className="text-xs text-center text-slate-300 truncate w-full">{name}</div>
              <div className="text-[10px] text-slate-500 mt-1 uppercase">
                {item.type}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-white/10 p-2 flex justify-between text-xs text-slate-500">
        <div>{Object.keys(getCurrentDir() || {}).length} items</div>
        <div>System FS</div>
      </div>
    </div>
  );
};

export default function QuantumFlowOS() {
  return (
    <div
      style={{
        background: '#111',
        color: '#0f0',
        height: '100vh',
        padding: 20
      }}
    >
      QuantumFlow OS v19 — ONLINE
    </div>
  )
}
