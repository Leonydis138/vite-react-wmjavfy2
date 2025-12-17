import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo
} from 'react'
import {
  Terminal, Activity, Shield, Wifi, Box, Lock, X, User
} from 'lucide-react'

/* ===============================
   THEMES
================================ */
const THEMES = {
  CYAN: { bg: 'rgba(0,20,30,0.12)' },
  EMERALD: { bg: 'rgba(0,30,20,0.12)' },
  AMBER: { bg: 'rgba(30,20,0,0.12)' }
}

/* ===============================
   USERS
================================ */
const USERS = {
  root: { name: 'root', permissions: ['*'] },
  guest: { name: 'guest', permissions: ['fs', 'ipc'] }
}

/* ===============================
   FILESYSTEM
================================ */
const DEFAULT_FS = {
  '/': {
    type: 'dir',
    children: {
      home: {
        type: 'dir',
        children: {
          readme: { type: 'file', content: 'QuantumFlow OS Online' }
        }
      }
    }
  }
}

/* ===============================
   WALLPAPER
================================ */
function Wallpaper({ theme }) {
  const ref = useRef(null)
  useEffect(() => {
    const c = ref.current
    const ctx = c.getContext('2d')
    let r
    const resize = () => {
      c.width = window.innerWidth
      c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    const draw = () => {
      ctx.fillStyle = theme.bg
      ctx.fillRect(0,0,c.width,c.height)
      r = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(r)
    }
  }, [theme])
  return <canvas ref={ref} className="absolute inset-0 -z-10"/>
}

/* ===============================
   IPC BUS
================================ */
function createIPC() {
  const listeners = {}
  return {
    send(to, msg) {
      listeners[to]?.forEach(fn => fn(msg))
    },
    broadcast(msg) {
      Object.values(listeners).flat().forEach(fn => fn(msg))
    },
    listen(id, fn) {
      listeners[id] = listeners[id] || []
      listeners[id].push(fn)
      return () => listeners[id] =
        listeners[id].filter(f => f !== fn)
    }
  }
}

/* ===============================
   MAIN OS
================================ */
export default function QuantumFlowOS() {
  const ipc = useRef(createIPC())

  const [locked, setLocked] = useState(true)
  const [user, setUser] = useState('root')
  const [themeId, setThemeId] = useState(
    localStorage.getItem('qf_theme') || 'CYAN'
  )
  const [fs, setFs] = useState(() =>
    JSON.parse(localStorage.getItem('qf_fs')) || DEFAULT_FS
  )
  const [windows, setWindows] = useState(() =>
    JSON.parse(localStorage.getItem('qf_windows')) || []
  )
  const [snapshots, setSnapshots] = useState(() =>
    JSON.parse(localStorage.getItem('qf_snaps')) || []
  )
  const [time, setTime] = useState(new Date())

  useEffect(() => localStorage.setItem('qf_fs', JSON.stringify(fs)), [fs])
  useEffect(() => localStorage.setItem('qf_windows', JSON.stringify(windows)), [windows])
  useEffect(() => localStorage.setItem('qf_theme', themeId), [themeId])
  useEffect(() => localStorage.setItem('qf_snaps', JSON.stringify(snapshots)), [snapshots])

  useEffect(() => {
    const t = setInterval(()=>setTime(new Date()),1000)
    return ()=>clearInterval(t)
  }, [])

  const hasPerm = (p) =>
    USERS[user].permissions.includes('*') ||
    USERS[user].permissions.includes(p)

  /* -------- Snapshots -------- */
  const saveSnapshot = () => {
    setSnapshots(s => [...s, {
      id: crypto.randomUUID(),
      time: Date.now(),
      state: { fs, windows, themeId, user }
    }])
  }

  const restoreSnapshot = (snap) => {
    setFs(snap.state.fs)
    setWindows(snap.state.windows)
    setThemeId(snap.state.themeId)
    setUser(snap.state.user)
  }

  /* -------- Window Mgmt -------- */
  const openWindow = (app) => {
    setWindows(w => [...w, {
      pid: crypto.randomUUID(),
      app,
      x: 100 + w.length * 20,
      y: 80 + w.length * 20,
      w: 420,
      h: 280,
      z: w.length + 1
    }])
  }

  const closeWindow = (pid) =>
    setWindows(w => w.filter(p => p.pid !== pid))

  /* -------- Taskbar -------- */
  const Taskbar = () => (
    <div className="absolute bottom-0 w-full h-10 bg-zinc-900 flex gap-2 px-2">
      <button onClick={()=>openWindow('terminal')}>Terminal</button>
      <button onClick={()=>openWindow('monitor')}>Processes</button>
      <button onClick={()=>openWindow('wasm')}>WASM</button>
      <button onClick={saveSnapshot}>Snapshot</button>
      <select value={themeId} onChange={e=>setThemeId(e.target.value)}>
        {Object.keys(THEMES).map(t=><option key={t}>{t}</option>)}
      </select>
      <select value={user} onChange={e=>setUser(e.target.value)}>
        {Object.keys(USERS).map(u=><option key={u}>{u}</option>)}
      </select>
      <div className="ml-auto">{time.toLocaleTimeString()}</div>
    </div>
  )

  /* -------- Windows -------- */
  const Window = ({ win }) => {
    const drag = useRef(null)
    const onDown = e => drag.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y
    }
    useEffect(() => {
      const move = e => drag.current &&
        setWindows(w => w.map(p =>
          p.pid === win.pid
            ? {...p, x: e.clientX-drag.current.x, y:e.clientY-drag.current.y}
            : p
        ))
      const up = () => drag.current = null
      window.addEventListener('mousemove', move)
      window.addEventListener('mouseup', up)
      return () => {
        window.removeEventListener('mousemove', move)
        window.removeEventListener('mouseup', up)
      }
    }, [])

    const App = APPS[win.app]

    return (
      <div
        className="absolute bg-zinc-900 border"
        style={{left:win.x,top:win.y,width:win.w,height:win.h,zIndex:win.z}}
      >
        <div className="h-8 bg-zinc-800 flex justify-between px-2"
             onMouseDown={onDown}>
          <span>{win.app}</span>
          <button onClick={()=>closeWindow(win.pid)}><X size={12}/></button>
        </div>
        <div className="p-2 text-xs overflow-auto h-[calc(100%-2rem)]">
          <App
            fs={fs}
            setFs={setFs}
            ipc={ipc.current}
            hasPerm={hasPerm}
            snapshots={snapshots}
            restoreSnapshot={restoreSnapshot}
          />
        </div>
      </div>
    )
  }

  if (locked) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <button onClick={()=>setLocked(false)}>Unlock QuantumFlow</button>
      </div>
    )
  }

  return (
    <div className="w-screen h-screen relative bg-zinc-900">
      <Wallpaper theme={THEMES[themeId]}/>
      {windows.map(w=><Window key={w.pid} win={w}/>)}
      <Taskbar/>
    </div>
  )
}

