import { Link } from 'react-router-dom';
import { Calculator, Calendar, RotateCcw, Divide, ChartBar, Sigma } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../components/CalculatorLayoutWithAds';

const mathCalculators = [
  {
    name: 'Percentage Calculator',
    description: 'Master percentages with our lightning-fast calculator. Calculate increases, decreases, and changes instantly!',
    path: '/calculator/percentage',
    icon: Calculator,
    category: 'Basic Math',
    color: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Age Calculator',
    description: 'Calculate your exact age down to seconds! Perfect for birthdays, anniversaries, and life milestones.',
    path: '/calculator/age',
    icon: Calendar,
    category: 'Date & Time',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Unit Converter',
    description: 'Convert anything to everything! Length, weight, temperature, and more with pinpoint accuracy.',
    path: '/calculator/unit-converter',
    icon: RotateCcw,
    category: 'Conversions',
    color: 'from-green-500 to-emerald-500'
  },
  {
    name: 'Scientific Calculator',
    description: 'Advanced calculations at your fingertips! Trigonometry, logarithms, exponents, and complex operations.',
    path: '/calculator/scientific',
    icon: Calculator,
    category: 'Advanced Math',
    color: 'from-orange-500 to-red-500'
  },
  {
    name: 'Fraction Calculator',
    description: 'Simplify, add, subtract, multiply, and divide fractions like a pro! Step-by-step solutions included.',
    path: '/calculator/fraction',
    icon: Divide,
    category: 'Basic Math',
    color: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Statistics Calculator',
    description: 'Crunch numbers like never before! Mean, median, mode, standard deviation, and more statistical magic.',
    path: '/calculator/statistics',
    icon: ChartBar,
    category: 'Data Analysis',
    color: 'from-teal-500 to-cyan-500'
  }
];

export const MathToolsPage = () => {
  return (
    <CalculatorLayoutWithAds
      title="Professional Math Calculators & Computational Tools"
      description="Unlock the power of mathematics with our expert-level calculators. From basic arithmetic to advanced statistics, solve any math problem with precision, speed, and style."
      keywords="math calculators, scientific calculator, fraction calculator, statistics calculator, percentage calculator, age calculator, unit converter, advanced math tools"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 blur-3xl animate-pulse"></div>
          <div className="relative z-10">
            <div className="inline-block mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-lg opacity-50 animate-pulse"></div>
                <Sigma className="h-16 w-16 text-purple-600 relative z-10 mx-auto" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
              Math Calculators & Tools
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transform complex calculations into simple solutions! Our professional-grade calculators combine 
              <span className="font-bold text-purple-600"> 100% accuracy</span> with 
              <span className="font-bold text-pink-600"> lightning-fast results</span>. 
              Whether you're a student, professional, or math enthusiast, we've got the perfect tool for you! 🚀
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mathCalculators.map((calc, index) => {
            const Icon = calc.icon;
            return (
              <Link
                key={calc.path}
                to={calc.path}
                className="block group relative overflow-hidden"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${calc.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-gray-100 dark:border-gray-700 group-hover:border-purple-300 dark:group-hover:border-purple-600 group-hover:scale-105 transform">
                  <div className="flex items-center mb-4">
                    <div className={`bg-gradient-to-br ${calc.color} rounded-xl p-3 mr-4 shadow-md group-hover:shadow-lg transition-shadow duration-300 group-hover:rotate-6 transform`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {calc.name}
                      </h3>
                      <span className={`text-sm font-semibold bg-gradient-to-r ${calc.color} bg-clip-text text-transparent`}>
                        {calc.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                    {calc.description}
                  </p>
                  <div className={`flex items-center font-semibold text-sm bg-gradient-to-r ${calc.color} bg-clip-text text-transparent group-hover:translate-x-2 transition-transform`}>
                    Start Calculating →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-md mr-3">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Why Choose Our Calculators?</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-2xl mr-3">⚡</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Lightning-Fast Results</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Instant calculations that save you time and effort</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🎯</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">100% Accuracy Guaranteed</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Precision-engineered algorithms for perfect results every time</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📚</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Step-by-Step Solutions</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Learn while you calculate with detailed explanations</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl p-8 border-2 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-md mr-3">
                <Sigma className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Features</h2>
            </div>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-2xl mr-3">🎨</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Beautiful Visualizations</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">See your data come to life with stunning graphs and charts</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">🤖</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">AI-Powered Insights</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Get personalized recommendations and deep analysis</p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-2xl mr-3">📱</span>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Works Everywhere</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">Seamlessly optimized for desktop, tablet, and mobile</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 dark:from-orange-950/30 dark:via-red-950/30 dark:to-pink-950/30 rounded-2xl p-10 border-2 border-orange-200 dark:border-orange-800 shadow-xl mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
            Mathematical Mastery Awaits! 🎓
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-orange-200 dark:border-orange-700">
              <div className="text-4xl font-bold text-orange-600 mb-2">10M+</div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Calculations Performed</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-red-200 dark:border-red-700">
              <div className="text-4xl font-bold text-red-600 mb-2">99.9%</div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">User Satisfaction</p>
            </div>
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-pink-200 dark:border-pink-700">
              <div className="text-4xl font-bold text-pink-600 mb-2">24/7</div>
              <p className="text-gray-700 dark:text-gray-300 font-medium">Always Available</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl p-8 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            Perfect For Everyone! 🌟
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
              <div className="text-3xl mb-2">👨‍🎓</div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Students</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Teachers</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
              <div className="text-3xl mb-2">👨‍💼</div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Professionals</p>
            </div>
            <div className="p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-xl">
              <div className="text-3xl mb-2">🔬</div>
              <p className="font-semibold text-gray-900 dark:text-white text-sm">Researchers</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </CalculatorLayoutWithAds>
  );
};
