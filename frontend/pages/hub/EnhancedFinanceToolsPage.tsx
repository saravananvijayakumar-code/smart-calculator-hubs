import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Calculator, Star, ArrowRight } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import { Breadcrumbs } from '../../components/Breadcrumbs';
import { AppleStyleCard, AppleStyleCardHeader } from '../../components/AppleStyleCard';
import { AppleStyleButton } from '../../components/AppleStyleButton';
import { CALCULATOR_DATA } from '../../components/CalculatorCategory';

export function EnhancedFinanceToolsPage() {
  // Get financial calculators
  const financialCalculators = CALCULATOR_DATA.filter(calc => 
    calc.category === 'financial' && !calc.region
  ).sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const featuredCalculators = financialCalculators.filter(calc => calc.featured);
  const popularCalculators = financialCalculators.slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Financial Calculators - Free Online Finance Tools | Smart Calculator Hubs"
        description="Comprehensive collection of free financial calculators including mortgage, loan, investment, retirement, and compound interest calculators. Make informed financial decisions with accurate calculations."
        keywords="financial calculator, mortgage calculator, loan calculator, investment calculator, retirement planning, compound interest, ROI calculator, finance tools"
        type="website"
      />

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Financial Calculators",
            "description": "Comprehensive collection of free financial calculators",
            "url": window.location.href,
            "publisher": {
              "@type": "Organization",
              "name": "Smart Calculator Hub",
              "url": "https://www.smartcalculatorhubs.com"
            },
            "mainEntity": {
              "@type": "ItemList",
              "numberOfItems": financialCalculators.length,
              "itemListElement": financialCalculators.map((calc, index) => ({
                "@type": "SoftwareApplication",
                "position": index + 1,
                "name": calc.name,
                "description": calc.description,
                "url": `https://www.smartcalculatorhubs.com${calc.path}`,
                "applicationCategory": "CalculatorApplication"
              }))
            }
          })
        }}
      />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Navigation */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Financial Calculators
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Make informed financial decisions with our comprehensive collection of free calculators. 
            From mortgage payments to retirement planning, get accurate results to plan your financial future.
          </p>
        </div>

        {/* Featured Calculators */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Featured Calculators</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCalculators.map((calculator) => (
              <Link key={calculator.id} to={calculator.path} className="group">
                <AppleStyleCard className="h-full hover:shadow-lg transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{calculator.popularity}%</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {calculator.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {calculator.description}
                  </p>
                  <div className="flex items-center text-primary text-sm font-medium">
                    Calculate now
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </AppleStyleCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Most Popular */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Most Popular</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularCalculators.map((calculator, index) => (
              <Link key={calculator.id} to={calculator.path} className="group">
                <AppleStyleCard padding="md" className="hover:shadow-md transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {calculator.name}
                      </h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {calculator.description}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </AppleStyleCard>
              </Link>
            ))}
          </div>
        </section>

        {/* All Financial Calculators */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">All Financial Calculators</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {financialCalculators.map((calculator) => (
              <Link key={calculator.id} to={calculator.path} className="group">
                <AppleStyleCard padding="md" className="h-full hover:shadow-md transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">
                      {calculator.name}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {calculator.description}
                  </p>
                  {calculator.featured && (
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-md">
                      Featured
                    </span>
                  )}
                </AppleStyleCard>
              </Link>
            ))}
          </div>
        </section>

        {/* Why Use Our Financial Calculators */}
        <section className="mb-12">
          <AppleStyleCard padding="lg">
            <h2 className="text-2xl font-bold mb-6">Why Use Our Financial Calculators?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Accurate & Reliable</h3>
                  <p className="text-muted-foreground">
                    Our calculators use industry-standard formulas and are regularly updated to ensure accuracy. 
                    Make confident financial decisions with reliable results.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Easy to Use</h3>
                  <p className="text-muted-foreground">
                    Simple, intuitive interfaces that provide instant results. No complex setup or 
                    financial expertise required to get started.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Completely Free</h3>
                  <p className="text-muted-foreground">
                    All our financial calculators are 100% free to use. No hidden fees, subscriptions, 
                    or registration required.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Privacy Protected</h3>
                  <p className="text-muted-foreground">
                    Your financial data is processed locally in your browser and never stored on our servers. 
                    Your privacy is our priority.
                  </p>
                </div>
              </div>
            </div>
          </AppleStyleCard>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <AppleStyleCard className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200" padding="lg">
            <h2 className="text-2xl font-bold mb-4">Ready to Take Control of Your Finances?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Start with our most popular calculators and discover how easy it is to plan your financial future. 
              Whether you're buying a home, planning for retirement, or managing debt, we have the tools you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/calculator/mortgage">
                <AppleStyleButton size="lg">
                  Mortgage Calculator
                </AppleStyleButton>
              </Link>
              <Link to="/calculator/investment">
                <AppleStyleButton variant="outline" size="lg">
                  Investment Calculator
                </AppleStyleButton>
              </Link>
            </div>
          </AppleStyleCard>
        </section>
      </div>
    </div>
  );
}