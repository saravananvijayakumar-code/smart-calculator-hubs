import { Link, useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, Heart, Wrench, ArrowRight, DollarSign, Search, Instagram, Home, Car, BarChart3, Wallet, Activity, Palmtree, Shield, Flame, Clock, Bot, Globe } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SEOHead } from '../components/SEOHead';
import { AdsterraSlot } from '../components/ads/AdsterraSlot';
import { CalculatorSearch } from '../components/CalculatorSearch';
import { useState, useMemo, useEffect, useRef } from 'react';
import { backgroundPrefetch } from '../utils/backgroundPrefetch';

const calculatorCategories = [
  {
    title: 'Finder Tools',
    description: 'Discover and explore with powerful finder tools',
    icon: Search,
    path: '/finder/tools',
    calculators: [
      { name: 'Calorie Burn Calculator', path: '/calculators/viral/calorie-burn' }
    ],
    color: 'bg-red-500'
  },
  {
    title: 'Financial Calculators',
    description: 'Professional financial planning and investment tools',
    icon: TrendingUp,
    path: '/finance/tools',
    calculators: [
      { name: 'Mortgage Calculator', path: '/calculator/mortgage' },
      { name: 'Investment Calculator', path: '/calculator/investment' },
      { name: 'Retirement Calculator', path: '/calculator/retirement' },
      { name: 'Loan Calculator', path: '/calculator/loan' }
    ],
    color: 'bg-blue-500'
  },
  {
    title: 'Health & Fitness',
    description: 'Track your health metrics and fitness goals',
    icon: Heart,
    path: '/health/tools',
    calculators: [
      { name: 'BMI Calculator', path: '/calculator/bmi' },

      { name: 'Weight Loss Steps', path: '/calculator/weight-loss-steps' }
    ],
    color: 'bg-green-500'
  },
  {
    title: 'Insurance Calculators',
    description: 'Estimate insurance premiums and coverage needs',
    icon: Shield,
    path: '/insurance/tools',
    calculators: [
      { name: 'Car Insurance', path: '/calculator/car-insurance-premium' },
      { name: 'Health Insurance', path: '/calculators/insurance/health' },
      { name: 'Life Insurance', path: '/calculators/insurance/life' }
    ],
    color: 'bg-emerald-500'
  },
  {
    title: 'Viral & Fun Tools',
    description: 'Trending calculators everyone is sharing',
    icon: Flame,
    path: '/viral/tools',
    calculators: [
      { name: 'Love Compatibility', path: '/calculators/viral/love-compatibility' },
      { name: 'Zodiac Match', path: '/calculators/viral/zodiac-compatibility' },
      { name: 'Life Path Number', path: '/calculators/viral/life-path-number' }
    ],
    color: 'bg-orange-500'
  },
  {
    title: 'Math & Science',
    description: 'Essential mathematical calculations made simple',
    icon: Calculator,
    path: '/math/tools',
    calculators: [
      { name: 'Percentage Calculator', path: '/calculator/percentage' },
      { name: 'Age Calculator', path: '/calculator/age' },
      { name: 'Unit Converter', path: '/calculator/unit-converter' }
    ],
    color: 'bg-purple-500'
  },
  {
    title: 'SmartTimer Suite',
    description: 'Productivity timers and countdown tools',
    icon: Clock,
    path: '/smarttimer',
    calculators: [
      { name: 'Stopwatch', path: '/smarttimer/stopwatch' },
      { name: 'Pomodoro Timer', path: '/smarttimer/pomodoro' },
      { name: 'Event Countdown', path: '/smarttimer/event' }
    ],
    color: 'bg-indigo-500'
  },
  {
    title: 'AI-Powered Tools',
    description: 'Intelligent tools powered by artificial intelligence',
    icon: Bot,
    path: '/ai/social',
    calculators: [
      { name: 'AI Text Detector', path: '/ai/ai-text-detector' },
      { name: 'Profile Analyzer', path: '/ai/social' },
      { name: 'Caption Generator', path: '/ai/social' }
    ],
    color: 'bg-violet-500'
  },
  {
    title: 'Utility Tools',
    description: 'Everyday calculators for practical tasks',
    icon: Wrench,
    path: '/utility/tools',
    calculators: [
      { name: 'Tip Calculator', path: '/calculator/tip' },
      { name: 'Currency Converter', path: '/calculator/currency-converter' }
    ],
    color: 'bg-amber-500'
  }
];

