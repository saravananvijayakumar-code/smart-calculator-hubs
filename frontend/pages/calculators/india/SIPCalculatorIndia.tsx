import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  Info, 
  BarChart3, 
  DollarSign, 
  Sparkles,
  Target,
  Rocket,
  Zap,
  Gift,
  Brain,
  LineChart,
  Wallet,
  TrendingDown,
  Award,
  ChevronRight
} from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';

const SIPCalculatorIndia: React.FC = () => {
  const [sipAmount, setSipAmount] = useState<string>('');
  const [sipPeriod, setSipPeriod] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<string>('12');
  const [sipType, setSipType] = useState<string>('monthly');
  const [stepUpPercentage, setStepUpPercentage] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const calculateSIP = () => {
    const amount = parseFloat(sipAmount);
    const years = parseFloat(sipPeriod);
    const annualReturn = parseFloat(expectedReturn) / 100;
    const stepUp = parseFloat(stepUpPercentage) / 100 || 0;

    if (!amount || !years || !annualReturn) return;

    const monthlyReturn = annualReturn / 12;
    const totalMonths = years * 12;

    let maturityAmount = 0;
    let totalInvestment = 0;
    let currentSIPAmount = amount;

    if (stepUp > 0) {
      for (let year = 1; year <= years; year++) {
        const monthsInYear = 12;
        for (let month = 1; month <= monthsInYear; month++) {
          const remainingMonths = totalMonths - ((year - 1) * 12 + month - 1);
          maturityAmount += currentSIPAmount * Math.pow(1 + monthlyReturn, remainingMonths);
          totalInvestment += currentSIPAmount;
        }
        currentSIPAmount = currentSIPAmount * (1 + stepUp);
      }
    } else {
      maturityAmount = amount * (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn * (1 + monthlyReturn);
      totalInvestment = amount * totalMonths;
    }

    const wealthGained = maturityAmount - totalInvestment;
    const absoluteReturn = ((maturityAmount - totalInvestment) / totalInvestment) * 100;
    const cagrReturn = Math.pow(maturityAmount / totalInvestment, 1 / years) - 1;

    const ltcgTax = Math.max(0, (wealthGained - 100000) * 0.1);
    const netAmount = maturityAmount - ltcgTax;

    const fdReturns = totalInvestment * Math.pow(1.065, years);
    const ppfReturns = amount * 12 * (Math.pow(1.075, years) - 1) / 0.075;

    setResults({
      maturityAmount,
      totalInvestment,
      wealthGained,
      absoluteReturn,
      cagrReturn: cagrReturn * 100,
      ltcgTax,
      netAmount,
      fdReturns,
      ppfReturns,
      sipAdvantage: maturityAmount - fdReturns
    });
  };

  const reset = () => {
    setSipAmount('');
    setSipPeriod('');
    setExpectedReturn('12');
    setSipType('monthly');
    setStepUpPercentage('');
    setResults(null);
    setShowAIAnalysis(false);
  };

  const tips = [
    "SIP averages out market volatility through rupee cost averaging",
    "ELSS funds offer tax benefits under Section 80C with 3-year lock-in",
    "Step-up SIP increases investment amount annually for better returns",
    "Long-term equity gains (>1 year) taxed at 10% above ₹1 lakh",
    "Start early to leverage the power of compounding"
  ];

  return (
    <CalculatorLayoutWithAds
      title="India SIP Calculator - Mutual Fund Investment Planner 2024"
      description="Calculate your Systematic Investment Plan (SIP) returns and wealth creation potential in India with step-up options, tax calculations, and AI-powered insights"
      keywords="India SIP calculator, mutual fund SIP, systematic investment plan, SIP returns, ELSS calculator, step-up SIP, SIP tax calculator"
      tips={tips}
    >
      <div className="space-y-8">
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-3xl p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl animate-bounce">
              <Rocket className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">SIP Investment Calculator</h1>
              <p className="text-white/90 text-lg">Plan Your Wealth Journey with Smart SIP Investing! 🚀</p>
            </div>
          </div>
          <p className="text-white/80 text-base leading-relaxed">
            Transform your financial future with disciplined SIP investing. Watch your wealth grow exponentially 
            through the power of compounding and rupee cost averaging!
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-2 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] animate-slide-in-left">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="p-2 bg-purple-500 text-white rounded-xl">
                  <BarChart3 className="h-6 w-6" />
                </div>
                SIP Calculator
              </CardTitle>
              <CardDescription className="text-base">
                Calculate your SIP returns and investment growth 💰
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-3 group">
                <Label htmlFor="sipAmount" className="text-base font-semibold flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-purple-500" />
                  Monthly SIP Amount (₹)
                </Label>
                <Input
                  id="sipAmount"
                  type="number"
                  placeholder="e.g., 5000"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(e.target.value)}
                  className="border-2 border-purple-200 focus:border-purple-500 transition-all h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">💡 Even small amounts grow significantly over time!</p>
              </div>

              <div className="space-y-3 group">
                <Label htmlFor="sipPeriod" className="text-base font-semibold flex items-center gap-2">
                  <Target className="h-4 w-4 text-pink-500" />
                  Investment Period (Years)
                </Label>
                <Input
                  id="sipPeriod"
                  type="number"
                  placeholder="e.g., 10"
                  value={sipPeriod}
                  onChange={(e) => setSipPeriod(e.target.value)}
                  className="border-2 border-pink-200 focus:border-pink-500 transition-all h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">⏰ Longer periods = Greater compounding magic!</p>
              </div>

              <div className="space-y-3 group">
                <Label htmlFor="expectedReturn" className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  Expected Annual Return (%)
                </Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 12"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="border-2 border-orange-200 focus:border-orange-500 transition-all h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">📈 Equity funds historically average 12-15% annually</p>
              </div>

              <div className="space-y-3 group">
                <Label htmlFor="sipType" className="text-base font-semibold flex items-center gap-2">
                  <Zap className="h-4 w-4 text-blue-500" />
                  SIP Frequency
                </Label>
                <Select value={sipType} onValueChange={setSipType}>
                  <SelectTrigger className="border-2 border-blue-200 focus:border-blue-500 h-12 text-lg">
                    <SelectValue placeholder="Select SIP frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">💫 Monthly SIP</SelectItem>
                    <SelectItem value="quarterly">📅 Quarterly SIP</SelectItem>
                    <SelectItem value="yearly">🎯 Yearly SIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 group">
                <Label htmlFor="stepUpPercentage" className="text-base font-semibold flex items-center gap-2">
                  <Gift className="h-4 w-4 text-green-500" />
                  Annual Step-up (%)
                </Label>
                <Input
                  id="stepUpPercentage"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 10 (optional)"
                  value={stepUpPercentage}
                  onChange={(e) => setStepUpPercentage(e.target.value)}
                  className="border-2 border-green-200 focus:border-green-500 transition-all h-12 text-lg"
                />
                <p className="text-xs text-muted-foreground">🚀 Boost returns by increasing SIP amount yearly!</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={calculateSIP} 
                  className="flex-1 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Returns
                </Button>
                <Button 
                  onClick={reset} 
                  variant="outline" 
                  className="h-14 px-6 border-2 border-gray-300 hover:bg-gray-100 transition-all"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {results && (
            <Card className="border-2 border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 animate-slide-in-right">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <div className="p-2 bg-green-500 text-white rounded-xl animate-pulse">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  Your SIP Projection
                </CardTitle>
                <CardDescription className="text-base">
                  Watch your wealth grow! 📊✨
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl border-2 border-green-200 transform hover:scale-105 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-5 w-5 text-green-600" />
                      <p className="text-sm font-medium text-green-800">Maturity Amount</p>
                    </div>
                    <p className="text-2xl font-bold text-green-700">₹{Math.round(results.maturityAmount).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl border-2 border-blue-200 transform hover:scale-105 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      <p className="text-sm font-medium text-blue-800">Total Investment</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-700">₹{Math.round(results.totalInvestment).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl border-2 border-purple-200 transform hover:scale-105 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <p className="text-sm font-medium text-purple-800">Wealth Gained</p>
                    </div>
                    <p className="text-2xl font-bold text-purple-700">₹{Math.round(results.wealthGained).toLocaleString('en-IN')}</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl border-2 border-orange-200 transform hover:scale-105 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <LineChart className="h-5 w-5 text-orange-600" />
                      <p className="text-sm font-medium text-orange-800">CAGR Returns</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{results.cagrReturn.toFixed(2)}%</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="space-y-4 p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border-2 border-amber-200">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-amber-600" />
                    Tax Implications
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-xl">
                      <span className="text-sm font-medium">LTCG Tax (10%):</span>
                      <Badge variant="outline" className="text-base font-semibold">₹{Math.round(results.ltcgTax).toLocaleString('en-IN')}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg">
                      <span className="text-sm font-semibold">Net Amount (After Tax):</span>
                      <span className="text-xl font-bold">₹{Math.round(results.netAmount).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
                  <h4 className="font-bold text-lg flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Comparison with Other Investments
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-white rounded-xl border border-blue-200">
                      <p className="text-xs text-muted-foreground mb-1">Fixed Deposit (6.5%)</p>
                      <p className="font-bold text-lg">₹{Math.round(results.fdReturns).toLocaleString('en-IN')}</p>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-200">
                      <p className="text-xs text-muted-foreground mb-1">PPF (7.5%)</p>
                      <p className="font-bold text-lg">₹{Math.round(results.ppfReturns).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl shadow-lg mt-3">
                    <span className="text-sm font-semibold flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      SIP Advantage over FD:
                    </span>
                    <span className="text-xl font-bold">₹{Math.round(results.sipAdvantage).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {results && (
          <div className="space-y-6 animate-fade-in">
            <Card className="border-2 border-indigo-200 shadow-xl">
              <CardContent className="p-6">
                <Button
                  onClick={() => setShowAIAnalysis(!showAIAnalysis)}
                  className="w-full h-16 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]"
                >
                  <Brain className="mr-3 h-6 w-6 animate-pulse" />
                  {showAIAnalysis ? '🔒 Hide AI Analysis' : '✨ Get AI-Powered Investment Insights'}
                  <ChevronRight className={`ml-3 h-5 w-5 transition-transform ${showAIAnalysis ? 'rotate-90' : ''}`} />
                </Button>
              </CardContent>
            </Card>

            {showAIAnalysis && (
              <div className="animate-slide-in-up">
                <EnhancedAIAnalysis
                  calculatorType="sip-calculator-india"
                  data={{
                    monthlyInvestment: parseFloat(sipAmount),
                    expectedReturn: parseFloat(expectedReturn),
                    years: parseFloat(sipPeriod),
                    finalAmount: results.maturityAmount,
                    totalInvestment: results.totalInvestment,
                    wealthGained: results.wealthGained
                  }}
                  className="mt-6"
                />
              </div>
            )}
          </div>
        )}

        <Card className="mt-8 border-2 border-purple-200 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-purple-100">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-purple-500 text-white rounded-xl">
                <Info className="h-6 w-6" />
              </div>
              Understanding Systematic Investment Plans (SIP) in India 🇮🇳
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none pt-8 pb-8 space-y-8 text-base leading-relaxed">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
              <p className="text-lg leading-relaxed">
                <strong className="text-blue-700">Systematic Investment Plans (SIPs)</strong> have revolutionized investment behavior in India, making mutual fund 
                investments accessible to millions of Indians through disciplined, periodic investing. This powerful 
                investment strategy leverages the principles of <strong>compounding</strong> and <strong>rupee cost averaging</strong> to help investors 
                build substantial wealth over time, regardless of market volatility and timing considerations that 
                typically intimidate first-time investors. 🚀💰
              </p>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-purple-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-purple-700 mb-3 flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  The SIP Investment Philosophy
                </h3>
                <p className="text-lg">
                  SIP embodies the philosophy of disciplined, long-term wealth creation through regular investments in 
                  mutual funds. Unlike lump-sum investing, <strong>SIPs allow investors to invest fixed amounts at regular intervals</strong>, 
                  typically monthly, reducing the impact of market volatility through rupee cost averaging. This approach 
                  helps investors buy more units when markets are low and fewer units when markets are high, potentially 
                  lowering the average cost per unit over time. Think of it as your personal wealth-building autopilot! ✈️💎
                </p>
                <div className="mt-4 p-4 bg-purple-100 rounded-xl">
                  <p className="text-sm font-semibold text-purple-800">
                    💡 Pro Tip: Set up auto-debit to ensure you never miss a SIP installment. Consistency is the key to maximizing returns!
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-green-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-green-700 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Power of Compounding in SIPs
                </h3>
                <p className="text-lg">
                  The true magic of SIPs lies in harnessing the <strong className="text-green-600">power of compounding</strong>, where returns generated on investments 
                  are reinvested to generate additional returns. Over long periods, this compounding effect can create 
                  exponential wealth growth. For instance, investing ₹5,000 monthly for 20 years at 12% annual returns 
                  could potentially grow to over <strong className="text-2xl text-green-600">₹50 lakhs</strong>, with more than half coming from compounding rather than 
                  principal contributions! 🌟
                </p>
                <div className="mt-4 p-5 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-2">
                    <Award className="h-6 w-6 text-green-600" />
                    <p className="font-bold text-green-800 text-lg">The Eighth Wonder of the World</p>
                  </div>
                  <p className="text-sm text-green-700">
                    Albert Einstein famously called compound interest "the eighth wonder of the world." Those who understand it, earn it; 
                    those who don't, pay it. Start your SIP today and let compounding work its magic for you!
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-orange-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-orange-700 mb-3 flex items-center gap-2">
                  <Target className="h-6 w-6" />
                  Rupee Cost Averaging Advantage
                </h3>
                <p className="text-lg">
                  SIPs automatically implement <strong className="text-orange-600">rupee cost averaging</strong>, a strategy that helps reduce the average cost of 
                  investment over time. When market prices fall, your fixed SIP amount buys more units; when prices rise, 
                  it buys fewer units. This mechanism helps smooth out market volatility and reduces the risk of making 
                  poorly timed investment decisions. Over long periods, this averaging effect can significantly enhance 
                  overall returns compared to attempting to time the market. 📈⚖️
                </p>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-100 rounded-xl border-2 border-red-300">
                    <p className="font-bold text-red-700 mb-2 flex items-center gap-2">
                      <TrendingDown className="h-5 w-5" />
                      Market Down
                    </p>
                    <p className="text-sm text-red-600">Buy MORE units with same amount 📉➡️🛒</p>
                  </div>
                  <div className="p-4 bg-green-100 rounded-xl border-2 border-green-300">
                    <p className="font-bold text-green-700 mb-2 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Market Up
                    </p>
                    <p className="text-sm text-green-600">Buy FEWER units with same amount 📈➡️🎯</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-pink-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-pink-700 mb-3 flex items-center gap-2">
                  <Gift className="h-6 w-6" />
                  Tax Efficiency and ELSS Benefits
                </h3>
                <p className="text-lg">
                  SIPs in <strong className="text-pink-600">Equity Linked Savings Schemes (ELSS)</strong> provide triple benefits: potential for higher returns, 
                  tax deduction under <strong>Section 80C</strong> up to ₹1.5 lakh annually, and shorter lock-in period of just <strong>three years</strong> 
                  compared to other tax-saving instruments. Long-term capital gains from equity mutual funds are taxed at 
                  10% only on gains exceeding ₹1 lakh annually, making SIPs highly tax-efficient for wealth creation. 💸✨
                </p>
                <div className="mt-4 p-5 bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl border-2 border-pink-300">
                  <p className="font-bold text-pink-800 text-lg mb-3">🎁 Triple Tax Advantage</p>
                  <ul className="space-y-2 text-sm text-pink-700">
                    <li className="flex items-center gap-2">
                      <Badge className="bg-pink-500">1</Badge>
                      Tax deduction on investment (Section 80C) - Save up to ₹46,800 annually!
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-pink-500">2</Badge>
                      Tax-free growth during investment period
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge className="bg-pink-500">3</Badge>
                      Concessional tax on LTCG (10% above ₹1 lakh)
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-blue-700 mb-3 flex items-center gap-2">
                  <Rocket className="h-6 w-6" />
                  Step-up SIPs for Inflation Protection
                </h3>
                <p className="text-lg">
                  <strong className="text-blue-600">Step-up SIPs</strong> allow investors to increase their SIP amount periodically, typically annually, to combat 
                  inflation and enhance wealth creation. As incomes grow, increasing SIP contributions by 10-15% annually 
                  can dramatically improve long-term wealth accumulation. This strategy ensures that your investment keeps 
                  pace with income growth and inflation, maintaining the real purchasing power of your wealth over time. 
                  Start small, grow big! 🌱➡️🌳
                </p>
                <div className="mt-4 p-5 bg-blue-100 rounded-xl border-2 border-blue-300">
                  <p className="font-bold text-blue-800 mb-3">🚀 Example: Step-up SIP Impact</p>
                  <div className="space-y-2 text-sm text-blue-700">
                    <p>Starting SIP: ₹5,000/month with 10% annual step-up</p>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-white p-2 rounded">Year 1: ₹5,000</div>
                      <div className="bg-white p-2 rounded">Year 5: ₹7,321</div>
                      <div className="bg-white p-2 rounded">Year 10: ₹11,796</div>
                    </div>
                    <p className="mt-2 font-semibold text-blue-900">
                      Result: 2.36x more corpus compared to regular SIP! 💪
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-indigo-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-indigo-700 mb-3 flex items-center gap-2">
                  <Zap className="h-6 w-6" />
                  Flexibility and Investor Control
                </h3>
                <p className="text-lg">
                  Modern SIP offerings provide remarkable flexibility, allowing investors to <strong className="text-indigo-600">pause, modify, or stop SIPs</strong> 
                  based on changing financial circumstances. Features like SIP top-ups, flexible SIP amounts, and partial 
                  withdrawals provide investors with control over their investments. Additionally, investors can start 
                  multiple SIPs across different fund categories to create diversified portfolios aligned with their 
                  risk tolerance and financial goals. Your money, your rules! 🎮💼
                </p>
              </div>

              <div className="border-l-4 border-cyan-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-cyan-700 mb-3 flex items-center gap-2">
                  <Award className="h-6 w-6" />
                  Technology and Digital SIP Management
                </h3>
                <p className="text-lg">
                  Digital platforms and mobile apps have transformed SIP investing, making it possible to start, monitor, 
                  and manage SIPs entirely online. Features like <strong className="text-cyan-600">goal-based investing</strong>, automated portfolio rebalancing, 
                  and real-time portfolio tracking have made SIP investing more accessible and user-friendly. Investors 
                  can now set up SIPs in minutes and track their progress toward specific financial goals through 
                  intuitive digital interfaces. The future of investing is in your pocket! 📱💎
                </p>
                <div className="mt-4 p-5 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-xl border-2 border-cyan-300">
                  <p className="font-bold text-cyan-800 text-lg mb-3">📱 Digital SIP Advantages</p>
                  <ul className="grid grid-cols-2 gap-3 text-sm text-cyan-700">
                    <li className="flex items-center gap-2">✅ Instant KYC verification</li>
                    <li className="flex items-center gap-2">✅ Real-time portfolio tracking</li>
                    <li className="flex items-center gap-2">✅ Paperless transactions</li>
                    <li className="flex items-center gap-2">✅ Goal-based planning tools</li>
                    <li className="flex items-center gap-2">✅ Auto-debit facility</li>
                    <li className="flex items-center gap-2">✅ Easy fund switching</li>
                  </ul>
                </div>
              </div>

              <div className="border-l-4 border-teal-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-teal-700 mb-3 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  Asset Allocation Through Multiple SIPs
                </h3>
                <p className="text-lg">
                  Strategic investors use multiple SIPs across different asset classes and fund categories to create 
                  well-diversified portfolios. A typical strategy might include SIPs in <strong className="text-teal-600">large-cap funds</strong> for stability, 
                  <strong className="text-teal-600"> mid-cap funds</strong> for growth, <strong className="text-teal-600">international funds</strong> for global diversification, and <strong className="text-teal-600">debt funds</strong> for stability. 
                  This approach allows investors to benefit from different market cycles and asset class performances 
                  while maintaining overall portfolio balance. Don't put all eggs in one basket! 🧺🥚
                </p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-4 bg-green-100 rounded-xl border-2 border-green-300 text-center">
                    <p className="font-bold text-green-700">Large Cap</p>
                    <p className="text-xs text-green-600 mt-1">30-40%</p>
                    <p className="text-xs">Stability 🛡️</p>
                  </div>
                  <div className="p-4 bg-blue-100 rounded-xl border-2 border-blue-300 text-center">
                    <p className="font-bold text-blue-700">Mid Cap</p>
                    <p className="text-xs text-blue-600 mt-1">20-30%</p>
                    <p className="text-xs">Growth 📈</p>
                  </div>
                  <div className="p-4 bg-purple-100 rounded-xl border-2 border-purple-300 text-center">
                    <p className="font-bold text-purple-700">International</p>
                    <p className="text-xs text-purple-600 mt-1">10-20%</p>
                    <p className="text-xs">Global 🌍</p>
                  </div>
                  <div className="p-4 bg-orange-100 rounded-xl border-2 border-orange-300 text-center">
                    <p className="font-bold text-orange-700">Debt</p>
                    <p className="text-xs text-orange-600 mt-1">20-30%</p>
                    <p className="text-xs">Safety 🔒</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-amber-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-amber-700 mb-3 flex items-center gap-2">
                  <LineChart className="h-6 w-6" />
                  SIP vs. Traditional Investments
                </h3>
                <p className="text-lg">
                  Compared to traditional investment options like <strong>fixed deposits, NSC, or PPF</strong>, SIPs in equity mutual funds 
                  have historically delivered superior inflation-adjusted returns over long periods. While traditional 
                  investments offer capital protection, they often fail to beat inflation in real terms. SIPs, though 
                  subject to market risks, have the potential to create substantial wealth and maintain purchasing power 
                  over long investment horizons. The choice between safety and growth is yours! 🏦 vs 📈
                </p>
                <div className="mt-4 p-5 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-300">
                  <p className="font-bold text-amber-800 text-lg mb-3">📊 Historical Returns Comparison (20-year average)</p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-semibold">Equity Mutual Funds (SIP)</span>
                      <Badge className="bg-green-500 text-white text-base">12-15%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-semibold">Public Provident Fund (PPF)</span>
                      <Badge className="bg-blue-500 text-white text-base">7-8%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-semibold">Fixed Deposit (FD)</span>
                      <Badge className="bg-orange-500 text-white text-base">6-7%</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="font-semibold">Inflation Rate</span>
                      <Badge className="bg-red-500 text-white text-base">5-6%</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-amber-700 mt-3">
                    ⚠️ Past performance is not indicative of future results. Market-linked investments carry risk.
                  </p>
                </div>
              </div>

              <div className="border-l-4 border-rose-500 pl-6 py-2">
                <h3 className="text-2xl font-bold text-rose-700 mb-3 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  Behavioral Benefits and Financial Discipline
                </h3>
                <p className="text-lg">
                  SIPs promote <strong className="text-rose-600">financial discipline</strong> by automating the investment process, removing emotional decision-making 
                  from investing. The automated nature of SIPs helps investors stay committed to their financial goals 
                  regardless of market conditions or personal biases. This behavioral advantage often proves more valuable 
                  than the mathematical benefits, as it ensures consistent wealth creation habits that compound over time 
                  to build substantial financial assets. Set it and forget it (but review periodically)! 🧠💪
                </p>
                <div className="mt-4 p-5 bg-gradient-to-r from-rose-100 to-pink-100 rounded-xl border-2 border-rose-300">
                  <p className="font-bold text-rose-800 text-lg mb-3">🎯 The Psychology of SIP Success</p>
                  <ul className="space-y-2 text-sm text-rose-700">
                    <li className="flex items-start gap-2">
                      <Badge className="bg-rose-500 text-white mt-0.5">1</Badge>
                      <span><strong>Removes emotion:</strong> No panic selling during market crashes or greed buying during rallies</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-rose-500 text-white mt-0.5">2</Badge>
                      <span><strong>Builds habit:</strong> Regular investing becomes automatic, like brushing teeth!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-rose-500 text-white mt-0.5">3</Badge>
                      <span><strong>Prevents procrastination:</strong> Start small today rather than waiting for "perfect" timing</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge className="bg-rose-500 text-white mt-0.5">4</Badge>
                      <span><strong>Creates accountability:</strong> Auto-debit ensures commitment to financial goals</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-8 rounded-3xl shadow-2xl">
                <h3 className="text-3xl font-bold mb-4 flex items-center gap-3">
                  <Rocket className="h-8 w-8" />
                  Start Your SIP Journey Today!
                </h3>
                <p className="text-lg leading-relaxed mb-4">
                  Whether you're saving for retirement, your child's education, buying a home, or building an emergency fund, 
                  SIPs offer a flexible, disciplined, and tax-efficient way to achieve your financial goals. The best time 
                  to start was yesterday, the next best time is TODAY! 🌟
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <p className="font-bold text-xl mb-2">Start Small</p>
                    <p className="text-sm">Begin with as little as ₹500/month</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <p className="font-bold text-xl mb-2">Stay Consistent</p>
                    <p className="text-sm">Never miss a SIP installment</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-xl">
                    <p className="font-bold text-xl mb-2">Think Long-term</p>
                    <p className="text-sm">Minimum 5-10 years for best results</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {results && (
          <div className="mt-8 animate-fade-in">
            <ExportShareButtons
              calculatorType="sip-calculator-india"
              inputs={{
                sipAmount,
                sipPeriod,
                expectedReturn,
                sipType,
                stepUpPercentage
              }}
              results={results}
              title="SIP Investment Returns Estimate"
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out;
        }
      `}</style>
    </CalculatorLayoutWithAds>
  );
};

export default SIPCalculatorIndia;
