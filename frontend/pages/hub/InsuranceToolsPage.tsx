import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, Car, Calculator, TrendingUp, DollarSign } from 'lucide-react';
import { AppleStyleCard } from '../../components/AppleStyleCard';
import { SEOHead } from '../../components/SEOHead';

interface InsuranceCalculator {
  title: string;
  description: string;
  path: string;
  icon: React.ComponentType<any>;
  features: string[];
  category: string;
}

const calculators: InsuranceCalculator[] = [
  {
    title: "Life Insurance Coverage Calculator",
    description: "Calculate the optimal life insurance coverage amount based on your income, debts, expenses, and financial goals.",
    path: "/calculators/insurance/life-insurance",
    icon: Heart,
    features: ["Income replacement calculation", "Debt coverage analysis", "Future expense planning", "Beneficiary needs assessment"],
    category: "Life Insurance"
  },
  {
    title: "Health Insurance Premium Calculator",
    description: "Estimate health insurance premiums and compare plans based on your age, location, coverage needs, and family size.",
    path: "/calculators/insurance/health-insurance",
    icon: Shield,
    features: ["Premium estimation", "Plan comparison", "Deductible analysis", "Coverage optimization"],
    category: "Health Insurance"
  },
  {
    title: "Car Insurance Cost Calculator",
    description: "Calculate auto insurance costs based on vehicle type, driving history, coverage options, and personal factors.",
    path: "/calculators/insurance/car-insurance",
    icon: Car,
    features: ["Premium calculation", "Coverage comparison", "Discount analysis", "Risk assessment"],
    category: "Auto Insurance"
  }
];

const InsuranceToolsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <SEOHead 
        title="Insurance Calculators & Tools - Smart Calculator Hubs"
        description="Comprehensive insurance calculators for life, health, and auto insurance. Calculate premiums, coverage amounts, and compare plans with our advanced tools."
        keywords="insurance calculator, life insurance, health insurance, car insurance, premium calculator, coverage calculator"
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Insurance Calculators
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Make informed insurance decisions with our comprehensive calculators. Calculate coverage needs, 
            compare premiums, and optimize your insurance portfolio for maximum protection and value.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {calculators.map((calc, index) => {
            const IconComponent = calc.icon;
            return (
              <AppleStyleCard key={index} className="group hover:scale-105 transition-all duration-300">
                <Link to={calc.path} className="block p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mr-4 group-hover:shadow-lg transition-shadow">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {calc.title}
                      </h3>
                      <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        {calc.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {calc.description}
                  </p>
                  <div className="space-y-2">
                    {calc.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <Calculator className="w-4 h-4 mr-2 text-green-500" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </Link>
              </AppleStyleCard>
            );
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <AppleStyleCard className="p-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Why Use Insurance Calculators?
              </h2>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Determine optimal coverage amounts based on your specific needs</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Compare premiums across different insurance providers and plans</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Understand how various factors affect your insurance costs</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Make informed decisions to protect your financial future</span>
              </li>
            </ul>
          </AppleStyleCard>

          <AppleStyleCard className="p-8">
            <div className="flex items-center mb-4">
              <DollarSign className="w-8 h-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Smart Insurance Planning
              </h2>
            </div>
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>AI-powered analysis provides personalized recommendations</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Real-time calculations based on current market rates</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Comprehensive coverage analysis for complete protection</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Educational content to help you understand insurance basics</span>
              </li>
            </ul>
          </AppleStyleCard>
        </div>
      </div>
    </div>
  );
};

export default InsuranceToolsPage;