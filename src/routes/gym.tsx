import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Person, type Mood } from "@/components/characters/Person";
import { AppWindow } from "@/components/os/AppWindow";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gym")({
  head: () => pageHead("GYM.INVESTIGATION", "Federal Fitness Investigation, case #070: the mysterious disappearance of Shahd from the gym."),
  component: GymPage,
});

const ACTIONS: { caption: string; mood: Mood; prop: "dumbbell" | "calendar" | "bag" | "none"; sunglasses: boolean; arm: number }[] = [
  { caption: "Examining suspicious gym equipment...", mood: "smile", prop: "dumbbell", sunglasses: true, arm: -55 },
  { caption: "Checking the calendar for any gym days...", mood: "shock", prop: "calendar", sunglasses: false, arm: -20 },
  { caption: "Collecting evidence...", mood: "smile", prop: "bag", sunglasses: true, arm: -40 },
  { caption: "...disappointed.", mood: "disappointed", prop: "none", sunglasses: false, arm: 0 },
];

const EVIDENCE = [
  {
    id: "A",
    title: "A gym membership card",
    details: ["Status: ACTIVE", "Monthly fee: still being paid", "Last scan: [REDACTED]", "Condition: mint. Suspiciously mint."],
  },
  {
    id: "B",
    title: "A pair of untouched sneakers",
    details: ["Sole wear: 0.00%", "Still smells like the store", "Laces: never tied", "Box: still kept 'just in case'"],
  },
  {
    id: "C",
    title: "A suspiciously long period without confirmed gym attendance",
    details: ["Confirmed visits this month: 0", "Excuses logged: 47", "Most common: 'tomorrow, wallah'", "Witnesses: none"],
  },
];

function Prop({ kind }: { kind: (typeof ACTIONS)[number]["prop"] }) {
  if (kind === "dumbbell")
    return (
      <svg viewBox="0 0 120 80" className="h-full w-full">
        <rect x={10} y={30} width={14} height={30} rx={3} fill="var(--char-ink)" />
        <rect x={96} y={30} width={14} height={30} rx={3} fill="var(--char-ink)" />
        <rect x={24} y={40} width={72} height={10} rx={4} fill="var(--muted-foreground)" />
        <path d="M60 45 L40 10 M60 45 L80 10 M60 45 L60 5 M48 26 Q60 20 72 26 M44 18 Q60 10 76 18" stroke="var(--paper-ink)" strokeWidth={1} fill="none" opacity={0.6} />
        <text x={60} y={76} textAnchor="middle" fontSize={9} fill="var(--paper-ink)" fontFamily="var(--font-mono)">dust level: ancient</text>
      </svg>
    );
  if (kind === "calendar")
    return (
      <svg viewBox="0 0 120 100" className="h-full w-full">
        <rect x={10} y={10} width={100} height={84} rx={6} fill="var(--paper)" stroke="var(--paper-ink)" strokeWidth={2} />
        <rect x={10} y={10} width={100} height={18} rx={6} fill="var(--neon-red)" />
        {Array.from({ length: 20 }, (_, i) => (
          <text key={i} x={20 + (i % 5) * 20} y={44 + Math.floor(i / 5) * 14} fontSize={10} fill="var(--paper-ink)" fontFamily="var(--font-mono)">?</text>
        ))}
      </svg>
    );
  if (kind === "bag")
    return (
      <svg viewBox="0 0 100 110" className="h-full w-full">
        <path d="M15 20 H85 L80 100 H20 Z" fill="var(--neon-cyan)" fillOpacity={0.25} stroke="var(--paper-ink)" strokeWidth={2} />
        <rect x={15} y={12} width={70} height={10} fill="var(--neon-red)" />
        <text x={50} y={20} textAnchor="middle" fontSize={7} fill="var(--paper)" fontFamily="var(--font-mono)">EVIDENCE</text>
        <path d="M32 70 Q30 50 50 52 L70 60 Q76 72 64 76 H36 Z" fill="var(--paper)" stroke="var(--paper-ink)" />
      </svg>
    );
  return null;
}

