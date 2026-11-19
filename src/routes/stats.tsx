import { createFileRoute } from "@tanstack/react-router";
import { Activity, Eye, Lock, Sparkles } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/stats")({
  head: () => pageHead("GIRLFRIEND.STATS", "Shahd's personality analytics: live dashboards, neon gauges and very scientific numbers."),
  component: StatsPage,
});

function useCountUp(target: number, ms = 2200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

function Ring({ label, value, color, loops = 1 }: { label: string; value: number; color: string; loops?: number }) {
  const shown = useCountUp(value);
  const r = 52;
  const c = 2 * Math.PI * r;
  const pct = loops > 1 ? (shown >= value ? 1 : (shown / (value / loops)) % 1) : shown / value;
  return (
    <div className="glass flex flex-col items-center rounded-2xl p-4">
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle cx={60} cy={60} r={r} stroke="var(--muted)" strokeWidth={10} fill="none" />
          <circle
            cx={60}
            cy={60}
            r={r}
            stroke={color}
            strokeWidth={10}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - Math.min(1, pct))}
            style={{ filter: `drop-shadow(0 0 6px ${color})` }}
          />
          {loops > 1 && shown >= value && (
            <circle cx={60} cy={60} r={r - 14} stroke={color} strokeWidth={3} fill="none" strokeDasharray="4 6" className="animate-spin-slow" style={{ transformOrigin: "center" }} />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-xl font-bold tabular-nums" style={{ color }}>{shown.toLocaleString()}%</span>
          {loops > 1 && shown >= value && <span className="font-mono text-[9px] text-neon-red">GAUGE BROKEN</span>}
        </div>
      </div>
      <p className="mt-2 font-mono text-xs tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

const ROMANTIC_LEVEL = "saad : twhchteek \n shahd : mzn";
const SECRET_MESSAGE = "shahd kula 15min : saad elach makatbghinich ?";

/** A black heart under a green scanner beam. Scanning reveals the secret message. */
function HeartScanner() {
  const [state, setState] = useState<"idle" | "scanning" | "done">("idle");
  const [pct, setPct] = useState(0);

  const scan = () => {
    setState("scanning");
    setPct(0);
    const t = window.setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          window.clearInterval(t);
          setState("done");
          return 100;
        }
        return p + 1;
      });
    }, 35);
  };

  return (
    <div className="grid items-center gap-6 rounded-2xl border border-scanner-beam/40 bg-scanner p-5 sm:grid-cols-[220px_1fr]">
      <div className="relative mx-auto aspect-square w-48 overflow-hidden rounded-xl border border-scanner-beam/30 bg-scanner sm:w-full">
        <div
          className="absolute inset-0 opacity-25"
          style={{ backgroundImage: "linear-gradient(var(--scanner-beam) 1px, transparent 1px), linear-gradient(90deg, var(--scanner-beam) 1px, transparent 1px)", backgroundSize: "16px 16px" }}
        />
        <svg viewBox="0 0 100 100" className="relative h-full w-full p-5" aria-label="Black heart being scanned">
          <path
            d="M50 86 C20 66 8 48 8 32 C8 18 19 9 31 9 C40 9 46 14 50 21 C54 14 60 9 69 9 C81 9 92 18 92 32 C92 48 80 66 50 86 Z"
            fill="var(--scanner)"
            stroke="var(--scanner-beam)"
            strokeWidth={1.5}
            className={cn(state !== "idle" && "animate-heartbeat")}
            style={{ transformOrigin: "center", filter: "drop-shadow(0 0 6px var(--scanner-beam))" }}
          />
        </svg>
        {state === "scanning" && (
          <div className="animate-heart-scan absolute inset-x-0 h-1 bg-scanner-beam" style={{ boxShadow: "0 0 18px 6px var(--scanner-beam)" }} />
        )}
        <p className="absolute bottom-1 left-2 font-mono text-[9px] text-scanner-beam">
          {state === "idle" ? "READY" : state === "scanning" ? `SCANNING ${pct}%` : "SCAN COMPLETE"}
        </p>
      </div>
      <div className="font-mono text-scanner-beam">
        <p className="text-[11px] tracking-[0.4em]">HEART SCANNER · BIOMETRIC</p>
        <p className="mt-1 font-display text-xl font-bold">Scan Shahd's heart for hidden messages</p>
        {state === "idle" && (
          <button onClick={scan} className="mt-4 rounded-lg border border-scanner-beam px-5 py-2 text-sm font-bold tracking-widest transition-colors hover:bg-scanner-beam/15">
            START SCAN
          </button>
        )}
        {state === "scanning" && (
          <div className="mt-4 max-w-sm">
            <div className="h-2 rounded-full bg-scanner-beam/15">
              <div className="h-full rounded-full bg-scanner-beam" style={{ width: `${pct}%`, boxShadow: "0 0 10px var(--scanner-beam)" }} />
            </div>
            <p className="mt-2 text-xs opacity-80">decrypting heart signals...</p>
          </div>
        )}
        {state === "done" && (
          <div className="animate-pop-in mt-4">
            <p className="text-xs opacity-80">SECRET MESSAGE FOUND:</p>
            <p className="mt-1 text-lg font-bold sm:text-xl">"{SECRET_MESSAGE}"</p>
            <button onClick={scan} className="mt-3 text-[11px] underline opacity-80">scan again</button>
          </div>
        )}
      </div>
    </div>
  );
}

