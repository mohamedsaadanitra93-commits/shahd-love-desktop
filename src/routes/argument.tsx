import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Person, type Mood } from "@/components/characters/Person";
import { AppWindow } from "@/components/os/AppWindow";
import { HeartBurst } from "@/components/os/Hearts";
import { ARGUMENT_OPTIONS } from "@/content/shahd";
import { pageHead } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/argument")({
  head: () => pageHead("ARGUMENT SIMULATOR", "A playful mini-game: Shahd is angry. Choose your response wisely."),
  component: ArgumentPage,
});

const START = 80;

function ArgumentPage() {
  const [anger, setAnger] = useState(START);
  const [herMood, setHerMood] = useState<Mood>("angry");
  const [meMood, setMeMood] = useState<Mood>("scared");
  const [reaction, setReaction] = useState<string | null>(null);
  const [effect, setEffect] = useState<string | null>(null);
  const [round, setRound] = useState(0);

  const choose = (o: (typeof ARGUMENT_OPTIONS)[number]) => {
    setRound((r) => r + 1);
    setHerMood(o.herMood);
    setMeMood(o.meMood);
    setReaction(o.reaction);
    setEffect(o.effect);
    setAnger((a) => Math.max(0, Math.min(100, a + o.anger)));
  };

  const reset = () => {
    setAnger(START);
    setHerMood("angry");
    setMeMood("scared");
    setReaction(null);
    setEffect(null);
  };

  const resolved = anger === 0;
  const gameOver = anger >= 100;

  return (
    <AppWindow title="ARGUMENT.SIM" subtitle="a playful inside joke" accent="var(--neon-red)">
      <div className={cn("relative mx-auto flex min-h-full max-w-4xl flex-col items-center p-4 sm:p-8", effect === "explode" && "animate-shake")} key={`w${round}`}>
        {effect === "explode" && <div className="pointer-events-none absolute inset-0 animate-pulse bg-neon-red/15" />}
        <p className="font-mono text-[11px] tracking-[0.4em] text-neon-red">ALERT · MOOD CHANGE DETECTED</p>
        <h2 className="animate-glitch text-center font-display text-2xl font-bold sm:text-4xl">SHAHD IS ANGRY. CHOOSE YOUR RESPONSE.</h2>

        <div className="mt-4 w-full max-w-md">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>ANGER LEVEL</span>
            <span className={anger > 60 ? "text-neon-red" : anger > 25 ? "text-neon-gold" : "text-neon-green"}>{anger}%</span>
          </div>
          <div className="mt-1 h-3 rounded-full bg-muted">
            <div className={cn("h-full rounded-full transition-all duration-700", anger > 60 ? "bg-neon-red shadow-[0_0_12px_var(--neon-red)]" : anger > 25 ? "bg-neon-gold" : "bg-neon-green")} style={{ width: `${anger}%` }} />
          </div>
        </div>

        <div className="relative mt-6 grid w-full max-w-xl grid-cols-2 items-end gap-6">
          <div className={cn("relative mx-auto w-40 transition-transform duration-500", effect === "explode" && "-translate-x-6", effect === "calm" && "translate-x-4")}>
            <Person kind="boy" mood={meMood} look="right" leftArm={meMood === "scared" ? 150 : 0} rightArm={meMood === "scared" ? -150 : effect === "calm" ? -30 : 0} className={cn("w-full", meMood === "scared" && "animate-jitter")} />
            <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">YOU (the boyfriend)</p>
          </div>
          <div className={cn("relative mx-auto w-40 transition-transform duration-500", effect === "calm" && "-translate-x-4")}>
            {reaction && (
              <div key={round} className="glass animate-pop-in absolute -top-28 right-0 z-10 w-56 rounded-2xl rounded-br-none p-3 text-sm sm:-right-10">
                {reaction}
              </div>
            )}
            <Person kind="girl" mood={herMood} look="left" leftArm={herMood === "angry" || herMood === "furious" ? 20 : 0} rightArm={herMood === "angry" || herMood === "furious" ? -20 : 0} className="w-full" title="Shahd" />
            {(effect === "laugh" || effect === "soften") && <HeartBurst key={`h${round}`} count={effect === "laugh" ? 20 : 8} />}
            <p className="mt-1 text-center font-mono text-[10px] text-muted-foreground">SHAHD</p>
          </div>
        </div>

        {resolved || gameOver ? (
          <div className="animate-pop-in mt-8 text-center">
            <p className={cn("font-display text-2xl font-bold", resolved ? "text-neon-green" : "text-neon-red neon-text-red")}>
              {resolved ? "ARGUMENT RESOLVED. A hug is now mandatory." : "GAME OVER. You're sleeping on the couch tonight."}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              {resolved && (
                <Link to="/hug" className="bg-love rounded-full px-5 py-2 font-display font-bold text-primary-foreground">SEND THE HUG</Link>
              )}
              <button onClick={reset} className="rounded-full border border-border px-5 py-2 font-mono text-sm hover:bg-muted">Play again</button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid w-full max-w-xl gap-3 sm:grid-cols-2">
            {ARGUMENT_OPTIONS.map((o) => (
              <button key={o.id} onClick={() => choose(o)} className="glass rounded-xl px-4 py-3 text-left font-display text-base transition-all hover:-translate-y-0.5 hover:border-neon-red/60">
                <span className="mr-2 font-mono text-xs text-neon-red">&gt;</span>
                {o.label}
              </button>
            ))}
          </div>
        )}
        <p className="mt-8 max-w-md text-center font-mono text-[10px] text-muted-foreground">
          Disclaimer: this is not relationship advice. It's an inside joke. In real life, option 1 plus snacks is the official strategy.
        </p>
      </div>
    </AppWindow>
  );
}
