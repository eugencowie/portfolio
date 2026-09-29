/** What shows through one of the Tenement's ordinary sash windows. */
export type SashKind =
  | "dark"
  | "curtain"
  | "lamp"
  | "blind"
  | "tv"
  | "person"
  | "cat"
  | "desk"
  | "plant";

/** Lamplight, or the blue of a screen. */
export type SashLight = "warm" | "cool";

/** The light a sash window's room throws out of it, if it is lit. */
export function sashLight(kind: SashKind): SashLight | undefined {
  switch (kind) {
    case "dark":
    case "curtain":
      return undefined;
    case "tv":
    case "desk":
      return "cool";
    case "lamp":
    case "blind":
    case "person":
    case "cat":
    case "plant":
      return "warm";
  }
}
