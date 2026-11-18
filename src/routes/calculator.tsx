import { createFileRoute } from "@tanstack/react-router";
import { Delete } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { HeartBurst } from "@/components/os/Hearts";
import { calculate } from "@/lib/love-calculator";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calculator")({
  head: () => pageHead("CALCULATOR.EXE", "A perfectly normal calculator with a very romantic secret personality."),
  component: CalculatorPage,
});

type Key = { label: string; value: string; kind: "num" | "op" | "fn" | "eq" | "word"; wide?: boolean };

const KEYS: Key[] = [
  { label: "AC", value: "AC", kind: "fn" },
  { label: "⌫", value: "DEL", kind: "fn" },
  { label: "%", value: "%", kind: "fn" },
  { label: "÷", value: "÷", kind: "op" },
  { label: "7", value: "7", kind: "num" },
  { label: "8", value: "8", kind: "num" },
  { label: "9", value: "9", kind: "num" },
  { label: "×", value: "×", kind: "op" },
  { label: "4", value: "4", kind: "num" },
  { label: "5", value: "5", kind: "num" },
  { label: "6", value: "6", kind: "num" },
  { label: "−", value: "−", kind: "op" },
  { label: "1", value: "1", kind: "num" },
  { label: "2", value: "2", kind: "num" },
  { label: "3", value: "3", kind: "num" },
  { label: "+", value: "+", kind: "op" },
  { label: "0", value: "0", kind: "num", wide: true },
  { label: ".", value: ".", kind: "num" },
  { label: "=", value: "=", kind: "eq" },
];

const WORD_KEYS: Key[] = [
  { label: "LOVE", value: "LOVE", kind: "word" },
  { label: "TIME", value: "TIME", kind: "word" },
  { label: "YOU", value: "YOU", kind: "word" },
  { label: "ME", value: "ME", kind: "word" },
];

