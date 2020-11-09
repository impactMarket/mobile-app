import i18next from 'i18next';
import 'moment/locale/pt';

import pt from './pt';
import en from './en';

const resources = {
    en: {
        translation: en,
    },
    pt: {
        translation: pt,
    },
};

export const loadi18n = i18next.init({
    fallbackLng: 'en',
    resources,
});
export default i18next;
export const supportedLanguages = ['en', 'pt'];
