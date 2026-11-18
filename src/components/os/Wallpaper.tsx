import { useMemo } from "react";

/** Fixed animated background: aurora blobs, perspective grid, stars and rising particles. */
export function Wallpaper() {
  const stars = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: (i * 37.3) % 100,
        top: (i * 53.7) % 100,
        size: 1 + ((i * 7) % 3),
        delay: (i % 9) * 0.4,
      })),
    [],
  );
  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        left: (i * 61.8) % 100,
        delay: (i * 1.7) % 14,
        duration: 12 + (i % 6) * 2,
        heart: i % 3 === 0,
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-deep">
      <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-sky)" }} />
      <div
        className="absolute -left-1/4 top-[-20%] h-[70vh] w-[80vw] rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--neon-pink), transparent)", animation: "aurora 22s ease-in-out infinite" }}
      />
      <div
        className="absolute -right-1/4 top-[10%] h-[60vh] w-[70vw] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--neon-cyan), transparent)", animation: "aurora 28s ease-in-out infinite reverse" }}
      />
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-foreground animate-twinkle"
          style={{ left: `${s.left}%`, top: `${s.top * 0.7}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
        />
      ))}
      <div
        className="grid-floor absolute bottom-0 left-[-50%] h-[45vh] w-[200%] opacity-60"
        style={{ transform: "perspective(400px) rotateX(62deg)", transformOrigin: "bottom", maskImage: "linear-gradient(to top, black, transparent)" }}
      />
      {particles.map((p, i) => (
        <span
          key={i}
          className="absolute bottom-[-20px] text-neon-pink"
          style={{ left: `${p.left}%`, animation: `rise ${p.duration}s linear ${p.delay}s infinite`, opacity: 0 }}
        >
          {p.heart ? (
            <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 9 C0 6 1 1 5 3.5 C9 1 10 6 5 9 Z" fill="currentColor" /></svg>
          ) : (
            <span className="block h-1 w-1 rounded-full bg-neon-cyan shadow-[0_0_8px_var(--neon-cyan)]" />
          )}
        </span>
      ))}
    </div>
  );
}
