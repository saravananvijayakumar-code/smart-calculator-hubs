import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SEOHead } from './SEOHead';

interface CalculatorLayoutProps {
  country: string;
}

const countryInfo = {
  au: { name: 'Australia', flag: '🇦🇺', currency: 'AUD' },
  us: { name: 'United States', flag: '🇺🇸', currency: 'USD' },
  uk: { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP' },
  in: { name: 'India', flag: '🇮🇳', currency: 'INR' },
};

export function CalculatorLayout({ country }: CalculatorLayoutProps) {
  const { calculator } = useParams();
  const countryData = countryInfo[country as keyof typeof countryInfo];

  return (
    <div className="container mx-auto px-4 py-8">
      <SEOHead
        title={`${calculator} Calculator - ${countryData.name} | Smart Calculator Hubs`}
        description={`Professional ${calculator} calculator for ${countryData.name}. Get accurate results with our easy-to-use financial tools.`}
        keywords={`${calculator}, calculator, ${countryData.name}, financial, ${countryData.currency}`}
      />

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>{countryData.flag}</span>
              <span>{countryData.name}</span>
            </Badge>
          </div>
          <h1 className="text-3xl font-bold capitalize mb-2">
            {calculator?.replace('-', ' ')} Calculator
          </h1>
          <p className="text-lg text-muted-foreground">
            Professional {calculator?.replace('-', ' ')} calculator designed for {countryData.name}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calculator</CardTitle>
                <CardDescription>
                  Enter your details below to calculate your {calculator?.replace('-', ' ')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-center py-12 text-muted-foreground">
                    Calculator form will be implemented here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results & Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Results will appear here
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About This Calculator</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This calculator is specifically designed for {countryData.name} and uses local 
                  financial regulations and standards to provide accurate results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>How to Use This Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p>
                  This {calculator?.replace('-', ' ')} calculator is designed to help you make informed 
                  financial decisions. Here's how to get the most accurate results:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Enter all required fields accurately</li>
                  <li>Use current market rates and conditions</li>
                  <li>Review results carefully before making decisions</li>
                  <li>Consider consulting with a financial advisor for complex situations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
