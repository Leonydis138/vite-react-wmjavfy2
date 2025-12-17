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
  Shield,
  Wifi,
  Box,
  Lock,
  X
} from 'lucide-react'

/* -----------------------------
   THEMES
----------------------------- */
const THEMES = {
  CYAN: { id: 'CYAN', bg: 'rgba(0,20,30,0.12)' },
  EMERALD: { id: 'EMERALD', bg: 'rgba(0,30,20,0.12)' },
  AMBER: { id: 'AMBER', bg: 'rgba(30,20,0,0.12)' }
}

/* -----------------------------
   FILESYSTEM
----------------------------- */
const DEFAULT_FS = {
  '/': {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          readme: {
            type: 'file',
            content: 'Welcome to QuantumFlow OS'
          }
        }
      }
    }
  }
}

/* -----------------------------
   WALLPAPER ENGINE
----------------------------- */
function Wallpaper({ theme }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', resize)
    resize()

    const draw = () => {
      ctx.fillStyle = theme.bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10 pointer-events-none"
    />
  )
}

/* -----------------------------
   PLUGIN APPS
----------------------------- */
const PLUGINS = {
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    icon: Terminal,
    permissions: ['fs', 'system'],
    render: TerminalApp
  },
  monitor: {
    id: 'monitor',
    name: 'Process Monitor',
    icon: Activity,
    permissions: ['system'],
    render: ProcessMonitorApp
  },
  network: {
    id: 'network',
    name: 'Network',
    icon: Wifi,
    permissions: ['network'],
    render: () => <div>Network stack idle</div>
  },
  security: {
    id: 'security',
    name: 'Security',
    icon: Shield,
    permissions: ['system'],
    render: () => <div>Security status: OK</div>
  }
}

/* =====================================================
   MAIN OS
===================================================== */
export default function QuantumFlowOS() {
  const [locked, setLocked] = useState(true)
  const [windows, setWindows] = useState(() => {
    const saved = localStorage.getItem('qfos_windows')
    return saved ? JSON.parse(saved) : []
  })
  const [activeWindow, setActiveWindow] = useState(null)
  const [time, setTime] = useState(new Date())

  const [themeId, setThemeId] = useState(
    localStorage.getItem('qfos_theme') || 'CYAN'
  )
  const theme = THEMES[themeId]

  const [fs, setFs] = useState(() => {
    const saved = localStorage.getItem('qfos_fs')
    return saved ? JSON.parse(saved) : DEFAULT_FS
  })

  /* -----------------------------
     Persistence
  ----------------------------- */
  useEffect(() => {
    localStorage.setItem('qfos_fs', JSON.stringify(fs))
  }, [fs])

  useEffect(() => {
    localStorage.setItem('qfos_windows', JSON.stringify(windows))
  }, [windows])

  useEffect(() => {
    localStorage.setItem('qfos_theme', themeId)
  }, [themeId])

  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(i)
  }, [])

  /* -----------------------------
     Process Handling
  ----------------------------- */
  const openWindow = useCallback((plugin) => {
    setWindows(w => [
      ...w,
      {
        pid: crypto.randomUUID(),
        plugin: plugin.id,
        title: plugin.name,
        x: 100 + w.length * 30,
        y: 80 + w.length * 30,
        w: 420,
        h: 300,
        z: w.length + 1,
        cpu: Math.random() * 10,
        ram: Math.random() * 100
      }
    ])
  }, [])

  const closeWindow = (pid) => {
    setWindows(w => w.filter(p => p.pid !== pid))
    if (activeWindow === pid) setActiveWindow(null)
  }

  const bringToFront = (pid) => {
    setWindows(w =>
      w.map(p =>
        p.pid === pid
          ? { ...p, z: Math.max(...w.map(x => x.z)) + 1 }
          : p
      )
    )
    setActiveWindow(pid)
  }

  /* -----------------------------
     TASKBAR
  ----------------------------- */
  const Taskbar = () => (
    <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-900 flex items-center gap-2 px-2">
      {Object.values(PLUGINS).map(p => (
        <button
          key={p.id}
          onClick={() => openWindow(p)}
          className="flex items-center gap-1 px-2 py-1 bg-zinc-800 rounded text-xs"
        >
          <p.icon size={14} /> {p.name}
        </button>
      ))}
      <select
        value={themeId}
        onChange={e => setThemeId(e.target.value)}
        className="ml-2 bg-zinc-800 text-xs rounded"
      >
        {Object.keys(THEMES).map(t => (
          <option key={t}>{t}</option>
        ))}
      </select>
      <div className="ml-auto text-xs text-zinc-300">
        {time.toLocaleTimeString()}
      </div>
    </div>
  )

  /* -----------------------------
     WINDOW FRAME
  ----------------------------- */
  const WindowFrame = ({ win }) => {
    const drag = useRef(null)
    const Plugin = PLUGINS[win.plugin]

    const onMouseDown = (e) => {
      bringToFront(win.pid)
      drag.current = {
        x: e.clientX - win.x,
        y: e.clientY - win.y
      }
    }

    useEffect(() => {
      const move = (e) => {
        if (!drag.current) return
        setWindows(w =>
          w.map(p =>
            p.pid === win.pid
              ? {
                  ...p,
                  x: e.clientX - drag.current.x,
                  y: e.clientY - drag.current.y
                }
              : p
          )
        )
      }
      const up = () => (drag.current = null)
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', up)
      return () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
      }
    }, [win.pid])

    return (
      <div
        className="absolute bg-zinc-900 border border-zinc-700 text-white"
        style={{
          left: win.x,
          top: win.y,
          width: win.w,
          height: win.h,
          zIndex: win.z
        }}
      >
        <div
          className="h-8 bg-zinc-800 flex items-center justify-between px-2 cursor-move"
          onMouseDown={onMouseDown}
        >
          <span className="text-xs">{win.title}</span>
          <button onClick={() => closeWindow(win.pid)}>
            <X size={12} />
          </button>
        </div>
        <div className="p-2 text-sm overflow-auto h-[calc(100%-2rem)]">
          <Plugin.render
            fs={fs}
            setFs={setFs}
            permissions={Plugin.permissions}
            processes={windows}
            kill={closeWindow}
          />
        </div>
      </div>
    )
  }

  /* -----------------------------
     LOCK SCREEN
  ----------------------------- */
  if (locked) {
    return (
      <div className="w-screen h-screen bg-zinc-900 flex items-center justify-center">
        <button
          onClick={() => setLocked(false)}
          className="px-6 py-3 bg-blue-600 rounded"
        >
          Unlock QuantumFlow
        </button>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen bg-zinc-900 relative overflow-hidden">
      <Wallpaper theme={theme} />
      {windows.map(w => (
        <WindowFrame key={w.pid} win={w} />
      ))}
      <Taskbar />
    </div>
  )
}

