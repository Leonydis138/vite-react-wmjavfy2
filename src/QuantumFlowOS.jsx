import React, { useEffect, useState } from "react";
import { getSystemTime } from "./services/SystemClock";
import { loadState, saveState } from "./services/Persistence";
import { getCapabilities } from "./services/Capabilities";
import { kernelStore } from "./state/KernelStore";

export default function QuantumFlowOS() {
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    // Boot sequence (real, deterministic)
    const persisted = loadState();
    kernelStore.initialize({
      time: getSystemTime(),
      capabilities: getCapabilities(),
      persisted,
    });

    const bootTimer = setTimeout(() => {
      setBooted(true);
    }, 600); // UX boot delay only (not fake data)

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
    <div className="w-screen h-screen bg-black text-slate-200 overflow-hidden">
      {/* Phase 2: WindowManager mounts here */}
      <div className="p-4 text-sm opacity-80">
        QuantumFlow OS — Kernel Online
      </div>
    </div>
  );
}
