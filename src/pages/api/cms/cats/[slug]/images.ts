import type { APIRoute } from 'astro';
import { json, requireCmsAuth } from '../../../../../lib/cms/api-helpers';
import { assertSlugParam, saveUploadedImage, unlinkImageIfUnderSlug } from '../../../../../lib/cms/cats-fs';

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  const slug = params.slug;
  if (!slug || typeof slug !== 'string') return json({ error: 'Missing slug' }, 400);
  try {
    const s = assertSlugParam(slug);
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return json({ error: 'Missing file' }, 400);
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const url = await saveUploadedImage(s, buf, file.type || 'image/webp');
    return json({ url }, 201);
  } catch (e) {
    console.error(e);
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
};

export const DELETE: APIRoute = async ({ params, request, cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  const slug = params.slug;
  if (!slug || typeof slug !== 'string') return json({ error: 'Missing slug' }, 400);
  const url = new URL(request.url).searchParams.get('url') ?? '';
  const decoded = decodeURIComponent(url.trim());
  if (!decoded) return json({ error: 'Missing url query' }, 400);
  try {
    await unlinkImageIfUnderSlug(assertSlugParam(slug), decoded);
    return json({ ok: true });
  } catch (e) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return json({ error: 'File not found' }, 404);
    return json({ error: String(e instanceof Error ? e.message : e) }, 400);
  }
};