/* ===============================
   APPS
================================ */

const APPS = {
  terminal: TerminalApp,
  monitor: ProcessMonitor,
  wasm: WasmApp
}

function TerminalApp({ fs, setFs, ipc, hasPerm }) {
  const [log,setLog]=useState(['QuantumFlow Terminal'])
  const [input,setInput]=useState('')

  const run = (cmd) => {
    if (cmd==='ls') setLog(l=>[...l,Object.keys(fs['/'].children).join(' ')])
    if (cmd.startsWith('send ') && hasPerm('ipc')) {
      ipc.broadcast(cmd.slice(5))
      setLog(l=>[...l,'[ipc] sent'])
    }
  }

  return (
    <div>
      {log.map((l,i)=><div key={i}>{l}</div>)}
      <input
        value={input}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{
          if(e.key==='Enter'){run(input);setInput('')}
        }}
      />
    </div>
  )
}

function ProcessMonitor({ restoreSnapshot, snapshots }) {
  return (
    <div>
      <div className="font-bold">Snapshots</div>
      {snapshots.map(s=>(
        <button key={s.id} onClick={()=>restoreSnapshot(s)}>
          {new Date(s.time).toLocaleTimeString()}
        </button>
      ))}
    </div>
  )
}

function WasmApp({ hasPerm }) {
  const [status,setStatus]=useState('idle')

  const load = async () => {
    if (!hasPerm('system')) {
      setStatus('Permission denied')
      return
    }
    setStatus('WASM sandbox ready')
  }

  return (
    <div>
      <button onClick={load}>Init WASM</button>
      <div>{status}</div>
    </div>
  )
}
