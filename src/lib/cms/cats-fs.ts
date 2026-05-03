import fs from 'node:fs/promises';
import path from 'node:path';
import { getCatsContentDir, getPublicCatsDir, getRepoRoot } from './repo-root';
import { assertSlugParam, validateAndNormalizeCat, type NormalizedCat } from './cat-validation';

export async function listCatsFromDisk(): Promise<unknown[]> {
  const dir = getCatsContentDir();
  const names = await fs.readdir(dir);
  const jsonFiles = names.filter((n) => n.endsWith('.json') && !n.startsWith('_'));
  const cats: unknown[] = [];
  for (const file of jsonFiles) {
    const raw = JSON.parse(await fs.readFile(path.join(dir, file), 'utf8')) as unknown;
    cats.push(raw);
  }
  cats.sort((a, b) => {
    const ao = (a as { sortOrder?: number }).sortOrder ?? 999;
    const bo = (b as { sortOrder?: number }).sortOrder ?? 999;
    if (ao !== bo) return ao - bo;
    return String((a as { name: string }).name).localeCompare(String((b as { name: string }).name));
  });
  return cats;
}

export async function readCatJson(slug: string): Promise<unknown> {
  const s = assertSlugParam(slug);
  const file = path.join(getCatsContentDir(), `${s}.json`);
  const raw = JSON.parse(await fs.readFile(file, 'utf8')) as unknown;
  return raw;
}

export async function writeCatJson(cat: NormalizedCat): Promise<void> {
  const file = path.join(getCatsContentDir(), `${cat.slug}.json`);
  await fs.mkdir(path.dirname(file), { recursive: true });
  await fs.writeFile(file, `${JSON.stringify(cat, null, 2)}\n`, 'utf8');
}

export async function deleteCatFiles(slug: string): Promise<void> {
  const s = assertSlugParam(slug);
  const file = path.join(getCatsContentDir(), `${s}.json`);
  await fs.unlink(file);
  const imgDir = path.join(getPublicCatsDir(), s);
  try {
    await fs.rm(imgDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

export function imagePathFromPublicUrl(url: string): string {
  const u = url.trim();
  if (!u.startsWith('/images/')) throw new Error('Invalid image URL');
  const rel = u.replace(/^\/+/, '');
  const abs = path.join(getRepoRoot(), 'public', rel);
  const resolved = path.resolve(abs);
  const publicRoot = path.join(getRepoRoot(), 'public');
  if (!resolved.startsWith(publicRoot + path.sep)) throw new Error('Path escape');
  return resolved;
}

export async function saveUploadedImage(slug: string, buffer: Buffer, mime: string): Promise<string> {
  const s = assertSlugParam(slug);
  const ext = mime.includes('webp') ? 'webp' : 'webp';
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const dir = path.join(getPublicCatsDir(), s);
  await fs.mkdir(dir, { recursive: true });
  const abs = path.join(dir, name);
  await fs.writeFile(abs, buffer);
  return `/images/cats/${s}/${name}`;
}

export async function unlinkImageIfUnderSlug(slug: string, url: string): Promise<void> {
  const s = assertSlugParam(slug);
  if (!url.startsWith(`/images/cats/${s}/`)) {
    throw new Error('URL must belong to this cat folder');
  }
  const abs = imagePathFromPublicUrl(url);
  await fs.unlink(abs);
}

export { validateAndNormalizeCat, assertSlugParam };
export type { NormalizedCat };
