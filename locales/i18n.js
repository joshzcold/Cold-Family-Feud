import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
 
import { TRANSLATIONS_ES } from "./es/translations.js";
import { TRANSLATIONS_EN } from "./en/translations.js";
import format from "./i18n-format.js";
 
i18n
 .use(LanguageDetector)
 .use(initReactI18next)
 .init({
   interpolation:{
     format
   },
   resources: {
     en: {
       translation: TRANSLATIONS_EN
     },
     es: {
       translation: TRANSLATIONS_ES
     }
   }
 });
 
