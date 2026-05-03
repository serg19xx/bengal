const BIRTH_RE = /^\d{4}-\d{2}-\d{2}$/;

export function approximateAgeFromBirth(iso: string, lang: 'en' | 'fr'): string {
  if (!BIRTH_RE.test(iso)) return '—';
  const birth = new Date(`${iso}T12:00:00Z`);
  const now = new Date();
  let months =
    (now.getUTCFullYear() - birth.getUTCFullYear()) * 12 + (now.getUTCMonth() - birth.getUTCMonth());
  if (now.getUTCDate() < birth.getUTCDate()) months -= 1;
  months = Math.max(0, months);
  if (months < 18) {
    return lang === 'fr' ? `${months} mois` : `${months} months`;
  }
  const years = Math.floor(months / 12);
  if (lang === 'fr') return years <= 1 ? '1 an' : `${years} ans`;
  return years <= 1 ? '1 year' : `${years} years`;
}
