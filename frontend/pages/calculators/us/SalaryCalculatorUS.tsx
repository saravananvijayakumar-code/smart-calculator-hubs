import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingDown, Calendar, PieChart } from 'lucide-react';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { AIAnalysis } from '../../../components/AIAnalysis';
import { SEOHead } from '../../../components/SEOHead';
import { formatCurrency } from '../../../utils/formatting';

const STATE_TAX_RATES: { [key: string]: number } = {
  'AL': 5.0, 'AK': 0, 'AZ': 2.59, 'AR': 4.9, 'CA': 9.3,
  'CO': 4.4, 'CT': 5.0, 'DE': 6.6, 'FL': 0, 'GA': 5.75,
  'HI': 8.25, 'ID': 5.8, 'IL': 4.95, 'IN': 3.15, 'IA': 5.7,
  'KS': 5.2, 'KY': 4.5, 'LA': 4.25, 'ME': 7.15, 'MD': 5.75,
  'MA': 5.0, 'MI': 4.25, 'MN': 9.85, 'MS': 5.0, 'MO': 4.95,
  'MT': 5.9, 'NE': 5.84, 'NV': 0, 'NH': 0, 'NJ': 8.97,
  'NM': 5.9, 'NY': 6.85, 'NC': 4.75, 'ND': 2.9, 'OH': 3.75,
  'OK': 4.75, 'OR': 9.9, 'PA': 3.07, 'RI': 5.99, 'SC': 6.4,
  'SD': 0, 'TN': 0, 'TX': 0, 'UT': 4.85, 'VT': 8.75,
  'VA': 5.75, 'WA': 0, 'WV': 5.12, 'WI': 5.3, 'WY': 0
};

const FEDERAL_TAX_BRACKETS_2024 = {
  Single: [
    { limit: 11600, rate: 10 },
    { limit: 47150, rate: 12 },
    { limit: 100525, rate: 22 },
    { limit: 191950, rate: 24 },
    { limit: 243725, rate: 32 },
    { limit: 609350, rate: 35 },
    { limit: Infinity, rate: 37 }
  ],
  'Married Filing Jointly': [
    { limit: 23200, rate: 10 },
    { limit: 94300, rate: 12 },
    { limit: 201050, rate: 22 },
    { limit: 383900, rate: 24 },
    { limit: 487450, rate: 32 },
    { limit: 731200, rate: 35 },
    { limit: Infinity, rate: 37 }
  ],
  'Head of Household': [
    { limit: 16550, rate: 10 },
    { limit: 63100, rate: 12 },
    { limit: 100500, rate: 22 },
    { limit: 191950, rate: 24 },
    { limit: 243700, rate: 32 },
    { limit: 609350, rate: 35 },
    { limit: Infinity, rate: 37 }
  ]
};

