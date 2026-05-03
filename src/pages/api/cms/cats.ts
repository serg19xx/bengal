import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import { json, requireCmsAuth } from '../../../lib/cms/api-helpers';
import { getCatsContentDir } from '../../../lib/cms/repo-root';
import { listCatsFromDisk, validateAndNormalizeCat, writeCatJson } from '../../../lib/cms/cats-fs';

export const GET: APIRoute = async ({ cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  try {
    const cats = await listCatsFromDisk();
    return json(cats);
  } catch (e) {
    console.error(e);
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  try {
    const raw = await request.json();
    const cat = validateAndNormalizeCat(raw);
    const file = path.join(getCatsContentDir(), `${cat.slug}.json`);
    try {
      await fs.access(file);
      return json({ error: 'Cat with this slug already exists' }, 409);
    } catch {
      /* ok */
    }
    await writeCatJson(cat);
    return json(cat, 201);
  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e) }, 400);
  }
};
