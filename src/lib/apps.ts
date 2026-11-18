export const APPS = [
  { id: "garden", name: "FLOWER.GARDEN", path: "/garden", tip: "Plant flowers that whisper things about you.", hue: "var(--neon-green)" },
  { id: "shahd-os", name: "SHAHD.OS", path: "/shahd-os", tip: "System info for the most advanced human ever built.", hue: "var(--neon-pink)" },
  { id: "future", name: "OUR.FUTURE", path: "/future", tip: "Our timeline: what was, what is, what's coming.", hue: "var(--neon-cyan)" },
  { id: "dreams", name: "DREAMS.EXE", path: "/dreams", tip: "Places we'll go and things we'll do together.", hue: "var(--neon-violet)" },
  { id: "arcade", name: "ARCADE.EXE", path: "/arcade", tip: "Mini-games. Hugs, arguments, hearts, memories.", hue: "var(--neon-gold)" },
  { id: "calculator", name: "CALCULATOR.EXE", path: "/calculator", tip: "A perfectly normal calculator. Totally normal.", hue: "var(--neon-cyan)" },
  { id: "receipt", name: "LOVE.RECEIPT", path: "/receipt", tip: "An itemised list of everything you stole from me.", hue: "var(--neon-gold)" },
  { id: "bug-report", name: "BUG.REPORT", path: "/bug-report", tip: "System diagnostics. Several critical bugs found.", hue: "var(--neon-red)" },
  { id: "stats", name: "GIRLFRIEND.STATS", path: "/stats", tip: "Live personality analytics. Numbers don't lie.", hue: "var(--neon-cyan)" },
  { id: "gym", name: "GYM.INVESTIGATION", path: "/gym", tip: "Case #070. Classified. You know what you did.", hue: "var(--manila)" },
  { id: "secret", name: "SECRET.NET", path: "/secret", tip: "Restricted network. Password required.", hue: "var(--neon-green)" },
  { id: "letter", name: "FINAL.LETTER", path: "/letter", tip: "Open this one last. Or first. I won't tell.", hue: "var(--neon-pink)" },
] as const;

export const EXTRA_APPS = [
  { id: "hug", name: "HUG.EXE", path: "/hug", tip: "Send an infinite amount of hugs.", hue: "var(--neon-pink)" },
  { id: "open-when", name: "OPEN.WHEN", path: "/open-when", tip: "Letters for every kind of day.", hue: "var(--neon-gold)" },
  { id: "reasons", name: "100.REASONS", path: "/reasons", tip: "A machine that generates reasons. It never runs out.", hue: "var(--neon-violet)" },
  { id: "constellation", name: "CONSTELLATION", path: "/constellation", tip: "Every star is hiding a message.", hue: "var(--neon-cyan)" },
  { id: "capsule", name: "TIME.CAPSULE", path: "/time-capsule", tip: "A message sent to our future selves.", hue: "var(--neon-cyan)" },
  { id: "argument", name: "ARGUMENT.SIM", path: "/argument", tip: "Shahd is angry. Choose wisely.", hue: "var(--neon-red)" },
  { id: "dog-house", name: "DOG.HOUSE", path: "/dog-house", tip: "Her house, her wardrobe, her rules.", hue: "var(--neon-pink)" },
] as const;

export type AppDef = (typeof APPS)[number] | (typeof EXTRA_APPS)[number];
export type AppId = AppDef["id"];

export const ALL_APPS: readonly AppDef[] = [...APPS, ...EXTRA_APPS];

export function findAppByPath(pathname: string): AppDef | undefined {
  return ALL_APPS.find((a) => a.path === pathname);
}
