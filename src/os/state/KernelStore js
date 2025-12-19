export const kernelStore = (() => {
  let state = {};
  let listeners = new Set();

  function initialize(initial) {
    state = {
      ...initial,
      startedAt: Date.now(),
    };
    emit();
  }

  function getState() {
    return state;
  }

  function set(partial) {
    state = { ...state, ...partial };
    emit();
  }

  function emit() {
    listeners.forEach((l) => l(state));
  }

  function subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  return {
    initialize,
    getState,
    set,
    subscribe,
  };
})();
