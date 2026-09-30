/**
 * A pseudo-random number generator (mulberry32) returning numbers in [0, 1).
 * The same seed always yields the same sequence, so anything laid out with it
 * at build time renders the same on every build.
 */
export function seededRandom(seed: number): () => number {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
