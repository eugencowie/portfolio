import { describe, expect, it } from "vitest";
import { BALCONIES, handOutBalconies } from "./balconies";
import type { HasProject } from "./projects";

const floor = (featured: boolean) =>
  ({
    project: { data: { section: "building", order: 1, featured } },
  }) satisfies { project: HasProject };
const kinds = (sections: ReturnType<typeof floor>[][]) =>
  handOutBalconies(sections).map((section) =>
    section.map(({ balcony }) => balcony),
  );

describe("handOutBalconies", () => {
  it("gives the floors that aren't Featured the balconies from the start", () => {
    expect(kinds([[floor(false), floor(false)]])).toEqual([
      ["lights", "plants"],
    ]);
  });

  it("gives the Featured floors the balconies from the end", () => {
    expect(kinds([[floor(true)], [floor(true)]])).toEqual([
      ["table"],
      ["bike"],
    ]);
  });

  it("counts on across the Sections, as the Highrise has them", () => {
    const section = [floor(true), floor(false), floor(false)];
    expect(kinds([section, section])).toEqual([
      ["table", "lights", "plants"],
      ["bike", "cat", "person"],
    ]);
  });

  it("repeats the kinds past the end of the list", () => {
    const floors = Array.from({ length: BALCONIES.length + 1 }, () =>
      floor(false),
    );
    expect(kinds([floors])[0].at(-1)).toBe("lights");
  });
});
