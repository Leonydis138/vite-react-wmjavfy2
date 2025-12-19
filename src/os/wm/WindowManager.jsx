import React, { useState, useCallback, useEffect } from "react";
import Window from "./Window";

let zCounter = 100;

export default function WindowManager({ apps = {}, autoLaunch = [] }) {
  const [windows, setWindows] = useState([]);

  const openWindow = useCallback((app) => {
    if (!app) return;

    setWindows((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(), // safe, deterministic
        app,
        x: 80 + prev.length * 20,
        y: 80 + prev.length * 20,
        w: 480,
        h: 320,
        z: zCounter++,
      },
    ]);
  }, []);

  useEffect(() => {
    if (!apps || autoLaunch.length === 0) return;
    autoLaunch.forEach((id) => openWindow(apps[id]));
  }, [apps, autoLaunch, openWindow]);

  const focus = (id) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, z: zCounter++ } : w
      )
    );
  };

  const move = (id, x, y) => {
    setWindows((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, x, y } : w
      )
    );
  };

  return (
    <>
      {windows.map((w) => (
        <Window
          key={w.id}
          data={w}
          onFocus={focus}
          onMove={move}
        />
      ))}

      {/* TEMP launcher (safe to remove later) */}
      {apps.terminal && (
        <button
          onClick={() => openWindow(apps.terminal)}
          className="fixed bottom-4 left-4 bg-cyan-600 px-3 py-1 text-xs text-black z-[9999]"
        >
          Open Terminal
        </button>
      )}
    </>
  );
}
