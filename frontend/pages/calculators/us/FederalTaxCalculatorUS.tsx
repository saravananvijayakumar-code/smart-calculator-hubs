import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, FileText, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface TaxResult {
  grossIncome: number;
  adjustedGrossIncome: number;
  taxableIncome: number;
  federalTax: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  afterTaxIncome: number;
  taxByBracket: Array<{
    rate: number;
    income: number;
    tax: number;
  }>;
  standardDeduction: number;
  totalDeductions: number;
}

const federalTaxBrackets2025: Record<string, TaxBracket[]> = {
  single: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11926, max: 48475, rate: 0.12 },
    { min: 48476, max: 103350, rate: 0.22 },
    { min: 103351, max: 197300, rate: 0.24 },
    { min: 197301, max: 250525, rate: 0.32 },
    { min: 250526, max: 626350, rate: 0.35 },
    { min: 626351, max: Infinity, rate: 0.37 }
  ],
  marriedJointly: [
    { min: 0, max: 23850, rate: 0.10 },
    { min: 23851, max: 96950, rate: 0.12 },
    { min: 96951, max: 206700, rate: 0.22 },
    { min: 206701, max: 394600, rate: 0.24 },
    { min: 394601, max: 501050, rate: 0.32 },
    { min: 501051, max: 751600, rate: 0.35 },
    { min: 751601, max: Infinity, rate: 0.37 }
  ],
  marriedSeparately: [
    { min: 0, max: 11925, rate: 0.10 },
    { min: 11926, max: 48475, rate: 0.12 },
    { min: 48476, max: 103350, rate: 0.22 },
    { min: 103351, max: 197300, rate: 0.24 },
    { min: 197301, max: 250525, rate: 0.32 },
    { min: 250526, max: 375800, rate: 0.35 },
    { min: 375801, max: Infinity, rate: 0.37 }
  ],
  headOfHousehold: [
    { min: 0, max: 17000, rate: 0.10 },
    { min: 17001, max: 64850, rate: 0.12 },
    { min: 64851, max: 103350, rate: 0.22 },
    { min: 103351, max: 197300, rate: 0.24 },
    { min: 197301, max: 250500, rate: 0.32 },
    { min: 250501, max: 626350, rate: 0.35 },
    { min: 626351, max: Infinity, rate: 0.37 }
  ]
};

const standardDeductions2025: Record<string, number> = {
  single: 15000,
  marriedJointly: 30000,
  marriedSeparately: 15000,
  headOfHousehold: 22500
};

