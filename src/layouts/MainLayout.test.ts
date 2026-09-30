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
      '<meta property="og:image:alt" content="Illustrated portrait of Astro above the eugen.codes wordmark, in front of a neon skyline at night">',
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

  it("presents the page as a profile of the person, in structured data", async () => {
    const html = await render({ site: "https://example.com" });
    const [, json] =
      html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s) ?? [];
    expect(JSON.parse(json ?? "null")).toEqual({
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      description: "Astro site.",
      mainEntity: {
        "@type": "Person",
        name: "Astro",
        url: "https://example.com/",
        sameAs: ["https://github.com/eugencowie", "https://x.com/eugencowie"],
      },
    });
  });
});
