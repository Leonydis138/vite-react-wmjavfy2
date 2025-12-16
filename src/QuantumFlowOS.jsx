import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react'

import {
  Terminal,
  Activity,
  Cpu,
  Server,
  Shield,
  Zap,
  Database,
  Lock,
  Box,
  Layers,
  Globe,
  Wifi,
  HardDrive,
  Code,
  FileText,
  Share2,
  GitBranch,
  Radio,
  Grid,
  Clock,
  AlertTriangle,
  CheckCircle,
  Play,
  Pause,
  RefreshCw,
  Hash,
  Eye
} from 'lucide-react'

export default function QuantumFlowOS() {
  const [booted, setBooted] = useState(false)
  const [locked, setLocked] = useState(true)
  const [windows, setWindows] = useState([])
  const [activeWindow, setActiveWindow] = useState(null)
  const [time, setTime] = useState(new Date())
  const [commandLog, setCommandLog] = useState([])
  const [fs, setFs] = useState(() => {
    const saved = localStorage.getItem('qfos_fs')
    return saved ? JSON.parse(saved) : {
      '/': {
        type: 'dir',
        children: {
          home: { type: 'dir', children: {} },
          system: { type: 'dir', children: {} }
        }
      }
    }
  })

  useEffect(() => {
    localStorage.setItem('qfos_fs', JSON.stringify(fs))
  }, [fs])

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  const openWindow = useCallback((app) => {
    setWindows(w => [
      ...w,
      {
        id: Date.now() + Math.random(),
        app,
        x: 120 + w.length * 30,
        y: 80 + w.length * 30,
        w: 420,
        h: 300,
        z: w.length + 1
      }
    ])
  }, [])

  const closeWindow = useCallback((id) => {
    setWindows(w => w.filter(win => win.id !== id))
    if (activeWindow === id) setActiveWindow(null)
  }, [activeWindow])

  const bringToFront = useCallback((id) => {
    setWindows(w =>
      w.map(win =>
        win.id === id
          ? { ...win, z: Math.max(...w.map(x => x.z)) + 1 }
          : win
      )
    )
    setActiveWindow(id)
  }, [])

  const apps = useMemo(() => ([
    { id: 'terminal', name: 'Terminal', icon: Terminal },
    { id: 'monitor', name: 'System Monitor', icon: Activity },
    { id: 'files', name: 'Files', icon: FolderIcon },
    { id: 'network', name: 'Network', icon: Wifi },
    { id: 'security', name: 'Security', icon: Shield }
  ]), [])

  function FolderIcon() {
    return <Box size={18} />
  }

  const BootScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-green-400">
      <div className="text-3xl mb-4">QuantumFlow OS</div>
      <div className="animate-pulse">initializing subsystems…</div>
    </div>
  )

  const LockScreen = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <Lock size={48} className="mb-4" />
      <button
        onClick={() => setLocked(false)}
        className="px-6 py-2 bg-blue-600 rounded"
      >
        Unlock
      </button>
    </div>
  )

  const Taskbar = () => (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-900 flex items-center px-2 gap-2">
      {apps.map(app => (
        <button
          key={app.id}
          onClick={() => openWindow(app)}
          className="flex items-center gap-1 px-2 py-1 text-sm bg-zinc-800 rounded hover:bg-zinc-700"
        >
          <app.icon size={14} />
          {app.name}
        </button>
      ))}
      <div className="ml-auto text-xs text-zinc-300">
        {time.toLocaleTimeString()}
      </div>
    </div>
  )

  const WindowFrame = ({ win }) => (
    <div
      className="absolute bg-zinc-900 border border-zinc-700 text-white"
      style={{
        left: win.x,
        top: win.y,
        width: win.w,
        height: win.h,
        zIndex: win.z
      }}
      onMouseDown={() => bringToFront(win.id)}
    >
      <div className="h-8 bg-zinc-800 flex items-center justify-between px-2">
        <span className="text-xs">{win.app.name}</span>
        <button onClick={() => closeWindow(win.id)}>✕</button>
      </div>
      <div className="p-2 text-sm overflow-auto h-[calc(100%-2rem)]">
        {renderApp(win.app.id)}
      </div>
    </div>
  )


  // ---------------------------
  // Terminal App
  // ---------------------------
  const TerminalApp = () => {
    const [input, setInput] = useState('')
    const [history, setHistory] = useState(['QuantumFlow v19.0 Zenith', 'Type "help" for commands.'])
    const [cwd, setCwd] = useState(['home', 'admin'])
    const endRef = useRef(null)

    useEffect(() => endRef.current?.scrollIntoView(), [history])

    const parsePath = (pathStr) => {
      if (!pathStr) return cwd
      if (pathStr.startsWith('/')) return pathStr.slice(1).split('/')
      return [...cwd, ...pathStr.split('/')]
    }

    const getNode = (pathArr) => {
      let ptr = fs
      for (const p of pathArr) ptr = ptr?.[p]
      return ptr
    }

    const handleCommand = (e) => {
      if (e.key !== 'Enter') return
      const cmdLine = input.trim()
      setHistory(h => [...h, `${cwd.join('/')} $ ${cmdLine}`])
      setInput('')
      if (!cmdLine) return

      const [cmd, ...args] = cmdLine.split(' ')

      if (cmd === 'clear') setHistory([])
      else if (cmd === 'help') setHistory(h => [...h, 'Commands: ls, cd, cat, mkdir, touch, open, clear'])
      else if (cmd === 'ls') {
        const node = getNode(parsePath(args[0]))
        setHistory(h => [...h, node ? Object.keys(node).join('  ') : 'Path not found'])
      }
      else if (cmd === 'cat') {
        const node = getNode(parsePath(args[0]))
        setHistory(h => [...h, node?.content || 'File not found'])
      }
      else setHistory(h => [...h, `Unknown command: ${cmd}`])
    }

    return (
      <div className="h-full bg-black text-green-400 font-mono p-2 overflow-auto">
        {history.map((line,i) => <div key={i}>{line}</div>)}
        <div className="flex gap-1">
          <span>{cwd.join('/')} $</span>
          <input
            autoFocus
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleCommand}
            className="bg-transparent border-none outline-none flex-1 text-green-400"
          />
        </div>
        <div ref={endRef} />
      </div>
    )
  }

  // ---------------------------
  // Render app content by type
  // ---------------------------
  const renderApp = (id) => {
    switch(id) {
      case 'terminal': return <TerminalApp />
      case 'monitor': return <div>CPU: 12% | RAM: 45%</div>
      case 'files': return <div>File Explorer - Coming Soon</div>
      case 'network': return <div>Network Monitor - Coming Soon</div>
      case 'security': return <div>Security Center - Coming Soon</div>
      default: return <div>Unknown App</div>
    }
  }

  // ---------------------------
  // Main render
  // ---------------------------
  return (
    <div className="w-screen h-screen bg-zinc-900 relative text-white overflow-hidden">
      {locked && <LockScreen />}
      {!locked && (
        <>
          {windows.map(win => <WindowFrame key={win.id} win={win} />)}
          <Taskbar />
        </>
      )}
    </div>
  )
}


  // ---------------------------
  // Wallpaper Engine
  // ---------------------------
  const Wallpaper = ({theme}) => {
    const canvasRef = useRef(null)
    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      let animId
      const resize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
      window.addEventListener('resize', resize)
      resize()

      const draw = () => {
        ctx.fillStyle = theme.id === 'EMERALD' ? 'rgba(0,10,0,0.1)' : 'rgba(0,0,0,0.1)'
        ctx.fillRect(0,0,canvas.width,canvas.height)
        animId = requestAnimationFrame(draw)
      }
      draw()
      return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
    }, [theme])
    return <canvas ref={canvasRef} className="absolute inset-0 -z-10 pointer-events-none" />
  }

  // ---------------------------
  // Persistent theme/state
  // ---------------------------
  const [fs, setFs] = usePersistentState('qf_fs', DEFAULT_FS)
  const [themeId, setThemeId] = usePersistentState('qf_theme','CYAN')
  const theme = THEMES[themeId]

  // ---------------------------
  // Windows
  // ---------------------------
  const [windows, setWindows] = useState([])
  const [activeWindow, setActiveWindow] = useState(null)

  // ---------------------------
  // Locked
  // ---------------------------
  const [locked, setLocked] = useState(true)

  // ---------------------------
  // System clock
  // ---------------------------
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(()=>setTime(new Date()),1000)
    return ()=>clearInterval(t)
  }, [])

  // ---------------------------
  // Export default
  // ---------------------------
  export default QuantumFlowOS

