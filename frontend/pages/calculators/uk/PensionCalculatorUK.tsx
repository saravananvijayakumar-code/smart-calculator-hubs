import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Info, Target, Clock, Brain, Shield, AlertTriangle, CheckCircle, ArrowUp, DollarSign, Users, Book, Lightbulb, FileText, BarChart3, Calendar, Wallet } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import backend from '~backend/client';
import type { PensionAnalysisData } from '~backend/ai-analysis/types';

const PensionCalculatorUK: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<string>('');
  const [retirementAge, setRetirementAge] = useState<string>('66');
  const [currentPension, setCurrentPension] = useState<string>('');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('');
  const [employerContribution, setEmployerContribution] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<string>('5');
  const [inflationRate, setInflationRate] = useState<string>('2.5');
  const [results, setResults] = useState<any>(null);

  const calculatePension = () => {
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const currentPot = parseFloat(currentPension) || 0;
    const monthlyEE = parseFloat(monthlyContribution) || 0;
    const monthlyER = parseFloat(employerContribution) || 0;
    const annualReturn = parseFloat(expectedReturn) / 100;
    const inflation = parseFloat(inflationRate) / 100;

    if (!age || !retAge || retAge <= age) return;

    const yearsToRetirement = retAge - age;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturn = annualReturn / 12;
    const totalMonthlyContribution = monthlyEE + monthlyER;

    // Future value of current pension pot
    const futureCurrentPot = currentPot * Math.pow(1 + annualReturn, yearsToRetirement);

    // Future value of monthly contributions
    let futureContributions = 0;
    if (totalMonthlyContribution > 0 && monthlyReturn > 0) {
      futureContributions = totalMonthlyContribution * 
        (Math.pow(1 + monthlyReturn, monthsToRetirement) - 1) / monthlyReturn;
    } else if (totalMonthlyContribution > 0) {
      futureContributions = totalMonthlyContribution * monthsToRetirement;
    }

    const totalPensionPot = futureCurrentPot + futureContributions;
    const totalContributed = currentPot + (totalMonthlyContribution * monthsToRetirement);

    // Annual pension estimates (using 4% withdrawal rule)
    const annualPension = totalPensionPot * 0.04;
    const monthlyPension = annualPension / 12;

    // Real value (inflation-adjusted)
    const realAnnualPension = annualPension / Math.pow(1 + inflation, yearsToRetirement);
    const realMonthlyPension = realAnnualPension / 12;

    // State pension estimate
    const statePensionWeekly = 203.85; // 2024/25 full state pension
    const statePensionAnnual = statePensionWeekly * 52;

    // Tax relief on contributions (assuming 20% basic rate)
    const annualTaxRelief = (monthlyEE * 12) * 0.25; // 20% grossed up

    const calculationResults = {
      totalPensionPot,
      totalContributed,
      pensionGrowth: totalPensionPot - totalContributed,
      annualPension,
      monthlyPension,
      realAnnualPension,
      realMonthlyPension,
      statePensionAnnual,
      totalAnnualIncome: annualPension + statePensionAnnual,
      annualTaxRelief,
      yearsToRetirement
    };
    
    setResults(calculationResults);
  };

  const reset = () => {
    setCurrentAge('');
    setRetirementAge('66');
    setCurrentPension('');
    setMonthlyContribution('');
    setEmployerContribution('');
    setExpectedReturn('5');
    setInflationRate('2.5');
    setResults(null);
  };

  const tips = [
    "Auto-enrolment minimum: 8% total (3% employee, 5% employer)",
    "Annual allowance for pension contributions is £40,000 (2024/25)",
    "State pension provides foundation - private pensions top up income",
    "Starting early makes huge difference due to compound growth",
    "Consider salary sacrifice for tax efficiency"
  ];

  return (
    <CalculatorLayoutWithAds
      title="UK Pension Calculator 2024 - Free Retirement Planning Tool | Smart Calculator Hubs"
      description="Calculate your UK pension pot growth, retirement income, and workplace pension contributions. Free pension calculator with tax relief, state pension estimates, and AI-powered analysis. Plan your retirement today!"
      keywords="UK pension calculator 2024, retirement planning calculator, workplace pension calculator, auto enrolment calculator, pension pot calculator, UK retirement income calculator, pension contributions calculator, state pension calculator, pension planning tool, retirement savings calculator"
      tips={tips}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Pension Calculator
            </CardTitle>
            <CardDescription>
              Plan your retirement with pension projections
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentAge">Current Age</Label>
                <Input
                  id="currentAge"
                  type="number"
                  placeholder="Enter age"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retirementAge">Retirement Age</Label>
                <Input
                  id="retirementAge"
                  type="number"
                  placeholder="Enter retirement age"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPension">Current Pension Pot (£)</Label>
              <Input
                id="currentPension"
                type="number"
                placeholder="Enter current pension value"
                value={currentPension}
                onChange={(e) => setCurrentPension(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyContribution">Your Monthly Contribution (£)</Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  placeholder="Employee contribution"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employerContribution">Employer Contribution (£)</Label>
                <Input
                  id="employerContribution"
                  type="number"
                  placeholder="Employer contribution"
                  value={employerContribution}
                  onChange={(e) => setEmployerContribution(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expectedReturn">Expected Return (%)</Label>
                <Input
                  id="expectedReturn"
                  type="number"
                  step="0.1"
                  placeholder="Annual return"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inflationRate">Inflation Rate (%)</Label>
                <Input
                  id="inflationRate"
                  type="number"
                  step="0.1"
                  placeholder="Inflation rate"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculatePension} className="flex-1">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Pension Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Pension Pot at Retirement</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(results.totalPensionPot, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributed</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.totalContributed, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pension Growth</p>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(results.pensionGrowth, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Tax Relief</p>
                  <p className="text-lg font-semibold text-orange-600">{formatCurrency(results.annualTaxRelief, 'GBP')}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Retirement Income (Annual)</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Private Pension:</span>
                    <Badge variant="outline">{formatCurrency(results.annualPension, 'GBP')}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">State Pension:</span>
                    <Badge variant="secondary">{formatCurrency(results.statePensionAnnual, 'GBP')}</Badge>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-sm">Total Income:</span>
                    <Badge>{formatCurrency(results.totalAnnualIncome, 'GBP')}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">In Today's Money</h4>
                <div className="flex justify-between">
                  <span className="text-sm">Real Annual Income:</span>
                  <Badge variant="outline">{formatCurrency(results.realAnnualPension, 'GBP')}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Real Monthly Income:</span>
                  <Badge variant="outline">{formatCurrency(results.realMonthlyPension, 'GBP')}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {results && (
        <>
          <AIAnalysis 
            analysisRequest={{
              calculatorType: 'pension-calculator-uk',
              data: {
                currentAge: parseFloat(currentAge) || 0,
                retirementAge: parseFloat(retirementAge) || 66,
                currentPension: parseFloat(currentPension) || 0,
                monthlyContribution: (parseFloat(monthlyContribution) || 0) + (parseFloat(employerContribution) || 0),
                expectedReturn: parseFloat(expectedReturn) || 5,
                finalPensionPot: results.totalPensionPot,
                annualIncome: results.annualPension
              },
              userContext: {
                age: parseFloat(currentAge) || 0,
                location: 'UK'
              }
            }}
            autoRun={true}
            title="AI Pension Analysis"
            description="Get personalized recommendations to optimize your pension strategy and retirement planning."
          />

          <ExportShareButtons
            calculatorType="pension-calculator-uk"
            inputs={{
              currentAge: parseFloat(currentAge) || 0,
              retirementAge: parseFloat(retirementAge) || 66,
              currentPension: parseFloat(currentPension) || 0,
              monthlyContribution: parseFloat(monthlyContribution) || 0,
              employerContribution: parseFloat(employerContribution) || 0,
              expectedReturn: parseFloat(expectedReturn) || 5
            }}
            results={{
              totalPensionPot: results.totalPensionPot,
              annualPension: results.annualPension,
              monthlyPension: results.monthlyPension,
              totalContributions: results.totalContributions,
              totalTaxRelief: results.totalTaxRelief
            }}
            title="Pension Calculator UK Report"
            className="mt-6"
          />
        </>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Complete Guide to UK Pension Planning
          </CardTitle>
          <CardDescription>
            Everything you need to know about pension planning, maximizing your retirement savings, and securing your financial future in the UK
          </CardDescription>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <h4 className="font-semibold text-blue-900">State Pension Foundation</h4>
                  </div>
                  <p className="text-sm text-gray-600">£203.85 weekly with 35+ NI years</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="h-6 w-6 text-green-600" />
                    <h4 className="font-semibold text-green-900">Workplace Pension</h4>
                  </div>
                  <p className="text-sm text-gray-600">8% minimum (3% employee + 5% employer)</p>
                </CardContent>
              </Card>
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Wallet className="h-6 w-6 text-purple-600" />
                    <h4 className="font-semibold text-purple-900">Personal Savings</h4>
                  </div>
                  <p className="text-sm text-gray-600">ISAs, SIPPs, and other investments</p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ArrowUp className="h-6 w-6 text-green-600" />
                The UK Pension Revolution: From Security to Self-Reliance
              </h3>
              <p className="mb-4">
                The UK pension landscape has undergone a seismic transformation over the past three decades. Gone are the days when workers could rely solely on generous employer-provided defined benefit pensions that guaranteed a comfortable retirement income. Today's pension system places unprecedented responsibility on individuals to secure their own financial futures, making pension literacy not just beneficial but absolutely essential for anyone hoping to maintain their lifestyle in retirement.
              </p>
              <p className="mb-4">
                This shift from collective security to individual responsibility coincided with revolutionary changes in working patterns, life expectancy, and economic realities. The average person now changes jobs multiple times throughout their career, accumulating pension pots from various employers. Meanwhile, people are living longer than ever before, with many spending 20-30 years in retirement. These changes have fundamentally altered the pension planning equation, requiring more sophisticated strategies and higher levels of personal engagement.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                The Three-Pillar System: Building Retirement Security
              </h3>
              <p className="mb-4">
                Modern UK retirement planning rests on three distinct pillars, each serving a specific purpose in creating comprehensive financial security. Understanding how these pillars work together is crucial for developing an effective retirement strategy.
              </p>
              
              <h4 className="text-xl font-semibold mb-3 text-blue-800">First Pillar: The State Pension Foundation</h4>
              <p className="mb-4">
                The state pension provides the bedrock of UK retirement income, currently offering £203.85 per week (£10,600 annually) for those with complete National Insurance records. This foundation requires 35 years of qualifying contributions, though you can receive a partial pension with just 10 years. The state pension is triple-locked, meaning it rises each year by the highest of inflation, average earnings growth, or 2.5%. While this provides valuable security, it's worth noting that this amount alone falls well short of what most people need for a comfortable retirement.
              </p>
              
              <h4 className="text-xl font-semibold mb-3 text-green-800">Second Pillar: Workplace Pensions and Auto-Enrolment</h4>
              <p className="mb-4">
                Auto-enrolment has revolutionized UK pension saving by requiring employers to automatically enroll eligible workers into workplace pension schemes. The current minimum contribution rates total 8% of qualifying earnings between £6,240 and £50,270, split between employee (5%) and employer (3%) contributions. While these percentages might seem modest, they can accumulate to substantial amounts over a full working career, particularly when enhanced by tax relief and compound investment growth.
              </p>
              <p className="mb-4">
                However, many financial experts argue that the 8% minimum is insufficient for maintaining living standards in retirement. Research suggests that workers should aim to contribute 12-15% of their income throughout their careers to achieve adequate retirement income replacement ratios of 60-70% of pre-retirement income.
              </p>
              
              <h4 className="text-xl font-semibold mb-3 text-purple-800">Third Pillar: Personal Savings and Investments</h4>
              <p className="mb-4">
                The third pillar encompasses all additional retirement savings beyond state and workplace pensions. This includes Individual Savings Accounts (ISAs), Self-Invested Personal Pensions (SIPPs), personal pension plans, and general investment accounts. This pillar becomes increasingly important for higher earners who want to maintain their lifestyle in retirement or for those who start pension saving later in life and need to catch up.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-green-600" />
                Tax Relief: The Government's Hidden Contribution
              </h3>
              <p className="mb-4">
                One of the most powerful yet underappreciated aspects of UK pension saving is the generous tax relief provided by the government. This effectively means that for every pound you contribute to your pension, the government adds additional money, making pension contributions extraordinarily tax-efficient.
              </p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-green-800 mb-2">Tax Relief Examples:</h4>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Basic Rate (20%):</strong> Contribute £80, government adds £20 = £100 in pension</li>
                  <li>• <strong>Higher Rate (40%):</strong> Contribute £100, get £25 back via tax relief + £25 to pension</li>
                  <li>• <strong>Additional Rate (45%):</strong> Even greater tax advantages for the highest earners</li>
                </ul>
              </div>
              
              <p className="mb-4">
                The annual allowance for pension contributions is £40,000 (2024/25), though this can be reduced for very high earners through the tapered annual allowance. Most workers can contribute substantial amounts while receiving significant tax advantages, making pension contributions often the most tax-efficient form of saving available.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-600" />
                The Magic of Compound Growth: Time as Your Greatest Asset
              </h3>
              <p className="mb-4">
                The most powerful force in pension building is compound growth – the phenomenon where your investment returns generate their own returns over time. This creates an exponential growth effect that becomes more pronounced the longer you invest. Understanding compound growth is crucial because it explains why starting pension contributions early, even with smaller amounts, can be more effective than starting later with larger contributions.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-blue-800 mb-2">Compound Growth Example:</h4>
                <p className="text-sm mb-2">Two people save £200 monthly with 6% annual returns:</p>
                <ul className="space-y-1 text-sm">
                  <li>• <strong>Start at 25, save for 40 years:</strong> Final pot ≈ £393,000</li>
                  <li>• <strong>Start at 35, save for 30 years:</strong> Final pot ≈ £201,000</li>
                  <li>• <strong>The 10-year head start nearly doubles the final amount!</strong></li>
                </ul>
              </div>
              
              <p className="mb-4">
                Historical equity market returns suggest average annual growth of 6-8% over long periods, though these come with volatility and risk. Pension investments should be diversified across different asset classes and gradually adjusted to become more conservative as retirement approaches. The key is to start early and maintain consistent contributions, allowing compound growth to work its magic over decades.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-600" />
                Pension Freedoms: Flexibility with Responsibility
              </h3>
              <p className="mb-4">
                The pension freedoms introduced in 2015 revolutionized how people can access their pension savings, providing unprecedented flexibility from age 55 (rising to 57 in 2028). These freedoms eliminated the requirement to purchase an annuity and opened up multiple withdrawal strategies, each with distinct advantages and risks.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mb-4">
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Pension Drawdown</h4>
                    <p className="text-sm text-gray-600 mb-2">Flexible income with investment control</p>
                    <ul className="text-xs space-y-1">
                      <li>✓ 25% tax-free lump sum</li>
                      <li>✓ Income as needed</li>
                      <li>✓ Potential for growth</li>
                      <li>⚠ Investment risk</li>
                      <li>⚠ Sequencing risk</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Annuities</h4>
                    <p className="text-sm text-gray-600 mb-2">Guaranteed income for life</p>
                    <ul className="text-xs space-y-1">
                      <li>✓ Income certainty</li>
                      <li>✓ No investment risk</li>
                      <li>✓ Inflation protection options</li>
                      <li>⚠ Lower potential returns</li>
                      <li>⚠ Irreversible decision</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <p className="mb-4">
                The optimal withdrawal strategy depends on your individual circumstances, risk tolerance, other income sources, and long-term care considerations. Many retirees adopt a hybrid approach, securing basic income needs through annuities while maintaining flexibility through drawdown for discretionary spending.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                Self-Invested Personal Pensions (SIPPs): Maximum Control
              </h3>
              <p className="mb-4">
                SIPPs represent the premium tier of pension flexibility, offering the widest possible range of investment options while maintaining all the tax advantages of pension saving. Unlike standard workplace or personal pension schemes that typically offer a limited menu of funds, SIPPs allow investment in individual shares, bonds, investment trusts, commercial property, and even alternative investments like wine or art (though these require careful consideration of regulations and tax implications).
              </p>
              
              <p className="mb-4">
                SIPPs are particularly suitable for experienced investors who want direct control over their pension investments, those with substantial pension pots who can justify the typically higher charges, or business owners who want to invest in commercial property through their pension. However, this flexibility comes with responsibility – SIPP holders must make their own investment decisions and bear the full consequences of their choices.
              </p>
              
              <div className="bg-amber-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold text-amber-800 mb-2">⚠ SIPP Considerations:</h4>
                <ul className="space-y-1 text-sm">
                  <li>• Higher charges than standard pension schemes</li>
                  <li>• Requires active investment management</li>
                  <li>• Complex regulations for certain investments</li>
                  <li>• Tax implications of investment choices</li>
                  <li>• Need for regular portfolio review and rebalancing</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-red-600" />
                Life-Stage Pension Planning: Adapting Your Strategy
              </h3>
              <p className="mb-4">
                Effective pension planning isn't a "set and forget" activity but requires ongoing adjustment as you progress through different life stages. Each phase of your career and life presents unique opportunities and challenges that should inform your pension strategy.
              </p>
              
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2 text-blue-700">Early Career (20s-30s): Building the Foundation</h4>
                    <p className="text-sm mb-3">Focus on establishing good habits and maximizing compound growth potential.</p>
                    <ul className="text-xs space-y-1 ml-4">
                      <li>• Start pension contributions as early as possible</li>
                      <li>• Maximize employer matching before other investments</li>
                      <li>• Consider aggressive growth strategies with higher equity allocation</li>
                      <li>• Build emergency fund alongside pension contributions</li>
                      <li>• Take advantage of salary sacrifice opportunities</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2 text-green-700">Mid-Career (40s-50s): Acceleration Phase</h4>
                    <p className="text-sm mb-3">Peak earning years offer opportunities to significantly boost pension savings.</p>
                    <ul className="text-xs space-y-1 ml-4">
                      <li>• Increase contribution rates with salary progression</li>
                      <li>• Consider consolidating multiple pension pots</li>
                      <li>• Review and optimize investment strategy</li>
                      <li>• Plan for potential career changes or redundancy</li>
                      <li>• Consider additional voluntary contributions</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2 text-purple-700">Pre-Retirement (55+): Strategic Transition</h4>
                    <p className="text-sm mb-3">Focus on risk reduction and withdrawal planning.</p>
                    <ul className="text-xs space-y-1 ml-4">
                      <li>• Gradually reduce investment risk exposure</li>
                      <li>• Plan pension access strategy from age 55/57</li>
                      <li>• Consider phased retirement options</li>
                      <li>• Review State Pension forecast and National Insurance record</li>
                      <li>• Seek professional financial advice for complex decisions</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Calculator className="h-6 w-6 text-purple-600" />
                Advanced Pension Strategies: Maximizing Your Retirement Wealth
              </h3>
              <p className="mb-4">
                Beyond basic pension saving, several advanced strategies can significantly enhance your retirement outcomes. These approaches require more sophisticated planning but can deliver substantial benefits for those willing to engage with the complexities.
              </p>
              
              <h4 className="text-xl font-semibold mb-3">Salary Sacrifice: The Ultimate Tax Efficiency</h4>
              <p className="mb-4">
                Salary sacrifice arrangements allow you to give up part of your gross salary in exchange for employer pension contributions. This strategy can save both income tax and National Insurance contributions, making it extremely tax-efficient. For a higher-rate taxpayer, salary sacrifice can deliver total tax savings of 42% (40% income tax + 2% National Insurance), making it one of the most powerful wealth-building tools available.
              </p>
              
              <h4 className="text-xl font-semibold mb-3">Pension Recycling and Tax Relief Optimization</h4>
              <p className="mb-4">
                For those with substantial pension pots, strategies like pension recycling (taking tax-free cash and reinvesting it in new pension contributions) can multiply tax relief benefits. However, these strategies require careful navigation of complex regulations and professional advice to avoid potential tax pitfalls.
              </p>
              
              <h4 className="text-xl font-semibold mb-3">Defined Benefit Transfer Considerations</h4>
              <p className="mb-4">
                If you have a defined benefit pension scheme, transferring to a defined contribution arrangement might provide greater flexibility and potentially higher benefits, but it also transfers all investment and longevity risks to you. Such transfers require specialist advice and careful consideration of the guaranteed benefits you'd be giving up.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Creating Your Personal Pension Action Plan
              </h3>
              <p className="mb-4">
                Successful pension planning requires translating knowledge into concrete action. Here's a comprehensive framework for creating and implementing your personalized pension strategy:
              </p>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <h4 className="font-semibold mb-4">Your 12-Step Pension Optimization Checklist:</h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Check State Pension forecast online</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Maximize employer pension matching</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Review all existing pension pots</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Consider pension consolidation</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Optimize contribution levels</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Explore salary sacrifice options</span>
                    </label>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Review investment strategy</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Check and minimize charges</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Plan withdrawal strategy</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Consider protection insurance</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Schedule annual reviews</span>
                    </label>
                    <label className="flex items-center space-x-2 text-sm">
                      <input type="checkbox" className="rounded" />
                      <span>Seek professional advice if needed</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <p className="mb-4">
                Remember that pension planning is a marathon, not a sprint. The decisions you make today will compound over decades, making even small optimizations incredibly valuable over time. Regular review and adjustment ensure your pension strategy remains aligned with your changing circumstances and retirement goals.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">💡 Key Takeaway</h4>
                <p className="text-sm">
                  The most important step in pension planning is to start now, regardless of your age or current savings level. Time is your greatest asset in building retirement wealth, and every month you delay reduces the power of compound growth. Use the calculator above to model different scenarios and find a contribution level that balances your current lifestyle needs with your future retirement security.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </CalculatorLayoutWithAds>
  );
};

export default PensionCalculatorUK;