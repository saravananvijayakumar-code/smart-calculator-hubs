// @ts-nocheck
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Info, DollarSign, BarChart3 } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useFormatting } from '../../../utils/formatting';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface CompoundInterestResult {
  finalAmount: number;
  totalInterest: number;
  totalContributions: number;
  isValid: boolean;
  yearByYearBreakdown: YearlyBreakdown[];
  effectiveAnnualRate: number;
}

interface YearlyBreakdown {
  year: number;
  startingBalance: number;
  contributions: number;
  interestEarned: number;
  endingBalance: number;
}

interface ComparisonScenario {
  name: string;
  finalAmount: number;
  totalInterest: number;
  description: string;
}

export default function CompoundInterestCalculator() {
  const { t } = useTranslation();
  const { formatCurrency, parseCurrencyInput, getCurrencySymbol } = useFormatting();
  
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [time, setTime] = useState('');
  const [frequency, setFrequency] = useState('12');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [contributionTiming, setContributionTiming] = useState('end');
  const [result, setResult] = useState<CompoundInterestResult>({
    finalAmount: 0,
    totalInterest: 0,
    totalContributions: 0,
    isValid: false,
    yearByYearBreakdown: [],
    effectiveAnnualRate: 0
  });
  const [comparisonScenarios, setComparisonScenarios] = useState<ComparisonScenario[]>([]);

  const calculateCompoundInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const t = parseFloat(time);
    const n = parseFloat(frequency);
    const pmt = parseFloat(monthlyContribution) || 0;

    if (p > 0 && r >= 0 && t > 0 && n > 0) {
      const monthlyRate = r / 100 / 12;
      const totalMonths = t * 12;
      let balance = p;
      let totalContributionsSum = p;
      const yearlyBreakdown: YearlyBreakdown[] = [];

      // Calculate month by month for accuracy
      for (let year = 1; year <= t; year++) {
        const startingBalance = balance;
        let yearContributions = 0;
        let yearInterest = 0;

        for (let month = 1; month <= 12; month++) {
          // Add contribution at beginning or end of month
          if (contributionTiming === 'beginning' && pmt > 0) {
            balance += pmt;
            yearContributions += pmt;
            totalContributionsSum += pmt;
          }

          // Apply interest
          const monthlyInterest = balance * monthlyRate;
          balance += monthlyInterest;
          yearInterest += monthlyInterest;

          // Add contribution at end of month
          if (contributionTiming === 'end' && pmt > 0) {
            balance += pmt;
            yearContributions += pmt;
            totalContributionsSum += pmt;
          }
        }

        yearlyBreakdown.push({
          year,
          startingBalance,
          contributions: yearContributions,
          interestEarned: yearInterest,
          endingBalance: balance
        });
      }

      const finalAmount = balance;
      const totalInterest = finalAmount - totalContributionsSum;
      const effectiveAnnualRate = totalContributionsSum > 0 ? 
        (Math.pow(finalAmount / totalContributionsSum, 1/t) - 1) * 100 : 0;

      setResult({
        finalAmount,
        totalInterest,
        totalContributions: totalContributionsSum,
        isValid: true,
        yearByYearBreakdown: yearlyBreakdown,
        effectiveAnnualRate
      });

      // Calculate comparison scenarios
      calculateComparisonScenarios(p, r, t, n, pmt);
    } else {
      setResult({
        finalAmount: 0,
        totalInterest: 0,
        totalContributions: 0,
        isValid: false,
        yearByYearBreakdown: [],
        effectiveAnnualRate: 0
      });
      setComparisonScenarios([]);
    }
  };

  const calculateComparisonScenarios = (p: number, r: number, t: number, n: number, pmt: number) => {
    const scenarios: ComparisonScenario[] = [];

    // Scenario 1: No additional contributions
    if (pmt > 0) {
      const simpleCompound = p * Math.pow(1 + (r / 100) / n, n * t);
      scenarios.push({
        name: 'Principal Only',
        finalAmount: simpleCompound,
        totalInterest: simpleCompound - p,
        description: 'No monthly contributions'
      });
    }

    // Scenario 2: Lower interest rate
    if (r > 1) {
      const lowerRate = Math.max(1, r - 2);
      const lowerRateResult = calculateScenario(p, lowerRate, t, n, pmt);
      scenarios.push({
        name: `${lowerRate}% Rate`,
        finalAmount: lowerRateResult.final,
        totalInterest: lowerRateResult.interest,
        description: '2% lower interest rate'
      });
    }

    // Scenario 3: Higher interest rate
    const higherRate = r + 2;
    const higherRateResult = calculateScenario(p, higherRate, t, n, pmt);
    scenarios.push({
      name: `${higherRate}% Rate`,
      finalAmount: higherRateResult.final,
      totalInterest: higherRateResult.interest,
      description: '2% higher interest rate'
    });

    // Scenario 4: Double the time
    if (t < 20) {
      const doubleTimeResult = calculateScenario(p, r, t * 2, n, pmt);
      scenarios.push({
        name: `${t * 2} Years`,
        finalAmount: doubleTimeResult.final,
        totalInterest: doubleTimeResult.interest,
        description: 'Double the time period'
      });
    }

    setComparisonScenarios(scenarios);
  };

  const calculateScenario = (p: number, r: number, t: number, n: number, pmt: number) => {
    const monthlyRate = r / 100 / 12;
    let balance = p;
    let totalContributions = p;

    for (let month = 1; month <= t * 12; month++) {
      if (contributionTiming === 'beginning' && pmt > 0) {
        balance += pmt;
        totalContributions += pmt;
      }
      balance += balance * monthlyRate;
      if (contributionTiming === 'end' && pmt > 0) {
        balance += pmt;
        totalContributions += pmt;
      }
    }

    return {
      final: balance,
      interest: balance - totalContributions
    };
  };

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, rate, time, frequency, monthlyContribution, contributionTiming]);

  const tips = [
    "Compound interest earns returns on both principal and previously earned interest",
    "Starting early dramatically increases the power of compounding",
    "Regular contributions can significantly boost your final balance",
    "Higher compounding frequency generally means higher returns",
    "Even small amounts can grow substantially over long periods"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Compound Interest Calculator | Investment Growth & Savings Calculator"
      description="Calculate compound interest with regular contributions, different compounding frequencies, and detailed year-by-year breakdowns. See the power of compounding over time with comprehensive scenarios."
      keywords="compound interest calculator, investment calculator, savings growth calculator, compounding frequency, investment returns, financial calculator"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Compound Interest Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="principal">Initial Investment ({getCurrencySymbol()})</Label>
                <Input
                  id="principal"
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  placeholder="10000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                <Input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="7"
                  step="0.1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">Time Period (Years)</Label>
                <Input
                  id="time"
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Compounding Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Annually</SelectItem>
                    <SelectItem value="2">Semi-annually</SelectItem>
                    <SelectItem value="4">Quarterly</SelectItem>
                    <SelectItem value="12">Monthly</SelectItem>
                    <SelectItem value="365">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution ({getCurrencySymbol()})</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  placeholder="500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributionTiming">Contribution Timing</Label>
                <Select value={contributionTiming} onValueChange={setContributionTiming}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timing" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginning">Beginning of Month</SelectItem>
                    <SelectItem value="end">End of Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result.isValid && (
          <div className="space-y-6">
            {/* AI Analysis */}
            <AIAnalysis
              analysisRequest={{
                calculatorType: "compound-interest",
                data: {
                  initialInvestment: parseFloat(principal) || 0,
                  monthlyContribution: parseFloat(monthlyContribution) || 0,
                  annualReturn: parseFloat(rate) || 0,
                  years: parseFloat(time) || 0,
                  finalAmount: result.finalAmount,
                  totalContributions: result.totalContributions,
                  totalReturn: result.totalInterest
                }
              }}
              autoRun={true}
              title="AI Compound Interest Analysis"
              description="Get personalized investment insights and optimization strategies for your compound interest calculations."
            />

            <ExportShareButtons
              calculatorType="compound-interest"
              inputs={{
                principal: parseFloat(principal) || 0,
                rate: parseFloat(rate) || 0,
                time: parseFloat(time) || 0,
                monthlyContribution: parseFloat(monthlyContribution) || 0,
                compoundingFrequency: frequency
              }}
              results={{
                finalAmount: result.finalAmount,
                totalInterest: result.totalInterest,
                totalContributions: result.totalContributions
              }}
              title="Compound Interest Calculator Report"
            />

            {/* Main Results */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-green-800">
                  Investment Growth Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(result.finalAmount)}
                    </div>
                    <p className="text-sm text-green-700">Final Amount</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(result.totalContributions)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Contributions</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(result.totalInterest)}
                    </div>
                    <p className="text-sm text-muted-foreground">Interest Earned</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.effectiveAnnualRate.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Effective Annual Return</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Interest to Contributions Ratio:</span>
                    <Badge variant="default">
                      {((result.totalInterest / result.totalContributions) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Comparison Scenarios */}
            {comparisonScenarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Scenario Comparisons</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {comparisonScenarios.map((scenario, index) => (
                      <div key={index} className="text-center p-4 border rounded-lg">
                        <h3 className="font-semibold text-sm mb-2">{scenario.name}</h3>
                        <div className="text-xl font-bold text-blue-600">
                          {formatCurrency(scenario.finalAmount)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{scenario.description}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Interest: {formatCurrency(scenario.totalInterest)}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Year by Year Breakdown */}
            {result.yearByYearBreakdown.length > 0 && result.yearByYearBreakdown.length <= 30 && (
              <Card>
                <CardHeader>
                  <CardTitle>Year-by-Year Growth Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Year</th>
                          <th className="text-right p-2">Starting Balance</th>
                          <th className="text-right p-2">Contributions</th>
                          <th className="text-right p-2">Interest Earned</th>
                          <th className="text-right p-2">Ending Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.yearByYearBreakdown.map((year) => (
                          <tr key={year.year} className="border-b hover:bg-gray-50">
                            <td className="p-2 font-medium">{year.year}</td>
                            <td className="p-2 text-right">{formatCurrency(year.startingBalance)}</td>
                            <td className="p-2 text-right text-blue-600">{formatCurrency(year.contributions)}</td>
                            <td className="p-2 text-right text-green-600">{formatCurrency(year.interestEarned)}</td>
                            <td className="p-2 text-right font-semibold">{formatCurrency(year.endingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Compound Interest and Investment Growth</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Compound interest represents one of the most powerful forces in personal finance, often called the 
                  "eighth wonder of the world" by Albert Einstein. Understanding how compound interest works and leveraging 
                  its power effectively can transform your financial future, turning modest savings into substantial wealth 
                  over time. This comprehensive guide explores the mechanics of compound interest, optimal strategies for 
                  maximizing its benefits, and real-world applications across different investment scenarios.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Understanding the Compound Interest Formula</h3>
                <p>
                  Compound interest differs fundamentally from simple interest by earning returns not only on your initial 
                  principal but also on previously earned interest. The compound interest formula A = P(1 + r/n)^(nt) reveals 
                  how time, interest rate, and compounding frequency work together to generate exponential growth. Each variable 
                  plays a crucial role: principal (P) provides the foundation, interest rate (r) determines growth speed, 
                  compounding frequency (n) affects acceleration, and time (t) creates the exponential effect that makes 
                  compound interest so powerful.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">The Time Factor: Why Starting Early Matters</h3>
                <p>
                  Time represents the most critical factor in compound interest calculations, with even small delays in starting 
                  dramatically reducing final outcomes. A 25-year-old investing $200 monthly at 7% annual return will accumulate 
                  approximately $1.37 million by age 65, while a 35-year-old making identical contributions will reach only 
                  $610,000. This $760,000 difference demonstrates why financial advisors emphasize starting investments as early 
                  as possible, even with modest amounts that can be increased over time.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">The Power of Starting Early Example:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Person A:</strong> Invests $2,000/year from age 25-35 (10 years, $20,000 total)</li>
                    <li>• <strong>Person B:</strong> Invests $2,000/year from age 35-65 (30 years, $60,000 total)</li>
                    <li>• <strong>At 7% annual return:</strong></li>
                    <li>• <strong>Person A at 65:</strong> $314,000 (despite stopping at 35)</li>
                    <li>• <strong>Person B at 65:</strong> $245,000 (despite investing 3x longer)</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Compounding Frequency and Its Impact</h3>
                <p>
                  The frequency of compounding affects investment growth, though the impact is often less dramatic than investors 
                  expect. Daily compounding versus annual compounding on a 7% investment typically improves returns by less than 
                  0.1% annually. However, this small difference compounds over time, and many modern investment accounts offer 
                  daily compounding at no additional cost. More importantly, the psychological benefit of seeing more frequent 
                  growth can encourage continued investing and better financial behaviors.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Regular Contributions and Dollar-Cost Averaging</h3>
                <p>
                  Regular monthly contributions can dramatically enhance compound interest outcomes while providing the benefits 
                  of dollar-cost averaging. Instead of trying to time market entry points, consistent investing smooths out 
                  market volatility by purchasing more shares when prices are low and fewer when prices are high. This strategy 
                  reduces average cost per share over time while building the habit of systematic investing that leads to 
                  long-term wealth accumulation.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Interest Rate Sensitivity and Risk Considerations</h3>
                <p>
                  Small differences in interest rates create large differences in final outcomes over long periods, making rate 
                  selection crucial for long-term investors. A 2% difference in annual returns (5% vs. 7%) on $500 monthly 
                  contributions over 30 years results in approximately $400,000 difference in final value. This sensitivity 
                  explains why investors often accept higher risk for potentially higher returns, though the relationship between 
                  risk and return must be carefully balanced based on individual circumstances and risk tolerance.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Tax-Advantaged Compound Interest Accounts</h3>
                <p>
                  Tax-advantaged accounts like 401(k)s, IRAs, and Roth IRAs can significantly enhance compound interest outcomes 
                  by eliminating or deferring taxes on investment growth. Traditional retirement accounts defer taxes until 
                  withdrawal, allowing the full investment amount to compound without annual tax drag. Roth accounts use after-tax 
                  contributions but provide tax-free growth and withdrawals, making them particularly valuable for young investors 
                  who expect to be in higher tax brackets during retirement.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Inflation's Impact on Real Returns</h3>
                <p>
                  While compound interest calculations often use nominal returns, investors must consider inflation's erosive 
                  effect on purchasing power. A 7% nominal return with 3% inflation provides only 4% real return in terms of 
                  purchasing power. Long-term financial planning should focus on real returns and consider assets that historically 
                  outpace inflation, such as stocks and real estate, rather than low-yield "safe" investments that may lose 
                  purchasing power over time despite positive nominal returns.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Compound Interest Strategies and Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Contribution Timing and Optimization</h3>
                <p>
                  The timing of contributions within each month or year can impact compound interest outcomes, though the 
                  difference is often modest. Contributing at the beginning of each period allows that money to earn returns 
                  for the full period, while end-of-period contributions miss some growth opportunity. For monthly contributions, 
                  beginning-of-month timing typically adds 0.3-0.5% to annual returns. However, the most important factor 
                  remains consistency rather than perfect timing.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Reinvestment Strategies and Dividend Compounding</h3>
                <p>
                  Dividend reinvestment plans (DRIPs) harness compound interest by automatically purchasing additional shares 
                  with dividend payments, often without transaction fees. This strategy ensures that all returns immediately 
                  begin generating their own returns, maximizing the compounding effect. Many investors underestimate dividend 
                  compounding's impact, but reinvested dividends have historically provided 40-50% of stock market total returns 
                  over long periods.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Debt and Negative Compounding</h3>
                <p>
                  Compound interest works against borrowers just as powerfully as it works for investors, making high-interest 
                  debt elimination a priority before aggressive investing. Credit card debt at 18% APR compounding monthly 
                  creates negative wealth at a rate that few investments can overcome. The mathematical principle suggests 
                  paying off debt with interest rates above expected investment returns before increasing investment contributions, 
                  creating a guaranteed "return" equal to the debt's interest rate.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Compound Interest Optimization Strategies:</h4>
                  <ul className="space-y-1">
                    <li>• Start investing as early as possible, even with small amounts</li>
                    <li>• Maximize contributions to tax-advantaged retirement accounts</li>
                    <li>• Reinvest all dividends and interest payments automatically</li>
                    <li>• Eliminate high-interest debt before aggressive investing</li>
                    <li>• Consider increasing contributions with salary raises</li>
                    <li>• Choose low-cost investment options to maximize net returns</li>
                    <li>• Stay invested during market volatility to capture long-term growth</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Asset Allocation and Compound Interest</h3>
                <p>
                  Different asset classes provide varying compound interest potential, with stocks historically offering higher 
                  long-term returns than bonds or cash equivalents. However, higher returns come with increased volatility that 
                  can disrupt compounding if investors panic during market downturns. Age-appropriate asset allocation balances 
                  growth potential with stability, typically favoring stocks for young investors with long time horizons and 
                  gradually shifting toward more conservative allocations as retirement approaches.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">International Diversification and Currency Compounding</h3>
                <p>
                  Global diversification can enhance compound interest outcomes by accessing different economic cycles and growth 
                  opportunities worldwide. However, currency fluctuations add complexity to international compound interest 
                  calculations, potentially enhancing or reducing returns for domestic investors. Many investors achieve 
                  international exposure through domestic mutual funds or ETFs that handle currency management professionally 
                  while maintaining the benefits of global diversification.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Technology and Automated Compound Interest</h3>
                <p>
                  Modern technology enables sophisticated compound interest strategies through robo-advisors, automatic rebalancing, 
                  and micro-investing platforms that invest spare change from purchases. These tools remove behavioral barriers 
                  to consistent investing while optimizing factors like tax-loss harvesting and asset allocation that enhance 
                  compound returns. However, technology should supplement rather than replace understanding of compound interest 
                  principles and long-term investment strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Behavioral Factors in Compound Interest Success</h3>
                <p>
                  The greatest threat to compound interest success is often investor behavior rather than market performance. 
                  Emotional responses to market volatility, the temptation to time markets, and lifestyle inflation that reduces 
                  contribution capacity can all undermine long-term compounding. Successful compound interest investors develop 
                  systems and habits that automate good decisions while minimizing opportunities for emotional interference 
                  with their long-term strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Estate Planning and Multi-Generational Compounding</h3>
                <p>
                  Compound interest strategies can extend beyond individual lifetimes through estate planning techniques that 
                  benefit multiple generations. Trust structures, education funding accounts, and strategic gift-giving can 
                  create multi-generational wealth-building that harnesses decades of compound growth. These strategies require 
                  professional guidance but can create lasting financial legacies that benefit families for generations while 
                  teaching valuable lessons about long-term financial planning.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What's the difference between compound and simple interest?</h4>
                    <p>Simple interest only earns returns on the original principal, while compound interest earns returns on both principal and previously earned interest. Over time, this difference becomes substantial - $10,000 at 7% for 20 years yields $24,000 with simple interest but $38,697 with compound interest.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How often should investments compound for best results?</h4>
                    <p>While daily compounding is theoretically best, the practical difference between daily and monthly compounding is minimal (typically less than 0.1% annually). More important factors include the interest rate, time period, and consistent contributions rather than compounding frequency.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Is it better to invest a lump sum or make regular contributions?</h4>
                    <p>Mathematically, lump sum investing often wins due to longer market exposure, but regular contributions provide dollar-cost averaging benefits and are more practical for most people. The key is starting consistently rather than waiting for perfect timing or large amounts.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What interest rate should I use for long-term projections?</h4>
                    <p>Historical stock market returns average 7-10% annually, but conservative planning often uses 6-7% to account for inflation and fees. For guaranteed returns, current bond or CD rates apply. Always consider your risk tolerance and investment timeline when selecting rates.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How does inflation affect compound interest calculations?</h4>
                    <p>Inflation reduces the purchasing power of future dollars, so focus on real (inflation-adjusted) returns rather than nominal returns. If your investment earns 7% but inflation is 3%, your real return is approximately 4% in terms of purchasing power.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can compound interest work against me?</h4>
                    <p>Yes, compound interest works against borrowers. High-interest debt like credit cards compound against you, making debt elimination often more valuable than investing. Pay off debt with rates above your expected investment returns before increasing investment contributions.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Important Information & Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• This calculator provides estimates only and should not be relied upon for final investment decisions.</p>
              <p>• Investment returns are not guaranteed and actual performance may vary significantly from projections.</p>
              <p>• Consider inflation's impact on purchasing power when evaluating long-term projections.</p>
              <p>• Tax implications of investments are not included in calculations and may affect actual returns.</p>
              <p>• Investment fees and expenses can significantly impact compound interest outcomes over time.</p>
              <p>• Market volatility may cause actual returns to differ from steady compound interest assumptions.</p>
              <p>• Consult with qualified financial advisors for personalized investment strategies and planning.</p>
              <p>• Past performance does not guarantee future results in any investment scenario.</p>
              <p>• Results are estimates only and actual investment outcomes may vary significantly from calculations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}