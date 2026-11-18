import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { DogOutfit } from "@/components/characters/Dog";

export interface OsNotification {
  id: number;
  title: string;
  body: string;
  tone?: "pink" | "cyan" | "red" | "gold";
}

interface OsState {
  hugs: number;
  addHug: () => number;
  outfit: DogOutfit;
  setOutfit: (o: DogOutfit) => void;
  heartStolen: boolean;
  setHeartStolen: (v: boolean) => void;
  notifications: OsNotification[];
  notify: (n: Omit<OsNotification, "id">) => void;
  dismiss: (id: number) => void;
  secretUnlocked: boolean;
  unlockSecret: () => void;
}

const OsContext = createContext<OsState | null>(null);

function readNumber(key: string, fallback: number) {
  const v = Number(window.localStorage.getItem(key));
  return Number.isFinite(v) && v > 0 ? v : fallback;
}

export function OsProvider({ children }: { children: ReactNode }) {
  const [hugs, setHugs] = useState(0);
  const [outfit, setOutfitState] = useState<DogOutfit>("dress");
  const [heartStolen, setHeartStolen] = useState(false);
  const [notifications, setNotifications] = useState<OsNotification[]>([]);
  const [secretUnlocked, setSecretUnlocked] = useState(false);
  const nextId = useRef(1);
  const hugsRef = useRef(0);

  useEffect(() => {
    const h = readNumber("shahd.hugs", 0);
    hugsRef.current = h;
    setHugs(h);
    const o = window.localStorage.getItem("shahd.outfit") as DogOutfit | null;
    if (o) setOutfitState(o);
    setSecretUnlocked(window.localStorage.getItem("shahd.secret") === "1");
  }, []);

  const addHug = useCallback(() => {
    const n = hugsRef.current + 1;
    hugsRef.current = n;
    setHugs(n);
    window.localStorage.setItem("shahd.hugs", String(n));
    return n;
  }, []);

  const setOutfit = useCallback((o: DogOutfit) => {
    setOutfitState(o);
    window.localStorage.setItem("shahd.outfit", o);
  }, []);

  const dismiss = useCallback((id: number) => {
    setNotifications((list) => list.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback(
    (n: Omit<OsNotification, "id">) => {
      const id = nextId.current++;
      setNotifications((list) => [...list.slice(-2), { ...n, id }]);
      window.setTimeout(() => dismiss(id), 6000);
    },
    [dismiss],
  );

  const unlockSecret = useCallback(() => {
    setSecretUnlocked(true);
    window.localStorage.setItem("shahd.secret", "1");
  }, []);

  const value = useMemo(
    () => ({ hugs, addHug, outfit, setOutfit, heartStolen, setHeartStolen, notifications, notify, dismiss, secretUnlocked, unlockSecret }),
    [hugs, addHug, outfit, setOutfit, heartStolen, notifications, notify, dismiss, secretUnlocked, unlockSecret],
  );
  return <OsContext.Provider value={value}>{children}</OsContext.Provider>;
}

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used inside OsProvider");
  return ctx;
}
