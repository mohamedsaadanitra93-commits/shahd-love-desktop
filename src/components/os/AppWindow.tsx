import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Maximize2, Minimize2, Minus, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AppWindowProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Classes for the window body: each app gets its own personality. */
  bodyClassName?: string;
  frameClassName?: string;
  accent?: string;
}

export function AppWindow({ title, subtitle, children, bodyClassName, frameClassName, accent = "var(--neon-pink)" }: AppWindowProps) {
  const navigate = useNavigate();
  // Windows open full screen by default; the middle button shrinks them to a floating window.
  const [maximized, setMaximized] = useState(true);
  const [closing, setClosing] = useState(false);

  const goHome = (animate: boolean) => {
    if (!animate) {
      navigate({ to: "/" });
      return;
    }
    setClosing(true);
    window.setTimeout(() => navigate({ to: "/" }), 380);
  };

  return (
    <div className={cn("flex h-[calc(100dvh-56px)] w-full transition-all duration-300", maximized ? "p-0" : "p-0 sm:p-4 md:p-8")}>
      <section
        className={cn(
          "glass relative mx-auto flex h-full w-full flex-col overflow-hidden transition-all duration-300",
          maximized ? "max-w-none rounded-none" : "max-w-5xl sm:rounded-2xl",
          closing ? "animate-window-minimize" : "animate-window-open",
          frameClassName,
        )}
        style={{ boxShadow: `0 0 0 1px color-mix(in oklab, ${accent} 40%, transparent), 0 30px 80px -30px color-mix(in oklab, ${accent} 60%, transparent)` }}
        aria-label={title}
      >
        <header className="flex h-11 shrink-0 items-center gap-2 border-b border-border bg-glass-strong px-2 sm:px-3">
          <button
            onClick={() => goHome(false)}
            className="flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Back to desktop"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">DESKTOP</span>
          </button>
          <div className="mx-auto flex min-w-0 items-center gap-2">
            <span className="h-2 w-2 shrink-0 animate-heartbeat rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
            <h1 className="truncate font-display text-sm font-semibold tracking-[0.2em]">{title}</h1>
            {subtitle && <span className="hidden truncate font-mono text-[11px] text-muted-foreground md:inline">— {subtitle}</span>}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => goHome(true)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Minimize">
              <Minus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setMaximized((m) => !m)}
              className="hidden h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:grid"
              aria-label={maximized ? "Restore" : "Maximize"}
            >
              {maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            </button>
            <button onClick={() => goHome(true)} className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-destructive hover:text-destructive-foreground" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>
        <div className={cn("relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden", bodyClassName)}>{children}</div>
      </section>
    </div>
  );
}
