import { useEffect, useState } from "react";

/** Counts down to the next midnight (her birthday begins). After midnight: celebrates. */
export function Countdown() {
  const [time, setTime] = useState<{ total: number; h: number; m: number; s: number } | null>(null);
  const [arrived, setArrived] = useState(false);

  useEffect(() => {
    setTime(getRemaining());
    const id = setInterval(() => {
      const r = getRemaining();
      setTime(r);
      if (r.total <= 0) setArrived(true);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (arrived) {
    return (
      <div className="font-script text-3xl text-aurora animate-glow md:text-4xl">
        ✦ it's officially your day ✦
      </div>
    );
  }

  const items: [string, number][] = [
    ["hours", time?.h ?? 0],
    ["minutes", time?.m ?? 0],
    ["seconds", time?.s ?? 0],
  ];

  return (
    <div className="flex items-end justify-center gap-4 md:gap-8">
      {items.map(([label, val], i) => (
        <div key={label} className="flex flex-col items-center">
          <div
            className="font-display text-5xl font-light tabular-nums text-white md:text-7xl"
            style={{ textShadow: "0 0 30px oklch(0.55 0.22 305 / 0.6)" }}
          >
            {String(val).padStart(2, "0")}
          </div>
          <div className="font-script mt-1 text-sm text-white/60 md:text-base">{label}</div>
          {i < items.length - 1 && (
            <span className="sr-only">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

function getRemaining() {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  const total = next.getTime() - now.getTime();
  const h = Math.floor(total / 3_600_000);
  const m = Math.floor((total % 3_600_000) / 60_000);
  const s = Math.floor((total % 60_000) / 1000);
  return { total, h, m, s };
}
