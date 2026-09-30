import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Keyframes are global however scoped the styles declaring them, so two
// components naming theirs alike share whichever one the build keeps.
const names = readdirSync(import.meta.dirname, {
  recursive: true,
  encoding: "utf8",
})
  .filter((file) => /\.(astro|css)$/.test(file))
  .flatMap((file) =>
    [
      ...readFileSync(join(import.meta.dirname, file), "utf8").matchAll(
        /@keyframes\s+([\w-]+)/g,
      ),
    ].map(([, name]) => name),
  );

describe("Keyframes", () => {
  it("are named differently in every component", () => {
    expect(names.filter((name, i) => names.indexOf(name) !== i)).toEqual([]);
  });
});
