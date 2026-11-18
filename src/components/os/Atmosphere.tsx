import { useMemo } from "react";
import { HeartShape } from "./Hearts";

export type AtmosphereKind = "rain" | "hearts" | "waves" | "sparks" | "moon" | "petals";

/** Full-bleed animated backdrops used by letters. */
export function Atmosphere({ kind }: { kind: AtmosphereKind }) {
  const seeds = useMemo(() => Array.from({ length: 40 }, (_, i) => ({ l: (i * 53) % 100, d: (i * 0.37) % 4, s: 0.6 + ((i * 13) % 10) / 10 })), []);
  switch (kind) {
    case "rain":
      return (
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(to bottom, oklch(0.25 0.04 250), oklch(0.15 0.03 260))" }}>
          {seeds.map((p, i) => (
            <span key={i} className="absolute top-0 h-10 w-px bg-neon-cyan/50" style={{ left: `${p.l}%`, animation: `fall ${0.8 + p.s * 0.6}s linear ${p.d}s infinite`, ["--rot" as string]: "0deg" }} />
          ))}
        </div>
      );
    case "hearts":
      return (
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(circle at 50% 120%, oklch(0.45 0.18 350), oklch(0.18 0.06 330))" }}>
          {seeds.slice(0, 24).map((p, i) => (
            <HeartShape key={i} className="absolute bottom-[-30px] text-neon-pink/70" style={{ left: `${p.l}%`, width: 14 + p.s * 18, animation: `rise ${6 + p.s * 4}s linear ${p.d * 1.5}s infinite` }} />
          ))}
        </div>
      );
    case "waves":
      return (
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(to bottom, oklch(0.3 0.06 210), oklch(0.2 0.05 230))" }}>
          {[0, 1, 2].map((i) => (
            <svg key={i} viewBox="0 0 400 60" preserveAspectRatio="none" className="absolute bottom-0 h-40 w-[200%]" style={{ animation: `aurora ${10 + i * 4}s ease-in-out infinite`, opacity: 0.25 + i * 0.15, bottom: i * 20 }}>
              <path d="M0 30 Q50 10 100 30 T200 30 T300 30 T400 30 V60 H0 Z" fill="var(--neon-cyan)" />
            </svg>
          ))}
        </div>
      );
    case "sparks":
      return (
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(circle at 50% 100%, oklch(0.45 0.13 70), oklch(0.17 0.04 60))" }}>
          {seeds.map((p, i) => (
            <span key={i} className="absolute bottom-0 h-1.5 w-1.5 rounded-full bg-neon-gold shadow-[0_0_10px_var(--neon-gold)]" style={{ left: `${p.l}%`, animation: `rise ${3 + p.s * 3}s ease-out ${p.d}s infinite` }} />
          ))}
        </div>
      );
    case "moon":
      return (
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "linear-gradient(to bottom, oklch(0.14 0.05 270), oklch(0.2 0.06 290))" }}>
          <div className="absolute right-[10%] top-[8%] h-28 w-28 rounded-full" style={{ boxShadow: "inset -18px -8px 0 0 var(--paper)", filter: "drop-shadow(0 0 30px var(--paper))" }} />
          {seeds.map((p, i) => (
            <span key={i} className="absolute h-1 w-1 animate-twinkle rounded-full bg-foreground" style={{ left: `${p.l}%`, top: `${(i * 29) % 90}%`, animationDelay: `${p.d}s` }} />
          ))}
        </div>
      );
    case "petals":
      return (
        <div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: "radial-gradient(circle at 50% 0%, oklch(0.4 0.15 0), oklch(0.18 0.06 340))" }}>
          {seeds.slice(0, 30).map((p, i) => (
            <span key={i} className="absolute top-0 h-3 w-4 rounded-[60%_0_60%_0] bg-neon-pink/80" style={{ left: `${p.l}%`, animation: `fall ${5 + p.s * 4}s linear ${p.d * 1.5}s infinite`, ["--rot" as string]: `${200 + i * 20}deg` }} />
          ))}
        </div>
      );
  }
}
