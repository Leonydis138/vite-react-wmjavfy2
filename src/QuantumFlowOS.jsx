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

const WallpaperEngine = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    
    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    window.addEventListener('resize', resize);
    resize();

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 3,
      vy: (Math.random() - 0.5) * 3,
      size: Math.random() * 2 + 0.5,
      color: theme.id === 'CYAN' ? '#22d3ee' : 
             theme.id === 'PURPLE' ? '#a855f7' : 
             theme.id === 'EMERALD' ? '#10b981' : '#ef4444'
    }));

    const matrixChars = "01量子コンピューター";
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);
    const speeds = Array(columns).fill(() => 0.5 + Math.random());

    let radarAngle = 0;
    let time = 0;

    const draw = () => {
      time += 0.01;
      
      // Clear with fade effect
      ctx.fillStyle = theme.id === 'EMERALD' ? 'rgba(0, 20, 0, 0.05)' : 
                     theme.id === 'PURPLE' ? 'rgba(10, 0, 20, 0.05)' : 
                     theme.id === 'CRIMSON' ? 'rgba(20, 0, 0, 0.05)' : 'rgba(0, 10, 20, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (theme.wallpaper === 'particles') {
        particles.forEach((p, i) => {
          p.x += p.vx + Math.sin(time + i) * 0.5;
          p.y += p.vy + Math.cos(time + i) * 0.5;
          
          if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
          if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();

          particles.slice(i + 1).forEach(p2 => {
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = `${p.color}${Math.floor((1 - distance/100) * 40).toString(16).padStart(2, '0')}`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        });
      } 
      else if (theme.wallpaper === 'grid') {
        ctx.strokeStyle = theme.id === 'CYAN' ? 'rgba(34, 211, 238, 0.1)' : 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        const gridSize = 60;
        
        // Animated perspective grid
        for (let y = 0; y < canvas.height; y += gridSize) {
          const wave = Math.sin(time + y * 0.01) * 5;
          ctx.beginPath();
          ctx.moveTo(0, y + wave);
          ctx.lineTo(canvas.width, y + wave);
          ctx.stroke();
        }
        
        for (let x = 0; x < canvas.width; x += gridSize) {
          const wave = Math.cos(time + x * 0.01) * 5;
          ctx.beginPath();
          ctx.moveTo(x + wave, 0);
          ctx.lineTo(x + wave, canvas.height);
          ctx.stroke();
        }
      }
      else if (theme.wallpaper === 'matrix') {
        ctx.font = '16px monospace';
        for (let i = 0; i < drops.length; i++) {
          const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          const intensity = Math.random();
          
          ctx.fillStyle = `rgba(0, 255, 0, ${intensity})`;
          ctx.fillText(char, i * 20, drops[i] * 20);
          
          if (drops[i] * 20 > canvas.height && Math.random() > 0.97) {
            drops[i] = 0;
          }
          drops[i] += speeds[i]();
        }
      }
      else if (theme.wallpaper === 'radar') {
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        radarAngle += 0.03;
        
        // Radar rings
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.2)';
        ctx.lineWidth = 1;
        for (let r = 50; r <= 400; r += 50) {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Radar sweep with gradient
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(radarAngle);
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0)');
        gradient.addColorStop(0.7, 'rgba(239, 68, 68, 0.2)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, 400, 0, Math.PI * 0.25);
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
  
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  
  return [state, setState];
};

// ============================================================================
// ENHANCED WINDOW COMPONENT
// ============================================================================

const Window = ({ app, onClose, onMinimize, onMaximize, onFocus, theme, children }) => {
  if (app.minimized) return null;

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const headerRef = useRef(null);

  const handleMouseDown = (e) => {
    if (!app.maximized && headerRef.current && headerRef.current.contains(e.target)) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - app.x,
        y: e.clientY - app.y
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && !app.maximized) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Keep window within bounds
        const boundedX = Math.max(0, Math.min(newX, window.innerWidth - app.w));
        const boundedY = Math.max(0, Math.min(newY, window.innerHeight - app.h));
        
        app.x = boundedX;
        app.y = boundedY;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset, app]);

  return (
    <div 
      className={`absolute flex flex-col rounded-lg overflow-hidden border shadow-2xl backdrop-blur-2xl transition-all duration-200 ${theme.window_bg} ${theme.border} ${app.active ? 'shadow-' + theme.accent + '-500/20 z-50' : 'z-0 grayscale-[0.3]'}`}
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
      <div 
        ref={headerRef}
        className={`h-9 ${theme.header_bg} border-b ${theme.border} flex items-center justify-between px-3 select-none cursor-grab active:cursor-grabbing`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-200 uppercase tracking-widest">
           <app.icon size={12} className={theme.primary} />
           {app.title}
           {app.dirty && <span className="text-yellow-500 ml-1">●</span>}
        </div>
        <div className="flex items-center gap-1.5">
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               onMinimize(app.id); 
             }} 
             className="w-3 h-3 rounded-full bg-yellow-500/20 hover:bg-yellow-500 border border-yellow-500/50 transition-colors flex items-center justify-center group"
             title="Minimize"
           >
             <Minus size={8} className="text-yellow-500 group-hover:scale-110 transition-transform" />
           </button>
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               onMaximize(app.id); 
             }} 
             className="w-3 h-3 rounded-full bg-emerald-500/20 hover:bg-emerald-500 border border-emerald-500/50 transition-colors flex items-center justify-center group"
             title={app.maximized ? "Restore" : "Maximize"}
           >
             {app.maximized ? 
               <Minimize2 size={8} className="text-emerald-500 group-hover:scale-110 transition-transform" /> : 
               <Maximize2 size={8} className="text-emerald-500 group-hover:scale-110 transition-transform" />
             }
           </button>
           <button 
             onClick={(e) => { 
               e.stopPropagation(); 
               onClose(app.id); 
             }} 
             className="w-3 h-3 rounded-full bg-red-500/20 hover:bg-red-500 border border-red-500/50 transition-colors flex items-center justify-center group"
             title="Close"
           >
             <X size={8} className="text-red-500 group-hover:scale-110 transition-transform" />
           </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative flex flex-col">
         {children}
      </div>
    </div>
  );
};

