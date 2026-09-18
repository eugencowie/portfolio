# Generated assets

- `public/favicon.png`, `public/apple-touch-icon.png`: `mise exec -- node scripts/favicons.mjs` (crops the avatar onto a navy disc).
- `public/og.png`: render `scripts/og.astro` by copying it to `src/pages/og.astro`, run `mise run build`, serve with `mise run preview`, and screenshot `/og` at 1200×630 with a headless browser in dark mode. Delete the page afterwards so it does not ship.