const REACTIONS = ["LAUGHS", "DRAMATIC GASP", "SUDDEN HUG", "'WHAT?!'", "SILENT STARE", "CRIES AT AD", "RANDOM DANCE", "'I'M FINE'", "STEALS FOOD"];
const DAY_LEVEL = ["EXTREME", "HIGH", "MEDIUM-ISH", "SUSPICIOUSLY LOW", "HIGH", "CLINGY+", "MAXIMUM"];

function LiveGraph() {
  const [pts, setPts] = useState<number[]>(() => Array.from({ length: 40 }, (_, i) => 60 + Math.sin(i / 3) * 20));
  useEffect(() => {
    const t = window.setInterval(() => {
      setPts((p) => [...p.slice(1), Math.max(10, Math.min(98, (p[p.length - 1] ?? 60) + (Math.random() - 0.4) * 22))]);
    }, 450);
    return () => window.clearInterval(t);
  }, []);
  const path = pts.map((v, i) => `${(i / (pts.length - 1)) * 300},${100 - v}`).join(" ");
  return (
    <svg viewBox="0 0 300 100" className="h-40 w-full" preserveAspectRatio="none">
      {[20, 40, 60, 80].map((y) => (
        <line key={y} x1={0} x2={300} y1={y} y2={y} stroke="var(--border)" strokeDasharray="2 4" />
      ))}
      <polygon points={`0,100 ${path} 300,100`} fill="var(--neon-pink)" opacity={0.15} />
      <polyline points={path} fill="none" stroke="var(--neon-pink)" strokeWidth={2} style={{ filter: "drop-shadow(0 0 4px var(--neon-pink))" }} />
      <circle cx={300} cy={100 - (pts[pts.length - 1] ?? 60)} r={4} fill="var(--neon-pink)" />
    </svg>
  );
}

function Bars() {
  const [vals, setVals] = useState([40, 70, 55, 90, 65, 80, 95]);
  useEffect(() => {
    const t = window.setInterval(() => setVals((v) => v.map(() => 30 + Math.random() * 70)), 1500);
    return () => window.clearInterval(t);
  }, []);
  return (
    <div className="flex h-32 items-end gap-2">
      {vals.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center gap-1">
          <div className="flex w-full flex-1 items-end">
            <div className="w-full rounded-t-md bg-neon-cyan/80 transition-all duration-700 shadow-[0_0_10px_var(--neon-cyan)]" style={{ height: `${v}%` }} />
          </div>
          <span className="font-mono text-[9px] text-muted-foreground">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
        </div>
      ))}
    </div>
  );
}

