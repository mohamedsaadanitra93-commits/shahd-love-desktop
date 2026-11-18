import { createFileRoute } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useState } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { Atmosphere } from "@/components/os/Atmosphere";
import { ME, OPEN_WHEN, type OpenWhenLetter } from "@/content/shahd";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/open-when")({
  head: () => pageHead("OPEN WHEN...", "Digital envelopes for every kind of day: sad, missing me, angry, sleepless, and more."),
  component: OpenWhenPage,
});

const ENV_COLOR: Record<OpenWhenLetter["mood"], string> = {
  rain: "var(--neon-cyan)",
  hearts: "var(--neon-pink)",
  waves: "var(--secondary)",
  sparks: "var(--neon-gold)",
  moon: "var(--neon-violet)",
  petals: "var(--primary)",
};

function OpenWhenPage() {
  const [opening, setOpening] = useState<string | null>(null);
  const [letter, setLetter] = useState<OpenWhenLetter | null>(null);
  const [read, setRead] = useState<Record<string, boolean>>({});

  const open = (l: OpenWhenLetter) => {
    setOpening(l.id);
    window.setTimeout(() => {
      setLetter(l);
      setOpening(null);
      setRead((r) => ({ ...r, [l.id]: true }));
    }, 900);
  };

  return (
    <AppWindow title="OPEN.WHEN" subtitle="letters for every kind of day" accent="var(--neon-gold)">
      <div className="mx-auto max-w-5xl p-4 sm:p-8">
        <p className="font-mono text-[11px] tracking-[0.4em] text-neon-gold">MAILBOX · 6 SEALED LETTERS</p>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Open when...</h2>
        <p className="mt-1 text-sm text-muted-foreground">Choose the one that matches your day. (You're allowed to open all of them. I know you will.)</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {OPEN_WHEN.map((l, i) => {
            const c = ENV_COLOR[l.mood];
            const isOpening = opening === l.id;
            return (
              <button key={l.id} onClick={() => open(l)} className="group relative h-48 text-left [perspective:800px]" style={{ animation: `float-soft 6s ease-in-out ${i * 0.4}s infinite` }}>
                <div className="absolute inset-0 rounded-xl border bg-glass-strong transition-transform group-hover:-translate-y-1" style={{ borderColor: c, boxShadow: `0 10px 40px -15px ${c}` }}>
                  <div className={cn("absolute inset-x-6 top-4 h-28 rounded bg-paper transition-transform duration-700", isOpening ? "-translate-y-16" : "translate-y-6")} />
                  <div className="absolute inset-x-0 bottom-0 h-32 rounded-b-xl" style={{ background: `linear-gradient(to top, color-mix(in oklab, ${c} 30%, var(--deep)), color-mix(in oklab, ${c} 15%, var(--deep)))` }} />
                  <div
                    className={cn("absolute inset-x-0 top-0 h-24 origin-top transition-transform duration-700 [clip-path:polygon(0_0,100%_0,50%_100%)]", isOpening && "[transform:rotateX(180deg)]")}
                    style={{ background: `color-mix(in oklab, ${c} 40%, var(--deep))` }}
                  />
                  <div className={cn("absolute left-1/2 top-[84px] grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full text-sm transition-opacity", isOpening && "opacity-0")} style={{ background: c, color: "var(--deep)" }}>
                    ♥
                  </div>
                  <p className="absolute inset-x-4 bottom-4 font-hand text-2xl leading-6 text-foreground">{l.title}</p>
                  {read[l.id] && <span className="absolute right-3 top-3 rounded-full bg-deep/70 px-2 py-0.5 font-mono text-[9px] text-muted-foreground">OPENED</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {letter && (
        <div className="fixed inset-0 z-[65] grid place-items-center overflow-y-auto p-4 pb-20 animate-window-open">
          <Atmosphere kind={letter.mood} />
          <div className="paper-lines relative w-full max-w-lg rounded-md px-6 pb-8 pt-10 text-paper-ink shadow-2xl sm:px-10">
            <button onClick={() => setLetter(null)} className="absolute right-3 top-3 rounded-full p-1 hover:bg-paper-line" aria-label="Close letter">
              <X className="h-5 w-5" />
            </button>
            <p className="font-mono text-[10px] tracking-[0.3em] opacity-70">{letter.title.toUpperCase()}</p>
            <div className="mt-4 space-y-[0.4rem] font-hand text-[26px] leading-8">
              {letter.body.map((p, i) => (
                <p key={i} className="animate-slide-up" style={{ animationDelay: `${0.2 + i * 0.25}s` }}>{p}</p>
              ))}
            </div>
            <p className="mt-6 text-right font-hand text-3xl">— {ME} ♥</p>
          </div>
        </div>
      )}
    </AppWindow>
  );
}
