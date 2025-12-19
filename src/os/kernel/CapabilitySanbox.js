import { KernelABI } from "./ABI";

export function sandbox(app, requested = []) {
  const allowed = requested.filter((p) =>
    KernelABI.permissions.includes(p)
  );

  return Object.freeze({
    permissions: allowed,
    app,
  });
}
