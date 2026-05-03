import type { Locale } from "./config";

/** Build a localized path: `pathFor('fr', 'cats', slug)` → `/fr/cats/slug` */
export function pathFor(lang: Locale, ...segments: string[]): string {
  const clean = segments.filter(Boolean).map((s) => s.replace(/^\/+|\/+$/g, ""));
  return `/${lang}/${clean.join("/")}`.replace(/\/+$/, "") || `/${lang}`;
}

/** Swap `/en/...` ↔ `/fr/...` using the current pathname */
export function swapLocaleInPath(pathname: string, target: Locale): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return `/${target}`;
  parts[0] = target;
  return `/${parts.join("/")}`;
}