/* =====================================================
   APPS
===================================================== */

function TerminalApp({ fs, setFs, permissions }) {
  const [history, setHistory] = useState([
    'QuantumFlow Terminal',
    'Type "help"'
  ])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState(['/','home'])

  const resolve = (p) =>
    p?.startsWith('/') ? p.split('/').filter(Boolean) : [...cwd, p]

  const getNode = (path) => {
    let n = fs['/']
    for (const p of path.slice(1)) n = n?.children?.[p]
    return n
  }

  const run = (cmd) => {
    if (!permissions.includes('fs'))
      return setHistory(h => [...h, 'Permission denied'])

    if (cmd === 'ls') {
      const n = getNode(cwd)
      setHistory(h => [...h, Object.keys(n.children).join(' ')])
    }
    if (cmd.startsWith('cd')) {
      const p = resolve(cmd.split(' ')[1])
      if (getNode(p)) setCwd(p)
      else setHistory(h => [...h, 'Path not found'])
    }
  }

  return (
    <div className="font-mono text-green-400 text-xs">
      {history.map((l,i) => <div key={i}>{l}</div>)}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            run(input)
            setInput('')
          }
        }}
        className="bg-transparent outline-none w-full"
      />
    </div>
  )
}

function ProcessMonitorApp({ processes, kill }) {
  return (
    <div className="text-xs space-y-1">
      {processes.map(p => (
        <div key={p.pid} className="flex justify-between">
          <span>{p.title}</span>
          <span>CPU {p.cpu.toFixed(1)}%</span>
          <span>RAM {p.ram.toFixed(0)}MB</span>
          <button
            className="text-red-400"
            onClick={() => kill(p.pid)}
          >
            KILL
          </button>
        </div>
      ))}
    </div>
  )
}
