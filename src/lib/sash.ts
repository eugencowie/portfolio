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

/** Each light's colour as `rgb()` channels, to take any alpha. */
export const SASH_LIGHT_RGB = {
  warm: "255 170 90",
  cool: "110 150 255",
} as const satisfies Record<SashLight, string>;

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
