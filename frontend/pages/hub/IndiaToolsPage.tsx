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
  Shield,
  BarChart3,
  TrendingUp,
  ArrowRight,
  MapPin,
  DollarSign,
  PiggyBank,
  Banknote,
  Receipt
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

import AmazonAffiliate from '../../components/ads/AmazonAffiliate';
import NativeBanner from '../../components/ads/NativeBanner';

const IndiaToolsPage: React.FC = () => {
  const indiaCalculators = [
    {
      id: 'emi',
      title: 'EMI Calculator',
      description: 'Calculate Equated Monthly Installment for home, car, and personal loans',
      icon: Banknote,
      path: '/calculators/india/emi',
      category: 'Loans',
      features: ['EMI calculation', 'Amortization schedule', 'Tax benefits']
    },
    {
      id: 'epf',
      title: 'EPF Calculator',
      description: 'Calculate Employee Provident Fund maturity amount and retirement benefits',
      icon: PiggyBank,
      path: '/calculators/india/epf',
      category: 'Retirement',
      features: ['PF contributions', 'Interest calculation', 'Tax benefits']
    },
    {
      id: 'sip',
      title: 'SIP Calculator',
      description: 'Calculate Systematic Investment Plan returns and wealth creation potential',
      icon: BarChart3,
      path: '/calculators/india/sip',
      category: 'Investment',
      features: ['Mutual funds', 'Rupee cost averaging', 'Step-up SIPs']
    },
    {
      id: 'income-tax',
      title: 'Income Tax Calculator',
      description: 'Calculate income tax liability under both old and new tax regimes',
      icon: Receipt,
      path: '/calculators/india/income-tax',
      category: 'Tax',
      features: ['FY 2024-25', 'Regime comparison', 'Deductions']
    },
    {
      id: 'gst',
      title: 'GST Calculator',
      description: 'Calculate GST, CGST, SGST, and IGST for your business transactions',
      icon: Calculator,
      path: '/calculators/india/gst',
      category: 'Tax',
      features: ['CGST/SGST/IGST', 'All GST rates', 'Inclusive/Exclusive']
    },
    {
      id: 'ppf',
      title: 'PPF Calculator',
      description: 'Calculate Public Provident Fund maturity amount and tax benefits',
      icon: Shield,
      path: '/calculators/india/ppf',
      category: 'Tax Saving',
      features: ['15-year lock-in', 'Tax-free returns', 'EEE status']
    },
    {
      id: 'home-loan',
      title: 'Home Loan Calculator',
      description: 'Calculate home loan EMI, tax benefits, and total costs in India',
      icon: Home,
      path: '/calculators/india/home-loan',
      category: 'Property',
      features: ['EMI calculation', 'Section 80C & 24', 'Interest rates']
    }
  ];

  return (
    <>
      <SEOHead 
        title="India Financial Calculators - Tax, SIP, EPF & Investment Tools"
        description="Complete collection of India-specific financial calculators including income tax, SIP, EPF, PPF, and home loan calculators. Free, accurate, and updated for FY 2024-25."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        {/* Native Banner 1 - Top */}
        <div className="container mx-auto px-4 pt-6">
          <NativeBanner position="top" />
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <MapPin className="h-8 w-8" />
                <Banknote className="h-8 w-8" />
                <h1 className="text-4xl md:text-5xl font-bold">India Financial Tools</h1>
              </div>
              <p className="text-xl md:text-2xl text-orange-100 mb-8">
                Comprehensive financial calculators for Indian investors - from tax planning to wealth creation
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  IT Act Compliant
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  FY 2024-25
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
                Essential India Financial Calculators
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Navigate the Indian financial system with our specialized calculators designed for Indian tax laws, 
                investment options, and financial planning strategies.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {indiaCalculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                          <IconComponent className="h-6 w-6 text-orange-600" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {calc.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-orange-600 transition-colors">
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
                          <Button className="w-full bg-orange-600 hover:bg-orange-700 transition-colors">
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
                Why Choose Our India Calculators?
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Income Tax Act Compliant
                    </h3>
                    <p className="text-gray-600">
                      All calculators follow current Income Tax Act provisions and rates, ensuring accurate 
                      calculations for FY 2024-25.
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
                      Comprehensive Investment Planning
                    </h3>
                    <p className="text-gray-600">
                      From SIPs to PPF, our calculators cover all major Indian investment instruments 
                      with detailed projections and tax implications.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Retirement Planning Focus
                    </h3>
                    <p className="text-gray-600">
                      Specialized tools for EPF, PPF, and other retirement schemes help you plan 
                      for a secure financial future in India.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Receipt className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Tax Regime Comparison
                    </h3>
                    <p className="text-gray-600">
                      Compare old vs new tax regimes, optimize deductions, and understand 
                      the impact of various tax-saving investments.
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

        {/* Popular Investment Schemes Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Popular Indian Investment Schemes Covered
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">EPF/PF</h3>
                  <p className="text-sm text-gray-600">Employee Provident Fund</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">PPF</h3>
                  <p className="text-sm text-gray-600">Public Provident Fund</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">SIP</h3>
                  <p className="text-sm text-gray-600">Systematic Investment Plan</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">ELSS</h3>
                  <p className="text-sm text-gray-600">Tax Saving Mutual Funds</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-orange-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Start Your Wealth Creation Journey
            </h2>
            <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
              Use our comprehensive calculators to plan your investments, save taxes, 
              and build wealth in India. All tools are free and require no registration.
            </p>
            <Link to="/calculators/india/sip">
              <Button size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                Try SIP Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default IndiaToolsPage;