const jsonHeaders = { 'Content-Type': 'application/json' };

function fetchOpts(init?: RequestInit): RequestInit {
  return { credentials: 'include', ...init };
}

export async function getSession(): Promise<{ requireLogin: boolean; authenticated: boolean }> {
  const r = await fetch('/api/cms/session', fetchOpts());
  if (!r.ok) throw new Error('session');
  return r.json() as Promise<{ requireLogin: boolean; authenticated: boolean }>;
}

export async function login(password: string): Promise<void> {
  const r = await fetch('/api/cms/login', {
    ...fetchOpts(),
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify({ password }),
  });
  if (!r.ok) {
    const j = (await r.json().catch(() => ({}))) as { error?: string };
    throw new Error(j.error || 'Login failed');
  }
}

export async function logout(): Promise<void> {
  await fetch('/api/cms/logout', { ...fetchOpts(), method: 'POST' });
}

export interface Localized {
  en: string;
  fr: string;
}

export interface CatRecord {
  slug: string;
  sortOrder: number;
  name: string;
  breed: Localized;
  age: Localized;
  gender: 'Male' | 'Female';
  personalityShort: Localized;
  personality: Localized;
  status: 'Available' | 'Reserved' | 'Sold' | 'Not for sale';
  featured: boolean;
  coverImage: string;
  gallery: string[];
  healthNote: Localized;
  parentsNote: Localized;
  birthDate?: string;
  vetNotes?: Localized;
}

export async function listCats(): Promise<CatRecord[]> {
  const r = await fetch('/api/cms/cats', fetchOpts());
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<CatRecord[]>;
}

export async function getCat(slug: string): Promise<CatRecord> {
  const r = await fetch(`/api/cms/cats/${encodeURIComponent(slug)}`, fetchOpts());
  if (!r.ok) throw new Error(await r.text());
  return r.json() as Promise<CatRecord>;
}

export async function saveCat(cat: CatRecord, mode: 'create' | 'update'): Promise<CatRecord> {
  const slug = cat.slug.trim();
  const url = mode === 'create' ? '/api/cms/cats' : `/api/cms/cats/${encodeURIComponent(slug)}`;
  const method = mode === 'create' ? 'POST' : 'PUT';
  const r = await fetch(url, {
    ...fetchOpts(),
    method,
    headers: jsonHeaders,
    body: JSON.stringify(cat),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error || (await r.text()));
  }
  return r.json() as Promise<CatRecord>;
}

export async function deleteCat(slug: string): Promise<void> {
  const r = await fetch(`/api/cms/cats/${encodeURIComponent(slug)}`, {
    ...fetchOpts(),
    method: 'DELETE',
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function uploadCatImage(slug: string, blob: Blob): Promise<string> {
  const fd = new FormData();
  fd.append('file', blob, 'photo.webp');
  const r = await fetch(`/api/cms/cats/${encodeURIComponent(slug)}/images`, {
    ...fetchOpts(),
    method: 'POST',
    body: fd,
  });
  if (!r.ok) throw new Error(await r.text());
  const j = (await r.json()) as { url: string };
  return j.url;
}

export async function deleteCatImage(slug: string, imageUrl: string): Promise<void> {
  const q = new URLSearchParams({ url: imageUrl });
  const r = await fetch(`/api/cms/cats/${encodeURIComponent(slug)}/images?${q}`, {
    ...fetchOpts(),
    method: 'DELETE',
  });
  if (!r.ok) throw new Error(await r.text());
}

export async function listTestUploads(): Promise<{ name: string; url: string }[]> {
  const r = await fetch('/api/cms/test-upload', fetchOpts());
  if (!r.ok) throw new Error(await r.text());
  const j = (await r.json()) as { files?: { name: string; url: string }[] };
  return j.files ?? [];
}

export async function uploadTestImage(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file, file.name);
  const r = await fetch('/api/cms/test-upload', {
    ...fetchOpts(),
    method: 'POST',
    body: fd,
  });
  if (!r.ok) {
    const t = await r.text();
    try {
      const j = JSON.parse(t) as { error?: string };
      throw new Error(j.error || t);
    } catch {
      throw new Error(t);
    }
  }
  const j = (await r.json()) as { url: string };
  return j.url;
}
