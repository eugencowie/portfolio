/**
 * An SVG document as a CSS `url()` data URL, escaping only the characters a
 * data URL can't hold, so it stays about as small as the SVG. Write the SVG's
 * attributes in single quotes.
 */
export const svgUrl = (svg: string) =>
  `url("data:image/svg+xml,${svg.replace(/[%#<>"\n]/g, encodeURIComponent)}")`;
