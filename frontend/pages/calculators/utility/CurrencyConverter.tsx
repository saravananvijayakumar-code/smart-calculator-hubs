import { useState, useEffect } from 'react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, TrendingUp, Clock } from 'lucide-react';
import backend from '~backend/client';
import type { CurrencyInfo } from '~backend/exchange/types';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

export function CurrencyConverter() {
  const [amount, setAmount] = useState('1');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [autoConvert, setAutoConvert] = useState(true);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await backend.exchange.getCurrencies();
        setCurrencies(response.currencies);
      } catch (error) {
        console.error('Failed to load currencies:', error);
      }
    };
    loadCurrencies();
  }, []);

  // Auto-convert when amount, from or to currency changes
  useEffect(() => {
    if (autoConvert && amount && fromCurrency && toCurrency && !isNaN(Number(amount))) {
      const timeoutId = setTimeout(() => {
        handleConvert();
      }, 500); // Debounce for 500ms

      return () => clearTimeout(timeoutId);
    }
  }, [amount, fromCurrency, toCurrency, autoConvert]);

  const handleConvert = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    setLoading(true);
    try {
      const response = await backend.exchange.convert({
        _from: fromCurrency,
        to: toCurrency,
        amount: Number(amount)
      });
      setResult(response.convertedAmount);
      setExchangeRate(response.rate);
      setLastUpdated(new Date(response.lastUpdated));
    } catch (error) {
      console.error('Conversion failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
    setExchangeRate(null);
  };

  const getCurrencyDisplay = (currency: CurrencyInfo) => {
    return `${currency.code} - ${currency.name}`;
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <CalculatorLayoutWithAds
      title="Currency Converter"
      description="Convert between 170+ currencies with real-time exchange rates"
      keywords="currency converter, exchange rates, forex, currency exchange, real-time rates"
    >
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Currency Converter
                {lastUpdated && (
                  <span className="ml-auto text-sm font-normal text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {formatLastUpdated(lastUpdated)}
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-5 gap-4 items-end">
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>From</Label>
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-sm text-muted-foreground">{currency.symbol}</span>
                            <span className="text-xs text-muted-foreground truncate">
                              {currency.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={swapCurrencies}
                    title="Swap currencies"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>To</Label>
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {currencies.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{currency.code}</span>
                            <span className="text-sm text-muted-foreground">{currency.symbol}</span>
                            <span className="text-xs text-muted-foreground truncate">
                              {currency.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autoConvert"
                    checked={autoConvert}
                    onChange={(e) => setAutoConvert(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="autoConvert" className="text-sm">
                    Auto-convert as you type
                  </Label>
                </div>
                
                {!autoConvert && (
                  <Button onClick={handleConvert} disabled={loading}>
                    {loading ? 'Converting...' : 'Convert'}
                  </Button>
                )}
              </div>

              {result !== null && exchangeRate !== null && (
                <div className="space-y-6">
                  <AIAnalysis
                    analysisRequest={{
                      calculatorType: "currency-converter",
                      data: {
                        fromCurrency: fromCurrency,
                        toCurrency: toCurrency,
                        amount: Number(amount),
                        convertedAmount: result,
                        exchangeRate: exchangeRate,
                        rateDate: lastUpdated || new Date()
                      }
                    }}
                    autoRun={true}
                    title="AI Currency Analysis"
                    description="Get insights on exchange rates, market trends, and practical tips for currency conversion."
                  />

                  <ExportShareButtons
                    calculatorType="currency-converter"
                    inputs={{
                      amount: Number(amount),
                      fromCurrency,
                      toCurrency
                    }}
                    results={{
                      convertedAmount: result,
                      exchangeRate,
                      lastUpdated: lastUpdated?.toISOString() || new Date().toISOString()
                    }}
                    title="Currency Converter Report"
                  />
                  
                  <Card className="bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-4">
                        <div className="space-y-2">
                          <div className="text-3xl font-bold text-primary">
                            {result.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6
                            })} {toCurrency}
                          </div>
                          <div className="text-lg text-muted-foreground">
                            {Number(amount).toLocaleString()} {fromCurrency}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div>
                            1 {fromCurrency} = {exchangeRate.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6
                            })} {toCurrency}
                          </div>
                          <div>
                            1 {toCurrency} = {(1 / exchangeRate).toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 6
                            })} {fromCurrency}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {loading && (
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    Fetching real-time rates...
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About Currency Converter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Convert between 170+ world currencies using real-time exchange rates. 
                Perfect for travel planning, international business, and investment decisions.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time exchange rates</li>
                  <li>• 170+ supported currencies</li>
                  <li>• Auto-conversion as you type</li>
                  <li>• Bidirectional rate display</li>
                  <li>• Professional accuracy</li>
                  <li>• Free to use</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Popular Currencies:</h4>
                <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                  <div>USD - US Dollar</div>
                  <div>EUR - Euro</div>
                  <div>GBP - British Pound</div>
                  <div>JPY - Japanese Yen</div>
                  <div>CAD - Canadian Dollar</div>
                  <div>AUD - Australian Dollar</div>
                  <div>CHF - Swiss Franc</div>
                  <div>CNY - Chinese Yuan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exchange Rate Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Exchange rates are updated in real-time and may fluctuate based on market conditions. 
                Rates shown are for informational purposes and may differ from actual trading rates.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
}

export default CurrencyConverter;