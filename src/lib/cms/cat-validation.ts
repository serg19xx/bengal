/**
 * Normalizes and validates CMS cat JSON (mirrors logic previously in cms/server.mjs).
 */

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATUSES = new Set(['Available', 'Reserved', 'Sold', 'Not for sale']);
const BIRTH_RE = /^\d{4}-\d{2}-\d{2}$/;

function isLocalizedString(v: unknown): v is { en: string; fr: string } {
  return (
    typeof v === 'object' &&
    v !== null &&
    typeof (v as { en: unknown }).en === 'string' &&
    typeof (v as { fr: unknown }).fr === 'string'
  );
}

function approximateAgeFromBirth(iso: string, lang: 'en' | 'fr'): string {
  if (!BIRTH_RE.test(iso)) return '—';
  const birth = new Date(`${iso}T12:00:00Z`);
  const now = new Date();
  let months =
    (now.getUTCFullYear() - birth.getUTCFullYear()) * 12 + (now.getUTCMonth() - birth.getUTCMonth());
  if (now.getUTCDate() < birth.getUTCDate()) months -= 1;
  months = Math.max(0, months);
  if (months < 18) {
    return lang === 'fr' ? `${months} mois` : `${months} months`;
  }
  const years = Math.floor(months / 12);
  if (lang === 'fr') return years <= 1 ? '1 an' : `${years} ans`;
  return years <= 1 ? '1 year' : `${years} years`;
}

function agePairFromBirth(iso: string): { en: string; fr: string } {
  if (!iso || !BIRTH_RE.test(iso)) return { en: '—', fr: '—' };
  return {
    en: approximateAgeFromBirth(iso, 'en'),
    fr: approximateAgeFromBirth(iso, 'fr'),
  };
}

export interface NormalizedCat {
  slug: string;
  sortOrder: number;
  name: string;
  breed: { en: string; fr: string };
  age: { en: string; fr: string };
  gender: 'Male' | 'Female';
  personalityShort: { en: string; fr: string };
  personality: { en: string; fr: string };
  status: 'Available' | 'Reserved' | 'Sold' | 'Not for sale';
  featured: boolean;
  coverImage: string;
  gallery: string[];
  healthNote: { en: string; fr: string };
  parentsNote: { en: string; fr: string };
  birthDate?: string;
  vetNotes?: { en: string; fr: string };
}

export function validateAndNormalizeCat(raw: unknown): NormalizedCat {
  if (!raw || typeof raw !== 'object') throw new Error('Invalid body');
  const o = raw as Record<string, unknown>;
  const slug = typeof o.slug === 'string' ? o.slug.trim() : '';
  if (!SLUG_RE.test(slug)) {
    throw new Error('Invalid slug (use lowercase Latin letters, numbers, hyphens)');
  }

  const name = typeof o.name === 'string' ? o.name.trim() : '';
  if (!name) throw new Error('Name is required');

  const sortOrder = o.sortOrder === undefined || o.sortOrder === null ? 999 : Number(o.sortOrder);
  if (!Number.isFinite(sortOrder)) throw new Error('Invalid sortOrder');

  const gender = o.gender === 'Male' || o.gender === 'Female' ? o.gender : 'Female';
  const status = STATUSES.has(o.status as string) ? (o.status as NormalizedCat['status']) : 'Available';
  const featured = Boolean(o.featured);

  const keys = ['breed', 'age', 'personalityShort', 'personality', 'healthNote', 'parentsNote'] as const;
  for (const k of keys) {
    if (!isLocalizedString(o[k])) throw new Error(`Missing or invalid localized field: ${k}`);
  }

  let breed = o.breed as { en: string; fr: string };
  if (!breed.en?.trim() && !breed.fr?.trim()) {
    breed = { en: 'Bengal', fr: 'Bengal' };
  }

  const birthDate =
    typeof o.birthDate === 'string' && BIRTH_RE.test(o.birthDate.trim()) ? o.birthDate.trim() : undefined;

  let age = o.age as { en: string; fr: string };
  if (birthDate) {
    age = agePairFromBirth(birthDate);
  }

  const coverImage = typeof o.coverImage === 'string' ? o.coverImage.trim() : '';
  if (!coverImage.startsWith('/images/cats/')) {
    throw new Error('coverImage must start with /images/cats/');
  }

  if (!Array.isArray(o.gallery) || !o.gallery.every((x) => typeof x === 'string')) {
    throw new Error('gallery must be an array of URL strings');
  }
  const gallery = (o.gallery as string[]).map((x) => x.trim()).filter(Boolean);
  if (gallery.length === 0) throw new Error('gallery must have at least one image URL');

  for (const url of gallery) {
    if (!url.startsWith('/images/cats/')) throw new Error(`Invalid gallery URL: ${url}`);
  }
  if (!gallery.includes(coverImage)) {
    throw new Error('coverImage must be one of the gallery URLs');
  }

  let vetNotes: { en: string; fr: string } | undefined;
  if (o.vetNotes && isLocalizedString(o.vetNotes)) {
    const en = o.vetNotes.en.trim();
    const fr = o.vetNotes.fr.trim();
    if (en || fr) vetNotes = { en, fr };
  }

  const out: NormalizedCat = {
    slug,
    sortOrder,
    name,
    breed,
    age,
    gender,
    personalityShort: {
      en: (o.personalityShort as { en: string }).en.trim(),
      fr: (o.personalityShort as { fr: string }).fr.trim(),
    },
    personality: {
      en: (o.personality as { en: string }).en.trim(),
      fr: (o.personality as { fr: string }).fr.trim(),
    },
    status,
    featured,
    coverImage,
    gallery,
    healthNote: {
      en: (o.healthNote as { en: string }).en.trim(),
      fr: (o.healthNote as { fr: string }).fr.trim(),
    },
    parentsNote: {
      en: (o.parentsNote as { en: string }).en.trim(),
      fr: (o.parentsNote as { fr: string }).fr.trim(),
    },
  };
  if (birthDate) out.birthDate = birthDate;
  if (vetNotes) out.vetNotes = vetNotes;
  return out;
}

export function assertSlugParam(slug: string): string {
  if (!SLUG_RE.test(slug)) throw new Error('Invalid slug');
  return slug;
}
