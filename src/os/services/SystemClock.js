export function getSystemTime() {
  return {
    now: Date.now(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    locale: navigator.language,
  };
}
