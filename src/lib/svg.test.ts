import { describe, expect, it } from "vitest";
import { svgUrl } from "./svg";

describe("svgUrl", () => {
  it("escapes only what a data URL can't hold", () => {
    expect(svgUrl(`<rect fill='#f00' width='50%'/>`)).toBe(
      `url("data:image/svg+xml,%3Crect fill='%23f00' width='50%25'/%3E")`,
    );
  });
});
