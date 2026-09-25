import type { CollectionEntry } from "astro:content";

export const PROJECT_SECTIONS = ["building", "games", "other"] as const;
export type ProjectSection = (typeof PROJECT_SECTIONS)[number];

/** The Sections rendered as cards: Building and Games. Their Projects have a screenshot and one may be Featured. */
export const CARD_SECTIONS = [
  "building",
  "games",
] as const satisfies readonly ProjectSection[];
export type CardSection = (typeof CARD_SECTIONS)[number];

export const isCardSection = (
  section: ProjectSection,
): section is CardSection =>
  (CARD_SECTIONS as readonly ProjectSection[]).includes(section);

export interface ProjectLike {
  section: ProjectSection;
  order: number;
  featured?: boolean;
}

/** Anything carrying a Project's data, such as a content collection entry. */
export interface HasProject {
  data: ProjectLike;
}

/** The variants of `D` whose `section` admits `S`. */
type WithSection<D, S extends ProjectSection> = D extends {
  section: infer DS extends ProjectSection;
}
  ? S extends DS
    ? D
    : never
  : never;

/** `T` narrowed to the Projects in Section `S`. */
export type InSection<T extends HasProject, S extends ProjectSection> = T & {
  data: WithSection<T["data"], S>;
};

export type ProjectEntry = CollectionEntry<"projects">;
export type CardProjectEntry = InSection<ProjectEntry, CardSection>;

/** Each Section's Projects, the Featured one first, then by `order`. */
export type ArrangedProjects<T extends HasProject> = {
  [S in ProjectSection]: InSection<T, S>[];
};

const byFeaturedThenOrder = <T extends HasProject>(a: T, b: T) =>
  Number(b.data.featured ?? false) - Number(a.data.featured ?? false) ||
  a.data.order - b.data.order;

export function arrangeProjects<T extends HasProject>(
  projects: readonly T[],
): ArrangedProjects<T> {
  const arranged = {} as ArrangedProjects<T>;
  for (const section of PROJECT_SECTIONS) {
    const inSection = projects.filter(
      (p): p is InSection<T, typeof section> => p.data.section === section,
    );
    const featured = inSection.filter((p) => p.data.featured);
    if (featured.length > 1) {
      throw new Error(`At most one Featured Project is allowed in ${section}`);
    }
    arranged[section] = inSection.sort(byFeaturedThenOrder);
  }
  return arranged;
}
