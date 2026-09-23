import { defineCollection, type SchemaContext } from "astro:content";
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

/** A Project's frontmatter, with `href` resolved to its Live link or Repo link. */
export const projectSchema = ({ image }: SchemaContext) =>
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
        featured: z
          .literal(false, {
            error: "Other Projects cannot be Featured",
          })
          .default(false),
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
    });

const projects = defineCollection({
  loader: glob({ pattern: "*/index.md", base: "./src/content/projects" }),
  schema: projectSchema,
});

export const collections = { projects };
