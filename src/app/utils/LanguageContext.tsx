"use client";
import { createContext, useState, ReactNode } from "react";
import { en, vi } from "./locales";

type LanguageContextType = {
  locale: "en" | "vi";
  setLocale: (locale: "en" | "vi") => void;
  translations: typeof en | typeof vi;
};

export const LanguageContext = createContext<LanguageContextType>({
  locale: "en",
  setLocale: () => {},
  translations: en,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState<"en" | "vi">("en");

  const translations = locale === "en" ? en : vi;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, translations }}>
      {children}
    </LanguageContext.Provider>
  );
};
