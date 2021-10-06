import en from '@impact-market/translations/mobile/en.json';
import pt from '@impact-market/translations/mobile/pt.json';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import 'moment/locale/pt';

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
