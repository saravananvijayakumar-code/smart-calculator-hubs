
import { Calculator, Building2, Car, Home, GraduationCap, CreditCard, DollarSign, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AmazonAffiliate from '../../components/ads/AmazonAffiliate';
import NativeBanner from '../../components/ads/NativeBanner';

const calculators = [
  {
    title: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, total interest, and amortization schedules for US home loans.',
    icon: Home,
    path: '/calculator/mortgage',
    category: 'Real Estate',
    color: 'bg-blue-50 dark:bg-blue-950 text-blue-600'
  },
  {
    title: 'Loan Calculator',
    description: 'Calculate payments for personal loans, auto loans, and other installment loans.',
    icon: DollarSign,
    path: '/calculator/loan',
    category: 'Lending',
    color: 'bg-green-50 dark:bg-green-950 text-green-600'
  },
  {
    title: 'Federal Tax Calculator',
    description: 'Estimate your federal income tax liability and take-home pay for any tax year.',
    icon: FileText,
    path: '/calculator/federal-tax',
    category: 'Taxes',
    color: 'bg-red-50 dark:bg-red-950 text-red-600'
  },
  {
    title: 'State Tax Calculator',
    description: 'Calculate state income tax for all 50 states plus DC, with state-specific deductions.',
    icon: Calculator,
    path: '/calculator/state-tax',
    category: 'Taxes',
    color: 'bg-red-50 dark:bg-red-950 text-red-600'
  },
  {
    title: 'Loan Affordability Calculator',
    description: 'Determine how much you can afford to borrow based on your income and expenses.',
    icon: Home,
    path: '/calculator/loan-affordability',
    category: 'Real Estate',
    color: 'bg-blue-50 dark:bg-blue-950 text-blue-600'
  },
  {
    title: '401k Retirement Calculator',
    description: 'Plan your 401k contributions and estimate retirement savings with employer matching.',
    icon: Calendar,
    path: '/calculator/401k-retirement',
    category: 'Retirement',
    color: 'bg-purple-50 dark:bg-purple-950 text-purple-600'
  },
  {
    title: 'Student Loan Calculator',
    description: 'Calculate student loan payments with different repayment plans and forgiveness options.',
    icon: GraduationCap,
    path: '/calculator/student-loan',
    category: 'Education',
    color: 'bg-yellow-50 dark:bg-yellow-950 text-yellow-600'
  },
  {
    title: 'Auto Loan Calculator',
    description: 'Calculate car payments, total cost, and determine if an auto loan fits your budget.',
    icon: Car,
    path: '/calculator/auto-loan',
    category: 'Automotive',
    color: 'bg-orange-50 dark:bg-orange-950 text-orange-600'
  },
  {
    title: 'HELOC Calculator',
    description: 'Calculate Home Equity Line of Credit payments, available credit, and costs.',
    icon: Home,
    path: '/calculator/heloc',
    category: 'Real Estate',
    color: 'bg-blue-50 dark:bg-blue-950 text-blue-600'
  },
  {
    title: 'Business Loan Calculator',
    description: 'Calculate business loan payments and analyze debt service coverage ratios.',
    icon: Building2,
    path: '/calculator/business-loan',
    category: 'Business',
    color: 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600'
  },
  {
    title: 'Debt Consolidation Calculator',
    description: 'Compare debt consolidation options and calculate potential savings.',
    icon: CreditCard,
    path: '/calculator/debt-consolidation',
    category: 'Debt Management',
    color: 'bg-pink-50 dark:bg-pink-950 text-pink-600'
  },
  {
    title: 'Salary Calculator',
    description: 'Calculate take-home pay after federal and state taxes with detailed breakdown.',
    icon: DollarSign,
    path: '/calculator/salary',
    category: 'Payroll',
    color: 'bg-teal-50 dark:bg-teal-950 text-teal-600'
  }
];

const categories = [...new Set(calculators.map(calc => calc.category))];

export function USToolsPage() {
  return (
    <>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Native Banner 1 - Top */}
          <div className="mb-6">
            <NativeBanner position="top" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🇺🇸 United States Financial Calculators
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Specialized financial calculators designed for US residents, featuring tax laws, lending practices, 
              and financial products specific to the United States.
            </p>
          </div>

          {/* Native Banner 2 - Middle */}
          <div className="my-8">
            <NativeBanner position="middle" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-blue-600">{calculators.length}</div>
              <div className="text-sm text-muted-foreground">US Calculators</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-purple-600">50+</div>
              <div className="text-sm text-muted-foreground">States Supported</div>
            </div>
            <div className="text-center p-4 bg-card rounded-lg border">
              <div className="text-2xl font-bold text-orange-600">2025</div>
              <div className="text-sm text-muted-foreground">Tax Year</div>
            </div>
          </div>

          {/* Categories */}
          {categories.map((category, categoryIndex) => (
            <div key={category}>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                  {category === 'Real Estate' && <Home className="mr-2 h-6 w-6" />}
                  {category === 'Taxes' && <FileText className="mr-2 h-6 w-6" />}
                  {category === 'Lending' && <DollarSign className="mr-2 h-6 w-6" />}
                  {category === 'Retirement' && <Calendar className="mr-2 h-6 w-6" />}
                  {category === 'Education' && <GraduationCap className="mr-2 h-6 w-6" />}
                  {category === 'Automotive' && <Car className="mr-2 h-6 w-6" />}
                  {category === 'Business' && <Building2 className="mr-2 h-6 w-6" />}
                  {category === 'Debt Management' && <CreditCard className="mr-2 h-6 w-6" />}
                  {category === 'Payroll' && <DollarSign className="mr-2 h-6 w-6" />}
                  {category}
                </h2>
                
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {calculators
                    .filter(calc => calc.category === category)
                    .map((calculator, index) => {
                      const IconComponent = calculator.icon;
                      return (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${calculator.color}`}>
                                <IconComponent className="h-5 w-5" />
                              </div>
                              {calculator.title}
                            </CardTitle>
                            <CardDescription>{calculator.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button asChild className="w-full">
                              <Link to={calculator.path}>
                                <Calculator className="mr-2 h-4 w-4" />
                                Calculate Now
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
              

            </div>
          ))}

          {/* Amazon Affiliate Ad */}
          <div className="mb-8">
            <AmazonAffiliate />
          </div>

          {/* Native Banner 3 - Bottom */}
          <div className="mb-8">
            <NativeBanner position="bottom" />
          </div>

          {/* Footer Note */}
          <div className="mt-12 p-6 bg-muted rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">Why US-Specific Calculators?</h3>
            <p className="text-muted-foreground">
              These calculators are tailored for the United States financial system, incorporating federal and state tax codes, 
              typical lending practices, retirement account rules (401k, IRA), and US-specific financial products. 
              Results are more accurate for US residents compared to generic international calculators.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}