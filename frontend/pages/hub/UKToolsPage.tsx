// @ts-nocheck
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  Wallet, 
  FileText, 
  Home, 
  Target,
  Building,
  TrendingUp,
  ArrowRight,
  MapPin,
  PiggyBank,
  Receipt
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import AmazonAffiliate from '../../components/ads/AmazonAffiliate';
import NativeBanner from '../../components/ads/NativeBanner';

const UKToolsPage: React.FC = () => {
  const ukCalculators = [
    {
      id: 'stamp-duty',
      title: 'UK Stamp Duty Calculator',
      description: 'Calculate stamp duty land tax (SDLT) for property purchases in England and Northern Ireland',
      icon: Home,
      path: '/calculators/uk/stamp-duty',
      category: 'Property',
      features: ['SDLT rates', 'First-time buyer relief', 'Additional property surcharge']
    },
    {
      id: 'isa',
      title: 'UK ISA Calculator',
      description: 'Calculate potential returns and tax savings from Individual Savings Accounts',
      icon: PiggyBank,
      path: '/calculators/uk/isa',
      category: 'Savings',
      features: ['Tax-free growth', 'Annual allowances', 'Compound returns']
    },
    {
      id: 'national-insurance',
      title: 'UK National Insurance Calculator',
      description: 'Calculate National Insurance contributions for employees and self-employed',
      icon: Receipt,
      path: '/calculators/uk/national-insurance',
      category: 'Tax',
      features: ['Class 1 & 4 NI', 'Age adjustments', 'Contribution rates']
    },
    {
      id: 'pension',
      title: 'UK Pension Calculator',
      description: 'Calculate pension pot growth and retirement income projections',
      icon: Target,
      path: '/calculators/uk/pension',
      category: 'Retirement',
      features: ['Auto-enrolment', 'Tax relief', 'Pension freedoms']
    },
    {
      id: 'btl-mortgage',
      title: 'UK Buy-to-Let Mortgage Calculator',
      description: 'Calculate BTL mortgage payments, yields, and rental returns',
      icon: Building,
      path: '/calculators/uk/btl-mortgage',
      category: 'Investment',
      features: ['Rental yields', 'Section 24 impact', 'Cash flow analysis']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SEOHead 
        title="UK Financial Calculators - Tax, Property & Investment Tools"
        description="Comprehensive collection of UK-specific financial calculators including stamp duty, ISA, pension, and National Insurance calculators. Free, accurate, and up-to-date for 2024."
      />
      
      <div className="container mx-auto px-4 pt-6">
        <NativeBanner position="top" />
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MapPin className="h-8 w-8" />
              <Calculator className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">UK Financial Tools</h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Essential calculators for UK tax, property, and investment planning
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Receipt className="h-3 w-3 mr-1" />
                2024/25 Tax Year
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Home className="h-3 w-3 mr-1" />
                Property Tools
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <PiggyBank className="h-3 w-3 mr-1" />
                Pension Planning
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <AmazonAffiliate category="finance-uk" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ukCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {calc.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-blue-600 transition-colors">
                    {calc.title}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {calc.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Link to={calc.path}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white group">
                        Use Calculator
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mb-8">
          <NativeBanner position="middle" />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-blue-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-blue-600" />
            UK Financial Planning Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">Tax Planning</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Maximize ISA allowances for tax-free savings</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Understand National Insurance contributions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Claim pension tax relief efficiently</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-blue-600">Property Investment</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Calculate stamp duty for first-time buyers</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Assess buy-to-let rental yields</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span>Plan for Section 24 mortgage relief changes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <AmazonAffiliate category="investment-books" />
        </div>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-2xl">Why Use Our UK Calculators?</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">2024/25 Accurate</h3>
              <p className="text-sm text-gray-600">
                Updated with latest tax rates, NI thresholds, and allowances
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Property Tools</h3>
              <p className="text-sm text-gray-600">
                Calculate stamp duty, BTL returns, and property taxes
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Retirement Planning</h3>
              <p className="text-sm text-gray-600">
                Plan your pension with auto-enrolment and tax relief
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8">
          <NativeBanner position="bottom" />
        </div>
      </div>
    </div>
  );
};

export default UKToolsPage;
