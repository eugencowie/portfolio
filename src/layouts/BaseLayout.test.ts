import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { openGraphImageAlt } from "@/site";
import BaseLayout from "./BaseLayout.astro";

describe("BaseLayout", () => {
  async function render() {
    const container = await AstroContainer.create({
      astroConfig: { site: "https://example.com" },
    });
    return container.renderToString(BaseLayout, {
      props: { title: "Astro", description: "Astro site." },
    });
  }

  it("renders the title", async () => {
    expect(await render()).toContain("<title>Astro</title>");
  });

  it("describes the site-wide Open Graph image", async () => {
    expect(await render()).toContain(
      `<meta property="og:image:alt" content="${openGraphImageAlt}">`,
    );
  });
});
