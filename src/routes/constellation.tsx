import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { CONSTELLATION, CONSTELLATION_FILLER } from "@/content/shahd";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/constellation")({
  head: () => pageHead("OUR CONSTELLATION", "An interactive galaxy where every star hides a message for Shahd."),
  component: ConstellationPage,
});

function ConstellationPage() {
  const [found, setFound] = useState<Set<number>>(new Set());
  const [active, setActive] = useState<number | null>(null);
  const filler = useMemo(
    () => Array.from({ length: CONSTELLATION_FILLER }, (_, i) => ({ x: (i * 37.7) % 100, y: (i * 61.3) % 80, r: 0.12 + ((i * 7) % 5) / 25, d: (i % 9) * 0.35 })),
    [],
  );
  const order = [...CONSTELLATION.map((_, i) => i), 0];
  const complete = found.size === CONSTELLATION.length;

  const click = (i: number) => {
    setActive(i);
    setFound((f) => new Set(f).add(i));
  };

  return (
    <AppWindow title="CONSTELLATION" subtitle="every star hides a message" accent="var(--neon-cyan)" bodyClassName="bg-deep">
      <div className="relative flex min-h-full flex-col p-3 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] text-neon-cyan">SKY MAP · SECTOR SHAHD</p>
            <h2 className="font-display text-2xl font-bold">Our Constellation</h2>
          </div>
          <p className="font-mono text-xs text-muted-foreground">stars discovered: <span className="text-neon-cyan">{found.size}</span> / {CONSTELLATION.length}</p>
        </div>

        <div className="relative mt-3 flex-1">
          <svg viewBox="0 0 100 80" className="h-full max-h-[64vh] w-full" role="img" aria-label="Clickable constellation shaped like a heart">
            <defs>
              <radialGradient id="glow">
                <stop offset="0%" stopColor="var(--neon-cyan)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="var(--neon-cyan)" stopOpacity={0} />
              </radialGradient>
              <radialGradient id="nebula" cx="50%" cy="45%" r="60%">
                <stop offset="0%" stopColor="var(--neon-violet)" stopOpacity={complete ? 0.35 : 0.12} />
                <stop offset="100%" stopColor="var(--neon-violet)" stopOpacity={0} />
              </radialGradient>
            </defs>
            <rect width={100} height={80} fill="url(#nebula)" />
            {filler.map((s, i) => (
              <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="var(--foreground)" className="animate-twinkle" style={{ animationDelay: `${s.d}s`, transformBox: "fill-box", transformOrigin: "center" }} />
            ))}
            {order.slice(0, -1).map((a, k) => {
              const b = order[k + 1];
              if (!found.has(a) || !found.has(b)) return null;
              const A = CONSTELLATION[a];
              const B = CONSTELLATION[b];
              return (
                <line key={`${a}-${b}`} x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={complete ? "var(--neon-pink)" : "var(--neon-cyan)"} strokeWidth={0.35} strokeDasharray="40" strokeDashoffset="40" style={{ animation: "dash 1.2s ease-out forwards" }} opacity={0.8} />
              );
            })}
            {CONSTELLATION.map((s, i) => {
              const isFound = found.has(i);
              return (
                <g key={i} onClick={() => click(i)} className="cursor-pointer" role="button" aria-label={`Star: ${s.label}`}>
                  <circle cx={s.x} cy={s.y} r={4} fill="url(#glow)" opacity={isFound ? 0.9 : 0.35} className="animate-twinkle" style={{ animationDelay: `${i * 0.2}s`, transformBox: "fill-box", transformOrigin: "center" }} />
                  <circle cx={s.x} cy={s.y} r={isFound ? 1.2 : 0.9} fill={isFound ? (complete ? "var(--neon-pink)" : "var(--neon-cyan)") : "var(--foreground)"} />
                  <circle cx={s.x} cy={s.y} r={3.5} fill="transparent" />
                </g>
              );
            })}
          </svg>

          {active !== null && (
            <div key={active} className="glass animate-pop-in absolute bottom-2 left-1/2 w-[min(92%,440px)] -translate-x-1/2 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] tracking-widest text-neon-cyan">★ {CONSTELLATION[active].label.toUpperCase()}</p>
                <button onClick={() => setActive(null)} className="font-mono text-xs text-muted-foreground hover:text-foreground">close</button>
              </div>
              <p className="mt-1 font-display text-lg leading-snug">{CONSTELLATION[active].text}</p>
            </div>
          )}
        </div>
        {complete && (
          <p className="animate-pop-in mt-3 text-center font-hand text-3xl text-neon-pink neon-text-pink">
            You found every star. They make a heart, obviously. You're the whole sky to me.
          </p>
        )}
        {found.size === 0 && <p className="mt-2 text-center font-mono text-xs text-muted-foreground">tap the brighter stars to reveal their secrets</p>}
      </div>
    </AppWindow>
  );
}
