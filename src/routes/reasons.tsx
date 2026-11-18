import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { HeartBurst, HeartShape } from "@/components/os/Hearts";
import { REASONS } from "@/content/shahd";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/reasons")({
  head: () => pageHead("THE 100 REASONS MACHINE", "A futuristic machine that generates reasons why Shahd is special. It never runs out."),
  component: ReasonsPage,
});

function shuffle(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ReasonsPage() {
  const deck = useRef<number[]>([]);
  const [current, setCurrent] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [spinning, setSpinning] = useState(false);
  const [burst, setBurst] = useState(0);

  const generate = () => {
    if (spinning) return;
    if (deck.current.length === 0) deck.current = shuffle(REASONS.length);
    setSpinning(true);
    window.setTimeout(() => {
      const next = deck.current.pop()!;
      setCurrent(next);
      setSeen((s) => new Set(s).add(next));
      setSpinning(false);
      setBurst((b) => b + 1);
    }, 1100);
  };

  const pct = (seen.size / REASONS.length) * 100;

  return (
    <AppWindow title="100.REASONS" subtitle="reason generator v100" accent="var(--neon-violet)">
      <div className="flex min-h-full flex-col items-center justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-2xl rounded-[32px] border-2 border-neon-violet/50 bg-glass-strong p-6 shadow-[0_0_80px_-20px_var(--neon-violet)] sm:p-10">
          <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 gap-2">
            {["bg-neon-green", "bg-neon-gold", "bg-neon-red"].map((c, i) => (
              <span key={c} className={cn("h-3 w-3 rounded-full", c, spinning && "animate-pulse")} style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
          <div className="flex items-center justify-between font-mono text-[11px] tracking-widest text-muted-foreground">
            <span>THE 100 REASONS MACHINE</span>
            <span>{current === null ? "READY" : `REASON #${String(current + 1).padStart(3, "0")}`}</span>
          </div>

          <div className="relative mt-4 flex min-h-48 items-center justify-center overflow-hidden rounded-2xl border border-neon-violet/30 bg-deep p-6 text-center">
            <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
            {/* gears */}
            <svg viewBox="0 0 100 100" className={cn("absolute -left-8 -top-8 h-28 w-28 text-neon-violet/20", spinning ? "animate-spin [animation-duration:0.8s]" : "animate-spin-slow")} aria-hidden>
              <circle cx={50} cy={50} r={30} fill="none" stroke="currentColor" strokeWidth={10} strokeDasharray="10 8" />
            </svg>
            <svg viewBox="0 0 100 100" className={cn("absolute -bottom-10 -right-10 h-32 w-32 text-neon-pink/15", spinning ? "animate-spin [animation-duration:1s]" : "animate-spin-slow")} aria-hidden>
              <circle cx={50} cy={50} r={30} fill="none" stroke="currentColor" strokeWidth={10} strokeDasharray="10 8" />
            </svg>
            {spinning ? (
              <p className="font-mono text-sm text-neon-violet">
                <span className="caret">processing feelings</span>
              </p>
            ) : current === null ? (
              <p className="font-display text-lg text-muted-foreground">Press the button. The machine is warmed up and very emotional.</p>
            ) : (
              <p key={current} className="animate-pop-in font-display text-xl font-semibold leading-snug text-foreground sm:text-2xl">{REASONS[current]}</p>
            )}
            {burst > 0 && !spinning && <HeartBurst key={burst} count={14} />}
          </div>

          <div className="mt-6 flex flex-col items-center gap-4">
            <button
              onClick={generate}
              disabled={spinning}
              className="bg-love flex items-center gap-3 rounded-full px-8 py-4 font-display text-base font-bold tracking-[0.2em] text-primary-foreground glow-pink transition-transform hover:scale-105 active:scale-95 disabled:opacity-70"
            >
              GENERATE A REASON <HeartShape className="h-5 w-5 animate-heartbeat" />
            </button>
            <div className="w-full">
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>REASONS DISCOVERED</span>
                <span>{seen.size} / {REASONS.length}</span>
              </div>
              <div className="mt-1 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-neon-violet transition-all" style={{ width: `${pct}%` }} />
              </div>
              {seen.size === REASONS.length && (
                <p className="mt-2 text-center text-sm text-neon-pink">All 100 found. The machine is restarting the list, because every single one is still true.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
