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
    <>
      <SEOHead 
        title="UK Financial Calculators - Tax, Property & Investment Tools"
        description="Comprehensive collection of UK-specific financial calculators including stamp duty, ISA, pension, and National Insurance calculators. Free, accurate, and up-to-date for 2024."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        {/* Native Banner 1 - Top */}
        <div className="container mx-auto px-4 pt-6">
          <NativeBanner position="top" />
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <MapPin className="h-8 w-8" />
                <h1 className="text-4xl md:text-5xl font-bold">UK Financial Tools</h1>
              </div>
              <p className="text-xl md:text-2xl text-blue-100 mb-8">
                Comprehensive financial calculators for UK residents - from tax planning to property investment
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  HMRC Compliant
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  2024/25 Tax Year
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  Free to Use
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Calculators Grid */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Essential UK Financial Calculators
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Navigate the UK financial landscape with our specialized calculators designed for British tax laws, 
                regulations, and investment opportunities.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {ukCalculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {calc.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {calc.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {calc.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {calc.features.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                        <Link to={calc.path} className="block">
                          <Button className="w-full group-hover:bg-blue-700 transition-colors">
                            Calculate Now
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Native Banner 2 - Middle */}
        <div className="container mx-auto px-4 py-8">
          <NativeBanner position="middle" />
        </div>

        {/* Features Section */>
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Choose Our UK Calculators?
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      HMRC Compliant Calculations
                    </h3>
                    <p className="text-gray-600">
                      All calculators use current HMRC rates and thresholds, ensuring accurate tax calculations 
                      for the 2024/25 tax year and beyond.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Calculator className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Comprehensive Analysis
                    </h3>
                    <p className="text-gray-600">
                      Get detailed breakdowns with explanations, helping you understand not just the numbers 
                      but the reasoning behind them.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Wallet className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Tax Planning Insights
                    </h3>
                    <p className="text-gray-600">
                      Discover tax-efficient strategies and understand how different financial decisions 
                      impact your overall tax position.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Receipt className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Regular Updates
                    </h3>
                    <p className="text-gray-600">
                      Our calculators are updated promptly following Budget announcements and HMRC guidance 
                      changes to maintain accuracy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amazon Affiliate Ad */}
        <div className="container mx-auto px-4 py-8">
          <AmazonAffiliate />
        </div>

        {/* Native Banner 3 - Bottom */}
        <div className="container mx-auto px-4 py-8">
          <NativeBanner position="bottom" />
        </div>

        {/* CTA Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Planning Your UK Financial Future
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Use our comprehensive calculators to make informed decisions about taxes, investments, 
              and property in the UK. All tools are free and require no registration.
            </p>
            <Link to="/calculators/uk/stamp-duty">
              <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-gray-100">
                Try Stamp Duty Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default UKToolsPage;