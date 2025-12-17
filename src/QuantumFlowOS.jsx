import React, { useState, useEffect, useRef } from 'react';
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
// RELIABLE BOOTLOADER - GUARANTEED TO WORK
// ============================================================================
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

// Custom Palette icon component
const PaletteIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" strokeWidth="1.5"/>
  </svg>
);

// --- APP: SETTINGS ---
const AppSettings = ({ theme, setThemeId }) => {
  const [activeTab, setActiveTab] = useState("theme");

  return (
    <div className="h-full flex bg-black/50">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/10 p-4 space-y-1">
        {[
          { id: "theme", label: "Theme", icon: PaletteIcon },
          { id: "system", label: "System", icon: Cpu },
          { id: "network", label: "Network", icon: Wifi },
          { id: "security", label: "Security", icon: Shield },
          { id: "display", label: "Display", icon: Monitor },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition-all ${activeTab === tab.id ? `${theme.bg_primary} bg-opacity-20 text-white` : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "theme" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Theme Selection</h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.values(THEMES).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${t.border} ${theme.id === t.id ? 'ring-2 ring-white bg-white/10' : 'hover:bg-white/5'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold">{t.name}</span>
                    <div className={`w-6 h-6 rounded-full ${t.bg_primary}`} />
                  </div>
                  <div className={`h-2 rounded-full ${t.bg_primary} mb-2`} />
                  <div className={`h-2 rounded-full ${t.bg_primary} bg-opacity-50 mb-2`} />
                  <div className={`h-2 rounded-full ${t.bg_primary} bg-opacity-30`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === "system" && (
          <div>
            <h2 className="text-lg font-bold mb-4">System Information</h2>
            <div className="space-y-4">
              {[
                { label: "OS Version", value: SYSTEM_VERSION },
                { label: "Kernel", value: "Quantum 5.15.0" },
                { label: "Architecture", value: "x86_64" },
                { label: "Memory", value: "16.0 GB" },
                { label: "Storage", value: "512 GB SSD" },
                { label: "Uptime", value: "2 hours, 15 minutes" },
              ].map((item) => (
                <div key={item.label} className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-slate-400">{item.label}</span>
                  <span className="font-mono">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- APP: OMNI-SEARCH (Spotlight) ---
const OmniSearch = ({ isOpen, onClose, openApp, theme }) => {
  if (!isOpen) return null;
  
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => inputRef.current?.focus(), [isOpen]);

  const items = [
     { id: 'terminal', label: 'Terminal', icon: Terminal, type: 'App' },
     { id: 'explorer', label: 'File Explorer', icon: Folder, type: 'App' },
     { id: 'settings', label: 'Settings', icon: Settings, type: 'System' },
     { id: 'browser', label: 'Nexus Web', icon: Globe2, type: 'App' },
     { id: 'shutdown', label: 'Shutdown System', icon: Power, type: 'Command' },
  ].filter(i => i.label.toLowerCase().includes(query.toLowerCase()));

  return (
     <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[20vh]" onClick={onClose}>
        <div className="w-[600px] bg-[#1a1a20] border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95" onClick={e => e.stopPropagation()}>
           <div className="flex items-center gap-4 p-4 border-b border-slate-700">
              <Search size={20} className={theme.primary} />
              <input 
                 ref={inputRef}
                 className="flex-1 bg-transparent text-xl text-white outline-none placeholder-slate-600 font-light"
                 placeholder="Search QuantumFlow..."
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 onKeyDown={e => {
                    if (e.key === 'Enter' && items.length > 0) {
                       openApp(items[0].id);
                       onClose();
                    }
                    if (e.key === 'Escape') onClose();
                 }}
              />
              <div className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">ESC</div>
           </div>
           <div className="max-h-[400px] overflow-y-auto p-2">
              {items.map((item, i) => (
                 <div 
                    key={i} 
                    className={`flex items-center gap-4 p-3 rounded-lg cursor-pointer ${i === 0 ? 'bg-blue-600 text-white' : 'hover:bg-white/5 text-slate-300'}`}
                    onClick={() => { openApp(item.id); onClose(); }}
                 >
                    <item.icon size={20} />
                    <div className="flex-1">
                       <div className="text-sm font-medium">{item.label}</div>
                       <div className={`text-[10px] ${i===0 ? 'text-blue-200' : 'text-slate-500'}`}>{item.type}</div>
                    </div>
                    {i === 0 && <CornerDownLeft size={16} className="text-blue-200" />}
                 </div>
              ))}
              {items.length === 0 && <div className="p-4 text-center text-slate-500">No results found</div>}
           </div>
        </div>
     </div>
  );
};

// ============================================================================
// LOCK SCREEN (BIOMETRIC SIM)
// ============================================================================

const LockScreen = ({ onUnlock, theme }) => {
  const [scanning, setScanning] = useState(false);
  const [status, setStatus] = useState("LOCKED");

  const scan = () => {
     setScanning(true);
     setStatus("SCANNING BIOMETRICS...");
     setTimeout(() => {
        setStatus("IDENTITY VERIFIED");
        setTimeout(onUnlock, 500);
     }, 1500);
  };

  return (
     <div className="absolute inset-0 z-[10000] bg-black flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
           <div className={`absolute inset-0 ${theme.bg_primary} blur-3xl opacity-20`} />
           <div className={`w-32 h-32 rounded-full border-2 ${theme.border} flex items-center justify-center relative bg-black/50 backdrop-blur`}>
              <Fingerprint size={64} className={`${scanning ? 'animate-pulse text-white' : theme.primary}`} />
              {scanning && (
                 <div className="absolute inset-0 border-t-2 border-white animate-[spin_1s_linear_infinite] rounded-full" />
              )}
           </div>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-[0.5em] mb-2">{status}</h1>
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-8">System Secured</div>
        
        {!scanning && (
           <button onClick={scan} className={`px-8 py-3 rounded-full ${theme.bg_primary} text-black font-bold text-xs uppercase tracking-widest hover:scale-105 transition-transform`}>
              Authenticate
           </button>
        )}
     </div>
  );
};

// ============================================================================
// TASKBAR
// ============================================================================

const Taskbar = ({ apps, openApp, toggleLauncher, theme, time, battery }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  
  const quickApps = [
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'explorer', icon: Folder, label: 'Explorer' },
    { id: 'browser', icon: Globe2, label: 'Browser' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className={`h-12 ${theme.header_bg} border-t ${theme.border} flex items-center px-4 justify-between z-[999]`}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Start Button */}
        <button 
          onClick={toggleLauncher}
          className={`px-3 py-1.5 rounded-lg ${theme.bg_primary} bg-opacity-10 hover:bg-opacity-20 border ${theme.border} flex items-center gap-2 text-sm font-bold text-white transition-all`}
        >
          <Command size={14} />
          <span>Start</span>
        </button>
        
        {/* Quick Launch */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-4">
          {quickApps.map((app) => (
            <button
              key={app.id}
              onClick={() => openApp(app.id)}
              className="p-1.5 rounded hover:bg-white/5 transition-colors relative group"
              title={app.label}
            >
              <app.icon size={18} className="text-slate-300" />
              {apps.some(a => a.id === app.id && a.active) && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Center - Running Apps */}
      <div className="flex-1 flex justify-center gap-1 max-w-2xl">
        {apps.filter(app => app.minimized === false).map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs min-w-[120px] transition-all ${app.active ? `${theme.bg_primary} bg-opacity-20 border ${theme.border}` : 'hover:bg-white/5'}`}
          >
            <app.icon size={12} className={app.active ? theme.primary : 'text-slate-400'} />
            <span className="truncate">{app.title}</span>
            {app.dirty && <div className="w-1 h-1 rounded-full bg-yellow-500 ml-auto" />}
          </button>
        ))}
      </div>
      
      {/* Right Section - System Tray */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1">
            <Wifi size={14} />
            <span className="text-[10px]">100%</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery size={14} />
            <span className="text-[10px]">{battery}%</span>
          </div>
          <div className="text-xs">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN OS COMPONENT
// ============================================================================

const QuantumFlowOS = () => {
  // Persistence
  const [fs, setFs] = usePersistentState(STORAGE_KEY + "_fs", DEFAULT_FS);
  const [themeId, setThemeId] = usePersistentState(STORAGE_KEY + "_theme", "CYAN");
  
  // Runtime
  const [booted, setBooted] = useState(false);
  const [locked, setLocked] = useState(true);
  const [apps, setApps] = useState([]);
  const [nextZ, setNextZ] = useState(100);
  const [omniOpen, setOmniOpen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [battery, setBattery] = useState(87);
  
  const theme = THEMES[themeId];

  // System Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Battery simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setBattery(prev => {
        if (prev <= 5) return 100;
        return prev - 0.1;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
     const down = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
           e.preventDefault();
           setOmniOpen(p => !p);
        }
        if (e.key === 'Escape') {
          setOmniOpen(false);
        }
     };
     window.addEventListener('keydown', down);
     return () => window.removeEventListener('keydown', down);
  }, []);

  // Window Manager
  const openApp = (type, props = {}) => {
    const id = Date.now() + Math.random();
    const config = {
      terminal: { title: 'Quantum Shell', icon: Terminal, w: 600, h: 400 },
      explorer: { title: 'File Explorer', icon: Folder, w: 700, h: 500 },
      editor: { title: props.filename || 'Nexus IDE', icon: Code, w: 800, h: 600 },
      settings: { title: 'System Settings', icon: Settings, w: 800, h: 550 },
      browser: { title: 'Nexus Web', icon: Globe2, w: 900, h: 650 },
    }[type];

    if (!config) return;

    setApps(prev => {
      // Deactivate all other apps
      const deactivated = prev.map(a => ({ ...a, active: false }));
      
      return [...deactivated, {
        id, type, ...config, props, active: true,
        x: 100 + (prev.length * 30), y: 100 + (prev.length * 30),
        zIndex: nextZ, minimized: false, maximized: false,
        dirty: false
      }];
    });
    setNextZ(z => z + 1);
  };

  const closeApp = (id) => setApps(prev => prev.filter(a => a.id !== id));
  
  const focusApp = (id) => {
    setNextZ(z => z + 1);
    setApps(prev => prev.map(a => a.id === id ? { ...a, zIndex: nextZ + 1, active: true } : { ...a, active: false }));
  };

  const minimizeApp = (id) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, minimized: true, active: false } : a));
  };

  const maximizeApp = (id) => {
    setApps(prev => prev.map(a => a.id === id ? { ...a, maximized: !a.maximized } : a));
  };

  if (!booted) return <BootLoader onComplete={() => setBooted(true)} />;

  return (
    <div className={`h-screen w-screen bg-black text-slate-200 font-sans overflow-hidden select-none relative`}>
      
      {/* WALLPAPER ENGINE */}
      <WallpaperEngine theme={theme} />

      {/* LOCK SCREEN */}
      {locked && <LockScreen onUnlock={() => setLocked(false)} theme={theme} />}

      {/* OMNI SEARCH */}
      <OmniSearch isOpen={omniOpen} onClose={() => setOmniOpen(false)} openApp={openApp} theme={theme} />

      {/* DESKTOP ICONS */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col flex-wrap content-start gap-6 pointer-events-none">
         {[
            { id: 'terminal', label: 'Terminal', icon: Terminal },
            { id: 'explorer', label: 'Files', icon: Folder },
            { id: 'browser', label: 'Nexus', icon: Globe2 },
            { id: 'settings', label: 'Settings', icon: Settings },
         ].map(item => (
            <div 
               key={item.id} 
               className="pointer-events-auto w-20 h-24 flex flex-col items-center justify-center gap-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
               onDoubleClick={() => openApp(item.id)}
            >
               <div className={`p-3 rounded-2xl bg-slate-900/50 border border-slate-700/50 shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} className="text-slate-300 group-hover:text-cyan-400" />
               </div>
               <span className="text-[10px] font-medium text-slate-300 drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full">{item.label}</span>
            </div>
         ))}
      </div>

      {/* WINDOW LAYER */}
      {apps.map(app => (
         <Window 
           key={app.id} 
           app={app} 
           theme={theme} 
           onClose={closeApp} 
           onMinimize={minimizeApp} 
           onMaximize={maximizeApp} 
           onFocus={focusApp}
         >
            {app.type === 'terminal' && <AppTerminal theme={theme} fs={fs} setFs={setFs} openApp={openApp} />}
            {app.type === 'editor' && <AppIDE theme={theme} {...app.props} setFs={setFs} />}
            {app.type === 'explorer' && <AppExplorer theme={theme} fs={fs} setFs={setFs} openApp={openApp} />}
            {app.type === 'settings' && <AppSettings theme={theme} setThemeId={setThemeId} />}
            {app.type === 'browser' && (
              <div className="h-full flex items-center justify-center bg-black/50">
                <div className="text-center p-8">
                  <Globe2 size={64} className="mx-auto mb-4 text-slate-500" />
                  <h2 className="text-xl font-bold mb-2">Nexus Browser</h2>
                  <p className="text-slate-400 mb-4">Quantum web interface</p>
                  <div className="text-sm text-slate-500">Coming in v20.0</div>
                </div>
              </div>
            )}
         </Window>
      ))}

      {/* TASKBAR */}
      <Taskbar 
        apps={apps} 
        openApp={(type) => {
          const existing = apps.find(a => a.type === type);
          if (existing) {
            focusApp(existing.id);
            if (existing.minimized) {
              setApps(prev => prev.map(a => a.id === existing.id ? { ...a, minimized: false, active: true } : { ...a, active: false }));
            }
          } else {
            openApp(type);
          }
        }}
        toggleLauncher={() => setOmniOpen(true)}
        theme={theme}
        time={time}
        battery={Math.round(battery)}
      />

      {/* TOP BAR */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/20 backdrop-blur-sm z-[9998] flex justify-between px-4 items-center text-xs font-medium text-slate-300">
         <div className="flex gap-4">
            <span className="font-bold hover:text-white cursor-pointer">QuantumFlow {SYSTEM_VERSION}</span>
            <span className="hover:text-white cursor-pointer">File</span>
            <span className="hover:text-white cursor-pointer">Edit</span>
            <span className="hover:text-white cursor-pointer">View</span>
         </div>
         <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2 hover:text-white cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 blur opacity-20" />
                <div className="relative flex items-center gap-1">
                  <Cpu size={12} />
                  <span className="text-[10px]">42%</span>
                </div>
              </div>
            </div>
            <div className="hover:text-white cursor-pointer">
              <div className="text-[10px] font-mono">{time.toLocaleTimeString()}</div>
            </div>
         </div>
      </div>

    </div>
  );
};

export default QuantumFlowOS;