// ============================================================================
// ENHANCED APPS
// ============================================================================

// --- APP: SYSTEM MONITOR (Real-time) ---
const AppSystemMonitor = ({ theme }) => {
  const [stats, setStats] = useState(SystemMonitor.getLiveSystemStats());
  const [cpuHistory, setCpuHistory] = useState(Array(60).fill(0));
  const [memHistory, setMemHistory] = useState(Array(60).fill(0));
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const interval = setInterval(() => {
      const newStats = SystemMonitor.getLiveSystemStats();
      setStats(newStats);
      
      // Update history
      setCpuHistory(prev => [...prev.slice(1), newStats.cpu.usage]);
      setMemHistory(prev => [...prev.slice(1), newStats.memory.percentage]);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  const formatUptime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="h-full flex flex-col bg-black/50">
      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {['overview', 'processes', 'network', 'storage'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-medium transition-colors ${activeTab === tab ? `${theme.primary} border-b-2 ${theme.border}` : 'text-slate-400 hover:text-white'}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* CPU Section */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className={theme.primary} />
                  <h3 className="font-bold">Processor</h3>
                </div>
                <div className="text-2xl font-bold">{stats.cpu.usage}%</div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                  style={{ width: `${stats.cpu.usage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-slate-400">Cores</div>
                  <div className="font-bold text-lg">{stats.cpu.cores}</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-slate-400">Temp</div>
                  <div className="font-bold text-lg">{stats.cpu.temperature}°C</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-slate-400">Freq</div>
                  <div className="font-bold text-lg">{stats.cpu.frequency.toFixed(1)}GHz</div>
                </div>
              </div>
            </div>

            {/* Memory Section */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <HardDrive size={16} className={theme.primary} />
                  <h3 className="font-bold">Memory</h3>
                </div>
                <div className="text-2xl font-bold">{stats.memory.percentage}%</div>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                  style={{ width: `${stats.memory.percentage}%` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-xs">
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-slate-400">Used</div>
                  <div className="font-bold">{formatBytes(stats.memory.used * 1024 * 1024)}</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-slate-400">Free</div>
                  <div className="font-bold">{formatBytes(stats.memory.free * 1024 * 1024)}</div>
                </div>
                <div className="text-center p-2 bg-white/5 rounded">
                  <div className="text-slate-400">Total</div>
                  <div className="font-bold">{formatBytes(stats.memory.total * 1024 * 1024)}</div>
                </div>
              </div>
            </div>

            {/* Network Section */}
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Wifi size={16} className={theme.primary} />
                <h3 className="font-bold">Network</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-white/5 rounded">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-xs">Upload</div>
                    <TrendingUp size={12} className="text-emerald-500" />
                  </div>
                  <div className="text-lg font-bold mt-1">{stats.network.up} Mbps</div>
                </div>
                <div className="p-3 bg-white/5 rounded">
                  <div className="flex items-center justify-between">
                    <div className="text-slate-400 text-xs">Download</div>
                    <TrendingUp size={12} className="text-blue-500" />
                  </div>
                  <div className="text-lg font-bold mt-1">{stats.network.down} Mbps</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'processes' && (
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-xs font-medium">Process Name</span>
              <span className="text-xs font-medium">CPU %</span>
            </div>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2 hover:bg-white/5 rounded">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-sm">Process_{i + 1}</span>
                </div>
                <span className="text-sm">{Math.floor(Math.random() * 30)}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="border-t border-white/10 p-3 flex justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Activity size={12} />
            <span>{stats.processes} Processes</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>Uptime: {formatUptime(stats.uptime)}</span>
          </div>
        </div>
        <div className="text-xs">
          Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

// --- APP: ENHANCED TERMINAL ---
const AppTerminal = ({ theme, fs, setFs, openApp }) => {
  const [history, setHistory] = useState([
    `QuantumFlow Terminal ${SYSTEM_VERSION}`,
    "Type 'help' for available commands.",
    ""
  ]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState(["home", "admin"]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView(), [history]);

  const executeCommand = (cmdLine) => {
    const [cmd, ...args] = cmdLine.trim().split(" ");
    let output = [];

    switch(cmd.toLowerCase()) {
      case 'help':
        output = [
          "Available commands:",
          "  ls [path]        - List directory contents",
          "  cd <path>        - Change directory",
          "  pwd              - Print working directory",
          "  mkdir <name>     - Create directory",
          "  touch <file>     - Create file",
          "  rm <path>        - Remove file/directory",
          "  cat <file>       - Display file contents",
          "  clear            - Clear terminal",
          "  date             - Show current date/time",
          "  sysinfo          - System information",
          "  open <app>       - Open application",
          "  help             - Show this help"
        ];
        break;

      case 'ls':
        let targetDir = fs;
        if (args[0]) {
          // Handle path navigation
          const path = args[0].startsWith('/') ? args[0].slice(1).split('/') : [...cwd, ...args[0].split('/')];
          for (const p of path) {
            if (p === '..') {
              targetDir = fs; // Simplified
            } else if (targetDir[p]) {
              targetDir = targetDir[p];
            } else {
              output = [`ls: cannot access '${args[0]}': No such file or directory`];
              break;
            }
          }
        } else {
          for (const p of cwd) {
            targetDir = targetDir[p];
          }
        }
        output = [Object.keys(targetDir || {}).join("  ")];
        break;

      case 'cd':
        if (!args[0]) {
          setCwd(["home", "admin"]);
          output = [];
        } else if (args[0] === '..') {
          if (cwd.length > 0) {
            setCwd(cwd.slice(0, -1));
            output = [];
          }
        } else if (args[0] === '/') {
          setCwd([]);
          output = [];
        } else {
          output = [`cd: ${args[0]}: No such directory`];
        }
        break;

      case 'pwd':
        output = [cwd.join('/') || '/'];
        break;

      case 'clear':
        setHistory([`QuantumFlow Terminal ${SYSTEM_VERSION}`, "Type 'help' for available commands.", ""]);
        return;

      case 'date':
        output = [new Date().toString()];
        break;

      case 'sysinfo':
        const stats = SystemMonitor.getLiveSystemStats();
        output = [
          `QuantumFlow OS ${SYSTEM_VERSION}`,
          `CPU: ${stats.cpu.usage}% (${stats.cpu.cores} cores)`,
          `Memory: ${stats.memory.percentage}% used`,
          `Uptime: ${Math.floor(stats.uptime / 1000 / 60)} minutes`,
          `Processes: ${stats.processes}`
        ];
        break;

      case 'open':
        if (args[0] === 'monitor') {
          openApp('monitor');
          output = ["Opening System Monitor..."];
        } else if (args[0] === 'explorer') {
          openApp('explorer');
          output = ["Opening File Explorer..."];
        } else {
          output = [`Unknown application: ${args[0]}`];
        }
        break;

      case '':
        output = [];
        break;

      default:
        output = [`Command not found: ${cmd}`];
    }

    setHistory(prev => [...prev, ...output, `${cwd.join('/') || '~'} $ ${cmdLine}`]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput("");
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      // Navigate command history
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto-completion
    }
  };

  return (
    <div className="h-full bg-black/95 p-4 font-mono text-sm overflow-y-auto text-slate-300">
      <div className="space-y-1">
        {history.map((line, i) => (
          <div key={i} className={line.includes('$') ? 'text-emerald-400' : ''}>
            {line}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-emerald-500">{cwd.join('/') || '~'} $</span>
        <input
          ref={inputRef}
          className="flex-1 bg-transparent border-none outline-none text-slate-100 caret-emerald-500"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
        />
      </div>
      <div ref={endRef} />
    </div>
  );
};

// --- APP: ENHANCED FILE EXPLORER ---
const AppExplorer = ({ theme, fs, setFs, openApp }) => {
  const [currentPath, setCurrentPath] = useState(["home", "admin"]);
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState("");

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

  const createNewFile = () => {
    const fileName = `new_file_${Date.now()}.txt`;
    setFs(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      let ptr = next;
      for (const p of currentPath) ptr = ptr[p];
      ptr[fileName] = { type: 'file', content: 'New file content' };
      return next;
    });
  };

  const createNewFolder = () => {
    const folderName = `New Folder ${Date.now()}`;
    setFs(prev => {
      const next = JSON.parse(JSON.parse(prev));
      let ptr = next;
      for (const p of currentPath) ptr = ptr[p];
      ptr[folderName] = {};
      return next;
    });
  };

  const deleteItem = (name) => {
    if (window.confirm(`Delete ${name}?`)) {
      setFs(prev => {
        const next = JSON.parse(JSON.stringify(prev));
        let ptr = next;
        for (let i = 0; i < currentPath.length; i++) {
          ptr = ptr[currentPath[i]];
        }
        delete ptr[name];
        return next;
      });
      setSelected(null);
    }
  };

  const filteredItems = Object.entries(getCurrentDir() || {})
    .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="h-full flex flex-col bg-black/50">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-white/10 bg-black/30">
        <button onClick={handleBack} className="p-1.5 rounded hover:bg-white/10">
          <ChevronUp size={14} className="rotate-270" />
        </button>
        
        <div className="flex items-center gap-1 text-xs text-slate-400 flex-1">
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

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-2 py-1 text-xs bg-white/5 border border-white/10 rounded w-32 focus:outline-none focus:border-cyan-500"
            />
          </div>
          
          <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
            <Grid size={14} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white/10' : 'hover:bg-white/5'}`}>
            <List size={14} />
          </button>
          
          <button onClick={createNewFolder} className="p-1.5 rounded hover:bg-white/5">
            <FolderPlus size={14} />
          </button>
          <button onClick={createNewFile} className="p-1.5 rounded hover:bg-white/5">
            <FilePlus size={14} />
          </button>
        </div>
      </div>

     {/* File List */}
      <div className="flex-1 overflow-auto p-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-4 gap-4">
            {filteredItems.map(([name, item]) => (
              <div
                key={name}
                className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all ${selected === name ? 'bg-cyan-500/20 border border-cyan-500/50' : 'hover:bg-white/5'}`}
                onClick={() => setSelected(name)}
                onDoubleClick={() => handleDoubleClick(name, item)}
              >
                <div className={`p-3 rounded-2xl mb-2 ${item.type === 'file' ? 'bg-blue-500/10' : 'bg-amber-500/10'}`}>
                  {item.type === "file" ? (
                    <File size={24} className="text-blue-400" />
                  ) : (
                    <Folder size={24} className="text-amber-400" />
                  )}
                </div>
                <div className="text-xs text-center text-slate-300 truncate w-full">{name}</div>
                <div className="text-[10px] text-slate-500 mt-1 uppercase">
                  {item.type} • {item.content ? `${item.content.length} chars` : 'empty'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredItems.map(([name, item]) => (
              <div
                key={name}
                className={`flex items-center gap-3 p-3 rounded cursor-pointer ${selected === name ? 'bg-cyan-500/20 border border-cyan-500/50' : 'hover:bg-white/5'}`}
                onClick={() => setSelected(name)}
                onDoubleClick={() => handleDoubleClick(name, item)}
              >
                {item.type === "file" ? (
                  <File size={16} className="text-blue-400" />
                ) : (
                  <Folder size={16} className="text-amber-400" />
                )}
                <div className="flex-1">
                  <div className="text-sm">{name}</div>
                  <div className="text-xs text-slate-500">{item.type}</div>
                </div>
                <div className="text-xs text-slate-500">
                  {item.content ? `${item.content.length} chars` : 'Directory'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="border-t border-white/10 p-3 flex justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <div>{filteredItems.length} items</div>
          {selected && (
            <div className="flex items-center gap-2">
              <span>Selected: {selected}</span>
              <button 
                onClick={() => deleteItem(selected)}
                className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 rounded text-red-400"
              >
                Delete
              </button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <HardDrive size={12} />
          <span>System FS</span>
        </div>
      </div>
    </div>
  );
};

// --- APP: CRYPTO DASHBOARD (Real-time) ---
const AppCryptoDashboard = ({ theme }) => {
  const [prices, setPrices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      const data = await CryptoService.getPrices();
      setPrices(data);
      setLoading(false);
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const coins = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', color: 'text-yellow-500' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', color: 'text-purple-500' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', color: 'text-pink-500' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', color: 'text-blue-500' }
  ];

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-2 text-slate-400">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black/50">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Bitcoin size={20} className={theme.primary} />
          Crypto Dashboard
        </h2>
        <p className="text-sm text-slate-400">Real-time market data</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {coins.map(coin => {
            const priceData = prices[coin.id];
            const change = priceData?.change || 0;
            
            return (
              <div
                key={coin.id}
                className={`bg-white/5 rounded-xl p-4 cursor-pointer transition-all hover:bg-white/10 ${selectedCoin === coin.id ? 'ring-2 ring-cyan-500' : ''}`}
                onClick={() => setSelectedCoin(coin.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${coin.color.replace('text-', 'bg-')}`} />
                      <span className="font-bold">{coin.name}</span>
                    </div>
                    <div className="text-xs text-slate-400">{coin.symbol}</div>
                  </div>
                  <div className={`text-sm font-bold ${change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                    {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                  </div>
                </div>
                <div className="text-2xl font-bold">
                  ${priceData?.price?.toLocaleString('en-US', { minimumFractionDigits: 2 }) || '0.00'}
                </div>
              </div>
            );
          })}
        </div>

        {selectedCoin && prices[selectedCoin] && (
          <div className="bg-white/5 rounded-xl p-4">
            <h3 className="font-bold mb-4">Market Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400">24h High</div>
                <div className="font-bold">${(prices[selectedCoin].price * 1.02).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-slate-400">24h Low</div>
                <div className="font-bold">${(prices[selectedCoin].price * 0.98).toFixed(2)}</div>
              </div>
              <div>
                <div className="text-slate-400">Market Cap</div>
                <div className="font-bold">
                  ${(prices[selectedCoin].price * (selectedCoin === 'bitcoin' ? 21000000 : 120000000)).toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-slate-400">Volume (24h)</div>
                <div className="font-bold">
                  ${(prices[selectedCoin].price * (selectedCoin === 'bitcoin' ? 25000 : 1000000)).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-white/10 p-3 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>Data from CoinGecko API</span>
          <span>Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

// --- APP: WEATHER DASHBOARD (Real-time) ---
const AppWeather = ({ theme }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("New York");

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      const data = await WeatherService.getWeather(location);
      setWeather(data);
      setLoading(false);
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [location]);

  const getWeatherIcon = (code) => {
    if (code <= 3) return <Sun size={24} className="text-yellow-500" />;
    if (code <= 67) return <CloudRain size={24} className="text-blue-500" />;
    return <Cloud size={24} className="text-slate-400" />;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-black/50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-2 text-slate-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black/50">
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Cloud size={20} className={theme.primary} />
            Weather Dashboard
          </h2>
          <div className="relative">
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm w-32 focus:outline-none focus:border-cyan-500"
              placeholder="City name"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-5xl font-bold">{weather.temperature}°C</div>
              <div className="text-lg mt-1">{location}</div>
              <div className="text-slate-300 mt-2">Feels like {weather.apparentTemperature}°C</div>
            </div>
            <div className="text-right">
              {getWeatherIcon(weather.weatherCode)}
              <div className="text-sm mt-2">{weather.cloudCover}% cloud cover</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets size={16} className="text-blue-400" />
              <div className="text-sm text-slate-400">Humidity</div>
            </div>
            <div className="text-2xl font-bold">{weather.humidity}%</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Wind size={16} className="text-cyan-400" />
              <div className="text-sm text-slate-400">Wind</div>
            </div>
            <div className="text-2xl font-bold">{weather.windSpeed} km/h</div>
            <div className="text-xs text-slate-400">Direction: {weather.windDirection}°</div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <ThermometerSun size={16} className="text-red-400" />
              <div className="text-sm text-slate-400">Pressure</div>
            </div>
            <div className="text-2xl font-bold">{weather.pressure} hPa</div>
          </div>
        </div>

        <div className="mt-6 bg-white/5 rounded-xl p-4">
          <h3 className="font-bold mb-4">5-Day Forecast</h3>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="text-center">
                <div className="text-sm text-slate-400">Day {i + 1}</div>
                <div className="my-2">
                  <Cloud size={20} className="mx-auto text-slate-300" />
                </div>
                <div className="font-bold">{weather.temperature + i}°C</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 p-3 text-xs text-slate-400">
        <div className="flex justify-between">
          <span>Data from Open-Meteo API</span>
          <span>Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ENHANCED SETTINGS APP
// ============================================================================

const PaletteIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" className={className}>
    <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/>
    <circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/>
    <circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/>
    <circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/>
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" strokeWidth="1.5"/>
  </svg>
);

const AppSettings = ({ theme, setThemeId }) => {
  const [activeTab, setActiveTab] = useState("theme");
  const [systemInfo, setSystemInfo] = useState({
    os: SYSTEM_VERSION,
    kernel: "Quantum Kernel 5.15.0",
    arch: navigator.platform,
    browser: navigator.userAgent.split(' ')[0],
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
    cookies: navigator.cookieEnabled ? "Enabled" : "Disabled"
  });

  const tabs = [
    { id: "theme", label: "Theme", icon: PaletteIcon },
    { id: "system", label: "System", icon: Cpu },
    { id: "network", label: "Network", icon: Wifi },
    { id: "security", label: "Security", icon: Shield },
    { id: "display", label: "Display", icon: Monitor },
    { id: "storage", label: "Storage", icon: HardDrive },
  ];

  return (
    <div className="h-full flex bg-black/50">
      <div className="w-48 border-r border-white/10 p-4 space-y-1">
        {tabs.map((tab) => (
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
              {Object.entries(systemInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between py-2 border-b border-white/10">
                  <span className="text-slate-400 capitalize">{key}</span>
                  <span className="font-mono text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-lg font-bold mb-4">Security Settings</h2>
            <div className="space-y-4">
              {[
                { label: "Firewall", enabled: true, description: "Protects against network threats" },
                { label: "Auto Updates", enabled: true, description: "Automatically install security updates" },
                { label: "Encryption", enabled: true, description: "Encrypt sensitive data" },
                { label: "Two-Factor Auth", enabled: false, description: "Add extra layer of security" },
                { label: "VPN", enabled: true, description: "Secure network connection" }
              ].map((setting) => (
                <div key={setting.label} className="flex items-center justify-between p-3 bg-white/5 rounded">
                  <div>
                    <div className="font-medium">{setting.label}</div>
                    <div className="text-sm text-slate-400">{setting.description}</div>
                  </div>
                  <button className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-emerald-500' : 'bg-slate-700'}`}>
                    <div className={`w-5 h-5 rounded-full bg-white transform transition-transform ${setting.enabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// ENHANCED OMNI-SEARCH
// ============================================================================

const OmniSearch = ({ isOpen, onClose, openApp, theme }) => {
  if (!isOpen) return null;
  
  const [query, setQuery] = useState("");
  const [recentApps, setRecentApps] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const allItems = [
    { id: 'terminal', label: 'Terminal', icon: Terminal, type: 'Application', category: 'tools' },
    { id: 'explorer', label: 'File Explorer', icon: Folder, type: 'Application', category: 'tools' },
    { id: 'monitor', label: 'System Monitor', icon: Activity, type: 'Application', category: 'monitoring' },
    { id: 'settings', label: 'Settings', icon: Settings, type: 'System', category: 'system' },
    { id: 'crypto', label: 'Crypto Dashboard', icon: Bitcoin, type: 'Finance', category: 'finance' },
    { id: 'weather', label: 'Weather', icon: Cloud, type: 'Information', category: 'info' },
    { id: 'shutdown', label: 'Shutdown System', icon: Power, type: 'Command', category: 'system' },
    { id: 'restart', label: 'Restart System', icon: RefreshCw, type: 'Command', category: 'system' },
  ];

  const filteredItems = query.trim() === '' 
    ? allItems
    : allItems.filter(item => 
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.type.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  const categories = [...new Set(filteredItems.map(item => item.category))];

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-start justify-center pt-[10vh]" onClick={onClose}>
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
              if (e.key === 'Enter' && filteredItems.length > 0) {
                openApp(filteredItems[0].id);
                onClose();
              }
              if (e.key === 'Escape') onClose();
            }}
          />
          <div className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-400">ESC</div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {query.trim() === '' && (
            <div className="p-3 border-b border-slate-800">
              <div className="text-xs text-slate-500 uppercase mb-2">Quick Actions</div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs bg-slate-800 rounded hover:bg-slate-700">
                  Open Terminal
                </button>
                <button className="px-3 py-1.5 text-xs bg-slate-800 rounded hover:bg-slate-700">
                  Check System
                </button>
              </div>
            </div>
          )}
          
          {categories.map(category => {
            const categoryItems = filteredItems.filter(item => item.category === category);
            if (categoryItems.length === 0) return null;
            
            return (
              <div key={category}>
                <div className="px-4 py-2 text-xs text-slate-500 uppercase bg-slate-900/50">
                  {category}
                </div>
                {categoryItems.map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-4 p-3 cursor-pointer ${i === 0 ? 'bg-blue-600/20' : 'hover:bg-white/5'}`}
                    onClick={() => { openApp(item.id); onClose(); }}
                  >
                    <div className={`p-2 rounded-lg ${theme.bg_primary} bg-opacity-20`}>
                      <item.icon size={18} className={theme.primary} />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-slate-400">{item.type}</div>
                    </div>
                    {i === 0 && <CornerDownLeft size={16} className="text-slate-400" />}
                  </div>
                ))}
              </div>
            );
          })}
          
          {filteredItems.length === 0 && (
            <div className="p-8 text-center">
              <Search size={32} className="mx-auto mb-2 text-slate-600" />
              <div className="text-slate-400">No results found for "{query}"</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ENHANCED TASKBAR
// ============================================================================

const Taskbar = ({ apps, openApp, toggleLauncher, theme, time, battery }) => {
  const [systemStats, setSystemStats] = useState(SystemMonitor.getLiveSystemStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(SystemMonitor.getLiveSystemStats());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const quickApps = [
    { id: 'terminal', icon: Terminal, label: 'Terminal' },
    { id: 'explorer', icon: Folder, label: 'Explorer' },
    { id: 'monitor', icon: Activity, label: 'Monitor' },
    { id: 'crypto', icon: Bitcoin, label: 'Crypto' },
    { id: 'weather', icon: Cloud, label: 'Weather' },
  ];

  return (
    <div className={`h-12 ${theme.header_bg} border-t ${theme.border} flex items-center px-4 justify-between z-[999]`}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Start Button */}
        <button 
          onClick={toggleLauncher}
          className={`px-3 py-1.5 rounded-lg ${theme.bg_primary} bg-opacity-10 hover:bg-opacity-20 border ${theme.border} flex items-center gap-2 text-sm font-bold text-white transition-all hover:scale-105`}
        >
          <Command size={14} />
          <span>Start</span>
        </button>
        
        {/* Quick Launch */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-4">
          {quickApps.map((app) => {
            const isRunning = apps.some(a => a.type === app.id);
            return (
              <button
                key={app.id}
                onClick={() => openApp(app.id)}
                className="p-1.5 rounded hover:bg-white/5 transition-colors relative group"
                title={app.label}
              >
                <app.icon size={18} className={`${isRunning ? theme.primary : 'text-slate-300'}`} />
                {isRunning && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyan-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Center - Running Apps */}
      <div className="flex-1 flex justify-center gap-1 max-w-2xl">
        {apps.filter(app => app.minimized === false).map((app) => (
          <button
            key={app.id}
            onClick={() => openApp(app.id)}
            className={`px-3 py-1.5 rounded flex items-center gap-2 text-xs min-w-[140px] transition-all ${app.active ? `${theme.bg_primary} bg-opacity-20 border ${theme.border}` : 'hover:bg-white/5'}`}
          >
            <app.icon size={12} className={app.active ? theme.primary : 'text-slate-400'} />
            <span className="truncate">{app.title}</span>
            {app.dirty && <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 ml-auto animate-pulse" />}
          </button>
        ))}
      </div>
      
      {/* Right Section - System Tray */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-xs text-slate-300">
          {/* CPU Monitor */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Cpu size={14} />
              <div className="absolute -top-1 -right-1 text-[8px] font-bold text-cyan-400">
                {systemStats.cpu.usage}%
              </div>
            </div>
            <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full ${systemStats.cpu.usage > 70 ? 'bg-red-500' : 'bg-cyan-500'} transition-all duration-300`}
                style={{ width: `${systemStats.cpu.usage}%` }}
              />
            </div>
          </div>

          {/* Memory Monitor */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <HardDrive size={14} />
              <div className="absolute -top-1 -right-1 text-[8px] font-bold text-purple-400">
                {systemStats.memory.percentage}%
              </div>
            </div>
            <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-purple-500 transition-all duration-300"
                style={{ width: `${systemStats.memory.percentage}%` }}
              />
            </div>
          </div>

          {/* Network */}
          <div className="flex items-center gap-1">
            <Wifi size={14} />
            <span className="text-[10px]">{systemStats.network.down}↓</span>
          </div>
          
          {/* Battery */}
          <div className="flex items-center gap-1">
            <Battery size={14} />
            <span className="text-[10px]">{Math.round(battery)}%</span>
          </div>
          
          {/* Time */}
          <div className="text-xs font-mono">
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
  const [locked, setLocked] = useState(false); // Start unlocked for demo
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
        return Math.max(0, prev - 0.05);
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
      if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
        e.preventDefault();
        setLocked(true);
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
    
    const isMobile = window.innerWidth < 768;
    
    const appConfigs = {
      terminal: { 
        title: 'Quantum Shell', 
        icon: Terminal, 
        w: isMobile ? window.innerWidth * 0.95 : 600, 
        h: isMobile ? window.innerHeight * 0.7 : 400 
      },
      explorer: { 
        title: 'File Explorer', 
        icon: Folder, 
        w: isMobile ? window.innerWidth * 0.95 : 700, 
        h: isMobile ? window.innerHeight * 0.7 : 500 
      },
      editor: { 
        title: props.filename || 'Nexus IDE', 
        icon: Code, 
        w: isMobile ? window.innerWidth * 0.95 : 800, 
        h: isMobile ? window.innerHeight * 0.7 : 600 
      },
      settings: { 
        title: 'System Settings', 
        icon: Settings, 
        w: isMobile ? window.innerWidth * 0.95 : 800, 
        h: isMobile ? window.innerHeight * 0.7 : 550 
      },
      monitor: { 
        title: 'System Monitor', 
        icon: Activity, 
        w: isMobile ? window.innerWidth * 0.95 : 800, 
        h: isMobile ? window.innerHeight * 0.7 : 600 
      },
      crypto: { 
        title: 'Crypto Dashboard', 
        icon: Bitcoin, 
        w: isMobile ? window.innerWidth * 0.95 : 700, 
        h: isMobile ? window.innerHeight * 0.7 : 500 
      },
      weather: { 
        title: 'Weather Dashboard', 
        icon: Cloud, 
        w: isMobile ? window.innerWidth * 0.95 : 600, 
        h: isMobile ? window.innerHeight * 0.7 : 450 
      },
    };

    const config = appConfigs[type];
    if (!config) return;

    setApps(prev => {
      const deactivated = prev.map(a => ({ ...a, active: false }));
      const x = (window.innerWidth - config.w) / 2;
      const y = (window.innerHeight - config.h) / 2;
      
      return [...deactivated, {
        id, type, ...config, props, active: true,
        x: Math.max(0, x),
        y: Math.max(0, y),
        w: config.w,
        h: config.h,
        zIndex: nextZ, 
        minimized: false, 
        maximized: false,
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
    setApps(prev => prev.map(a => {
      if (a.id === id) {
        const newMaximized = !a.maximized;
        
        if (newMaximized) {
          return {
            ...a,
            maximized: true,
            originalX: a.x,
            originalY: a.y,
            originalW: a.w,
            originalH: a.h,
            x: 0,
            y: 0,
            w: window.innerWidth,
            h: window.innerHeight - 48
          };
        } else {
          return {
            ...a,
            maximized: false,
            x: a.originalX || 100,
            y: a.originalY || 100,
            w: a.originalW || 600,
            h: a.originalH || 400
          };
        }
      }
      return a;
    }));
  };

  if (!booted) return <BootLoader onComplete={() => setBooted(true)} />;

  return (
    <div className={`h-screen w-screen bg-black text-slate-200 font-sans overflow-hidden select-none relative`}>
      
      {/* WALLPAPER ENGINE */}
      <WallpaperEngine theme={theme} />

      {/* LOCK SCREEN */}
      {locked && (
        <div className="absolute inset-0 z-[10000] bg-black/90 backdrop-blur-lg flex items-center justify-center">
          <div className="text-center">
            <Fingerprint size={64} className="mx-auto mb-4 text-cyan-500 animate-pulse" />
            <h1 className="text-2xl font-bold mb-2">System Locked</h1>
            <p className="text-slate-400 mb-6">Press any key to unlock</p>
            <button 
              onClick={() => setLocked(false)}
              className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors"
            >
              Unlock
            </button>
          </div>
        </div>
      )}

      {/* OMNI SEARCH */}
      <OmniSearch isOpen={omniOpen} onClose={() => setOmniOpen(false)} openApp={openApp} theme={theme} />

      {/* DESKTOP ICONS */}
      <div className="absolute inset-0 z-10 p-6 flex flex-col flex-wrap content-start gap-6 pointer-events-none">
        {[
          { id: 'terminal', label: 'Terminal', icon: Terminal },
          { id: 'explorer', label: 'Files', icon: Folder },
          { id: 'monitor', label: 'Monitor', icon: Activity },
          { id: 'crypto', label: 'Crypto', icon: Bitcoin },
          { id: 'weather', label: 'Weather', icon: Cloud },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map(item => (
          <div 
            key={item.id} 
            className="pointer-events-auto w-20 h-24 flex flex-col items-center justify-center gap-2 rounded-xl hover:bg-white/5 cursor-pointer transition-all group"
            onDoubleClick={() => openApp(item.id)}
          >
            <div className={`p-3 rounded-2xl bg-slate-900/50 border border-slate-700/50 shadow-lg group-hover:scale-110 transition-transform group-hover:shadow-cyan-500/20`}>
              <item.icon size={24} className="text-slate-300 group-hover:text-cyan-400" />
            </div>
            <span className="text-[10px] font-medium text-slate-300 drop-shadow-md bg-black/40 px-2 py-0.5 rounded-full group-hover:bg-cyan-900/40">
              {item.label}
            </span>
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
          {app.type === 'editor' && <div>Enhanced Editor Coming Soon</div>}
          {app.type === 'explorer' && <AppExplorer theme={theme} fs={fs} setFs={setFs} openApp={openApp} />}
          {app.type === 'settings' && <AppSettings theme={theme} setThemeId={setThemeId} />}
          {app.type === 'monitor' && <AppSystemMonitor theme={theme} />}
          {app.type === 'crypto' && <AppCryptoDashboard theme={theme} />}
          {app.type === 'weather' && <AppWeather theme={theme} />}
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
      <div className="absolute top-0 left-0 right-0 h-8 bg-black/40 backdrop-blur-lg z-[9998] flex justify-between px-4 items-center border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-bold text-xs text-white">QuantumFlow {SYSTEM_VERSION}</span>
          <TopMenu />
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
            <div className="text-[10px] font-mono">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>
      </div>

      {/* SYSTEM NOTIFICATIONS */}
      <div className="absolute top-12 right-4 z-[9997] space-y-2">
        {time.getMinutes() % 15 === 0 && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-3 max-w-xs backdrop-blur">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle size={12} className="text-emerald-500" />
              <span>System check completed - All systems operational</span>
            </div>
          </div>
        )}
      </div>

      {/* VERCEL WEB ANALYTICS */}
      <Analytics />
    </div>
  );
};

export default QuantumFlowOS;
