import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import MainLayout from "./MainLayout.astro";

describe("MainLayout", () => {
  async function render({ site }: { site?: string } = {}) {
    const container = await AstroContainer.create({ astroConfig: { site } });
    return container.renderToString(MainLayout, {
      props: { title: "Astro", description: "Astro site." },
      request: new Request("http://localhost:4321/about/"),
    });
  }

  it("renders the title", async () => {
    expect(await render()).toContain("<title>Astro</title>");
  });

  it("describes the site-wide Open Graph image", async () => {
    expect(await render()).toContain(
      '<meta property="og:image:alt" content="Illustrated portrait of Astro beside the tagline &quot;Astro site.&quot;">',
    );
  });

  it("resolves sharing URLs against the configured site", async () => {
    const html = await render({ site: "https://example.com" });
    expect(html).toContain(
      '<link rel="canonical" href="https://example.com/about/">',
    );
    expect(html).toContain(
      '<meta property="og:url" content="https://example.com/about/">',
    );
    expect(html).toContain(
      '<meta property="og:image" content="https://example.com/og.png">',
    );
  });

  it("falls back to the request origin when no site is configured", async () => {
    const html = await render();
    expect(html).toContain(
      '<link rel="canonical" href="http://localhost:4321/about/">',
    );
    expect(html).toContain(
      '<meta property="og:image" content="http://localhost:4321/og.png">',
    );
  });
});
