# Render the Open Graph image from the site itself

The Open Graph image must show the real Wordmark in the real fonts with the same colour wash as the home page. Canvas-based generators such as `astro-og-canvas` only compose a title, a description, a logo image, a gradient, and a border, so the Wordmark lockup would have to be pre-rendered as a bitmap anyway. Instead, `/og` is an ordinary page (marked noindex) laid out at 1200 by 630, and `mise run build:assets` starts a development server, screenshots it with headless Chromium, and commits the result as `public/og.png`. The Icon (favicon and touch icon) is cut from the Avatar with sharp in the same script.

## Consequences

- Changing the Wordmark, Tagline, or palette requires re-running `mise run build:assets` and committing the regenerated assets.
- The script depends on Playwright's bundled Chromium being installed, which the e2e suite already requires.
