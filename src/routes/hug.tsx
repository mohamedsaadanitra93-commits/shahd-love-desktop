import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Dog } from "@/components/characters/Dog";
import { Person } from "@/components/characters/Person";
import { AppWindow } from "@/components/os/AppWindow";
import { HeartBurst, HeartRain, HeartShape } from "@/components/os/Hearts";
import { useOs } from "@/components/os/OsProvider";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hug")({
  head: () => pageHead("HUG.EXE", "Press the glowing button and send Shahd a hug. Unlimited supply, special surprises at milestones."),
  component: HugPage,
});

type Phase = "idle" | "run" | "hug";

const MILESTONES = [
  { n: 10, label: "The dog joins the hug" },
  { n: 25, label: "Heart explosion" },
  { n: 50, label: "Something very romantic" },
  { n: 70, label: "The last word" },
];

function HugPage() {
  const { hugs, addHug, outfit } = useOs();
  const [phase, setPhase] = useState<Phase>("idle");
  const [wave, setWave] = useState(0);
  const [special, setSpecial] = useState<null | 25 | 50 | 70>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const sendHug = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    const n = addHug();
    setPhase("run");
    setWave((w) => w + 1);
    if (n === 25 || n === 50 || n === 70) setSpecial(n);
    else if (special && n !== special) setSpecial(null);
    timers.current.push(window.setTimeout(() => setPhase("hug"), 900));
    timers.current.push(window.setTimeout(() => setPhase("idle"), n === 50 || n === 70 ? 9000 : 5200));
  };

  const together = phase !== "idle";
  const hugging = phase === "hug";
  const dogJoins = hugs >= 10;

  return (
    <AppWindow title="HUG.EXE" subtitle="infinite supply" accent="var(--neon-pink)">
      <div className={cn("relative flex min-h-full flex-col items-center overflow-hidden px-4 pb-10 pt-6", hugging && "animate-pulse-screen")}>
        {wave > 0 && phase !== "idle" && <HeartRain key={wave} count={hugs >= 25 ? 46 : 28} />}
        {special === 50 && hugging && <RomanticSky />}

        <div className="z-10 text-center">
          <p className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground">HUGS SENT</p>
          <p key={hugs} className="animate-pop-in font-display text-6xl font-bold text-primary neon-text-pink tabular-nums">{hugs}</p>
        </div>

        {/* stage */}
        <div className="relative z-10 mt-4 h-[300px] w-full max-w-2xl sm:h-[360px]">
          <div className="absolute inset-x-6 bottom-4 h-6 rounded-[50%] bg-primary/20 blur-md" />
          <div
            className="absolute bottom-6 w-[30%] max-w-[180px] transition-[left] duration-[900ms] ease-out"
            style={{ left: together ? "calc(50% - min(30%, 180px) + 6%)" : "4%" }}
          >
            <Person
              kind="boy"
              pose={phase === "run" ? "run" : "stand"}
              look="right"
              mood={hugging ? "happy" : "smile"}
              rightArm={hugging ? -105 : phase === "run" ? -30 : 0}
              leftArm={phase === "run" ? 20 : 0}
              className="w-full"
            />
          </div>
          <div
            className="absolute bottom-6 w-[30%] max-w-[180px] transition-[right] duration-[900ms] ease-out"
            style={{ right: together ? "calc(50% - min(30%, 180px) + 6%)" : "4%" }}
          >
            <Person
              kind="girl"
              pose={phase === "run" ? "run" : "stand"}
              look="left"
              mood={hugging ? "love" : "smile"}
              leftArm={hugging ? 105 : phase === "run" ? 30 : 0}
              rightArm={phase === "run" ? -20 : 0}
              className="w-full"
            />
          </div>
          {hugging && dogJoins && (
            <div className="animate-pop-in absolute bottom-2 left-1/2 w-[22%] max-w-[130px] -translate-x-1/2">
              <Dog pose="sit" outfit={outfit} happy className="w-full" />
            </div>
          )}
          {hugging && (
            <HeartShape className="animate-pop-in absolute left-1/2 top-2 h-10 w-10 -translate-x-1/2 text-neon-pink drop-shadow-[0_0_14px_var(--neon-pink)]" />
          )}
          {special === 25 && hugging && <HeartBurst key={`b${wave}`} count={60} />}
        </div>

        <div className="z-10 min-h-24 max-w-xl text-center">
          {hugging && (
            <p className="animate-pop-in font-hand text-3xl leading-tight text-foreground sm:text-4xl">
              {special === 70
                ? "70 hugs. And I'd still ask for another."
                : special === 50
                  ? "50 hugs. You are my favorite place in the whole universe."
                  : "Consider this a hug until I can give you a real one."}
            </p>
          )}
          {special === 25 && hugging && <p className="mt-1 font-mono text-xs text-neon-gold">MILESTONE 25 · HEART EXPLOSION</p>}
        </div>

        <button
          onClick={sendHug}
          className="bg-love group relative z-10 mt-2 rounded-full px-10 py-5 font-display text-lg font-bold tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105 active:scale-95 sm:text-xl"
          style={{ boxShadow: "0 0 40px 6px oklch(0.74 0.21 352 / 55%), 0 0 90px 10px oklch(0.7 0.19 300 / 30%)" }}
        >
          <span className="absolute inset-0 animate-ping rounded-full bg-primary/30 [animation-duration:2.4s]" />
          <span className="relative flex items-center gap-3">
            SEND ME A HUG <HeartShape className="h-6 w-6 animate-heartbeat" />
          </span>
        </button>

        <div className="z-10 mt-10 grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
          {MILESTONES.map((m) => {
            const done = hugs >= m.n;
            return (
              <div key={m.n} className={cn("rounded-xl border p-3 text-center transition-all", done ? "border-neon-pink/60 bg-primary/10" : "border-border bg-glass")}>
                <p className={cn("font-display text-2xl font-bold", done ? "text-primary" : "text-muted-foreground")}>{m.n}</p>
                <p className="text-xs text-muted-foreground">{done ? m.label : "LOCKED"}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AppWindow>
  );
}

function RomanticSky() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 animate-window-open">
      <div className="absolute inset-0 bg-deep/80" />
      {Array.from({ length: 40 }, (_, i) => (
        <span
          key={i}
          className="absolute h-1 w-1 animate-twinkle rounded-full bg-foreground"
          style={{ left: `${(i * 41) % 100}%`, top: `${(i * 23) % 70}%`, animationDelay: `${(i % 7) * 0.3}s` }}
        />
      ))}
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="absolute h-[2px] w-32 rounded-full bg-gradient-to-l from-transparent to-neon-gold"
          style={{ right: `${-10 + i * 20}%`, top: `${8 + i * 12}%`, animation: `shoot 2.4s ease-out ${i * 0.9}s infinite` }}
        />
      ))}
      <svg viewBox="0 0 200 180" className="absolute left-1/2 top-1/2 h-[80%] -translate-x-1/2 -translate-y-1/2 text-neon-pink">
        <path
          d="M100 165 C20 110 0 60 40 30 C65 12 90 25 100 45 C110 25 135 12 160 30 C200 60 180 110 100 165 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeDasharray="600"
          strokeDashoffset="600"
          style={{ animation: "dash 3s ease-out forwards", filter: "drop-shadow(0 0 8px var(--neon-pink))" }}
        />
      </svg>
    </div>
  );
}
