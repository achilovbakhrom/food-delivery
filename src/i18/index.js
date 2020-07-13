import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ru from './locales/ru';
import uz from './locales/uz';
import en from './locales/en';
import Cookie from 'js-cookie';

i18n
    .use(LanguageDetector)
    .init({
        fallbackLng: 'en',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: true
        },
        react: {
            wait: true
        },
        resources: {
            en,
            ru,
            uz
        },
        defaultNS: ["translations"]
    })
;
let lang = Cookie.get('language') || 'uz';
i18n.changeLanguage(lang).then();

export default i18n;
