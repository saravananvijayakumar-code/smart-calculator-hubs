// @ts-nocheck
import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { CurrencyInfo, ExchangeRate } from '~backend/exchange/types';

interface CurrencyInputProps {
  label: string;
  amount: string;
  currency: string;
  onAmountChange: (amount: string) => void;
  onCurrencyChange: (currency: string) => void;
  showConversion?: boolean;
  targetCurrency?: string;
  className?: string;
}

export function CurrencyInput({
  label,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  showConversion = false,
  targetCurrency = 'USD',
  className = ''
}: CurrencyInputProps) {
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>([]);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadCurrencies();
  }, []);

  useEffect(() => {
    if (showConversion && currency !== targetCurrency) {
      loadExchangeRate();
    }
  }, [currency, targetCurrency, showConversion]);

  const loadCurrencies = async () => {
    try {
      const response = await backend.exchange.getCurrencies();
      setCurrencies(response.currencies);
    } catch (error) {
      console.error('Failed to load currencies:', error);
    }
  };

  const loadExchangeRate = async () => {
    if (currency === targetCurrency) {
      setExchangeRate(null);
      return;
    }

    setLoading(true);
    try {
      const response = await backend.exchange.getRate({
        _from: currency,
        to: targetCurrency
      });
      setExchangeRate(response.rate);
    } catch (error) {
      console.error('Failed to load exchange rate:', error);
      toast({
        title: "Warning",
        description: "Unable to fetch current exchange rate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    const currencyInfo = currencies.find(c => c.code === currencyCode);
    const symbol = currencyInfo?.symbol || currencyCode;
    return `${symbol}${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const convertedAmount = exchangeRate && amount ? 
    (parseFloat(amount) * exchangeRate.rate) : null;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>
      <div className="flex space-x-2">
        <Input
          type="number"
          placeholder="0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="flex-1"
        />
        <Select value={currency} onValueChange={onCurrencyChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {currencies.map((currencyInfo) => (
              <SelectItem key={currencyInfo.code} value={currencyInfo.code}>
                {currencyInfo.code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {showConversion && currency !== targetCurrency && (
          <Button
            variant="outline"
            size="icon"
            onClick={loadExchangeRate}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
      
      {showConversion && exchangeRate && convertedAmount && currency !== targetCurrency && (
        <div className="text-sm text-muted-foreground">
          ≈ {formatCurrency(convertedAmount, targetCurrency)} 
          <span className="ml-2">
            (1 {currency} = {exchangeRate.rate.toFixed(4)} {targetCurrency})
          </span>
        </div>
      )}
    </div>
  );
}