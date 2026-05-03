# Willow Home Cattery (Koty)

Сайт питомника (EN/FR). Репозиторий на GitHub: [serg19xx/bengal](https://github.com/serg19xx/bengal).

Small bilingual marketing site for a home cattery: **English** and **French**.

## Stack

- [Astro](https://astro.build/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) v4 (`@tailwindcss/vite`)
- [Vue 3](https://vuejs.org/) islands for filters, lightbox, and contact form demo

## URLs

- `/` redirects to `/en`
- Localized routes: `/en/...` and `/fr/...` (same page tree for both languages)
- Alternate links (`hreflang`) are set in [`src/layouts/Layout.astro`](src/layouts/Layout.astro). Update `site` in [`astro.config.mjs`](astro.config.mjs) to your real domain.

## Content

- UI copy (static template text): [`src/i18n/messages.ts`](src/i18n/messages.ts) (`messagesEn` / `messagesFr`)
- **Cats (dynamic data at build time):** one JSON file per cat in [`src/content/cats/`](src/content/cats/) — loaded in [`src/data/cats.ts`](src/data/cats.ts). Run `npm run build` after edits; invalid JSON fails the build.
- Images: [`public/images/cats/`](public/images/cats/) — paths in JSON like `/images/cats/...`
- **Owner CMS** at **`/cms`** (Vue island + Astro API + cookie login; not linked in the public nav): [`cms/README.md`](cms/README.md). Deployment requires **Node.js** after `npm run build` (run the `@astrojs/node` server — not static HTML hosting alone).

## Commands

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Structure highlights

- Pages live under [`src/pages/[lang]/`](src/pages/[lang]/)
- Extra sections inspired by clear cattery layouts: **Adoption** (step flow), **Looks we love** (variety cards), home **announcement** + **health** block
