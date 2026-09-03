import { id } from './id';
import { en } from './en';
import { defaultLocale } from './config';

const dictionaries = { id, en };

export function getDictionary(locale = defaultLocale) {
  return dictionaries[locale] || dictionaries[defaultLocale];
}
