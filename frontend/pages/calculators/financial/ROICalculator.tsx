import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calculator, BarChart3, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useFormatting } from '../../../utils/formatting';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface ROIResult {
  roi: number;
  profit: number;
  totalReturn: number;
  annualizedROI: number;
  isGain: boolean;
  breakEvenAmount: number;
  profitabilityIndex: number;
}

interface CostBenefit {
  totalCosts: number;
  totalBenefits: number;
  netBenefit: number;
  benefitCostRatio: number;
}

interface ROIComparison {
  investment: string;
  initialAmount: number;
  finalValue: number;
  roi: number;
  annualizedROI: number;
}

export function ROICalculator() {
  const { formatCurrency, getCurrencySymbol } = useFormatting();
  
  const [calculationType, setCalculationType] = useState('basic');
  const [initialInvestment, setInitialInvestment] = useState('');
  const [finalValue, setFinalValue] = useState('');
  const [timeHeld, setTimeHeld] = useState('');
  const [additionalCosts, setAdditionalCosts] = useState('');
  const [dividendsReceived, setDividendsReceived] = useState('');
  const [result, setResult] = useState<ROIResult | null>(null);
  const [costBenefit, setCostBenefit] = useState<CostBenefit | null>(null);
  const [comparisons, setComparisons] = useState<ROIComparison[]>([]);

  const calculateROI = () => {
    const initial = parseFloat(initialInvestment);
    const final = parseFloat(finalValue);
    const time = parseFloat(timeHeld) || 1;
    const additionalCost = parseFloat(additionalCosts) || 0;
    const dividends = parseFloat(dividendsReceived) || 0;

    if (!initial || !final || initial <= 0 || final < 0) {
      setResult(null);
      return;
    }

    const totalInvestment = initial + additionalCost;
    const totalReturns = final + dividends;
    const profit = totalReturns - totalInvestment;
    const roi = (profit / totalInvestment) * 100;
    const totalReturn = totalReturns;
    
    // Calculate annualized ROI
    let annualizedROI = 0;
    if (time > 0) {
      annualizedROI = (Math.pow(totalReturns / totalInvestment, 1 / time) - 1) * 100;
    }

    const isGain = profit > 0;
    const breakEvenAmount = totalInvestment;
    const profitabilityIndex = totalReturns / totalInvestment;

    setResult({
      roi,
      profit,
      totalReturn,
      annualizedROI,
      isGain,
      breakEvenAmount,
      profitabilityIndex
    });

    // Calculate cost-benefit analysis if applicable
    if (calculationType === 'business') {
      setCostBenefit({
        totalCosts: totalInvestment,
        totalBenefits: totalReturns,
        netBenefit: profit,
        benefitCostRatio: totalReturns / totalInvestment
      });
    }

    // Generate comparison scenarios
    generateComparisons(initial, final, time);
  };

  const generateComparisons = (initial: number, final: number, time: number) => {
    const scenarios: ROIComparison[] = [
      {
        investment: 'Current Investment',
        initialAmount: initial,
        finalValue: final,
        roi: ((final - initial) / initial) * 100,
        annualizedROI: time > 0 ? (Math.pow(final / initial, 1 / time) - 1) * 100 : 0
      },
      {
        investment: 'S&P 500 (7% avg)',
        initialAmount: initial,
        finalValue: initial * Math.pow(1.07, time),
        roi: (Math.pow(1.07, time) - 1) * 100,
        annualizedROI: 7
      },
      {
        investment: 'Conservative (4% avg)',
        initialAmount: initial,
        finalValue: initial * Math.pow(1.04, time),
        roi: (Math.pow(1.04, time) - 1) * 100,
        annualizedROI: 4
      },
      {
        investment: 'High-Growth (10% avg)',
        initialAmount: initial,
        finalValue: initial * Math.pow(1.10, time),
        roi: (Math.pow(1.10, time) - 1) * 100,
        annualizedROI: 10
      }
    ];

    setComparisons(scenarios);
  };

  useEffect(() => {
    calculateROI();
  }, [initialInvestment, finalValue, timeHeld, additionalCosts, dividendsReceived, calculationType]);

  const getROIInterpretation = (roi: number, annualized: number) => {
    if (roi > 0) {
      if (annualized > 15) return { level: 'Excellent', color: 'text-green-600', description: 'Outstanding returns' };
      if (annualized > 10) return { level: 'Very Good', color: 'text-green-500', description: 'Above average performance' };
      if (annualized > 7) return { level: 'Good', color: 'text-blue-600', description: 'Solid returns' };
      if (annualized > 3) return { level: 'Fair', color: 'text-yellow-600', description: 'Below average returns' };
      return { level: 'Poor', color: 'text-orange-600', description: 'Underperforming' };
    } else {
      return { level: 'Loss', color: 'text-red-600', description: 'Negative returns' };
    }
  };

  return (
    <CalculatorLayoutWithAds
      title="ROI Calculator | Return on Investment & Profitability Calculator"
      description="Comprehensive ROI calculator with annualized returns, cost-benefit analysis, and investment comparisons. Calculate return on investment for stocks, business projects, and financial decisions."
      keywords="ROI calculator, return on investment calculator, profitability calculator, annualized return calculator, cost benefit analysis, investment performance"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>ROI Calculator</span>
            </CardTitle>
            <CardDescription>
              Calculate return on investment with comprehensive analysis and comparisons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="calculationType">Calculation Type</Label>
              <Select value={calculationType} onValueChange={setCalculationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select calculation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic ROI</SelectItem>
                  <SelectItem value="investment">Investment with Dividends</SelectItem>
                  <SelectItem value="business">Business Project</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="initialInvestment">Initial Investment ({getCurrencySymbol()})</Label>
                <Input
                  id="initialInvestment"
                  type="number"
                  placeholder="10000"
                  value={initialInvestment}
                  onChange={(e) => setInitialInvestment(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="finalValue">
                  {calculationType === 'business' ? 'Final Value/Revenue' : 'Final Value'} ({getCurrencySymbol()})
                </Label>
                <Input
                  id="finalValue"
                  type="number"
                  placeholder="12000"
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeHeld">Time Period (Years)</Label>
                <Input
                  id="timeHeld"
                  type="number"
                  step="0.1"
                  placeholder="2"
                  value={timeHeld}
                  onChange={(e) => setTimeHeld(e.target.value)}
                />
              </div>

              {(calculationType === 'investment' || calculationType === 'real_estate' || calculationType === 'business') && (
                <div className="space-y-2">
                  <Label htmlFor="additionalCosts">
                    {calculationType === 'real_estate' ? 'Transaction Costs' : 
                     calculationType === 'business' ? 'Operating Costs' : 'Additional Costs'} ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="additionalCosts"
                    type="number"
                    placeholder="500"
                    value={additionalCosts}
                    onChange={(e) => setAdditionalCosts(e.target.value)}
                  />
                </div>
              )}

              {(calculationType === 'investment' || calculationType === 'real_estate') && (
                <div className="space-y-2">
                  <Label htmlFor="dividendsReceived">
                    {calculationType === 'real_estate' ? 'Rental Income' : 'Dividends/Income'} ({getCurrencySymbol()})
                  </Label>
                  <Input
                    id="dividendsReceived"
                    type="number"
                    placeholder="400"
                    value={dividendsReceived}
                    onChange={(e) => setDividendsReceived(e.target.value)}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* AI Analysis */}
            <AIAnalysis
              analysisRequest={{
                calculatorType: "roi",
                data: {
                  initialInvestment: parseFloat(initialInvestment) || 0,
                  finalValue: parseFloat(finalValue) || 0,
                  roi: result.roi,
                  annualizedReturn: result.annualizedROI,
                  profit: result.profit,
                  timeHeld: parseFloat(timeHeld) || 1
                }
              }}
              autoRun={true}
              title="AI ROI Analysis"
              description="Get personalized insights on your investment performance and optimization strategies."
            />

            <ExportShareButtons
              calculatorType="roi"
              inputs={{
                initialInvestment: parseFloat(initialInvestment) || 0,
                finalValue: parseFloat(finalValue) || 0,
                timeHeld: parseFloat(timeHeld) || 1
              }}
              results={{
                roi: result.roi,
                annualizedROI: result.annualizedROI,
                profit: result.profit
              }}
              title="ROI Calculator Report"
            />

            {/* Main Results */}
            <Card className={`border-2 ${result.isGain ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
              <CardHeader className="pb-3">
                <CardTitle className={`text-lg font-bold ${result.isGain ? 'text-green-800' : 'text-red-800'}`}>
                  ROI Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${result.isGain ? 'text-green-600' : 'text-red-600'}`}>
                      {result.roi > 0 ? '+' : ''}{result.roi.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Total ROI</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {result.annualizedROI > 0 ? '+' : ''}{result.annualizedROI.toFixed(2)}%
                    </div>
                    <p className="text-sm text-muted-foreground">Annualized ROI</p>
                  </div>

                  <div className="text-center">
                    <div className={`text-2xl font-bold ${result.isGain ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(result.profit)}
                    </div>
                    <p className="text-sm text-muted-foreground">{result.isGain ? 'Profit' : 'Loss'}</p>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {result.profitabilityIndex.toFixed(2)}
                    </div>
                    <p className="text-sm text-muted-foreground">Profitability Index</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span>Performance Rating:</span>
                      <Badge className={getROIInterpretation(result.roi, result.annualizedROI).color}>
                        {getROIInterpretation(result.roi, result.annualizedROI).level}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Break-even Amount:</span>
                      <Badge variant="outline">{formatCurrency(result.breakEvenAmount)}</Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {getROIInterpretation(result.roi, result.annualizedROI).description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Cost-Benefit Analysis */}
            {costBenefit && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Cost-Benefit Analysis</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2">Total Costs</h3>
                      <div className="text-xl font-bold text-red-600">
                        {formatCurrency(costBenefit.totalCosts)}
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2">Total Benefits</h3>
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(costBenefit.totalBenefits)}
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2">Net Benefit</h3>
                      <div className={`text-xl font-bold ${costBenefit.netBenefit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(costBenefit.netBenefit)}
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <h3 className="font-semibold text-sm mb-2">Benefit-Cost Ratio</h3>
                      <div className="text-xl font-bold text-blue-600">
                        {costBenefit.benefitCostRatio.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Interpretation:</strong> A benefit-cost ratio above 1.0 indicates a profitable investment. 
                      Ratios above 2.0 are generally considered very attractive.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comparison Analysis */}
            {comparisons.length > 0 && parseFloat(timeHeld) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Investment Performance Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Investment Type</th>
                          <th className="text-right p-2">Initial Amount</th>
                          <th className="text-right p-2">Final Value</th>
                          <th className="text-right p-2">Total ROI</th>
                          <th className="text-right p-2">Annualized ROI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisons.map((comp, index) => (
                          <tr key={index} className={`border-b hover:bg-gray-50 ${index === 0 ? 'bg-blue-50' : ''}`}>
                            <td className="p-2 font-medium">{comp.investment}</td>
                            <td className="p-2 text-right">{formatCurrency(comp.initialAmount)}</td>
                            <td className="p-2 text-right">{formatCurrency(comp.finalValue)}</td>
                            <td className={`p-2 text-right font-semibold ${comp.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {comp.roi > 0 ? '+' : ''}{comp.roi.toFixed(2)}%
                            </td>
                            <td className={`p-2 text-right font-semibold ${comp.annualizedROI >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {comp.annualizedROI > 0 ? '+' : ''}{comp.annualizedROI.toFixed(2)}%
                            </td>
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
              <CardTitle>Complete Guide to Return on Investment (ROI) Analysis</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Return on Investment (ROI) is one of the most fundamental and widely used metrics for evaluating 
                  investment performance and business profitability. Understanding how to calculate, interpret, and 
                  apply ROI analysis is essential for making informed financial decisions, comparing investment 
                  alternatives, and measuring the success of financial strategies. This comprehensive guide covers 
                  ROI fundamentals, advanced applications, and strategic considerations for optimizing investment 
                  returns across different scenarios.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Understanding ROI Fundamentals</h3>
                <p>
                  ROI measures the efficiency of an investment by comparing the gain or loss relative to the initial 
                  investment cost. The basic ROI formula (Gain - Cost) / Cost × 100 provides a percentage return that 
                  enables easy comparison between different investments. However, effective ROI analysis requires 
                  understanding various calculation methods, time considerations, and the limitations of simple ROI 
                  metrics in complex investment scenarios.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Annualized ROI and Time-Adjusted Returns</h3>
                <p>
                  Simple ROI doesn't account for the time factor, making it inadequate for comparing investments with 
                  different holding periods. Annualized ROI provides a standardized metric by calculating the equivalent 
                  annual return rate. For example, a 44% total return over 4 years equals approximately 9.6% annualized 
                  return, which is more meaningful for comparison with other investments or market benchmarks. Time-adjusted 
                  metrics provide better insights into investment efficiency and compounding effects.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">ROI Calculation Examples:</h4>
                  <ul className="space-y-1">
                    <li>• <strong>Basic ROI:</strong> ($12,000 - $10,000) / $10,000 = 20%</li>
                    <li>• <strong>Annualized ROI:</strong> (12,000/10,000)^(1/2) - 1 = 9.54% per year</li>
                    <li>• <strong>With Dividends:</strong> ($12,000 + $400 - $10,000) / $10,000 = 24%</li>
                    <li>• <strong>Including Costs:</strong> ($12,000 + $400 - $10,000 - $100) / $10,100 = 22.77%</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Cost-Benefit Analysis and Business ROI</h3>
                <p>
                  Business ROI analysis extends beyond simple investment returns to include comprehensive cost-benefit 
                  evaluation. This involves identifying all direct and indirect costs, quantifying tangible and intangible 
                  benefits, and calculating metrics like benefit-cost ratios and net present value. Business ROI helps 
                  evaluate projects, marketing campaigns, technology investments, and operational improvements by providing 
                  a framework for comparing diverse initiatives on a common financial basis.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Risk-Adjusted ROI and Performance Metrics</h3>
                <p>
                  High ROI doesn't automatically indicate superior investment performance if it comes with excessive risk. 
                  Risk-adjusted metrics like the Sharpe ratio (return per unit of risk) and alpha (excess return above 
                  market expectations) provide better insights into investment quality. These metrics help investors 
                  understand whether higher returns justify additional risk and compare investments with different risk 
                  profiles on an equivalent basis.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Tax Implications and After-Tax ROI</h3>
                <p>
                  Tax considerations significantly impact actual investment returns, making after-tax ROI calculations 
                  essential for accurate performance evaluation. Different investment types face varying tax treatment: 
                  ordinary income tax on dividends and interest, capital gains tax on asset appreciation, and potential 
                  tax benefits from depreciation or losses. Understanding these implications helps optimize investment 
                  strategies and provides realistic expectations for net returns.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Industry-Specific ROI Benchmarks</h3>
                <p>
                  ROI expectations vary significantly across industries and investment types. Technology and growth companies 
                  may target 15-25% annual returns but with higher volatility, while utility stocks might provide 4-8% 
                  returns with greater stability. Real estate investments typically target 8-12% returns including rental 
                  income, while private equity often seeks 20%+ returns to compensate for illiquidity and risk. Understanding 
                  industry benchmarks helps set realistic expectations and evaluate relative performance.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Limitations of ROI Analysis</h3>
                <p>
                  While ROI is valuable for investment evaluation, it has important limitations that investors should understand. 
                  ROI doesn't account for cash flow timing, risk differences, opportunity costs, or qualitative factors that 
                  may affect investment success. Additionally, ROI calculations can be manipulated through different accounting 
                  methods or selective time period choices. Comprehensive investment analysis should supplement ROI with other 
                  metrics and qualitative considerations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced ROI Applications and Optimization Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Portfolio-Level ROI Analysis</h3>
                <p>
                  Portfolio ROI requires weighted analysis that accounts for different asset sizes and holding periods 
                  within the overall portfolio. This involves calculating individual asset returns, weighting them by 
                  portfolio allocation, and considering correlation effects and rebalancing impacts. Portfolio-level 
                  analysis helps identify which investments contribute most to overall performance and guides strategic 
                  allocation decisions.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Real Estate ROI Calculations</h3>
                <p>
                  Real estate ROI involves multiple income streams and cost factors that require specialized calculation 
                  methods. Cash-on-cash return measures annual cash flow against initial cash investment, while total 
                  return includes appreciation, tax benefits, and loan principal reduction. Real estate ROI must also 
                  consider transaction costs, ongoing maintenance, property management fees, and potential vacancy periods 
                  for accurate performance assessment.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Marketing and Business Investment ROI</h3>
                <p>
                  Marketing ROI calculation requires tracking customer acquisition costs, lifetime value, attribution 
                  across multiple touchpoints, and long-term brand effects. Business investment ROI for technology, 
                  equipment, or process improvements often includes productivity gains, cost savings, and competitive 
                  advantages that extend beyond direct financial returns. These analyses require sophisticated modeling 
                  to capture all relevant benefits and costs.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">ROI Optimization Strategies:</h4>
                  <ul className="space-y-1">
                    <li>• Include all relevant costs and benefits in calculations</li>
                    <li>• Use annualized returns for meaningful comparisons</li>
                    <li>• Consider risk-adjusted metrics alongside raw returns</li>
                    <li>• Account for tax implications in after-tax analysis</li>
                    <li>• Compare against relevant benchmarks and alternatives</li>
                    <li>• Monitor performance regularly and adjust strategies</li>
                    <li>• Consider qualitative factors beyond pure ROI numbers</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Technology and ROI Tracking</h3>
                <p>
                  Modern portfolio management software and financial tracking tools enable sophisticated ROI analysis 
                  with real-time performance monitoring, automated calculations, and comprehensive reporting. These 
                  tools can account for dividend reinvestment, fee impacts, tax implications, and multi-currency 
                  investments while providing historical performance analysis and future projection capabilities.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Behavioral Factors in ROI Analysis</h3>
                <p>
                  Psychological biases can significantly impact ROI evaluation and decision-making. Anchoring bias may 
                  cause overemphasis on purchase prices, while confirmation bias leads to selective interpretation of 
                  performance data. Recency bias overweights recent performance, and loss aversion may cause premature 
                  exit from temporarily underperforming investments. Recognizing these biases helps maintain objective 
                  ROI analysis and long-term investment discipline.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">ESG and Sustainable ROI</h3>
                <p>
                  Environmental, Social, and Governance (ESG) investing requires expanded ROI analysis that incorporates 
                  non-financial returns and long-term sustainability factors. This may include carbon footprint reduction, 
                  social impact measurement, and governance quality assessment alongside traditional financial metrics. 
                  ESG ROI analysis helps investors align values with returns while potentially identifying companies 
                  better positioned for long-term success.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">International Investment ROI</h3>
                <p>
                  International investment ROI requires consideration of currency fluctuations, foreign tax implications, 
                  and different market dynamics. Currency hedging decisions significantly impact returns, while foreign 
                  tax credits and treaties affect after-tax performance. International diversification benefits must be 
                  weighed against additional costs and complexity in comprehensive ROI analysis.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Alternative Investment ROI</h3>
                <p>
                  Alternative investments like private equity, hedge funds, commodities, and collectibles require specialized 
                  ROI calculation methods that account for illiquidity, J-curve effects, and unique fee structures. These 
                  investments often involve longer time horizons, limited transparency, and complex return distributions 
                  that make traditional ROI analysis insufficient for comprehensive performance evaluation.
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
                    <h4 className="font-semibold text-gray-800 mb-2">What's considered a good ROI for investments?</h4>
                    <p>Good ROI varies by asset class and risk level. Stock market historical average is 7-10% annually. Conservative investments might yield 3-5%, while growth investments may target 10-15%+. Consider risk, time horizon, and inflation when evaluating ROI adequacy.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I use simple ROI or annualized ROI for comparisons?</h4>
                    <p>Use annualized ROI for meaningful comparisons between investments with different time periods. Simple ROI is useful for quick calculations but doesn't account for time value of money or compounding effects that are crucial for investment evaluation.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How do I calculate ROI for investments with regular dividends?</h4>
                    <p>Include all cash received (dividends, interest, distributions) in your return calculation: (Final Value + Total Dividends - Initial Investment) / Initial Investment. This provides total return that reflects the complete investment benefit.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What costs should I include in ROI calculations?</h4>
                    <p>Include all costs directly related to the investment: purchase price, transaction fees, management fees, taxes, and opportunity costs. For business investments, include implementation, training, and ongoing operational costs for accurate ROI assessment.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How does inflation affect ROI analysis?</h4>
                    <p>Inflation reduces purchasing power of returns. Calculate real ROI by subtracting inflation rate from nominal ROI. For example, 8% nominal return with 3% inflation equals 5% real return in purchasing power terms.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can ROI be negative, and what does it mean?</h4>
                    <p>Yes, negative ROI indicates a loss where the investment value declined below the initial cost. This is normal for some periods but concerning for long-term investments. Consider whether losses are temporary market volatility or fundamental performance issues.</p>
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
              <p>• ROI calculations may not include all relevant costs, taxes, or fees that affect actual returns.</p>
              <p>• Past performance and calculated ROI do not guarantee future investment results.</p>
              <p>• Consider risk factors, liquidity needs, and time horizon alongside ROI analysis.</p>
              <p>• Tax implications can significantly impact after-tax ROI and should be considered separately.</p>
              <p>• Market conditions and economic factors can affect actual investment performance.</p>
              <p>• Consult with qualified financial advisors for comprehensive investment analysis and planning.</p>
              <p>• ROI analysis should be supplemented with other financial metrics and qualitative factors.</p>
              <p>• Results are estimates only and actual investment outcomes may vary significantly from calculations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}