import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { ptBr } from "./locales/pt-br";
import { getLocaleLanguage, type GameLanguage } from "../utils/detectLanguage";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    "pt-br": { translation: ptBr },
  },
  lng: getLocaleLanguage(),
  fallbackLng: "en",
  lowerCaseLng: true,
  interpolation: {
    escapeValue: false,
  },
});

export const changeAppLanguage = (language: GameLanguage): void => {
  void i18n.changeLanguage(language);
};

export default i18n;
