import { describe, expect, it } from "vitest";
import { brickTile } from "./brick";

const bricks = (svg: string) =>
  [
    ...svg.matchAll(/<rect x='([-\d.]+)' y='([-\d.]+)'[^>]* fill='([^']+)'/g),
  ].map(([, x, y, fill]) => ({ x: Number(x), y: Number(y), fill }));

describe("brickTile", () => {
  it("lays the same bricks on every build", () => {
    expect(brickTile()).toBe(brickTile());
  });

  it("shades the wall under it without covering it", () => {
    for (const { fill } of bricks(brickTile())) {
      const alpha = Number(/,([\d.]+)\)$/.exec(fill)?.[1]);
      expect(alpha).toBeLessThan(0.5);
    }
  });

  it("staggers every other course by half a brick", () => {
    const [first, second] = [0, 1].map(
      (course) =>
        bricks(brickTile()).filter(({ y }) => y === 1 + course * 15)[0],
    );
    expect(second.x - first.x).toBe(-23);
  });

  it("matches the half bricks at the ends of a course when the tile repeats", () => {
    const tile = bricks(brickTile());
    for (const y of new Set(tile.map((brick) => brick.y))) {
      const course = tile.filter((brick) => brick.y === y);
      expect(course.at(-1)?.fill).toBe(course[0].fill);
    }
  });
});
