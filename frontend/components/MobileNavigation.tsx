import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  X, 
  Home, 
  Calculator, 
  Shield, 
  Flame, 
  Clock, 
  Wrench, 
  Bot, 
  History as HistoryIcon,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CalculatorSearch } from './CalculatorSearch';

interface Calculator {
  name: string;
  path: string;
  disabled?: boolean;
}

interface Category {
  icon: string;
  name: string;
  path: string;
  calculators: Calculator[];
}

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorCategories: Record<string, Category>;
}

export function MobileNavigation({ isOpen, onClose, calculatorCategories }: MobileNavigationProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div style={{ position: 'fixed', top: 0, bottom: 0, left: 0, width: '90vw', maxWidth: '28rem', zIndex: 101 }} className="bg-white dark:bg-gray-950 shadow-2xl lg:hidden">
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <div className="flex-shrink-0 px-4 h-14 border-b-2 border-blue-500 dark:border-blue-600 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950/50 dark:to-gray-950 backdrop-blur-xl">
            <div className="flex h-full items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm">
                  <span className="text-white font-semibold text-sm">SC</span>
                </div>
                <div>
                  <h1 className="font-bold text-base bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    SmartCalculatorHubs
                  </h1>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Navigation Menu</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSearch(!showSearch)}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onClose}
                  className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800/50"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showSearch && (
              <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                <CalculatorSearch variant="mobile" onSelect={onClose} />
              </div>
            )}
          </div>

          <nav style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }} className="bg-white dark:bg-gray-950">
            <div className="px-4 py-3 space-y-1">
              <Link 
                to="/" 
                className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors active:scale-[0.98] text-gray-900 dark:text-white"
                onClick={onClose}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span>Home</span>
              </Link>

              <Link 
                to="/blog" 
                className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors active:scale-[0.98] text-gray-900 dark:text-white"
                onClick={onClose}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <span>Blog</span>
              </Link>

              <div>
                <button
                  onClick={() => toggleSection('calculators')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span>Calculators</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedSection === 'calculators' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'calculators' && (
                  <div className="mt-2 ml-12 mr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {/* General Categories */}
                    <Link to="/finance/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">💰</span>
                      <span>Finance</span>
                    </Link>
                    <Link to="/health/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🏥</span>
                      <span>Health</span>
                    </Link>
                    <Link to="/math/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">📊</span>
                      <span>Math</span>
                    </Link>
                    <Link to="/utility/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🔧</span>
                      <span>Utility</span>
                    </Link>
                    
                    {/* Country-Specific Categories with Codes */}
                    <div className="pt-2 mt-2 border-t border-gray-200 dark:border-gray-700">
                      <Link to="/us/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                        <span className="text-xl">🇺🇸</span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">US</span>
                          <span>United States</span>
                        </span>
                      </Link>
                      <Link to="/uk/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                        <span className="text-xl">🇬🇧</span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">GB</span>
                          <span>United Kingdom</span>
                        </span>
                      </Link>
                      <Link to="/india/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                        <span className="text-xl">🇮🇳</span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">IN</span>
                          <span>India</span>
                        </span>
                      </Link>
                      <Link to="/australia/tools" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                        <span className="text-xl">🇦🇺</span>
                        <span className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">AU</span>
                          <span>Australia</span>
                        </span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('insurance')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30">
                      <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span>Insurance</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedSection === 'insurance' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'insurance' && (
                  <div className="mt-2 ml-12 mr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/calculator/car-insurance-premium" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🚙</span>
                      <span>Car Insurance</span>
                    </Link>
                    <Link to="/calculators/insurance/health-insurance" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🏥</span>
                      <span>Health Insurance</span>
                    </Link>
                    <Link to="/calculators/insurance/life-insurance" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🛡️</span>
                      <span>Life Insurance</span>
                    </Link>
                    <Link to="/calculators/insurance/travel" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">✈️</span>
                      <span>Travel Insurance</span>
                    </Link>
                    <Link to="/calculators/insurance/pet" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🐾</span>
                      <span>Pet Insurance</span>
                    </Link>
                    <Link to="/calculators/insurance/business-liability" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🏢</span>
                      <span>Business Liability</span>
                    </Link>
                    <Link to="/calculator/legal-settlement" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">⚖️</span>
                      <span>Legal Settlement</span>
                    </Link>
                    <Link to="/calculator/solar-savings" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">☀️</span>
                      <span>Solar Savings</span>
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('viral')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                      <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span>Viral Tools</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedSection === 'viral' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'viral' && (
                  <div className="mt-2 ml-12 mr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/viral/tools" className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200" onClick={onClose}>
                      <span className="text-xl">🔥</span>
                      <span>All Viral Tools</span>
                    </Link>
                    <Link to="/calculators/viral/love-compatibility" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">💕</span>
                      <span>Love Compatibility</span>
                    </Link>
                    <Link to="/calculators/viral/zodiac-compatibility" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">✨</span>
                      <span>Zodiac Compatibility</span>
                    </Link>
                    <Link to="/calculators/viral/life-path-number" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🔮</span>
                      <span>Life Path Number</span>
                    </Link>
                    <Link to="/calculators/viral/friend-compatibility" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">👯</span>
                      <span>Friend Compatibility</span>
                    </Link>
                    <Link to="/calculators/viral/life-expectancy" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">⏰</span>
                      <span>Life Expectancy</span>
                    </Link>
                    <Link to="/calculators/viral/how-long-to-watch" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">📺</span>
                      <span>Binge Watch</span>
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('smarttimer')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span>SmartTimer</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedSection === 'smarttimer' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'smarttimer' && (
                  <div className="mt-2 ml-12 mr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/smarttimer" className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200" onClick={onClose}>
                      <span className="text-xl">⏱️</span>
                      <span>SmartTimer Suite</span>
                    </Link>
                    <Link to="/smarttimer/stopwatch" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">⏱️</span>
                      <span>Stopwatch</span>
                    </Link>
                    <Link to="/smarttimer/countdown" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">⏰</span>
                      <span>Countdown Timer</span>
                    </Link>
                    <Link to="/smarttimer/pomodoro" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🍅</span>
                      <span>Pomodoro</span>
                    </Link>
                    <Link to="/smarttimer/multi-timer" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">⏲️</span>
                      <span>Multi-Timer</span>
                    </Link>
                    <Link to="/smarttimer/event" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">📅</span>
                      <span>Event Countdown</span>
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('tools')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
                      <Wrench className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <span>Tools</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedSection === 'tools' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'tools' && (
                  <div className="mt-2 ml-12 mr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/tools/knowmyip" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🌐</span>
                      <span>Know My IP</span>
                    </Link>
                    <Link to="/tools/shortener" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🔗</span>
                      <span>Smart Shortener</span>
                    </Link>
                    <Link to="/tools/speed-test" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">📡</span>
                      <span>Speed Test</span>
                    </Link>
                    <Link to="/tools/ip-reputation" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🛡️</span>
                      <span>IP Reputation</span>
                    </Link>
                    <Link to="/tools/ssl-checker" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🔒</span>
                      <span>SSL Checker</span>
                    </Link>
                    <Link to="/tools/dns-ping" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">⚡</span>
                      <span>DNS & Ping Test</span>
                    </Link>
                    <Link to="/tools/browser-info" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">💻</span>
                      <span>Browser Info</span>
                    </Link>
                    <Link to="/tools/image-compressor" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🖼️</span>
                      <span>Image Compressor</span>
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('finder')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30">
                      <Search className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span>Finder</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedSection === 'finder' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'finder' && (
                  <div className="mt-2 ml-12 mr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/finder/tools" className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200" onClick={onClose}>
                      <span className="text-xl">🔍</span>
                      <span>All Finder Tools</span>
                    </Link>
                    <Link to="/calculators/viral/calorie-burn" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🔥</span>
                      <span>Calorie Burn Calculator</span>
                    </Link>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() => toggleSection('ai')}
                  className="w-full flex items-center justify-between px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-gray-900 dark:text-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <Bot className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <span>AI Hub</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-600 dark:text-gray-400 transition-transform ${expandedSection === 'ai' ? 'rotate-180' : ''}`} />
                </button>

                {expandedSection === 'ai' && (
                  <div className="mt-2 ml-12 mr-2 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <Link to="/ai/ai-text-detector" className="flex items-center gap-3 px-4 py-3 text-base font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200" onClick={onClose}>
                      <span className="text-xl">🔍</span>
                      <span>AI Text Detector</span>
                    </Link>
                    <Link to="/ai/relationships" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">💕</span>
                      <span>Relationships</span>
                    </Link>
                    <Link to="/ai/wellness" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🌱</span>
                      <span>Wellness</span>
                    </Link>
                    <Link to="/ai/parenting" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">👶</span>
                      <span>Parenting</span>
                    </Link>
                    <Link to="/ai/shopping" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">🛒</span>
                      <span>Shopping</span>
                    </Link>
                    <Link to="/ai/social" className="flex items-center gap-3 px-4 py-3 text-base rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors text-gray-800 dark:text-gray-200 font-medium" onClick={onClose}>
                      <span className="text-xl">#️⃣</span>
                      <span>Social Media</span>
                    </Link>
                  </div>
                )}
              </div>

              <Link 
                to="/history" 
                className="flex items-center gap-3 px-4 py-3.5 text-base font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors active:scale-[0.98] text-gray-900 dark:text-white"
                onClick={onClose}
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <HistoryIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </div>
                <span>History</span>
              </Link>
            </div>
          </nav>

          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-4 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-around text-sm font-medium">
              <Link to="/about" onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">About</Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link to="/privacy" onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">Privacy</Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link to="/terms" onClick={onClose} className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors py-2">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
