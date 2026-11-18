import { cn } from "@/lib/utils";

export type PersonKind = "boy" | "girl";
export type Mood =
  | "smile"
  | "happy"
  | "blush"
  | "love"
  | "angry"
  | "furious"
  | "scared"
  | "sad"
  | "shock"
  | "sleepy"
  | "disappointed";
export type Look = "front" | "left" | "right" | "up";
export type Pose = "stand" | "sit" | "run";
/** Angle in degrees. Positive swings the hand to the viewer's left. */
export type ArmAngle = number;

export interface PersonProps {
  kind: PersonKind;
  mood?: Mood;
  look?: Look;
  pose?: Pose;
  /** Arm on the viewer's left. 0 = down, positive = outward. */
  leftArm?: ArmAngle;
  /** Arm on the viewer's right. 0 = down, negative = outward. */
  rightArm?: ArmAngle;
  sunglasses?: boolean;
  magnifier?: boolean;
  detective?: boolean;
  className?: string;
  blinkDelay?: number;
  title?: string;
}

const LOOK_OFFSET: Record<Look, [number, number]> = {
  front: [0, 0],
  left: [-3.5, 0.5],
  right: [3.5, 0.5],
  up: [0, -3],
};

function Eyes({ mood, look, kind, blinkDelay }: { mood: Mood; look: Look; kind: PersonKind; blinkDelay: number }) {
  const [dx, dy] = LOOK_OFFSET[look];
  const ink = "var(--char-ink)";
  if (mood === "happy" || mood === "sleepy") {
    const d = mood === "happy" ? "M42 64 Q47 57 52 64 M68 64 Q73 57 78 64" : "M42 62 Q47 66 52 62 M68 62 Q73 66 78 62";
    return <path d={d} stroke={ink} strokeWidth={3} strokeLinecap="round" fill="none" />;
  }
  if (mood === "love") {
    const heart = (x: number) =>
      `M${x} 66 C${x - 8} 60 ${x - 6} 54 ${x} 58 C${x + 6} 54 ${x + 8} 60 ${x} 66 Z`;
    return (
      <g>
        <path d={heart(47)} fill="var(--neon-pink)" />
        <path d={heart(73)} fill="var(--neon-pink)" />
      </g>
    );
  }
  if (mood === "shock" || mood === "scared") {
    const r = mood === "shock" ? 5.5 : 3.6;
    return (
      <g>
        <circle cx={47 + dx} cy={62 + dy} r={r + 2} fill="var(--char-shoe)" stroke={ink} strokeWidth={1.5} />
        <circle cx={73 + dx} cy={62 + dy} r={r + 2} fill="var(--char-shoe)" stroke={ink} strokeWidth={1.5} />
        <circle cx={47 + dx} cy={62 + dy} r={r - 1.6} fill={ink} />
        <circle cx={73 + dx} cy={62 + dy} r={r - 1.6} fill={ink} />
      </g>
    );
  }
  return (
    <g className="blink" style={{ animationDelay: `${blinkDelay}s` }}>
      <ellipse cx={47 + dx} cy={63 + dy} rx={4.4} ry={5.6} fill={ink} />
      <ellipse cx={73 + dx} cy={63 + dy} rx={4.4} ry={5.6} fill={ink} />
      <circle cx={48.6 + dx} cy={61 + dy} r={1.6} fill="var(--char-shoe)" />
      <circle cx={74.6 + dx} cy={61 + dy} r={1.6} fill="var(--char-shoe)" />
      {kind === "girl" && (
        <path
          d={`M${41 + dx} 59 l-3 -2 M${79 + dx} 59 l3 -2`}
          stroke={ink}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      )}
    </g>
  );
}

function Brows({ mood }: { mood: Mood }) {
  const ink = "var(--char-ink)";
  if (mood === "angry" || mood === "furious")
    return <path d="M40 52 L53 56 M80 52 L67 56" stroke={ink} strokeWidth={3} strokeLinecap="round" />;
  if (mood === "sad" || mood === "scared" || mood === "disappointed")
    return <path d="M41 55 L52 52 M79 55 L68 52" stroke={ink} strokeWidth={2.4} strokeLinecap="round" />;
  return null;
}

