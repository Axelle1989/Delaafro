import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import fr from '@/locales/fr.json';
import en from '@/locales/en.json';

export type Language = 'fr' | 'en';

const STORAGE_KEY = 'delaafro_lang';
const dictionaries: Record<Language, Record<string, any>> = { fr, en };

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number) => string;
  formatDate: (date: string | Date) => string;
  translateProductName: (name?: string) => string;
  translateDuration: (duration?: string) => string;
  translateTestimonialQuote: (id: string, fallbackContent: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'fr';
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'fr' || saved === 'en') return saved;
  } catch {
    // Ignore storage errors
  }
  const browserLang = (navigator.language || 'fr').toLowerCase();
  return browserLang.startsWith('en') ? 'en' : 'fr';
}

function getNestedValue(obj: Record<string, any>, path: string): string | undefined {
  const parts = path.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Ignore storage errors
    }
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = dictionaries[language];
      const fallbackDict = dictionaries.fr;

      // Support de la pluralisation via _one / _other quand params.count est fourni
      let resolvedKey = key;
      if (params && typeof params.count === 'number') {
        const pluralKey = params.count === 1 ? `${key}_one` : `${key}_other`;
        if (getNestedValue(dict, pluralKey) !== undefined || getNestedValue(fallbackDict, pluralKey) !== undefined) {
          resolvedKey = pluralKey;
        }
      }

      let value = getNestedValue(dict, resolvedKey);

      if (value === undefined) {
        if (language === 'en' && import.meta.env.DEV) {
          console.warn(`[i18n] Clé manquante en EN : "${resolvedKey}", fallback sur FR.`);
        }
        value = getNestedValue(fallbackDict, resolvedKey);
      }

      if (value === undefined) {
        if (import.meta.env.DEV) {
          console.warn(`[i18n] Clé introuvable : "${resolvedKey}"`);
        }
        return key;
      }

      if (!params) return value;

      return value.replace(/\{\{(\w+)\}\}/g, (_match, token) => {
        const replacement = params[token];
        return replacement !== undefined ? String(replacement) : '';
      });
    },
    [language]
  );

  const formatNumber = useCallback(
    (value: number) => new Intl.NumberFormat(language === 'en' ? 'en-US' : 'fr-FR').format(value),
    [language]
  );

  const formatDate = useCallback(
    (date: string | Date) => {
      const d = typeof date === 'string' ? new Date(date) : date;
      if (Number.isNaN(d.getTime())) return '';
      return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(d);
    },
    [language]
  );

  const translateProductName = useCallback(
    (name?: string) => {
      if (!name) return '';
      if (language === 'fr') return name;
      return (en.products as Record<string, string>)[name] || name;
    },
    [language]
  );

  const translateDuration = useCallback(
    (duration?: string) => {
      if (!duration) return '';
      if (language === 'fr') return duration;
      return (en.durations as Record<string, string>)[duration] || duration;
    },
    [language]
  );

  const translateTestimonialQuote = useCallback(
    (id: string, fallbackContent: string) => {
      if (language === 'fr') return fallbackContent;
      return (en.testimonials as Record<string, string>)[id] || fallbackContent;
    },
    [language]
  );

  return (
    <I18nContext.Provider
      value={{
        language,
        setLanguage,
        t,
        formatNumber,
        formatDate,
        translateProductName,
        translateDuration,
        translateTestimonialQuote,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
};
