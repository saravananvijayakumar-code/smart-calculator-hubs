// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Wallet, Info, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

const SuperannuationCalculatorAustralia: React.FC = () => {
  const [currentAge, setCurrentAge] = useState<string>('');
  const [retirementAge, setRetirementAge] = useState<string>('67');
  const [currentSuper, setCurrentSuper] = useState<string>('');
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [additionalContributions, setAdditionalContributions] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<string>('7');
  const [salaryGrowth, setSalaryGrowth] = useState<string>('3');
  const [contributionStrategy, setContributionStrategy] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateSuper = () => {
    const age = parseFloat(currentAge);
    const retAge = parseFloat(retirementAge);
    const currentBalance = parseFloat(currentSuper) || 0;
    const salary = parseFloat(annualSalary);
    const additional = parseFloat(additionalContributions) || 0;
    const returnRate = parseFloat(expectedReturn) / 100;
    const growthRate = parseFloat(salaryGrowth) / 100;

    if (!age || !retAge || !salary || retAge <= age) return;

    const yearsToRetirement = retAge - age;
    const sgRate = 0.115; // Current Superannuation Guarantee rate (11.5% from July 2023)

    let totalSuper = currentBalance;
    let totalContributions = 0;
    let totalEmployerContributions = 0;
    let totalAdditionalContributions = 0;
    let totalTaxSaved = 0;
    let currentSalary = salary;

    // Calculate year by year with salary growth and compounding
    for (let year = 0; year < yearsToRetirement; year++) {
      // Calculate employer SG contribution
      const employerContribution = Math.min(currentSalary * sgRate, 27500); // Concessional cap 2024
      
      // Calculate additional contributions based on strategy
      let additionalContribution = additional;
      if (contributionStrategy === 'salary_sacrifice') {
        // Additional salary sacrifice (within concessional cap)
        additionalContribution = Math.min(additional, 27500 - employerContribution);
      } else if (contributionStrategy === 'after_tax') {
        // After-tax contributions (non-concessional cap)
        additionalContribution = Math.min(additional, 110000); // Non-concessional cap 2024
      }

      totalEmployerContributions += employerContribution;
      totalAdditionalContributions += additionalContribution;
      
      // Calculate tax saved on concessional contributions
      const marginalTaxRate = calculateMarginalTaxRate(currentSalary);
      if (contributionStrategy === 'salary_sacrifice') {
        totalTaxSaved += additionalContribution * (marginalTaxRate - 0.15); // 15% super tax vs marginal rate
      }

      const annualContributions = employerContribution + additionalContribution;
      totalContributions += annualContributions;

      // Apply super contributions tax (15% on concessional contributions)
      const concessionalContributions = employerContribution + (contributionStrategy === 'salary_sacrifice' ? additionalContribution : 0);
      const superTax = concessionalContributions * 0.15;

      // Add net contributions and apply investment growth
      totalSuper = (totalSuper + annualContributions - superTax) * (1 + returnRate);

      // Increase salary for next year
      currentSalary = currentSalary * (1 + growthRate);
    }

    const totalGrowth = totalSuper - currentBalance - totalContributions + (totalEmployerContributions * 0.15);

    // Calculate retirement income options
    const annualPension = totalSuper * 0.04; // 4% withdrawal rule
    const monthlyPension = annualPension / 12;
    
    // Account-based pension (minimum withdrawal rates by age)
    const minimumDrawdownRate = retAge >= 95 ? 0.14 : retAge >= 90 ? 0.11 : retAge >= 80 ? 0.07 : retAge >= 75 ? 0.06 : retAge >= 70 ? 0.05 : 0.04;
    const minimumAnnualDrawdown = totalSuper * minimumDrawdownRate;

    // Age Pension eligibility assessment
    const agePensionAssetThreshold = 954750; // Single homeowner threshold 2024
    const eligibleForPartAgePension = totalSuper < agePensionAssetThreshold * 1.5;
    const eligibleForFullAgePension = totalSuper < agePensionAssetThreshold;
    const estimatedAgePension = eligibleForFullAgePension ? 29023 : eligibleForPartAgePension ? 15000 : 0; // 2024 rates

    // Calculate total retirement income
    const totalRetirementIncome = annualPension + estimatedAgePension;

    // Government co-contribution eligibility
    const maxCoContribution = 500; // Maximum government co-contribution 2024
    const coContributionThreshold = 58056; // Income threshold 2024
    const coContributionEligible = salary <= coContributionThreshold && contributionStrategy === 'after_tax';
    const estimatedCoContribution = coContributionEligible ? maxCoContribution * Math.min(yearsToRetirement, 10) : 0;

    // Adequacy assessment
    const targetReplacementRatio = 70; // Commonly recommended percentage
    const actualReplacementRatio = (totalRetirementIncome / salary) * 100;
    const adequacyGap = Math.max(0, (salary * 0.7) - totalRetirementIncome);

    setResults({
      totalSuper,
      totalContributions,
      totalEmployerContributions,
      totalAdditionalContributions,
      totalTaxSaved,
      totalGrowth,
      annualPension,
      monthlyPension,
      minimumAnnualDrawdown,
      estimatedAgePension,
      totalRetirementIncome,
      eligibleForFullAgePension,
      eligibleForPartAgePension,
      estimatedCoContribution,
      yearsToRetirement,
      finalSalary: currentSalary / (1 + growthRate),
      actualReplacementRatio,
      targetReplacementRatio,
      adequacyGap,
      isAdequate: actualReplacementRatio >= targetReplacementRatio
    });
  };

  const calculateMarginalTaxRate = (income: number): number => {
    // 2024-25 Australian tax rates including Medicare levy
    if (income <= 18200) return 0;
    if (income <= 45000) return 0.19 + 0.02; // 19% + 2% Medicare levy
    if (income <= 120000) return 0.325 + 0.02; // 32.5% + 2% Medicare levy
    if (income <= 180000) return 0.37 + 0.02; // 37% + 2% Medicare levy
    return 0.45 + 0.02; // 45% + 2% Medicare levy
  };

  const reset = () => {
    setCurrentAge('');
    setRetirementAge('67');
    setCurrentSuper('');
    setAnnualSalary('');
    setAdditionalContributions('');
    setExpectedReturn('7');
    setSalaryGrowth('3');
    setContributionStrategy('');
    setResults(null);
  };

  const tips = [
    "Superannuation Guarantee is currently 11.5% of ordinary time earnings",
    "Contribute early to maximize compound growth over time",
    "Consider salary sacrifice to reduce taxable income",
    "Government co-contributions available for low-income earners",
    "Superannuation is taxed at 15% vs marginal tax rates up to 47%"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Australia Superannuation Calculator | Super Calculator & Retirement Planner 2024"
      description="Comprehensive Australian superannuation calculator with SG contributions, salary sacrifice, government co-contributions, and retirement income projections. Plan your super strategy and retirement adequacy."
      keywords="Australia superannuation calculator, super calculator Australia, retirement planning calculator, salary sacrifice calculator, SG contributions, super retirement income"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Superannuation Calculator
              </CardTitle>
              <CardDescription>
                Calculate your retirement superannuation balance and income projections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    placeholder="30"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                    min="15"
                    max="75"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Select value={retirementAge} onValueChange={setRetirementAge}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">60</SelectItem>
                      <SelectItem value="65">65</SelectItem>
                      <SelectItem value="67">67 (Pension Age)</SelectItem>
                      <SelectItem value="70">70</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentSuper">Current Super Balance ($)</Label>
                <Input
                  id="currentSuper"
                  type="number"
                  placeholder="50000"
                  value={currentSuper}
                  onChange={(e) => setCurrentSuper(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualSalary">Annual Salary ($)</Label>
                <Input
                  id="annualSalary"
                  type="number"
                  placeholder="75000"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contributionStrategy">Additional Contribution Strategy</Label>
                <Select value={contributionStrategy} onValueChange={setContributionStrategy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Additional Contributions</SelectItem>
                    <SelectItem value="salary_sacrifice">Salary Sacrifice (Pre-tax)</SelectItem>
                    <SelectItem value="after_tax">After-tax Contributions</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="additionalContributions">Additional Annual Contributions ($)</Label>
                <Input
                  id="additionalContributions"
                  type="number"
                  placeholder="5000"
                  value={additionalContributions}
                  onChange={(e) => setAdditionalContributions(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
                  <Select value={expectedReturn} onValueChange={setExpectedReturn}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select return" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5% (Conservative)</SelectItem>
                      <SelectItem value="7">7% (Balanced)</SelectItem>
                      <SelectItem value="9">9% (Growth)</SelectItem>
                      <SelectItem value="10">10% (Aggressive)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryGrowth">Annual Salary Growth (%)</Label>
                  <Select value={salaryGrowth} onValueChange={setSalaryGrowth}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select growth" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2%</SelectItem>
                      <SelectItem value="3">3%</SelectItem>
                      <SelectItem value="4">4%</SelectItem>
                      <SelectItem value="5">5%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateSuper} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Super
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
                  Retirement Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg" 
                     style={{backgroundColor: results.isAdequate ? '#f0f9ff' : '#fef2f2'}}>
                  <h3 className="font-semibold">
                    {results.isAdequate ? 'Adequate Retirement Savings' : 'Potential Retirement Shortfall'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {results.actualReplacementRatio.toFixed(1)}% income replacement 
                    (Target: {results.targetReplacementRatio}%)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Super Balance at Retirement</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(results.totalSuper, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Retirement Income</p>
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(results.totalRetirementIncome, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Monthly Income</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.totalRetirementIncome / 12, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Years to Retirement</p>
                    <p className="text-lg font-semibold">{results.yearsToRetirement}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Contribution Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Employer SG Contributions:</span>
                      <Badge variant="outline">{formatCurrency(results.totalEmployerContributions, 'AUD')}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Additional Contributions:</span>
                      <Badge variant="secondary">{formatCurrency(results.totalAdditionalContributions, 'AUD')}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Investment Growth:</span>
                      <Badge variant="default">{formatCurrency(results.totalGrowth, 'AUD')}</Badge>
                    </div>
                    {results.totalTaxSaved > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>Tax Saved (Salary Sacrifice):</span>
                        <Badge variant="default">{formatCurrency(results.totalTaxSaved, 'AUD')}</Badge>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Age Pension Eligibility</h4>
                  <p className="text-xs">
                    {results.eligibleForFullAgePension ? 'Eligible for full Age Pension' : 
                     results.eligibleForPartAgePension ? 'Eligible for partial Age Pension' : 
                     'Not eligible for Age Pension due to assets'}
                  </p>
                  {results.estimatedAgePension > 0 && (
                    <p className="text-xs mt-1">
                      Estimated Age Pension: {formatCurrency(results.estimatedAgePension, 'AUD')}/year
                    </p>
                  )}
                </div>

                {!results.isAdequate && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">
                        Retirement Income Gap: {formatCurrency(results.adequacyGap, 'AUD')}/year
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {results && (
          <>
            <AIAnalysis
              analysisRequest={{
                calculatorType: "superannuation-australia",
                data: {
                  currentBalance: parseFloat(currentSuper) || 0,
                  monthlyContribution: (parseFloat(annualSalary) || 0) * 0.115 / 12,
                  employerContribution: (parseFloat(annualSalary) || 0) * 0.115,
                  expectedReturn: parseFloat(expectedReturn) || 7,
                  years: results.yearsToRetirement,
                  finalBalance: results.totalSuper,
                  retirementIncome: results.totalRetirementIncome
                }
              }}
              autoRun={true}
              title="AI Superannuation Analysis"
              description="Get personalized strategies to optimize your superannuation and retirement planning."
            />

            <ExportShareButtons
              calculatorType="superannuation-australia"
              inputs={{
                currentSuper: parseFloat(currentSuper) || 0,
                annualSalary: parseFloat(annualSalary) || 0,
                currentAge: parseInt(currentAge) || 0,
                retirementAge: parseInt(retirementAge) || 67,
                expectedReturn: parseFloat(expectedReturn) || 7
              }}
              results={{
                totalSuper: results.totalSuper,
                totalContributions: results.totalContributions,
                investmentEarnings: results.investmentEarnings,
                totalRetirementIncome: results.totalRetirementIncome,
                yearsToRetirement: results.yearsToRetirement
              }}
              title="Superannuation Calculator Australia Report"
              className="mt-6"
            />
          </>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Australian Superannuation and Retirement Planning</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  The Australian superannuation system represents one of the world's largest and most comprehensive 
                  retirement savings frameworks, designed to ensure all working Australians can achieve financial 
                  security in retirement. Understanding how superannuation works, the various contribution strategies 
                  available, and how to optimize your retirement savings is crucial for long-term financial wellbeing. 
                  This comprehensive guide covers everything you need to know about maximizing your superannuation 
                  benefits and planning for a comfortable retirement.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">The Superannuation Guarantee System</h3>
                <p>
                  The Superannuation Guarantee (SG) requires employers to contribute a minimum percentage of employees' 
                  ordinary time earnings to their superannuation fund. As of 2024, the SG rate is 11.5% and is scheduled 
                  to increase to 12% by July 2025. This compulsory system ensures all eligible workers build retirement 
                  savings throughout their careers, with contributions invested in diversified portfolios to grow over time. 
                  The SG applies to employees earning more than $450 per month and covers most forms of employment, creating 
                  a universal foundation for retirement savings.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Understanding Superannuation Tax Benefits</h3>
                <p>
                  Superannuation enjoys significant tax advantages that make it one of Australia's most tax-effective 
                  investment vehicles. Contributions made by employers and through salary sacrifice are taxed at just 15%, 
                  compared to marginal tax rates that can reach 47% including the Medicare levy. Investment earnings within 
                  super funds are also taxed at a maximum of 15%, while withdrawals after age 60 are completely tax-free. 
                  These tax concessions provide substantial benefits for long-term wealth accumulation, particularly for 
                  higher income earners who face significant marginal tax rates.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Salary Sacrifice Strategies</h3>
                <p>
                  Salary sacrifice represents one of the most effective ways to boost superannuation savings while reducing 
                  current tax obligations. By redirecting pre-tax salary into superannuation, employees can access the 15% 
                  super tax rate instead of their marginal tax rate, creating immediate tax savings. The strategy is particularly 
                  beneficial for workers in higher tax brackets, where the difference between marginal rates and the super tax 
                  rate is greatest. However, salary sacrifice contributions are subject to the annual concessional contributions 
                  cap of $27,500 (including employer SG contributions).
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Salary Sacrifice Tax Savings Example:</h4>
                  <ul className="space-y-1">
                    <li>• Annual Salary: $100,000</li>
                    <li>• Marginal Tax Rate: 37% (plus 2% Medicare levy)</li>
                    <li>• Salary Sacrifice: $10,000</li>
                    <li>• Tax Saved: $10,000 × (39% - 15%) = $2,400</li>
                    <li>• Net Cost: $7,600 for $10,000 super contribution</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">After-Tax Contributions and Government Co-contributions</h3>
                <p>
                  After-tax (non-concessional) contributions allow individuals to boost their superannuation using income 
                  that has already been taxed at marginal rates. While these contributions don't provide immediate tax 
                  deductions, they benefit from the tax-free investment environment within superannuation and tax-free 
                  withdrawals after age 60. Low and middle-income earners making after-tax contributions may be eligible 
                  for government co-contributions of up to $500 annually, effectively providing a 50% return on eligible 
                  contributions up to $1,000.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Contribution Caps and Carry-Forward Rules</h3>
                <p>
                  Superannuation contributions are subject to annual caps designed to limit the tax benefits available to 
                  high-income earners. The concessional contributions cap is $27,500 annually (2024), covering employer 
                  SG and salary sacrifice contributions. The non-concessional cap is $110,000 annually, though individuals 
                  under 67 can bring forward up to three years' worth of caps ($330,000) in certain circumstances. Unused 
                  concessional contribution caps can be carried forward for up to five years, allowing catch-up contributions 
                  for those with super balances below $500,000.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Investment Options and Risk Management</h3>
                <p>
                  Most superannuation funds offer various investment options ranging from conservative cash and fixed interest 
                  options to aggressive growth portfolios with high equity allocations. The choice of investment strategy 
                  significantly impacts long-term retirement outcomes, with younger members typically benefiting from higher 
                  growth allocations due to their longer investment timeframes. Many funds offer lifecycle investment options 
                  that automatically adjust risk levels as members approach retirement, gradually shifting from growth to more 
                  conservative investments.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Self-Managed Super Funds (SMSFs)</h3>
                <p>
                  Self-Managed Super Funds allow individuals to take direct control of their superannuation investments, 
                  providing flexibility to invest in a broader range of assets including direct property, shares, and 
                  alternative investments. SMSFs are particularly suitable for individuals with larger super balances 
                  (typically $200,000+) who want greater investment control and are willing to take on the additional 
                  compliance responsibilities. However, SMSFs require significant time commitment, investment knowledge, 
                  and ongoing professional support to meet regulatory obligations.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Superannuation Strategies and Retirement Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Transition to Retirement Strategies</h3>
                <p>
                  Transition to Retirement (TTR) strategies allow individuals over 60 to access their superannuation while 
                  continuing to work, providing flexibility for gradual retirement transitions. TTR pensions enable members 
                  to withdraw between 4-10% of their super balance annually while continuing to make contributions. This 
                  strategy can be combined with salary sacrifice to maintain take-home pay while building super balances, 
                  though changes to TTR pension taxation in 2017 reduced some of the previous tax advantages for those under 
                  65 who haven't met a condition of release.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Retirement Income Streams and Pension Options</h3>
                <p>
                  Upon retirement, superannuation members can access their benefits through various income stream products 
                  designed to provide regular retirement income. Account-based pensions are the most common option, providing 
                  flexible access to super balances with minimum annual withdrawal requirements based on age. Allocated 
                  pensions offer guaranteed income for specific periods, while lifetime annuities provide income security 
                  for life but with less flexibility. The choice of retirement income strategy depends on personal circumstances, 
                  risk tolerance, and income requirements.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Age Pension Integration and Asset Testing</h3>
                <p>
                  The Age Pension provides a safety net for retirees but is subject to means testing based on income and 
                  assets. Superannuation balances are assessed under the assets test, with higher super balances reducing 
                  Age Pension entitlements. The current assets test threshold for homeowners is approximately $954,750 for 
                  singles and $1,431,500 for couples (2024), above which no Age Pension is payable. Strategic management 
                  of superannuation balances and other assets can help optimize combined retirement income from super and 
                  Age Pension sources.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Retirement Income Optimization Strategies:</h4>
                  <ul className="space-y-1">
                    <li>• Maximize super contributions during high-income years</li>
                    <li>• Consider spouse contributions for non-working partners</li>
                    <li>• Plan timing of super withdrawals to optimize Age Pension</li>
                    <li>• Utilize catch-up contribution opportunities</li>
                    <li>• Review investment strategies as retirement approaches</li>
                    <li>• Consider downsizing contributions after age 65</li>
                    <li>• Plan for healthcare and aged care costs</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Spouse Super Strategies</h3>
                <p>
                  Couples can optimize their combined superannuation position through spouse contribution strategies, 
                  particularly where there are income disparities. Higher-earning spouses can contribute up to $3,000 
                  annually for lower-earning spouses and claim a tax offset of up to $540. This strategy helps balance 
                  super accounts between partners, potentially improving Age Pension eligibility and providing greater 
                  flexibility in retirement income planning. Spouse contributions are particularly valuable for couples 
                  where one partner has career breaks for child-rearing or other reasons.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Downsizing Contributions and Later-Life Strategies</h3>
                <p>
                  Australians over 65 can make downsizing contributions of up to $300,000 per person ($600,000 per couple) 
                  when selling their family home, provided they've owned it for at least 10 years. These contributions 
                  don't count toward contribution caps and can significantly boost retirement savings for those who 
                  downsize their housing. Additionally, the work test requirements for super contributions have been 
                  relaxed for those aged 67-74, making it easier for older Australians to continue building their 
                  superannuation through various contribution strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Estate Planning and Superannuation</h3>
                <p>
                  Superannuation forms a crucial component of estate planning, with specific rules governing how super 
                  benefits can be distributed upon death. Death benefits can be paid as lump sums or income streams to 
                  eligible dependents, with different tax treatment depending on the recipient's relationship to the 
                  deceased. Binding death benefit nominations provide certainty about how super benefits will be distributed, 
                  while non-binding nominations give trustees discretion. Regular review of death benefit nominations 
                  ensures they remain current with changing family circumstances.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Superannuation Fees and Performance Monitoring</h3>
                <p>
                  Superannuation fees can significantly impact long-term retirement outcomes, making fee monitoring and 
                  fund comparison essential for optimal results. Administration fees, investment fees, advice fees, and 
                  insurance premiums all reduce net returns over time. The government's MySuper comparison tool and annual 
                  performance tests help members identify underperforming funds. Regular review of super arrangements, 
                  including consolidation of multiple accounts and optimization of insurance coverage, can improve net 
                  retirement outcomes and reduce unnecessary costs.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Technology and Digital Super Management</h3>
                <p>
                  Modern superannuation management benefits from digital tools and platforms that provide real-time account 
                  access, contribution tracking, and projection modeling. The Australian Taxation Office's online services 
                  allow easy monitoring of contribution cap usage and multiple account consolidation. Many super funds offer 
                  sophisticated online calculators and planning tools that help members optimize their contribution strategies 
                  and track progress toward retirement goals. Regular use of these digital tools improves engagement and 
                  helps members make more informed decisions about their super.
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
                    <h4 className="font-semibold text-gray-800 mb-2">What is the current Superannuation Guarantee rate?</h4>
                    <p>The Superannuation Guarantee rate is currently 11.5% (2024) and will increase to 12% from July 2025. This rate applies to ordinary time earnings for eligible employees, with employers required to pay this on top of wages and salaries.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much can I contribute to super each year?</h4>
                    <p>The concessional contributions cap is $27,500 annually (including employer SG and salary sacrifice). The non-concessional cap is $110,000 annually, with bring-forward rules allowing up to $330,000 over three years for those under 67 with balances below $1.9 million.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">When can I access my superannuation?</h4>
                    <p>You can generally access your super when you reach your preservation age (55-60 depending on birth year) and retire, or at age 65 regardless of work status. Early access is possible in limited circumstances like severe financial hardship, permanent incapacity, or terminal illness.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I salary sacrifice into super?</h4>
                    <p>Salary sacrifice can be beneficial if you're in a higher tax bracket (above 32.5%) as you'll save the difference between your marginal tax rate and the 15% super tax rate. Consider your cash flow needs, debt situation, and overall financial goals when deciding.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much super do I need for retirement?</h4>
                    <p>The Association of Superannuation Funds of Australia (ASFA) suggests singles need $690,000 and couples need $980,000 for a comfortable retirement (2024). However, your needs depend on lifestyle expectations, health costs, housing situation, and Age Pension eligibility.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I have multiple super accounts?</h4>
                    <p>While you can have multiple super accounts, it's generally better to consolidate into one account to reduce fees and insurance premiums. However, keep accounts separate if you have different insurance needs or if one account has particularly good features or performance.</p>
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
              <p>• This calculator provides estimates only and should not be relied upon for final retirement planning decisions.</p>
              <p>• Superannuation rules, contribution caps, and tax rates change regularly - always verify current regulations.</p>
              <p>• Investment returns are not guaranteed and actual performance may vary significantly from projections.</p>
              <p>• Age Pension eligibility depends on complex means testing that may differ from simplified calculations shown.</p>
              <p>• Consider seeking professional financial advice for comprehensive retirement planning strategies.</p>
              <p>• Superannuation involves long-term investing with risks including potential capital losses.</p>
              <p>• Early access to super may reduce retirement benefits and should be considered carefully.</p>
              <p>• This calculator uses current 2024 rates and thresholds which may change in future years.</p>
              <p>• Results are estimates only and actual retirement outcomes may vary significantly from calculations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default SuperannuationCalculatorAustralia;