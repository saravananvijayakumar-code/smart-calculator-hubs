import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
import enUS from './locales/en-US.json';
import enAU from './locales/en-AU.json';
import enGB from './locales/en-GB.json';
import enIN from './locales/en-IN.json';

const resources = {
  'en-US': {
    translation: enUS
  },
  'en-AU': {
    translation: enAU
  },
  'en-GB': {
    translation: enGB
  },
  'en-IN': {
    translation: enIN
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en-US',
    debug: false,
    
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;