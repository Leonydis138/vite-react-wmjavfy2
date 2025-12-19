export function diagnostics() {
  return {
    memory: performance.memory?.usedJSHeapSize ?? null,
    timing: performance.now(),
    online: navigator.onLine,
  };
}
