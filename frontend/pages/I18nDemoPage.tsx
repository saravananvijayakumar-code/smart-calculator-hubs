import React from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizationDemo } from '../components/LocalizationDemo';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

export const I18nDemoPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Internationalization Demo</h1>
          <p className="text-lg text-muted-foreground">
            Explore how our calculator platform supports different locales and currencies
          </p>

        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Switch between different locales to see how currency symbols, number formats, 
            date formats, and text content change automatically.
          </AlertDescription>
        </Alert>

        <LocalizationDemo />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Markets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>🇺🇸</span>
                    <span>United States</span>
                  </span>
                  <span className="text-sm text-muted-foreground">USD ($)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>🇦🇺</span>
                    <span>Australia</span>
                  </span>
                  <span className="text-sm text-muted-foreground">AUD ($)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>United Kingdom</span>
                  </span>
                  <span className="text-sm text-muted-foreground">GBP (£)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span>🇮🇳</span>
                    <span>India</span>
                  </span>
                  <span className="text-sm text-muted-foreground">INR (₹)</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Currency formatting with proper symbols</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Locale-appropriate date formats</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Number formatting with correct separators</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Localized text content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Automatic browser locale detection</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span className="text-sm">Persistent locale preferences</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calculator Examples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <a
                href="/calculator/compound-interest"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <h3 className="font-medium">{t('calculators.compoundInterest.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('calculators.compoundInterest.description')}
                </p>
              </a>
              <a
                href="/calculator/mortgage"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <h3 className="font-medium">{t('calculators.mortgage.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('calculators.mortgage.description')}
                </p>
              </a>
              <a
                href="/calculator/bmi"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <h3 className="font-medium">{t('calculators.bmi.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('calculators.bmi.description')}
                </p>
              </a>
              <a
                href="/calculator/currency-converter"
                className="block p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <h3 className="font-medium">{t('calculators.currency.title')}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t('calculators.currency.description')}
                </p>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};