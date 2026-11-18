import { describe, expect, it } from "vitest";
import { calculate, evaluateNumeric, MSG } from "./love-calculator";

describe("love calculator secret answers", () => {
  it("1 + 1 is us", () => {
    expect(calculate("1+1").output).toBe("YOU + ME = US ❤️");
  });
  it("100 × 100 is still not enough", () => {
    expect(calculate("100×100").output).toBe("Still not enough to measure my love.");
  });
  it("LOVE ÷ TIME is infinity", () => {
    expect(calculate("LOVE÷TIME").output).toBe("INFINITY.");
  });
  it("asking how much he loves her is too large", () => {
    expect(calculate("LOVE").output).toBe("ERROR 404: RESULT TOO LARGE.");
  });
  it("huge results are too large", () => {
    expect(calculate("99999×99999").output).toBe(MSG.tooLarge);
  });
  it("70 is not enough years", () => {
    expect(calculate("70").output).toBe("70 YEARS? STILL NOT ENOUGH.");
    expect(calculate("35+35").output).toBe("70 YEARS? STILL NOT ENOUGH.");
  });
});

describe("love calculator still does maths", () => {
  it("respects precedence", () => {
    expect(evaluateNumeric("2+3×4")).toBe(14);
    expect(calculate("12÷4−1").output).toBe("2");
  });
  it("handles decimals and negatives", () => {
    expect(calculate("−5+2.5").output).toBe("-2.5");
  });
});
