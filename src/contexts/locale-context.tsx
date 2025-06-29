
'use client';

import React, { createContext, useContext, useState, useEffect, type PropsWithChildren, useCallback } from 'react';
import ar from '@/locales/ar.json';
import en from '@/locales/en.json';

type Locale = 'en' | 'ar';
type Dictionary = typeof en;

const translations: Record<Locale, Dictionary> = { ar, en };

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Dictionary, replacements?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const LocaleProvider = ({ children }: PropsWithChildren) => {
  const [locale, setLocaleState] = useState<Locale>('ar');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    const initialLocale = (savedLocale && ['en', 'ar'].includes(savedLocale)) ? savedLocale : 'ar';
    setLocaleState(initialLocale);
    document.documentElement.lang = initialLocale;
    document.documentElement.dir = initialLocale === 'ar' ? 'rtl' : 'ltr';
    setIsMounted(true);
  }, []);
  
  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('locale', newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr';
  };

  const t = useCallback((key: keyof Dictionary, replacements?: Record<string, string | number>): string => {
      let translation = translations[locale]?.[key] || translations['en'][key] || key;
      if (replacements) {
        Object.keys(replacements).forEach((placeholder) => {
            translation = translation.replace(`{${placeholder}}`, String(replacements[placeholder]));
        });
      }
      return translation;
  }, [locale]);
  
  if (!isMounted) {
    return null;
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
        {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
