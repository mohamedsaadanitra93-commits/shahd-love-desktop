// The love calculator: a real calculator with a secret personality.
export const OPS = ["+", "−", "×", "÷"] as const;
export const WORDS = ["LOVE", "TIME", "YOU", "ME"] as const;

export interface CalcResult {
  output: string;
  /** true when the calculator answered with one of its secret messages */
  easter: boolean;
  value?: number;
}

export const MSG = {
  youMe: "YOU + ME = US ❤️",
  notEnough: "Still not enough to measure my love.",
  infinity: "INFINITY.",
  tooLarge: "ERROR 404: RESULT TOO LARGE.",
  seventy: "70 YEARS? STILL NOT ENOUGH.",
  divZero: "Can't divide by zero. Can't divide us either.",
  time: "Forever. With you.",
  i143: "143 = I LOVE YOU ❤️",
} as const;

const LIMIT = 1e9;

function normalize(expr: string) {
  return expr
    .replace(/\s+/g, "")
    .replace(/\*/g, "×")
    .replace(/x/gi, (m) => (m === "x" || m === "X" ? "×" : m))
    .replace(/\//g, "÷")
    .replace(/-/g, "−")
    .toUpperCase();
}

function tokenize(e: string): (number | string)[] | null {
  const out: (number | string)[] = [];
  let i = 0;
  while (i < e.length) {
    const c = e[i] ?? "";
    if (/[0-9.]/.test(c)) {
      let j = i;
      while (j < e.length && /[0-9.]/.test(e[j] ?? "")) j++;
      const n = Number(e.slice(i, j));
      if (!Number.isFinite(n)) return null;
      out.push(n);
      i = j;
    } else if ((OPS as readonly string[]).includes(c) || c === "%") {
      out.push(c);
      i++;
    } else return null;
  }
  return out;
}

/** Evaluate + − × ÷ and % with normal precedence. Returns NaN on malformed input. */
export function evaluateNumeric(expr: string): number {
  const tokens = tokenize(normalize(expr));
  if (!tokens || tokens.length === 0) return NaN;
  // apply percentages and unary minus
  const t: (number | string)[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const tok = tokens[k]!;
    if (tok === "%") {
      const prev = t.pop();
      if (typeof prev !== "number") return NaN;
      t.push(prev / 100);
    } else if (tok === "−" && (t.length === 0 || typeof t[t.length - 1] === "string") && typeof tokens[k + 1] === "number") {
      t.push(-(tokens[k + 1] as number));
      k++;
    } else t.push(tok);
  }
  // × ÷ first
  const stack: (number | string)[] = [];
  for (let k = 0; k < t.length; k++) {
    const tok = t[k]!;
    if (tok === "×" || tok === "÷") {
      const a = stack.pop();
      const b = t[++k];
      if (typeof a !== "number" || typeof b !== "number") return NaN;
      stack.push(tok === "×" ? a * b : b === 0 ? Infinity : a / b);
    } else stack.push(tok);
  }
  let acc = stack[0];
  if (typeof acc !== "number") return NaN;
  for (let k = 1; k < stack.length; k += 2) {
    const op = stack[k];
    const b = stack[k + 1];
    if (typeof b !== "number") return NaN;
    acc = op === "+" ? acc + b : acc - b;
  }
  return acc;
}

function format(n: number) {
  if (Number.isInteger(n)) return String(n);
  return String(Number(n.toPrecision(10)));
}

export function calculate(rawExpr: string): CalcResult {
  const e = normalize(rawExpr);
  if (!e) return { output: "0", easter: false };

  if (e === "1+1") return { output: MSG.youMe, easter: true };
  if (e === "YOU+ME" || e === "ME+YOU") return { output: MSG.youMe, easter: true };
  if (e === "100×100") return { output: MSG.notEnough, easter: true };
  if (e === "LOVE÷TIME") return { output: MSG.infinity, easter: true };
  if (e.includes("LOVE")) return { output: MSG.tooLarge, easter: true };
  if (e === "TIME" || e.includes("TIME")) return { output: MSG.time, easter: true };
  if (e.includes("YOU") || e.includes("ME")) return { output: MSG.youMe, easter: true };
  if (e === "70") return { output: MSG.seventy, easter: true, value: 70 };

  const v = evaluateNumeric(e);
  if (Number.isNaN(v)) return { output: "SYNTAX ERROR", easter: false };
  if (!Number.isFinite(v)) return { output: MSG.divZero, easter: true };
  if (Math.abs(v) >= LIMIT) return { output: MSG.tooLarge, easter: true, value: v };
  if (v === 70) return { output: MSG.seventy, easter: true, value: v };
  if (v === 143) return { output: MSG.i143, easter: true, value: v };
  return { output: format(v), easter: false, value: v };
}
