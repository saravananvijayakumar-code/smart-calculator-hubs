import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Activity, Scale, Target, Droplet, Moon, Zap, Baby, Calendar, TrendingUp, Ruler, Apple } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../components/CalculatorLayoutWithAds';
import { Input } from '@/components/ui/input';

const healthCalculators = [
  {
    name: 'BMI Calculator',
    description: 'Calculate your Body Mass Index and understand your weight category with WHO standards',
    path: '/calculator/bmi',
    icon: Scale,
    category: 'Weight & Fitness',
    keywords: 'bmi body mass index weight height obesity underweight'
  },
  {
    name: 'Body Fat Percentage Calculator',
    description: 'Calculate body fat % using US Navy method with circumference measurements',
    path: '/calculators/health/body-fat',
    icon: Activity,
    category: 'Body Composition',
    keywords: 'body fat percentage navy method circumference lean mass fat mass'
  },
  {
    name: 'BMR & TDEE Calculator',
    description: 'Calculate Basal Metabolic Rate and Total Daily Energy Expenditure (Mifflin-St Jeor)',
    path: '/calculators/health/bmr',
    icon: Zap,
    category: 'Metabolism & Energy',
    keywords: 'bmr tdee basal metabolic rate calories energy expenditure mifflin'
  },
  {
    name: 'Ideal Weight Calculator',
    description: 'Calculate ideal body weight using 4 validated formulas (Devine, Hamwi, Robinson, Miller)',
    path: '/calculators/health/ideal-weight',
    icon: Ruler,
    category: 'Weight & Fitness',
    keywords: 'ideal weight devine hamwi robinson miller target weight goal'
  },
  {
    name: 'Water Intake Calculator',
    description: 'Calculate daily water needs based on weight, activity, and climate (35ml/kg baseline)',
    path: '/calculators/health/water-intake',
    icon: Droplet,
    category: 'Hydration',
    keywords: 'water intake hydration daily water needs fluid ounces liters cups'
  },
  {
    name: 'Weight Loss Step Calculator',
    description: 'Calculate daily steps needed to reach your weight loss goals through walking',
    path: '/calculator/weight-loss-steps',
    icon: Target,
    category: 'Weight Loss & Fitness',
    keywords: 'weight loss steps walking exercise daily activity pedometer'
  },
  {
    name: 'Waist to Hip Ratio Calculator',
    description: 'Calculate waist-to-hip ratio to assess body fat distribution and health risk',
    path: '/calculator/waist-to-hip-ratio',
    icon: TrendingUp,
    category: 'Body Composition',
    keywords: 'waist hip ratio whr body fat distribution health risk circumference'
  },
  {
    name: 'Sleep Cycle Calculator',
    description: 'Calculate optimal sleep and wake times based on 90-minute sleep cycles',
    path: '/calculators/health/sleep',
    icon: Moon,
    category: 'Sleep & Recovery',
    keywords: 'sleep cycle calculator wake time bedtime rem nrem sleep quality'
  },
  {
    name: 'Heart Rate Zone Calculator',
    description: 'Calculate training heart rate zones using max HR or Karvonen method',
    path: '/calculators/health/heart-rate-zone',
    icon: Heart,
    category: 'Cardio & Training',
    keywords: 'heart rate zone training cardio max hr karvonen tanaka bpm'
  },
  {
    name: 'Pregnancy Due Date Calculator',
    description: 'Calculate estimated due date using Naegele\'s rule with cycle adjustment',
    path: '/calculators/health/pregnancy-due-date',
    icon: Baby,
    category: 'Pregnancy & Fertility',
    keywords: 'pregnancy due date edd lmp naegele trimester gestational age'
  },
  {
    name: 'Ovulation & Fertility Calculator',
    description: 'Predict ovulation date and fertile window based on menstrual cycle',
    path: '/calculators/health/ovulation',
    icon: Calendar,
    category: 'Pregnancy & Fertility',
    keywords: 'ovulation calculator fertile window fertility period cycle tracking conception'
  }
];

export const HealthToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCalculators = healthCalculators.filter(calc => {
    const query = searchQuery.toLowerCase();
    return (
      calc.name.toLowerCase().includes(query) ||
      calc.description.toLowerCase().includes(query) ||
      calc.category.toLowerCase().includes(query) ||
      calc.keywords.toLowerCase().includes(query)
    );
  });

  const categories = [...new Set(healthCalculators.map(c => c.category))];

  return (
    <CalculatorLayoutWithAds
      title="Health Calculators & Tools - BMI, BMR, Body Fat & More"
      description="Comprehensive health calculators including BMI, body fat percentage, BMR/TDEE, ideal weight, water intake, sleep cycles, heart rate zones, and pregnancy calculators. All medically accurate."
      keywords="health calculators, BMI calculator, body fat calculator, BMR calculator, TDEE, ideal weight, water intake, sleep calculator, heart rate zones, pregnancy calculator, ovulation calculator"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Health Calculators & Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            Comprehensive health calculators with 100% formula accuracy. Monitor fitness, nutrition, sleep, and more with medically validated tools.
          </p>
          
          <div className="max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search calculators... (e.g., BMI, calories, sleep)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        {searchQuery && (
          <div className="mb-6 text-center text-gray-600 dark:text-gray-400">
            Found {filteredCalculators.length} calculator{filteredCalculators.length !== 1 ? 's' : ''}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.path}
                to={calc.path}
                className="block bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 dark:bg-green-900 rounded-lg p-3 mr-4">
                    <Icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{calc.name}</h3>
                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">{calc.category}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {calc.description}
                </p>
                <div className="mt-4 text-green-600 dark:text-green-400 text-sm font-medium">
                  Calculate now →
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">No calculators found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-green-600 dark:text-green-400 hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        <div className="mt-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Calculator Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSearchQuery(category)}
                className="bg-white dark:bg-gray-700 rounded-lg p-3 text-center hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 dark:text-white">{category}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {healthCalculators.filter(c => c.category === category).length} tools
                </span>
              </button>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Health & Wellness Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">100% Formula Accuracy</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                All calculators use medically validated formulas with decimal.js precision. Results match clinical standards exactly.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Educational Content</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Learn about health metrics with detailed explanations, formulas, and interpretation guides.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Privacy Focused</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your health data stays private - we don't store or share any personal health information.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Professional Guidance</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Always consult with healthcare professionals for medical advice and health decisions.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Featured Calculators</h2>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Body Composition:</strong> BMI, Body Fat %, Waist-to-Hip Ratio, Ideal Weight (4 formulas)
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Metabolism:</strong> BMR (Mifflin-St Jeor), TDEE, Daily Calorie Needs
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Nutrition & Hydration:</strong> Calorie Calculator, Water Intake (35ml/kg + adjustments)
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Fitness:</strong> Weight Loss Steps, Heart Rate Training Zones (Karvonen method)
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Sleep & Recovery:</strong> Sleep Cycle Calculator (90-min cycles)
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              <strong>Pregnancy & Fertility:</strong> Due Date (Naegele's Rule), Ovulation & Fertile Window
            </p>
          </div>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
};