export function FederalTaxCalculatorUS() {
  const [grossIncome, setGrossIncome] = useState('');
  const [filingStatus, setFilingStatus] = useState('single');
  const [useStandardDeduction, setUseStandardDeduction] = useState(true);
  const [itemizedDeductions, setItemizedDeductions] = useState('');
  const [pre401k, setPre401k] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [otherPreTax, setOtherPreTax] = useState('');
  const [result, setResult] = useState<TaxResult | null>(null);

  const calculateFederalTax = () => {
    const income = parseFloat(grossIncome);
    if (!income || income <= 0) {
      setResult(null);
      return;
    }

    // Calculate AGI (Adjusted Gross Income)
    const preTax401k = parseFloat(pre401k) || 0;
    const preTaxHealth = parseFloat(healthInsurance) || 0;
    const otherPreTaxDeductions = parseFloat(otherPreTax) || 0;
    const adjustedGrossIncome = income - preTax401k - preTaxHealth - otherPreTaxDeductions;

    // Calculate deductions
    const standardDeduction = standardDeductions2025[filingStatus];
    const itemized = parseFloat(itemizedDeductions) || 0;
    const totalDeductions = useStandardDeduction ? standardDeduction : Math.max(itemized, standardDeduction);
    
    // Calculate taxable income
    const taxableIncome = Math.max(0, adjustedGrossIncome - totalDeductions);

    // Calculate tax using brackets
    const brackets = federalTaxBrackets2025[filingStatus];
    let federalTax = 0;
    const taxByBracket: Array<{rate: number, income: number, tax: number}> = [];

    for (const bracket of brackets) {
      if (taxableIncome <= bracket.min) break;
      
      const upperLimit = Math.min(taxableIncome, bracket.max);
      const taxableInBracket = upperLimit - bracket.min;
      
      if (taxableInBracket > 0) {
        const taxInBracket = taxableInBracket * bracket.rate;
        federalTax += taxInBracket;
        
        taxByBracket.push({
          rate: bracket.rate * 100,
          income: taxableInBracket,
          tax: taxInBracket
        });
      }
    }

    // Calculate rates
    const effectiveTaxRate = income > 0 ? (federalTax / income) * 100 : 0;
    
    let marginalTaxRate = 0;
    if (taxableIncome > 0) {
      const bracket = brackets.find(b => taxableIncome > b.min && taxableIncome <= b.max);
      marginalTaxRate = bracket ? bracket.rate * 100 : 0;
    }

    const afterTaxIncome = income - federalTax;

    setResult({
      grossIncome: income,
      adjustedGrossIncome,
      taxableIncome,
      federalTax,
      effectiveTaxRate,
      marginalTaxRate,
      afterTaxIncome,
      taxByBracket,
      standardDeduction,
      totalDeductions
    });
  };

  useEffect(() => {
    calculateFederalTax();
  }, [grossIncome, filingStatus, useStandardDeduction, itemizedDeductions, 
      pre401k, healthInsurance, otherPreTax]);

  const currentStandardDeduction = standardDeductions2025[filingStatus];

  return (
    <CalculatorLayoutWithAds
      title="Federal Income Tax Calculator 2025 | US Tax Calculator | Smart Calculator Hubs"
      description="Calculate your 2025 federal income tax with current tax brackets, deductions, and rates. Free comprehensive tax calculator for all filing statuses with detailed breakdown."
      keywords="federal income tax calculator 2025, US tax calculator, income tax brackets, tax deductions, filing status, marginal tax rate, effective tax rate"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Federal Tax Information</span>
            </CardTitle>
            <CardDescription>
              Enter your income and tax details to calculate your 2025 federal income tax.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grossIncome">Annual Gross Income (USD)</Label>
                  <Input
                    id="grossIncome"
                    type="number"
                    placeholder="75000"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filingStatus">Filing Status</Label>
                  <Select value={filingStatus} onValueChange={setFilingStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filing status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="marriedJointly">Married Filing Jointly</SelectItem>
                      <SelectItem value="marriedSeparately">Married Filing Separately</SelectItem>
                      <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pre401k">401(k) Contributions (USD)</Label>
                  <Input
                    id="pre401k"
                    type="number"
                    placeholder="0"
                    value={pre401k}
                    onChange={(e) => setPre401k(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    2025 limit: $23,500 (under 50), $31,000 (50+)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="healthInsurance">Health Insurance Premiums (USD)</Label>
                  <Input
                    id="healthInsurance"
                    type="number"
                    placeholder="0"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherPreTax">Other Pre-tax Deductions (USD)</Label>
                  <Input
                    id="otherPreTax"
                    type="number"
                    placeholder="0"
                    value={otherPreTax}
                    onChange={(e) => setOtherPreTax(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    HSA, FSA, transit benefits, etc.
                  </p>
                </div>

                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="useStandardDeduction" 
                      checked={useStandardDeduction}
                      onCheckedChange={(checked) => setUseStandardDeduction(checked === true)}
                    />
                    <Label htmlFor="useStandardDeduction" className="text-sm">
                      Use Standard Deduction (${currentStandardDeduction.toLocaleString()})
                    </Label>
                  </div>
                  
                  {!useStandardDeduction && (
                    <div className="space-y-2">
                      <Label htmlFor="itemizedDeductions">Itemized Deductions (USD)</Label>
                      <Input
                        id="itemizedDeductions"
                        type="number"
                        placeholder="0"
                        value={itemizedDeductions}
                        onChange={(e) => setItemizedDeductions(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        SALT, mortgage interest, charitable donations, etc.
                      </p>
                    </div>
                  )}
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
                    After-Tax Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${result.afterTaxIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Your take-home pay
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-red-800">
                    Federal Tax Owed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">
                    ${result.federalTax.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    Total federal tax
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Effective Tax Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {result.effectiveTaxRate.toFixed(2)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Average rate paid
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Marginal Tax Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {result.marginalTaxRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rate on next dollar
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Income Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Income Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Gross Income:</span>
                    <span className="font-medium">${result.grossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Adjusted Gross Income:</span>
                    <span className="font-medium">${result.adjustedGrossIncome.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Deductions:</span>
                    <span className="font-medium">${result.totalDeductions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Taxable Income:</span>
                    <span className="font-bold">${result.taxableIncome.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tax by Bracket</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.taxByBracket.map((bracket, index) => (
                    <div key={index} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        {bracket.rate}% bracket:
                      </span>
                      <div className="text-right">
                        <div className="font-medium">${bracket.tax.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                        <div className="text-xs text-muted-foreground">
                          on ${bracket.income.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between border-t pt-2 font-bold">
                    <span>Total Tax:</span>
                    <span>${result.federalTax.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Federal Income Tax in 2025</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-4">
                <p>
                  The federal income tax system in the United States uses a progressive tax structure, meaning higher incomes 
                  are taxed at higher rates. Understanding how this system works is crucial for effective tax planning and 
                  budgeting. Our calculator uses the most current 2025 tax brackets and standard deductions.
                </p>
                
                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Key Tax Concepts:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Gross Income:</strong> Your total income before any deductions or adjustments</li>
                  <li><strong>Adjusted Gross Income (AGI):</strong> Gross income minus specific deductions like 401(k) contributions</li>
                  <li><strong>Taxable Income:</strong> AGI minus standard or itemized deductions</li>
                  <li><strong>Marginal Tax Rate:</strong> The tax rate applied to your last dollar of income</li>
                  <li><strong>Effective Tax Rate:</strong> Your total tax divided by your total income</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">2025 Standard Deductions:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Single: $15,000</li>
                  <li>Married Filing Jointly: $30,000</li>
                  <li>Married Filing Separately: $15,000</li>
                  <li>Head of Household: $22,500</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Progressive Tax System Explained:</h4>
                <p>
                  The U.S. tax system is progressive, meaning you don't pay the same rate on all your income. 
                  Instead, your income is divided into "brackets," with each bracket taxed at a different rate. 
                  For example, if you're single with $50,000 in taxable income, you pay 10% on the first $11,000, 
                  then 12% on the remaining $39,000. This is why your marginal rate (the rate on your last dollar) 
                  is always higher than your effective rate (average rate across all income).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Planning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Reduce Your Tax Burden:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Maximize 401(k) contributions ($23,500 limit in 2025)</li>
                      <li>Contribute to traditional IRA ($7,000 limit in 2025)</li>
                      <li>Use Health Savings Account (HSA) if eligible</li>
                      <li>Consider itemizing if deductions exceed standard</li>
                      <li>Make charitable contributions before year-end</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Smart Tax Moves:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Harvest investment losses to offset gains</li>
                      <li>Time large purchases for maximum deduction impact</li>
                      <li>Consider Roth IRA conversions in low-income years</li>
                      <li>Optimize timing of stock option exercises</li>
                      <li>Bunch itemizable expenses every other year</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Retirement Contributions:</h4>
                <p>
                  Pre-tax retirement contributions are one of the most effective ways to reduce your current tax burden. 
                  For 2025, you can contribute up to $23,500 to a 401(k) plan, or $31,000 if you're 50 or older. 
                  Traditional IRA contributions may also be deductible, with limits of $7,000 ($8,000 if 50+), 
                  though deductibility phases out at higher income levels for those with workplace retirement plans.
                </p>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Standard vs. Itemized Deductions:</h4>
                <p>
                  The Tax Cuts and Jobs Act significantly increased standard deductions, making itemizing less beneficial 
                  for many taxpayers. However, you should still consider itemizing if your total deductions exceed the 
                  standard amount. Common itemized deductions include state and local taxes (SALT) up to $10,000, 
                  mortgage interest, charitable contributions, and medical expenses exceeding 7.5% of AGI.
                </p>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Tax Credits vs. Deductions:</h4>
                <p>
                  While this calculator focuses on deductions, don't forget about tax credits, which provide dollar-for-dollar 
                  tax reduction. Popular credits include the Child Tax Credit, Earned Income Tax Credit, American Opportunity 
                  Tax Credit for education, and various energy efficiency credits. Credits are applied after calculating 
                  your tax liability and can result in refunds if they exceed the tax owed.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2025 Tax Brackets and Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3">2025 Federal Tax Brackets:</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 p-2 text-left">Tax Rate</th>
                        <th className="border border-gray-300 p-2 text-left">Single</th>
                        <th className="border border-gray-300 p-2 text-left">Married Filing Jointly</th>
                        <th className="border border-gray-300 p-2 text-left">Head of Household</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border border-gray-300 p-2">10%</td><td className="border border-gray-300 p-2">$0 - $11,925</td><td className="border border-gray-300 p-2">$0 - $23,850</td><td className="border border-gray-300 p-2">$0 - $17,000</td></tr>
                      <tr><td className="border border-gray-300 p-2">12%</td><td className="border border-gray-300 p-2">$11,926 - $48,475</td><td className="border border-gray-300 p-2">$23,851 - $96,950</td><td className="border border-gray-300 p-2">$17,001 - $64,850</td></tr>
                      <tr><td className="border border-gray-300 p-2">22%</td><td className="border border-gray-300 p-2">$48,476 - $103,350</td><td className="border border-gray-300 p-2">$96,951 - $206,700</td><td className="border border-gray-300 p-2">$64,851 - $103,350</td></tr>
                      <tr><td className="border border-gray-300 p-2">24%</td><td className="border border-gray-300 p-2">$103,351 - $197,300</td><td className="border border-gray-300 p-2">$206,701 - $394,600</td><td className="border border-gray-300 p-2">$103,351 - $197,300</td></tr>
                      <tr><td className="border border-gray-300 p-2">32%</td><td className="border border-gray-300 p-2">$197,301 - $250,525</td><td className="border border-gray-300 p-2">$394,601 - $501,050</td><td className="border border-gray-300 p-2">$197,301 - $250,500</td></tr>
                      <tr><td className="border border-gray-300 p-2">35%</td><td className="border border-gray-300 p-2">$250,526 - $626,350</td><td className="border border-gray-300 p-2">$501,051 - $751,600</td><td className="border border-gray-300 p-2">$250,501 - $626,350</td></tr>
                      <tr><td className="border border-gray-300 p-2">37%</td><td className="border border-gray-300 p-2">$626,351+</td><td className="border border-gray-300 p-2">$751,601+</td><td className="border border-gray-300 p-2">$626,351+</td></tr>
                    </tbody>
                  </table>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">What's New for 2025:</h4>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Tax brackets adjusted upward for inflation (approximately 2.8% increase from 2024)</li>
                  <li>Standard deductions increased: Single $15,000, MFJ $30,000, HOH $22,500</li>
                  <li>401(k) contribution limit increased to $23,500 ($31,000 for 50+)</li>
                  <li>IRA contribution limit remains at $7,000 ($8,000 for 50+)</li>
                  <li>HSA contribution limits: $4,300 individual, $8,550 family</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Planning for Tax Season:</h4>
                <p>
                  Start your tax planning early by tracking deductible expenses throughout the year. Keep organized 
                  records of charitable donations, medical expenses, business expenses, and investment activities. 
                  Consider making estimated tax payments if you expect to owe $1,000 or more, and review your 
                  withholding if you consistently get large refunds or owe significant amounts at filing time.
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
                    <h4 className="font-semibold text-gray-800 mb-2">How accurate is this federal tax calculator?</h4>
                    <p>Our calculator uses official 2025 tax brackets and standard deductions from the IRS. However, it doesn't include all possible deductions, credits, or special circumstances. Use it for planning purposes, but consult a tax professional for complex situations.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What's the difference between marginal and effective tax rates?</h4>
                    <p>Your marginal tax rate is the percentage you pay on your last dollar of income, while your effective tax rate is your total tax divided by total income. The effective rate is always lower due to the progressive nature of the tax system.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I itemize or take the standard deduction?</h4>
                    <p>Take whichever gives you the larger deduction. With the increased standard deduction amounts, most taxpayers benefit from the standard deduction. Itemize only if your total itemizable deductions exceed the standard amount for your filing status.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much should I contribute to my 401(k)?</h4>
                    <p>At minimum, contribute enough to get your full employer match. Beyond that, consider contributing as much as you can afford, up to the $23,500 annual limit ($31,000 if 50+). Higher earners may benefit from maximizing pre-tax contributions to reduce current tax liability.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Do I need to make estimated tax payments?</h4>
                    <p>You may need to make quarterly estimated payments if you expect to owe $1,000 or more in taxes and haven't paid at least 90% of this year's tax liability (or 100% of last year's if income exceeds $150,000) through withholding.</p>
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
              <p>• This calculator provides estimates for federal income tax only and does not include state taxes, FICA taxes, or other payroll deductions.</p>
              <p>• Calculations are based on 2025 tax brackets and may not reflect all possible deductions, credits, or special circumstances.</p>
              <p>• Results do not constitute tax advice and should not be relied upon for filing tax returns or making financial decisions.</p>
              <p>• This calculator does not include Alternative Minimum Tax (AMT) calculations, which may apply to high earners.</p>
              <p>• Tax laws are complex and subject to change - consult a qualified tax professional for personalized advice.</p>
              <p>• Consider the impact of state taxes, which vary significantly by location and can substantially affect your total tax burden.</p>
              <p>• Self-employed individuals should account for additional self-employment taxes not included in these calculations.</p>
              <p>• This tool is for planning purposes only and does not replace professional tax preparation services.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {result && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="federal-tax-us"
            inputs={{ grossIncome, filingStatus, itemizedDeductions, pre401k, healthInsurance, otherPreTax }}
            results={result}
            title="Federal Tax Calculation"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
}