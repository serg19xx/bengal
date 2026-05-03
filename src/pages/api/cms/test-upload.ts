import type { APIRoute } from 'astro';
import { json, requireCmsAuth } from '../../../lib/cms/api-helpers';
import { isAllowedTestUploadMime, listTestUploads, saveTestUpload } from '../../../lib/cms/test-upload-fs';

export const GET: APIRoute = async ({ cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  try {
    const files = await listTestUploads();
    return json({ files });
  } catch (e) {
    console.error(e);
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = requireCmsAuth(cookies);
  if (denied) return denied;
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return json({ error: 'Missing file' }, 400);
    }
    const mime = file.type || 'application/octet-stream';
    if (!isAllowedTestUploadMime(mime)) {
      return json({ error: 'Only JPEG, PNG, WebP, and GIF are allowed' }, 400);
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const url = await saveTestUpload(buf, mime);
    return json({ url }, 201);
  } catch (e) {
    console.error(e);
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
};
