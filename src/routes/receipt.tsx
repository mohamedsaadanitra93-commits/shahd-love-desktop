import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { useEffect, useState } from "react";
import { AppWindow } from "@/components/os/AppWindow";
import { HER, ME } from "@/content/shahd";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/receipt")({
  head: () => pageHead("LOVE.RECEIPT", "An itemised receipt of everything Shahd stole: a heart, attention, sleep and more."),
  component: ReceiptPage,
});

const ITEMS = [
  ["My heart", "100% stolen"],
  ["My attention", "Permanently occupied"],
  ["My sleep", "Frequently interrupted"],
  ["My concentration", "Missing"],
  ["My free time", "Reallocated"],
  ["My ability to stop smiling", "Destroyed"],
];

function ReceiptPage() {
  const [print, setPrint] = useState(0);
  const [stamp, setStamp] = useState("");
  useEffect(() => {
    const d = new Date();
    setStamp(`${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`);
  }, [print]);

  return (
    <AppWindow title="LOVE.RECEIPT" subtitle="transaction #∞" accent="var(--neon-gold)">
      <div className="flex min-h-full flex-col items-center gap-6 p-4 sm:p-10">
        <div className="relative w-full max-w-sm">
          <div className="mx-auto h-4 w-[105%] -translate-x-[2.5%] rounded-full bg-muted shadow-inner" />
          <div key={print} className="receipt-edge -mt-2 bg-paper px-6 py-8 font-mono text-paper-ink shadow-2xl" style={{ animation: "print 2.4s steps(24) both" }}>
            <p className="text-center font-display text-xl font-bold tracking-widest">WHAT {HER.toUpperCase()} STOLE FROM ME</p>
            <p className="mt-1 text-center text-[11px]">HEART STORE #070 · OPEN 24/7 · NO REFUNDS</p>
            <p className="text-center text-[11px]">{stamp}</p>
            <p className="my-3 overflow-hidden whitespace-nowrap text-xs">{"- ".repeat(40)}</p>
            <ul className="space-y-3 text-sm">
              {ITEMS.map(([item, status], i) => (
                <li key={item} className="flex justify-between gap-4">
                  <span>
                    <span className="opacity-60">{String(i + 1).padStart(2, "0")} </span>
                    {item}
                  </span>
                  <span className="text-right font-bold">{status}</span>
                </li>
              ))}
            </ul>
            <p className="my-3 overflow-hidden whitespace-nowrap text-xs">{"- ".repeat(40)}</p>
            <div className="flex justify-between text-xs"><span>SUBTOTAL</span><span>PRICELESS</span></div>
            <div className="flex justify-between text-xs"><span>TAX</span><span>1 HUG / DAY</span></div>
            <div className="flex justify-between text-xs"><span>DISCOUNT</span><span>0% (she knows her worth)</span></div>
            <p className="my-3 overflow-hidden whitespace-nowrap text-xs">{"= ".repeat(40)}</p>
            <p className="text-center text-xs tracking-widest">TOTAL</p>
            <p className="text-center font-display text-2xl font-bold leading-tight">ONE BOYFRIEND COMPLETELY IN LOVE</p>
            <p className="mt-4 text-center text-[11px]">PAYMENT METHOD: forever</p>
            <p className="text-center text-[11px]">CASHIER: {ME} (willing victim)</p>
            <svg viewBox="0 0 200 40" className="mx-auto mt-4 h-10 w-48" aria-hidden>
              {Array.from({ length: 48 }, (_, i) => (
                <rect key={i} x={i * 4.1} y={0} width={(i * 7) % 3 === 0 ? 2.6 : 1.2} height={40} fill="var(--paper-ink)" />
              ))}
            </svg>
            <p className="mt-2 text-center text-[11px]">THANK YOU FOR STEALING · PLEASE COME AGAIN</p>
          </div>
        </div>
        <button onClick={() => setPrint((p) => p + 1)} className="flex items-center gap-2 rounded-lg border border-neon-gold/50 px-4 py-2 font-mono text-sm text-neon-gold hover:bg-neon-gold/10">
          <Printer className="h-4 w-4" /> PRINT AGAIN
        </button>
      </div>
    </AppWindow>
  );
}
