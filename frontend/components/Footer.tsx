import { Link } from 'react-router-dom';
import { Calculator, TrendingUp, Heart, Wrench } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Calculator className="h-6 w-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">SmartCalculatorHubs</span>
            </Link>
            <p className="text-sm text-gray-600">
              Professional calculators for finance, health, math, and everyday tasks. 
              Free, accurate, and easy to use.
            </p>
          </div>

          {/* Calculator Categories */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Calculator Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/finance/tools" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Financial Tools
                </Link>
              </li>
              <li>
                <Link to="/health/tools" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Health & Fitness
                </Link>
              </li>
              <li>
                <Link to="/math/tools" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  Math & Science
                </Link>
              </li>
              <li>
                <Link to="/utility/tools" className="text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Utility Tools
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Calculators */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Popular Calculators</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/calculator/mortgage" className="text-gray-600 hover:text-blue-600 transition-colors">Mortgage Calculator</Link></li>
              <li><Link to="/calculator/bmi" className="text-gray-600 hover:text-blue-600 transition-colors">BMI Calculator</Link></li>
              <li><Link to="/calculator/percentage" className="text-gray-600 hover:text-blue-600 transition-colors">Percentage Calculator</Link></li>
              <li><Link to="/calculator/tip" className="text-gray-600 hover:text-blue-600 transition-colors">Tip Calculator</Link></li>
              <li><Link to="/calculator/currency-converter" className="text-gray-600 hover:text-blue-600 transition-colors">Currency Converter</Link></li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 space-y-4">
          <div className="text-center text-xs text-gray-500 max-w-4xl mx-auto space-y-2">
            <p className="font-medium">Advertising & Affiliate Disclosure</p>
            <p>
              This website uses Google AdSense to display advertisements. Google AdSense uses cookies to serve ads 
              based on your prior visits to this website or other websites. You can opt out of personalized advertising 
              by visiting{' '}
              <a 
                href="https://www.google.com/settings/ads" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Google Ads Settings
              </a>.
            </p>
            <p>
              Smart Calculator Hub is a participant in the Amazon Services LLC Associates Program, an affiliate 
              advertising program designed to provide a means for sites to earn advertising fees by advertising 
              and linking to Amazon.com. We may earn commissions from qualifying purchases made through our affiliate links 
              at no additional cost to you.
            </p>
          </div>
          <div className="text-center text-sm text-gray-600 pt-4">
            <p>&copy; {new Date().getFullYear()} Smart Calculator Hub. All rights reserved. Professional calculators for everyone.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}