function GymPage() {
  const [step, setStep] = useState(0);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [report, setReport] = useState(false);
  const [stamp, setStamp] = useState(0);
  const [typed, setTyped] = useState("");
  const intro = "After extensive investigation, we have reached one conclusion...";

  useEffect(() => {
    const t = window.setInterval(() => setStep((s) => (s + 1) % ACTIONS.length), 3200);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    if (!report) return;
    setTyped("");
    let i = 0;
    const t = window.setInterval(() => {
      i++;
      setTyped(intro.slice(0, i));
      if (i >= intro.length) window.clearInterval(t);
    }, 35);
    return () => window.clearInterval(t);
  }, [report]);

  const a = ACTIONS[step];
  const allSeen = EVIDENCE.every((e) => flipped[e.id]);

  return (
    <AppWindow title="GYM.INVESTIGATION" subtitle="case #070 · classified" accent="var(--manila)" bodyClassName="bg-manila-dark">
      <div className="mx-auto max-w-5xl p-3 sm:p-8">
        <div className="relative rounded-lg bg-manila p-5 font-mono text-paper-ink shadow-2xl sm:p-8">
          <div className="absolute -top-4 left-8 h-6 w-32 rounded-t-lg bg-manila" />
          <div className="pointer-events-none absolute right-4 top-6 rotate-12 rounded border-4 border-neon-red px-3 py-1 font-display text-xl font-bold text-neon-red opacity-80 sm:right-10 sm:text-2xl">
            CLASSIFIED
          </div>
          <p className="text-[11px] tracking-[0.4em]">DEPARTMENT OF CARDIO AND JUSTICE</p>
          <h2 className="mt-1 font-display text-2xl font-bold tracking-wider sm:text-4xl">FEDERAL FITNESS INVESTIGATION</h2>
          <div className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
            <p><b>CASE</b> #070</p>
            <p><b>SUBJECT:</b> SHAHD</p>
            <p className="sm:col-span-2"><b>SUSPECTED CRIME:</b> DISAPPEARING FROM THE GYM.</p>
            <p><b>Last confirmed gym attendance:</b> UNKNOWN.</p>
            <p>
              <b>Investigation status:</b> <span className="animate-pulse font-bold text-neon-red">ONGOING.</span>
            </p>
          </div>

          <div className="mt-6 grid items-center gap-4 rounded-lg border-2 border-dashed border-paper-ink/40 bg-paper/50 p-4 sm:grid-cols-[180px_1fr_140px]">
            <div className="mx-auto w-36 sm:w-full">
              <Person kind="boy" detective sunglasses={a.sunglasses} magnifier mood={a.mood} look="right" rightArm={a.arm} title="Detective boyfriend" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-[11px] tracking-widest opacity-70">FIELD AGENT ACTIVITY · LIVE</p>
              <p key={step} className="animate-pop-in mt-1 font-display text-lg font-bold">{a.caption}</p>
              <p className="mt-2 text-xs opacity-70">Agent: the boyfriend · Equipment: magnifying glass, sunglasses, endless patience</p>
            </div>
            <div key={`p${step}`} className="animate-pop-in mx-auto h-28 w-32">
              <Prop kind={a.prop} />
            </div>
          </div>

          <p className="mt-8 text-[11px] tracking-[0.4em]">EXHIBITS · TAP TO EXAMINE</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {EVIDENCE.map((e) => {
              const open = flipped[e.id];
              return (
                <button
                  key={e.id}
                  onClick={() => setFlipped((f) => ({ ...f, [e.id]: !f[e.id] }))}
                  className="group h-52 [perspective:900px]"
                  aria-label={`Evidence ${e.id}`}
                >
                  <div className={cn("relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]", open && "[transform:rotateY(180deg)]")}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg border-2 border-paper-ink bg-paper p-4 [backface-visibility:hidden]">
                      <p className="text-xs tracking-widest">EVIDENCE</p>
                      <p className="font-display text-5xl font-bold">{e.id}</p>
                      <p className="mt-2 text-sm">{e.title}</p>
                      <p className="mt-3 text-[10px] opacity-60 group-hover:opacity-100">tap to examine →</p>
                    </div>
                    <div className="absolute inset-0 flex flex-col justify-center rounded-lg border-2 border-neon-red bg-paper p-4 text-left [backface-visibility:hidden] [transform:rotateY(180deg)]">
                      <p className="text-[10px] tracking-widest text-neon-red">FORENSIC ANALYSIS · {e.id}</p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {e.details.map((d) => (
                          <li key={d}>▸ {d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 rounded-lg border-2 border-paper-ink bg-paper p-5">
            <p className="text-[11px] tracking-[0.4em]">FINAL INVESTIGATION REPORT</p>
            {!report ? (
              <button
                onClick={() => setReport(true)}
                className="mt-3 rounded bg-paper-ink px-4 py-2 text-sm font-bold tracking-widest text-paper disabled:opacity-40"
                disabled={!allSeen}
              >
                {allSeen ? "READ FINAL REPORT" : `EXAMINE ALL EVIDENCE FIRST (${Object.values(flipped).filter(Boolean).length}/3)`}
              </button>
            ) : (
              <div className="mt-3">
                <p className="text-base">{typed}</p>
                {typed === intro && (
                  <p className="animate-pop-in mt-4 font-display text-3xl font-bold text-neon-red sm:text-5xl">Mchitich lgym a lm3gaza?</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setStamp((s) => s + 1)}
              className="rounded border-2 border-paper-ink bg-manila px-8 py-3 font-display text-lg font-bold tracking-[0.3em] transition-transform hover:scale-105 active:scale-95"
            >
              [ CLOSE CASE ]
            </button>
          </div>
        </div>
      </div>

      {stamp > 0 && (
        <div className="fixed inset-0 z-[65] grid place-items-center bg-deep/60 p-4" onClick={() => setStamp(0)}>
          <div key={stamp} className="max-w-lg rounded-lg border-[6px] border-neon-red bg-paper/95 px-6 py-5 text-center font-display text-2xl font-bold leading-tight text-neon-red shadow-2xl sm:text-3xl" style={{ animation: "stamp 0.5s ease-out both" }}>
            CASE CANNOT BE CLOSED UNTIL SUBJECT RETURNS TO THE GYM.
            <p className="mt-3 font-mono text-xs font-normal text-paper-ink">(tap anywhere to continue avoiding the gym)</p>
          </div>
        </div>
      )}
    </AppWindow>
  );
}
