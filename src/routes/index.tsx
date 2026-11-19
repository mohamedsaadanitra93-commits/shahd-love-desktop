import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppIcon } from "@/components/os/AppIcon";
import { CoupleScene } from "@/components/os/CoupleScene";
import { HeartShape } from "@/components/os/Hearts";
import { useOs } from "@/components/os/OsProvider";
import { DESKTOP_NOTIFICATIONS, HER } from "@/content/shahd";
import { APPS, EXTRA_APPS } from "@/lib/apps";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => pageHead("Desktop", "Boot into SHAHD.EXE: a futuristic desktop full of apps, games, letters and a sleepy pink dog, made for Shahd."),
  component: Desktop,
});

function greeting(h: number) {
  if (h < 5) return "You should be asleep";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Desktop() {
  const navigate = useNavigate();
  const { notify, hugs } = useOs();
  const [hello, setHello] = useState("Welcome back");

  useEffect(() => {
    setHello(greeting(new Date().getHours()));
    let i = Math.floor(Math.random() * DESKTOP_NOTIFICATIONS.length);
    const first = window.setTimeout(() => {
      notify({ title: "SYSTEM BOOT", body: `All systems online. Welcome home, ${HER}.`, tone: "cyan" });
    }, 2500);
    const loop = window.setInterval(() => {
      const n = DESKTOP_NOTIFICATIONS[i % DESKTOP_NOTIFICATIONS.length];
      if (n) notify(n);
      i += 1;
    }, 26000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(loop);
    };
  }, [notify]);

  const left = APPS.slice(0, 6);
  const right = APPS.slice(6);

  return (
    <div className="animate-window-open relative mx-auto flex min-h-[calc(100dvh-56px)] max-w-7xl flex-col px-3 py-4 sm:px-6">
      <header className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-[11px] tracking-[0.3em] text-neon-cyan">SHAHD.EXE · v∞ · ONLINE</p>
          <h1 className="font-display text-2xl font-bold tracking-wide sm:text-3xl">
            {hello}, <span className="text-primary neon-text-pink">{HER}</span>
          </h1>
        </div>
        <div className="glass flex items-center gap-3 rounded-xl px-3 py-2 font-mono text-xs">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 animate-pulse rounded-full bg-neon-green" /> love.service running</span>
          <span className="hidden text-muted-foreground sm:inline">hugs sent: {hugs}</span>
        </div>
      </header>

      <div className="grid flex-1 items-center gap-6 lg:grid-cols-[1fr_minmax(360px,480px)_1fr]">
        <div className="order-2 grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-6 lg:order-1 lg:grid-cols-2 lg:justify-items-end lg:gap-y-10 lg:pr-4">
          {left.map((a, i) => (
            <AppIcon key={a.id} app={a} delay={i * 0.7} className={i % 2 === 1 ? "lg:-translate-x-6" : ""} />
          ))}
        </div>

        <div className="order-1 flex flex-col items-center lg:order-2">
          <CoupleScene onDogClick={() => navigate({ to: "/dog-house" })} />
          <Link
            to="/hug"
            className="bg-love group mt-2 inline-flex items-center gap-2 rounded-full px-6 py-3 font-display text-sm font-bold tracking-widest text-primary-foreground glow-pink transition-transform hover:scale-105"
          >
            SEND ME A HUG
            <HeartShape className="h-5 w-5 animate-heartbeat" />
          </Link>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            {EXTRA_APPS.map((a, i) => (
              <AppIcon key={a.id} app={a} size="sm" delay={i * 0.5} tipSide="top" />
            ))}
          </div>
        </div>

        <div className="order-3 grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-6 lg:grid-cols-2 lg:justify-items-start lg:gap-y-10 lg:pl-4">
          {right.map((a, i) => (
            <AppIcon key={a.id} app={a} delay={i * 0.6 + 0.3} className={i % 2 === 0 ? "lg:translate-x-6" : ""} />
          ))}
        </div>
      </div>
      <p className="mt-6 text-center font-mono text-[10px] text-muted-foreground">
        tip: tap the sleeping dog · tap us for hearts · the heart in the taskbar sends hugs
      </p>
    </div>
  );
}
