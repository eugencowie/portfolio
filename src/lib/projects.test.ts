import { describe, expect, it } from "vitest";
import {
  arrangeProjects,
  type HasProject,
  type ProjectSection,
} from "./projects";

const p = (
  name: string,
  section: ProjectSection,
  order: number,
  featured = false,
): HasProject & { name: string } => ({
  name,
  data: { section, order, featured },
});

const names = (xs: { name: string }[]) => xs.map((x) => x.name);

describe("arrangeProjects", () => {
  it("splits Projects by Section and sorts each by order", () => {
    const { building, games, other } = arrangeProjects([
      p("o2", "other", 2),
      p("g2", "games", 2),
      p("b2", "building", 2),
      p("o1", "other", 1),
      p("g1", "games", 1),
      p("b1", "building", 1),
    ]);
    expect(names(building)).toEqual(["b1", "b2"]);
    expect(names(games)).toEqual(["g1", "g2"]);
    expect(names(other)).toEqual(["o1", "o2"]);
  });

  it("puts the Featured Project first in its Section regardless of order", () => {
    const { building, games } = arrangeProjects([
      p("b1", "building", 1),
      p("b3", "building", 3, true),
      p("b2", "building", 2),
      p("g1", "games", 1),
      p("g2", "games", 2, true),
    ]);
    expect(names(building)).toEqual(["b3", "b1", "b2"]);
    expect(names(games)).toEqual(["g2", "g1"]);
  });

  it("rejects more than one Featured Project in a Section", () => {
    expect(() =>
      arrangeProjects([
        p("b1", "building", 1, true),
        p("b2", "building", 2, true),
      ]),
    ).toThrow(/one Featured.*building/);
  });
});
