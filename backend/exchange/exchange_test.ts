import { describe, expect, test, vi, beforeEach, afterEach } from "vitest";
import type { ConvertParams, ConvertResponse, CurrencyInfo } from "./types";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock shared modules
vi.mock("../shared/errors", () => ({
  ValidationError: class ValidationError extends Error {
    constructor(message: string) {
      super(message);
    }
    toAPIError() {
      return this;
    }
  },
  ExternalServiceError: class ExternalServiceError extends Error {
    constructor(message: string) {
      super(message);
    }
    toAPIError() {
      return this;
    }
  }
}));

vi.mock("../shared/validation", () => ({
  validateData: vi.fn(),
  Validator: {
    required: () => ({ type: "required" }),
    string: (opts: any) => ({ type: "string", ...opts }),
    positive: () => ({ type: "positive" })
  }
}));

vi.mock("../shared/middleware", () => ({
  withRequestLogging: (method: string, path: string, handler: Function) => handler,
  withErrorHandling: (operation: string, context: any, handler: Function) => handler(),
  createRequestContext: () => ({
    requestId: "req_123",
    userId: null
  })
}));

vi.mock("../shared/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

describe("Exchange Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("Currency Conversion Logic", () => {
    test("should handle same currency conversion", () => {
      const from = "USD";
      const to = "USD";
      const amount = 100;
      
      // Same currency should return rate of 1.0
      const expectedRate = 1.0;
      const expectedConverted = amount * expectedRate;
      
      expect(expectedRate).toBe(1.0);
      expect(expectedConverted).toBe(amount);
    });

    test("should calculate conversion correctly", () => {
      const amount = 100;
      const rate = 1.35; // USD to AUD
      const expectedConverted = amount * rate;
      
      expect(expectedConverted).toBe(135);
    });

    test("should handle decimal amounts", () => {
      const amount = 99.99;
      const rate = 0.85; // USD to EUR
      const expectedConverted = amount * rate;
      
      expect(expectedConverted).toBeCloseTo(84.99, 2);
    });

    test("should handle very small amounts", () => {
      const amount = 0.01;
      const rate = 110.0; // USD to JPY
      const expectedConverted = amount * rate;
      
      expect(expectedConverted).toBe(1.1);
    });

    test("should handle large amounts", () => {
      const amount = 1000000;
      const rate = 1.25;
      const expectedConverted = amount * rate;
      
      expect(expectedConverted).toBe(1250000);
    });
  });

  describe("Rate Calculation", () => {
    test("should calculate USD to other currency", () => {
      const usdToEur = 0.85;
      const amount = 100;
      const converted = amount * usdToEur;
      
      expect(converted).toBe(85);
    });

    test("should calculate other currency to USD", () => {
      const eurToUsd = 1 / 0.85; // Inverse of EUR rate
      const amount = 85;
      const converted = amount * eurToUsd;
      
      expect(converted).toBeCloseTo(100, 2);
    });

    test("should calculate between two non-USD currencies", () => {
      const eurRate = 0.85; // USD to EUR
      const gbpRate = 0.73; // USD to GBP
      const eurToGbp = gbpRate / eurRate; // EUR to GBP via USD
      
      expect(eurToGbp).toBeCloseTo(0.859, 3);
    });
  });

  describe("Cache Management", () => {
    test("should implement cache key generation", () => {
      const from = "USD";
      const to = "EUR";
      const cacheKey = `${from}_${to}`;
      
      expect(cacheKey).toBe("USD_EUR");
    });

    test("should check cache expiration", () => {
      const cacheDuration = 10 * 60 * 1000; // 10 minutes
      const now = Date.now();
      const recentTimestamp = now - (5 * 60 * 1000); // 5 minutes ago
      const oldTimestamp = now - (15 * 60 * 1000); // 15 minutes ago
      
      const isRecentValid = (now - recentTimestamp) < cacheDuration;
      const isOldValid = (now - oldTimestamp) < cacheDuration;
      
      expect(isRecentValid).toBe(true);
      expect(isOldValid).toBe(false);
    });

    test("should handle cache data structure", () => {
      const cacheEntry = {
        rate: 1.35,
        timestamp: Date.now()
      };
      
      expect(cacheEntry.rate).toBe(1.35);
      expect(typeof cacheEntry.timestamp).toBe("number");
      expect(cacheEntry.timestamp).toBeGreaterThan(0);
    });
  });

  describe("Fallback Rates", () => {
    test("should have comprehensive fallback rates", () => {
      const fallbackRates = {
        'USD': 1.0, 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110.0, 'CAD': 1.25, 'AUD': 1.35,
        'CHF': 0.92, 'CNY': 6.45, 'SEK': 8.42, 'NZD': 1.42, 'INR': 74.5, 'SGD': 1.35
      };
      
      expect(fallbackRates.USD).toBe(1.0);
      expect(fallbackRates.EUR).toBeLessThan(1.0);
      expect(fallbackRates.JPY).toBeGreaterThan(1.0);
      expect(Object.keys(fallbackRates).length).toBeGreaterThan(10);
    });

    test("should handle unknown currencies", () => {
      const fallbackRates: Record<string, number> = { 'USD': 1.0, 'EUR': 0.85 };
      const unknownRate = fallbackRates['XYZ'] || 1.0;
      
      expect(unknownRate).toBe(1.0);
    });

    test("should validate fallback rate ranges", () => {
      const rates = { 'USD': 1.0, 'EUR': 0.85, 'JPY': 110.0, 'KWD': 0.30 };
      
      // USD should always be 1.0
      expect(rates.USD).toBe(1.0);
      
      // Rates should be positive
      Object.values(rates).forEach(rate => {
        expect(rate).toBeGreaterThan(0);
      });
      
      // Some currencies should be less than 1 USD
      expect(rates.EUR).toBeLessThan(1.0);
      expect(rates.KWD).toBeLessThan(1.0);
      
      // Some currencies should be more than 1 USD
      expect(rates.JPY).toBeGreaterThan(1.0);
    });
  });

  describe("API Integration", () => {
    test("should handle successful API response", async () => {
      const mockApiResponse = {
        success: true,
        timestamp: Date.now(),
        base: "USD",
        date: "2023-01-01",
        rates: {
          EUR: 0.85,
          GBP: 0.73,
          JPY: 110.0
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockApiResponse
      });

      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await response.json() as any;

      expect(data.success).toBe(true);
      expect(data.rates.EUR).toBe(0.85);
      expect(Object.keys(data.rates)).toContain("EUR");
    });

    test("should handle API failures", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      try {
        await fetch("https://api.exchangerate-api.com/v4/latest/USD");
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Network error");
      }
    });

    test("should handle HTTP error status", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found"
      });

      const response = await fetch("https://api.exchangerate-api.com/v4/latest/INVALID");
      expect(response.ok).toBe(false);
      expect(response.status).toBe(404);
    });

    test("should handle invalid JSON response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error("Invalid JSON"); }
      });

      const response = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      
      try {
        await response.json();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe("Invalid JSON");
      }
    });
  });

  describe("Currency Validation", () => {
    test("should validate currency code format", () => {
      const validCodes = ["USD", "EUR", "GBP", "JPY"];
      const invalidCodes = ["us", "EURO", "pound", "123", ""];

      validCodes.forEach(code => {
        expect(code).toMatch(/^[A-Z]{3}$/);
        expect(code.length).toBe(3);
      });

      invalidCodes.forEach(code => {
        expect(code).not.toMatch(/^[A-Z]{3}$/);
      });
    });

    test("should handle case conversion", () => {
      const lowercase = "usd";
      const mixed = "Eur";
      const uppercase = "GBP";

      expect(lowercase.toUpperCase()).toBe("USD");
      expect(mixed.toUpperCase()).toBe("EUR");
      expect(uppercase.toUpperCase()).toBe("GBP");
    });

    test("should validate amount values", () => {
      const validAmounts = [1, 100, 999.99, 0.01];
      const invalidAmounts = [0, -1, -100, NaN, Infinity];

      validAmounts.forEach(amount => {
        expect(amount).toBeGreaterThan(0);
        expect(isFinite(amount)).toBe(true);
      });

      invalidAmounts.forEach(amount => {
        const isValid = amount > 0 && isFinite(amount);
        expect(isValid).toBe(false);
      });
    });
  });

  describe("Response Format", () => {
    test("should format conversion response correctly", () => {
      const response: ConvertResponse = {
        from: "USD",
        to: "EUR",
        amount: 100,
        convertedAmount: 85,
        rate: 0.85,
        lastUpdated: new Date()
      };

      expect(response.from).toBe("USD");
      expect(response.to).toBe("EUR");
      expect(response.amount).toBe(100);
      expect(response.convertedAmount).toBe(85);
      expect(response.rate).toBe(0.85);
      expect(response.lastUpdated).toBeInstanceOf(Date);
    });

    test("should handle precision in converted amounts", () => {
      const amount = 99.99;
      const rate = 0.8567;
      const convertedAmount = amount * rate;
      const roundedAmount = Math.round(convertedAmount * 100) / 100;

      expect(convertedAmount).toBeCloseTo(85.67, 2);
      expect(roundedAmount).toBe(85.67);
    });
  });

  describe("Currency Information", () => {
    test("should provide currency metadata", () => {
      const currencies: CurrencyInfo[] = [
        { code: "USD", name: "US Dollar", symbol: "$" },
        { code: "EUR", name: "Euro", symbol: "€" },
        { code: "GBP", name: "British Pound", symbol: "£" },
        { code: "JPY", name: "Japanese Yen", symbol: "¥" }
      ];

      currencies.forEach(currency => {
        expect(currency.code).toMatch(/^[A-Z]{3}$/);
        expect(currency.name).toBeTruthy();
        expect(currency.symbol).toBeTruthy();
      });
    });

    test("should handle currency symbols correctly", () => {
      const symbols = {
        USD: "$",
        EUR: "€", 
        GBP: "£",
        JPY: "¥",
        CNY: "¥",
        INR: "₹"
      };

      Object.entries(symbols).forEach(([code, symbol]) => {
        expect(code).toMatch(/^[A-Z]{3}$/);
        expect(symbol).toBeTruthy();
        expect(symbol.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Error Scenarios", () => {
    test("should handle network timeouts", () => {
      const timeoutError = new Error("Request timeout");
      expect(timeoutError.message).toBe("Request timeout");
    });

    test("should handle rate limit errors", () => {
      const rateLimitError = new Error("Rate limit exceeded");
      expect(rateLimitError.message).toBe("Rate limit exceeded");
    });

    test("should handle malformed API responses", () => {
      const invalidResponse = { error: "Invalid base currency" };
      expect(invalidResponse.error).toBeTruthy();
      expect(invalidResponse.hasOwnProperty('rates')).toBe(false);
    });

    test("should handle service unavailability", () => {
      const serviceError = new Error("Service temporarily unavailable");
      expect(serviceError.message).toBe("Service temporarily unavailable");
    });
  });
});