export function SalaryCalculatorUS() {
  const [salaryType, setSalaryType] = useState<'annual' | 'monthly' | 'hourly'>('annual');
  const [salaryAmount, setSalaryAmount] = useState<string>('75000');
  const [state, setState] = useState<string>('CA');
  const [filingStatus, setFilingStatus] = useState<'Single' | 'Married Filing Jointly' | 'Head of Household'>('Single');
  const [hoursPerWeek, setHoursPerWeek] = useState<string>('40');
  const [showResults, setShowResults] = useState(false);

  const calculateTaxes = () => {
    let annualSalary = 0;
    const amount = parseFloat(salaryAmount) || 0;
    const hours = parseFloat(hoursPerWeek) || 40;

    if (salaryType === 'annual') {
      annualSalary = amount;
    } else if (salaryType === 'monthly') {
      annualSalary = amount * 12;
    } else {
      annualSalary = amount * hours * 52;
    }

    const brackets = FEDERAL_TAX_BRACKETS_2024[filingStatus];
    let federalTax = 0;
    let previousLimit = 0;

    for (const bracket of brackets) {
      if (annualSalary > previousLimit) {
        const taxableInBracket = Math.min(annualSalary, bracket.limit) - previousLimit;
        federalTax += taxableInBracket * (bracket.rate / 100);
        previousLimit = bracket.limit;
      } else {
        break;
      }
    }

    const stateTaxRate = STATE_TAX_RATES[state] || 0;
    const stateTax = annualSalary * (stateTaxRate / 100);

    const socialSecurityCap = 168600;
    const socialSecurity = Math.min(annualSalary, socialSecurityCap) * 0.062;

    const medicareThreshold = 200000;
    const basicMedicare = annualSalary * 0.0145;
    const additionalMedicare = annualSalary > medicareThreshold ? (annualSalary - medicareThreshold) * 0.009 : 0;
    const medicare = basicMedicare + additionalMedicare;

    const totalTax = federalTax + stateTax + socialSecurity + medicare;
    const netAnnual = annualSalary - totalTax;
    const effectiveTaxRate = (totalTax / annualSalary) * 100;

    const marginalRate = brackets.find(b => annualSalary <= b.limit)?.rate || 37;

    return {
      grossAnnual: annualSalary,
      federalTax,
      stateTax,
      socialSecurity,
      medicare,
      totalTax,
      netAnnual,
      effectiveTaxRate,
      marginalRate,
      netMonthly: netAnnual / 12,
      netBiweekly: netAnnual / 26,
      netWeekly: netAnnual / 52,
      netDaily: netAnnual / 260,
      netHourly: netAnnual / (hours * 52),
      grossMonthly: annualSalary / 12,
      grossBiweekly: annualSalary / 26,
      grossWeekly: annualSalary / 52,
      grossDaily: annualSalary / 260,
      grossHourly: annualSalary / (hours * 52)
    };
  };

  const results = salaryAmount && parseFloat(salaryAmount) > 0 ? calculateTaxes() : null;

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <>
      <SEOHead
        title="Salary Calculator - Take Home Pay Calculator After Taxes | US Paycheck Calculator"
        description="Calculate your take-home salary after federal and state taxes. Get detailed breakdown of net pay, tax deductions, and see your salary by month, biweekly, weekly, and hourly."
        keywords="salary calculator, take home pay calculator, paycheck calculator, salary after tax, net salary calculator, gross to net salary, wage calculator"
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Salary Calculator
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your take-home pay after federal and state taxes with detailed breakdown
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                  Salary Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Salary Type</Label>
                  <Select value={salaryType} onValueChange={(value: 'annual' | 'monthly' | 'hourly') => setSalaryType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="annual">Annual</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <AppleStyleInput
                  label="Salary Amount"
                  type="number"
                  value={salaryAmount}
                  onChange={(e) => setSalaryAmount(e.target.value)}
                  placeholder="75000"
                  prefix="$"
                />

                {salaryType === 'hourly' && (
                  <AppleStyleInput
                    label="Hours Per Week"
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    placeholder="40"
                  />
                )}

                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.keys(STATE_TAX_RATES).map((st) => (
                        <SelectItem key={st} value={st}>
                          {st} ({STATE_TAX_RATES[st]}% tax)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Filing Status</Label>
                  <Select value={filingStatus} onValueChange={(value: 'Single' | 'Married Filing Jointly' | 'Head of Household') => setFilingStatus(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married Filing Jointly">Married Filing Jointly</SelectItem>
                      <SelectItem value="Head of Household">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                  size="lg"
                >
                  Calculate Take-Home Pay
                </Button>
              </CardContent>
            </Card>

            {results && (
              <Card className="shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-6 w-6 text-blue-600" />
                    Your Take-Home Pay
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-white rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-2">Annual Take-Home</p>
                    <p className="text-4xl font-bold text-blue-600">
                      {formatCurrency(results.netAnnual, 'USD')}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      from {formatCurrency(results.grossAnnual, 'USD')} gross
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <p className="font-semibold">Breakdown by Period</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Monthly</p>
                        <p className="font-semibold">{formatCurrency(results.netMonthly, 'USD')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Biweekly</p>
                        <p className="font-semibold">{formatCurrency(results.netBiweekly, 'USD')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Weekly</p>
                        <p className="font-semibold">{formatCurrency(results.netWeekly, 'USD')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Daily</p>
                        <p className="font-semibold">{formatCurrency(results.netDaily, 'USD')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Hourly</p>
                        <p className="font-semibold">{formatCurrency(results.netHourly, 'USD')}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <PieChart className="h-5 w-5 text-blue-600" />
                      <p className="font-semibold">Tax Breakdown</p>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Federal Tax:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(results.federalTax, 'USD')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>State Tax ({state}):</span>
                        <span className="font-semibold text-red-600">{formatCurrency(results.stateTax, 'USD')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Social Security:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(results.socialSecurity, 'USD')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Medicare:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(results.medicare, 'USD')}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total Tax:</span>
                        <span className="text-red-600">{formatCurrency(results.totalTax, 'USD')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">Effective Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {results.effectiveTaxRate.toFixed(1)}%
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">Marginal Rate</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {results.marginalRate}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {showResults && results && (
            <div className="mb-12">
              <AIAnalysis
                analysisRequest={{
                  calculatorType: 'salary_calculator',
                  data: {
                    grossAnnual: results.grossAnnual,
                    state,
                    filingStatus,
                    federalTax: results.federalTax,
                    stateTax: results.stateTax,
                    socialSecurity: results.socialSecurity,
                    medicare: results.medicare,
                    netAnnual: results.netAnnual,
                    effectiveTaxRate: results.effectiveTaxRate
                  }
                }}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Understanding Your Paycheck</h2>
                <p className="text-gray-700 mb-4">
                  Your paycheck represents much more than just your hourly wage or annual salary. Understanding the difference between <strong>gross pay</strong> and <strong>net pay</strong> is crucial for effective financial planning.
                </p>
                <h3 className="text-2xl font-bold mb-3">Gross Pay vs Net Pay</h3>
                <p className="text-gray-700 mb-4">
                  <strong>Gross Pay</strong> is your total earnings before any deductions. This is the amount stated in your job offer or employment contract. For example, if you earn $75,000 per year, that's your gross annual salary.
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Net Pay</strong> (or take-home pay) is what you actually receive in your bank account after all deductions including federal tax, state tax, Social Security, Medicare, and any other deductions like health insurance premiums or 401(k) contributions.
                </p>
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Example Calculation</h4>
                  <p className="text-gray-700 mb-2">Annual Gross Salary: $75,000</p>
                  <p className="text-gray-700 mb-2">Federal Tax: -$8,700</p>
                  <p className="text-gray-700 mb-2">State Tax (CA, 9.3%): -$6,975</p>
                  <p className="text-gray-700 mb-2">Social Security (6.2%): -$4,650</p>
                  <p className="text-gray-700 mb-2">Medicare (1.45%): -$1,088</p>
                  <p className="text-gray-700 font-bold mt-3">Annual Net Pay: ≈ $53,587</p>
                  <p className="text-gray-700 mt-2 text-sm italic">
                    That's about 71.4% of your gross salary, meaning nearly 29% goes to taxes and FICA.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Federal Income Tax Brackets 2024</h2>
                <p className="text-gray-700 mb-4">
                  The United States uses a <strong>progressive tax system</strong>, which means higher income levels are taxed at higher rates. However, only the income within each bracket is taxed at that bracket's rate, not your entire income.
                </p>

                <h3 className="text-2xl font-bold mb-3">Single Filers</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-3 text-left">Income Range</th>
                        <th className="border p-3 text-left">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border p-3">$0 - $11,600</td><td className="border p-3">10%</td></tr>
                      <tr><td className="border p-3">$11,601 - $47,150</td><td className="border p-3">12%</td></tr>
                      <tr><td className="border p-3">$47,151 - $100,525</td><td className="border p-3">22%</td></tr>
                      <tr><td className="border p-3">$100,526 - $191,950</td><td className="border p-3">24%</td></tr>
                      <tr><td className="border p-3">$191,951 - $243,725</td><td className="border p-3">32%</td></tr>
                      <tr><td className="border p-3">$243,726 - $609,350</td><td className="border p-3">35%</td></tr>
                      <tr><td className="border p-3">$609,351+</td><td className="border p-3">37%</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-2xl font-bold mb-3">Married Filing Jointly</h3>
                <div className="overflow-x-auto mb-6">
                  <table className="w-full border-collapse border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-3 text-left">Income Range</th>
                        <th className="border p-3 text-left">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border p-3">$0 - $23,200</td><td className="border p-3">10%</td></tr>
                      <tr><td className="border p-3">$23,201 - $94,300</td><td className="border p-3">12%</td></tr>
                      <tr><td className="border p-3">$94,301 - $201,050</td><td className="border p-3">22%</td></tr>
                      <tr><td className="border p-3">$201,051 - $383,900</td><td className="border p-3">24%</td></tr>
                      <tr><td className="border p-3">$383,901 - $487,450</td><td className="border p-3">32%</td></tr>
                      <tr><td className="border p-3">$487,451 - $731,200</td><td className="border p-3">35%</td></tr>
                      <tr><td className="border p-3">$731,201+</td><td className="border p-3">37%</td></tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-2xl font-bold mb-3">Head of Household</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-3 text-left">Income Range</th>
                        <th className="border p-3 text-left">Tax Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border p-3">$0 - $16,550</td><td className="border p-3">10%</td></tr>
                      <tr><td className="border p-3">$16,551 - $63,100</td><td className="border p-3">12%</td></tr>
                      <tr><td className="border p-3">$63,101 - $100,500</td><td className="border p-3">22%</td></tr>
                      <tr><td className="border p-3">$100,501 - $191,950</td><td className="border p-3">24%</td></tr>
                      <tr><td className="border p-3">$191,951 - $243,700</td><td className="border p-3">32%</td></tr>
                      <tr><td className="border p-3">$243,701 - $609,350</td><td className="border p-3">35%</td></tr>
                      <tr><td className="border p-3">$609,351+</td><td className="border p-3">37%</td></tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">State Income Tax Considerations</h2>
                <p className="text-gray-700 mb-4">
                  In addition to federal taxes, most states impose their own income tax. State tax rates vary significantly and can have a major impact on your take-home pay.
                </p>

                <h3 className="text-2xl font-bold mb-3">States with No Income Tax (9 States)</h3>
                <p className="text-gray-700 mb-3">
                  These states do not impose state income tax, giving residents more take-home pay:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
                  <li>Alaska</li>
                  <li>Florida</li>
                  <li>Nevada</li>
                  <li>New Hampshire (only on interest and dividends, being phased out)</li>
                  <li>South Dakota</li>
                  <li>Tennessee</li>
                  <li>Texas</li>
                  <li>Washington</li>
                  <li>Wyoming</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3">Low Tax States (Under 4%)</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
                  <li>North Dakota (2.9%)</li>
                  <li>Pennsylvania (3.07%)</li>
                  <li>Indiana (3.15%)</li>
                  <li>Michigan (4.25%)</li>
                  <li>Colorado (4.4%)</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3">High Tax States (Over 9%)</h3>
                <ul className="list-disc pl-6 space-y-1 text-gray-700 mb-6">
                  <li>California (9.3% - 13.3% depending on income)</li>
                  <li>Hawaii (8.25% - 11%)</li>
                  <li>New Jersey (8.97% top rate)</li>
                  <li>Oregon (9.9% top rate)</li>
                  <li>Minnesota (9.85% top rate)</li>
                  <li>New York (6.85% - 10.9% depending on income and locality)</li>
                </ul>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Impact Example: $100,000 Salary</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Texas (0% state tax):</strong> Save $0 in state taxes</p>
                    <p><strong>Pennsylvania (3.07%):</strong> Pay $3,070 in state taxes</p>
                    <p><strong>California (9.3%):</strong> Pay $9,300 in state taxes</p>
                    <p className="mt-4 font-semibold">
                      The difference between living in Texas vs California: $9,300 per year ($775/month)!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">FICA Taxes Explained</h2>
                <p className="text-gray-700 mb-4">
                  FICA stands for <strong>Federal Insurance Contributions Act</strong>. FICA taxes fund Social Security and Medicare programs. Both you and your employer pay FICA taxes.
                </p>

                <h3 className="text-2xl font-bold mb-3">Social Security Tax (6.2%)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>You pay 6.2% of your gross income up to the wage base limit</li>
                  <li>2024 wage base limit: $168,600</li>
                  <li>Maximum Social Security tax: $10,453.20 per year</li>
                  <li>Once you earn more than $168,600, you stop paying Social Security tax on the excess</li>
                  <li>Your employer matches this contribution (also 6.2%)</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3">Medicare Tax (1.45% + 0.9% Additional)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Base Medicare tax: 1.45% on all earnings (no cap)</li>
                  <li>Additional Medicare Tax: 0.9% on earnings above $200,000 (single) or $250,000 (married filing jointly)</li>
                  <li>Your employer matches the base 1.45% but not the additional 0.9%</li>
                  <li>Total Medicare tax for high earners: 2.35% (1.45% + 0.9%)</li>
                </ul>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">FICA Tax Example: $75,000 Salary</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Social Security:</strong> $75,000 × 6.2% = $4,650</p>
                    <p><strong>Medicare:</strong> $75,000 × 1.45% = $1,088</p>
                    <p><strong>Total FICA:</strong> $5,738 per year ($478/month)</p>
                    <p className="mt-4 font-semibold">
                      Your employer also pays $5,738, so the total FICA contribution is $11,476
                    </p>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg mt-6">
                  <h4 className="text-xl font-bold mb-3">FICA Tax Example: $250,000 Salary</h4>
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Social Security:</strong> $168,600 × 6.2% = $10,453 (capped)</p>
                    <p><strong>Basic Medicare:</strong> $250,000 × 1.45% = $3,625</p>
                    <p><strong>Additional Medicare:</strong> ($250,000 - $200,000) × 0.9% = $450</p>
                    <p><strong>Total FICA:</strong> $14,528 per year ($1,211/month)</p>
                    <p className="mt-4 text-sm italic">
                      Note: Social Security tax stops after $168,600, but Medicare continues on all income
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Pre-Tax Deductions: Reduce Your Tax Burden</h2>
                <p className="text-gray-700 mb-4">
                  Pre-tax deductions are amounts taken from your paycheck <strong>before</strong> taxes are calculated. This reduces your taxable income and therefore your tax liability. These are powerful tools for increasing your take-home pay indirectly while building wealth and protecting your health.
                </p>

                <h3 className="text-2xl font-bold mb-3">401(k) Contributions</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>2024 Contribution Limit:</strong> $23,000 per year (under age 50)</li>
                  <li><strong>Catch-up Contribution:</strong> Additional $7,500 if age 50+ (total $30,500)</li>
                  <li>Contributions reduce your taxable income dollar-for-dollar</li>
                  <li>Many employers offer matching contributions (free money!)</li>
                  <li>Earnings grow tax-deferred until retirement</li>
                </ul>
                <div className="bg-green-50 p-4 rounded-lg mb-6">
                  <p className="text-gray-700 font-semibold mb-2">Example: $100,000 salary, contribute $10,000 to 401(k)</p>
                  <p className="text-gray-700">Taxable income reduced to $90,000</p>
                  <p className="text-gray-700">Tax savings (24% bracket): $2,400</p>
                  <p className="text-gray-700">Net cost of $10,000 contribution: Only $7,600!</p>
                </div>

                <h3 className="text-2xl font-bold mb-3">Health Savings Account (HSA)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>2024 Contribution Limit:</strong> $4,150 (individual), $8,300 (family)</li>
                  <li><strong>Catch-up Contribution:</strong> Additional $1,000 if age 55+</li>
                  <li>Requires enrollment in a High Deductible Health Plan (HDHP)</li>
                  <li><strong>Triple tax advantage:</strong> Tax-deductible contributions, tax-free growth, tax-free withdrawals for medical expenses</li>
                  <li>Funds roll over year to year (no "use it or lose it")</li>
                  <li>Can be used as retirement account after age 65</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3">Flexible Spending Account (FSA)</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Healthcare FSA:</strong> $3,200 limit (2024)</li>
                  <li><strong>Dependent Care FSA:</strong> $5,000 limit (for childcare, elder care)</li>
                  <li>Pre-tax contributions reduce taxable income</li>
                  <li><strong>Use-it-or-lose-it:</strong> Must use funds by end of plan year (some plans offer grace period or limited rollover)</li>
                  <li>Good for predictable medical expenses (glasses, dental work, copays)</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3">Health Insurance Premiums</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
                  <li>Employer-sponsored health insurance premiums are typically pre-tax</li>
                  <li>Reduces both income tax and FICA taxes</li>
                  <li>Premiums for dental and vision insurance also usually pre-tax</li>
                  <li>Can save 20-40% on premium costs depending on tax bracket</li>
                </ul>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Total Pre-Tax Deduction Example</h4>
                  <p className="text-gray-700 mb-3">Salary: $100,000 | Tax Bracket: 24%</p>
                  <div className="space-y-2 text-gray-700">
                    <p>401(k): $15,000</p>
                    <p>HSA: $4,150</p>
                    <p>Health Insurance: $3,000</p>
                    <p className="border-t pt-2 mt-2"><strong>Total Deductions: $22,150</strong></p>
                    <p><strong>New Taxable Income: $77,850</strong></p>
                    <p className="text-green-700 font-semibold mt-3">
                      Tax Savings: $5,316 (federal) + $1,383 (FICA) = $6,699 per year!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Salary Negotiation & Total Compensation</h2>
                <p className="text-gray-700 mb-4">
                  When evaluating a job offer, don't just look at the base salary. Total compensation includes various benefits that add significant value.
                </p>

                <h3 className="text-2xl font-bold mb-3">Financial Benefits Beyond Base Salary</h3>
                <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-6">
                  <li>
                    <strong>Signing Bonus:</strong> One-time payment when you join (typically $5,000 - $50,000+ depending on role and level). Often has clawback provisions if you leave within 1-2 years.
                  </li>
                  <li>
                    <strong>Annual Bonus:</strong> Performance-based bonus, typically 10-30% of base salary. Tech companies and finance roles often have higher bonus percentages.
                  </li>
                  <li>
                    <strong>Stock Options/RSUs:</strong> Equity compensation can be substantial, especially at tech companies. RSUs are taxed as ordinary income when they vest.
                  </li>
                  <li>
                    <strong>401(k) Match:</strong> Common formulas: 50% match up to 6% contribution, or 100% match up to 3%. A 6% match on $100k salary = $6,000/year free money.
                  </li>
                  <li>
                    <strong>Profit Sharing:</strong> Additional retirement contributions based on company performance, often 3-6% of salary.
                  </li>
                  <li>
                    <strong>Tuition Reimbursement:</strong> $5,000-$10,000/year for continuing education.
                  </li>
                </ul>

                <h3 className="text-2xl font-bold mb-3">Quality of Life Benefits (Hidden Value)</h3>
                <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-6">
                  <li>
                    <strong>Health Insurance:</strong> Employer coverage can save $8,000-$15,000/year compared to individual plans. Look at premium costs, deductibles, and out-of-pocket maximums.
                  </li>
                  <li>
                    <strong>Remote Work Flexibility:</strong> Saves commute time (10+ hours/week) and costs (gas, car maintenance, parking). Value: $5,000-$10,000/year.
                  </li>
                  <li>
                    <strong>Paid Time Off:</strong> 15-20 days PTO is standard, 25-30 days is generous. Each additional week off = 2% of annual salary.
                  </li>
                  <li>
                    <strong>Parental Leave:</strong> 12-16 weeks paid leave can be worth $15,000-$30,000 when needed.
                  </li>
                  <li>
                    <strong>Professional Development:</strong> Conference attendance, training budgets ($2,000-$5,000/year).
                  </li>
                  <li>
                    <strong>Wellness Programs:</strong> Gym memberships, mental health resources, wellness stipends ($500-$1,500/year).
                  </li>
                </ul>

                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Total Compensation Comparison Example</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-bold mb-2">Job Offer A</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>Base: $90,000</li>
                        <li>Bonus: $0</li>
                        <li>401k Match: $0</li>
                        <li>Health Insurance: $300/mo ($3,600/yr)</li>
                        <li>PTO: 15 days</li>
                        <li>Remote: 0 days</li>
                        <li className="font-semibold pt-2 border-t mt-2">Effective Value: ~$90,000</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold mb-2">Job Offer B</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>Base: $85,000</li>
                        <li>Bonus: 15% ($12,750)</li>
                        <li>401k Match: 6% ($5,100)</li>
                        <li>Health Insurance: Fully covered ($0)</li>
                        <li>PTO: 25 days</li>
                        <li>Remote: Full time ($8,000 value)</li>
                        <li className="font-semibold pt-2 border-t mt-2">Effective Value: ~$113,450</li>
                      </ul>
                    </div>
                  </div>
                  <p className="text-gray-700 mt-4 font-semibold">
                    Despite lower base salary, Offer B provides $23,450 more in total value!
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Budgeting with Net Salary: The 50/30/20 Rule</h2>
                <p className="text-gray-700 mb-4">
                  The 50/30/20 rule is a simple, effective budgeting framework that helps you allocate your <strong>net income</strong> (take-home pay) wisely.
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">50% - Needs</h3>
                    <p className="text-sm text-gray-700 mb-3">Essential expenses you must pay:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                      <li>Rent/Mortgage</li>
                      <li>Utilities (electricity, water, internet)</li>
                      <li>Groceries</li>
                      <li>Transportation (car payment, gas, insurance)</li>
                      <li>Minimum debt payments</li>
                      <li>Insurance (health, life)</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">30% - Wants</h3>
                    <p className="text-sm text-gray-700 mb-3">Discretionary spending:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                      <li>Dining out</li>
                      <li>Entertainment (movies, concerts)</li>
                      <li>Shopping (clothes, gadgets)</li>
                      <li>Hobbies</li>
                      <li>Vacations</li>
                      <li>Subscriptions (Netflix, Spotify, gym)</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">20% - Savings & Debt</h3>
                    <p className="text-sm text-gray-700 mb-3">Future and financial security:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                      <li>Emergency fund (6 months expenses)</li>
                      <li>Retirement (IRA, extra 401k)</li>
                      <li>Investments (stocks, real estate)</li>
                      <li>Extra debt payments</li>
                      <li>Down payment savings</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-bold mb-3">Example Budget: $60,000 Net Income ($5,000/month)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="font-semibold">Monthly Take-Home:</span>
                      <span className="font-bold">$5,000</span>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Needs (50%):</span>
                        <span className="font-bold">$2,500</span>
                      </div>
                      <ul className="pl-6 space-y-1 text-sm text-gray-700">
                        <li>Rent: $1,400</li>
                        <li>Utilities: $200</li>
                        <li>Groceries: $400</li>
                        <li>Transportation: $350</li>
                        <li>Insurance: $150</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Wants (30%):</span>
                        <span className="font-bold">$1,500</span>
                      </div>
                      <ul className="pl-6 space-y-1 text-sm text-gray-700">
                        <li>Dining out: $400</li>
                        <li>Entertainment: $300</li>
                        <li>Shopping: $400</li>
                        <li>Subscriptions: $100</li>
                        <li>Miscellaneous: $300</li>
                      </ul>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Savings (20%):</span>
                        <span className="font-bold">$1,000</span>
                      </div>
                      <ul className="pl-6 space-y-1 text-sm text-gray-700">
                        <li>Emergency fund: $300</li>
                        <li>Retirement (Roth IRA): $500</li>
                        <li>Investments: $200</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm italic">
                  <strong>Note:</strong> This is a guideline, not a strict rule. In high cost-of-living cities (NYC, SF), needs might be 60-65%. If you have high-interest debt, consider allocating more than 20% to savings/debt until it's paid off.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>

                <div className="space-y-4">
                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      How do I calculate my hourly rate from my salary?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      To calculate your hourly rate from annual salary:
                      <br /><br />
                      <strong>Formula:</strong> Annual Salary ÷ (Hours per week × 52 weeks)
                      <br /><br />
                      <strong>Example:</strong> $75,000 salary, 40 hours/week
                      <br />Hourly Rate = $75,000 ÷ (40 × 52) = $75,000 ÷ 2,080 = $36.06/hour
                      <br /><br />
                      For your <strong>net hourly rate</strong> (after taxes), use your net annual salary instead.
                      <br />If net salary is $55,000, net hourly = $55,000 ÷ 2,080 = $26.44/hour
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      What's the difference between biweekly and semi-monthly pay?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      <strong>Biweekly:</strong> Paid every two weeks (every other Friday, for example)
                      <br />• 26 paychecks per year
                      <br />• Two months each year have 3 paychecks instead of 2
                      <br />• Paycheck amount = Annual salary ÷ 26
                      <br /><br />
                      <strong>Semi-monthly:</strong> Paid twice per month (typically 1st and 15th)
                      <br />• 24 paychecks per year
                      <br />• Consistent pay dates each month
                      <br />• Paycheck amount = Annual salary ÷ 24
                      <br /><br />
                      <strong>Example:</strong> $60,000 annual salary
                      <br />Biweekly: $2,308 per paycheck (26 times/year)
                      <br />Semi-monthly: $2,500 per paycheck (24 times/year)
                      <br /><br />
                      Biweekly results in smaller paychecks but you get two "extra" paychecks per year, making the total the same.
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      How are bonuses taxed?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      Bonuses are considered <strong>supplemental wages</strong> and are taxed differently than regular salary:
                      <br /><br />
                      <strong>Federal Withholding on Bonuses:</strong>
                      <br />• Flat rate method: 22% federal withholding (most common for bonuses under $1 million)
                      <br />• For bonuses over $1 million: 37% on the amount over $1 million
                      <br /><br />
                      <strong>Or</strong> your employer may combine the bonus with regular wages and withhold based on that total (aggregate method).
                      <br /><br />
                      <strong>Important:</strong> This is just <em>withholding</em>. When you file your tax return, the bonus is added to your total income and taxed at your regular marginal rate. You may get a refund if too much was withheld.
                      <br /><br />
                      <strong>Example:</strong> $10,000 bonus with 22% withholding
                      <br />• Federal withholding: $2,200
                      <br />• State withholding (CA 9.3%): $930
                      <br />• FICA: $765
                      <br />• Net bonus received: ~$6,105
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      Can I change my W-4 withholding mid-year?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      Yes, you can change your W-4 withholding at any time. Common reasons to adjust:
                      <br /><br />
                      <strong>Increase Withholding If:</strong>
                      <br />• You owed taxes last year
                      <br />• Your spouse started working
                      <br />• You got a raise or bonus
                      <br />• You have side income without withholding
                      <br />• Your tax credits decreased (kids aged out, etc.)
                      <br /><br />
                      <strong>Decrease Withholding If:</strong>
                      <br />• You got a large tax refund (you're giving the government an interest-free loan)
                      <br />• You started making large 401(k) contributions
                      <br />• You had a baby or qualified for new credits
                      <br />• Your spouse stopped working
                      <br /><br />
                      <strong>How to Change:</strong>
                      <br />1. Complete new W-4 form (use IRS withholding calculator at irs.gov)
                      <br />2. Submit to your employer's HR/payroll department
                      <br />3. Change takes effect within 1-2 pay periods
                      <br /><br />
                      <strong>Goal:</strong> Aim to break even or owe/receive less than $500 when you file taxes. A large refund means you withheld too much and lost access to that money all year.
                    </p>
                  </details>

                  <details className="pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      Should I contribute to traditional 401(k) or Roth 401(k)?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      The choice depends on whether you expect to be in a higher or lower tax bracket in retirement:
                      <br /><br />
                      <strong>Traditional 401(k):</strong>
                      <br />✅ Contributions are pre-tax (reduce taxable income now)
                      <br />✅ Lower your current tax bill
                      <br />❌ Pay taxes on withdrawals in retirement
                      <br />✅ Good if you expect to be in a lower tax bracket in retirement
                      <br />✅ Good if you're currently in high tax bracket (24%+)
                      <br /><br />
                      <strong>Roth 401(k):</strong>
                      <br />❌ Contributions are after-tax (no immediate tax benefit)
                      <br />✅ Withdrawals in retirement are tax-free (including earnings!)
                      <br />✅ No required minimum distributions (RMDs) like traditional
                      <br />✅ Good if you expect to be in a higher tax bracket in retirement
                      <br />✅ Good if you're young and currently in low tax bracket (12% or less)
                      <br /><br />
                      <strong>Example Scenario:</strong>
                      <br />Current age: 30, income: $75,000 (22% bracket), retire at 65 with $3M+ saved
                      <br />→ Roth 401(k) likely better: Pay 22% now, avoid 24-32%+ in retirement
                      <br /><br />
                      Current age: 45, income: $200,000 (32% bracket), retire with modest savings
                      <br />→ Traditional 401(k) likely better: Save 32% now, pay 12-22% in retirement
                      <br /><br />
                      <strong>Hedge Strategy:</strong> Many people split contributions between both to diversify tax exposure!
                    </p>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default SalaryCalculatorUS;
