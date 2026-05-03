import type { AstroCookies } from 'astro';
import { isCmsAuthenticated } from './session-cookie';

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function requireCmsAuth(cookies: AstroCookies): Response | null {
  if (!isCmsAuthenticated(cookies)) {
    return json({ error: 'Unauthorized' }, 401);
  }
  return null;
}
