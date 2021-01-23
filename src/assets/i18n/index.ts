import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'moment/locale/pt';

import en from './en';
import pt from './pt';

const resources = {
    en: {
        translation: en,
    },
    pt: {
        translation: pt,
    },
};

export const loadi18n = i18next.use(initReactI18next).init({
    fallbackLng: 'en',
    resources,
});
export default i18next;
export const supportedLanguages = ['en', 'pt'];
