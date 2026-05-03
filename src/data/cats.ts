/**
 * Cat types, helpers, and data loaded at build time from JSON files in `src/content/cats/`.
 * Loaded at build/prerender from JSON; owners edit via **`/cms`** (see `cms/README.md`) into these files and `public/images/cats/`.
 */

import type { Locale } from "../i18n/config";

export type CatStatus = "Available" | "Reserved" | "Sold" | "Not for sale";

export type CatGender = "Male" | "Female";

export interface LocalizedString {
  en: string;
  fr: string;
}

export interface Cat {
  /** URL segment; must match filename `{slug}.json` */
  slug: string;
  /** Lower sorts first in lists when present */
  sortOrder?: number;
  name: string;
  breed: LocalizedString;
  age: LocalizedString;
  gender: CatGender;
  personalityShort: LocalizedString;
  personality: LocalizedString;
  status: CatStatus;
  featured: boolean;
  /** Public URL path, e.g. `/images/cats/milo/cover.webp` */
  coverImage: string;
  gallery: string[];
  healthNote: LocalizedString;
  parentsNote: LocalizedString;
  /** ISO `YYYY-MM-DD` — when set, cards/profile can show date + derived age */
  birthDate?: string;
  /** Vaccinations, illnesses, vet visits — bilingual; optional */
  vetNotes?: LocalizedString;
}

const STATUSES: CatStatus[] = ["Available", "Reserved", "Sold", "Not for sale"];
const GENDERS: CatGender[] = ["Male", "Female"];

function isLocalizedString(v: unknown): v is LocalizedString {
  return (
    typeof v === "object" &&
    v !== null &&
    typeof (v as LocalizedString).en === "string" &&
    typeof (v as LocalizedString).fr === "string"
  );
}

function assertCatRecord(raw: unknown, sourcePath: string): Cat {
  if (typeof raw !== "object" || raw === null) {
    throw new Error(`[cats] Invalid JSON (not an object): ${sourcePath}`);
  }
  const o = raw as Record<string, unknown>;
  const slug = o.slug;
  if (typeof slug !== "string" || !slug) {
    throw new Error(`[cats] Missing slug in ${sourcePath}`);
  }
  if (typeof o.name !== "string") throw new Error(`[cats] Missing name for ${slug}`);
  if (!STATUSES.includes(o.status as CatStatus)) throw new Error(`[cats] Invalid status for ${slug}`);
  if (!GENDERS.includes(o.gender as CatGender)) throw new Error(`[cats] Invalid gender for ${slug}`);
  if (typeof o.featured !== "boolean") throw new Error(`[cats] Invalid featured for ${slug}`);
  if (typeof o.coverImage !== "string") throw new Error(`[cats] Invalid coverImage for ${slug}`);
  if (!Array.isArray(o.gallery) || !o.gallery.every((x) => typeof x === "string")) {
    throw new Error(`[cats] Invalid gallery for ${slug}`);
  }
  for (const key of ["breed", "age", "personalityShort", "personality", "healthNote", "parentsNote"] as const) {
    if (!isLocalizedString(o[key])) throw new Error(`[cats] Invalid ${key} for ${slug}`);
  }
  const bd = o.birthDate;
  if (bd !== undefined && bd !== null) {
    if (typeof bd !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(bd)) {
      throw new Error(`[cats] Invalid birthDate for ${slug}`);
    }
  }
  if (o.vetNotes !== undefined && o.vetNotes !== null) {
    if (!isLocalizedString(o.vetNotes)) throw new Error(`[cats] Invalid vetNotes for ${slug}`);
  }
  return raw as Cat;
}

function loadCatsFromDisk(): Cat[] {
  const modules = import.meta.glob("../content/cats/*.json", {
    eager: true,
    import: "default",
  }) as Record<string, unknown>;
  const out: Cat[] = [];

  for (const [path, raw] of Object.entries(modules)) {
    const base = path.split("/").pop() ?? "";
    if (base.startsWith("_") || base === "package.json") continue;

    const fileSlug = base.replace(/\.json$/i, "");
    const cat = assertCatRecord(raw, path);

    if (fileSlug !== cat.slug) {
      console.warn(`[cats] Filename "${fileSlug}.json" does not match slug "${cat.slug}" (${path})`);
    }
    out.push(cat);
  }

  out.sort((a, b) => {
    const ao = a.sortOrder ?? 999;
    const bo = b.sortOrder ?? 999;
    if (ao !== bo) return ao - bo;
    return a.name.localeCompare(b.name);
  });

  return out;
}

/** All cats, sorted by `sortOrder` then name (build-time snapshot from JSON). */
export const cats: Cat[] = loadCatsFromDisk();

export function pickLocalized(value: LocalizedString, lang: Locale): string {
  return value[lang];
}

const BIRTH_ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Approximate age string from birth date (UTC-safe). */
export function approximateAgeFromBirth(iso: string, lang: Locale): string {
  if (!BIRTH_ISO.test(iso)) return "—";
  const birth = new Date(`${iso}T12:00:00Z`);
  const now = new Date();
  let months =
    (now.getUTCFullYear() - birth.getUTCFullYear()) * 12 + (now.getUTCMonth() - birth.getUTCMonth());
  if (now.getUTCDate() < birth.getUTCDate()) months -= 1;
  months = Math.max(0, months);
  if (months < 18) {
    return lang === "fr" ? `${months} mois` : `${months} months`;
  }
  const years = Math.floor(months / 12);
  if (lang === "fr") return years <= 1 ? "1 an" : `${years} ans`;
  return years <= 1 ? "1 year" : `${years} years`;
}

/** Card / list line: derived age when `birthDate` is set, else localized `age`. */
export function displayAgeLine(cat: Cat, lang: Locale): string {
  if (cat.birthDate && BIRTH_ISO.test(cat.birthDate)) {
    return approximateAgeFromBirth(cat.birthDate, lang);
  }
  return pickLocalized(cat.age, lang);
}

export function formatCatBirthDate(iso: string, lang: Locale): string {
  if (!BIRTH_ISO.test(iso)) return iso;
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getCatBySlug(slug: string): Cat | undefined {
  return cats.find((c) => c.slug === slug);
}

export function getAvailableCats(): Cat[] {
  return cats.filter((c) => c.status === "Available");
}

export function getFeaturedCats(): Cat[] {
  return cats.filter((c) => c.featured);
}

export function getUniqueBreedKeys(): string[] {
  const set = new Set(cats.map((c) => c.breed.en));
  return Array.from(set).sort();
}

export function getAllGalleryImages(): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const cat of cats) {
    for (const src of cat.gallery) {
      if (!seen.has(src)) {
        seen.add(src);
        out.push(src);
      }
    }
  }
  return out;
}

export interface CatOption {
  slug: string;
  name: string;
}

export function getCatOptionsForForm(): CatOption[] {
  return cats.map((c) => ({ slug: c.slug, name: c.name }));
}
