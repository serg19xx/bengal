export type Locale = "en" | "fr";

export const locales: Locale[] = ["en", "fr"];

export const defaultLocale: Locale = "en";

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "fr";
}

export function getStaticLangPaths() {
  return locales.map((lang) => ({ params: { lang } }));
}
