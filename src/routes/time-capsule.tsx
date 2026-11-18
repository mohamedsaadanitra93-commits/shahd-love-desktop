import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { ME, TIME_CAPSULE } from "@/content/shahd";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/time-capsule")({
  head: () => pageHead("TIME.CAPSULE", "A letter from today's version of me to our future selves, transmitted through time."),
  component: TimeCapsulePage,
});

type Stage = "sealed" | "warp" | "arrived";

function TimeCapsulePage() {
  const [stage, setStage] = useState<Stage>("sealed");
  const [year, setYear] = useState(2026);
  const [startYear, setStartYear] = useState(2026);
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const y = new Date().getFullYear();
    setStartYear(y);
    setYear(y);
  }, []);

  const launch = () => {
    setStage("warp");
    setYear(startYear);
    setLines(0);
    const target = startYear + 70;
    const t = window.setInterval(() => {
      setYear((y) => {
        if (y >= target) {
          window.clearInterval(t);
          window.setTimeout(() => setStage("arrived"), 500);
          return target;
        }
        return y + 1;
      });
    }, 45);
  };

  useEffect(() => {
    if (stage !== "arrived") return;
    const t = window.setInterval(() => {
      setLines((l) => {
        if (l >= TIME_CAPSULE.body.length) {
          window.clearInterval(t);
          return l;
        }
        return l + 1;
      });
    }, 900);
    return () => window.clearInterval(t);
  }, [stage]);

  return (
    <AppWindow title="TIME.CAPSULE" subtitle="temporal transmission" accent="var(--neon-cyan)" bodyClassName="bg-deep">
      <div className="relative flex min-h-full flex-col items-center justify-center overflow-hidden p-4 sm:p-8">
        {/* tunnel rings */}
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: 8 }, (_, i) => (
            <span
              key={i}
              className={cn("absolute rounded-full border border-neon-cyan/30", stage === "warp" ? "opacity-100" : "opacity-30")}
              style={{
                width: `${(i + 1) * 14}vmin`,
                height: `${(i + 1) * 14}vmin`,
                animation: stage === "warp" ? `twinkle 0.6s ease-in-out ${i * 0.07}s infinite` : `twinkle 4s ease-in-out ${i * 0.3}s infinite`,
                boxShadow: stage === "warp" ? "0 0 30px var(--neon-cyan)" : undefined,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center font-mono">
          <p className="text-[11px] tracking-[0.4em] text-neon-cyan">FROM: {TIME_CAPSULE.from.toUpperCase()} → TO: {TIME_CAPSULE.to.toUpperCase()}</p>
          <p className={cn("mt-2 font-display text-6xl font-bold tabular-nums sm:text-7xl", stage === "warp" ? "text-neon-pink neon-text-pink animate-jitter" : "text-neon-cyan neon-text-cyan")}>{year}</p>
          <p className="text-xs text-muted-foreground">
            {stage === "sealed" && `sealed in ${startYear} · destination: ${startYear + 70}`}
            {stage === "warp" && "transmitting through time... please hold hands"}
            {stage === "arrived" && `delivered · ${70} years in transit · integrity 100%`}
          </p>
        </div>

        {stage !== "arrived" && (
          <div className="relative z-10 mt-8 flex flex-col items-center gap-6">
            <svg viewBox="0 0 220 100" className={cn("w-64", stage === "warp" ? "" : "animate-float")} style={stage === "warp" ? { animation: "warp 3.2s ease-in forwards" } : undefined} aria-hidden>
              <rect x={10} y={20} width={200} height={60} rx={30} fill="var(--glass-strong)" stroke="var(--neon-cyan)" strokeWidth={2} />
              <rect x={10} y={20} width={100} height={60} rx={30} fill="var(--neon-cyan)" fillOpacity={0.2} />
              <circle cx={110} cy={50} r={18} fill="var(--deep)" stroke="var(--neon-pink)" strokeWidth={2} />
              <path d="M110 60 C100 54 101 46 110 49 C119 46 120 54 110 60 Z" fill="var(--neon-pink)" className="animate-heartbeat" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              <path d="M40 35 H70 M40 50 H80 M40 65 H60" stroke="var(--neon-cyan)" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
              <path d="M150 35 H185 M150 50 H175 M150 65 H190" stroke="var(--neon-cyan)" strokeWidth={2} strokeLinecap="round" opacity={0.6} />
            </svg>
            {stage === "sealed" && (
              <button onClick={launch} className="rounded-full border-2 border-neon-cyan bg-neon-cyan/10 px-8 py-3 font-display font-bold tracking-[0.3em] text-neon-cyan glow-cyan transition-transform hover:scale-105">
                SEND THROUGH TIME
              </button>
            )}
          </div>
        )}

        {stage === "arrived" && (
          <div className="relative z-10 mt-6 w-full max-w-2xl animate-window-open rounded-2xl border border-neon-cyan/40 bg-glass-strong p-6 shadow-[0_0_60px_-20px_var(--neon-cyan)] sm:p-8">
            <div className="scanlines pointer-events-none absolute inset-0 rounded-2xl opacity-50" />
            <div className="relative space-y-3">
              {TIME_CAPSULE.body.slice(0, lines).map((p, i) => (
                <p key={i} className={cn("animate-slide-up", i === 0 ? "font-display text-xl font-bold text-neon-cyan" : "text-base leading-relaxed text-foreground")}>{p}</p>
              ))}
              {lines < TIME_CAPSULE.body.length ? (
                <p className="caret font-mono text-xs text-neon-cyan">decoding</p>
              ) : (
                <>
                  <p className="animate-pop-in pt-2 text-right font-hand text-3xl text-neon-pink">— {ME}, {startYear}</p>
                  <button onClick={() => setStage("sealed")} className="font-mono text-xs text-muted-foreground underline">re-seal and send again</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </AppWindow>
  );
}
