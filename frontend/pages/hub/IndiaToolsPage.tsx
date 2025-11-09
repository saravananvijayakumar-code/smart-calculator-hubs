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

  const categories = ['All', 'Tax', 'Investment', 'Loans', 'Retirement', 'Tax Saving', 'Property'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <SEOHead 
        title="India Financial Calculators - Tax, SIP, EPF & Investment Tools"
        description="Complete collection of India-specific financial calculators including income tax, SIP, EPF, PPF, and home loan calculators. Free, accurate, and updated for FY 2024-25."
      />
      
      <div className="container mx-auto px-4 pt-6">
        <NativeBanner position="top" />
      </div>

      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <MapPin className="h-8 w-8" />
              <Banknote className="h-8 w-8" />
              <h1 className="text-4xl md:text-5xl font-bold">India Financial Tools</h1>
            </div>
            <p className="text-xl md:text-2xl text-orange-100 mb-8">
              Comprehensive calculators for Indian taxes, investments, and financial planning
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Receipt className="h-3 w-3 mr-1" />
                FY 2024-25 Updated
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <Shield className="h-3 w-3 mr-1" />
                Tax Compliant
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                <BarChart3 className="h-3 w-3 mr-1" />
                Investment Ready
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <AmazonAffiliate category="finance-india" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {indiaCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Card key={calc.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-orange-500">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {calc.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mb-2 group-hover:text-orange-600 transition-colors">
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
                        <Badge key={idx} variant="secondary" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    <Link to={calc.path}>
                      <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white group">
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

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border-2 border-orange-100">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600" />
            India Financial Planning Guide
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg mb-3 text-orange-600">Tax Planning</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Compare old vs new tax regime for maximum savings</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Utilize Section 80C, 80D deductions effectively</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Plan investments for tax-free returns</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3 text-orange-600">Investment Strategy</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Start SIPs for long-term wealth creation</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Maximize EPF contributions for retirement</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                  <span>Balance PPF and mutual funds for diversification</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <AmazonAffiliate category="investment-books" />
        </div>

        <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200">
          <CardHeader>
            <CardTitle className="text-2xl">Why Use Our India Calculators?</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">FY 2024-25 Accurate</h3>
              <p className="text-sm text-gray-600">
                Updated with latest tax slabs, GST rates, and investment limits
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Tax Compliant</h3>
              <p className="text-sm text-gray-600">
                Calculations follow Income Tax Act and GST regulations
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Investment Insights</h3>
              <p className="text-sm text-gray-600">
                Plan your SIPs, EPF, and PPF for optimal returns
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

export default IndiaToolsPage;
