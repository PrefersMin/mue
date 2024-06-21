import variables from 'config/variables';
import zh_CN from 'i18n/locales/achievements/zh_CN.json';

import achievements from 'utils/data/achievements.json';

import { checkAchievements, newAchievements } from './condition';

const translations = {
  zh_CN,
};

// todo: clean this up and condition.js too
function getLocalisedAchievementData(id) {
  const localised = translations[variables.languagecode][id] ||
    translations.zh_CN[id] || { name: id, description: '' };

  return {
    name: localised.name,
    description: localised.description,
  };
}

export { achievements, checkAchievements, newAchievements, getLocalisedAchievementData };
