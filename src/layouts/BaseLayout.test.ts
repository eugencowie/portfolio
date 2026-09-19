import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import BaseLayout from "./BaseLayout.astro";

describe("BaseLayout", () => {
  it("renders the title", async () => {
    const container = await AstroContainer.create({
      astroConfig: { site: "https://example.com" },
    });
    const result = await container.renderToString(BaseLayout, {
      props: { title: "Astro", description: "Astro site." },
    });
    expect(result).toContain("<title>Astro</title>");
  });
});
