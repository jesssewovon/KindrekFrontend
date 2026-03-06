import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import resources from './locales/resources'

i18n.use(LanguageDetector) // auto-detect browser language
    .use(initReactI18next) // connect with React
    .init({
        resources,
        /* resources: {
            en: {
            translation: {
                welcome: "Welcome to my app",
                login: "Login",
                logout: "Logout",
            },
            },
            fr: {
            translation: {
                welcome: "Bienvenue sur mon application",
                login: "Connexion",
                logout: "Déconnexion",
            },
            },
        }, */
        //lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
            prefix: '{',
            suffix: '}',
        },
    });

export default i18n;