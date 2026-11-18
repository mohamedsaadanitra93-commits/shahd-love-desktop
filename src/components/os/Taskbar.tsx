import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { APPS, EXTRA_APPS, findAppByPath } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { AppGlyph } from "./AppGlyph";
import { HeartShape } from "./Hearts";
import { useOs } from "./OsProvider";

function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!now) return <span className="w-16" />;
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const date = now.toLocaleDateString([], { weekday: "short", day: "2-digit", month: "short" });
  return (
    <div className="flex flex-col items-end leading-tight">
      <span className="font-mono text-sm tabular-nums text-neon-cyan neon-text-cyan">{time}</span>
      <span className="hidden font-mono text-[10px] uppercase text-muted-foreground sm:block">{date}</span>
    </div>
  );
}

function Heartbeat() {
  const { heartStolen, hugs } = useOs();
  const [bpm, setBpm] = useState(72);
  useEffect(() => {
    const t = window.setInterval(() => setBpm(70 + Math.round(Math.random() * 40)), 2200);
    return () => window.clearInterval(t);
  }, []);
  return (
    <Link
      to="/hug"
      className="group flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-muted"
      aria-label="Heartbeat — send a hug"
      title={heartStolen ? "Someone stole the heart!" : `Send a hug · ${hugs} sent so far`}
    >
      {heartStolen ? (
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-muted-foreground" aria-hidden>
          <path d="M12 21 C3 15 1 8 6 5 C9 3 11 5 12 7 C13 5 15 3 18 5 C23 8 21 15 12 21 Z" fill="none" stroke="currentColor" strokeWidth={2} strokeDasharray="3 2" />
        </svg>
      ) : (
        <HeartShape className="h-5 w-5 animate-heartbeat text-neon-pink drop-shadow-[0_0_6px_var(--neon-pink)]" />
      )}
      <svg viewBox="0 0 60 20" className="hidden h-5 w-14 text-neon-pink sm:block" aria-hidden>
        <path
          d="M0 10 H18 L22 3 L27 17 L31 6 L34 10 H60"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeDasharray="80"
          strokeDashoffset="80"
          style={{ animation: "dash 1.3s linear infinite" }}
        />
      </svg>
      <span className="font-mono text-xs tabular-nums text-muted-foreground">
        {heartStolen ? "STOLEN" : `${bpm} BPM`}
      </span>
    </Link>
  );
}

function StartMenu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.setTimeout(() => document.addEventListener("click", h), 0);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("click", h);
      document.removeEventListener("keydown", k);
    };
  }, [onClose]);
  return (
    <div ref={ref} className="glass animate-slide-up fixed bottom-16 left-2 z-50 w-[min(94vw,420px)] rounded-2xl p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="font-display text-lg font-bold tracking-widest text-primary neon-text-pink">SHAHD.EXE</p>
          <p className="font-mono text-[11px] text-muted-foreground">user: shahd · access level: everything</p>
        </div>
        <Link to="/" onClick={onClose} className="rounded-md border border-border px-2 py-1 font-mono text-xs hover:bg-muted">
          DESKTOP
        </Link>
      </div>
      <p className="mb-2 font-mono text-[10px] tracking-widest text-muted-foreground">APPLICATIONS</p>
      <div className="grid grid-cols-4 gap-2">
        {APPS.map((a) => (
          <Link key={a.id} to={a.path} onClick={onClose} className="flex flex-col items-center gap-1 rounded-lg p-2 text-center hover:bg-muted" title={a.tip}>
            <AppGlyph id={a.id} className="h-8 w-8" />
            <span className="w-full truncate font-mono text-[9px]" style={{ color: a.hue }}>{a.name}</span>
          </Link>
        ))}
      </div>
      <p className="mb-2 mt-4 font-mono text-[10px] tracking-widest text-muted-foreground">EXTRAS</p>
      <div className="grid grid-cols-4 gap-2">
        {EXTRA_APPS.map((a) => (
          <Link key={a.id} to={a.path} onClick={onClose} className="flex flex-col items-center gap-1 rounded-lg p-2 text-center hover:bg-muted" title={a.tip}>
            <AppGlyph id={a.id} className="h-7 w-7" />
            <span className="w-full truncate font-mono text-[9px]" style={{ color: a.hue }}>{a.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function Taskbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const current = findAppByPath(pathname);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <>
      {open && <StartMenu onClose={() => setOpen(false)} />}
      <nav className="glass fixed inset-x-0 bottom-0 z-40 flex h-14 items-center gap-2 border-x-0 border-b-0 px-2 sm:px-3">
        <button
          onClick={() => setOpen((o) => !o)}
          className={cn(
            "bg-love grid h-10 w-10 shrink-0 place-items-center rounded-xl font-display text-lg font-bold text-primary-foreground transition-transform hover:scale-105",
            open && "glow-pink",
          )}
          aria-label="Open start menu"
          aria-expanded={open}
        >
          S
        </button>
        <Link to="/" className={cn("hidden rounded-lg px-3 py-1.5 font-mono text-xs sm:block", pathname === "/" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted")}>
          DESKTOP
        </Link>
        {current && (
          <span className="flex min-w-0 items-center gap-2 rounded-lg bg-muted px-2 py-1.5" style={{ color: current.hue }}>
            <AppGlyph id={current.id} className="h-5 w-5 shrink-0" />
            <span className="truncate font-mono text-xs">{current.name}</span>
            <span className="h-1 w-1 rounded-full bg-current" />
          </span>
        )}
        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <Heartbeat />
          <Clock />
        </div>
      </nav>
    </>
  );
}
