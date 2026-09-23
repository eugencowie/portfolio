import { describe, expect, it } from "vitest";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import type { CardProjectEntry } from "@/lib/projects";
import ProjectCard from "./ProjectCard.astro";
import screenshot from "@/content/projects/gauge/screenshot.png";

type ProjectData = CardProjectEntry["data"];

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
  return container.renderToString(ProjectCard, {
    props: { project: { id: "gauge", collection: "projects", data } },
  });
}

const links = (html: string) => html.match(/<a\s/g)?.length ?? 0;

describe("ProjectCard", () => {
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
});