const countrySpecificCategories = [
  {
    title: 'United States 🇺🇸',
    description: 'US-specific tax, loan, and retirement calculators',
    path: '/us/tools',
    icon: '🇺🇸',
    color: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200'
  },
  {
    title: 'United Kingdom 🇬🇧',
    description: 'UK tax, pension, and stamp duty calculators',
    path: '/uk/tools',
    icon: '🇬🇧',
    color: 'bg-red-50 dark:bg-red-950/20 border-red-200'
  },
  {
    title: 'India 🇮🇳',
    description: 'EPF, SIP, GST, and income tax calculators',
    path: '/india/tools',
    icon: '🇮🇳',
    color: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200'
  },
  {
    title: 'Australia 🇦🇺',
    description: 'Superannuation, CGT, and property calculators',
    path: '/australia/tools',
    icon: '🇦🇺',
    color: 'bg-green-50 dark:bg-green-950/20 border-green-200'
  }
];

const featuredCalculators = [
  {
    name: 'Legal Settlement Estimator',
    description: 'Estimate personal injury settlement value with state-specific caps and multipliers',
    path: '/calculator/legal-settlement',
    icon: DollarSign,
    category: 'Legal',
    badge: 'Premium'
  },
  {
    name: 'Solar Savings Calculator',
    description: 'Calculate solar panel ROI, payback period, and 25-year savings in Australia',
    path: '/calculator/solar-savings',
    icon: TrendingUp,
    category: 'Energy',
    badge: 'Premium'
  },
  {
    name: 'Car Insurance Premium Estimator',
    description: 'Estimate car insurance costs with no-claim bonuses and coverage comparisons',
    path: '/calculator/car-insurance-premium',
    icon: Car,
    category: 'Insurance',
    badge: 'Premium'
  },
  {
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, total interest, and amortization schedules',
    path: '/calculator/mortgage',
    icon: Home,
    category: 'Loans & Debt'
  },
  {
    name: '401k Calculator',
    description: 'Plan your retirement savings with employer match calculations',
    path: '/calculator/401k-retirement',
    icon: BarChart3,
    category: 'Investing'
  },
  {
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and understand your weight category',
    path: '/calculator/bmi',
    icon: Activity,
    category: 'Health'
  }
];

