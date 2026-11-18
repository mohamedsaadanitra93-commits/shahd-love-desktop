import { createFileRoute } from "@tanstack/react-router";
import { AppWindow } from "@/components/os/AppWindow";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/garden")({
  head: () => pageHead("FLOWER.GARDEN", "FLOWER.GARDEN is being installed on SHAHD.EXE. Coming very soon."),
  component: Page,
});

function Page() {
  return (
    <AppWindow title="FLOWER.GARDEN" subtitle="installing" accent="var(--neon-green)">
      <div className="flex min-h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="font-mono text-[11px] tracking-[0.4em] text-muted-foreground">INSTALLING · PLEASE WAIT</p>
        <h2 className="font-display text-3xl font-bold">FLOWER.GARDEN</h2>
        <p className="max-w-md text-sm text-muted-foreground">This app is still being built with love. Check back soon.</p>
      </div>
    </AppWindow>
  );
}
