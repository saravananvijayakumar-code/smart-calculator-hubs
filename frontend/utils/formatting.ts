import { useTranslation } from 'react-i18next';

// Locale-specific formatting configurations
export const LOCALE_CONFIGS = {
  'en-US': {
    currency: 'USD',
    currencySymbol: '$',
    numberFormat: 'en-US',
    dateFormat: 'MM/dd/yyyy',
    locale: 'en-US'
  },
  'en-AU': {
    currency: 'AUD',
    currencySymbol: '$',
    numberFormat: 'en-AU',
    dateFormat: 'dd/MM/yyyy',
    locale: 'en-AU'
  },
  'en-GB': {
    currency: 'GBP',
    currencySymbol: '£',
    numberFormat: 'en-GB',
    dateFormat: 'dd/MM/yyyy',
    locale: 'en-GB'
  },
  'en-IN': {
    currency: 'INR',
    currencySymbol: '₹',
    numberFormat: 'en-IN',
    dateFormat: 'dd/MM/yyyy',
    locale: 'en-IN'
  }
} as const;

export type SupportedLocale = keyof typeof LOCALE_CONFIGS;

// Currency formatting function
export const formatCurrency = (
  amount: number,
  localeOrCurrency: SupportedLocale | 'GBP' | 'AUD' | 'INR' | 'USD' = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  // Map currency codes to locales for convenience
  const currencyToLocale: Record<string, SupportedLocale> = {
    'GBP': 'en-GB',
    'AUD': 'en-AU',
    'INR': 'en-IN',
    'USD': 'en-US'
  };
  
  const locale = currencyToLocale[localeOrCurrency] || localeOrCurrency as SupportedLocale;
  const config = LOCALE_CONFIGS[locale];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options
  }).format(amount);
};

// Number formatting function
export const formatNumber = (
  value: number,
  locale: SupportedLocale = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  const config = LOCALE_CONFIGS[locale];
  
  return new Intl.NumberFormat(config.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(value);
};

// Percentage formatting function
export const formatPercentage = (
  value: number,
  locale: SupportedLocale = 'en-US',
  options?: Intl.NumberFormatOptions
): string => {
  const config = LOCALE_CONFIGS[locale];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
    ...options
  }).format(value / 100);
};

// Date formatting function
export const formatDate = (
  date: Date,
  locale: SupportedLocale = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string => {
  const config = LOCALE_CONFIGS[locale];
  
  return new Intl.DateTimeFormat(config.locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    ...options
  }).format(date);
};

// Compact currency formatting (e.g., $1.2K, $1.5M)
export const formatCompactCurrency = (
  amount: number,
  locale: SupportedLocale = 'en-US'
): string => {
  const config = LOCALE_CONFIGS[locale];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
    notation: 'compact',
    compactDisplay: 'short'
  }).format(amount);
};

// Parse currency input (remove currency symbols and format)
export const parseCurrencyInput = (input: string, locale: SupportedLocale = 'en-US'): number => {
  const config = LOCALE_CONFIGS[locale];
  
  // Remove currency symbol and any formatting
  let cleanInput = input
    .replace(new RegExp(`\\${config.currencySymbol}`, 'g'), '')
    .replace(/[,\s]/g, ''); // Remove commas and spaces
    
  // Handle different decimal separators
  if (locale === 'en-US') {
    // US uses period for decimal
    cleanInput = cleanInput.replace(/[^\d.-]/g, '');
  } else {
    // Other locales might use comma for decimal (though we're using period in our formats)
    cleanInput = cleanInput.replace(/[^\d.,-]/g, '');
    cleanInput = cleanInput.replace(',', '.');
  }
  
  return parseFloat(cleanInput) || 0;
};

// Get currency symbol for current locale
export const getCurrencySymbol = (locale: SupportedLocale = 'en-US'): string => {
  return LOCALE_CONFIGS[locale].currencySymbol;
};

// Get currency code for current locale
export const getCurrencyCode = (locale: SupportedLocale = 'en-US'): string => {
  return LOCALE_CONFIGS[locale].currency;
};

// Hook for using formatting functions with current locale
export const useFormatting = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language as SupportedLocale;
  
  return {
    formatCurrency: (amount: number, options?: Intl.NumberFormatOptions) => 
      formatCurrency(amount, currentLocale, options),
    formatNumber: (value: number, options?: Intl.NumberFormatOptions) => 
      formatNumber(value, currentLocale, options),
    formatPercentage: (value: number, options?: Intl.NumberFormatOptions) => 
      formatPercentage(value, currentLocale, options),
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => 
      formatDate(date, currentLocale, options),
    formatCompactCurrency: (amount: number) => 
      formatCompactCurrency(amount, currentLocale),
    parseCurrencyInput: (input: string) => 
      parseCurrencyInput(input, currentLocale),
    getCurrencySymbol: () => getCurrencySymbol(currentLocale),
    getCurrencyCode: () => getCurrencyCode(currentLocale),
    currentLocale
  };
};