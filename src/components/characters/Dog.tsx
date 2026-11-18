import { cn } from "@/lib/utils";

export type DogPose = "sleep" | "sleep2" | "sit" | "run" | "walk";
export type DogOutfit = "dress" | "hoodie" | "raincoat" | "tuxedo" | "royal" | "gym";

export const DOG_OUTFITS: { id: DogOutfit; label: string; note: string }[] = [
  { id: "dress", label: "Pink dress", note: "The classic. Iconic. Non-negotiable." },
  { id: "hoodie", label: "Cozy hoodie", note: "For movie nights and stolen blankets." },
  { id: "raincoat", label: "Raincoat", note: "Ready for puddles and dramatic walks." },
  { id: "tuxedo", label: "Tiny tuxedo", note: "Ring bearer energy." },
  { id: "royal", label: "Royal cape", note: "Her Royal Fluffiness." },
  { id: "gym", label: "Gym fit", note: "At least SOMEONE in this family goes to the gym." },
];

const GARMENT: Record<DogOutfit, { main: string; shade: string }> = {
  dress: { main: "var(--dog-dress)", shade: "var(--dog-dress-shade)" },
  hoodie: { main: "var(--neon-cyan)", shade: "var(--char-boy-top)" },
  raincoat: { main: "var(--neon-gold)", shade: "var(--manila-dark)" },
  tuxedo: { main: "var(--char-ink)", shade: "var(--char-boy-pants)" },
  royal: { main: "var(--neon-violet)", shade: "var(--dog-dress-shade)" },
  gym: { main: "var(--neon-green)", shade: "var(--garden-leaf)" },
};

interface DogProps {
  pose?: DogPose;
  outfit?: DogOutfit;
  carrying?: "letter" | "heart" | null;
  happy?: boolean;
  className?: string;
  flip?: boolean;
}

function Fluff({ cx, cy, rx, ry, fill }: { cx: number; cy: number; rx: number; ry: number; fill: string }) {
  // a cloud-like fluffy blob made of overlapping circles around an ellipse
  const n = 10;
  const puffs = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(a) * rx * 0.82, y: cy + Math.sin(a) * ry * 0.82 };
  });
  const r = Math.min(rx, ry) * 0.42;
  return (
    <g fill={fill}>
      <ellipse cx={cx} cy={cy} rx={rx * 0.9} ry={ry * 0.9} />
      {puffs.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={r} />
      ))}
    </g>
  );
}

function HeadAccessory({ outfit, x, y, r }: { outfit: DogOutfit; x: number; y: number; r: number }) {
  switch (outfit) {
    case "dress":
      return (
        <g transform={`translate(${x + r * 0.55} ${y - r * 0.85})`}>
          <path d="M0 0 L-9 -6 L-9 6 Z M0 0 L9 -6 L9 6 Z" fill="var(--dog-dress-shade)" />
          <circle r={3} fill="var(--neon-pink)" />
        </g>
      );
    case "raincoat":
      return (
        <path
          d={`M${x - r * 1.1} ${y - r * 0.45} Q${x} ${y - r * 1.9} ${x + r * 1.1} ${y - r * 0.45} Z`}
          fill="var(--neon-gold)"
          stroke="var(--manila-dark)"
          strokeWidth={1.5}
        />
      );
    case "royal":
      return (
        <path
          d={`M${x - r * 0.6} ${y - r * 0.8} l3 -12 l6 8 l5 -12 l5 12 l6 -8 l3 12 Z`}
          fill="var(--neon-gold)"
          stroke="var(--manila-dark)"
          strokeWidth={1}
        />
      );
    case "gym":
      return (
        <rect x={x - r * 0.95} y={y - r * 0.62} width={r * 1.9} height={6} rx={3} fill="var(--neon-green)" />
      );
    case "hoodie":
      return (
        <path
          d={`M${x - r * 1.05} ${y + r * 0.2} Q${x - r * 1.2} ${y - r * 1.3} ${x} ${y - r * 1.2} Q${x + r * 1.2} ${y - r * 1.3} ${x + r * 1.05} ${y + r * 0.2}`}
          fill="none"
          stroke="var(--neon-cyan)"
          strokeWidth={5}
          strokeLinecap="round"
        />
      );
    default:
      return null;
  }
}

