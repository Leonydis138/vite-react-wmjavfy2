import { sandbox } from "../kernel/CapabilitySandbox";

export function loadApp(manifest) {
  if (!manifest.entry) {
    throw new Error("Invalid app manifest");
  }

  return sandbox(manifest.entry, manifest.permissions);
}
