// @ts-nocheck
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Menu, ChevronDown, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PWAInstallButton } from './PWAInstallBanner';
import { ConnectionStatus } from './OfflineIndicator';
import { CalculatorSearch } from './CalculatorSearch';
import { MobileNavigation } from './MobileNavigation';

interface Calculator {
  name: string;
  path: string;
  disabled?: boolean;
}

const calculatorCategories = {
  finance: {
    icon: '💰',
    name: 'Finance',
    path: '/finance/tools',
    calculators: [
      { name: 'Investment Calculator', path: '/calculator/investment' },
      { name: 'Simple Interest Calculator', path: '/calculator/simple-interest' },
      { name: 'Compound Interest Calculator', path: '/calculator/compound-interest' },
      { name: 'ROI Calculator', path: '/calculator/roi' },
      { name: 'Retirement Calculator', path: '/calculator/retirement' },
      { name: 'Credit Card Payoff Calculator', path: '/calculator/credit-card-payoff' },
      { name: 'Emergency Fund Calculator', path: '/calculator/emergency-fund' }
    ] as Calculator[]
  },
  health: {
    icon: '🏥',
    name: 'Health',
    path: '/health/tools',
    calculators: [
      { name: 'BMI Calculator', path: '/calculator/bmi' },
      { name: 'Body Fat Calculator', path: '/calculators/health/body-fat' },
      { name: 'BMR & TDEE Calculator', path: '/calculators/health/bmr' },
      { name: 'Ideal Weight Calculator', path: '/calculators/health/ideal-weight' },

      { name: 'Water Intake Calculator', path: '/calculators/health/water-intake' },
      { name: 'Weight Loss Step Calculator', path: '/calculator/weight-loss-steps' },
      { name: 'Waist to Hip Ratio', path: '/calculator/waist-to-hip-ratio' },
      { name: 'Sleep Cycle Calculator', path: '/calculators/health/sleep' },
      { name: 'Heart Rate Zone Calculator', path: '/calculators/health/heart-rate-zone' },
      { name: 'Pregnancy Due Date', path: '/calculators/health/pregnancy-due-date' },
      { name: 'Ovulation Calculator', path: '/calculators/health/ovulation' }
    ] as Calculator[]
  },
  math: {
    icon: '📊',
    name: 'Math',
    path: '/math/tools',
    calculators: [
      { name: 'Percentage Calculator', path: '/calculator/percentage' },
      { name: 'Age Calculator', path: '/calculator/age' },
      { name: 'Unit Converter', path: '/calculator/unit-converter' }
    ] as Calculator[]
  },
  utility: {
    icon: '🔧',
    name: 'Utility',
    path: '/utility/tools',
    calculators: [
      { name: 'Tip Calculator', path: '/calculator/tip' },
      { name: 'Currency Converter', path: '/calculator/currency-converter' }
    ] as Calculator[]
  },
  us: {
    icon: '🇺🇸',
    name: 'United States',
    path: '/us/tools',
    calculators: [
      { name: 'Mortgage Calculator', path: '/calculator/mortgage' },
      { name: 'Loan Calculator', path: '/calculator/loan' },
      { name: 'Auto Loan Calculator', path: '/calculator/auto-loan' },
      { name: 'Business Loan Calculator', path: '/calculator/business-loan' },
      { name: 'Student Loan Calculator', path: '/calculator/student-loan' },
      { name: 'HELOC Calculator', path: '/calculator/heloc' },
      { name: 'Debt Consolidation Calculator', path: '/calculator/debt-consolidation' },
      { name: 'Loan Affordability Calculator', path: '/calculator/loan-affordability' },
      { name: 'Federal Tax Calculator', path: '/calculator/federal-tax' },
      { name: 'State Tax Calculator', path: '/calculator/state-tax' },
      { name: '401k Retirement Calculator', path: '/calculator/401k-retirement' }
    ] as Calculator[]
  },
  uk: {
    icon: '🇬🇧',
    name: 'United Kingdom',
    path: '/uk/tools',
    calculators: [
      { name: 'Stamp Duty Calculator', path: '/calculators/uk/stamp-duty' },
      { name: 'ISA Calculator', path: '/calculators/uk/isa' },
      { name: 'National Insurance Calculator', path: '/calculators/uk/national-insurance' },
      { name: 'Pension Calculator', path: '/calculators/uk/pension' },
      { name: 'Buy-to-Let Mortgage Calculator', path: '/calculators/uk/btl-mortgage' }
    ] as Calculator[]
  },
  india: {
    icon: '🇮🇳',
    name: 'India',
    path: '/india/tools',
    calculators: [
      { name: 'EPF Calculator', path: '/calculators/india/epf' },
      { name: 'SIP Calculator', path: '/calculators/india/sip' },
      { name: 'Income Tax Calculator', path: '/calculators/india/income-tax' },
      { name: 'PPF Calculator', path: '/calculators/india/ppf' },
      { name: 'Home Loan Calculator', path: '/calculators/india/home-loan' }
    ] as Calculator[]
  },
  australia: {
    icon: '🇦🇺',
    name: 'Australia',
    path: '/australia/tools',
    calculators: [
      { name: 'Superannuation Calculator', path: '/calculators/australia/superannuation' },
      { name: 'Property Tax Calculator', path: '/calculators/australia/property-tax' },
      { name: 'Capital Gains Tax Calculator', path: '/calculators/australia/cgt' },
      { name: 'Fringe Benefits Tax Calculator', path: '/calculators/australia/fbt' },
      { name: 'Negative Gearing Calculator', path: '/calculators/australia/negative-gearing' }
    ] as Calculator[]
  }
};

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 p-1.5 shadow-sm group-hover:shadow-md transition-all duration-200">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              SmartCalculatorHubs
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            <Link to="/" className="px-3 py-1.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-150">
              Home
            </Link>
            
            <Link to="/blog" className="px-3 py-1.5 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white rounded-md hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-150">
              Blog
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  Calculators
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-80 max-h-[85vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-1 p-1">
                  {Object.entries(calculatorCategories).map(([key, category]) => (
                    <DropdownMenuItem key={key} asChild>
                      <Link 
                        to={category.path} 
                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-sm font-medium">{category.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  Insurance
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72 max-h-[85vh] overflow-y-auto">
                <div className="p-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link to="/calculator/car-insurance-premium" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🚙</span>
                      <span className="text-sm">Car Insurance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/insurance/health-insurance" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🏥</span>
                      <span className="text-sm">Health Insurance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/insurance/life-insurance" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🛡️</span>
                      <span className="text-sm">Life Insurance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/insurance/travel" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">✈️</span>
                      <span className="text-sm">Travel Insurance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/insurance/pet" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🐾</span>
                      <span className="text-sm">Pet Insurance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/insurance/business-liability" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🏢</span>
                      <span className="text-sm">Business Liability</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculator/legal-settlement" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">⚖️</span>
                      <span className="text-sm">Legal Settlement</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculator/solar-savings" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">☀️</span>
                      <span className="text-sm">Solar Savings</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>



            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  Viral
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <div className="p-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link to="/viral/tools" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent font-medium">
                      <span className="text-lg">🔥</span>
                      <span className="text-sm">All Viral Tools</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/viral/love-compatibility" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">💕</span>
                      <span className="text-sm">Love Compatibility</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/viral/zodiac-compatibility" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">✨</span>
                      <span className="text-sm">Zodiac Compatibility</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/viral/life-path-number" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🔮</span>
                      <span className="text-sm">Life Path Number</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/viral/friend-compatibility" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">👯</span>
                      <span className="text-sm">Friend Compatibility</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/viral/life-expectancy" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">⏰</span>
                      <span className="text-sm">Life Expectancy</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/viral/how-long-to-watch" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">📺</span>
                      <span className="text-sm">Binge Watch Calculator</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  SmartTimer
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <div className="p-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link to="/smarttimer" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent font-medium bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
                      <span className="text-lg">⏱️</span>
                      <span className="text-sm">SmartTimer Suite</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/smarttimer/stopwatch" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">⏱️</span>
                      <span className="text-sm">Stopwatch</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/smarttimer/countdown" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">⏰</span>
                      <span className="text-sm">Countdown Timer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/smarttimer/pomodoro" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🍅</span>
                      <span className="text-sm">Pomodoro Timer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/smarttimer/multi-timer" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">⏲️</span>
                      <span className="text-sm">Multi-Timer</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/smarttimer/event" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">📅</span>
                      <span className="text-sm">Event Countdown</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  Tools
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <div className="p-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link to="/tools/knowmyip" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🌐</span>
                      <span className="text-sm">Know My IP</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tools/shortener" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🔗</span>
                      <span className="text-sm">Smart Shortener</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tools/speed-test" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">📡</span>
                      <span className="text-sm">Internet Speed Test</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tools/ip-reputation" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🛡️</span>
                      <span className="text-sm">IP Reputation Check</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tools/ssl-checker" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🔒</span>
                      <span className="text-sm">SSL Certificate Checker</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tools/dns-ping" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">⚡</span>
                      <span className="text-sm">DNS & Ping Test</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tools/browser-info" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">💻</span>
                      <span className="text-sm">Browser & Device Info</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/tools/image-compressor" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🖼️</span>
                      <span className="text-sm">Image Compressor</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  Finder
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <div className="p-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link to="/finder/tools" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent font-medium">
                      <span className="text-lg">🔍</span>
                      <span className="text-sm">All Finder Tools</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/finder/tools/plantfinder" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🌿</span>
                      <span className="text-sm">AI Plant Finder</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/finder/tools/pet-breed-finder" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🐶</span>
                      <span className="text-sm">Pet Breed Finder</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/finder/tools/home-decor-style-finder" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🏠</span>
                      <span className="text-sm">Home Decor Style Finder</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/calculators/viral/calorie-burn" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🔥</span>
                      <span className="text-sm">Calorie Burn Calculator</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 px-3 text-[13px] font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50">
                  AI Hub
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-72">
                <div className="p-1 space-y-1">
                  <DropdownMenuItem asChild>
                    <Link to="/ai/ai-text-detector" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent font-medium bg-blue-50 dark:bg-blue-950/20">
                      <span className="text-lg">🔍</span>
                      <span className="text-sm">AI Text Detector</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/ai/relationships" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">💕</span>
                      <span className="text-sm">Relationships</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ai/wellness" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🌱</span>
                      <span className="text-sm">Wellness</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ai/parenting" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">👶</span>
                      <span className="text-sm">Parenting</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/ai/shopping" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent">
                      <span className="text-lg">🛒</span>
                      <span className="text-sm">Shopping</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/ai/social" className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent font-medium">
                      <span className="text-lg">#️⃣</span>
                      <span className="text-sm">Social Media Tools</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-2">
            <Link 
              to="/history" 
              className="hidden lg:block p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-150"
              title="History"
            >
              <History className="h-4 w-4" />
            </Link>
            
            <div className="hidden lg:flex items-center gap-2">
              <CalculatorSearch variant="navbar" />
              <ConnectionStatus />
              <PWAInstallButton />
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </div>

      <MobileNavigation 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        calculatorCategories={calculatorCategories}
      />
    </header>
  );
}