function Face({ x, y, r, sleeping, happy }: { x: number; y: number; r: number; sleeping: boolean; happy: boolean }) {
  const ink = "var(--char-ink)";
  const ex = r * 0.38;
  return (
    <g>
      {sleeping ? (
        <path
          d={`M${x - ex - 4} ${y - 2} q4 4 8 0 M${x + ex - 4} ${y - 2} q4 4 8 0`}
          stroke={ink}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      ) : (
        <g className="blink">
          <circle cx={x - ex} cy={y - 2} r={3.4} fill={ink} />
          <circle cx={x + ex} cy={y - 2} r={3.4} fill={ink} />
          <circle cx={x - ex + 1.2} cy={y - 3.2} r={1.1} fill="var(--dog-fur)" />
          <circle cx={x + ex + 1.2} cy={y - 3.2} r={1.1} fill="var(--dog-fur)" />
        </g>
      )}
      <ellipse cx={x} cy={y + r * 0.22} rx={3.6} ry={2.6} fill={ink} />
      <path
        d={`M${x - 4} ${y + r * 0.36} q4 3 4 0 q0 3 4 0`}
        stroke={ink}
        strokeWidth={1.4}
        fill="none"
        strokeLinecap="round"
      />
      {happy && !sleeping && (
        <path d={`M${x - 2.4} ${y + r * 0.45} q2.4 6 4.8 0 Z`} fill="var(--char-blush)" />
      )}
      <ellipse cx={x - r * 0.62} cy={y + r * 0.2} rx={4} ry={2.4} fill="var(--char-blush)" opacity={0.55} />
      <ellipse cx={x + r * 0.62} cy={y + r * 0.2} rx={4} ry={2.4} fill="var(--char-blush)" opacity={0.55} />
    </g>
  );
}

function Carry({ what, x, y }: { what: "letter" | "heart"; x: number; y: number }) {
  if (what === "heart")
    return (
      <path
        d={`M${x} ${y + 8} C${x - 12} ${y} ${x - 8} ${y - 8} ${x} ${y - 2} C${x + 8} ${y - 8} ${x + 12} ${y} ${x} ${y + 8} Z`}
        fill="var(--neon-pink)"
        stroke="var(--dog-dress-shade)"
        strokeWidth={1}
      />
    );
  return (
    <g transform={`translate(${x - 11} ${y - 7}) rotate(-8)`}>
      <rect width={22} height={15} rx={2} fill="var(--paper)" stroke="var(--manila-dark)" strokeWidth={1} />
      <path d="M0 0 L11 8 L22 0" fill="none" stroke="var(--manila-dark)" strokeWidth={1} />
      <circle cx={11} cy={9} r={2.6} fill="var(--neon-pink)" />
    </g>
  );
}

