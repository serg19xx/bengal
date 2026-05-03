# Cat content (JSON)

Each cat is one file: **`{slug}.json`**. The `slug` in the file should match the filename (example: `milo.json` → `"slug": "milo"`).

## Images

- Put files under [`public/images/cats/`](../../../public/images/cats/) (or subfolders like `public/images/cats/milo/`).
- Reference them in JSON as **site paths** starting with `/images/...` (for example `/images/cats/milo/cover.webp`).

## Bilingual fields

Any field that is an object with `en` and `fr` must have **both** strings filled for the public site.

## Optional fields

- **`birthDate`**: string `YYYY-MM-DD`. When set, the public UI can show a formatted birth date and a derived age string.
- **`vetNotes`**: `{ "en": "...", "fr": "..." }` — free-form veterinary notes (vaccinations, illnesses, etc.). Omit the key if unused.

## After editing

Run `npm run build` from the project root to verify JSON is valid. Invalid files will fail the build with a clear error.

## CMS

Владелец правит через **`/cms`** на том же домене (см. [`cms/README.md`](../../../cms/README.md)): JSON в этой папке и фото в `public/images/cats/`.
