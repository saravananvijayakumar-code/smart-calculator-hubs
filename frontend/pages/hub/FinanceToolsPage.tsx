import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Wallet, CreditCard, Building, DollarSign } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../components/CalculatorLayoutWithAds';

const financeCalculators = [
  {
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, total interest, and amortization schedules',
    path: '/calculator/mortgage',
    icon: Building,
    category: 'Real Estate'
  },
  {
    name: 'Loan Calculator',
    description: 'Calculate loan payments for personal, auto, or business loans',
    path: '/calculator/loan',
    icon: Calculator,
    category: 'Loans'
  },
  {
    name: 'Investment Calculator',
    description: 'Calculate returns on investments with compound interest',
    path: '/calculator/investment',
    icon: TrendingUp,
    category: 'Investments'
  },
  {
    name: 'Simple Interest Calculator',
    description: 'Calculate simple interest on loans and investments',
    path: '/calculator/simple-interest',
    icon: Calculator,
    category: 'Interest'
  },
  {
    name: 'Compound Interest Calculator',
    description: 'Calculate compound interest and see the power of compounding',
    path: '/calculator/compound-interest',
    icon: TrendingUp,
    category: 'Interest'
  },
  {
    name: 'ROI Calculator',
    description: 'Calculate return on investment for business and financial decisions',
    path: '/calculator/roi',
    icon: TrendingUp,
    category: 'Investments'
  },
  {
    name: 'Retirement Calculator',
    description: 'Plan for retirement and calculate required savings',
    path: '/calculator/retirement',
    icon: Wallet,
    category: 'Planning'
  },
  {
    name: 'Credit Card Payoff Calculator',
    description: 'Calculate how long it will take to pay off credit card debt',
    path: '/calculator/credit-card-payoff',
    icon: CreditCard,
    category: 'Debt'
  },
  {
    name: 'Emergency Fund Calculator',
    description: 'Calculate how much you need in your emergency fund',
    path: '/calculator/emergency-fund',
    icon: Wallet,
    category: 'Planning'
  },
  {
    name: 'Profit Margin Calculator',
    description: 'Calculate gross, operating, and net profit margins for your business',
    path: '/calculator/profit-margin',
    icon: TrendingUp,
    category: 'Business'
  },
  {
    name: 'Paycheck Calculator',
    description: 'Calculate take-home pay after federal tax, state tax, and all deductions',
    path: '/calculator/paycheck',
    icon: DollarSign,
    category: 'Salary'
  }
];

export const FinanceToolsPage = () => {
  return (
    <CalculatorLayoutWithAds
      title="Financial Calculators & Tools"
      description="Comprehensive collection of financial calculators for mortgages, loans, investments, retirement planning, and more. Make informed financial decisions with our easy-to-use tools."
      keywords="financial calculators, mortgage calculator, loan calculator, investment calculator, retirement planning, financial planning"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Financial Calculators & Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make informed financial decisions with our comprehensive collection of calculators. 
            From mortgages and loans to retirement planning and investments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financeCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.path}
                to={calc.path}
                className="block bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 rounded-lg p-3 mr-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{calc.name}</h3>
                    <span className="text-sm text-blue-600 font-medium">{calc.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {calc.description}
                </p>
                <div className="mt-4 text-blue-600 text-sm font-medium">
                  Calculate now →
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 bg-gray-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Our Financial Calculators?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Accurate Calculations</h3>
              <p className="text-gray-600">
                Our calculators use industry-standard formulas to provide precise results for your financial planning.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy to Use</h3>
              <p className="text-gray-600">
                Simple, intuitive interfaces that make complex financial calculations accessible to everyone.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Results</h3>
              <p className="text-gray-600">
                Get detailed breakdowns, charts, and explanations to help you understand your financial situation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Free to Use</h3>
              <p className="text-gray-600">
                All our financial calculators are completely free with no hidden fees or registration required.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
};