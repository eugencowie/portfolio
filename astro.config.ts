import { defineConfig, fontProviders } from "astro/config";
import pages from "astro-pages";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: process.env.SITE_URL,
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Commit Mono",
      cssVariable: "--font-commit-mono",
      weights: [400, 700],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["monospace"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Michroma",
      cssVariable: "--font-michroma",
      weights: [400],
      styles: ["normal"],
      subsets: ["latin"],
      fallbacks: ["sans-serif"],
    },
  ],
  integrations: [
    process.env.NODE_ENV === "development"
      ? pages({
          dir: "debug",
          glob: "**/*.astro",
          pattern: ({ pattern }) => `/debug${pattern}`,
        })
      : undefined,
  ],
});
