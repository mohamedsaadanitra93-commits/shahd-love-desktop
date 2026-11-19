import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Bug, ShieldAlert, Wrench, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/bug-report")({
  head: () => pageHead("BUG.REPORT", "SHAHD.EXE system diagnostics: five critical bugs that the developer refuses to fix."),
  component: BugReportPage,
});

const BUGS = [
  { id: "001", problem: "Shahd is too cute.", severity: "CRITICAL", status: "Cannot be fixed.", comment: "I'm not even trying to fix it.", tone: "red" },
  { id: "002", problem: "Excessive dramatic reactions detected.", severity: "HIGH", status: "Working as intended.", comment: "Honestly the best entertainment I have.", tone: "gold" },
  { id: "003", problem: "Boyfriend's brain stops working when Shahd smiles.", severity: "CRITICAL", status: "No solution available.", comment: "Tried restarting. She smiled again. Crashed again.", tone: "red" },
  { id: "004", problem: "Random arguments generated without warning.", severity: "UNPREDICTABLE", status: "Requires boyfriend patience update.", comment: "Patience v2.0 is downloading... 3% ... please wait.", tone: "violet" },
  { id: "005", problem: "Excessive clinginess.", severity: "CLASSIFIED", status: "Developer secretly enjoys it.", comment: "Do NOT fix. I repeat, do NOT fix.", tone: "cyan" },
] as const;

const SEVERITY: Record<string, string> = {
  red: "bg-neon-red/20 text-neon-red border-neon-red/60",
  gold: "bg-neon-gold/15 text-neon-gold border-neon-gold/50",
  violet: "bg-neon-violet/15 text-neon-violet border-neon-violet/50",
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/50",
};

const LOGS: [string, "ok" | "warn" | "err" | "info"][] = [
  ["[boot] mounting /dev/heart ... ok", "ok"],
  ["[scan] reading cuteness sensor ... value out of range", "warn"],
  ["[scan] cuteness = 100000% (sensor melted)", "err"],
  ["[diag] drama.module loaded (9999 instances)", "info"],
  ["[diag] boyfriend.brain → ping ... request timed out", "err"],
  ["[diag] cause: Shahd smiled at 14:02:07", "warn"],
  ["[gym] locating last gym check-in ... 404 not found", "err"],
  ["[mem] memories.db size: infinite, compressing ... failed (too precious)", "warn"],
  ["[net] incoming: 'I miss you' x 37 · accepting all", "ok"],
  ["[sys] attempting to reduce clinginess ... permission denied by developer", "err"],
  ["[sys] patience.update downloading ... 3%", "info"],
  ["[love] heart.service status: OVERCLOCKED", "warn"],
  ["[ai] analysing argument triggers ... pattern: none · random seed: 'mood'", "info"],
  ["[ok] system stable. somehow.", "ok"],
];

const WARNINGS = [
  "Shahd smiled. BOYFRIEND.EXE has stopped responding.",
  "Cuteness overflow in sector 7. Evacuate.",
  "Unscheduled dramatic reaction detected.",
  "Clinginess spike. Developer: 'nice'.",
  "Gym attendance sensor reporting dust.",
  "Heart rate exceeded safe limits after a single text message.",
];

/** Messages SHAHD.EXE sends to the browser console (F12) while BUG.REPORT is open. */
const CONSOLE_MESSAGES = [
  "SHAHD.EXE diagnostics console connected.",
  "[ERROR] Shahd is too cute. Fix attempt failed.",
  "[WARN] Boyfriend.brain stopped responding after a smile.",
  "[INFO] Drama module running at 9999%. Working as intended.",
  "[ERROR] Gym attendance not found. Case #070 still open.",
  "[INFO] Clinginess detected. Developer secretly enjoys it.",
  "[MSG] Saad: if you're reading this in the console... you're a hacker now. A cute one.",
  "[MSG] Saad: there are no bugs here. Only features I love.",
  "[MSG] Saad: twhchteek.",
  "[OK] System stable. Heart overclocked. Goodbye, console 💗",
];

