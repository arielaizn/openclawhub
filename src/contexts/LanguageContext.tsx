"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type Language = "he" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "he",
  toggleLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("he");

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => {
      const next = prev === "he" ? "en" : "he";
      document.documentElement.lang = next;
      document.documentElement.dir = next === "he" ? "rtl" : "ltr";
      return next;
    });
  }, []);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
