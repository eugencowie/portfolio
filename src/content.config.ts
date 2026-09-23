import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { CARD_SECTIONS, PROJECT_SECTIONS } from "@/lib/projects";
import { glob } from "astro/loaders";

const project = {
  name: z.string(),
  tagline: z.string(),
  order: z.number().int(),
  featured: z.boolean().default(false),
  liveUrl: z.url().optional(),
  repoUrl: z.url().optional(),
};

const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z
      .discriminatedUnion("section", [
        z.object({
          ...project,
          section: z.enum(CARD_SECTIONS),
          screenshot: image(),
        }),
        z.object({
          ...project,
          section: z.enum(PROJECT_SECTIONS).exclude(CARD_SECTIONS),
          screenshot: z
            .undefined({
              error: "Only a Project in a Card Section has a screenshot",
            })
            .optional(),
        }),
      ])
      .transform((p, ctx) => {
        const href = p.liveUrl ?? p.repoUrl;
        if (!href) {
          ctx.addIssue({
            code: "custom",
            message: "A Project needs a Live link or a Repo link",
          });
          return z.NEVER;
        }
        return { ...p, href };
      }),
});

export const collections = { projects };
