import CrashBoundary from "../kernel/CrashBoundary";

<CrashBoundary>
  <App />
</CrashBoundary>

import React, { useState } from "react";
import { execute } from "../shell/CommandBus";

export default function TerminalApp() {
  const [lines, setLines] = useState([
    "QuantumFlow Terminal",
  ]);
  const [input, setInput] = useState("");

  const run = () => {
    const output = execute(input);
    setLines((l) => [...l, "> " + input, ...output]);
    setInput("");
  };

  return (
    <div
      style={{
        fontFamily: "monospace",
        fontSize: 12,
        padding: 6,
        height: "100%",
        overflow: "auto",
      }}
    >
      {lines.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && run()}
        style={{
          width: "100%",
          background: "black",
          color: "white",
          border: "none",
          outline: "none",
        }}
      />
    </div>
  );
}
