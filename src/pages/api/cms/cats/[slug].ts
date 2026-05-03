import type { APIRoute } from 'astro';
import { json, requireCmsAuth } from '../../../../lib/cms/api-helpers';
import {
  assertSlugParam,
  deleteCatFiles,
  readCatJson,
  validateAndNormalizeCat,
  writeCatJson,
} from '../../../../lib/cms/cats-fs';

export const GET: APIRoute = async ({ params, cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  const slug = params.slug;
  if (!slug || typeof slug !== 'string') return json({ error: 'Missing slug' }, 400);
  try {
    assertSlugParam(slug);
    const raw = await readCatJson(slug);
    return json(raw);
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return json({ error: 'Not found' }, 404);
    console.error(e);
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  const paramSlug = params.slug;
  if (!paramSlug || typeof paramSlug !== 'string') return json({ error: 'Missing slug' }, 400);
  try {
    assertSlugParam(paramSlug);
    const raw = await request.json();
    const cat = validateAndNormalizeCat(raw);
    if (cat.slug !== paramSlug) {
      return json({ error: 'Body slug must match URL slug' }, 400);
    }
    await writeCatJson(cat);
    return json(cat);
  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e) }, 400);
  }
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  const slug = params.slug;
  if (!slug || typeof slug !== 'string') return json({ error: 'Missing slug' }, 400);
  try {
    assertSlugParam(slug);
    await deleteCatFiles(slug);
    return json({ ok: true });
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return json({ error: 'Not found' }, 404);
    console.error(e);
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
};
