import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Target, Info, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface RetirementResult {
  monthlyContribution: number;
  annualContribution: number;
  employerMatch: number;
  totalContributions: number;
  finalBalance: number;
  totalEmployerMatch: number;
  totalGrowth: number;
  yearlyProjections: Array<{
    year: number;
    age: number;
    contribution: number;
    employerMatch: number;
    balance: number;
    totalContributions: number;
  }>;
}

export function RetirementCalculator401k() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSalary, setCurrentSalary] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [contributionPercent, setContributionPercent] = useState([10]);
  const [employerMatch, setEmployerMatch] = useState('50');
  const [employerMatchLimit, setEmployerMatchLimit] = useState('6');
  const [salaryGrowthRate, setSalaryGrowthRate] = useState('3');
  const [returnRate, setReturnRate] = useState('7');
  const [result, setResult] = useState<RetirementResult | null>(null);

  const calculate401k = () => {
    const age = parseInt(currentAge);
    const retAge = parseInt(retirementAge);
    const salary = parseFloat(currentSalary);
    const currentBal = parseFloat(currentBalance) || 0;
    
    if (!age || !retAge || !salary || age >= retAge || age < 18 || retAge > 100) {
      setResult(null);
      return;
    }

    const yearsToRetirement = retAge - age;
    const contributionRate = contributionPercent[0] / 100;
    const empMatch = parseFloat(employerMatch) / 100;
    const empMatchLimit = parseFloat(employerMatchLimit) / 100;
    const salaryGrowth = parseFloat(salaryGrowthRate) / 100;
    const annualReturn = parseFloat(returnRate) / 100;

    let balance = currentBal;
    let currentYearSalary = salary;
    let totalPersonalContributions = 0;
    let totalEmployerContributions = 0;
    const yearlyProjections: Array<{
      year: number;
      age: number;
      contribution: number;
      employerMatch: number;
      balance: number;
      totalContributions: number;
    }> = [];

    // 2024 contribution limits
    const contributionLimit2024 = 23000;
    const catchUpLimit = 7500; // Additional for 50+

    for (let year = 1; year <= yearsToRetirement; year++) {
      const currentEmployeeAge = age + year - 1;
      
      // Calculate contribution limits
      let maxContribution = contributionLimit2024;
      if (currentEmployeeAge >= 50) {
        maxContribution += catchUpLimit;
      }

      // Calculate employee contribution
      let employeeContribution = currentYearSalary * contributionRate;
      employeeContribution = Math.min(employeeContribution, maxContribution);

      // Calculate employer match
      const matchableContribution = Math.min(currentYearSalary * empMatchLimit, employeeContribution);
      const employerContribution = matchableContribution * empMatch;

      // Apply growth to existing balance
      balance = balance * (1 + annualReturn);

      // Add contributions
      balance += employeeContribution + employerContribution;

      totalPersonalContributions += employeeContribution;
      totalEmployerContributions += employerContribution;

      yearlyProjections.push({
        year,
        age: currentEmployeeAge + 1,
        contribution: employeeContribution,
        employerMatch: employerContribution,
        balance,
        totalContributions: totalPersonalContributions + totalEmployerContributions
      });

      // Increase salary for next year
      currentYearSalary *= (1 + salaryGrowth);
    }

    const currentAnnualContribution = salary * contributionRate;
    const maxCurrentContribution = age >= 50 ? contributionLimit2024 + catchUpLimit : contributionLimit2024;
    const finalAnnualContribution = Math.min(currentAnnualContribution, maxCurrentContribution);

    const currentEmployerMatch = Math.min(salary * empMatchLimit, finalAnnualContribution) * empMatch;

    setResult({
      monthlyContribution: finalAnnualContribution / 12,
      annualContribution: finalAnnualContribution,
      employerMatch: currentEmployerMatch,
      totalContributions: totalPersonalContributions + totalEmployerContributions + currentBal,
      finalBalance: balance,
      totalEmployerMatch: totalEmployerContributions,
      totalGrowth: balance - (totalPersonalContributions + totalEmployerContributions + currentBal),
      yearlyProjections
    });
  };

  useEffect(() => {
    calculate401k();
  }, [currentAge, retirementAge, currentSalary, currentBalance, contributionPercent, 
      employerMatch, employerMatchLimit, salaryGrowthRate, returnRate]);

  const currentContributionLimit = parseInt(currentAge) >= 50 ? 30500 : 23000;

  return (
    <CalculatorLayoutWithAds
      title="401(k) Retirement Calculator 2024 | US Retirement Planning Calculator"
      description="Calculate your 401(k) retirement savings with employer matching, contribution limits, and compound growth. Plan your retirement with accurate projections and strategies."
      keywords="401k calculator, retirement calculator, 401k planning, employer match calculator, retirement savings, compound interest, retirement planning USA"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>401(k) Planning Details</span>
            </CardTitle>
            <CardDescription>
              Enter your information to calculate your 401(k) retirement projections with employer matching.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentAge">Current Age</Label>
                  <Input
                    id="currentAge"
                    type="number"
                    placeholder="30"
                    min="18"
                    max="100"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retirementAge">Retirement Age</Label>
                  <Input
                    id="retirementAge"
                    type="number"
                    placeholder="65"
                    min="50"
                    max="100"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentSalary">Current Annual Salary (USD)</Label>
                  <Input
                    id="currentSalary"
                    type="number"
                    placeholder="75000"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentBalance">Current 401(k) Balance (USD)</Label>
                  <Input
                    id="currentBalance"
                    type="number"
                    placeholder="25000"
                    value={currentBalance}
                    onChange={(e) => setCurrentBalance(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Contribution Percentage: {contributionPercent[0]}%</Label>
                  <Slider
                    value={contributionPercent}
                    onValueChange={setContributionPercent}
                    min={1}
                    max={25}
                    step={0.5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">
                    2024 limit: ${currentContributionLimit.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employerMatch">Employer Match Rate (%)</Label>
                  <Input
                    id="employerMatch"
                    type="number"
                    placeholder="50"
                    min="0"
                    max="100"
                    value={employerMatch}
                    onChange={(e) => setEmployerMatch(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    e.g., 50% means 50¢ per $1 you contribute
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="employerMatchLimit">Employer Match Limit (%)</Label>
                  <Input
                    id="employerMatchLimit"
                    type="number"
                    placeholder="6"
                    min="0"
                    max="25"
                    value={employerMatchLimit}
                    onChange={(e) => setEmployerMatchLimit(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Maximum salary % eligible for matching
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryGrowthRate">Annual Salary Growth (%)</Label>
                  <Input
                    id="salaryGrowthRate"
                    type="number"
                    step="0.1"
                    placeholder="3"
                    value={salaryGrowthRate}
                    onChange={(e) => setSalaryGrowthRate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnRate">Expected Annual Return (%)</Label>
                  <Input
                    id="returnRate"
                    type="number"
                    step="0.1"
                    placeholder="7"
                    value={returnRate}
                    onChange={(e) => setReturnRate(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Historical S&P 500 average: ~10%
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-green-800">
                    Projected Balance at Retirement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${result.finalBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    At age {retirementAge}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-blue-800">
                    Monthly Contribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${result.monthlyContribution.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Your contribution
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-purple-800">
                    Annual Employer Match
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    ${result.employerMatch.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-purple-700 mt-1">
                    Free money!
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-orange-800">
                    Total Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    ${result.totalGrowth.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Investment gains
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Contribution Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Your Total Contributions:</span>
                    <span className="font-medium">${(result.totalContributions - result.totalEmployerMatch - parseFloat(currentBalance || '0')).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Employer Match Total:</span>
                    <span className="font-medium">${result.totalEmployerMatch.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Starting Balance:</span>
                    <span className="font-medium">${parseFloat(currentBalance || '0').toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Investment Growth:</span>
                    <span className="font-medium">${result.totalGrowth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Final Balance:</span>
                    <span className="font-bold">${result.finalBalance.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Current Year Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Annual Contribution:</span>
                    <span className="font-medium">${result.annualContribution.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Contribution:</span>
                    <span className="font-medium">${result.monthlyContribution.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Employer Match:</span>
                    <span className="font-medium">${result.employerMatch.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contribution %:</span>
                    <span className="font-medium">{contributionPercent[0]}%</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Years to Retirement:</span>
                    <span className="font-bold">{parseInt(retirementAge) - parseInt(currentAge)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Projection Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Projection Summary</CardTitle>
                <CardDescription>Key milestones in your retirement journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[10, 20, 30, parseInt(retirementAge) - parseInt(currentAge)].map((years) => {
                    const projection = result.yearlyProjections[Math.min(years - 1, result.yearlyProjections.length - 1)];
                    if (!projection) return null;
                    
                    return (
                      <div key={years} className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-sm text-muted-foreground mb-1">
                          {years === parseInt(retirementAge) - parseInt(currentAge) ? 'At Retirement' : `After ${years} Years`}
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          ${projection.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Age {projection.age}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Understanding 401(k) Retirement Plans</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-4">
                <p>
                  A 401(k) plan is an employer-sponsored retirement savings account that allows you to contribute pre-tax dollars 
                  from your paycheck, reducing your current taxable income while building wealth for retirement. Many employers 
                  offer matching contributions, which is essentially free money that can significantly boost your retirement savings.
                </p>
                
                <h4 className="font-semibold text-gray-800 mt-6 mb-3">How 401(k) Plans Work:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Pre-tax Contributions:</strong> Money is deducted from your paycheck before taxes, lowering your current tax bill</li>
                  <li><strong>Employer Matching:</strong> Many employers match a percentage of your contributions, typically 50% to 100% up to 3-6% of salary</li>
                  <li><strong>Tax-deferred Growth:</strong> Your investments grow without paying taxes until you withdraw in retirement</li>
                  <li><strong>Contribution Limits:</strong> For 2024, you can contribute up to $23,000 ($30,500 if 50 or older)</li>
                  <li><strong>Vesting:</strong> You may need to work for a certain period before employer contributions are fully yours</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Types of 401(k) Contributions:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Traditional 401(k):</strong> Pre-tax contributions, taxed upon withdrawal in retirement</li>
                  <li><strong>Roth 401(k):</strong> After-tax contributions, tax-free withdrawals in retirement (if available)</li>
                  <li><strong>Catch-up Contributions:</strong> Additional $7,500 allowed for employees 50 and older</li>
                  <li><strong>Employer Match:</strong> Free money from your employer, often the best return on investment available</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">The Power of Compound Growth:</h4>
                <p>
                  The key to successful 401(k) investing is starting early and contributing consistently. Compound growth means 
                  your money earns returns, and those returns earn returns over time. Even small contributions in your 20s 
                  can grow to substantial amounts by retirement due to decades of compounding.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>401(k) Investment Strategies and Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Maximize Your Employer Match:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Always contribute enough to get the full employer match</li>
                      <li>This is typically an immediate 50-100% return on investment</li>
                      <li>Missing the match is like turning down free money</li>
                      <li>Some employers offer "true-up" matching for bonus periods</li>
                      <li>Understand your vesting schedule for employer contributions</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Smart Contribution Strategies:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Start with at least the employer match, then increase gradually</li>
                      <li>Consider increasing contributions with each pay raise</li>
                      <li>Use automatic escalation features if available</li>
                      <li>Maximize contributions if you're a high earner</li>
                      <li>Consider Roth 401(k) if in a lower tax bracket now</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Investment Allocation Guidelines:</h4>
                <p>
                  Your 401(k) investment allocation should reflect your age, risk tolerance, and retirement timeline. 
                  A common rule of thumb is to subtract your age from 100 to determine your stock allocation percentage 
                  (e.g., a 30-year-old might have 70% stocks, 30% bonds). However, many financial advisors now recommend 
                  more aggressive allocations given longer life expectancies and low interest rates.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Sample Age-Based Allocations:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• 20s-30s: 80-90% stocks, 10-20% bonds (aggressive growth)</li>
                    <li>• 40s: 70-80% stocks, 20-30% bonds (moderate growth)</li>
                    <li>• 50s: 60-70% stocks, 30-40% bonds (balanced)</li>
                    <li>• 60s+: 40-60% stocks, 40-60% bonds (conservative)</li>
                  </ul>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Common 401(k) Mistakes to Avoid:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Not Contributing Enough:</strong> Missing out on employer match or not maximizing tax benefits</li>
                  <li><strong>Poor Investment Choices:</strong> Being too conservative early or too aggressive near retirement</li>
                  <li><strong>High Fees:</strong> Not paying attention to expense ratios in investment options</li>
                  <li><strong>Early Withdrawals:</strong> Taking loans or withdrawals that hurt long-term growth</li>
                  <li><strong>Not Increasing Contributions:</strong> Failing to increase contributions with salary increases</li>
                  <li><strong>Forgetting About Old Accounts:</strong> Leaving 401(k)s with former employers without management</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Advanced 401(k) Strategies:</h4>
                <p>
                  High earners should consider maximizing their 401(k) contributions, especially if they exceed IRA contribution 
                  limits. The "mega backdoor Roth" strategy allows high earners to contribute after-tax dollars to 401(k) plans 
                  and convert them to Roth IRAs. Some plans also allow in-service withdrawals or Roth conversions during employment.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Retirement Planning Beyond 401(k)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3">The Three-Legged Stool of Retirement:</h4>
                <p>
                  Financial advisors often refer to retirement planning as a three-legged stool: employer-sponsored plans (401k), 
                  personal savings (IRAs, taxable accounts), and Social Security. Diversifying across all three provides the 
                  most stable retirement foundation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">401(k) Plans</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Employer-sponsored</li>
                      <li>• High contribution limits</li>
                      <li>• Potential employer match</li>
                      <li>• Limited investment options</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Personal Savings</h5>
                    <ul className="text-xs space-y-1">
                      <li>• IRAs (traditional/Roth)</li>
                      <li>• Taxable investment accounts</li>
                      <li>• More investment flexibility</li>
                      <li>• No employer dependence</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Social Security</h5>
                    <ul className="text-xs space-y-1">
                      <li>• Government-provided</li>
                      <li>• Inflation-adjusted</li>
                      <li>• Lifetime benefits</li>
                      <li>• Delayed retirement credits</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Retirement Income Rules of Thumb:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>70-80% Rule:</strong> Plan to need 70-80% of pre-retirement income in retirement</li>
                  <li><strong>4% Rule:</strong> Withdraw 4% of your portfolio value in the first year of retirement, then adjust for inflation</li>
                  <li><strong>10x Rule:</strong> Aim to have 10-12 times your final salary saved by retirement</li>
                  <li><strong>Age-Based Targets:</strong> Have 1x salary saved by 30, 3x by 40, 6x by 50, 8x by 60</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Healthcare and Long-term Care Planning:</h4>
                <p>
                  Healthcare costs are often underestimated in retirement planning. Medicare doesn't cover everything, 
                  and long-term care can be extremely expensive. Consider Health Savings Accounts (HSAs) for triple tax 
                  advantages, and research long-term care insurance options while you're still healthy and employed.
                </p>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Estate Planning Considerations:</h4>
                <p>
                  Your 401(k) should be part of a comprehensive estate plan. Ensure your beneficiaries are up to date, 
                  understand required minimum distributions (RMDs) starting at age 73, and consider the tax implications 
                  for your heirs. Roth conversions during lower-income years can help reduce future tax burdens.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much should I contribute to my 401(k)?</h4>
                    <p>At minimum, contribute enough to get your full employer match. Ideally, aim to contribute 10-15% of your salary. High earners should consider maximizing the annual contribution limit ($23,000 in 2024, $30,500 if 50+).</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What if I can't afford to maximize my 401(k)?</h4>
                    <p>Start with whatever you can afford, even if it's just 1-2%. The key is to start contributing and increase your contribution rate over time. Many plans offer automatic escalation features that increase your contribution by 1% annually.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I choose traditional or Roth 401(k) contributions?</h4>
                    <p>Traditional 401(k) contributions reduce current taxes but are taxed in retirement. Roth contributions are made with after-tax dollars but grow tax-free. Choose Roth if you expect to be in a higher tax bracket in retirement, traditional if you expect lower.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I take money out of my 401(k) before retirement?</h4>
                    <p>Generally, withdrawals before age 59½ incur a 10% penalty plus income taxes. Some plans allow loans or hardship withdrawals, but these should be last resorts as they hurt your long-term retirement savings.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What happens to my 401(k) if I change jobs?</h4>
                    <p>You typically have four options: leave it with your former employer, roll it to your new employer's plan, roll it to an IRA, or cash out (not recommended). Rolling to an IRA often provides more investment options and lower fees.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How should I invest my 401(k) money?</h4>
                    <p>Choose a diversified portfolio appropriate for your age and risk tolerance. Target-date funds are good default options for beginners. Younger investors can typically afford more aggressive allocations focused on growth.</p>
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
              <p>• Actual investment returns will vary and past performance does not guarantee future results.</p>
              <p>• Calculations assume constant contribution rates and returns, which may not reflect real-world scenarios.</p>
              <p>• Employer match details, vesting schedules, and plan rules vary significantly between employers.</p>
              <p>• This calculator does not account for inflation, taxes in retirement, or required minimum distributions.</p>
              <p>• Consider consulting with a qualified financial advisor for comprehensive retirement planning.</p>
              <p>• 401(k) rules and contribution limits are subject to change by legislation and IRS regulations.</p>
              <p>• Early withdrawals may be subject to penalties and taxes not reflected in these calculations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {result && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="401k-us"
            inputs={{ currentAge, retirementAge, currentBalance, currentSalary, contributionPercent, employerMatch, employerMatchLimit, salaryGrowthRate, returnRate }}
            results={result}
            title="401(k) Retirement Projection"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
}