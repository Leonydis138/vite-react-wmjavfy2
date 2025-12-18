import React, { useState, useEffect, useRef } from 'react';
import { Analytics } from '@vercel/analytics/react';
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
  Users, Send, Paperclip, Fingerprint, Network, Scan, Minimize,
  BarChart3, TrendingUp, HardDrive as HDD, Package, Webhook,
  Calendar, Mail, Phone, MapPin, Database as DB, ShieldCheck,
  KeyRound, CloudRain, Wind, ThermometerSun, Droplets, Navigation,
  Satellite, AlertCircle, Check, XCircle, Info, ExternalLink
} from 'lucide-react';

// ============================================================================
// REAL DATA SERVICES
// ============================================================================

// Real-time weather API integration
const WeatherService = {
  async getWeather(city = "New York") {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m`
      );
      const data = await response.json();
      return {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        pressure: data.current.pressure_msl,
        cloudCover: data.current.cloud_cover,
        weatherCode: data.current.weather_code
      };
    } catch (error) {
      // Fallback data
      return {
        temperature: 22.5,
        humidity: 65,
        windSpeed: 12.3,
        windDirection: 180,
        pressure: 1013,
        cloudCover: 40,
        weatherCode: 0
      };
    }
  }
};

// System monitoring service
const SystemMonitor = {
  getLiveSystemStats() {
    const memory = {
      total: 16384, // MB
      used: Math.floor(Math.random() * 8000) + 4000,
      cached: Math.floor(Math.random() * 2000) + 1000,
      free: 0 // Will calculate
    };
    memory.free = memory.total - memory.used - memory.cached;
    
    return {
      cpu: {
        usage: Math.floor(Math.random() * 30) + 20,
        cores: navigator.hardwareConcurrency || 8,
        temperature: 45 + Math.floor(Math.random() * 20),
        frequency: 3.2 + Math.random() * 0.8
      },
      memory: {
        ...memory,
        percentage: Math.round((memory.used / memory.total) * 100)
      },
      storage: {
        total: 512000, // MB
        used: 245000 + Math.floor(Math.random() * 50000),
        free: 0, // Will calculate
        percentage: 0
      },
      network: {
        up: Math.floor(Math.random() * 50) + 10,
        down: Math.floor(Math.random() * 200) + 50,
        latency: Math.floor(Math.random() * 50) + 20
      },
      processes: 142 + Math.floor(Math.random() * 30),
      uptime: Date.now() - performance.timeOrigin
    };
  }
};

// Crypto price service
const CryptoService = {
  async getPrices() {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,cardano&vs_currencies=usd&include_24hr_change=true'
      );
      const data = await response.json();
      return {
        bitcoin: { price: data.bitcoin?.usd || 0, change: data.bitcoin?.usd_24h_change || 0 },
        ethereum: { price: data.ethereum?.usd || 0, change: data.ethereum?.usd_24h_change || 0 },
        solana: { price: data.solana?.usd || 0, change: data.solana?.usd_24h_change || 0 },
        cardano: { price: data.cardano?.usd || 0, change: data.cardano?.usd_24h_change || 0 }
      };
    } catch (error) {
      return {
        bitcoin: { price: 43567.89, change: 2.34 },
        ethereum: { price: 2389.45, change: -1.23 },
        solana: { price: 112.78, change: 5.67 },
        cardano: { price: 0.56, change: 0.89 }
      };
    }
  }
};

// News service
const NewsService = {
  async getTechNews() {
    try {
      const response = await fetch(
        'https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=5&apiKey=demo' // Replace with your API key
      );
      const data = await response.json();
      return data.articles || [];
    } catch (error) {
      return [
        { title: "Quantum Computing Breakthrough Announced", source: { name: "TechCrunch" } },
        { title: "New AI Model Surpasses Human Performance", source: { name: "MIT Review" } },
        { title: "Web3 Infrastructure Sees Massive Growth", source: { name: "CoinDesk" } },
        { title: "Cybersecurity Threats at All-Time High", source: { name: "Wired" } }
      ];
    }
  }
};

// ============================================================================
// TOP MENU COMPONENT (Enhanced)
// ============================================================================

const TopMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [networkStatus, setNetworkStatus] = useState({
    online: navigator.onLine,
    type: navigator.connection?.effectiveType || 'unknown'
  });
  const menuRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => setNetworkStatus(s => ({ ...s, online: true }));
    const handleOffline = () => setNetworkStatus(s => ({ ...s, online: false }));
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const menuItems = {
    file: [
      { label: "New Window", shortcut: "Ctrl+N", action: () => console.log("New Window") },
      { label: "Open...", shortcut: "Ctrl+O", action: () => console.log("Open") },
      { label: "Save", shortcut: "Ctrl+S", action: () => console.log("Save") },
      { type: "separator" },
      { label: "Print", shortcut: "Ctrl+P", action: () => window.print() },
      { type: "separator" },
      { label: "Exit", shortcut: "Alt+F4", action: () => console.log("Exit") }
    ],
    edit: [
      { label: "Undo", shortcut: "Ctrl+Z", action: () => console.log("Undo") },
      { label: "Redo", shortcut: "Ctrl+Y", action: () => console.log("Redo") },
      { type: "separator" },
      { label: "Cut", shortcut: "Ctrl+X", action: () => console.log("Cut") },
      { label: "Copy", shortcut: "Ctrl+C", action: () => console.log("Copy") },
      { label: "Paste", shortcut: "Ctrl+V", action: () => console.log("Paste") },
      { type: "separator" },
      { label: "Find", shortcut: "Ctrl+F", action: () => console.log("Find") },
      { label: "Replace", shortcut: "Ctrl+H", action: () => console.log("Replace") }
    ],
    view: [
      { label: "Zoom In", shortcut: "Ctrl++", action: () => console.log("Zoom In") },
      { label: "Zoom Out", shortcut: "Ctrl+-", action: () => console.log("Zoom Out") },
      { label: "Reset Zoom", shortcut: "Ctrl+0", action: () => console.log("Reset Zoom") },
      { type: "separator" },
      { label: "Fullscreen", shortcut: "F11", action: () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }},
      { label: "Developer Tools", shortcut: "Ctrl+Shift+I", action: () => {
        // Toggle browser dev tools (works in some browsers)
        console.log("Dev tools toggle");
      }}
    ],
    tools: [
      { label: "System Monitor", icon: Activity, action: () => window.dispatchEvent(new CustomEvent('openApp', { detail: 'monitor' })) },
      { label: "Network Analyzer", icon: Network, action: () => window.dispatchEvent(new CustomEvent('openApp', { detail: 'network' })) },
      { label: "Security Audit", icon: ShieldCheck, action: () => window.dispatchEvent(new CustomEvent('openApp', { detail: 'security' })) },
      { type: "separator" },
      { label: "Disk Cleanup", icon: Trash2, action: () => console.log("Disk Cleanup") },
      { label: "Update System", icon: Download, action: () => console.log("Update System") }
    ]
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setActiveMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <div className="flex gap-4 items-center">
        {Object.entries(menuItems).map(([key, items]) => (
          <div key={key} className="relative">
            <button 
              className={`px-2 py-1 text-xs font-medium rounded hover:bg-white/10 transition-colors ${activeMenu === key ? 'bg-white/10' : ''}`}
              onClick={() => setActiveMenu(activeMenu === key ? null : key)}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
            {activeMenu === key && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl z-[10000]">
                {items.map((item, i) => (
                  item.type === "separator" ? (
                    <div key={i} className="h-px bg-slate-700 my-1" />
                  ) : (
                    <button
                      key={i}
                      className="w-full px-3 py-2 text-left text-xs text-slate-300 hover:bg-slate-800 flex justify-between items-center gap-2"
                      onClick={item.action}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon size={12} />}
                        <span>{item.label}</span>
                      </div>
                      <span className="text-slate-500 text-[10px]">{item.shortcut}</span>
                    </button>
                  )
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Network Status Indicator */}
        <div className="flex items-center gap-2 ml-4">
          <div className={`w-2 h-2 rounded-full ${networkStatus.online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] text-slate-400">
            {networkStatus.online ? `Online (${networkStatus.type})` : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );
};

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
         "todo.md": { type: "file", content: "- Upgrade Kernel\n- Fix Null Pointer in Neural Net" },
         "presentation.pdf": { type: "file", content: "QuantumFlow OS Overview" },
         "meeting_notes.txt": { type: "file", content: "Team meeting: Discuss AI integration" }
      },
      "documents": {
        "manifesto.txt": { type: "file", content: "We are the architects of the new age." },
        "keys.pem": { type: "file", content: "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQE..." },
        "budget_2024.xlsx": { type: "file", content: "Quarterly financial projections" }
      },
      "code": {
         "quantum.js": { type: "file", content: "class Qubit {\n  constructor() {\n    this.state = [1, 0]; // |0>\n  }\n  hadamard() {\n    // Apply H-gate\n  }\n}" },
         "style.css": { type: "file", content: "body { background: #000; color: #0ff; }" },
         "api.ts": { type: "file", content: "interface QuantumAPI {\n  compute(params: any): Promise<any>;\n}" }
      },
      "config": {
         "sys.conf": { type: "file", content: "AUDIO_ENGINE=TRUE\nPHYSICS=ENABLED\nWALLPAPER=LIVE\nAI_ASSISTANT=ENABLED" },
         "network.conf": { type: "file", content: "DNS=8.8.8.8\nPROXY_DISABLED\nSECURE_DNS=TRUE" }
      },
      "media": {
        "wallpapers": {
          "cyberpunk.jpg": { type: "file", content: "" },
          "matrix.png": { type: "file", content: "" }
        }
      }
    }
  },
  "sys": {
    "logs": {
      "boot.log": { type: "file", content: "Kernel loaded.\nAudio subsystem initialized.\nNeural link active.\nSecurity systems online." },
      "system.log": { type: "file", content: "CPU temp: 45°C\nMemory: 8.2GB/16GB\nNetwork: 245 Mbps" }
    },
    "bin": {
      "qshell": { type: "file", content: "#!/bin/bash\necho 'Quantum Shell v2.0'" },
      "quantize": { type: "file", content: "#!/bin/bash\n# Quantum file compression" }
    }
  }
};

