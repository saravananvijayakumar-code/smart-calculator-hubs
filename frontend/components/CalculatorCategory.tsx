// @ts-nocheck
import { Calculator, DollarSign, Heart, Globe, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppleStyleCard } from './AppleStyleCard';

export interface CalculatorItem {
  id: string;
  name: string;
  description: string;
  path: string;
  category: string;
  region?: string;
  featured?: boolean;
  popularity?: number;
}

export interface CalculatorCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  calculators: CalculatorItem[];
  color: string;
}

// Define all calculator data
export const CALCULATOR_DATA: CalculatorItem[] = [
  // Financial
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate monthly payments and total interest', path: '/calculator/mortgage', category: 'financial', featured: true, popularity: 95 },
  { id: 'loan', name: 'Loan Calculator', description: 'Calculate loan payments and amortization', path: '/calculator/loan', category: 'financial', featured: true, popularity: 88 },
  { id: 'investment', name: 'Investment Calculator', description: 'Calculate investment growth and returns', path: '/calculator/investment', category: 'financial', featured: true, popularity: 82 },
  { id: 'compound-interest', name: 'Compound Interest', description: 'Calculate compound interest growth', path: '/calculator/compound-interest', category: 'financial', popularity: 75 },
  { id: 'simple-interest', name: 'Simple Interest', description: 'Calculate simple interest earnings', path: '/calculator/simple-interest', category: 'financial', popularity: 65 },
  { id: 'roi', name: 'ROI Calculator', description: 'Calculate return on investment', path: '/calculator/roi', category: 'financial', popularity: 70 },
  { id: 'retirement', name: 'Retirement Calculator', description: 'Plan for retirement savings', path: '/calculator/retirement', category: 'financial', popularity: 85 },
  { id: 'credit-card-payoff', name: 'Credit Card Payoff', description: 'Calculate payoff time and interest', path: '/calculator/credit-card-payoff', category: 'financial', popularity: 78 },
  { id: 'emergency-fund', name: 'Emergency Fund', description: 'Calculate emergency fund needs', path: '/calculator/emergency-fund', category: 'financial', popularity: 60 },

  // Health
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index', path: '/calculator/bmi', category: 'health', featured: true, popularity: 92 },

  { id: 'weight-loss-steps', name: 'Weight Loss Steps', description: 'Calculate steps needed for weight loss', path: '/calculator/weight-loss-steps', category: 'health', popularity: 70 },

  // Math & Everyday
  { id: 'percentage', name: 'Percentage Calculator', description: 'Calculate percentages and ratios', path: '/calculator/percentage', category: 'math', featured: true, popularity: 90 },
  { id: 'age', name: 'Age Calculator', description: 'Calculate age in years, months, days', path: '/calculator/age', category: 'math', popularity: 75 },
  { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between different units', path: '/calculator/unit-converter', category: 'math', popularity: 80 },
  { id: 'tip', name: 'Tip Calculator', description: 'Calculate tips and bill splitting', path: '/calculator/tip', category: 'everyday', featured: true, popularity: 85 },
  { id: 'currency-converter', name: 'Currency Converter', description: 'Convert between currencies', path: '/calculator/currency-converter', category: 'everyday', featured: true, popularity: 88 },

  // US-specific
  { id: 'federal-tax', name: 'Federal Tax Calculator', description: 'Calculate US federal income tax', path: '/calculator/federal-tax', category: 'financial', region: 'us', popularity: 85 },
  { id: 'state-tax', name: 'State Tax Calculator', description: 'Calculate state income tax', path: '/calculator/state-tax', category: 'financial', region: 'us', popularity: 75 },
  { id: '401k-retirement', name: '401(k) Calculator', description: 'Calculate 401(k) retirement savings', path: '/calculator/401k-retirement', category: 'financial', region: 'us', popularity: 80 },
  { id: 'student-loan', name: 'Student Loan Calculator', description: 'Calculate student loan payments', path: '/calculator/student-loan', category: 'financial', region: 'us', popularity: 78 },
  { id: 'auto-loan', name: 'Auto Loan Calculator', description: 'Calculate car loan payments', path: '/calculator/auto-loan', category: 'financial', region: 'us', popularity: 70 },
  { id: 'heloc', name: 'HELOC Calculator', description: 'Calculate home equity line of credit', path: '/calculator/heloc', category: 'financial', region: 'us', popularity: 65 },
  { id: 'business-loan', name: 'Business Loan Calculator', description: 'Calculate business loan payments', path: '/calculator/business-loan', category: 'financial', region: 'us', popularity: 60 },
  { id: 'debt-consolidation', name: 'Debt Consolidation', description: 'Calculate debt consolidation savings', path: '/calculator/debt-consolidation', category: 'financial', region: 'us', popularity: 68 },
  { id: 'loan-affordability', name: 'Loan Affordability', description: 'Calculate maximum affordable loan', path: '/calculator/loan-affordability', category: 'financial', region: 'us', popularity: 72 },

  // UK-specific
  { id: 'stamp-duty', name: 'Stamp Duty Calculator', description: 'Calculate UK stamp duty tax', path: '/calculators/uk/stamp-duty', category: 'financial', region: 'uk', popularity: 85 },
  { id: 'isa', name: 'ISA Calculator', description: 'Calculate ISA savings growth', path: '/calculators/uk/isa', category: 'financial', region: 'uk', popularity: 75 },
  { id: 'national-insurance', name: 'National Insurance Calculator', description: 'Calculate NI contributions', path: '/calculators/uk/national-insurance', category: 'financial', region: 'uk', popularity: 80 },
  { id: 'pension', name: 'Pension Calculator', description: 'Calculate pension contributions', path: '/calculators/uk/pension', category: 'financial', region: 'uk', popularity: 78 },
  { id: 'btl-mortgage', name: 'Buy-to-Let Mortgage', description: 'Calculate BTL mortgage payments', path: '/calculators/uk/btl-mortgage', category: 'financial', region: 'uk', popularity: 70 },

  // India-specific
  { id: 'epf', name: 'EPF Calculator', description: 'Calculate Employee Provident Fund', path: '/calculators/india/epf', category: 'financial', region: 'india', popularity: 85 },
  { id: 'sip', name: 'SIP Calculator', description: 'Calculate SIP investment returns', path: '/calculators/india/sip', category: 'financial', region: 'india', popularity: 88 },
  { id: 'income-tax', name: 'Income Tax Calculator', description: 'Calculate Indian income tax', path: '/calculators/india/income-tax', category: 'financial', region: 'india', popularity: 90 },
  { id: 'ppf', name: 'PPF Calculator', description: 'Calculate Public Provident Fund', path: '/calculators/india/ppf', category: 'financial', region: 'india', popularity: 80 },
  { id: 'home-loan', name: 'Home Loan Calculator', description: 'Calculate home loan EMI', path: '/calculators/india/home-loan', category: 'financial', region: 'india', popularity: 82 },

  // Australia-specific
  { id: 'superannuation', name: 'Superannuation Calculator', description: 'Calculate super contributions', path: '/calculators/australia/superannuation', category: 'financial', region: 'australia', popularity: 85 },
  { id: 'property-tax', name: 'Property Tax Calculator', description: 'Calculate property tax', path: '/calculators/australia/property-tax', category: 'financial', region: 'australia', popularity: 75 },
  { id: 'cgt', name: 'CGT Calculator', description: 'Calculate capital gains tax', path: '/calculators/australia/cgt', category: 'financial', region: 'australia', popularity: 78 },
  { id: 'fbt', name: 'FBT Calculator', description: 'Calculate fringe benefits tax', path: '/calculators/australia/fbt', category: 'financial', region: 'australia', popularity: 65 },
  { id: 'negative-gearing', name: 'Negative Gearing Calculator', description: 'Calculate negative gearing benefits', path: '/calculators/australia/negative-gearing', category: 'financial', region: 'australia', popularity: 70 },
];

// Define categories
export const CALCULATOR_CATEGORIES: CalculatorCategory[] = [
  {
    id: 'financial',
    name: 'Financial Calculators',
    description: 'Mortgage, loans, investments, and retirement planning tools',
    icon: DollarSign,
    color: 'from-green-500 to-emerald-600',
    calculators: CALCULATOR_DATA.filter(calc => calc.category === 'financial' && !calc.region)
  },
  {
    id: 'health',
    name: 'Health & Fitness',
    description: 'BMI, calorie, and health-related calculators',
    icon: Heart,
    color: 'from-red-500 to-pink-600',
    calculators: CALCULATOR_DATA.filter(calc => calc.category === 'health')
  },
  {
    id: 'math',
    name: 'Math & Science',
    description: 'Percentage, unit conversion, and mathematical tools',
    icon: Calculator,
    color: 'from-blue-500 to-indigo-600',
    calculators: CALCULATOR_DATA.filter(calc => calc.category === 'math')
  },
  {
    id: 'everyday',
    name: 'Everyday Tools',
    description: 'Tip calculator, currency converter, and daily utilities',
    icon: Globe,
    color: 'from-purple-500 to-violet-600',
    calculators: CALCULATOR_DATA.filter(calc => calc.category === 'everyday')
  },
  {
    id: 'regional',
    name: 'Regional Tools',
    description: 'Country-specific calculators for US, UK, India, and Australia',
    icon: MapPin,
    color: 'from-orange-500 to-red-600',
    calculators: CALCULATOR_DATA.filter(calc => calc.region)
  }
];

interface CalculatorCategoryGridProps {
  showAll?: boolean;
  limit?: number;
  excludeCategory?: string;
}

export function CalculatorCategoryGrid({ showAll = false, limit = 4, excludeCategory }: CalculatorCategoryGridProps) {
  const categories = CALCULATOR_CATEGORIES.filter(cat => cat.id !== excludeCategory);
  const displayCategories = showAll ? categories : categories.slice(0, limit);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {displayCategories.map((category) => {
        const Icon = category.icon;
        return (
          <Link key={category.id} to={`/${category.id}/tools`}>
            <AppleStyleCard className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    {category.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {category.calculators.length} calculators
                  </p>
                </div>
              </div>
            </AppleStyleCard>
          </Link>
        );
      })}
    </div>
  );
}