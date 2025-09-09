export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function fmtNumber(n: number) {
  return n.toLocaleString("en-US");
}

export function fmtDuration(seconds: number) {
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  const mTotal = Math.floor(seconds / 60);
  const h = Math.floor(mTotal / 60);
  const m = Math.floor(mTotal % 60)
    .toString()
    .padStart(2, "0");
  if (h > 0) return `${h}:${m}:${s}`;
  return `${Number(m)}:${s}`;
}

export function toISOStart(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0)).toISOString();
    return iso;
  } catch {
    return null;
  }
}

export function toISOEnd(dateStr: string) {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return null;
    const iso = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59)).toISOString();
    return iso;
  } catch {
    return null;
  }
}

