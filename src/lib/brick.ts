import { seededRandom } from "./random";

const width = 46;
const height = 15;
const mortar = 2;
const columns = 8;
const rows = 12;

// The brickwork's colour, between its colour in the dark and under a Spill.
const BRICKWORK = [60, 27, 66];

/**
 * A shade that leaves `light`, out of 255 for red, green and blue, of what
 * lies under it. A grey one does so exactly whatever it is laid over. A tinted
 * one is matched to the brickwork's colour: it shows a little more of its tint
 * in the dark and a little less under a Spill.
 */
function shade(light: number[]): string {
  const least = Math.min(...light);
  const alpha = 1 - least / 255;
  const [r, g, b] = light.map((part, i) =>
    alpha ? Math.round((BRICKWORK[i] * (part - least)) / 255 / alpha) : 0,
  );
  return `rgba(${r},${g},${b},${alpha.toFixed(3)})`;
}

/**
 * The Highrise's bricks as one SVG tile, laid in stretcher bond, to lay over
 * the brickwork and every light that falls on it: bricks let the light
 * through, mortar eats it. It is a tile of shades, not of colours to multiply
 * the brickwork by, which would have the browser blend the whole Highrise
 * again on every frame. Small bricks make a tall Highrise. Each course
 * repeats its first brick past the right-hand edge, so the half bricks at
 * the ends of the staggered courses match when the tile repeats.
 */
export function brickTile(): string {
  const random = seededRandom(20260926);
  let bricks = "";
  // Mortar runs along the top of every course and between its bricks.
  let joints = "";
  for (let row = 0; row <= rows; row++) {
    joints += `M0 ${row * height}H${width * columns}`;
  }
  for (let row = 0; row < rows; row++) {
    const offset = row % 2 ? -width / 2 : 0;
    const tones = Array.from({ length: columns }, random);
    for (let column = 0; column <= columns; column++) {
      const tone = tones[column % columns];
      const v = Math.round(200 + tone * 55);
      // Most bricks grey under the city light, a few still showing red.
      const warm = tone > 0.72;
      const fill = shade(warm ? [v, v - 28, v - 36] : [v, v, v]);
      bricks += `<rect x='${column * width + offset + mortar / 2}' y='${row * height + mortar / 2}' width='${width - mortar}' height='${height - mortar}' fill='${fill}'/>`;
      joints += `M${column * width + offset} ${row * height + mortar / 2}v${height - mortar}`;
    }
  }
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${width * columns}' height='${height * rows}'><path stroke='${shade([96, 84, 122])}' stroke-width='${mortar}' d='${joints}'/>${bricks}</svg>`;
}
