import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, BarChart, Calculator, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useFormatting } from '../../../utils/formatting';
import { AdsterraSlot } from '../../../components/ads/AdsterraSlot';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface InvestmentResult {
  futureValue: number;
  totalContributions: number;
  totalGrowth: number;
  monthlyValue: number[];
  months: number[];
  averageAnnualGrowth: number;
  totalReturn: number;
  breakEvenMonth: number;
  isValid: boolean;
}

interface AssetAllocation {
  stocks: number;
  bonds: number;
  cash: number;
  other: number;
}

interface RiskScenario {
  name: string;
  expectedReturn: number;
  futureValue: number;
  description: string;
  probability: string;
}

export function InvestmentCalculator() {
  const { formatCurrency, getCurrencySymbol } = useFormatting();
  
  const [initialAmount, setInitialAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [annualReturn, setAnnualReturn] = useState('');
  const [years, setYears] = useState('');
  const [riskTolerance, setRiskTolerance] = useState('');
  const [investmentGoal, setInvestmentGoal] = useState('');
  const [taxAdvantaged, setTaxAdvantaged] = useState('');
  const [result, setResult] = useState<InvestmentResult | null>(null);
  const [assetAllocation, setAssetAllocation] = useState<AssetAllocation>({
    stocks: 70,
    bonds: 25,
    cash: 3,
    other: 2
  });
  const [riskScenarios, setRiskScenarios] = useState<RiskScenario[]>([]);

  const calculateInvestment = () => {
    const principal = parseFloat(initialAmount) || 0;
    const monthly = parseFloat(monthlyContribution) || 0;
    const rate = parseFloat(annualReturn) / 100 || 0;
    const time = parseFloat(years) || 0;

    if (time <= 0 || rate < -1) {
      setResult(null);
      return;
    }

    const monthlyRate = rate / 12;
    const totalMonths = time * 12;
    
    let futureValue = principal;
    let totalContributions = principal;
    const monthlyValues: number[] = [];
    const months: number[] = [];
    let breakEvenMonth = 0;

    // Calculate month by month
    for (let month = 1; month <= totalMonths; month++) {
      futureValue = futureValue * (1 + monthlyRate) + monthly;
      totalContributions += monthly;
      
      // Find break-even point where growth exceeds contributions
      if (breakEvenMonth === 0 && futureValue > totalContributions * 1.1) {
        breakEvenMonth = month;
      }
      
      if (month % 6 === 0 || month === totalMonths) { // Store every 6 months for chart
        monthlyValues.push(futureValue);
        months.push(month);
      }
    }

    const totalGrowth = futureValue - totalContributions;
    const averageAnnualGrowth = totalContributions > 0 ? 
      (Math.pow(futureValue / totalContributions, 1/time) - 1) * 100 : 0;
    const totalReturn = totalContributions > 0 ? 
      ((futureValue - totalContributions) / totalContributions) * 100 : 0;

    setResult({
      futureValue,
      totalContributions,
      totalGrowth,
      monthlyValue: monthlyValues,
      months,
      averageAnnualGrowth,
      totalReturn,
      breakEvenMonth,
      isValid: true
    });

    // Calculate risk scenarios
    calculateRiskScenarios(principal, monthly, rate, time);
  };

  const calculateRiskScenarios = (principal: number, monthly: number, baseRate: number, time: number) => {
    const scenarios: RiskScenario[] = [
      {
        name: 'Conservative',
        expectedReturn: Math.max(0.01, baseRate - 0.03),
        futureValue: 0,
        description: 'Lower risk, stable returns',
        probability: '90% confidence'
      },
      {
        name: 'Moderate',
        expectedReturn: baseRate,
        futureValue: 0,
        description: 'Balanced risk and return',
        probability: '70% confidence'
      },
      {
        name: 'Aggressive',
        expectedReturn: baseRate + 0.03,
        futureValue: 0,
        description: 'Higher risk, higher potential',
        probability: '50% confidence'
      },
      {
        name: 'Bear Market',
        expectedReturn: Math.max(-0.1, baseRate - 0.06),
        futureValue: 0,
        description: 'Market downturn scenario',
        probability: '20% confidence'
      }
    ];

    scenarios.forEach(scenario => {
      const monthlyRate = scenario.expectedReturn / 12;
      let value = principal;
      for (let month = 1; month <= time * 12; month++) {
        value = value * (1 + monthlyRate) + monthly;
      }
      scenario.futureValue = value;
    });

    setRiskScenarios(scenarios);
  };

  const getRecommendedAllocation = () => {
    const age = 30; // Default assumption, could be input
    const yearsToRetirement = Math.max(0, 65 - age);
    const stockPercentage = Math.min(90, Math.max(20, 100 - age));
    
    switch(riskTolerance) {
      case 'conservative':
        return { stocks: 30, bonds: 60, cash: 8, other: 2 };
      case 'moderate':
        return { stocks: 60, bonds: 30, cash: 5, other: 5 };
      case 'aggressive':
        return { stocks: 85, bonds: 10, cash: 2, other: 3 };
      default:
        return { stocks: stockPercentage, bonds: 100 - stockPercentage - 10, cash: 5, other: 5 };
    }
  };

  useEffect(() => {
    calculateInvestment();
  }, [initialAmount, monthlyContribution, annualReturn, years]);

  useEffect(() => {
    if (riskTolerance) {
      setAssetAllocation(getRecommendedAllocation());
    }
  }, [riskTolerance]);

  return (
    <CalculatorLayoutWithAds
      title="Investment Calculator | Portfolio Growth & Return Calculator"
      description="Comprehensive investment calculator with asset allocation, risk scenarios, and detailed growth projections. Plan your investment strategy with advanced portfolio analysis and optimization tools."
      keywords="investment calculator, portfolio calculator, asset allocation calculator, investment returns, portfolio growth, investment planning, financial calculator"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <AdsterraSlot position="top" className="mb-6" />

        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Investment Planning Calculator</span>
            </CardTitle>
            <CardDescription>
              Enter your investment parameters to see comprehensive growth projections and analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialAmount">Initial Investment ({getCurrencySymbol()})</Label>
                <Input
                  id="initialAmount"
                  type="number"
                  placeholder="10000"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Monthly Contribution ({getCurrencySymbol()})</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  placeholder="500"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualReturn">Expected Annual Return (%)</Label>
                <Input
                  id="annualReturn"
                  type="number"
                  step="0.1"
                  placeholder="7"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years">Investment Period (Years)</Label>
                <Input
                  id="years"
                  type="number"
                  placeholder="20"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance">Risk Tolerance</Label>
                <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative (Low Risk)</SelectItem>
                    <SelectItem value="moderate">Moderate (Balanced)</SelectItem>
                    <SelectItem value="aggressive">Aggressive (High Risk)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investmentGoal">Investment Goal</Label>
                <Select value={investmentGoal} onValueChange={setInvestmentGoal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="house">Home Purchase</SelectItem>
                    <SelectItem value="wealth">Wealth Building</SelectItem>
                    <SelectItem value="income">Income Generation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAdvantaged">Account Type</Label>
                <Select value={taxAdvantaged} onValueChange={setTaxAdvantaged}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="taxable">Taxable Account</SelectItem>
                    <SelectItem value="traditional_401k">Traditional 401(k)</SelectItem>
                    <SelectItem value="roth_401k">Roth 401(k)</SelectItem>
                    <SelectItem value="traditional_ira">Traditional IRA</SelectItem>
                    <SelectItem value="roth_ira">Roth IRA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <AdsterraSlot position="middle" className="my-6" />

        {/* Results */}
        {result && result.isValid && (
          <div className="space-y-6">
            {/* AI Analysis */}
            <AIAnalysis
              analysisRequest={{
                calculatorType: "investment",
                data: {
                  initialInvestment: parseFloat(initialAmount) || 0,
                  monthlyContribution: parseFloat(monthlyContribution) || 0,
                  annualReturn: parseFloat(annualReturn) || 0,
                  years: parseFloat(years) || 0,
                  finalAmount: result.futureValue,
                  totalContributions: result.totalContributions,
                  totalReturn: result.totalGrowth
                }
              }}
              autoRun={true}
              title="AI Investment Analysis"
              description="Get personalized investment insights and portfolio optimization strategies."
            />

            {/* Main Results */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-green-800">
                  Investment Projection Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {formatCurrency(result.futureValue)}
                    </div>
                    <p className="text-sm text-green-700">Future Value</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(result.totalContributions)}
                    </div>
                    <p className="text-sm text-muted-foreground">Total Invested</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatCurrency(result.totalGrowth)}
                    </div>
                    <p className="text-sm text-muted-foreground">Investment Growth</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.totalReturn.toFixed(1)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Total Return</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Average Annual Growth:</span>
                      <Badge variant="default">{result.averageAnnualGrowth.toFixed(2)}%</Badge>
                    </div>
                    {result.breakEvenMonth > 0 && (
                      <div className="flex justify-between">
                        <span>Break-even Point:</span>
                        <Badge variant="secondary">{Math.floor(result.breakEvenMonth / 12)} years, {result.breakEvenMonth % 12} months</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Risk Scenarios */}
            {riskScenarios.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart className="h-5 w-5" />
                    <span>Risk Scenario Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {riskScenarios.map((scenario, index) => (
                      <div key={index} className={`text-center p-4 border rounded-lg ${
                        scenario.name === 'Bear Market' ? 'border-red-200 bg-red-50' :
                        scenario.name === 'Conservative' ? 'border-blue-200 bg-blue-50' :
                        scenario.name === 'Aggressive' ? 'border-green-200 bg-green-50' :
                        'border-gray-200'
                      }`}>
                        <h3 className="font-semibold text-sm mb-2">{scenario.name}</h3>
                        <div className="text-xl font-bold">
                          {formatCurrency(scenario.futureValue)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {scenario.expectedReturn > 0 ? '+' : ''}{(scenario.expectedReturn * 100).toFixed(1)}% annual return
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{scenario.description}</p>
                        <Badge variant="outline" className="text-xs mt-1">{scenario.probability}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart className="h-5 w-5" />
                  <span>Recommended Asset Allocation</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Asset Mix:</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Stocks:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-full bg-blue-600 rounded" 
                              style={{width: `${assetAllocation.stocks}%`}}
                            ></div>
                          </div>
                          <Badge variant="outline">{assetAllocation.stocks}%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Bonds:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-full bg-green-600 rounded" 
                              style={{width: `${assetAllocation.bonds}%`}}
                            ></div>
                          </div>
                          <Badge variant="outline">{assetAllocation.bonds}%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Cash:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-full bg-yellow-600 rounded" 
                              style={{width: `${assetAllocation.cash * 4}%`}}
                            ></div>
                          </div>
                          <Badge variant="outline">{assetAllocation.cash}%</Badge>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Other:</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 h-2 bg-gray-200 rounded">
                            <div 
                              className="h-full bg-purple-600 rounded" 
                              style={{width: `${assetAllocation.other * 8}%`}}
                            ></div>
                          </div>
                          <Badge variant="outline">{assetAllocation.other}%</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Investment Strategy:</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      {riskTolerance === 'conservative' && (
                        <>
                          <p>• Focus on capital preservation</p>
                          <p>• Higher bond allocation for stability</p>
                          <p>• Lower volatility, modest returns</p>
                          <p>• Suitable for near-term goals</p>
                        </>
                      )}
                      {riskTolerance === 'moderate' && (
                        <>
                          <p>• Balanced growth and stability</p>
                          <p>• Diversified across asset classes</p>
                          <p>• Moderate volatility and returns</p>
                          <p>• Good for medium-term goals</p>
                        </>
                      )}
                      {riskTolerance === 'aggressive' && (
                        <>
                          <p>• Maximum growth potential</p>
                          <p>• High stock allocation</p>
                          <p>• Higher volatility, higher returns</p>
                          <p>• Best for long-term goals</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis */}
            <EnhancedAIAnalysis
              calculatorType="investment"
              data={{
                initialInvestment: parseFloat(initialAmount) || 0,
                monthlyContribution: parseFloat(monthlyContribution) || 0,
                annualReturn: parseFloat(annualReturn) || 0,
                years: parseInt(years) || 0,
                finalAmount: result?.futureValue || 0,
                totalContributions: result?.totalContributions || 0,
                totalReturn: result?.totalGrowth || 0
              }}
              userContext={{
                riskTolerance: riskTolerance === 'conservative' ? 'low' : riskTolerance === 'moderate' ? 'medium' : 'high'
              }}
              className="mt-8"
            />

            {/* Export/Share Buttons */}
            <ExportShareButtons
              calculatorType="investment"
              inputs={{
                initialInvestment: parseFloat(initialAmount) || 0,
                monthlyContribution: parseFloat(monthlyContribution) || 0,
                expectedReturn: parseFloat(annualReturn) || 0,
                timeHorizon: parseInt(years) || 0,
                riskTolerance
              }}
              results={result || {}}
              title="Investment Calculator Results"
              className="mt-6"
            />
          </div>
        )}

        <AdsterraSlot position="middle" className="my-6" />

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Investment Planning and Portfolio Management</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Investment planning represents one of the most critical aspects of long-term financial success, enabling 
                  individuals to build wealth, achieve financial goals, and secure their financial future. Understanding 
                  investment principles, risk management, asset allocation, and portfolio optimization is essential for 
                  making informed investment decisions. This comprehensive guide covers fundamental investment concepts, 
                  strategic planning approaches, and practical tools for building and managing successful investment portfolios.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Understanding Investment Fundamentals</h3>
                <p>
                  Successful investing begins with understanding the relationship between risk and return, time horizon 
                  considerations, and the power of compound growth. Higher potential returns typically require accepting 
                  higher levels of risk and volatility, while longer investment horizons allow for greater risk tolerance 
                  and potential for wealth accumulation. The key is finding the optimal balance between growth potential 
                  and risk tolerance that aligns with your specific financial goals and circumstances.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Asset Classes and Investment Vehicles</h3>
                <p>
                  Different asset classes offer varying risk and return characteristics that form the foundation of portfolio 
                  construction. Stocks provide growth potential but with higher volatility, bonds offer stability and income 
                  with lower potential returns, cash equivalents provide liquidity and safety but minimal growth, and alternative 
                  investments like real estate and commodities offer diversification benefits. Understanding each asset class's 
                  role helps create balanced portfolios that meet specific investment objectives.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Asset Class Characteristics:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Stocks:</strong> High growth potential, high volatility, long-term focus</li>
                    <li>• <strong>Bonds:</strong> Steady income, lower volatility, interest rate sensitivity</li>
                    <li>• <strong>Cash:</strong> High liquidity, low risk, minimal returns</li>
                    <li>• <strong>Real Estate:</strong> Inflation hedge, income potential, illiquidity</li>
                    <li>• <strong>Commodities:</strong> Inflation protection, high volatility, cyclical</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Portfolio Diversification Strategies</h3>
                <p>
                  Diversification represents the only "free lunch" in investing, allowing investors to reduce risk without 
                  sacrificing expected returns. Effective diversification spreads investments across different asset classes, 
                  geographic regions, industry sectors, and investment styles to minimize the impact of any single investment's 
                  poor performance. Modern portfolio theory demonstrates that proper diversification can significantly improve 
                  risk-adjusted returns over time, making it a cornerstone of successful investment strategy.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Risk Tolerance and Time Horizon Planning</h3>
                <p>
                  Risk tolerance encompasses both financial capacity to absorb losses and emotional comfort with volatility. 
                  Younger investors with longer time horizons can typically accept higher risk for greater growth potential, 
                  while those nearing retirement may prioritize capital preservation. However, risk tolerance is highly 
                  individual and should consider factors including income stability, emergency funds, other financial 
                  obligations, and personal comfort with market fluctuations.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Dollar-Cost Averaging and Regular Investing</h3>
                <p>
                  Dollar-cost averaging involves investing fixed amounts at regular intervals regardless of market conditions, 
                  providing several benefits including reduced timing risk, emotional discipline, and potentially lower average 
                  purchase costs. This strategy works particularly well for retirement account contributions and helps investors 
                  avoid the common mistake of trying to time market movements. Regular investing also builds wealth systematically 
                  and creates positive financial habits that contribute to long-term success.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Tax-Efficient Investment Strategies</h3>
                <p>
                  Tax considerations significantly impact investment returns, making tax-efficient strategies essential for 
                  maximizing after-tax wealth. Tax-advantaged accounts like 401(k)s and IRAs provide immediate tax benefits 
                  or tax-free growth, while taxable account strategies include tax-loss harvesting, asset location optimization, 
                  and holding investments for favorable long-term capital gains treatment. Understanding the tax implications 
                  of different investment strategies helps optimize overall returns.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Investment Costs and Fee Management</h3>
                <p>
                  Investment costs compound negatively over time, making fee management crucial for long-term wealth building. 
                  High fees can reduce investment returns by 1-2% annually, which compounds to hundreds of thousands of dollars 
                  over decades. Low-cost index funds and ETFs often provide superior long-term results compared to actively 
                  managed alternatives, while fee-conscious investors should evaluate expense ratios, trading costs, and 
                  advisory fees when making investment decisions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Investment Strategies and Portfolio Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Strategic vs. Tactical Asset Allocation</h3>
                <p>
                  Strategic asset allocation establishes long-term target allocations based on investment goals and risk tolerance, 
                  while tactical allocation involves short-term adjustments based on market conditions or opportunities. Most 
                  successful investors rely primarily on strategic allocation with minimal tactical adjustments, avoiding the 
                  temptation to make frequent changes based on market predictions. Rebalancing back to target allocations 
                  systematically captures gains from outperforming assets while buying underperforming assets at lower prices.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Factor Investing and Smart Beta Strategies</h3>
                <p>
                  Factor investing targets specific characteristics like value, momentum, quality, or low volatility that 
                  historically provide risk-adjusted returns above market averages. Smart beta strategies combine these factors 
                  in systematic approaches that aim to improve upon traditional market-cap weighted indexing. While these 
                  strategies can enhance returns, they require understanding of factor premiums, implementation costs, and 
                  the patience to maintain exposure during periods of underperformance.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">International and Emerging Market Investing</h3>
                <p>
                  Global diversification provides access to different economic cycles, growth opportunities, and currency 
                  exposure that can enhance portfolio returns and reduce risk. Developed international markets offer similar 
                  risk profiles to domestic markets with different economic drivers, while emerging markets provide higher 
                  growth potential with increased volatility and political risk. Currency hedging decisions and allocation 
                  percentages depend on risk tolerance and long-term investment objectives.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Portfolio Optimization Checklist:</h4>
                  <ul className="space-y-1">
                    <li>• Define clear investment goals and time horizons</li>
                    <li>• Assess risk tolerance honestly and realistically</li>
                    <li>• Diversify across asset classes, regions, and sectors</li>
                    <li>• Minimize costs through low-fee investment options</li>
                    <li>• Implement tax-efficient strategies for account types</li>
                    <li>• Rebalance systematically, not emotionally</li>
                    <li>• Stay disciplined during market volatility</li>
                    <li>• Review and adjust strategies as circumstances change</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Alternative Investments and Portfolio Enhancement</h3>
                <p>
                  Alternative investments including REITs, commodities, private equity, and hedge funds can provide portfolio 
                  diversification and potentially enhanced returns. However, these investments often come with higher fees, 
                  lower liquidity, and increased complexity that may not be suitable for all investors. For most individual 
                  investors, simple portfolios of stocks, bonds, and REITs through low-cost funds provide adequate diversification 
                  without the complications of complex alternative strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Retirement-Focused Investment Strategies</h3>
                <p>
                  Retirement investing requires balancing growth during accumulation years with income and preservation during 
                  distribution years. Target-date funds provide age-appropriate asset allocation that automatically becomes 
                  more conservative over time, while custom strategies allow for personalized approaches based on specific 
                  circumstances. The transition from accumulation to distribution requires careful planning around withdrawal 
                  rates, Social Security optimization, and tax-efficient distribution strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Behavioral Finance and Investment Psychology</h3>
                <p>
                  Behavioral biases represent the greatest threat to investment success, often causing investors to buy high 
                  during market euphoria and sell low during panic. Common biases include overconfidence, loss aversion, 
                  herding behavior, and recency bias that lead to poor timing decisions. Successful investors develop systems 
                  and processes that minimize emotional decision-making while maintaining discipline during both favorable 
                  and challenging market conditions.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Technology and Modern Portfolio Management</h3>
                <p>
                  Robo-advisors and digital platforms have democratized access to sophisticated portfolio management tools 
                  previously available only to wealthy investors. These platforms often provide automatic rebalancing, tax-loss 
                  harvesting, and low-cost diversified portfolios suitable for many investors. However, technology should 
                  complement rather than replace understanding of investment principles and the importance of maintaining 
                  long-term perspective and discipline.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">ESG and Sustainable Investing</h3>
                <p>
                  Environmental, Social, and Governance (ESG) investing integrates sustainability factors into investment 
                  decisions while potentially maintaining competitive returns. ESG strategies range from negative screening 
                  that excludes certain industries to positive screening that favors companies with strong sustainability 
                  practices. While ESG investing continues evolving, research suggests that well-implemented sustainable 
                  strategies can provide competitive returns while aligning investments with personal values.
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
                    <h4 className="font-semibold text-gray-800 mb-2">What's a realistic expected return for long-term investing?</h4>
                    <p>Historical stock market returns average 7-10% annually before inflation, but conservative planning often uses 6-7% to account for fees and taxes. Bond returns are typically 2-5% annually. Your expected return should reflect your specific asset allocation and investment approach.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much should I invest in stocks vs. bonds?</h4>
                    <p>A common rule suggests holding your age in bonds (e.g., 30-year-old holds 30% bonds, 70% stocks), but this depends on risk tolerance, goals, and time horizon. Younger investors can typically hold more stocks for growth, while those near retirement may want more bonds for stability.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I invest in individual stocks or mutual funds?</h4>
                    <p>Most investors benefit from diversified mutual funds or ETFs rather than individual stocks. Funds provide instant diversification, professional management, and lower risk than individual securities. Stock picking requires significant research, time, and expertise that most investors lack.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How often should I rebalance my portfolio?</h4>
                    <p>Rebalancing annually or when allocations drift more than 5-10% from targets typically works well for most investors. More frequent rebalancing increases costs without significant benefits, while less frequent rebalancing may allow allocations to drift too far from targets.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What's the difference between active and passive investing?</h4>
                    <p>Active investing involves trying to beat market returns through security selection and timing, while passive investing seeks to match market returns through index funds. Passive investing typically provides better long-term results due to lower costs and reduced behavioral errors.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How do I invest during market volatility?</h4>
                    <p>Maintain your long-term strategy and avoid emotional reactions to short-term market movements. Continue regular contributions through dollar-cost averaging, and consider volatility as an opportunity to buy quality investments at lower prices. Market timing typically reduces rather than enhances returns.</p>
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
              <p>• Past performance does not guarantee future results in any investment scenario.</p>
              <p>• Consider consulting with qualified financial advisors for personalized investment strategies.</p>
              <p>• Market volatility can cause actual returns to differ significantly from steady growth assumptions.</p>
              <p>• Investment fees, taxes, and inflation can substantially impact actual returns over time.</p>
              <p>• Risk tolerance and investment suitability vary by individual circumstances and goals.</p>
              <p>• All investments carry risk of loss, including potential loss of principal.</p>
              <p>• Results are estimates only and actual investment outcomes may vary significantly from calculations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}