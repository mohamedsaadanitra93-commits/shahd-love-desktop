import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOs } from "./OsProvider";

const TONE = {
  pink: "border-neon-pink/60 text-neon-pink",
  cyan: "border-neon-cyan/60 text-neon-cyan",
  red: "border-neon-red/70 text-neon-red",
  gold: "border-neon-gold/60 text-neon-gold",
};

export function Notifications() {
  const { notifications, dismiss } = useOs();
  return (
    <div className="pointer-events-none fixed right-2 top-2 z-50 flex w-[min(92vw,320px)] flex-col gap-2 sm:right-4 sm:top-4" aria-live="polite">
      {notifications.map((n) => (
        <div key={n.id} className={cn("glass animate-slide-in-right pointer-events-auto rounded-xl border-l-4 p-3 shadow-xl", TONE[n.tone ?? "pink"])}>
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] tracking-widest">{n.title}</p>
              <p className="mt-0.5 text-sm text-foreground">{n.body}</p>
            </div>
            <button onClick={() => dismiss(n.id)} className="text-muted-foreground hover:text-foreground" aria-label="Dismiss notification">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
