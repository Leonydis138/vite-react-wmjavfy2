import { fs } from "./VirtualFS";

export function transaction(fn) {
  const snapshot = JSON.stringify(fs);
  try {
    fn(fs);
  } catch {
    Object.assign(fs, JSON.parse(snapshot));
  }
}
