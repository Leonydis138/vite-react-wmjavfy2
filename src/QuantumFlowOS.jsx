import React, { useState, useEffect } from 'react'
import { Terminal, Activity, Shield, Wifi, Box } from 'lucide-react'

export default function App() {
  const [time, setTime] = useState(new Date())
  const [windows, setWindows] = useState([])

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const apps = [
    { id: 'terminal', name: 'Terminal', icon: Terminal },
    { id: 'monitor', name: 'Monitor', icon: Activity },
    { id: 'files', name: 'Files', icon: Box },
    { id: 'network', name: 'Network', icon: Wifi },
    { id: 'security', name: 'Security', icon: Shield }
  ]

  const openWindow = (app) => {
    setWindows((w) => [
      ...w,
      {
        id: Date.now(),
        app
      }
    ])
  }

  return (
    <div className="w-screen h-screen bg-zinc-900 text-white overflow-hidden">
      {/* Desktop */}
      <div className="p-4 text-lg font-mono">
        QuantumFlow OS v19 Zenith
      </div>

      {/* Windows */}
      <div className="p-4 space-y-2">
        {windows.map((w) => (
          <div
            key={w.id}
            className="bg-zinc-800 border border-zinc-700 p-3 rounded"
          >
            {w.app.name} window opened
          </div>
        ))}
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-10 bg-zinc-800 flex items-center gap-2 px-2">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => openWindow(app)}
            className="flex items-center gap-1 bg-zinc-700 px-2 py-1 rounded text-sm"
          >
            <app.icon size={14} />
            {app.name}
          </button>
        ))}
        <div className="ml-auto text-xs">
          {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
