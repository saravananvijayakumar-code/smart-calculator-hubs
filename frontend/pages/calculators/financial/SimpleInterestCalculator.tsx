import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Calculator, TrendingUp, DollarSign, Clock, BookOpen, Target, AlertCircle, Lightbulb, Sparkles, Zap, Award, TrendingDown, Wallet } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface SimpleInterestResult {
  interest: number;
  totalAmount: number;
  isValid: boolean;
  monthlyInterest: number;
  effectiveRate: number;
}

interface Scenario {
  name: string;
  principal: string;
  rate: string;
  time: string;
  description: string;
}

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<SimpleInterestResult>({
    interest: 0,
    totalAmount: 0,
    isValid: false,
    monthlyInterest: 0,
    effectiveRate: 0
  });

  const scenarios: Scenario[] = [
    {
      name: "Emergency Fund",
      principal: "10000",
      rate: "2.5",
      time: "1",
      description: "Emergency fund in a high-yield savings account"
    },
    {
      name: "Short-term Loan",
      principal: "5000",
      rate: "8",
      time: "0.5",
      description: "6-month personal loan calculation"
    },
    {
      name: "Certificate of Deposit",
      principal: "25000",
      rate: "4.2",
      time: "2",
      description: "2-year CD investment"
    },
    {
      name: "Treasury Bill",
      principal: "1000",
      rate: "5.1",
      time: "0.25",
      description: "3-month Treasury bill investment"
    }
  ];

  useEffect(() => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);

    if (p > 0 && r >= 0 && t > 0) {
      const interest = (p * r * t) / 100;
      const totalAmount = p + interest;
      const monthlyInterest = interest / (t * 12);
      const effectiveRate = (interest / p) * 100;
      
      setResult({
        interest,
        totalAmount,
        isValid: true,
        monthlyInterest,
        effectiveRate
      });
    } else {
      setResult({
        interest: 0,
        totalAmount: 0,
        isValid: false,
        monthlyInterest: 0,
        effectiveRate: 0
      });
    }
  }, [principal, rate, time]);

  const loadScenario = (scenario: Scenario) => {
    setPrincipal(scenario.principal);
    setRate(scenario.rate);
    setTime(scenario.time);
  };

  const clearInputs = () => {
    setPrincipal('');
    setRate('');
    setTime('');
  };

  const tips = [
    "Simple interest is calculated only on the principal amount, never on accumulated interest",
    "Rate should be entered as an annual percentage (e.g., 5 for 5% per year)",
    "Time can be in years or fractions of years (e.g., 0.5 for 6 months)",
    "Simple interest doesn't compound - it remains linear over time",
    "Commonly used for short-term loans, basic savings accounts, and government bonds",
    "Formula: Interest = Principal × Rate × Time ÷ 100",
    "Unlike compound interest, simple interest doesn't accelerate over time",
    "Perfect for comparing different loan or investment options quickly"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Simple Interest Calculator - Calculate Interest Earnings & Loan Costs"
      description="Calculate simple interest for loans, savings, and investments. Compare scenarios, understand formulas, and make informed financial decisions with our comprehensive calculator."
      keywords="simple interest calculator, interest calculation, financial calculator, loan interest, savings interest, investment calculator"
      tips={tips}
    >
      <div className="space-y-6">
        {/* Main Calculator */}
        <div className="text-center space-y-4 animate-fade-in mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <Calculator className="w-10 h-10 text-green-600 animate-bounce" />
            Simple Interest Calculator 💰
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master your money math! Calculate interest earnings and loan costs with crystal-clear precision. Perfect for savings, loans, and smart financial planning! 🎯✨
          </p>
        </div>

        <Card className="shadow-2xl border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 animate-pulse"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Calculator className="h-6 w-6 text-green-600 animate-pulse" />
              Simple Interest Calculator
              <Badge className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white animate-pulse">
                Live Calculator
              </Badge>
            </CardTitle>
            <p className="text-base text-gray-700 dark:text-gray-300">
              Calculate interest using the formula: <span className="font-mono bg-white/60 dark:bg-gray-800/60 px-2 py-1 rounded">Interest = Principal × Rate × Time ÷ 100</span>
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="principal" className="flex items-center gap-2 text-base font-semibold">
                  <DollarSign className="h-5 w-5 text-green-600 animate-pulse" />
                  Principal Amount ($)
                </Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="Enter principal amount"
                  min="0"
                  step="0.01"
                  className="mt-1 h-12 text-base border-2 hover:border-green-400 focus:border-green-500 transition-all"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  💵 The initial amount invested or borrowed
                </p>
              </div>
              <div>
                <Label htmlFor="rate" className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-blue-600 animate-bounce" />
                  Annual Interest Rate (%)
                </Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="Enter interest rate"
                  min="0"
                  step="0.1"
                  className="mt-1 h-12 text-base border-2 hover:border-blue-400 focus:border-blue-500 transition-all"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  📈 The yearly interest rate as a percentage
                </p>
              </div>
              <div>
                <Label htmlFor="time" className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-5 w-5 text-purple-600 animate-pulse" />
                  Time Period (Years)
                </Label>
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Enter time period"
                  min="0"
                  step="0.1"
                  className="mt-1 h-12 text-base border-2 hover:border-purple-400 focus:border-purple-500 transition-all"
                />
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  ⏰ Duration in years (e.g., 0.5 for 6 months)
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={clearInputs} variant="outline" size="sm" className="hover:bg-red-50 hover:text-red-600 hover:border-red-400 transition-all transform hover:scale-105">
                <Zap className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>

            {result.isValid && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 transform hover:scale-105 transition-all hover:shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-green-600 animate-bounce" />
                      <span className="text-sm font-semibold text-green-800 dark:text-green-200">Interest Earned</span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent animate-pulse">
                      ${result.interest.toFixed(2)}
                    </p>
                    <Progress value={100} className="mt-2 h-2 bg-green-200" />
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 transform hover:scale-105 transition-all hover:shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-blue-600 animate-pulse" />
                      <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Total Amount</span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-pulse">
                      ${result.totalAmount.toFixed(2)}
                    </p>
                    <Progress value={100} className="mt-2 h-2 bg-blue-200" />
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 transform hover:scale-105 transition-all hover:shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-purple-600 animate-bounce" />
                      <span className="text-sm font-semibold text-purple-800 dark:text-purple-200">Monthly Interest</span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                      ${result.monthlyInterest.toFixed(2)}
                    </p>
                    <Progress value={100} className="mt-2 h-2 bg-purple-200" />
                  </Card>
                  <Card className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-200 dark:border-orange-800 transform hover:scale-105 transition-all hover:shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-orange-600 animate-pulse" />
                      <span className="text-sm font-semibold text-orange-800 dark:text-orange-200">Effective Rate</span>
                    </div>
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent animate-pulse">
                      {result.effectiveRate.toFixed(2)}%
                    </p>
                    <Progress value={result.effectiveRate} className="mt-2 h-2 bg-orange-200" />
                  </Card>
                </div>

                <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg">
                  <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    Calculation Breakdown
                  </h4>
                  <div className="space-y-3 text-base">
                    <p className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg"><strong className="text-indigo-600">📐 Formula:</strong> <span className="font-mono">Interest = Principal × Rate × Time ÷ 100</span></p>
                    <p className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg"><strong className="text-purple-600">🔢 Calculation:</strong> <span className="font-mono">${principal} × {rate}% × {time} years ÷ 100 = ${result.interest.toFixed(2)}</span></p>
                    <p className="bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg"><strong className="text-pink-600">💰 Total:</strong> <span className="font-mono">${principal} + ${result.interest.toFixed(2)} = ${result.totalAmount.toFixed(2)}</span></p>
                  </div>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Educational Content Tabs */}
        <Tabs defaultValue="scenarios" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scenarios">Scenarios</TabsTrigger>
            <TabsTrigger value="guide">How It Works</TabsTrigger>
            <TabsTrigger value="comparison">vs Compound</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Common Financial Scenarios
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Explore real-world examples of simple interest calculations
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scenarios.map((scenario, index) => (
                    <Card key={index} className="p-4 cursor-pointer bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 hover:shadow-xl transition-all transform hover:scale-105 border-2 border-blue-200 dark:border-blue-800"
                          onClick={() => loadScenario(scenario)}>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-blue-700 dark:text-blue-300">{scenario.name}</h4>
                          <Badge variant="outline" className="bg-blue-600 text-white border-0 animate-pulse">Click to Load</Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{scenario.description}</p>
                        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>💵 ${scenario.principal}</span>
                          <span>📈 {scenario.rate}%</span>
                          <span>⏰ {scenario.time}yr</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Understanding Simple Interest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What is Simple Interest?</h4>
                    <p className="text-sm text-muted-foreground">
                      Simple interest is a method of calculating interest where the interest is computed only on the principal amount. 
                      Unlike compound interest, it doesn't include interest on previously earned interest, making calculations straightforward and predictable.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">The Formula Explained</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <p className="font-mono text-center text-lg mb-2">Interest = (Principal × Rate × Time) ÷ 100</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <strong>Principal (P):</strong> The initial amount of money invested or borrowed
                        </div>
                        <div>
                          <strong>Rate (R):</strong> The annual interest rate expressed as a percentage
                        </div>
                        <div>
                          <strong>Time (T):</strong> The duration for which the money is invested or borrowed, in years
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Step-by-Step Calculation</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">1</Badge>
                        <span>Identify the principal amount (P)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">2</Badge>
                        <span>Determine the annual interest rate (R) as a percentage</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">3</Badge>
                        <span>Calculate the time period (T) in years</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">4</Badge>
                        <span>Apply the formula: Interest = (P × R × T) ÷ 100</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">5</Badge>
                        <span>Add interest to principal for total amount</span>
                      </div>
                    </div>
                  </div>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Important Note:</strong> Simple interest is linear - it remains constant over each time period. 
                      This makes it easier to calculate but typically results in lower returns compared to compound interest over longer periods.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Simple vs Compound Interest
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600">Simple Interest</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span>Calculated only on principal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span>Linear growth over time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span>Easy to calculate manually</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span>Predictable returns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-green-600">✓</Badge>
                        <span>Common in short-term loans</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-600">Compound Interest</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600">✓</Badge>
                        <span>Calculated on principal + interest</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600">✓</Badge>
                        <span>Exponential growth over time</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600">✓</Badge>
                        <span>More complex calculations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600">✓</Badge>
                        <span>Higher long-term returns</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-blue-600">✓</Badge>
                        <span>Standard for investments</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Example Comparison</h4>
                  <p className="text-sm mb-2">Principal: $10,000 | Rate: 5% | Time: 10 years</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Simple Interest:</strong>
                      <p>Interest = $10,000 × 5% × 10 = $5,000</p>
                      <p>Total = $15,000</p>
                    </div>
                    <div>
                      <strong>Compound Interest (Annual):</strong>
                      <p>Total = $10,000 × (1.05)^10 = $16,289</p>
                      <p>Interest = $6,289</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    The difference becomes more significant over longer time periods and higher interest rates. 
                    For short-term financial products, simple interest is often used for its simplicity and transparency.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Real-World Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-600">Investment Applications</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium">Treasury Bills</h5>
                        <p className="text-sm text-muted-foreground">
                          Short-term government securities with simple interest calculations, typically 3-12 months.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium">Fixed Deposits</h5>
                        <p className="text-sm text-muted-foreground">
                          Some banks offer simple interest on fixed deposits, especially for shorter terms.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium">Bonds</h5>
                        <p className="text-sm text-muted-foreground">
                          Many corporate and government bonds use simple interest for coupon payments.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-red-600">Loan Applications</h4>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium">Personal Loans</h5>
                        <p className="text-sm text-muted-foreground">
                          Short-term personal loans often use simple interest, making costs predictable.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium">Auto Loans</h5>
                        <p className="text-sm text-muted-foreground">
                          Some auto financing uses simple interest, particularly for shorter loan terms.
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <h5 className="font-medium">Bridge Loans</h5>
                        <p className="text-sm text-muted-foreground">
                          Short-term financing often uses simple interest due to the brief duration.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Financial Planning Tips</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <h5 className="font-medium text-green-800 dark:text-green-200 mb-2">For Savers</h5>
                      <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                        <li>• Compare simple vs compound interest options</li>
                        <li>• Consider simple interest for short-term goals</li>
                        <li>• Use for emergency fund calculations</li>
                        <li>• Evaluate Treasury bills and CDs</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">For Borrowers</h5>
                      <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• Calculate total loan costs upfront</li>
                        <li>• Compare with compound interest loans</li>
                        <li>• Plan repayment schedules effectively</li>
                        <li>• Understand exact interest obligations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Simple interest is ideal for situations where you need transparency and predictability. 
                    Always compare the total cost or return with compound interest alternatives to make informed decisions.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      {result && result.isValid && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="simple-interest"
            inputs={{ principal, rate, time }}
            results={result}
            title="Simple Interest Calculation"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
}