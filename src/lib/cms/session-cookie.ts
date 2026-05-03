import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';

const COOKIE_NAME = 'cms_session';

function getSigningSecret(): string {
  const fromEnv =
    typeof import.meta.env.CMS_SESSION_SECRET === 'string'
      ? import.meta.env.CMS_SESSION_SECRET.trim()
      : '';
  const pwd =
    typeof import.meta.env.CMS_ADMIN_PASSWORD === 'string'
      ? import.meta.env.CMS_ADMIN_PASSWORD.trim()
      : '';
  return fromEnv || pwd || 'dev-only-change-me';
}

export function signSession(ttlSec: number): string {
  const secret = getSigningSecret();
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const rnd = randomBytes(16).toString('hex');
  const payload = `${exp}.${rnd}`;
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifySessionCookie(value: string | undefined): boolean {
  if (!value) return false;
  const parts = value.split('.');
  if (parts.length !== 3) return false;
  const [exp, rnd, sig] = parts;
  const payload = `${exp}.${rnd}`;
  const secret = getSigningSecret();
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  try {
    if (!timingSafeEqual(Buffer.from(sig, 'utf8'), Buffer.from(expected, 'utf8'))) return false;
  } catch {
    return false;
  }
  if (Number(exp) < Math.floor(Date.now() / 1000)) return false;
  return true;
}

export function isCmsLoginConfigured(): boolean {
  const pwd =
    typeof import.meta.env.CMS_ADMIN_PASSWORD === 'string'
      ? import.meta.env.CMS_ADMIN_PASSWORD.trim()
      : '';
  return Boolean(pwd);
}

/** When no password is set, CMS is open (local dev only). */
export function isCmsAuthenticated(cookies: AstroCookies): boolean {
  if (!isCmsLoginConfigured()) return true;
  return verifySessionCookie(cookies.get(COOKIE_NAME)?.value);
}

export function setSessionCookie(cookies: AstroCookies): void {
  const maxAge = 7 * 24 * 3600;
  const token = signSession(maxAge);
  cookies.set(COOKIE_NAME, token, {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge,
  });
}

export function clearSessionCookie(cookies: AstroCookies): void {
  cookies.set(COOKIE_NAME, '', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    maxAge: 0,
  });
}

export function safeEqualPassword(a: string, b: string): boolean {
  const ba = Buffer.from(a, 'utf8');
  const bb = Buffer.from(b, 'utf8');
  if (ba.length !== bb.length) return false;
  try {
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

export function getExpectedAdminPassword(): string {
  return typeof import.meta.env.CMS_ADMIN_PASSWORD === 'string'
    ? import.meta.env.CMS_ADMIN_PASSWORD.trim()
    : '';
}
