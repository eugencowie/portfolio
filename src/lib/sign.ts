/**
 * The advance width of each glyph a Sign might hold, in em, measured in a
 * browser from Michroma, the font `--font-name` sets in global.css. A glyph not
 * listed here counts as the widest that is, so a name is never sized to
 * overflow.
 */
const GLYPH_WIDTHS: Record<string, number> = {
  " ": 0.28,
  a: 0.76,
  b: 0.8,
  c: 0.77,
  d: 0.8,
  e: 0.77,
  f: 0.52,
  g: 0.79,
  h: 0.78,
  i: 0.22,
  j: 0.33,
  k: 0.69,
  l: 0.28,
  m: 1.21,
  n: 0.78,
  o: 0.78,
  p: 0.8,
  q: 0.8,
  r: 0.48,
  s: 0.78,
  t: 0.63,
  u: 0.78,
  v: 0.78,
  w: 1.09,
  x: 0.8,
  y: 0.77,
  z: 0.72,
  "0": 0.95,
  "1": 0.95,
  "2": 0.95,
  "3": 0.95,
  "4": 1,
  "5": 0.95,
  "6": 0.95,
  "7": 0.97,
  "8": 0.95,
  "9": 0.97,
  "?": 0.91,
  "-": 0.5,
  ".": 0.22,
  "!": 0.28,
  "'": 0.22,
  "&": 1.19,
  "+": 0.68,
  _: 0.53,
  "/": 0.5,
  ":": 0.22,
  "(": 0.38,
  ")": 0.38,
};
const WIDEST = Math.max(...Object.values(GLYPH_WIDTHS));

/**
 * The width of `text` set on one line in lowercase Michroma, in em. The
 * lowercase follows the `lowercase` class on the Sign's `.name` heading in
 * ProjectFloor.astro.
 */
export const signWidth = (text: string): number =>
  [...text.toLowerCase()].reduce(
    (width, glyph) => width + (GLYPH_WIDTHS[glyph] ?? WIDEST),
    0,
  );

/**
 * The narrowest column, in em, that `text` fits in on at most two lines of
 * lowercase Michroma, breaking only between words: the best break's wider line.
 * A browser filling lines greedily never needs more lines than that. The words
 * are split as Sign.astro splits them, which keeps each on one line.
 */
export function twoLineWidth(text: string): number {
  const words = text.split(" ");
  const lineWidth = (from: number, to: number) =>
    signWidth(words.slice(from, to).join(" "));
  let narrowest = lineWidth(0, words.length);
  for (let at = 1; at < words.length; at++) {
    narrowest = Math.min(
      narrowest,
      Math.max(lineWidth(0, at), lineWidth(at, words.length)),
    );
  }
  return narrowest;
}
