import { Link } from 'react-router-dom';
import { Calculator, DollarSign, ArrowLeftRight, Tag, Calendar, Lock, Ruler, Clock } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../components/CalculatorLayoutWithAds';

const utilityCalculators = [
  {
    name: 'Currency Converter',
    description: 'Convert between 170+ currencies with real-time exchange rates',
    path: '/calculator/currency-converter',
    icon: ArrowLeftRight,
    category: 'Finance',
    color: 'blue'
  },
  {
    name: 'Tip Calculator',
    description: 'Calculate tips and split bills for restaurants and services',
    path: '/calculator/tip',
    icon: DollarSign,
    category: 'Daily Use',
    color: 'green'
  },
  {
    name: 'Discount Calculator',
    description: 'Calculate sale prices, discounts, and savings instantly',
    path: '/calculator/discount',
    icon: Tag,
    category: 'Shopping',
    color: 'red'
  },
  {
    name: 'Date Calculator',
    description: 'Calculate date differences and add/subtract time periods',
    path: '/calculator/date',
    icon: Calendar,
    category: 'Planning',
    color: 'purple'
  },
  {
    name: 'Password Generator',
    description: 'Generate strong, secure passwords with custom options',
    path: '/calculator/password-generator',
    icon: Lock,
    category: 'Security',
    color: 'orange'
  },
  {
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    path: '/calculator/unit-converter',
    icon: Ruler,
    category: 'Conversion',
    color: 'indigo'
  }
];

export const UtilityToolsPage = () => {
  return (
    <CalculatorLayoutWithAds
      title="Utility Calculators & Tools"
      description="Everyday utility calculators for tips, currency conversion, and daily calculations. Practical tools for common tasks."
      keywords="utility calculators, tip calculator, currency converter, everyday tools, practical calculators"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Utility Calculators & Tools
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Essential calculators for everyday life. Currency conversion, discounts, dates, passwords, and more. 
            Free, fast, and always available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilityCalculators.map((calc) => {
            const Icon = calc.icon;
            const colorClasses = {
              blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-200 dark:border-blue-800',
              green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800',
              red: 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800',
              purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 border-purple-200 dark:border-purple-800',
              orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 border-orange-200 dark:border-orange-800',
              indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
            };
            const bgClass = colorClasses[calc.color as keyof typeof colorClasses];
            
            return (
              <Link
                key={calc.path}
                to={calc.path}
                className="group block bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-border hover:scale-105"
              >
                <div className="flex items-start mb-4">
                  <div className={`rounded-lg p-3 mr-4 ${bgClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                      {calc.name}
                    </h3>
                    <span className="text-xs font-medium text-muted-foreground px-2 py-1 bg-accent rounded-full">
                      {calc.category}
                    </span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {calc.description}
                </p>
                <div className="mt-4 text-primary text-sm font-medium flex items-center group-hover:gap-2 transition-all">
                  Use now 
                  <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h2 className="text-2xl font-bold mb-6">Why Use Our Utility Tools?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Instant Results
              </h3>
              <p className="text-muted-foreground text-sm">
                Get immediate calculations without delays. All tools work instantly in your browser.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Privacy First
              </h3>
              <p className="text-muted-foreground text-sm">
                All calculations happen locally. Your data never leaves your device.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-primary" />
                Free Forever
              </h3>
              <p className="text-muted-foreground text-sm">
                No subscriptions, no hidden fees. Professional-grade tools, completely free.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-primary" />
                Real-Time Data
              </h3>
              <p className="text-muted-foreground text-sm">
                Live exchange rates and up-to-date information for accurate results.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Mobile Optimized
              </h3>
              <p className="text-muted-foreground text-sm">
                Works perfectly on any device - phone, tablet, or desktop.
              </p>
            </div>
            <div className="bg-card p-4 rounded-lg border border-border">
              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                No Registration
              </h3>
              <p className="text-muted-foreground text-sm">
                Start using immediately. No sign-up, no login, no hassle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
};