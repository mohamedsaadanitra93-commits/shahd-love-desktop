import { useMemo, type CSSProperties } from "react";

export function HeartShape({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 21 C3 15 1 8 6 5 C9 3 11 5 12 7 C13 5 15 3 18 5 C23 8 21 15 12 21 Z" fill="currentColor" />
    </svg>
  );
}

/** A one-shot shower of hearts rising from the bottom. Re-key it to replay. */
export function HeartRain({ count = 30, colorClass = "text-neon-pink" }: { count?: number; colorClass?: string }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: 14 + Math.random() * 26,
        delay: Math.random() * 1.6,
        dur: 2.6 + Math.random() * 2.2,
        dx: (Math.random() - 0.5) * 160,
        rot: (Math.random() - 0.5) * 80,
        key: i,
      })),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <HeartShape
          key={h.key}
          className={`absolute bottom-[-40px] ${h.key % 4 === 0 ? "text-neon-violet" : colorClass}`}
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            opacity: 0,
            animation: `heart-rise ${h.dur}s ease-out ${h.delay}s forwards`,
            ["--dx" as string]: `${h.dx}px`,
            ["--rot" as string]: `${h.rot}deg`,
          }}
        />
      ))}
    </div>
  );
}

/** Radial explosion of hearts from the center. Re-key to replay. */
export function HeartBurst({ count = 36 }: { count?: number }) {
  const parts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2;
        const d = 160 + Math.random() * 260;
        return { dx: Math.cos(a) * d, dy: Math.sin(a) * d, size: 12 + Math.random() * 22, delay: Math.random() * 0.25, key: i };
      }),
    [count],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
      {parts.map((p) => (
        <HeartShape
          key={p.key}
          className={`absolute ${p.key % 3 === 0 ? "text-neon-gold" : p.key % 3 === 1 ? "text-neon-pink" : "text-neon-violet"}`}
          style={{
            width: p.size,
            height: p.size,
            animation: `burst 1.4s cubic-bezier(0.1, 0.8, 0.3, 1) ${p.delay}s forwards`,
            ["--dx" as string]: `${p.dx}px`,
            ["--dy" as string]: `${p.dy}px`,
          }}
        />
      ))}
    </div>
  );
}
