export async function powerProfile() {
  if (!navigator.getBattery) return null;
  const b = await navigator.getBattery();
  return {
    level: b.level,
    charging: b.charging,
  };
}
