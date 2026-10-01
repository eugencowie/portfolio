import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { ComponentProps } from "astro/types";
import type { FloorProjectEntry } from "@/lib/projects";
import ProjectFloor from "./ProjectFloor.astro";
import screenshot from "@/content/projects/gauge/screenshot.png";

type ProjectData = FloorProjectEntry["data"];

const base = {
  name: "Gauge",
  tagline: "Track your Steam library.",
  section: "building",
  order: 1,
  featured: false,
  screenshot,
} satisfies Partial<ProjectData>;

async function render(data: ProjectData) {
  const container = await AstroContainer.create();
  // The container takes any props, so they are checked against the component's
  // here.
  return container.renderToString(ProjectFloor, {
    props: {
      project: { id: "gauge", collection: "projects", data },
      floor: 1,
      side: "left",
      balcony: "lights",
    } satisfies ComponentProps<typeof ProjectFloor>,
  });
}

const links = (html: string) => html.match(/<a\s/g)?.length ?? 0;

describe("ProjectFloor", () => {
  it("links only to the Live link when a Project has both", async () => {
    const html = await render({
      ...base,
      liveUrl: "https://app.example.com",
      repoUrl: "https://github.com/example/gauge",
      href: "https://app.example.com",
    });
    expect(links(html)).toBe(1);
    expect(html).toContain('href="https://app.example.com"');
    expect(html).not.toContain('href="https://github.com/example/gauge"');
    expect(html).toContain("app.example.com");
  });

  it("links to the Repo link and names its host when a Project has only that", async () => {
    const html = await render({
      ...base,
      repoUrl: "https://github.com/example/gauge",
      href: "https://github.com/example/gauge",
    });
    expect(links(html)).toBe(1);
    expect(html).toContain('href="https://github.com/example/gauge"');
    expect(html).toContain("github.com<svg");
  });

  it("gives only the Featured Project an arched window", async () => {
    const featured = await render({
      ...base,
      featured: true,
      href: "https://app.example.com",
    });
    const normal = await render({ ...base, href: "https://app.example.com" });
    expect(featured).toContain("data-fanlight");
    expect(normal).not.toContain("data-fanlight");
  });
});
