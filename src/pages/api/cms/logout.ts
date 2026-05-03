import type { APIRoute } from 'astro';
import { json } from '../../../lib/cms/api-helpers';
import { clearSessionCookie } from '../../../lib/cms/session-cookie';

export const POST: APIRoute = async ({ cookies }) => {
  clearSessionCookie(cookies);
  return json({ ok: true });
};
