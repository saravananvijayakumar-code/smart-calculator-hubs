export interface ExchangeRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: Date;
}

export interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
}

export interface GetRateParams {
  from: string;
  to: string;
}

export interface GetRateResponse {
  rate: ExchangeRate;
}

export interface GetRatesParams {
  base: string;
  currencies?: string[];
}

export interface GetRatesResponse {
  base: string;
  rates: Record<string, number>;
  lastUpdated: Date;
}

export interface ConvertParams {
  from: string;
  to: string;
  amount: number;
}

export interface ConvertResponse {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  lastUpdated: Date;
}

export interface GetCurrenciesResponse {
  currencies: CurrencyInfo[];
}