import { describe, expect, it } from "vitest";
import { seededRandom } from "./random";

const take = (random: () => number, n: number) =>
  Array.from({ length: n }, random);

describe("seededRandom", () => {
  it("yields the same sequence for the same seed", () => {
    expect(take(seededRandom(7), 5)).toEqual(take(seededRandom(7), 5));
    expect(take(seededRandom(7), 5)).not.toEqual(take(seededRandom(8), 5));
  });

  it("yields numbers in [0, 1)", () => {
    for (const x of take(seededRandom(20260926), 1000)) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
    }
  });
});
