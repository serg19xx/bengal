import type { APIRoute } from 'astro';
import { json } from '../../../lib/cms/api-helpers';
import { isCmsAuthenticated, isCmsLoginConfigured } from '../../../lib/cms/session-cookie';

export const GET: APIRoute = async ({ cookies }) => {
  const requireLogin = isCmsLoginConfigured();
  const authenticated = isCmsAuthenticated(cookies);
  return json({ requireLogin, authenticated });
};
