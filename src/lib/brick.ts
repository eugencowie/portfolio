import { seededRandom } from "./random";

const width = 46;
const height = 15;
const mortar = 2;
const columns = 8;
const rows = 12;

/**
 * The Highrise's bricks as one SVG tile, laid in stretcher bond, to multiply
 * over the brickwork and every light that falls on it: bricks let the light
 * through, mortar eats it. Small bricks make a tall Highrise. Each course
 * repeats its first brick past the right-hand edge, so the half bricks at
 * the ends of the staggered courses match when the tile repeats.
 */
export function brickTile(): string {
  const random = seededRandom(20260926);
  let bricks = "";
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 ? -width / 2 : 0;
    const shades = Array.from({ length: columns }, random);
    for (let column = 0; column <= columns; column++) {
      const shade = shades[column % columns];
      const v = Math.round(200 + shade * 55);
      // Most bricks grey under the city light, a few still showing red.
      const warm = shade > 0.72;
      const fill = warm
        ? `rgb(${v},${v - 28},${v - 36})`
        : `rgb(${v},${v},${v})`;
      bricks += `<rect x='${column * width + offset + mortar / 2}' y='${row * height + mortar / 2}' width='${width - mortar}' height='${height - mortar}' fill='${fill}'/>`;
    }
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${width * columns}' height='${height * rows}'><rect width='100%' height='100%' fill='rgb(96,84,122)'/>${bricks}</svg>`;
}
