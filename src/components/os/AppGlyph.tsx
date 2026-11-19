import type { AppId } from "@/lib/apps";

/** Hand-built SVG glyphs for every app. Uses currentColor + the app hue. */
export function AppGlyph({ id, className }: { id: AppId; className?: string }) {
  const s = { stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };
  const heart = (x: number, y: number, k = 1) =>
    `M${x} ${y + 5 * k} C${x - 7 * k} ${y} ${x - 5 * k} ${y - 5 * k} ${x} ${y - 1.5 * k} C${x + 5 * k} ${y - 5 * k} ${x + 7 * k} ${y} ${x} ${y + 5 * k} Z`;
  const body = (() => {
    switch (id) {
      case "garden":
        return (
          <>
            <path d="M24 40 V24" {...s} />
            <path d="M24 33 Q16 32 14 25 Q22 25 24 31" {...s} fill="var(--garden-leaf)" fillOpacity={0.6} />
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx={24} cy={11} rx={4.5} ry={7} transform={`rotate(${a} 24 17)`} fill="currentColor" fillOpacity={0.35} stroke="currentColor" strokeWidth={1.6} />
            ))}
            <circle cx={24} cy={17} r={3.6} fill="var(--neon-gold)" />
          </>
        );
      case "shahd-os":
        return (
          <>
            <rect x={6} y={8} width={36} height={25} rx={4} {...s} />
            <path d={heart(24, 19, 1.3)} fill="currentColor" fillOpacity={0.8} />
            <path d="M18 40 H30 M24 33 V40" {...s} />
          </>
        );
      case "future":
        return (
          <>
            <circle cx={24} cy={24} r={10} {...s} fill="currentColor" fillOpacity={0.2} />
            <ellipse cx={24} cy={24} rx={20} ry={6} transform="rotate(-20 24 24)" {...s} />
            <path d={heart(24, 23, 0.8)} fill="currentColor" />
            <circle cx={40} cy={10} r={1.8} fill="var(--neon-gold)" />
          </>
        );
      case "dreams":
        return (
          <>
            <path d="M12 34 Q5 34 6 27 Q7 21 14 22 Q15 13 25 14 Q33 15 34 22 Q42 21 42 28 Q42 34 35 34 Z" {...s} fill="currentColor" fillOpacity={0.18} />
            <path d="M30 6 a6 6 0 1 0 6 8 a5 5 0 0 1 -6 -8 Z" fill="var(--neon-gold)" />
            <path d="M14 9 l1 2 l2 1 l-2 1 l-1 2 l-1 -2 l-2 -1 l2 -1 Z" fill="currentColor" />
          </>
        );
      case "arcade":
        return (
          <>
            <path d="M14 15 H34 Q43 15 43 26 Q43 36 37 36 Q33 36 30 31 H18 Q15 36 11 36 Q5 36 5 26 Q5 15 14 15 Z" {...s} fill="currentColor" fillOpacity={0.18} />
            <path d="M14 21 V29 M10 25 H18" {...s} />
            <path d={heart(33, 24, 0.75)} fill="var(--neon-pink)" />
          </>
        );
      case "calculator":
        return (
          <>
            <rect x={11} y={5} width={26} height={38} rx={4} {...s} />
            <rect x={15} y={9} width={18} height={8} rx={1.5} fill="currentColor" fillOpacity={0.35} />
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) =>
                r === 2 && c === 2 ? (
                  <path key={`${r}${c}`} d={heart(31, 36.5, 0.55)} fill="var(--neon-pink)" />
                ) : (
                  <circle key={`${r}${c}`} cx={17 + c * 7} cy={23 + r * 7} r={1.9} fill="currentColor" />
                ),
              ),
            )}
          </>
        );
      case "receipt":
        return (
          <>
            <path d="M12 5 H36 V43 L32 40 L28 43 L24 40 L20 43 L16 40 L12 43 Z" {...s} fill="currentColor" fillOpacity={0.12} />
            <path d="M17 13 H31 M17 19 H28 M17 25 H31" {...s} strokeWidth={1.8} />
            <path d={heart(24, 31, 0.7)} fill="var(--neon-pink)" />
          </>
        );
      case "bug-report":
        return (
          <>
            <path d={heart(24, 22, 2.3)} fill="currentColor" fillOpacity={0.3} stroke="currentColor" strokeWidth={2} />
            <path d="M20 8 L17 4 M28 8 L31 4 M10 20 H4 M38 20 H44 M11 30 L6 34 M37 30 L42 34" {...s} />
            <circle cx={20} cy={18} r={1.6} fill="currentColor" />
            <circle cx={28} cy={18} r={1.6} fill="currentColor" />
          </>
        );
      case "stats":
        return (
          <>
            <path d="M8 40 H40" {...s} />
            <rect x={10} y={26} width={6} height={12} rx={1.5} fill="currentColor" fillOpacity={0.5} />
            <rect x={19} y={18} width={6} height={20} rx={1.5} fill="currentColor" fillOpacity={0.75} />
            <rect x={28} y={9} width={6} height={29} rx={1.5} fill="currentColor" />
            <path d="M8 22 L18 14 L26 17 L40 6" {...s} stroke="var(--neon-pink)" />
          </>
        );
      case "gym":
        return (
          <>
            <path d="M8 18 V30 M12 14 V34 M36 14 V34 M40 18 V30 M12 24 H36" {...s} strokeWidth={3} />
            <circle cx={30} cy={30} r={7} {...s} stroke="var(--char-ink)" fill="var(--neon-cyan)" fillOpacity={0.35} />
            <path d="M35 35 L42 42" stroke="var(--char-ink)" strokeWidth={3.2} strokeLinecap="round" />
          </>
        );
      case "secret":
        return (
          <>
            <path d="M16 21 V15 a8 8 0 0 1 16 0 V21" {...s} />
            <rect x={11} y={21} width={26} height={20} rx={4} {...s} fill="currentColor" fillOpacity={0.2} />
            <circle cx={24} cy={30} r={2.6} fill="currentColor" />
            <path d="M24 32 V36 M4 31 H11 M37 31 H44 M44 31 V24" {...s} strokeWidth={1.6} />
          </>
        );
      case "letter":
        return (
          <>
            <rect x={5} y={12} width={38} height={26} rx={3} {...s} fill="var(--paper)" fillOpacity={0.2} />
            <path d="M5 13 L24 27 L43 13" {...s} />
            <circle cx={24} cy={28} r={6} fill="var(--neon-red)" />
            <path d={heart(24, 27.5, 0.55)} fill="var(--paper)" />
          </>
        );
      case "hug":
        return (
          <>
            <path d={heart(18, 24, 1.8)} fill="currentColor" fillOpacity={0.5} />
            <path d={heart(30, 24, 1.8)} fill="currentColor" stroke="var(--deep)" strokeWidth={1} />
          </>
        );
      case "open-when":
        return (
          <>
            <rect x={9} y={8} width={30} height={20} rx={2} {...s} transform="rotate(-8 24 18)" />
            <rect x={7} y={18} width={34} height={22} rx={2} {...s} fill="var(--deep)" />
            <path d="M7 19 L24 31 L41 19" {...s} />
          </>
        );
      case "reasons":
        return (
          <>
            <circle cx={24} cy={24} r={13} {...s} strokeDasharray="5 3" />
            <circle cx={24} cy={24} r={8} {...s} />
            <path d={heart(24, 23, 0.9)} fill="currentColor" />
          </>
        );
      case "argument":
        return (
          <>
            <path d="M6 10 H28 V24 H14 L9 29 V24 H6 Z" {...s} />
            <path d="M22 28 H42 V40 H39 V44 L34 40 H22 Z" {...s} fill="currentColor" fillOpacity={0.2} />
            <path d="M18 13 L14 18 H19 L15 22" {...s} stroke="var(--neon-gold)" strokeWidth={1.8} />
          </>
        );
      case "dog-house":
        return (
          <>
            <path d="M6 22 L24 7 L42 22" {...s} />
            <path d="M10 20 V41 H38 V20" {...s} fill="currentColor" fillOpacity={0.15} />
            <path d="M18 41 V31 a6 6 0 0 1 12 0 V41" {...s} />
            <circle cx={24} cy={16} r={2.2} fill="currentColor" />
          </>
        );
    }
  })();
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      {body}
    </svg>
  );
}
