// @ts-nocheck
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info, TrendingUp, DollarSign, AlertTriangle, Calendar, Zap, Target, Award, Wallet } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import { AutoAdSlot } from '../../../components/ads/AutoAdSlot';
import AmazonAffiliate from '../../../components/ads/AmazonAffiliate';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useFormatting } from '../../../utils/formatting';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface PayoffResult {
  monthsToPayoff: number;
  yearsToPayoff: number;
  totalInterest: number;
  totalPayment: number;
  monthlyInterestPayment: number;
  minimumPayment: number;
  isValid: boolean;
  payoffDate: Date;
  amortizationSchedule?: PaymentScheduleEntry[];
}

interface PaymentScheduleEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remainingBalance: number;
}

interface PayoffComparison {
  minimumPayment: PayoffResult;
  extraPayment: PayoffResult;
  interestSaved: number;
  timeSaved: number;
}

export default function CreditCardPayoffCalculator() {
  const { formatCurrency, parseCurrencyInput, getCurrencySymbol } = useFormatting();
  
  const [balance, setBalance] = useState('');
  const [apr, setApr] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [extraPayment, setExtraPayment] = useState('');
  const [result, setResult] = useState<PayoffResult>({
    monthsToPayoff: 0,
    yearsToPayoff: 0,
    totalInterest: 0,
    totalPayment: 0,
    monthlyInterestPayment: 0,
    minimumPayment: 0,
    isValid: false,
    payoffDate: new Date()
  });
  const [comparison, setComparison] = useState<PayoffComparison | null>(null);

  const calculatePayoff = (currentBalance: number, annualRate: number, payment: number, includeSchedule: boolean = false): PayoffResult => {
    const monthlyRate = annualRate / 100 / 12;
    const minPayment = Math.max(currentBalance * 0.02, currentBalance * monthlyRate + 15);
    
    if (payment <= monthlyRate * currentBalance) {
      return {
        monthsToPayoff: 0,
        yearsToPayoff: 0,
        totalInterest: 0,
        totalPayment: 0,
        monthlyInterestPayment: monthlyRate * currentBalance,
        minimumPayment: minPayment,
        isValid: false,
        payoffDate: new Date()
      };
    }

    let remainingBalance = currentBalance;
    let months = 0;
    let totalInterestPaid = 0;
    const schedule: PaymentScheduleEntry[] = [];

    while (remainingBalance > 0.01 && months < 600) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = Math.min(payment - interestPayment, remainingBalance);
      
      totalInterestPaid += interestPayment;
      remainingBalance -= principalPayment;
      months++;

      if (includeSchedule && (months <= 12 || months % 12 === 0 || remainingBalance <= 0.01)) {
        schedule.push({
          month: months,
          payment: interestPayment + principalPayment,
          principal: principalPayment,
          interest: interestPayment,
          remainingBalance: Math.max(0, remainingBalance)
        });
      }
    }

    const payoffDate = new Date();
    payoffDate.setMonth(payoffDate.getMonth() + months);

    return {
      monthsToPayoff: months,
      yearsToPayoff: months / 12,
      totalInterest: totalInterestPaid,
      totalPayment: currentBalance + totalInterestPaid,
      monthlyInterestPayment: monthlyRate * currentBalance,
      minimumPayment: minPayment,
      isValid: true,
      payoffDate,
      amortizationSchedule: includeSchedule ? schedule : undefined
    };
  };

  useEffect(() => {
    const b = parseFloat(balance);
    const a = parseFloat(apr);
    const p = parseFloat(monthlyPayment);
    const extra = parseFloat(extraPayment) || 0;

    if (b > 0 && a >= 0 && p > 0) {
      const mainResult = calculatePayoff(b, a, p, true);
      setResult(mainResult);

      // Calculate comparison if extra payment is provided
      if (extra > 0 && mainResult.isValid) {
        const minimumResult = calculatePayoff(b, a, mainResult.minimumPayment);
        const extraResult = calculatePayoff(b, a, p + extra);
        
        setComparison({
          minimumPayment: minimumResult,
          extraPayment: extraResult,
          interestSaved: minimumResult.totalInterest - extraResult.totalInterest,
          timeSaved: minimumResult.monthsToPayoff - extraResult.monthsToPayoff
        });
      } else {
        setComparison(null);
      }
    } else {
      setResult({
        monthsToPayoff: 0,
        yearsToPayoff: 0,
        totalInterest: 0,
        totalPayment: 0,
        monthlyInterestPayment: 0,
        minimumPayment: 0,
        isValid: false,
        payoffDate: new Date()
      });
      setComparison(null);
    }
  }, [balance, apr, monthlyPayment, extraPayment]);

  const tips = [
    "Pay more than the minimum to reduce total interest paid",
    "Even small increases in payment can significantly reduce payoff time",
    "High APR credit cards should be prioritized for payoff",
    "Consider balance transfers to lower interest rate cards",
    "Avoid using the card while paying it off to accelerate progress"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Credit Card Payoff Calculator | Debt Payoff Calculator & Interest Calculator"
      description="Calculate exactly how long it takes to pay off credit card debt with our comprehensive payoff calculator. Compare payment strategies, see interest costs, and find the fastest way to become debt-free."
      keywords="credit card payoff calculator, debt payoff calculator, credit card interest calculator, debt elimination, minimum payment calculator, credit card debt calculator"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Credit Card Payoff Calculator</span>
              </CardTitle>
              <Badge variant="outline" className="bg-white/50 dark:bg-gray-900/50">
                <Zap className="h-3 w-3 mr-1" />
                Advanced Analytics
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Calculate your debt payoff timeline and discover how much you can save</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="balance">Current Balance ({getCurrencySymbol()})</Label>
                <Input
                  id="balance"
                  type="number"
                  placeholder="5000"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apr">Annual Interest Rate (%)</Label>
                <Input
                  id="apr"
                  type="number"
                  step="0.01"
                  placeholder="18.99"
                  value={apr}
                  onChange={(e) => setApr(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyPayment">Monthly Payment ({getCurrencySymbol()})</Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  placeholder="200"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="extraPayment">Extra Payment ({getCurrencySymbol()})</Label>
                <Input
                  id="extraPayment"
                  type="number"
                  placeholder="50"
                  value={extraPayment}
                  onChange={(e) => setExtraPayment(e.target.value)}
                />
              </div>
            </div>

            {result.isValid && result.minimumPayment > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900 rounded">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="text-sm font-semibold text-yellow-900 dark:text-yellow-100">
                    Estimated Minimum Payment: {formatCurrency(result.minimumPayment)}
                  </span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 ml-8">
                  Make sure your payment is above the minimum to make progress on your debt.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result.isValid && (
          <div className="space-y-6">
            {/* AI Analysis */}
            <AIAnalysis
              analysisRequest={{
                calculatorType: "credit-card-payoff",
                data: {
                  balance: parseFloat(balance) || 0,
                  apr: parseFloat(apr) || 0,
                  minimumPayment: result.minimumPayment,
                  paymentAmount: parseFloat(monthlyPayment) || 0,
                  timeToPayoff: result.monthsToPayoff,
                  totalInterest: result.totalInterest,
                  totalPayment: result.totalPayment
                }
              }}
              autoRun={true}
              title="AI Debt Payoff Analysis"
              description="Get personalized strategies to accelerate your debt payoff and save on interest charges."
            />

            <ExportShareButtons
              calculatorType="credit-card-payoff"
              inputs={{
                balance: parseFloat(balance) || 0,
                apr: parseFloat(apr) || 0,
                monthlyPayment: parseFloat(monthlyPayment) || 0
              }}
              results={{
                minimumPayment: result.minimumPayment,
                monthsToPayoff: result.monthsToPayoff,
                yearsToPayoff: result.yearsToPayoff,
                totalInterest: result.totalInterest,
                totalPayment: result.totalPayment
              }}
              title="Credit Card Payoff Calculator Report"
            />

            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/30 dark:via-indigo-950/30 dark:to-purple-950/30 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span>Payoff Timeline & Cost Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-blue-100 dark:border-blue-900">
                    <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-2">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {result.monthsToPayoff}
                    </div>
                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {result.yearsToPayoff.toFixed(1)} years
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Payoff Duration</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-red-100 dark:border-red-900">
                    <div className="inline-flex items-center justify-center p-2 bg-red-100 dark:bg-red-900 rounded-full mb-2">
                      <TrendingUp className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                      {formatCurrency(result.totalInterest)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Total Interest Paid</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-purple-100 dark:border-purple-900">
                    <div className="inline-flex items-center justify-center p-2 bg-purple-100 dark:bg-purple-900 rounded-full mb-2">
                      <DollarSign className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatCurrency(result.totalPayment)}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Total Amount Paid</p>
                  </div>

                  <div className="text-center p-4 rounded-lg bg-white/60 dark:bg-gray-900/40 backdrop-blur-sm border border-green-100 dark:border-green-900">
                    <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900 rounded-full mb-2">
                      <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-lg font-bold text-green-700 dark:text-green-300">
                      {result.payoffDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">Debt-Free Date</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {comparison && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                      <Wallet className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Payment Strategy Comparison</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">See how extra payments accelerate your debt-free journey</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 rounded-xl border-2 border-red-200 dark:border-red-800 shadow-md">
                      <div className="inline-flex items-center justify-center p-2 bg-red-100 dark:bg-red-900 rounded-full mb-3">
                        <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <h3 className="font-bold text-red-800 dark:text-red-300 mb-4 text-lg">Minimum Payment</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-red-700 dark:text-red-300">{comparison.minimumPayment.monthsToPayoff}</div>
                          <div className="text-xs text-muted-foreground">Months to Payoff</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-xl font-bold text-red-600 dark:text-red-400">
                            {formatCurrency(comparison.minimumPayment.totalInterest)}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Interest</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-950/30 dark:to-teal-950/30 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-md">
                      <div className="inline-flex items-center justify-center p-2 bg-green-100 dark:bg-green-900 rounded-full mb-3">
                        <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <h3 className="font-bold text-green-800 dark:text-green-300 mb-4 text-lg">With Extra Payment</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-green-700 dark:text-green-300">{comparison.extraPayment.monthsToPayoff}</div>
                          <div className="text-xs text-muted-foreground">Months to Payoff</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-xl font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(comparison.extraPayment.totalInterest)}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Interest</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 -mt-2 -mr-2">
                        <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">💰 Savings</Badge>
                      </div>
                      <div className="inline-flex items-center justify-center p-2 bg-blue-100 dark:bg-blue-900 rounded-full mb-3">
                        <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <h3 className="font-bold text-blue-800 dark:text-blue-300 mb-4 text-lg">Your Savings</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{comparison.timeSaved}</div>
                          <div className="text-xs text-muted-foreground">Months Saved</div>
                        </div>
                        <Separator />
                        <div>
                          <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                            {formatCurrency(comparison.interestSaved)}
                          </div>
                          <div className="text-xs text-muted-foreground">Interest Saved</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {result.amortizationSchedule && result.amortizationSchedule.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Payment Schedule Preview</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Key milestones in your payoff journey</p>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left p-3 font-semibold">Month</th>
                          <th className="text-right p-3 font-semibold">Payment</th>
                          <th className="text-right p-3 font-semibold">Principal</th>
                          <th className="text-right p-3 font-semibold">Interest</th>
                          <th className="text-right p-3 font-semibold">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.amortizationSchedule.map((entry, index) => (
                          <tr key={index} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="p-3 font-medium">{entry.month}</td>
                            <td className="text-right p-3">{formatCurrency(entry.payment)}</td>
                            <td className="text-right p-3 text-green-600 dark:text-green-400">{formatCurrency(entry.principal)}</td>
                            <td className="text-right p-3 text-red-600 dark:text-red-400">{formatCurrency(entry.interest)}</td>
                            <td className="text-right p-3 font-semibold">{formatCurrency(entry.remainingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 text-center">Showing first year and annual milestones</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!result.isValid && parseFloat(balance) > 0 && parseFloat(apr) > 0 && parseFloat(monthlyPayment) > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                <span className="font-medium">Payment too low to make progress</span>
              </div>
              <p className="text-red-600 text-sm mt-2">
                Your monthly payment must be higher than the monthly interest charge 
                ({formatCurrency(result.monthlyInterestPayment)}) to reduce your balance.
              </p>
            </CardContent>
          </Card>
        )}

        <AutoAdSlot slotId="7271075626732183-2" />

        <div className="space-y-8">
          <Card className="border-2 border-purple-100 dark:border-purple-900 bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-purple-950/20 shadow-lg">
            <CardHeader className="border-b border-purple-100 dark:border-purple-900 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Complete Guide to Credit Card Debt Payoff Strategies</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Master proven strategies to eliminate credit card debt and save thousands</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm text-foreground/80 space-y-6">
                <p>
                  Credit card debt can be one of the most expensive forms of consumer debt, with interest rates often ranging from 
                  15% to 25% or higher. Understanding how credit card interest works and developing an effective payoff strategy 
                  is crucial for your financial health. This comprehensive guide explains everything you need to know about paying 
                  off credit card debt efficiently, saving money on interest, and regaining control of your finances.
                </p>

                <h3 className="font-bold text-lg mt-6 mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                  <span>How Credit Card Interest Really Works</span>
                </h3>
                <p>
                  Credit card interest is calculated using your Average Daily Balance (ADB) method, which means interest accrues 
                  daily based on your outstanding balance. When you see an APR (Annual Percentage Rate) of 18%, this translates 
                  to a daily rate of approximately 0.049% (18% ÷ 365 days). This daily compounding effect means that carrying 
                  a balance becomes increasingly expensive over time, especially if you're only making minimum payments.
                </p>

                <h3 className="font-bold text-lg mt-6 mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                  <span>The Minimum Payment Trap</span>
                </h3>
                <p>
                  Credit card minimum payments are typically calculated as 2-3% of your outstanding balance or a flat fee 
                  (whichever is higher), plus any fees and interest charges. While minimum payments keep your account current, 
                  they're designed to keep you in debt longer. For example, a $5,000 balance at 18% APR with minimum payments 
                  would take over 25 years to pay off and cost more than $9,000 in interest alone.
                </p>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 p-5 rounded-xl border-l-4 border-red-500 mt-4 shadow-sm">
                  <h4 className="font-bold mb-3 text-red-700 dark:text-red-300 flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Minimum Payment Reality Check:</span>
                  </h4>
                  <ul className="space-y-1">
                    <li>• $5,000 balance at 18% APR</li>
                    <li>• Minimum payment: ~$100/month</li>
                    <li>• Time to payoff: 25+ years</li>
                    <li>• Total interest paid: $9,000+</li>
                    <li>• Total amount paid: $14,000+</li>
                  </ul>
                </div>

                <h3 className="font-bold text-lg mt-6 mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                  <span>Debt Avalanche vs. Debt Snowball Methods</span>
                </h3>
                <p>
                  Two popular debt repayment strategies can help you become debt-free faster. The Debt Avalanche method focuses 
                  on paying off debts with the highest interest rates first, minimizing total interest paid. The Debt Snowball 
                  method targets the smallest balances first, providing psychological wins that help maintain motivation. While 
                  the avalanche method saves more money mathematically, the snowball method often has higher success rates due 
                  to its motivational benefits.
                </p>

                <h3 className="font-bold text-lg mt-6 mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                  <span>The Power of Extra Payments</span>
                </h3>
                <p>
                  Even small additional payments can dramatically reduce your payoff time and interest costs. Adding just $25 
                  extra per month to a $5,000 balance at 18% APR reduces payoff time from 25 years to under 13 years and saves 
                  over $6,000 in interest. This happens because extra payments go directly toward reducing the principal balance, 
                  decreasing the amount on which future interest is calculated.
                </p>

                <h3 className="font-bold text-lg mt-6 mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                  <span>Balance Transfer Strategies</span>
                </h3>
                <p>
                  Balance transfers can be powerful tools for debt payoff when used correctly. Many credit cards offer promotional 
                  0% APR periods ranging from 12-21 months on balance transfers. Transferring high-interest debt to a 0% card 
                  allows all payments to go toward principal reduction. However, balance transfer fees (typically 3-5%) and the 
                  temporary nature of promotional rates require careful planning and discipline to maximize benefits.
                </p>

                <h3 className="font-bold text-lg mt-6 mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-purple-500 rounded-full"></div>
                  <span>Personal Loan Consolidation</span>
                </h3>
                <p>
                  Personal loans often offer lower interest rates than credit cards, making them viable for debt consolidation. 
                  Fixed-rate personal loans provide predictable monthly payments and definite payoff dates, unlike revolving 
                  credit card debt. However, qualification depends on credit score and income, and consolidation only works if 
                  you avoid accumulating new credit card debt after paying off the cards.
                </p>
              </div>
            </CardContent>
          </Card>

          <AmazonAffiliate
            category="finance-books"
            keywords="debt free, credit card payoff, financial freedom"
            title="📚 Recommended: Debt-Free Living Resources"
          />

          <Card className="border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 shadow-lg">
            <CardHeader className="border-b border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Advanced Debt Payoff Strategies</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Expert tactics to accelerate your journey to financial freedom</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm text-foreground/80 space-y-6">
                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                  <span>Strategic Payment Timing</span>
                </h3>
                <p>
                  Understanding when to make payments can save money on interest charges. Making payments before your statement 
                  closing date reduces your Average Daily Balance, lowering interest charges. Some cardholders make multiple 
                  payments throughout the month to keep balances low. Additionally, making payments immediately after purchases 
                  can prevent interest from accruing if you typically carry a balance.
                </p>

                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                  <span>The Grace Period Strategy</span>
                </h3>
                <p>
                  Most credit cards offer a grace period of 21-25 days during which no interest is charged on new purchases, 
                  provided you pay the full statement balance by the due date. Once you carry a balance, you lose this grace 
                  period and interest begins accruing immediately on new purchases. Restoring the grace period requires paying 
                  off the entire balance, making it crucial to avoid new purchases while paying down debt.
                </p>

                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                  <span>Negotiating with Credit Card Companies</span>
                </h3>
                <p>
                  Many credit card companies are willing to work with customers facing financial hardship. Options may include 
                  temporary payment reductions, interest rate decreases, or structured payment plans. Hardship programs can 
                  provide breathing room, but they may impact your credit score. Always get agreements in writing and understand 
                  the long-term implications before accepting any modified payment arrangements.
                </p>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-5 rounded-xl border-l-4 border-blue-500 shadow-sm">
                  <h4 className="font-bold mb-3 text-blue-700 dark:text-blue-300 flex items-center space-x-2">
                    <Info className="h-4 w-4" />
                    <span>Negotiation Tips:</span>
                  </h4>
                  <ul className="space-y-1">
                    <li>• Call the retention department, not general customer service</li>
                    <li>• Be honest about your financial situation</li>
                    <li>• Have a specific proposal ready (payment amount, timeline)</li>
                    <li>• Document all agreements in writing</li>
                    <li>• Consider the credit score impact of hardship programs</li>
                    <li>• Explore temporary vs. permanent modifications</li>
                  </ul>
                </div>

                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                  <span>Windfall Application Strategy</span>
                </h3>
                <p>
                  Tax refunds, bonuses, gifts, and other windfalls present opportunities to make significant progress on debt. 
                  Applying windfalls to high-interest debt typically provides better returns than most investments. Even partial 
                  allocation (like 50% to debt, 50% to emergency fund) can accelerate progress while building financial security. 
                  Plan ahead for expected windfalls to avoid the temptation to spend them on non-essential items.
                </p>

                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                  <span>Side Income for Debt Payment</span>
                </h3>
                <p>
                  Generating additional income specifically for debt payoff can dramatically accelerate progress. Popular options 
                  include freelancing, rideshare driving, selling unused items, or taking on part-time work. The key is directing 
                  100% of side income toward debt rather than lifestyle inflation. Even earning an extra $200 monthly can cut 
                  years off your payoff timeline and save thousands in interest.
                </p>

                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                  <span>Budgeting for Debt Freedom</span>
                </h3>
                <p>
                  Successful debt payoff requires a sustainable budget that allocates maximum dollars to debt payments while 
                  maintaining basic living expenses. The 50/30/20 rule (50% needs, 30% wants, 20% savings/debt) may need 
                  adjustment during debt payoff, perhaps shifting to 50/20/30 or even 50/10/40 for aggressive payoff. Zero-based 
                  budgeting ensures every dollar has a purpose and maximizes debt payments.
                </p>

                <h3 className="font-bold text-lg mb-4 flex items-center space-x-2 text-foreground">
                  <div className="h-1 w-1 bg-blue-500 rounded-full"></div>
                  <span>Building Emergency Funds While Paying Debt</span>
                </h3>
                <p>
                  The debate between building emergency funds versus paying off debt depends on individual circumstances. A small 
                  emergency fund ($500-1,000) can prevent new debt accumulation when unexpected expenses arise. For high-interest 
                  debt (above 15% APR), prioritizing debt payoff often makes mathematical sense. However, having some emergency 
                  cushion provides peace of mind and prevents debt payoff setbacks from emergencies.
                </p>
              </div>
            </CardContent>
          </Card>

          <AutoAdSlot slotId="7271075626732183-3" />

          <Card className="border-2 border-green-100 dark:border-green-900 bg-gradient-to-br from-white to-green-50/30 dark:from-gray-900 dark:to-green-950/20 shadow-lg">
            <CardHeader className="border-b border-green-100 dark:border-green-900 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30">
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-md">
                  <Info className="h-6 w-6 text-white" />
                </div>
                <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Frequently Asked Questions</span>
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">Get answers to common credit card debt payoff questions</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-sm text-foreground/80 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border-l-4 border-green-500">
                    <h4 className="font-bold text-foreground mb-3 flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                      <span>Should I pay off credit cards or build savings first?</span>
                    </h4>
                    <p>Generally, pay off high-interest debt (above 10% APR) before building large savings, but maintain a small emergency fund ($500-1,000) to avoid creating new debt. High-interest debt elimination provides guaranteed returns equal to the interest rate, which typically exceeds savings account returns.</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border-l-4 border-blue-500">
                    <h4 className="font-bold text-foreground mb-3 flex items-center space-x-2">
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                      <span>Will paying off credit cards improve my credit score?</span>
                    </h4>
                    <p>Yes, paying down credit card balances reduces your credit utilization ratio, which is 30% of your credit score. Aim to keep utilization below 30% across all cards, with below 10% being optimal. Pay balances before statement closing dates for maximum impact on reported utilization.</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-lg border-l-4 border-purple-500">
                    <h4 className="font-bold text-foreground mb-3 flex items-center space-x-2">
                      <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                      <span>Should I close credit cards after paying them off?</span>
                    </h4>
                    <p>Generally no, unless there's an annual fee you can't justify. Keeping cards open maintains your credit history length and available credit, both positive for your credit score. Use them occasionally for small purchases and pay in full to keep accounts active.</p>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-orange-50/50 to-red-50/50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg border-l-4 border-orange-500">
                    <h4 className="font-bold text-foreground mb-3 flex items-center space-x-2">
                      <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                      <span>Is it better to pay off cards with highest balance or highest interest rate?</span>
                    </h4>
                    <p>Mathematically, paying off highest interest rate debt first (debt avalanche) saves the most money. However, paying smallest balances first (debt snowball) can provide psychological wins that help maintain motivation. Choose the method you're most likely to stick with long-term.</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20 rounded-lg border-l-4 border-yellow-500">
                    <h4 className="font-bold text-foreground mb-3 flex items-center space-x-2">
                      <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                      <span>Can I negotiate a lower interest rate on my credit cards?</span>
                    </h4>
                    <p>Yes, many cardholders successfully negotiate lower rates, especially if they have good payment history and credit scores. Call the retention department, mention competing offers, and be prepared to explain why you deserve a rate reduction. Success rates vary but attempts cost nothing.</p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-teal-50/50 to-cyan-50/50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg border-l-4 border-teal-500">
                    <h4 className="font-bold text-foreground mb-3 flex items-center space-x-2">
                      <div className="h-2 w-2 bg-teal-500 rounded-full"></div>
                      <span>How accurate is this credit card payoff calculator?</span>
                    </h4>
                    <p>This calculator provides accurate estimates based on fixed payment amounts and interest rates. Actual results may vary due to rate changes, fees, additional purchases, or payment timing. Use it as a planning tool and adjust strategies as circumstances change.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-amber-200 dark:border-amber-800 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
          <CardHeader className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-950/50 dark:to-yellow-950/50 border-b border-amber-200 dark:border-amber-800">
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-amber-500 rounded-lg shadow-md">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent text-xl">Important Information & Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-6">
            <div className="text-sm text-foreground/70 space-y-2">
              <p>• This calculator provides estimates only and should not be relied upon for final financial decisions.</p>
              <p>• Actual results may vary due to interest rate changes, fees, additional purchases, or payment timing.</p>
              <p>• Credit card terms vary significantly - always review your specific card agreement.</p>
              <p>• Consider consulting with a financial advisor for personalized debt management strategies.</p>
              <p>• This calculator assumes fixed interest rates and payment amounts throughout the payoff period.</p>
              <p>• Additional fees, penalties, or rate changes can significantly impact actual payoff timeline and costs.</p>
              <p>• Results don't account for tax implications of debt payoff strategies or opportunity costs.</p>
              <p>• Balance transfer and personal loan options require qualification and may have associated costs.</p>
              <p>• Always review the fine print of any debt management or consolidation offers.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}