function Mouth({ mood }: { mood: Mood }) {
  const ink = "var(--char-ink)";
  switch (mood) {
    case "happy":
    case "love":
      return (
        <g>
          <path d="M51 76 Q60 90 69 76 Z" fill={ink} />
          <path d="M55 82 Q60 87 65 82 Q60 80 55 82 Z" fill="var(--char-blush)" />
        </g>
      );
    case "angry":
      return <path d="M52 83 Q60 77 68 83" stroke={ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
    case "furious":
      return <rect x={50} y={77} width={20} height={8} rx={3} fill={ink} />;
    case "scared":
      return (
        <path
          d="M50 81 l4 -3 l4 3 l4 -3 l4 3 l4 -3"
          stroke={ink}
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      );
    case "sad":
    case "disappointed":
      return <path d="M53 83 Q60 78 67 83" stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />;
    case "shock":
      return <ellipse cx={60} cy={81} rx={4} ry={5} fill={ink} />;
    case "sleepy":
      return <ellipse cx={60} cy={80} rx={2.6} ry={2} fill={ink} />;
    case "blush":
      return <path d="M54 78 Q60 83 66 78" stroke={ink} strokeWidth={2.4} fill="none" strokeLinecap="round" />;
    default:
      return <path d="M52 77 Q60 85 68 77" stroke={ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />;
  }
}

export function Person({
  kind,
  mood = "smile",
  look = "front",
  pose = "stand",
  leftArm = 0,
  rightArm = 0,
  sunglasses = false,
  magnifier = false,
  detective = false,
  className,
  blinkDelay = 0,
  title,
}: PersonProps) {
  const isGirl = kind === "girl";
  const top = detective ? "var(--char-detective)" : isGirl ? "var(--char-girl-dress)" : "var(--char-boy-top)";
  const topShade = detective
    ? "var(--manila-dark)"
    : isGirl
      ? "var(--char-girl-dress-shade)"
      : "var(--char-boy-top-shade)";
  const legColor = isGirl ? "var(--char-skin)" : "var(--char-boy-pants)";
  const blushStrength = mood === "blush" || mood === "love" ? 0.85 : 0.4;
  const running = pose === "run";

  return (
    <svg
      viewBox="0 0 120 210"
      className={cn("overflow-visible", running && "animate-bob", className)}
      role="img"
      aria-label={title ?? (isGirl ? "Shahd" : "Her boyfriend")}
    >
      {/* back hair */}
      {isGirl && (
        <path
          d="M22 58 Q14 110 20 150 Q40 162 60 156 Q80 162 100 150 Q106 110 98 58 Z"
          fill="var(--char-hair-girl)"
        />
      )}

      {/* legs */}
      <g>
        <g className={running ? "leg-run-a" : undefined}>
          <rect x={44} y={146} width={13} height={pose === "sit" ? 34 : 44} rx={6} fill={legColor} />
          <ellipse cx={50} cy={pose === "sit" ? 182 : 192} rx={9} ry={5} fill={isGirl ? "var(--char-girl-dress-shade)" : "var(--char-shoe)"} />
        </g>
        <g className={running ? "leg-run-b" : undefined}>
          <rect x={63} y={146} width={13} height={pose === "sit" ? 34 : 44} rx={6} fill={legColor} />
          <ellipse cx={70} cy={pose === "sit" ? 182 : 192} rx={9} ry={5} fill={isGirl ? "var(--char-girl-dress-shade)" : "var(--char-shoe)"} />
        </g>
      </g>

      {/* torso */}
      <rect x={36} y={94} width={48} height={60} rx={18} fill={top} />
      {isGirl ? (
        <>
          <path d="M33 136 L87 136 L98 170 Q60 180 22 170 Z" fill={top} />
          <path d="M33 136 L87 136 L89 142 L31 142 Z" fill={topShade} />
          <path d="M50 96 Q60 106 70 96" stroke={topShade} strokeWidth={3} fill="none" />
          <path d="M57 116 C52 110 54 106 57 108 C60 106 62 110 57 116 Z" fill="var(--char-shoe)" opacity={0.85} />
        </>
      ) : detective ? (
        <>
          <path d="M60 96 L50 130 M60 96 L70 130" stroke={topShade} strokeWidth={3} />
          <circle cx={60} cy={122} r={2} fill={topShade} />
          <circle cx={60} cy={136} r={2} fill={topShade} />
          <rect x={36} y={140} width={48} height={6} fill={topShade} />
        </>
      ) : (
        <>
          <path d="M44 96 Q60 112 76 96" stroke={topShade} strokeWidth={4} fill="none" />
          <path d="M54 104 v14 M66 104 v14" stroke="var(--char-shoe)" strokeWidth={1.8} strokeLinecap="round" />
          <rect x={46} y={126} width={28} height={12} rx={5} fill={topShade} />
        </>
      )}

      {/* arms: origin at shoulders */}
      <g className="arm" style={{ transformOrigin: "42px 102px", transform: `rotate(${leftArm}deg)` }}>
        <rect x={33} y={98} width={12} height={44} rx={6} fill={top} />
        <circle cx={39} cy={144} r={6.5} fill="var(--char-skin)" />
      </g>
      <g className="arm" style={{ transformOrigin: "78px 102px", transform: `rotate(${rightArm}deg)` }}>
        <rect x={75} y={98} width={12} height={44} rx={6} fill={top} />
        <circle cx={81} cy={144} r={6.5} fill="var(--char-skin)" />
        {magnifier && (
          <g>
            <rect x={79} y={146} width={5} height={16} rx={2} fill="var(--char-ink)" />
            <circle cx={81.5} cy={172} r={11} fill="var(--neon-cyan)" fillOpacity={0.25} stroke="var(--char-ink)" strokeWidth={3.5} />
            <path d="M75 167 q3 -3 7 -3" stroke="var(--char-shoe)" strokeWidth={2} fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* head */}
      <circle cx={24} cy={64} r={7} fill="var(--char-skin-shade)" />
      <circle cx={96} cy={64} r={7} fill="var(--char-skin-shade)" />
      <circle cx={60} cy={60} r={36} fill="var(--char-skin)" />

      {/* hair */}
      {isGirl ? (
        <>
          <path
            d="M23 64 Q18 18 60 18 Q102 18 97 64 Q90 44 76 36 Q66 48 48 40 Q36 50 23 64 Z"
            fill="var(--char-hair-girl)"
          />
          <path d="M84 30 C78 22 82 16 86 20 C90 16 94 22 84 30 Z" fill="var(--neon-pink)" />
        </>
      ) : (
        <>
          <path
            d="M24 58 Q20 20 60 18 Q100 20 96 58 Q92 40 80 36 Q70 44 58 38 Q46 46 34 40 Q28 46 24 58 Z"
            fill="var(--char-hair-boy)"
          />
          <path d="M56 19 Q62 8 70 14 Q64 14 62 20 Z" fill="var(--char-hair-boy)" />
        </>
      )}
      {detective && (
        <g>
          <path d="M18 40 Q60 20 102 40 L96 30 Q60 6 24 30 Z" fill="var(--manila-dark)" />
          <ellipse cx={60} cy={41} rx={46} ry={6} fill="var(--char-detective)" />
        </g>
      )}

      {/* face */}
      <ellipse cx={39} cy={74} rx={6} ry={3.6} fill="var(--char-blush)" opacity={blushStrength} />
      <ellipse cx={81} cy={74} rx={6} ry={3.6} fill="var(--char-blush)" opacity={blushStrength} />
      <Brows mood={mood} />
      {sunglasses ? (
        <g>
          <rect x={36} y={55} width={21} height={14} rx={5} fill="var(--char-ink)" />
          <rect x={63} y={55} width={21} height={14} rx={5} fill="var(--char-ink)" />
          <path d="M57 60 h6" stroke="var(--char-ink)" strokeWidth={3} />
          <path d="M40 58 l6 0" stroke="var(--neon-cyan)" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
          <path d="M67 58 l6 0" stroke="var(--neon-cyan)" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        </g>
      ) : (
        <Eyes mood={mood} look={look} kind={kind} blinkDelay={blinkDelay} />
      )}
      <Mouth mood={mood} />
      {mood === "scared" && <path d="M92 44 q4 8 0 10 q-4 -2 0 -10 Z" fill="var(--neon-cyan)" opacity={0.85} />}
      {mood === "sad" && <path d="M44 70 q3 7 0 9 q-3 -2 0 -9 Z" fill="var(--neon-cyan)" opacity={0.85} />}
      {mood === "furious" && (
        <g stroke="var(--neon-red)" strokeWidth={3} strokeLinecap="round">
          <path d="M84 30 l6 -6 M88 34 l8 -2 M80 26 l2 -8" />
        </g>
      )}
    </svg>
  );
}