// ============================================================================
// ENHANCED BOOTLOADER
// ============================================================================

const BootLoader = ({ onComplete }) => {
  const [log, setLog] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    "Checking hardware compatibility",
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
    "Testing network connectivity",
    "Verifying file system integrity",
    "Loading user profiles",
    "Starting system services",
    "Finalizing initialization"
  ];

  const stepsCompleted = useRef(0);
  const timeoutRefs = useRef([]);

  useEffect(() => {
    if (isComplete) return;
    
    console.log("BootLoader: Starting...");
    
    const totalSteps = steps.length;
    
    const runNextStep = () => {
      if (stepsCompleted.current >= totalSteps) {
        console.log("BootLoader: All steps completed");
        setProgress(100);
        
        const finalTimeout = setTimeout(() => {
          console.log("BootLoader: Calling onComplete");
          setIsComplete(true);
          onComplete();
        }, 500);
        
        timeoutRefs.current.push(finalTimeout);
        return;
      }
      
      const currentStepIndex = stepsCompleted.current;
      const stepText = steps[currentStepIndex];
      
      // Simulate different step durations
      const stepDuration = 150 + Math.random() * 100;
      
      setLog(prev => {
        const newLog = [
          `[${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}] ${stepText}`,
          ...prev
        ];
        return newLog.slice(0, 15);
      });
      
      const newProgress = ((currentStepIndex + 1) / totalSteps) * 100;
      setProgress(newProgress);
      
      stepsCompleted.current += 1;
      
      const timeoutId = setTimeout(runNextStep, stepDuration);
      timeoutRefs.current.push(timeoutId);
    };
    
    const initialTimeout = setTimeout(runNextStep, 200);
    timeoutRefs.current.push(initialTimeout);
    
    return () => {
      console.log("BootLoader: Cleanup - clearing timeouts");
      timeoutRefs.current.forEach(id => clearTimeout(id));
    };
  }, [onComplete, isComplete]);

  return (
    <div className="fixed inset-0 bg-black text-cyan-500 font-mono text-xs flex flex-col items-center justify-center z-[9999]">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-cyan-500 blur-3xl opacity-20 animate-pulse" />
        <div className="relative z-10">
          <Hexagon size={96} className="animate-spin text-cyan-400" strokeWidth={0.5} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl tracking-tighter">QF</div>
      </div>
      
      <div className="w-96 space-y-4">
        <div className="flex justify-between text-[10px] uppercase text-slate-500">
          <span>KERNEL_INIT_SEQUENCE</span>
          <span>{Math.round(progress)}%</span>
        </div>
        
        <div className="h-0.5 bg-slate-900 overflow-hidden relative rounded-full">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 ease-out shadow-[0_0_20px_#0ea5e9]" 
            style={{ width: `${progress}%` }} 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
        
        <div className="h-32 font-mono text-[10px] text-slate-400 overflow-y-auto border border-slate-800 rounded p-3 bg-black/50">
          {log.length === 0 ? (
            <div className="text-slate-600">Starting boot sequence...</div>
          ) : (
            log.map((l, i) => (
              <div key={i} className="py-0.5 border-b border-slate-800/50 last:border-0">
                <span className="text-cyan-500 mr-2">▶</span>
                <span className={l.includes("ERROR") ? "text-red-400" : l.includes("WARN") ? "text-yellow-400" : ""}>
                  {l}
                </span>
              </div>
            ))
          )}
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-[9px] text-slate-600">
          <div className="text-center">
            <div className="font-bold">SYSTEM</div>
            <div>QuantumFlow</div>
          </div>
          <div className="text-center">
            <div className="font-bold">VERSION</div>
            <div>{SYSTEM_VERSION}</div>
          </div>
          <div className="text-center">
            <div className="font-bold">BUILD</div>
            <div>#20241218</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ENHANCED WALLPAPER ENGINE
// ============================================================================

const WallpaperEngine = ({ th
