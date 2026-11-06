# Agent Instructions

## Domain Docs

Use the vocabulary in the glossary, [docs/context.md](docs/context.md), and read the ADRs in [docs/architecture/](docs/architecture/) that touch the area you're working in.

## Development Environment

This project uses mise to manage the development environment.

- Run `mise tasks` to see the available tasks.
- Use `mise run <task>` for standard operations.
- Run `mise ls -l` to see the managed tools.
- When invoking a managed tool directly, use `mise exec -- <command> [args]` rather than invoking the tool by its bare name.

Node.js is managed by pnpm. To invoke it, use `mise run node [args]`.

When starting the dev server, use background mode:

```
mise run astro dev --background
```

To make it available over Tailscale, use `--host "$(tailscale ip -4)"` and connect to it using the Tailscale IP address.

Manage the background server with `mise run astro dev stop`, `mise run astro dev status`, and `mise run astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
