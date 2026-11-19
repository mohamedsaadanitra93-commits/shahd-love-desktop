import { useCallback, useEffect, useRef, useState } from "react";
import { Dog } from "@/components/characters/Dog";
import { DOG, DOG_DELIVERIES } from "@/content/shahd";
import { useOs } from "./OsProvider";

type DogEvent = null | { kind: "steal"; id: number } | { kind: "deliver"; id: number; stage: "arrive" | "wait" | "open" | "leave" };

const IDLE_MS = 30_000;

/** The pink dog lives on every page: idle check-ins, heart theft and secret deliveries. */
export function DogCompanion() {
  const { outfit, setHeartStolen, notify } = useOs();
  const [idle, setIdle] = useState(false);
  const [event, setEvent] = useState<DogEvent>(null);
  const [message, setMessage] = useState("");
  const lastActivity = useRef(Date.now());
  const idleShownAt = useRef(0);
  const eventRef = useRef<DogEvent>(null);
  eventRef.current = event;
  const deliveryIndex = useRef(Math.floor(Math.random() * DOG_DELIVERIES.length));

  // inactivity watcher
  useEffect(() => {
    const onActivity = () => {
      lastActivity.current = Date.now();
    };
    const evs = ["mousemove", "mousedown", "keydown", "touchstart", "wheel"] as const;
    evs.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    const t = window.setInterval(() => {
      if (!idleShownAt.current && Date.now() - lastActivity.current >= IDLE_MS && !eventRef.current) {
        idleShownAt.current = Date.now();
        setIdle(true);
      }
    }, 1000);
    return () => {
      evs.forEach((e) => window.removeEventListener(e, onActivity));
      window.clearInterval(t);
    };
  }, []);

  const closeIdle = () => {
    setIdle(false);
    idleShownAt.current = 0;
    lastActivity.current = Date.now();
  };

  // random appearances
  const startEvent = useCallback(
    (kind: "steal" | "deliver") => {
      if (eventRef.current) return;
      const id = Date.now();
      if (kind === "steal") {
        setHeartStolen(true);
        setEvent({ kind: "steal", id });
        notify({ title: "SECURITY ALERT", body: `${DOG} stole a heart from the taskbar! Click her to get it back.`, tone: "red" });
      } else {
        setMessage(DOG_DELIVERIES[deliveryIndex.current % DOG_DELIVERIES.length] ?? "");
        deliveryIndex.current += 1;
        setEvent({ kind: "deliver", id, stage: "arrive" });
        window.setTimeout(() => setEvent((e) => (e && e.kind === "deliver" && e.id === id ? { ...e, stage: "wait" } : e)), 2200);
      }
    },
    [notify, setHeartStolen],
  );

  useEffect(() => {
    let timer: number;
    let n = 0;
    const schedule = () => {
      const wait = 45_000 + Math.random() * 45_000;
      timer = window.setTimeout(() => {
        startEvent(n % 2 === 0 ? "deliver" : "steal");
        n += 1;
        schedule();
      }, wait);
    };
    schedule();
    const manual = (e: globalThis.Event) => {
      const kind = (e as CustomEvent<"steal" | "deliver">).detail;
      startEvent(kind);
    };
    window.addEventListener("shahd:dog", manual as EventListener);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("shahd:dog", manual as EventListener);
    };
  }, [startEvent]);

  const finishSteal = (caught: boolean) => {
    setEvent(null);
    if (caught) {
      setHeartStolen(false);
      notify({ title: "HEART RECOVERED", body: "You caught her! She demands a treat as ransom.", tone: "pink" });
    } else {
      window.setTimeout(() => {
        setHeartStolen(false);
        notify({ title: `${DOG.toUpperCase()}.DOG`, body: "She brought the heart back. It's a little slobbery.", tone: "gold" });
      }, 2500);
    }
  };

  return (
    <>
      {idle && (
        <div className="animate-slide-up fixed bottom-16 left-2 z-[60] flex items-end gap-2 sm:left-6">
          <Dog pose="sit" outfit={outfit} className="h-28 w-32 drop-shadow-[0_0_20px_var(--neon-pink)]" />
          <div className="glass relative mb-16 max-w-[240px] rounded-2xl rounded-bl-none p-3">
            <p className="font-display text-sm font-bold text-neon-pink">HELLO???</p>
            <p className="text-sm">Are we still exploring or are you ignoring us?</p>
            <div className="mt-2 flex gap-2">
              <button onClick={closeIdle} className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                Still exploring!
              </button>
              <button onClick={closeIdle} className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted">
                Pet her
              </button>
            </div>
          </div>
        </div>
      )}

      {event?.kind === "steal" && (
        <button
          key={event.id}
          className="fixed bottom-14 left-0 z-[55] w-40 sm:w-48"
          style={{ animation: "run-across-left 6.5s linear forwards" }}
          onAnimationEnd={() => finishSteal(false)}
          onClick={() => finishSteal(true)}
          aria-label="Catch the dog to get the heart back"
        >
          <Dog pose="run" outfit={outfit} carrying="heart" flip className="w-full" />
        </button>
      )}

      {event?.kind === "deliver" && (
        <div
          key={event.id}
          className="fixed bottom-14 right-2 z-[55] flex items-end gap-2 sm:right-8"
          style={event.stage === "arrive" ? { animation: "walk-in-right 2.2s ease-out both" } : event.stage === "leave" ? { animation: "walk-in-right 1.6s ease-in reverse forwards" } : undefined}
          onAnimationEnd={() => {
            if (event.stage === "leave") setEvent(null);
          }}
        >
          {event.stage === "wait" && (
            <div className="glass animate-pop-in mb-20 max-w-[200px] rounded-2xl rounded-br-none p-3 text-sm">
              <p className="font-mono text-[11px] text-neon-gold">SPECIAL DELIVERY</p>
              <p>Psst. I have a secret message for you.</p>
              <button
                onClick={() => setEvent({ ...event, stage: "open" })}
                className="mt-2 rounded-md bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground"
              >
                Open letter
              </button>
            </div>
          )}
          <Dog
            pose={event.stage === "arrive" || event.stage === "leave" ? "walk" : "sit"}
            outfit={outfit}
            carrying={event.stage === "open" ? null : "letter"}
            flip={event.stage === "arrive"}
            className="h-28 w-36"
          />
        </div>
      )}

      {event?.kind === "deliver" && event.stage === "open" && (
        <div className="fixed inset-0 z-[70] grid place-items-center bg-deep/70 p-4 backdrop-blur-sm" onClick={() => setEvent({ ...event, stage: "leave" })}>
          <div className="paper-lines animate-pop-in relative w-full max-w-md rounded-lg p-6 pt-8 text-paper-ink shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="font-mono text-[11px] tracking-widest text-primary">SECRET MESSAGE · delivered by {DOG}</p>
            <p className="mt-3 font-hand text-3xl leading-8">{message}</p>
            <button
              onClick={() => setEvent({ ...event, stage: "leave" })}
              className="mt-6 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
            >
              Thank you, {DOG} ♥
            </button>
          </div>
        </div>
      )}
    </>
  );
}

/** Ask the dog to do something right now (used by buttons around the OS). */
export function summonDog(kind: "steal" | "deliver") {
  window.dispatchEvent(new CustomEvent("shahd:dog", { detail: kind }));
}
