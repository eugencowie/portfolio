import type { HasProject } from "./projects";

/** The Projects' balconies, in the order they are handed out. */
export const BALCONIES = [
  "lights",
  "plants",
  "cat",
  "person",
  "bike",
  "table",
] as const;

/** What the residents keep out on one of the Highrise's balconies. */
export type BalconyKind = (typeof BALCONIES)[number] | "washing";

/**
 * The Sections' floors, each with its balcony over the Lane, handed out from
 * the top of the Highrise down: a floor that isn't Featured takes the next from
 * the start of BALCONIES, and a Featured floor, whose Balcony shows only below
 * 80rem (its Bays are Piers from there, see Floor.astro), the next from the
 * end. The residents' washing line is their own, so it isn't in the list. With
 * more than six Project floors, the kinds repeat.
 */
export function handOutBalconies<F extends { project: HasProject }>(
  sections: F[][],
): (F & { balcony: BalconyKind })[][] {
  let fromStart = 0;
  let fromEnd = 0;
  return sections.map((section) =>
    section.map((floor) => ({
      ...floor,
      balcony: floor.project.data.featured
        ? BALCONIES[BALCONIES.length - 1 - (fromEnd++ % BALCONIES.length)]
        : BALCONIES[fromStart++ % BALCONIES.length],
    })),
  );
}
