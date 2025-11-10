import { Calculator, Users, Shield, Award, Brain, Zap, Globe, TrendingUp, Target, Heart, Lock, CheckCircle, Lightbulb, BarChart3, Clock, Star, ArrowLeft, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SEOHead } from '../components/SEOHead';

export function AboutPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="About Us - Smart Calculator Hubs | Professional AI-Enhanced Financial Calculators"
        description="Discover SmartCalculatorHub's mission to revolutionize financial planning with AI-powered calculators for Australia, US, UK, and India. Trusted by millions for accurate calculations and intelligent insights."
        keywords="about SmartCalculatorHub, AI financial calculators, mission, team, professional tools, artificial intelligence, financial planning"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Page Navigation Tabs - Desktop and Mobile */}
        <div className="mb-8">
          <div className="flex items-center justify-between lg:justify-center gap-4 text-sm font-medium border-b pb-4">
            {/* Mobile Back to Home on left */}
            <Link to="/" className="lg:hidden">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
            
            {/* Center tabs */}
            <div className="flex items-center gap-4">
              <Link to="/about" className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3">
                About
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-3">
                Privacy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-3">
                Terms
              </Link>
            </div>
            
            {/* Spacer for mobile to balance the layout */}
            <div className="lg:hidden w-10"></div>
          </div>
          
          {/* Mobile Info Banner */}
          <div className="lg:hidden mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="text-lg">☰</span>
              <span>Tap the menu icon (☰) in the top-right corner to access all calculators, tools, and features</span>
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              About SmartCalculatorHub
              <span className="block text-2xl text-purple-600 mt-2">✨ The Future of AI-Powered Financial Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Pioneering the next generation of financial calculators by combining cutting-edge artificial intelligence 
              with professional-grade accuracy to democratize intelligent financial planning worldwide.
            </p>
            <p className="text-lg text-purple-600 font-semibold mt-4">
              Powered by Quantum Leap Ventures Pvt Ltd.
            </p>
          </div>

          {/* Mission & Vision Section */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Target className="h-6 w-6 text-purple-600" />
                    <span>Our Mission</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed mb-4">
                    At SmartCalculatorHub, we're revolutionizing how the world approaches financial planning. Our mission is to 
                    democratize access to intelligent financial tools by providing AI-enhanced, professional-grade calculators 
                    that don't just compute numbers—they think, analyze, and guide users toward optimal financial decisions.
                  </p>
                  <p className="text-base text-muted-foreground">
                    We believe that sophisticated financial analysis should be accessible to everyone, not just financial 
                    professionals. Through the power of artificial intelligence, we're making complex financial concepts 
                    understandable and actionable for millions of users worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                    <span>Our Vision</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg leading-relaxed mb-4">
                    We envision a future where every financial decision is backed by intelligent analysis and personalized 
                    guidance. Our goal is to become the world's most trusted platform for AI-powered financial calculations, 
                    helping users across all economic backgrounds make smarter, more informed choices.
                  </p>
                  <p className="text-base text-muted-foreground">
                    By 2030, we aim to serve over 100 million users globally, providing localized financial intelligence 
                    that adapts to each country's unique economic landscape, regulations, and cultural financial practices.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Innovation Deep Dive */}
          <div className="mb-16">
            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Brain className="h-8 w-8 text-purple-600" />
                  <span>Revolutionary AI Integration</span>
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  Transforming traditional calculators into intelligent financial advisors
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4 text-gray-900">How Our AI Works</h4>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Our proprietary AI engine goes far beyond simple calculations. It analyzes your financial inputs 
                      within the context of current market conditions, economic trends, and country-specific regulations. 
                      Using advanced machine learning algorithms, it identifies patterns, risks, and opportunities that 
                      traditional calculators simply cannot detect.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <Zap className="h-8 w-8 text-yellow-500 mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Intelligent Analysis</h5>
                      <p className="text-gray-600 text-sm">
                        Our AI examines your financial scenario from multiple angles, considering factors like inflation, 
                        market volatility, tax implications, and economic forecasts to provide comprehensive insights.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <TrendingUp className="h-8 w-8 text-green-500 mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Predictive Modeling</h5>
                      <p className="text-gray-600 text-sm">
                        Advanced algorithms predict future scenarios based on current trends, helping you understand 
                        potential outcomes and plan accordingly for various economic conditions.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <BarChart3 className="h-8 w-8 text-blue-500 mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Personalized Recommendations</h5>
                      <p className="text-gray-600 text-sm">
                        Receive tailored suggestions for optimizing your financial strategy, whether it's adjusting 
                        loan terms, investment allocations, or savings plans based on your unique situation.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <Globe className="h-8 w-8 text-purple-500 mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Global Context</h5>
                      <p className="text-gray-600 text-sm">
                        Our AI understands regional differences, incorporating country-specific regulations, tax codes, 
                        and market conditions to provide locally relevant advice and calculations.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <Clock className="h-8 w-8 text-orange-500 mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Real-Time Updates</h5>
                      <p className="text-gray-600 text-sm">
                        Calculations automatically incorporate the latest interest rates, tax changes, and economic 
                        indicators, ensuring your financial planning is always based on current information.
                      </p>
                    </div>

                    <div className="bg-white p-4 rounded-lg border border-purple-100">
                      <CheckCircle className="h-8 w-8 text-emerald-500 mb-3" />
                      <h5 className="font-semibold text-gray-900 mb-2">Scenario Planning</h5>
                      <p className="text-gray-600 text-sm">
                        Explore "what-if" scenarios with intelligent suggestions, helping you understand the impact 
                        of different financial decisions before you make them.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Global Reach & Localization */}
          <div className="mb-16">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3 text-xl">
                  <Globe className="h-6 w-6 text-primary" />
                  <span>Global Reach, Local Expertise</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6 leading-relaxed">
                  Understanding that financial systems vary dramatically across countries, we've built dedicated 
                  calculation engines for each major market we serve. Our platform isn't just translated—it's 
                  localized to reflect the unique financial landscape of each region.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="text-2xl mb-2">🇦🇺</div>
                    <h4 className="font-semibold mb-2">Australia</h4>
                    <p className="text-sm text-gray-600">
                      Superannuation, negative gearing, CGT, FBT, and property tax calculations with RBA rate integration.
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="text-2xl mb-2">🇺🇸</div>
                    <h4 className="font-semibold mb-2">United States</h4>
                    <p className="text-sm text-gray-600">
                      Federal and state tax calculations, 401(k) planning, mortgage analysis with Fed rate tracking.
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="text-2xl mb-2">🇬🇧</div>
                    <h4 className="font-semibold mb-2">United Kingdom</h4>
                    <p className="text-sm text-gray-600">
                      ISA calculations, pension planning, stamp duty, and National Insurance with BoE rate integration.
                    </p>
                  </div>
                  
                  <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="text-2xl mb-2">🇮🇳</div>
                    <h4 className="font-semibold mb-2">India</h4>
                    <p className="text-sm text-gray-600">
                      EPF, PPF, SIP calculations, income tax planning with RBI rate and policy integration.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Core Values */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center mb-8">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-green-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Trust & Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Every calculation undergoes rigorous testing and validation. Our AI-enhanced algorithms are built 
                    on verified financial models and are continuously updated to reflect current regulations, market 
                    conditions, and economic realities. We strive to provide accurate and reliable results to support 
                    your financial planning decisions.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>User-Centric Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We design our AI-enhanced tools based on real user needs and feedback. Every feature is tested 
                    with actual users to ensure our complex financial calculations remain simple, accessible, and 
                    intuitively guided for everyone, regardless of their financial background.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-purple-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Excellence & Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We pursue excellence in every aspect: calculation accuracy, user experience, AI intelligence, 
                    and customer support. Our commitment to innovation drives us to continuously improve and expand 
                    our AI capabilities to serve our users better.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Privacy & Security</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your financial data is sacred. We employ enterprise-grade security measures and never store 
                    personal financial information. All calculations happen locally in your browser, ensuring 
                    complete privacy while still benefiting from our AI insights.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-yellow-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-yellow-600" />
                  </div>
                  <CardTitle>Financial Empowerment</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe financial literacy and smart planning should be accessible to all. Our mission extends 
                    beyond calculations—we're committed to educating and empowering users to make confident, 
                    informed financial decisions that improve their lives.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-emerald-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <Star className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle>Continuous Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our AI systems continuously learn from market trends, regulatory changes, and user interactions 
                    to provide increasingly sophisticated and relevant financial guidance. We're always evolving 
                    to serve you better.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Story - Expanded */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="text-2xl">Our Journey to AI-Powered Financial Intelligence</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none space-y-6">
                <div>
                  <h4 className="text-lg font-semibold mb-3 text-purple-700">The Beginning (2020-2021)</h4>
                  <p className="mb-4 leading-relaxed">
                    SmartCalculatorHub, a product of Quantum Leap Ventures Pvt Ltd., was born from a frustrating personal 
                    experience. Our founder, a software engineer buying his first home in Sydney, struggled to find reliable, 
                    accurate mortgage calculators that accounted for Australia's unique property market conditions, stamp duty 
                    variations, and lending regulations. Existing tools were either overly simplistic or prohibitively expensive.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    This led to the creation of our first Australian mortgage calculator—built with meticulous attention 
                    to local regulations, real-time interest rate integration, and comprehensive scenario modeling. 
                    The positive response from early users was overwhelming, validating our belief that people needed 
                    better financial tools.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-blue-700">Global Expansion (2022-2023)</h4>
                  <p className="mb-4 leading-relaxed">
                    Encouraged by our success in Australia, we began expanding to other English-speaking markets. 
                    However, we quickly learned that simply translating calculators wasn't enough. Each country has 
                    unique financial systems, tax structures, and cultural approaches to money management.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    We spent months researching and building specialized calculation engines for the United States, 
                    United Kingdom, and India. This wasn't just about different currencies—it meant understanding 
                    401(k) vs superannuation vs pension systems, federal vs state taxation, and countless other 
                    regional nuances that impact financial planning.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    By the end of 2023, we were serving over 500,000 monthly users across four countries, with 
                    a comprehensive suite of 40+ country-specific calculators covering everything from basic 
                    loan calculations to complex retirement planning scenarios.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-green-700">The AI Revolution (2024-Present)</h4>
                  <p className="mb-4 leading-relaxed">
                    In early 2024, we made a pivotal decision that would transform our platform: integrating 
                    artificial intelligence into every calculator. This wasn't about following trends—it was 
                    about solving a fundamental limitation of traditional calculators.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    Numbers alone don't tell the full story. A mortgage calculator might tell you your monthly 
                    payment, but it can't explain whether that payment fits your broader financial goals, suggest 
                    optimization strategies, or warn you about potential risks. Our AI bridges this gap.
                  </p>
                  <p className="mb-4 leading-relaxed font-medium text-purple-700">
                    🚀 <strong>The Breakthrough:</strong> We developed proprietary AI algorithms that analyze 
                    financial inputs within the context of current market conditions, economic trends, and 
                    individual user circumstances. Our AI doesn't just calculate—it thinks, analyzes, and provides 
                    intelligent, personalized guidance for every financial scenario.
                  </p>
                  <p className="mb-4 leading-relaxed">
                    Today, SmartCalculatorHub serves over 1.2 million monthly users who benefit from our unique 
                    combination of precise calculations and intelligent analysis. We're not just keeping up with 
                    the fintech revolution—we're leading it by making sophisticated financial AI accessible to everyone.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold mb-3 text-red-700">Looking Forward (2025 and Beyond)</h4>
                  <p className="mb-4 leading-relaxed">
                    We're just getting started. Our roadmap includes expanding to new markets, developing even 
                    more sophisticated AI capabilities, and building partnerships with financial institutions 
                    to bring our intelligent calculation technology to even more users worldwide.
                  </p>
                  <p className="leading-relaxed text-gray-700">
                    Our ultimate goal remains unchanged: to democratize access to intelligent financial planning 
                    tools, helping millions of people make smarter financial decisions and build better financial futures.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technology & Innovation */}
          <Card className="mb-16">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-xl">
                <Zap className="h-6 w-6 text-yellow-500" />
                <span>Technology & Innovation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-lg leading-relaxed">
                  Behind our user-friendly interface lies a sophisticated technology stack designed for accuracy, 
                  speed, and intelligence. We've built our platform using cutting-edge technologies that ensure 
                  reliable performance while enabling advanced AI capabilities.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-blue-700">AI & Machine Learning</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Advanced neural networks for financial pattern recognition</li>
                      <li>• Real-time market data integration and analysis</li>
                      <li>• Predictive modeling for scenario planning</li>
                      <li>• Natural language processing for intelligent recommendations</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-green-700">Security & Privacy</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Client-side calculations for maximum privacy</li>
                      <li>• Enterprise-grade encryption for all data transmission</li>
                      <li>• GDPR and privacy regulation compliance</li>
                      <li>• Regular security audits and vulnerability assessments</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-purple-700">Performance & Reliability</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Global CDN for lightning-fast loading times</li>
                      <li>• 99.9% uptime guarantee with redundant infrastructure</li>
                      <li>• Progressive Web App technology for mobile optimization</li>
                      <li>• Real-time calculation validation and error checking</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-red-700">Data Integration</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>• Live integration with central bank interest rates</li>
                      <li>• Automated regulatory and tax code updates</li>
                      <li>• Real-time currency exchange rate feeds</li>
                      <li>• Economic indicator and market trend analysis</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updated Stats */}
          <div className="bg-gradient-to-r from-primary/5 to-purple-100 rounded-lg p-8 text-center mb-16">
            <h3 className="text-2xl font-bold mb-8">SmartCalculatorHub Features</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary">4</div>
                <div className="text-sm text-muted-foreground">Countries Supported</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">AI-Enhanced Calculators</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available Access</div>
              </div>
            </div>
          </div>

          {/* Contact and Trust */}
          <Card>
            <CardHeader>
              <CardTitle>Join the Financial Intelligence Revolution</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6 leading-relaxed">
                Whether you're planning your first home purchase, optimizing your investment portfolio, or preparing 
                for retirement, SmartCalculatorHub's AI-powered tools are here to assist you with financial estimates 
                and insights. Our calculators are designed to help you explore different financial scenarios.
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Important Disclaimer</p>
                <p className="text-sm text-yellow-800">
                  The calculators and AI analysis provided on this website are for informational and educational purposes only. 
                  They should not be considered as professional financial, tax, legal, or investment advice. Results are estimates 
                  based on the information you provide and may not reflect actual outcomes. Always consult with qualified professionals 
                  before making important financial decisions.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Why Users Choose SmartCalculatorHub:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Country-specific calculation tools</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">AI-powered insights and recommendations</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Complete privacy and security</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Always free, no hidden costs</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Real-time market data integration</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <span className="text-sm">Mobile-optimized for calculations on-the-go</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}