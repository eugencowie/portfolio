import type { SchemaContext } from "astro:content";
import { z } from "astro/zod";
import { describe, expect, it } from "vitest";
import { projectSchema } from "./content.config";

// Stand in for Astro's image helper, which needs the file on disk.
const schema = projectSchema({
  image: () => z.string(),
} as unknown as SchemaContext);

const messages = (data: unknown) =>
  schema.safeParse(data).error?.issues.map((issue) => issue.message) ?? [];

const bare = { name: "Example", tagline: "An example Project", order: 1 };
const project = {
  ...bare,
  liveUrl: "https://example.com",
  repoUrl: "https://github.com/example/project",
};

describe("projectSchema", () => {
  it("accepts a Building or Games Project with a screenshot", () => {
    expect(
      schema.parse({ ...project, section: "building", screenshot: "x.png" }),
    ).toMatchObject({ featured: false, href: "https://example.com" });
  });

  it("accepts an Other Project and links it to its Repo link", () => {
    expect(
      schema.parse({ ...bare, section: "other", repoUrl: project.repoUrl }),
    ).toMatchObject({ href: project.repoUrl });
  });

  it("rejects a Featured Project in Other", () => {
    expect(
      messages({ ...project, section: "other", featured: true }),
    ).toContain("Other Projects cannot be Featured");
  });

  it("rejects a screenshot on an Other Project", () => {
    expect(
      messages({ ...project, section: "other", screenshot: "x.png" }),
    ).toContain("Only a Building or Games Project has a screenshot");
  });

  it("rejects a Project with neither a Live link nor a Repo link", () => {
    expect(messages({ ...bare, section: "other" })).toContain(
      "A Project needs a Live link or a Repo link",
    );
  });
});
