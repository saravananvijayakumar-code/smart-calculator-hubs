import { api } from "encore.dev/api";
import { ConvertParams, ConvertResponse } from "./types";
import { ValidationError, ExternalServiceError } from "../shared/errors";
import { validateData, Validator } from "../shared/validation";
import { withRequestLogging, withErrorHandling, createRequestContext } from "../shared/middleware";
import logger from "../shared/logger";

interface ExchangeRateAPIResponse {
  success: boolean;
  timestamp: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

// Cache for exchange rates to avoid excessive API calls
const rateCache = new Map<string, { rate: number; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

// Fallback rates in case the external API fails
const FALLBACK_RATES_USD: Record<string, number> = {
  'USD': 1.0, 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.0, 'CAD': 1.25, 'AUD': 1.35,
  'CHF': 0.92, 'CNY': 6.45, 'SEK': 8.42, 'NZD': 1.42, 'ARS': 98.5, 'BRL': 5.2,
  'CLP': 720.0, 'COP': 3850.0, 'MXN': 20.1, 'PEN': 3.6, 'UYU': 43.5, 'NOK': 8.6,
  'DKK': 6.3, 'PLN': 3.8, 'CZK': 21.5, 'HUF': 295.0, 'RON': 4.1, 'BGN': 1.66,
  'HRK': 6.4, 'RUB': 74.0, 'TRY': 8.5, 'UAH': 27.5, 'INR': 74.5, 'SGD': 1.35,
  'HKD': 7.8, 'KRW': 1180.0, 'THB': 31.0, 'MYR': 4.1, 'IDR': 14250.0, 'PHP': 50.5,
  'VND': 23050.0, 'TWD': 28.0, 'PKR': 160.0, 'BDT': 85.0, 'LKR': 200.0, 'NPR': 119.0,
  'AED': 3.67, 'SAR': 3.75, 'QAR': 3.64, 'KWD': 0.30, 'BHD': 0.38, 'OMR': 0.38,
  'JOD': 0.71, 'ILS': 3.25, 'LBP': 1507.0, 'IRR': 42000.0, 'IQD': 1460.0, 'ZAR': 14.2,
  'EGP': 15.7, 'NGN': 411.0, 'KES': 108.0, 'GHS': 5.8, 'TND': 2.8, 'MAD': 8.9,
  'DZD': 134.0, 'AOA': 650.0, 'XAF': 554.0, 'XOF': 554.0, 'FJD': 2.1, 'PGK': 3.5,
  'TOP': 2.3, 'WST': 2.6, 'ISK': 129.0, 'ALL': 103.0, 'MKD': 52.0, 'RSD': 100.0,
  'BAM': 1.66, 'MDL': 17.8, 'GEL': 3.1, 'AMD': 520.0, 'AZN': 1.7, 'BYN': 2.6,
  'KZT': 425.0, 'KGS': 85.0, 'TJS': 11.3, 'TMT': 3.5, 'UZS': 10650.0, 'MNT': 2850.0,
  'LAK': 9500.0, 'KHR': 4080.0, 'MMK': 1390.0, 'BTN': 74.5, 'MVR': 15.4, 'AFN': 78.0,
  'SYP': 2512.0, 'YER': 250.0
};

const convertParamsSchema = {
  from: [Validator.required(), Validator.string({ min: 3, max: 3 })],
  to: [Validator.required(), Validator.string({ min: 3, max: 3 })],
  amount: [Validator.required(), Validator.positive()],
};

// Fetch real exchange rates from external API
async function fetchExchangeRates(baseCurrency: string = 'USD'): Promise<Record<string, number> | null> {
  try {
    // Using a free exchange rate API (exchangerate-api.com)
    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json() as ExchangeRateAPIResponse;
    
    if (!data.success && data.success !== undefined) {
      throw new Error('API returned unsuccessful response');
    }
    
    return data.rates;
  } catch (error) {
    logger.error("Failed to fetch real exchange rates", {}, error instanceof Error ? error : new Error("Unknown error"));
    return null;
  }
}

// Get exchange rate with caching and fallback
async function getExchangeRate(fromCurrency: string, toCurrency: string): Promise<number> {
  if (fromCurrency === toCurrency) return 1.0;
  
  const cacheKey = `${fromCurrency}_${toCurrency}`;
  const cached = rateCache.get(cacheKey);
  
  // Check if we have a valid cached rate
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    return cached.rate;
  }
  
  try {
    // Try to fetch real rates
    const rates = await fetchExchangeRates('USD');
    
    if (rates) {
      const fromRate = rates[fromCurrency] || FALLBACK_RATES_USD[fromCurrency] || 1.0;
      const toRate = rates[toCurrency] || FALLBACK_RATES_USD[toCurrency] || 1.0;
      
      // Convert via USD: (1/fromRate) * toRate
      const rate = fromCurrency === 'USD' ? toRate : (toCurrency === 'USD' ? 1/fromRate : toRate / fromRate);
      
      // Cache the result
      rateCache.set(cacheKey, { rate, timestamp: Date.now() });
      
      return rate;
    }
  } catch (error) {
    logger.warn("Using fallback rates due to API error", {}, error instanceof Error ? error : new Error("Unknown error"));
  }
  
  // Fallback to static rates
  const fromRate = FALLBACK_RATES_USD[fromCurrency] || 1.0;
  const toRate = FALLBACK_RATES_USD[toCurrency] || 1.0;
  const rate = toRate / fromRate;
  
  // Cache fallback rate for shorter duration
  rateCache.set(cacheKey, { rate, timestamp: Date.now() - (CACHE_DURATION / 2) });
  
  return rate;
}

// Converts an amount from one currency to another.
export const convert = api<ConvertParams, ConvertResponse>(
  { expose: true, method: "GET", path: "/exchange/convert/:from/:to/:amount" },
  withRequestLogging("GET", "/exchange/convert/:from/:to/:amount", async ({ from, to, amount }) => {
    const context = createRequestContext();
    
    return withErrorHandling("currency-conversion", context, async () => {
      await validateData({ from, to, amount }, convertParamsSchema, context.requestId);

      const fromCurrency = from.toUpperCase();
      const toCurrency = to.toUpperCase();

      logger.info("Currency conversion requested", {
        requestId: context.requestId,
        metadata: { from: fromCurrency, to: toCurrency, amount },
      });

      try {
        const rate = await getExchangeRate(fromCurrency, toCurrency);
        const lastUpdated = new Date();
        const convertedAmount = amount * rate;

        const result = {
          from: fromCurrency,
          to: toCurrency,
          amount: amount,
          convertedAmount: convertedAmount,
          rate: rate,
          lastUpdated: lastUpdated
        };

        logger.info("Currency conversion completed", {
          requestId: context.requestId,
          metadata: { convertedAmount, rate },
        });

        return result;
      } catch (error) {
        throw new ExternalServiceError(
          "Unable to convert currency at this time", 
          { originalError: error instanceof Error ? error.message : "Unknown error" },
          context.requestId
        );
      }
    });
  })
);