// All available calculators for search
const allCalculators = [
  // Core Finance Calculators
  { name: 'Mortgage Calculator', path: '/calculator/mortgage', category: 'Finance', keywords: ['mortgage', 'home', 'loan', 'house', 'payment'] },
  { name: 'Investment Calculator', path: '/calculator/investment', category: 'Finance', keywords: ['investment', 'compound', 'interest', 'returns', 'portfolio'] },
  { name: 'Retirement Calculator', path: '/calculator/retirement', category: 'Finance', keywords: ['retirement', 'pension', 'savings', 'future'] },
  { name: 'Loan Calculator', path: '/calculator/loan', category: 'Finance', keywords: ['loan', 'personal', 'payment'] },
  { name: 'Compound Interest Calculator', path: '/calculator/compound-interest', category: 'Finance', keywords: ['compound', 'interest', 'savings', 'growth'] },
  { name: 'Simple Interest Calculator', path: '/calculator/simple-interest', category: 'Finance', keywords: ['simple', 'interest', 'loan', 'principal'] },
  { name: 'Credit Card Payoff Calculator', path: '/calculator/credit-card-payoff', category: 'Finance', keywords: ['credit', 'card', 'debt', 'payoff', 'minimum'] },
  { name: 'Emergency Fund Calculator', path: '/calculator/emergency-fund', category: 'Finance', keywords: ['emergency', 'fund', 'savings', 'expenses'] },
  { name: 'ROI Calculator', path: '/calculator/roi', category: 'Finance', keywords: ['roi', 'return', 'investment', 'profit'] },
  { name: 'Profit Margin Calculator', path: '/calculator/profit-margin', category: 'Finance', keywords: ['profit', 'margin', 'gross', 'operating', 'net', 'business', 'profitability'] },
  { name: 'Paycheck Calculator', path: '/calculator/paycheck', category: 'Finance', keywords: ['paycheck', 'calculator', 'after', 'taxes', 'biweekly', 'net', 'pay', 'check', 'take', 'home'] },
  
  // US-Specific Calculators
  { name: 'Federal Tax Calculator', path: '/calculator/federal-tax', category: 'US Finance', keywords: ['federal', 'tax', 'income', 'usa', 'irs'] },
  { name: 'State Tax Calculator', path: '/calculator/state-tax', category: 'US Finance', keywords: ['state', 'tax', 'income', 'usa'] },
  { name: '401k Retirement Calculator', path: '/calculator/401k-retirement', category: 'US Finance', keywords: ['401k', 'retirement', 'usa', 'employer', 'match'] },
  { name: 'Loan Affordability Calculator', path: '/calculator/loan-affordability', category: 'US Finance', keywords: ['affordability', 'loan', 'qualify', 'income'] },
  { name: 'Student Loan Calculator', path: '/calculator/student-loan', category: 'US Finance', keywords: ['student', 'loan', 'education', 'college', 'university'] },
  { name: 'Auto Loan Calculator', path: '/calculator/auto-loan', category: 'US Finance', keywords: ['auto', 'car', 'loan', 'vehicle', 'financing'] },
  { name: 'HELOC Calculator', path: '/calculator/heloc', category: 'US Finance', keywords: ['heloc', 'equity', 'line', 'credit', 'home'] },
  { name: 'Business Loan Calculator', path: '/calculator/business-loan', category: 'US Finance', keywords: ['business', 'loan', 'commercial', 'sba'] },
  { name: 'Debt Consolidation Calculator', path: '/calculator/debt-consolidation', category: 'US Finance', keywords: ['debt', 'consolidation', 'refinance', 'combine'] },
  
  // UK-Specific Calculators
  { name: 'Stamp Duty Calculator', path: '/calculators/uk/stamp-duty', category: 'UK Finance', keywords: ['stamp', 'duty', 'property', 'uk', 'tax'] },
  { name: 'ISA Calculator', path: '/calculators/uk/isa', category: 'UK Finance', keywords: ['isa', 'savings', 'uk', 'tax', 'free'] },
  { name: 'National Insurance Calculator', path: '/calculators/uk/national-insurance', category: 'UK Finance', keywords: ['national', 'insurance', 'ni', 'uk', 'contributions'] },
  { name: 'Pension Calculator', path: '/calculators/uk/pension', category: 'UK Finance', keywords: ['pension', 'uk', 'retirement', 'workplace'] },
  { name: 'BTL Mortgage Calculator', path: '/calculators/uk/btl-mortgage', category: 'UK Finance', keywords: ['btl', 'buy', 'let', 'mortgage', 'rental', 'uk'] },
  
  // India-Specific Calculators
  { name: 'EMI Calculator India', path: '/calculators/india/emi', category: 'India Finance', keywords: ['emi', 'calculator', 'india', 'home', 'loan', 'car', 'personal', 'equated', 'monthly', 'installment'] },
  { name: 'EPF Calculator', path: '/calculators/india/epf', category: 'India Finance', keywords: ['epf', 'provident', 'fund', 'india', 'pf'] },
  { name: 'SIP Calculator', path: '/calculators/india/sip', category: 'India Finance', keywords: ['sip', 'systematic', 'investment', 'plan', 'india', 'mutual'] },
  { name: 'Income Tax Calculator', path: '/calculators/india/income-tax', category: 'India Finance', keywords: ['income', 'tax', 'india', 'itr', 'calculation'] },
  { name: 'GST Calculator', path: '/calculators/india/gst', category: 'India Finance', keywords: ['gst', 'goods', 'services', 'tax', 'india', 'cgst', 'sgst', 'igst'] },
  { name: 'PPF Calculator', path: '/calculators/india/ppf', category: 'India Finance', keywords: ['ppf', 'public', 'provident', 'fund', 'india'] },
  { name: 'Home Loan Calculator', path: '/calculators/india/home-loan', category: 'India Finance', keywords: ['home', 'loan', 'india', 'housing', 'emi'] },
  
  // Australia-Specific Calculators
  { name: 'First Home Buyer Calculator NSW', path: '/calculators/australia/first-home-buyer-nsw', category: 'Australia Finance', keywords: ['first', 'home', 'buyer', 'nsw', 'fhb', 'stamp', 'duty', 'fhog', 'grant', 'australia', 'sydney'] },
  { name: 'Superannuation Calculator', path: '/calculators/australia/superannuation', category: 'Australia Finance', keywords: ['superannuation', 'super', 'australia', 'retirement'] },
  { name: 'Property Tax Calculator', path: '/calculators/australia/property-tax', category: 'Australia Finance', keywords: ['property', 'tax', 'australia', 'council', 'rates'] },
  { name: 'Capital Gains Tax Calculator', path: '/calculators/australia/cgt', category: 'Australia Finance', keywords: ['capital', 'gains', 'tax', 'cgt', 'australia'] },
  { name: 'FBT Calculator', path: '/calculators/australia/fbt', category: 'Australia Finance', keywords: ['fbt', 'fringe', 'benefits', 'tax', 'australia'] },
  { name: 'Negative Gearing Calculator', path: '/calculators/australia/negative-gearing', category: 'Australia Finance', keywords: ['negative', 'gearing', 'australia', 'investment', 'property'] },
  
  // Health Calculators
  { name: 'BMI Calculator', path: '/calculator/bmi', category: 'Health', keywords: ['bmi', 'body', 'mass', 'index', 'weight', 'height'] },
  { name: 'Calorie Calculator', path: '/calculator/calorie', category: 'Health', keywords: ['calorie', 'calories', 'bmr', 'metabolism', 'weight', 'loss', 'diet'] },
  { name: 'Weight Loss Step Calculator', path: '/calculator/weight-loss-steps', category: 'Health', keywords: ['weight', 'loss', 'steps', 'walking', 'fitness', 'calories', 'exercise'] },
  
  // Math Calculators
  { name: 'Percentage Calculator', path: '/calculator/percentage', category: 'Math', keywords: ['percentage', 'percent', 'increase', 'decrease'] },
  { name: 'Age Calculator', path: '/calculator/age', category: 'Math', keywords: ['age', 'birthday', 'years', 'months', 'days'] },
  { name: 'Unit Converter', path: '/calculator/unit-converter', category: 'Math', keywords: ['unit', 'convert', 'metric', 'imperial', 'measurement'] },
  
  // Utility Calculators
  { name: 'Tip Calculator', path: '/calculator/tip', category: 'Utility', keywords: ['tip', 'restaurant', 'service', 'bill', 'split'] },
  { name: 'Currency Converter', path: '/calculator/currency-converter', category: 'Utility', keywords: ['currency', 'exchange', 'forex', 'convert', 'money'] },
  
  // High-CPM Premium Calculators
  { name: 'Legal Settlement Estimator', path: '/calculator/legal-settlement', category: 'Premium', keywords: ['legal', 'settlement', 'personal', 'injury', 'lawsuit', 'compensation', 'damages', 'claim'] },
  { name: 'Solar Savings Calculator', path: '/calculator/solar-savings', category: 'Premium', keywords: ['solar', 'savings', 'panels', 'roi', 'payback', 'energy', 'renewable', 'australia'] },
  { name: 'Car Insurance Premium Estimator', path: '/calculator/car-insurance-premium', category: 'Premium', keywords: ['car', 'insurance', 'premium', 'auto', 'comprehensive', 'third party', 'australia', 'no claim bonus'] },
  
  // Insurance Calculators
  { name: 'Life Insurance Calculator', path: '/calculators/insurance/life-insurance', category: 'Insurance', keywords: ['life', 'insurance', 'coverage', 'premium', 'beneficiary'] },
  { name: 'Health Insurance Calculator', path: '/calculators/insurance/health-insurance', category: 'Insurance', keywords: ['health', 'insurance', 'medical', 'coverage', 'premium'] },
  { name: 'Car Insurance Calculator', path: '/calculators/insurance/car-insurance', category: 'Insurance', keywords: ['car', 'auto', 'insurance', 'vehicle', 'coverage', 'premium'] },
  
  // Viral/Fun Calculators
  { name: 'Love Compatibility Calculator', path: '/calculator/love-compatibility', category: 'Fun', keywords: ['love', 'compatibility', 'relationship', 'match', 'romance', 'crush', 'partner', 'soulmate'] },
  { name: 'Zodiac Compatibility Calculator', path: '/calculators/viral/zodiac-compatibility', category: 'Fun', keywords: ['zodiac', 'astrology', 'compatibility', 'horoscope', 'signs', 'star', 'cosmic', 'relationship'] },
  { name: 'Life Path Number Calculator', path: '/calculators/viral/life-path-number', category: 'Fun', keywords: ['numerology', 'life path', 'number', 'destiny', 'purpose', 'spiritual', 'birthdate', 'personality'] },
  { name: 'Friend Compatibility Calculator', path: '/calculators/viral/friend-compatibility', category: 'Fun', keywords: ['friend', 'friendship', 'bff', 'compatibility', 'best friend', 'buddy', 'pal', 'match'] },
  { name: 'Calorie Burn Calculator', path: '/calculators/viral/calorie-burn', category: 'Fun', keywords: ['calorie', 'burn', 'food', 'exercise', 'workout', 'fitness', 'calories', 'weight loss', 'diet'] },
  { name: 'Life Expectancy Calculator', path: '/calculators/viral/life-expectancy', category: 'Fun', keywords: ['life expectancy', 'lifespan', 'longevity', 'death', 'health', 'age', 'mortality', 'years'] },
  { name: 'Binge Watch Calculator', path: '/calculators/viral/how-long-to-watch', category: 'Fun', keywords: ['binge', 'watch', 'tv', 'show', 'movie', 'marathon', 'netflix', 'series', 'viewing', 'time'] },
  
  // AI Tools
  { name: 'AI Compatibility Calculator', path: '/ai/tools/compatibility', category: 'AI Tools', keywords: ['ai', 'compatibility', 'personality', 'match'] },
  { name: 'Baby Name Generator', path: '/ai/tools/baby-name', category: 'AI Tools', keywords: ['baby', 'name', 'generator', 'ai', 'parenting'] },
  { name: 'Gift Recommender', path: '/ai/tools/gift-recommender', category: 'AI Tools', keywords: ['gift', 'recommender', 'ai', 'shopping', 'present'] },
  { name: 'Hashtag Generator', path: '/ai/tools/hashtag', category: 'AI Tools', keywords: ['hashtag', 'generator', 'social', 'media', 'ai'] },
  { name: 'Mood Journal', path: '/ai/tools/mood-journal', category: 'AI Tools', keywords: ['mood', 'journal', 'wellness', 'ai', 'mental', 'health'] },
  { name: 'Pickup Line Generator', path: '/ai/tools/pickup-line', category: 'AI Tools', keywords: ['pickup', 'line', 'generator', 'dating', 'ai'] },

];

