// Site-wide copy: the one place "who is this site" is answered.
// See docs/context.md for the terms.

export const title = "eugen codes";

/** The Tagline as separate sentences, for layouts that stack them. */
export const taglineLines = [
  "I build things for fun.",
  "Some of them work.",
] as const;

export const tagline = taglineLines.join(" ");

/** Alt text for the single site-wide Open Graph image at /og.png. */
export const openGraphImageAlt = `Illustrated portrait of Eugen beside the ${title} wordmark and the tagline “${tagline}”`;
