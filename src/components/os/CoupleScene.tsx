import { useEffect, useState } from "react";
import { Dog } from "@/components/characters/Dog";
import { Person, type Look, type Mood } from "@/components/characters/Person";
import { HeartBurst, HeartShape } from "./Hearts";
import { useOs } from "./OsProvider";

interface Beat {
  boyLook: Look;
  girlLook: Look;
  boyMood: Mood;
  girlMood: Mood;
}

const BEATS: Beat[] = [
  { boyLook: "right", girlLook: "left", boyMood: "smile", girlMood: "smile" },
  { boyLook: "right", girlLook: "front", boyMood: "love", girlMood: "smile" },
  { boyLook: "front", girlLook: "front", boyMood: "happy", girlMood: "happy" },
  { boyLook: "right", girlLook: "left", boyMood: "blush", girlMood: "blush" },
  { boyLook: "up", girlLook: "up", boyMood: "smile", girlMood: "smile" },
  { boyLook: "right", girlLook: "front", boyMood: "smile", girlMood: "happy" },
];

/** The two of us on a floating bench, holding hands, with the dog asleep beside us. */
export function CoupleScene({ onDogClick }: { onDogClick?: () => void }) {
  const { outfit } = useOs();
  const [beat, setBeat] = useState(0);
  const [dogPose, setDogPose] = useState<"sleep" | "sleep2">("sleep");
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const a = window.setInterval(() => setBeat((b) => (b + 1 + Math.floor(Math.random() * 2)) % BEATS.length), 3400);
    const d = window.setInterval(() => setDogPose((p) => (p === "sleep" ? "sleep2" : "sleep")), 9000);
    return () => {
      window.clearInterval(a);
      window.clearInterval(d);
    };
  }, []);
  const b = BEATS[beat];

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[460px] select-none">
      {/* moon */}
      <div
        className="absolute left-1/2 top-[2%] h-[46%] w-[46%] -translate-x-1/2 rounded-full opacity-90"
        style={{
          background: "radial-gradient(circle at 35% 35%, var(--paper), var(--char-girl-dress) 60%, transparent 72%)",
          boxShadow: "0 0 80px 10px oklch(0.78 0.12 345 / 35%)",
        }}
      />
      <div className="absolute left-[18%] top-[8%] h-2 w-2 animate-twinkle rounded-full bg-neon-gold" />
      <div className="absolute right-[16%] top-[18%] h-1.5 w-1.5 animate-twinkle rounded-full bg-neon-cyan" style={{ animationDelay: "1s" }} />

      {/* floating platform */}
      <div className="absolute inset-x-[6%] bottom-[4%] h-[16%] animate-float-soft">
        <div className="absolute inset-0 rounded-[50%] bg-love opacity-60 blur-xl" />
        <div className="absolute inset-x-[4%] top-[20%] h-[60%] rounded-[50%] border border-neon-pink/60 bg-glass-strong" />
        <div className="absolute inset-x-[20%] top-[45%] h-[2px] bg-neon-cyan/70 shadow-[0_0_12px_var(--neon-cyan)]" />
      </div>

      {/* bench */}
      <div className="absolute bottom-[19%] left-[14%] right-[30%] h-[5%] rounded-md bg-muted shadow-[0_0_16px_var(--neon-violet)]" />
      <div className="absolute bottom-[12%] left-[18%] h-[8%] w-[3%] rounded-sm bg-muted" />
      <div className="absolute bottom-[12%] right-[34%] h-[8%] w-[3%] rounded-sm bg-muted" />

      <button
        className="absolute bottom-[15%] left-[12%] w-[60%] outline-none"
        onClick={() => setBurst((n) => n + 1)}
        aria-label="Tap us for hearts"
      >
        <div className="relative flex items-end justify-center">
          <Person kind="boy" pose="sit" look={b.boyLook} mood={b.boyMood} rightArm={-28} leftArm={4} className="-mr-[6%] w-1/2" blinkDelay={0.3} />
          <Person kind="girl" pose="sit" look={b.girlLook} mood={b.girlMood} leftArm={28} rightArm={-4} className="-ml-[6%] w-1/2" blinkDelay={1.7} title="Shahd" />
          <HeartShape className="absolute bottom-[14%] left-1/2 h-5 w-5 -translate-x-1/2 animate-heartbeat text-neon-pink drop-shadow-[0_0_8px_var(--neon-pink)]" />
        </div>
        {burst > 0 && <HeartBurst key={burst} count={18} />}
      </button>

      <button className="absolute bottom-[13%] right-[2%] w-[30%] outline-none" onClick={onDogClick} aria-label="Visit the dog's house">
        <Dog pose={dogPose} outfit={outfit} className="w-full" />
      </button>
    </div>
  );
}