export function Dog({ pose = "sit", outfit = "dress", carrying = null, happy = true, className, flip }: DogProps) {
  const g = GARMENT[outfit];
  const fur = "var(--dog-fur)";
  const shade = "var(--dog-fur-shade)";
  const ear = "var(--dog-ear)";

  if (pose === "sleep" || pose === "sleep2") {
    const alt = pose === "sleep2";
    return (
      <svg viewBox="0 0 150 110" className={cn("overflow-visible", className)} role="img" aria-label="The pink dog, sleeping">
        <g transform={alt ? "translate(150 0) scale(-1 1)" : undefined}>
          <ellipse cx={78} cy={98} rx={58} ry={7} fill="var(--char-ink)" opacity={0.25} />
          <g className="breathe">
            <g className="tail-wag-slow">
              <Fluff cx={124} cy={76} rx={12} ry={10} fill={fur} />
            </g>
            <Fluff cx={84} cy={78} rx={40} ry={20} fill={fur} />
            {/* garment */}
            <path d="M58 64 Q84 54 112 66 L118 92 Q86 102 52 92 Z" fill={g.main} />
            <path d="M52 90 Q86 100 118 90 L119 95 Q86 106 51 95 Z" fill={g.shade} />
            {outfit === "tuxedo" && <path d="M64 70 l8 5 l-8 5 Z M80 70 l-8 5 l8 5 Z" fill="var(--neon-pink)" />}
            {outfit === "royal" && <circle cx={84} cy={66} r={3} fill="var(--neon-gold)" />}
            <Fluff cx={40} cy={76} rx={23} ry={20} fill={fur} />
            <g className="ear-twitch">
              <ellipse cx={26} cy={74} rx={8} ry={14} fill={ear} transform="rotate(20 26 74)" />
            </g>
            <ellipse cx={54} cy={72} rx={7} ry={12} fill={ear} transform="rotate(-20 54 72)" />
            <HeadAccessory outfit={outfit} x={40} y={76} r={21} />
            <Face x={40} y={80} r={20} sleeping happy={false} />
            <ellipse cx={30} cy={94} rx={9} ry={5} fill={shade} />
          </g>
        </g>
        <g fill="var(--neon-cyan)" fontFamily="var(--font-mono)" fontSize={14}>
          <text x={alt ? 110 : 34} y={44} className="zzz">z</text>
          <text x={alt ? 120 : 44} y={36} className="zzz" style={{ animationDelay: "0.9s" }}>z</text>
          <text x={alt ? 128 : 52} y={26} className="zzz" style={{ animationDelay: "1.8s" }}>Z</text>
        </g>
      </svg>
    );
  }

  if (pose === "run" || pose === "walk") {
    const legClassA = pose === "run" ? "leg-run-a" : "leg-run-a [animation-duration:0.7s]";
    const legClassB = pose === "run" ? "leg-run-b" : "leg-run-b [animation-duration:0.7s]";
    return (
      <svg
        viewBox="0 0 150 110"
        className={cn("overflow-visible", pose === "run" ? "animate-bob" : "", className)}
        role="img"
        aria-label="The pink dog, running"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <ellipse cx={74} cy={102} rx={44} ry={5} fill="var(--char-ink)" opacity={0.22} />
        <g className={legClassA}><rect x={46} y={70} width={9} height={28} rx={4.5} fill={shade} /></g>
        <g className={legClassB}><rect x={92} y={70} width={9} height={28} rx={4.5} fill={shade} /></g>
        <g className="tail-wag" style={{ transformOrigin: "0% 100%" }}>
          <Fluff cx={30} cy={52} rx={11} ry={9} fill={fur} />
        </g>
        <Fluff cx={72} cy={64} rx={36} ry={19} fill={fur} />
        <g className={legClassB}><rect x={54} y={72} width={9} height={28} rx={4.5} fill={fur} /></g>
        <g className={legClassA}><rect x={86} y={72} width={9} height={28} rx={4.5} fill={fur} /></g>
        <path d="M46 52 Q72 42 100 52 L104 78 Q72 88 42 78 Z" fill={g.main} />
        <path d="M42 76 Q72 86 104 76 L105 81 Q72 92 41 81 Z" fill={g.shade} />
        {outfit === "tuxedo" && <path d="M100 56 l-7 5 l7 5 Z M108 56 l7 5 l-7 5 Z" fill="var(--neon-pink)" />}
        {outfit === "royal" && <path d="M46 52 Q30 70 36 88 L48 80 Z" fill="var(--dog-dress-shade)" />}
        <Fluff cx={110} cy={42} rx={21} ry={19} fill={fur} />
        <g className="ear-twitch" style={{ animationDuration: pose === "run" ? "0.6s" : "5s" }}>
          <ellipse cx={96} cy={36} rx={7} ry={14} fill={ear} transform="rotate(30 96 36)" />
        </g>
        <HeadAccessory outfit={outfit} x={110} y={42} r={20} />
        <Face x={114} y={44} r={19} sleeping={false} happy={happy} />
        {carrying && <Carry what={carrying} x={128} y={62} />}
      </svg>
    );
  }

  // sit
  return (
    <svg viewBox="0 0 150 130" className={cn("overflow-visible", className)} role="img" aria-label="The pink dog">
      <ellipse cx={75} cy={124} rx={40} ry={6} fill="var(--char-ink)" opacity={0.22} />
      <g className={happy ? "tail-wag" : "tail-wag-slow"}>
        <Fluff cx={112} cy={96} rx={12} ry={10} fill={fur} />
      </g>
      <Fluff cx={75} cy={94} rx={30} ry={28} fill={fur} />
      <path d="M50 82 Q75 72 100 82 L108 116 Q75 126 42 116 Z" fill={g.main} />
      <path d="M42 113 Q75 123 108 113 L109 119 Q75 130 41 119 Z" fill={g.shade} />
      {outfit === "royal" && <path d="M50 82 Q36 100 42 120 L52 112 Z M100 82 Q114 100 108 120 L98 112 Z" fill="var(--dog-dress-shade)" />}
      {outfit === "tuxedo" && (
        <g>
          <path d="M66 82 l9 6 l-9 6 Z M84 82 l-9 6 l9 6 Z" fill="var(--neon-pink)" />
          <circle cx={75} cy={102} r={2} fill="var(--dog-fur)" />
        </g>
      )}
      {outfit === "hoodie" && <path d="M70 84 v14 M80 84 v14" stroke="var(--dog-fur)" strokeWidth={2} />}
      {outfit === "raincoat" && <circle cx={75} cy={96} r={2.4} fill="var(--manila-dark)" />}
      {outfit === "gym" && <text x={63} y={104} fontSize={10} fontWeight={700} fill="var(--char-ink)">GYM</text>}
      <ellipse cx={62} cy={120} rx={9} ry={6} fill={fur} />
      <ellipse cx={88} cy={120} rx={9} ry={6} fill={fur} />
      <Fluff cx={75} cy={50} rx={27} ry={25} fill={fur} />
      <g className="ear-twitch">
        <ellipse cx={50} cy={50} rx={9} ry={17} fill={ear} transform="rotate(16 50 50)" />
      </g>
      <g className="ear-twitch" style={{ animationDelay: "1.3s" }}>
        <ellipse cx={100} cy={50} rx={9} ry={17} fill={ear} transform="rotate(-16 100 50)" />
      </g>
      <HeadAccessory outfit={outfit} x={75} y={50} r={26} />
      <Face x={75} y={54} r={24} sleeping={false} happy={happy} />
      {carrying && <Carry what={carrying} x={75} y={80} />}
    </svg>
  );
}