const CONSOLE_STYLE: Record<string, string> = {
  ERROR: "color:#ff4d6d;font-weight:bold",
  WARN: "color:#ffd166;font-weight:bold",
  INFO: "color:#4cc9f0",
  MSG: "color:#ff6fb5;font-weight:bold;font-size:13px",
  OK: "color:#39ff88;font-weight:bold",
};

const PROGRESS = [
  { label: "Scanning cuteness levels", target: 140, note: "OVERFLOW" },
  { label: "Measuring drama output", target: 100, note: "9999 units" },
  { label: "Locating boyfriend's brain", target: 12, note: "NOT FOUND" },
  { label: "Verifying gym attendance", target: 3, note: "TIMEOUT" },
  { label: "Calibrating patience", target: 99, note: "STUCK AT 99%" },
];

function BugReportPage() {
  const [lines, setLines] = useState<typeof LOGS>([]);
  const [warnings, setWarnings] = useState<{ id: number; text: string }[]>([]);
  const [progress, setProgress] = useState(PROGRESS.map(() => 0));
  const [fixState, setFixState] = useState<"idle" | "fixing" | "failed">("idle");
  const [fixPct, setFixPct] = useState(0);
  const [open, setOpen] = useState<string | null>("001");
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const t = window.setInterval(() => {
      setLines((l) => [...l, LOGS[i % LOGS.length]!].slice(-40));
      i++;
    }, 650);
    return () => window.clearInterval(t);
  }, []);

  // Send the console messages one by one so they arrive like real system logs.
  useEffect(() => {
    const timers = CONSOLE_MESSAGES.map((msg, i) =>
      window.setTimeout(() => {
        const tag = /^\[(\w+)\]/.exec(msg)?.[1] ?? "";
        console.log(`%c${msg}`, CONSOLE_STYLE[tag] ?? "color:#39ff88;font-family:monospace");
      }, i * 900),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    let k = 0;
    const t = window.setInterval(() => {
      const id = Date.now();
      setWarnings((w) => [...w.slice(-2), { id, text: WARNINGS[k % WARNINGS.length] ?? "" }]);
      k++;
      window.setTimeout(() => setWarnings((w) => w.filter((x) => x.id !== id)), 5000);
    }, 7000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => {
      setProgress((p) => p.map((v, i) => Math.min(PROGRESS[i]?.target ?? 100, v + 1 + Math.random() * 4)));
    }, 80);
    return () => window.clearInterval(t);
  }, []);

  const fixAll = () => {
    setFixState("fixing");
    setFixPct(0);
    const t = window.setInterval(() => {
      setFixPct((p) => {
        if (p >= 97) {
          window.clearInterval(t);
          window.setTimeout(() => setFixState("failed"), 400);
          return 99;
        }
        return p + 3;
      });
    }, 50);
  };

  return (
    <AppWindow title="BUG.REPORT" subtitle="system diagnostics" accent="var(--neon-red)" bodyClassName="bg-terminal">
      <div className="scanlines pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-5xl space-y-6 p-4 font-mono sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.4em] text-neon-green">DIAGNOSTIC MODE · ROOT</p>
            <h2 className="animate-glitch font-display text-2xl font-bold text-neon-red neon-text-red sm:text-4xl">SHAHD.EXE — SYSTEM DIAGNOSTICS</h2>
            <p className="mt-1 text-xs text-muted-foreground">5 critical features detected · 0 fixable · developer mood: smitten</p>
            <p className="mt-1 text-[11px] text-neon-green/80">psst · open the browser console (F12) · there are messages waiting for you</p>
          </div>
          <button
            onClick={fixAll}
            disabled={fixState === "fixing"}
            className="flex items-center gap-2 rounded-lg border border-neon-green/60 bg-neon-green/10 px-5 py-3 text-sm font-bold tracking-widest text-neon-green transition-all hover:bg-neon-green/20 disabled:opacity-60"
          >
            <Wrench className="h-4 w-4" /> {fixState === "fixing" ? `FIXING... ${fixPct}%` : "FIX ALL BUGS"}
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-3">
            {BUGS.map((b) => (
              <button
                key={b.id}
                onClick={() => setOpen(open === b.id ? null : b.id)}
                className={cn(
                  "w-full rounded-xl border bg-deep/60 p-4 text-left transition-all hover:border-neon-red/60",
                  open === b.id ? "border-neon-red/60" : "border-border",
                )}
              >
                <div className="flex items-center gap-3">
                  <Bug className="h-5 w-5 shrink-0 text-neon-red" />
                  <span className="text-sm text-neon-green">BUG #{b.id}</span>
                  <span className={cn("ml-auto rounded border px-2 py-0.5 text-[10px] tracking-widest", SEVERITY[b.tone])}>{b.severity}</span>
                </div>
                <p className="mt-2 font-display text-base text-foreground">{b.problem}</p>
                {open === b.id && (
                  <div className="animate-pop-in mt-3 space-y-1 border-t border-border pt-3 text-xs">
                    <p><span className="text-muted-foreground">STATUS:</span> <span className="text-neon-gold">{b.status}</span></p>
                    <p><span className="text-muted-foreground">DEV COMMENT:</span> <span className="text-neon-cyan">"{b.comment}"</span></p>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-neon-green/30 bg-deep/80 p-4">
              <p className="mb-2 text-[11px] tracking-widest text-neon-green">LIVE TERMINAL</p>
              <div ref={termRef} className="h-56 overflow-y-auto pr-2 text-xs leading-relaxed">
                {lines.map(([text, kind], i) => (
                  <p
                    key={i}
                    className={cn(
                      kind === "ok" && "text-neon-green",
                      kind === "warn" && "text-neon-gold",
                      kind === "err" && "text-neon-red",
                      kind === "info" && "text-neon-cyan",
                    )}
                  >
                    <span className="text-muted-foreground">$ </span>
                    {text}
                  </p>
                ))}
                <p className="caret text-neon-green" />
              </div>
            </div>

            <div className="space-y-3 rounded-xl border border-border bg-deep/60 p-4">
              <p className="text-[11px] tracking-widest text-neon-cyan">DIAGNOSTICS</p>
              {PROGRESS.map((p, i) => {
                const v = progress[i] ?? 0;
                const over = v > 100;
                return (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs">
                      <span className="text-foreground">{p.label}</span>
                      <span className={over || v < 20 ? "text-neon-red" : "text-neon-green"}>
                        {Math.round(v) >= p.target ? p.note : `${Math.round(v)}%`}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-visible rounded-full bg-muted">
                      <div
                        className={cn("h-full rounded-full transition-all", over ? "bg-neon-red shadow-[0_0_12px_var(--neon-red)]" : "bg-neon-green")}
                        style={{ width: `${v}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none fixed bottom-20 left-1/2 z-40 flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2">
        {warnings.map((w) => (
          <div key={w.id} className="animate-slide-up flex items-center gap-2 rounded-lg border border-neon-red bg-deep/95 px-3 py-2 font-mono text-xs text-neon-red shadow-[0_0_20px_var(--neon-red)]">
            <AlertTriangle className="h-4 w-4 shrink-0 animate-pulse" /> WARNING: {w.text}
          </div>
        ))}
      </div>

      {fixState === "failed" && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-deep/80 p-4 backdrop-blur-sm" onClick={() => setFixState("idle")}>
          <div
            className="animate-shake relative w-full max-w-md rounded-xl border-2 border-neon-red bg-terminal p-6 text-center font-mono shadow-[0_0_60px_var(--neon-red)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setFixState("idle")} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
            <ShieldAlert className="mx-auto h-12 w-12 text-neon-red" />
            <p className="animate-glitch mt-3 font-display text-3xl font-bold text-neon-red neon-text-red">ERROR: IMPOSSIBLE.</p>
            <p className="mt-2 text-sm text-foreground">Developer refuses to fix these features.</p>
            <p className="mt-4 text-[11px] text-muted-foreground">fix attempt halted at 99% · reason: "I like her exactly like this"</p>
          </div>
        </div>
      )}
    </AppWindow>
  );
}