function StatsPage() {
  const [reaction, setReaction] = useState(REACTIONS[0]);
  const [missed, setMissed] = useState(0);
  const [day, setDay] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<"idle" | "running" | "done">("idle");
  const [analysisPct, setAnalysisPct] = useState(0);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    setDay(new Date().getDay());
    const r = window.setInterval(() => setReaction(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]), 900);
    const m = window.setInterval(() => setMissed((x) => x + Math.floor(Math.random() * 97) + 13), 60);
    return () => {
      window.clearInterval(r);
      window.clearInterval(m);
    };
  }, []);

  const runAnalysis = () => {
    setAnalysis("running");
    setAnalysisPct(0);
    const t = window.setInterval(() => {
      setAnalysisPct((p) => {
        if (p >= 100) {
          window.clearInterval(t);
          setAnalysis("done");
          return 100;
        }
        return p + 2;
      });
    }, 40);
  };

  const dayName = day === null ? "TODAY" : ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][day];

  return (
    <AppWindow title="GIRLFRIEND.STATS" subtitle="personality analytics" accent="var(--neon-cyan)">
      <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.4em] text-neon-cyan">LIVE · REAL-TIME · VERY SCIENTIFIC</p>
            <h2 className="font-display text-2xl font-bold sm:text-4xl">
              SHAHD — <span className="text-neon-cyan neon-text-cyan">PERSONALITY ANALYTICS</span>
            </h2>
          </div>
          <div className="flex gap-3 font-mono text-[10px]">
            {[["SENSORS", "bg-neon-green"], ["HEART LINK", "bg-neon-pink"], ["GYM DATA", "bg-neon-red"]].map(([l, c]) => (
              <span key={l} className="flex items-center gap-1.5 rounded-full border border-border px-2 py-1">
                <span className={cn("h-2 w-2 animate-pulse rounded-full", c)} /> {l}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Ring label="CUTENESS" value={100000} color="var(--neon-pink)" loops={1000} />
          <Ring label="DRAMA" value={9999} color="var(--neon-gold)" loops={100} />
          <Ring label="INTELLIGENCE" value={100} color="var(--neon-cyan)" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card title="CLINGINESS" value="Depends on the day.">
            <p className="font-mono text-[11px] text-muted-foreground">{dayName}: <span className="text-neon-pink">{day === null ? "…" : DAY_LEVEL[day]}</span></p>
          </Card>
          <Card title="ROMANTIC LEVEL" value="">
            <button onClick={() => setReveal((r) => !r)} className="flex items-center gap-2 text-left">
              <span className={cn("whitespace-pre-line rounded bg-foreground px-2 font-display text-xl font-bold text-foreground transition-all", reveal && "bg-transparent text-base leading-snug text-neon-pink")}>
                {reveal ? ROMANTIC_LEVEL : "CLASSIFIED"}
              </span>
              <Lock className="h-4 w-4 text-muted-foreground" />
            </button>
          </Card>
          <Card title="ABILITY TO DISTRACT BOYFRIEND" value="MAXIMUM">
            <div className="flex gap-1">
              {Array.from({ length: 10 }, (_, i) => (
                <span key={i} className="h-3 flex-1 rounded-sm bg-neon-red shadow-[0_0_6px_var(--neon-red)]" />
              ))}
            </div>
          </Card>
          <Card title="TIMES BOYFRIEND MISSES HER" value="UNCOUNTABLE">
            <p className="font-mono text-xs tabular-nums text-neon-cyan">counter: {missed.toLocaleString()}… overflow</p>
          </Card>
          <Card title="SWEETNESS" value="OFF THE CHARTS">
            <div className="h-3 w-[160%] rounded-full bg-love shadow-[0_0_12px_var(--neon-pink)]" />
          </Card>
          <Card title="UNEXPECTED REACTIONS" value="RANDOMLY GENERATED">
            <p className="font-mono text-xs text-neon-gold">now generating: {reaction}</p>
          </Card>
          <Card title="BOYFRIEND'S ATTENTION" value="100% OCCUPIED">
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 32 32" className="h-8 w-8"><circle cx={16} cy={16} r={14} fill="var(--neon-pink)" /></svg>
              <span className="font-mono text-[10px] text-muted-foreground">Shahd 100% · Everything else 0%</span>
            </div>
          </Card>
          <Card title="SMILE-TO-BRAIN-CRASH RATIO" value="1 : 1">
            <p className="font-mono text-[11px] text-muted-foreground">see BUG #003</p>
          </Card>
        </div>

        <HeartScanner />

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="glass rounded-2xl p-4">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs text-neon-pink">
              <Activity className="h-4 w-4" /> BOYFRIEND HEART RATE WHEN SHE TEXTS · LIVE
            </div>
            <LiveGraph />
          </div>
          <div className="glass rounded-2xl p-4">
            <div className="mb-2 flex items-center gap-2 font-mono text-xs text-neon-cyan">
              <Eye className="h-4 w-4" /> DAILY DRAMA OUTPUT
            </div>
            <Bars />
          </div>
        </div>

        <div className="glass rounded-2xl p-5 text-center">
          {analysis === "idle" && (
            <button onClick={runAnalysis} className="inline-flex items-center gap-2 rounded-lg bg-neon-cyan/15 px-6 py-3 font-display font-bold tracking-widest text-neon-cyan hover:bg-neon-cyan/25">
              <Sparkles className="h-4 w-4" /> RUN FULL SYSTEM ANALYSIS
            </button>
          )}
          {analysis === "running" && (
            <div className="mx-auto max-w-md">
              <p className="font-mono text-xs text-muted-foreground">crunching {Math.round(analysisPct * 1234)} data points of pure Shahd...</p>
              <div className="mt-2 h-2 rounded-full bg-muted">
                <div className="h-full rounded-full bg-neon-cyan transition-all" style={{ width: `${analysisPct}%` }} />
              </div>
            </div>
          )}
          {analysis === "done" && (
            <div className="animate-pop-in space-y-1">
              <p className="font-mono text-sm text-neon-green">Analysis complete.</p>
              <p className="font-display text-xl font-bold sm:text-2xl">
                Conclusion: <span className="text-primary neon-text-pink">One Shahd is enough to occupy an entire universe.</span>
              </p>
              <button onClick={runAnalysis} className="mt-2 font-mono text-[11px] text-muted-foreground underline">re-run analysis</button>
            </div>
          )}
        </div>
      </div>
    </AppWindow>
  );
}

function Card({ title, value, children }: { title: string; value: string; children?: ReactNode }) {
  return (
    <div className="glass overflow-hidden rounded-2xl p-4">
      <p className="font-mono text-[10px] tracking-widest text-muted-foreground">{title}</p>
      {value && <p className="mt-1 font-display text-xl font-bold text-foreground">{value}</p>}
      <div className="mt-2">{children}</div>
    </div>
  );
}
