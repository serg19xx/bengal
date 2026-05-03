import fs from 'node:fs/promises';
import path from 'node:path';
import { getRepoRoot } from './repo-root';

const PUBLIC_URL_PREFIX = '/images/test-uploads/';

const ALLOWED_MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

export function getPublicTestUploadDir(): string {
  return path.join(getRepoRoot(), 'public', 'images', 'test-uploads');
}

function extFromMime(mime: string): string {
  const m = mime.split(';')[0]?.trim().toLowerCase() ?? '';
  return ALLOWED_MIME_EXT[m] ?? 'bin';
}

export function isAllowedTestUploadMime(mime: string): boolean {
  const m = mime.split(';')[0]?.trim().toLowerCase() ?? '';
  return m in ALLOWED_MIME_EXT;
}

export async function saveTestUpload(buffer: Buffer, mime: string): Promise<string> {
  const ext = extFromMime(mime);
  if (ext === 'bin') {
    throw new Error('Unsupported image type');
  }
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${ext}`;
  const dir = getPublicTestUploadDir();
  await fs.mkdir(dir, { recursive: true });
  const abs = path.join(dir, name);
  const resolved = path.resolve(abs);
  const root = path.resolve(dir);
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error('Invalid path');
  }
  await fs.writeFile(abs, buffer);
  return `${PUBLIC_URL_PREFIX}${name}`;
}

export async function listTestUploads(): Promise<{ name: string; url: string }[]> {
  const dir = getPublicTestUploadDir();
  let names: string[];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  const files = names.filter((n) => !n.startsWith('.') && n !== '.gitkeep');
  return files
    .map((name) => ({ name, url: `${PUBLIC_URL_PREFIX}${name}` }))
    .sort((a, b) => b.name.localeCompare(a.name));
}