function CalculatorPage() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<{ output: string; easter: boolean } | null>(null);
  const [history, setHistory] = useState<{ expr: string; output: string; easter: boolean }[]>([]);
  const [burst, setBurst] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const evaluate = useCallback(
    (e: string) => {
      if (!e) return;
      const r = calculate(e);
      setResult(r);
      setHistory((h) => [{ expr: e, ...r }, ...h].slice(0, 12));
      if (r.easter) {
        setBurst((b) => b + 1);
        setUnlocked(true);
      }
    },
    [],
  );

  const press = useCallback(
    (v: string) => {
      if (v === "AC") {
        setExpr("");
        setResult(null);
        return;
      }
      if (v === "DEL") {
        setResult(null);
        setExpr((e) => (/(LOVE|TIME|YOU|ME)$/.test(e) ? e.replace(/(LOVE|TIME|YOU|ME)$/, "") : e.slice(0, -1)));
        return;
      }
      if (v === "=") {
        evaluate(expr);
        return;
      }
      if (v === "HOWMUCH") {
        setExpr("HOW MUCH HE LOVES ME");
        evaluate("LOVE");
        return;
      }
      setExpr((e) => {
        // continue from a numeric result
        if (result && !result.easter && /^[+−×÷%]$/.test(v)) return result.output + v;
        if (result) return v;
        return (e === "HOW MUCH HE LOVES ME" ? "" : e) + v;
      });
      setResult(null);
    },
    [evaluate, expr, result],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = { "*": "×", "/": "÷", "-": "−", Enter: "=", "=": "=", Backspace: "DEL", Escape: "AC" };
      const k = map[e.key] ?? e.key;
      if (/^[0-9.+%]$/.test(k) || ["×", "÷", "−", "=", "DEL", "AC"].includes(k)) {
        e.preventDefault();
        press(k);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [press]);

  return (
    <AppWindow title="CALCULATOR.EXE" subtitle="totally normal calculator" accent="var(--neon-cyan)">
      <div className="mx-auto grid max-w-4xl gap-6 p-4 sm:p-8 md:grid-cols-[minmax(0,380px)_1fr]">
        <div
          className={cn(
            "relative rounded-[28px] border p-4 transition-all duration-700",
            unlocked ? "border-neon-pink/60 bg-glass-strong glow-pink" : "border-border bg-glass-strong",
          )}
        >
          <div className="mb-3 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground">
            <span>{unlocked ? "PERSONALITY: UNLOCKED ♥" : "MODEL CX-70 · SOLAR"}</span>
            <span className={cn("h-2 w-8 rounded-full", unlocked ? "bg-neon-pink" : "bg-neon-cyan/50")} />
          </div>
          <div
            className={cn(
              "relative mb-4 flex min-h-32 flex-col justify-end overflow-hidden rounded-2xl p-4 text-right transition-colors duration-700",
              unlocked ? "bg-primary/15" : "bg-deep",
            )}
          >
            <div className="scanlines pointer-events-none absolute inset-0 opacity-50" />
            <p className="min-h-5 break-all font-mono text-sm text-muted-foreground">{expr || " "}</p>
            <p
              key={result?.output}
              className={cn(
                "animate-pop-in break-words font-mono leading-tight",
                result?.easter ? "text-xl text-neon-pink neon-text-pink sm:text-2xl" : "text-4xl text-neon-cyan neon-text-cyan",
              )}
            >
              {result ? result.output : expr ? "" : "0"}
            </p>
            {burst > 0 && <HeartBurst key={burst} count={16} />}
          </div>

          <div className="mb-2 grid grid-cols-4 gap-2">
            {WORD_KEYS.map((k) => (
              <button
                key={k.value}
                onClick={() => press(k.value)}
                className="rounded-xl border border-neon-violet/40 bg-neon-violet/10 py-2 font-mono text-xs tracking-wider text-neon-violet transition-all hover:bg-neon-violet/25 active:scale-95"
              >
                {k.label}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {KEYS.map((k) => (
              <button
                key={k.value}
                onClick={() => press(k.value)}
                className={cn(
                  "h-14 rounded-xl font-display text-xl font-semibold transition-all active:scale-95",
                  k.wide && "col-span-2",
                  k.kind === "num" && "bg-muted text-foreground hover:bg-muted/70",
                  k.kind === "op" && "bg-neon-cyan/15 text-neon-cyan hover:bg-neon-cyan/25",
                  k.kind === "fn" && "bg-secondary/10 text-muted-foreground hover:text-foreground",
                  k.kind === "eq" && "bg-love text-primary-foreground glow-pink",
                )}
              >
                {k.label === "⌫" ? <Delete className="mx-auto h-5 w-5" /> : k.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => press("HOWMUCH")}
            className="mt-3 w-full rounded-xl border border-dashed border-neon-pink/50 py-2 font-mono text-xs text-neon-pink transition-colors hover:bg-neon-pink/10"
          >
            ♥ CALCULATE: HOW MUCH DOES HE LOVE ME?
          </button>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-2xl p-4">
            <p className="font-mono text-[11px] tracking-widest text-neon-cyan">CALCULATION TAPE</p>
            {history.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No calculations yet. Try something. Anything. Maybe 1 + 1?</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {history.map((h, i) => (
                  <li key={i} className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-2 font-mono text-sm">
                    <span className="truncate text-muted-foreground">{h.expr}</span>
                    <span className={h.easter ? "text-right text-neon-pink" : "text-neon-cyan"}>= {h.output}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="glass rounded-2xl p-4 text-sm text-muted-foreground">
            <p className="font-mono text-[11px] tracking-widest text-neon-gold">USER MANUAL (abridged)</p>
            <p className="mt-2">This calculator performs standard arithmetic. It has also been known to have feelings. Results may be biased in favour of you.</p>
            <p className="mt-2 font-mono text-xs">Keyboard works too: 0-9 + - * / Enter Esc</p>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
