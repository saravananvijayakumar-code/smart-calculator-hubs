// @ts-nocheck
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormatting } from '../utils/formatting';
import { useLocale } from '../contexts/LocaleContext';


export const LocalizationDemo: React.FC = () => {
  const { t } = useTranslation();
  const { formatCurrency, formatNumber, formatDate, formatPercentage } = useFormatting();
  const { currentLocale } = useLocale();

  const sampleValues = {
    currency: 1234567.89,
    number: 1234567.89,
    percentage: 12.34,
    date: new Date('2024-03-15')
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Localization Demo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Current Locale: {currentLocale}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground">Currency Formatting</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-mono">{formatCurrency(sampleValues.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Compact:</span>
                <span className="font-mono">{formatCurrency(sampleValues.currency, { notation: 'compact' })}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground">Number Formatting</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Number:</span>
                <span className="font-mono">{formatNumber(sampleValues.number)}</span>
              </div>
              <div className="flex justify-between">
                <span>Percentage:</span>
                <span className="font-mono">{formatPercentage(sampleValues.percentage)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground">Date Formatting</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Date:</span>
                <span className="font-mono">{formatDate(sampleValues.date)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-muted-foreground">Localized Text</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Currency:</span>
                <span className="font-mono">{t('common.currency')}</span>
              </div>
              <div className="flex justify-between">
                <span>Calculate:</span>
                <span className="font-mono">{t('common.calculate')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Sample Calculator Text</h4>
          <div className="space-y-2 text-sm">
            <p><strong>Title:</strong> {t('calculators.compoundInterest.title')}</p>
            <p><strong>Principal Label:</strong> {t('calculators.compoundInterest.principal')}</p>
            <p><strong>Final Amount:</strong> {t('calculators.compoundInterest.finalAmount')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};