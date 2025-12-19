const KEY = "quantumflow_vfs_v1";

let state = load();

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {
      "/": [],
    };
  } catch {
    return { "/": [] };
  }
}

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export const fs = {
  list(path) {
    return state[path] ?? [];
  },

  write(path, name) {
    if (!state[path]) state[path] = [];
    state[path].push(name);
    persist();
  },
};
