import type { APIRoute } from 'astro';
import { json } from '../../../lib/cms/api-helpers';
import {
  getExpectedAdminPassword,
  isCmsLoginConfigured,
  safeEqualPassword,
  setSessionCookie,
} from '../../../lib/cms/session-cookie';

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isCmsLoginConfigured()) {
    setSessionCookie(cookies);
    return json({ ok: true, message: 'Login disabled — set CMS_ADMIN_PASSWORD for production.' });
  }
  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  const pwd = body?.password ?? '';
  const expected = getExpectedAdminPassword();
  if (!expected || !safeEqualPassword(pwd, expected)) {
    return json({ error: 'Invalid password' }, 401);
  }
  setSessionCookie(cookies);
  return json({ ok: true });
};
