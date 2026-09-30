import { describe, expect, it } from "vitest";
import { sashLight } from "./sash";

describe("sashLight", () => {
  it("leaves dark and curtained rooms unlit", () => {
    expect(sashLight("dark")).toBeUndefined();
    expect(sashLight("curtain")).toBeUndefined();
  });

  it("lights rooms with a screen blue and the rest with lamplight", () => {
    expect(sashLight("tv")).toBe("cool");
    expect(sashLight("desk")).toBe("cool");
    expect(sashLight("lamp")).toBe("warm");
    expect(sashLight("person")).toBe("warm");
  });
});
