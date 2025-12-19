import React, { useState, useCallback } from "react";
import Window from "./Window";

let zCounter = 100;

export default function WindowManager({ apps }) {
  const [windows, setWindows] = useState([]);

  const openWindow = useCallback((app) => {
    setWindows((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        app,
        x: 80 + prev.length * 20,
        y: 80 + prev.length * 20,
        w: 480,
        h: 320,
        z: zCounter++,
      },
    ]);
  }, []);

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

      {/* launcher (temporary, removed Phase 4) */}
      <button
        onClick={() => openWindow(apps.terminal)}
        className="fixed bottom-4 left-4 bg-cyan-600 px-3 py-1 text-xs"
      >
        Open Terminal
      </button>
    </>
  );
}
