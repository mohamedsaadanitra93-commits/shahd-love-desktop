import { Link } from "@tanstack/react-router";
import type { AppDef } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { AppGlyph } from "./AppGlyph";

export function AppIcon({
  app,
  className,
  delay = 0,
  size = "md",
  tipSide = "bottom",
}: {
  app: AppDef;
  className?: string;
  delay?: number;
  size?: "sm" | "md";
  tipSide?: "bottom" | "top";
}) {
  return (
    <Link
      to={app.path}
      className={cn("group relative flex flex-col items-center gap-1.5 outline-none", className)}
      style={{ animation: `float 6s ease-in-out ${delay}s infinite` }}
      aria-label={`${app.name} — ${app.tip}`}
    >
      <span
        className={cn(
          "glass relative grid place-items-center rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-focus-visible:scale-110",
          size === "md" ? "h-16 w-16 md:h-[72px] md:w-[72px]" : "h-12 w-12",
        )}
        style={{ color: app.hue, boxShadow: `0 0 0 1px color-mix(in oklab, ${app.hue} 35%, transparent), 0 8px 24px -10px ${app.hue}` }}
      >
        <span
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `0 0 28px 2px ${app.hue}, inset 0 0 18px -4px ${app.hue}` }}
        />
        <span
          className="absolute inset-x-2 top-1 h-1/3 rounded-xl opacity-40"
          style={{ background: "linear-gradient(to bottom, oklch(1 0 0 / 35%), transparent)" }}
        />
        <AppGlyph id={app.id} className={size === "md" ? "relative h-10 w-10 md:h-11 md:w-11" : "relative h-7 w-7"} />
      </span>
      <span className="max-w-[92px] truncate rounded bg-deep/60 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-foreground/90 md:text-[11px]">
        {app.name}
      </span>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute left-1/2 z-30 w-48 -translate-x-1/2 rounded-lg border border-primary/40 bg-popover/95 px-3 py-2 text-center text-xs leading-snug text-popover-foreground opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 group-focus-visible:opacity-100",
          tipSide === "bottom" ? "top-full mt-2 translate-y-1 group-hover:translate-y-0" : "bottom-full mb-2 -translate-y-1 group-hover:translate-y-0",
        )}
      >
        <span className="block font-mono text-[10px] text-primary">{app.name}</span>
        {app.tip}
      </span>
    </Link>
  );
}
