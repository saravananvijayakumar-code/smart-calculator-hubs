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
  Car,
  TrendingUp,
  ArrowRight,
  MapPin,
  DollarSign,
  PiggyBank,
  Receipt
} from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';

import AmazonAffiliate from '../../components/ads/AmazonAffiliate';
import NativeBanner from '../../components/ads/NativeBanner';

const AustraliaToolsPage: React.FC = () => {
  const australiaCalculators = [
    {
      id: 'pay-calculator',
      title: 'Pay Calculator',
      description: 'ATO-accurate take-home pay calculator using PAYG Schedule 1 formulas for FY 2024-25 and 2025-26',
      icon: DollarSign,
      path: '/au/pay-calculator',
      category: 'Tax',
      features: ['PAYG withholding', 'Stage 3 tax cuts', 'HELP repayment', 'Medicare levy', 'MLS']
    },
    {
      id: 'bonus-tax',
      title: 'Bonus Tax Calculator',
      description: 'Calculate PAYG withholding on bonuses, commissions & back-pay using ATO Schedule 5 methods',
      icon: TrendingUp,
      path: '/au/bonus-tax',
      category: 'Tax',
      features: ['Schedule 5', 'Method A/B', 'Commission tax', 'Back-pay']
    },
    {
      id: 'student-loan',
      title: 'Student Loan Calculator',
      description: 'Project HELP/HECS debt payoff timeline with compulsory and voluntary repayments',
      icon: Receipt,
      path: '/au/student-loan',
      category: 'Tax',
      features: ['HELP repayment', 'Indexation', 'Payoff timeline', 'Voluntary payments']
    },
    {
      id: 'unused-leave',
      title: 'Unused Leave Calculator',
      description: 'Calculate tax withholding on unused annual leave and long service leave payments',
      icon: Calculator,
      path: '/au/unused-leave',
      category: 'Tax',
      features: ['Leave withholding', 'Back-pay', 'ATO Schedule 7', 'Termination']
    },
    {
      id: 'income-tax',
      title: 'Comprehensive Income Tax Calculator',
      description: 'Calculate your 2024-25 income tax, Medicare Levy, MLS, HELP debt, tax offsets, and get AI tax planning recommendations',
      icon: Receipt,
      path: '/calculators/australia/income-tax',
      category: 'Tax',
      features: ['Stage 3 tax cuts', 'Medicare Levy', 'HELP repayment', 'Tax offsets', 'AI insights']
    },
    {
      id: 'first-home-buyer-nsw',
      title: 'First Home Buyer Calculator NSW',
      description: 'Calculate total purchase costs, stamp duty concessions, FHOG grants, and government schemes for NSW first home buyers',
      icon: Home,
      path: '/calculators/australia/first-home-buyer-nsw',
      category: 'Property',
      features: ['Stamp duty exemption', 'FHOG $10k', 'FHLDS eligibility', 'NSW schemes']
    },
    {
      id: 'superannuation',
      title: 'Superannuation Calculator',
      description: 'Calculate your super balance at retirement and estimate pension income',
      icon: PiggyBank,
      path: '/calculators/australia/superannuation',
      category: 'Retirement',
      features: ['Super guarantee', 'Concessional caps', 'Age pension']
    },
    {
      id: 'property-tax',
      title: 'Property Tax Calculator',
      description: 'Calculate stamp duty, land tax, and property fees across Australian states',
      icon: Home,
      path: '/calculators/australia/property-tax',
      category: 'Property',
      features: ['State variations', 'First home buyer', 'Foreign buyer duty']
    },
    {
      id: 'cgt',
      title: 'Capital Gains Tax Calculator',
      description: 'Calculate CGT on asset sales including discount eligibility',
      icon: TrendingUp,
      path: '/calculators/australia/cgt',
      category: 'Tax',
      features: ['50% CGT discount', 'Cost base', 'Main residence exemption']
    },
    {
      id: 'fbt',
      title: 'Fringe Benefits Tax Calculator',
      description: 'Calculate FBT on employee benefits including car fringe benefits',
      icon: Car,
      path: '/calculators/australia/fbt',
      category: 'Tax',
      features: ['Car benefits', 'Statutory rates', 'Salary packaging']
    },
    {
      id: 'negative-gearing',
      title: 'Negative Gearing Calculator',
      description: 'Calculate tax benefits and cash flow from investment properties',
      icon: Receipt,
      path: '/calculators/australia/negative-gearing',
      category: 'Investment',
      features: ['Tax deductions', 'Rental yield', 'Cash flow analysis']
    }
  ];

  return (
    <>
      <SEOHead 
        title="Australia Financial Calculators - Super, CGT, Property Tax Tools"
        description="Complete collection of Australia-specific financial calculators including superannuation, capital gains tax, property tax, and negative gearing calculators. Free and ATO compliant."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
        {/* Native Banner 1 - Top */}
        <div className="container mx-auto px-4 pt-6">
          <NativeBanner position="top" />
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <MapPin className="h-8 w-8" />
                <DollarSign className="h-8 w-8" />
                <h1 className="text-4xl md:text-5xl font-bold">Australia Financial Tools</h1>
              </div>
              <p className="text-xl md:text-2xl text-green-100 mb-8">
                Comprehensive financial calculators for Australian residents - from super planning to tax optimization
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  ATO Compliant
                </Badge>
                <Badge variant="secondary" className="text-sm px-4 py-2">
                  2025-26 FY
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
                Essential Australia Financial Calculators
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Navigate the Australian financial system with our specialized calculators designed for Australian tax laws, 
                superannuation rules, and investment opportunities.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {australiaCalculators.map((calc) => {
                const IconComponent = calc.icon;
                return (
                  <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                          <IconComponent className="h-6 w-6 text-green-600" />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {calc.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-green-600 transition-colors">
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
                          <Button className="w-full bg-green-600 hover:bg-green-700 transition-colors">
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

        {/* Features Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Why Choose Our Australia Calculators?
              </h2>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      ATO Compliant Calculations
                    </h3>
                    <p className="text-gray-600">
                      All calculators follow current Australian Taxation Office rules and rates, 
                      ensuring accurate calculations for the 2025-26 financial year.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Calculator className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      State-Specific Variations
                    </h3>
                    <p className="text-gray-600">
                      Property tax calculators account for different state and territory rules, 
                      providing accurate calculations across Australia.
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
                      Superannuation Expertise
                    </h3>
                    <p className="text-gray-600">
                      Comprehensive super calculations including contribution caps, preservation ages, 
                      and retirement planning strategies.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <Home className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Property Investment Focus
                    </h3>
                    <p className="text-gray-600">
                      Specialized tools for property investors including negative gearing, 
                      capital gains, and tax optimization strategies.
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

        {/* Australian Tax System Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Australian Tax & Investment Landscape
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Superannuation</h3>
                  <p className="text-sm text-gray-600">Retirement savings system</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">CGT Discount</h3>
                  <p className="text-sm text-gray-600">50% discount on long-term gains</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">Negative Gearing</h3>
                  <p className="text-sm text-gray-600">Property investment strategy</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900">FBT</h3>
                  <p className="text-sm text-gray-600">Fringe benefits taxation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-green-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Optimize Your Australian Financial Strategy
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Use our comprehensive calculators to plan your super, minimize taxes, 
              and maximize investment returns in Australia. All tools are free and require no registration.
            </p>
            <Link to="/calculators/australia/superannuation">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                Try Superannuation Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AustraliaToolsPage;