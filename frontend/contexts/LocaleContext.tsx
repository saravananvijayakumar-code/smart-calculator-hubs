import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SupportedLocale, LOCALE_CONFIGS } from '../utils/formatting';

interface LocaleContextType {
  currentLocale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  supportedLocales: SupportedLocale[];
  getLocaleName: (locale: SupportedLocale) => string;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_NAMES: Record<SupportedLocale, string> = {
  'en-US': 'United States',
  'en-AU': 'Australia', 
  'en-GB': 'United Kingdom',
  'en-IN': 'India'
};

interface LocaleProviderProps {
  children: React.ReactNode;
}

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocale, setCurrentLocale] = useState<SupportedLocale>('en-US');

  const supportedLocales: SupportedLocale[] = Object.keys(LOCALE_CONFIGS) as SupportedLocale[];

  useEffect(() => {
    const initializeLocale = async () => {
      try {
        // Get stored locale from localStorage or detect from browser/URL
        const storedLocale = localStorage.getItem('preferred-locale') as SupportedLocale;
        const urlLocale = getLocaleFromURL();
        
        // Priority: URL > localStorage > default (no browser detection)
        const initialLocale = urlLocale || storedLocale || 'en-US';
        
        if (supportedLocales.includes(initialLocale)) {
          setCurrentLocale(initialLocale);
          await i18n.changeLanguage(initialLocale);
          document.documentElement.lang = initialLocale;
        } else {
          setCurrentLocale('en-US');
          await i18n.changeLanguage('en-US');
          document.documentElement.lang = 'en-US';
        }
      } catch (error) {
        console.error('Error initializing locale:', error);
        setCurrentLocale('en-US');
        await i18n.changeLanguage('en-US');
        document.documentElement.lang = 'en-US';
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocale();
  }, []);

  const getLocaleFromURL = (): SupportedLocale | null => {
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);
    
    // Check if first segment is a locale code
    if (segments.length > 0) {
      const possibleLocale = segments[0];
      // Convert path-style to locale format (e.g., 'au' -> 'en-AU')
      const localeMap: Record<string, SupportedLocale> = {
        'us': 'en-US',
        'au': 'en-AU', 
        'uk': 'en-GB',
        'in': 'en-IN'
      };
      
      return localeMap[possibleLocale] || null;
    }
    
    return null;
  };

  const detectBrowserLocale = (): SupportedLocale | null => {
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language || (navigator as any).userLanguage;
      
      // Map browser locales to our supported locales
      const localeMap: Record<string, SupportedLocale> = {
        'en-US': 'en-US',
        'en-AU': 'en-AU',
        'en-GB': 'en-GB',
        'en-IN': 'en-IN',
        'en': 'en-US' // Default English to US
      };
      
      return localeMap[browserLang] || null;
    }
    
    return null;
  };

  const setLocale = async (locale: SupportedLocale) => {
    try {
      // Update i18n language
      await i18n.changeLanguage(locale);
      
      // Store in localStorage
      localStorage.setItem('preferred-locale', locale);
      
      // Update state
      setCurrentLocale(locale);
      
      // Update document language attribute
      document.documentElement.lang = locale;
      
    } catch (error) {
      console.error('Error setting locale:', error);
    }
  };

  const updateURLForLocale = (locale: SupportedLocale) => {
    const currentPath = window.location.pathname;
    const segments = currentPath.split('/').filter(Boolean);
    
    // Remove existing locale from path if present
    const localeSegments = ['us', 'au', 'uk', 'in'];
    if (segments.length > 0 && localeSegments.includes(segments[0])) {
      segments.shift();
    }
    
    // Add new locale to path for non-US locales
    const localeMap: Record<SupportedLocale, string> = {
      'en-US': '', // No prefix for US (default)
      'en-AU': 'au',
      'en-GB': 'uk', 
      'en-IN': 'in'
    };
    
    const localePrefix = localeMap[locale];
    if (localePrefix) {
      segments.unshift(localePrefix);
    }
    
    const newPath = '/' + segments.join('/');
    
    // Update URL without triggering navigation
    if (newPath !== currentPath) {
      window.history.replaceState({}, '', newPath);
    }
  };

  const getLocaleName = (locale: SupportedLocale): string => {
    return LOCALE_NAMES[locale] || locale;
  };

  const contextValue: LocaleContextType = {
    currentLocale,
    setLocale,
    supportedLocales,
    getLocaleName,
    isLoading
  };

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};