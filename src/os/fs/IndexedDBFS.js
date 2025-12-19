const DB = "QuantumFlowFS";
const STORE = "files";

let db;

export function initFS() {
  return new Promise((res) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () =>
      req.result.createObjectStore(STORE);
    req.onsuccess = () => {
      db = req.result;
      res();
    };
  });
}

export function write(path, data) {
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(data, path);
}

export function read(path) {
  return new Promise((res) => {
    const tx = db.transaction(STORE);
    const req = tx.objectStore(STORE).get(path);
    req.onsuccess = () => res(req.result);
  });
}
