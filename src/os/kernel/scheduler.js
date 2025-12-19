let tasks = new Set();

export function schedule(fn) {
  tasks.add(fn);
}

function tick() {
  tasks.forEach((fn) => fn());
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