export function HomePage() {
  useEffect(() => {
    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(backgroundPrefetch);
    } else {
      setTimeout(backgroundPrefetch, 3000);
    }
  }, []);

  return (
    <div>
      <SEOHead
        title="Smart Calculator Hubs - Free Online Calculators for Finance, Health, Math & More"
        description="Free online calculators for finance, health, math, and utilities. Calculate mortgages, BMI, percentages, tips, and more with our easy-to-use tools."
        keywords="calculator, mortgage calculator, BMI calculator, percentage calculator, financial calculator, online calculator, free calculator"
      />

      {/* Hero Section */}
      <section className="relative py-12 sm:py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-4 sm:mb-6">
              <Calculator className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 px-2">
              Smart Calculator 
              <span className="text-blue-600"> Hubs</span>
              <span className="block text-xl sm:text-2xl md:text-3xl text-purple-600 mt-2">✨ AI-Powered</span>
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Professional-grade calculators enhanced with <strong className="text-purple-600">AI-powered insights</strong> for finance, health, math, and everyday tasks. 
              Get intelligent recommendations and make informed decisions with our smart tools.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              <CalculatorSearch variant="page" />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                <Link to="/finance/tools">
                  💰 Financial Tools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-blue-600 text-blue-600 hover:bg-blue-50 w-full sm:w-auto">
                <Link to="/calculator/mortgage">
                  🏠 Try Mortgage Calculator
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* First Adsterra Ad - After Hero */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <AdsterraSlot className="flex justify-center" />
        </div>
      </section>

      {/* Calculator Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Categories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive collection of tools organized by category
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {calculatorCategories.map((category) => (
              <Card key={category.title} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white border border-gray-100">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`p-3 rounded-lg ${category.color} text-white`}>
                      <category.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg text-gray-900">{category.title}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {category.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      {category.calculators.slice(0, 3).map((calc) => (
                        <Link
                          key={calc.path}
                          to={calc.path}
                          className="block text-sm text-gray-600 hover:text-blue-600 transition-colors"
                        >
                          • {calc.name}
                        </Link>
                      ))}
                    </div>
                    <Button asChild className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                      <Link to={category.path}>
                        View All Tools
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Country-Specific Calculators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">
              <Globe className="inline-block h-8 w-8 mr-2 text-blue-600" />
              Country-Specific Calculators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Localized calculators with accurate tax rates, regulations, and financial rules
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {countrySpecificCategories.map((country) => (
              <Card key={country.title} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 ${country.color}`}>
                <CardHeader className="text-center">
                  <div className="text-5xl mb-3">{country.icon}</div>
                  <CardTitle className="text-lg text-gray-900">{country.title.replace(country.icon, '').trim()}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {country.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                    <Link to={country.path}>
                      Explore Tools
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured/Popular Calculators */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 px-2">Popular Calculators</h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Start with our most popular calculators used by thousands of people daily
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
            {featuredCalculators.map((calc) => (
              <Card key={calc.name} className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${calc.badge === 'Premium' ? 'border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950' : 'border border-gray-100'}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${calc.badge === 'Premium' ? 'bg-amber-100' : 'bg-blue-100'} rounded-lg flex items-center justify-center`}>
                        <calc.icon className={`h-5 w-5 ${calc.badge === 'Premium' ? 'text-amber-600' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg text-gray-900">{calc.name}</CardTitle>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {calc.category}
                          </Badge>
                          {calc.badge && (
                            <Badge className="text-xs bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
                              💎 {calc.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {calc.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className={`w-full ${calc.badge === 'Premium' ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    <Link to={calc.path}>
                      Calculate Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Second Adsterra Ad - After Popular Calculators */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <AdsterraSlot className="flex justify-center" />
        </div>
      </section>

      {/* AI Features Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 px-2">
              🧠 AI-Powered Intelligence
            </h2>
            <p className="text-base sm:text-lg text-gray-600 px-4">
              Get personalized insights and smart recommendations tailored to your financial situation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
            <Card className="border border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Smart Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get AI-powered suggestions for optimizing your financial plans, investments, and savings strategies
                </p>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Intelligent Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced AI analyzes your calculations to provide deeper insights and alternative scenarios
                </p>
              </CardContent>
            </Card>

            <Card className="border border-green-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <CardTitle className="text-lg text-gray-900">Contextual Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive context-aware tips and educational content based on your specific calculations
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Why Choose Smart Calculator Hub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                  <Calculator className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">AI-Enhanced Accuracy</h3>
                <p className="text-gray-600">
                  Professional-grade algorithms enhanced with AI insights provide precise calculations and personalized recommendations
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Easy to Use</h3>
                <p className="text-gray-600">
                  Clean, intuitive interfaces that make complex calculations simple and accessible
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Always Free</h3>
                <p className="text-gray-600">
                  All our calculators are completely free to use with no hidden fees or subscriptions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Learn & Discover</h2>
            <p className="text-lg text-gray-600 mb-8">
              Get the most out of our calculators with helpful guides and financial insights
            </p>
            <Button asChild size="lg" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link to="/blog">
                Explore Our Blog
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Connect With Us</h2>
              <p className="text-lg text-gray-600">
                Follow us for calculator tips, financial insights, and updates
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a
                href="https://www.instagram.com/quan.tumleapventures/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
              >
                <Instagram className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">Instagram</div>
                  <div className="text-sm opacity-90">@quan.tumleapventures</div>
                </div>
              </a>

              <a
                href="https://x.com/QUANTUMLEAP_V"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
              >
                <FaXTwitter className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-semibold">X (Twitter)</div>
                  <div className="text-sm opacity-90">@QUANTUMLEAP_V</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}