import { describe, expect, it } from "vitest";
import { signWidth, twoLineWidth } from "./sign";

describe("signWidth", () => {
  it("adds up the glyphs' widths, spaces included", () => {
    // Measured in a browser: 6.66em and 8.36em. The table's widths are rounded,
    // so they add up to within a few hundredths of that.
    expect(signWidth("fourensics")).toBeCloseTo(6.66, 1);
    expect(signWidth("race to which")).toBeCloseTo(8.36, 1);
  });

  it("sizes by the lowercase glyphs, as the Sign is set", () => {
    expect(signWidth("Gauge")).toBe(signWidth("gauge"));
  });

  it("counts a glyph it does not know as the widest it does", () => {
    expect(signWidth("é")).toBe(signWidth("m"));
  });
});

describe("twoLineWidth", () => {
  it("is the width of a single word", () => {
    expect(twoLineWidth("Fourensics")).toBe(signWidth("fourensics"));
  });

  it("is the wider of two words", () => {
    expect(twoLineWidth("DeepSWE Enhanced")).toBe(signWidth("enhanced"));
  });

  it("picks the break whose wider line is narrowest", () => {
    // "race to which" / "mountain?" beats "race to" / "which mountain?".
    expect(twoLineWidth("Race to Which Mountain?")).toBe(
      signWidth("race to which"),
    );
  });
});
