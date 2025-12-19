import React, { useEffect, useState } from "react";
import { getSystemTime } from "./services/SystemClock";
import { loadState, saveState } from "./services/Persistence";
import { getCapabilities } from "./services/Capabilities";
import { kernelStore } from "./state/KernelStore";

import WindowManager from "./wm/WindowManager";
import { AppRegistry } from "./apps/registry";

export default function QuantumFlowOS() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Kernel boot (real)
    const persisted = loadState();

    kernelStore.initialize({
      time: getSystemTime(),
      capabilities: getCapabilities(),
      persisted,
    });

    const bootTimer = setTimeout(() => {
      setBooted(true);
    }, 600);

    return () => clearTimeout(bootTimer);
  }, []);

  useEffect(() => {
    const unsub = kernelStore.subscribe((state) => {
      saveState(state);
    });
    return unsub;
  }, []);

  if (!booted) {
    return (
      <div className="fixed inset-0 bg-black text-cyan-400 flex items-center justify-center font-mono">
        Initializing QuantumFlow OS…
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black overflow-hidden">
      {/* Desktop banner (optional) */}
      <div className="absolute top-2 left-4 text-xs opacity-70 pointer-events-none">
        QuantumFlow OS — Kernel Online
      </div>

      {/* USERLAND */}
      <WindowManager
        apps={AppRegistry}
        autoLaunch={["terminal"]}
      />
    </div>
  );
}
