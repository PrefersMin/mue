import I18n from '@eartharoid/i18n';

import * as zh_CN from 'translations/zh_CN.json';

/**
 * Initialise the i18n object.
 * The i18n object is then returned.
 * @param locale _ The locale to use.
 * @returns The i18n object.
 */
export function initTranslations(locale) {
  return new I18n(locale, {
    zh_CN,
  });
}

export const translations = {
  zh_CN,
};
