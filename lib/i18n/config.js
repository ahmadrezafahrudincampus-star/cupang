export const defaultLocale = 'id';
export const locales = ['id', 'en'];

export function isValidLocale(locale) {
  return locales.includes(locale);
}
