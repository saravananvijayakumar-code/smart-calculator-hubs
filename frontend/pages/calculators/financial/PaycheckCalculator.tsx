import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, Calculator as CalcIcon, TrendingDown, Wallet } from 'lucide-react';
import { SEOHead } from '../../../components/SEOHead';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { AIAnalysis } from '../../../components/AIAnalysis';
import { formatCurrency } from '../../../utils/formatting';

const STATE_TAX_RATES: { [key: string]: number } = {
  'AL': 5.0, 'AK': 0, 'AZ': 2.59, 'AR': 4.9, 'CA': 9.3,
  'CO': 4.4, 'CT': 5.0, 'DE': 6.6, 'FL': 0, 'GA': 5.75,
  'HI': 8.25, 'ID': 5.8, 'IL': 4.95, 'IN': 3.23, 'IA': 6.0,
  'KS': 5.7, 'KY': 5.0, 'LA': 4.25, 'ME': 7.15, 'MD': 5.75,
  'MA': 5.0, 'MI': 4.25, 'MN': 9.85, 'MS': 5.0, 'MO': 5.3,
  'MT': 6.75, 'NE': 6.84, 'NV': 0, 'NH': 0, 'NJ': 8.97,
  'NM': 5.9, 'NY': 8.82, 'NC': 4.99, 'ND': 2.9, 'OH': 3.99,
  'OK': 4.75, 'OR': 9.9, 'PA': 3.07, 'RI': 5.99, 'SC': 6.5,
  'SD': 0, 'TN': 0, 'TX': 0, 'UT': 4.95, 'VT': 8.75,
  'VA': 5.75, 'WA': 0, 'WV': 6.5, 'WI': 7.65, 'WY': 0
};

const STATES = Object.keys(STATE_TAX_RATES).sort();

export function PaycheckCalculator() {
  const [annualSalary, setAnnualSalary] = useState('75000');
  const [payFrequency, setPayFrequency] = useState('biweekly');
  const [state, setState] = useState('CA');
  const [filingStatus, setFilingStatus] = useState('single');
  const [k401Percent, setK401Percent] = useState('5');
  const [healthInsurance, setHealthInsurance] = useState('200');
  const [hsaContribution, setHsaContribution] = useState('0');
  const [fsaContribution, setFsaContribution] = useState('0');
  const [additionalWithholding, setAdditionalWithholding] = useState('0');
  const [calculated, setCalculated] = useState(false);

  const salary = parseFloat(annualSalary) || 0;
  const k401Rate = parseFloat(k401Percent) || 0;
  const healthPremium = parseFloat(healthInsurance) || 0;
  const hsaAnnual = parseFloat(hsaContribution) || 0;
  const fsaAnnual = parseFloat(fsaContribution) || 0;
  const additionalAnnual = parseFloat(additionalWithholding) || 0;

  const paychecksPerYear = {
    weekly: 52,
    biweekly: 26,
    semimonthly: 24,
    monthly: 12
  }[payFrequency] || 26;

  const grossPerPaycheck = salary / paychecksPerYear;
  
  const k401PerPaycheck = grossPerPaycheck * (k401Rate / 100);
  const healthPerPaycheck = (healthPremium * 12) / paychecksPerYear;
  const hsaPerPaycheck = hsaAnnual / paychecksPerYear;
  const fsaPerPaycheck = fsaAnnual / paychecksPerYear;
  
  const preTaxDeductions = k401PerPaycheck + healthPerPaycheck + hsaPerPaycheck + fsaPerPaycheck;
  const taxableIncome = grossPerPaycheck - preTaxDeductions;

  const calculateFederalWithholding = (income: number, status: string) => {
    const annualIncome = income * paychecksPerYear;
    let tax = 0;
    
    if (status === 'single') {
      if (annualIncome <= 11000) tax = annualIncome * 0.10;
      else if (annualIncome <= 44725) tax = 1100 + (annualIncome - 11000) * 0.12;
      else if (annualIncome <= 95375) tax = 5147 + (annualIncome - 44725) * 0.22;
      else if (annualIncome <= 182100) tax = 16290 + (annualIncome - 95375) * 0.24;
      else if (annualIncome <= 231250) tax = 37104 + (annualIncome - 182100) * 0.32;
      else if (annualIncome <= 578125) tax = 52832 + (annualIncome - 231250) * 0.35;
      else tax = 174238.25 + (annualIncome - 578125) * 0.37;
    } else {
      if (annualIncome <= 22000) tax = annualIncome * 0.10;
      else if (annualIncome <= 89075) tax = 2200 + (annualIncome - 22000) * 0.12;
      else if (annualIncome <= 190750) tax = 10294 + (annualIncome - 89075) * 0.22;
      else if (annualIncome <= 364200) tax = 32580 + (annualIncome - 190750) * 0.24;
      else if (annualIncome <= 462500) tax = 74208 + (annualIncome - 364200) * 0.32;
      else if (annualIncome <= 693750) tax = 105664 + (annualIncome - 462500) * 0.35;
      else tax = 186601.50 + (annualIncome - 693750) * 0.37;
    }
    
    return tax / paychecksPerYear;
  };

  const federalWithholding = calculateFederalWithholding(taxableIncome, filingStatus);
  
  const stateTaxRate = STATE_TAX_RATES[state] || 0;
  const stateWithholding = (taxableIncome * paychecksPerYear * stateTaxRate / 100) / paychecksPerYear;

  const socialSecurityCap = 168600;
  const yearToDateGross = grossPerPaycheck * Math.min(paychecksPerYear, 26);
  const socialSecurityTaxable = Math.min(taxableIncome, Math.max(0, (socialSecurityCap - yearToDateGross) / paychecksPerYear + taxableIncome));
  const socialSecurity = socialSecurityTaxable * 0.062;
  
  const medicareBase = taxableIncome * 0.0145;
  const additionalMedicare = taxableIncome * paychecksPerYear > 200000 ? (taxableIncome - (200000 / paychecksPerYear)) * 0.009 : 0;
  const medicare = medicareBase + additionalMedicare;
  
  const ficaTotal = socialSecurity + medicare;

  const postTaxDeductions = additionalAnnual / paychecksPerYear;
  
  const netPerPaycheck = grossPerPaycheck - preTaxDeductions - federalWithholding - stateWithholding - ficaTotal - postTaxDeductions;
  
  const annualGross = salary;
  const annualPreTaxDeductions = preTaxDeductions * paychecksPerYear;
  const annualFederalTax = federalWithholding * paychecksPerYear;
  const annualStateTax = stateWithholding * paychecksPerYear;
  const annualFICA = ficaTotal * paychecksPerYear;
  const annualPostTaxDeductions = postTaxDeductions * paychecksPerYear;
  const annualNet = netPerPaycheck * paychecksPerYear;

  const handleCalculate = () => {
    setCalculated(true);
  };

  return (
    <>
      <SEOHead
        title="Paycheck Calculator - Calculate Take-Home Pay After Taxes & Deductions"
        description="Free paycheck calculator. Calculate your net pay after federal tax, state tax, FICA, and deductions. See detailed breakdown of all withholdings by pay period."
        keywords="paycheck calculator, paycheck calculator after taxes, biweekly paycheck calculator, net pay calculator, check calculator, take home pay"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 dark:from-gray-900 dark:to-green-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Paycheck Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Calculate your take-home pay after federal tax, state tax, FICA, and all deductions
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-6 w-6" />
                    Salary Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <AppleStyleInput
                    label="Annual Salary"
                    type="number"
                    value={annualSalary}
                    onChange={(e) => setAnnualSalary(e.target.value)}
                    placeholder="75000"
                    prefix="$"
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Pay Frequency
                    </label>
                    <Select value={payFrequency} onValueChange={setPayFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly (52 paychecks)</SelectItem>
                        <SelectItem value="biweekly">Bi-weekly (26 paychecks)</SelectItem>
                        <SelectItem value="semimonthly">Semi-monthly (24 paychecks)</SelectItem>
                        <SelectItem value="monthly">Monthly (12 paychecks)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      State
                    </label>
                    <Select value={state} onValueChange={setState}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {STATES.map((st) => (
                          <SelectItem key={st} value={st}>
                            {st} {STATE_TAX_RATES[st] === 0 ? '(No state tax)' : `(${STATE_TAX_RATES[st]}%)`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Filing Status
                    </label>
                    <Select value={filingStatus} onValueChange={setFilingStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married Filing Jointly</SelectItem>
                        <SelectItem value="head">Head of Household</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <CalcIcon className="h-6 w-6" />
                    Pre-Tax Deductions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <AppleStyleInput
                    label="401(k) Contribution"
                    type="number"
                    value={k401Percent}
                    onChange={(e) => setK401Percent(e.target.value)}
                    placeholder="5"
                    suffix="%"
                  />

                  <AppleStyleInput
                    label="Health Insurance Premium (Monthly)"
                    type="number"
                    value={healthInsurance}
                    onChange={(e) => setHealthInsurance(e.target.value)}
                    placeholder="200"
                    prefix="$"
                  />

                  <AppleStyleInput
                    label="HSA Contribution (Annual)"
                    type="number"
                    value={hsaContribution}
                    onChange={(e) => setHsaContribution(e.target.value)}
                    placeholder="0"
                    prefix="$"
                  />

                  <AppleStyleInput
                    label="FSA Contribution (Annual)"
                    type="number"
                    value={fsaContribution}
                    onChange={(e) => setFsaContribution(e.target.value)}
                    placeholder="0"
                    prefix="$"
                  />
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-6 w-6" />
                    Post-Tax Deductions
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AppleStyleInput
                    label="Additional Withholding (Annual)"
                    type="number"
                    value={additionalWithholding}
                    onChange={(e) => setAdditionalWithholding(e.target.value)}
                    placeholder="0"
                    prefix="$"
                  />
                </CardContent>
              </Card>

              <Button 
                onClick={handleCalculate}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6 text-lg"
              >
                Calculate Paycheck
              </Button>
            </div>

            <div className="space-y-6">
              <Card className="shadow-lg border-2 border-green-200 dark:border-green-800">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-6 w-6" />
                    Net Pay Per Paycheck
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-green-600 dark:text-green-400 mb-4">
                      {formatCurrency(netPerPaycheck, 'USD')}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-lg">
                      {paychecksPerYear} paychecks per year
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Paycheck Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <span className="font-semibold">Gross Pay</span>
                    <span className="text-lg font-bold text-blue-600">{formatCurrency(grossPerPaycheck, 'USD')}</span>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-3 space-y-2">
                    <div className="text-sm font-semibold text-purple-700 dark:text-purple-400">Pre-Tax Deductions</div>
                    <div className="flex justify-between text-sm">
                      <span>401(k) ({k401Rate}%)</span>
                      <span className="text-red-600">-{formatCurrency(k401PerPaycheck, 'USD')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Health Insurance</span>
                      <span className="text-red-600">-{formatCurrency(healthPerPaycheck, 'USD')}</span>
                    </div>
                    {hsaPerPaycheck > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>HSA</span>
                        <span className="text-red-600">-{formatCurrency(hsaPerPaycheck, 'USD')}</span>
                      </div>
                    )}
                    {fsaPerPaycheck > 0 && (
                      <div className="flex justify-between text-sm">
                        <span>FSA</span>
                        <span className="text-red-600">-{formatCurrency(fsaPerPaycheck, 'USD')}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total Pre-Tax</span>
                      <span className="text-red-600">-{formatCurrency(preTaxDeductions, 'USD')}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-semibold">Taxable Income</span>
                    <span className="text-lg font-bold">{formatCurrency(taxableIncome, 'USD')}</span>
                  </div>

                  <div className="border-l-4 border-red-500 pl-3 space-y-2">
                    <div className="text-sm font-semibold text-red-700 dark:text-red-400">Taxes</div>
                    <div className="flex justify-between text-sm">
                      <span>Federal Tax</span>
                      <span className="text-red-600">-{formatCurrency(federalWithholding, 'USD')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>State Tax ({state})</span>
                      <span className="text-red-600">-{formatCurrency(stateWithholding, 'USD')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Social Security</span>
                      <span className="text-red-600">-{formatCurrency(socialSecurity, 'USD')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Medicare</span>
                      <span className="text-red-600">-{formatCurrency(medicare, 'USD')}</span>
                    </div>
                    <div className="flex justify-between font-semibold pt-2 border-t">
                      <span>Total Taxes</span>
                      <span className="text-red-600">-{formatCurrency(federalWithholding + stateWithholding + ficaTotal, 'USD')}</span>
                    </div>
                  </div>

                  {postTaxDeductions > 0 && (
                    <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <span className="font-semibold">Post-Tax Deductions</span>
                      <span className="text-lg font-bold text-red-600">-{formatCurrency(postTaxDeductions, 'USD')}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border-2 border-green-500">
                    <span className="font-bold text-lg">Net Pay</span>
                    <span className="text-2xl font-bold text-green-600">{formatCurrency(netPerPaycheck, 'USD')}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Annual Totals</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between">
                    <span>Annual Gross</span>
                    <span className="font-bold">{formatCurrency(annualGross, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pre-Tax Deductions</span>
                    <span className="font-bold text-red-600">-{formatCurrency(annualPreTaxDeductions, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Federal Tax</span>
                    <span className="font-bold text-red-600">-{formatCurrency(annualFederalTax, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>State Tax</span>
                    <span className="font-bold text-red-600">-{formatCurrency(annualStateTax, 'USD')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FICA</span>
                    <span className="font-bold text-red-600">-{formatCurrency(annualFICA, 'USD')}</span>
                  </div>
                  {annualPostTaxDeductions > 0 && (
                    <div className="flex justify-between">
                      <span>Post-Tax Deductions</span>
                      <span className="font-bold text-red-600">-{formatCurrency(annualPostTaxDeductions, 'USD')}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t-2 border-green-500">
                    <span className="font-bold text-lg">Annual Net Pay</span>
                    <span className="font-bold text-xl text-green-600">{formatCurrency(annualNet, 'USD')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {calculated && (
            <AIAnalysis
              analysisRequest={{
                calculatorType: "paycheck_calculator",
                data: {
                  annualSalary: salary,
                  payFrequency: payFrequency,
                  state: state,
                  grossPerPaycheck: grossPerPaycheck,
                  netPerPaycheck: netPerPaycheck,
                  federalWithholding: federalWithholding,
                  stateWithholding: stateWithholding,
                  ficaTotal: ficaTotal,
                  preTaxDeductions: preTaxDeductions,
                  postTaxDeductions: postTaxDeductions,
                  annualNetPay: annualNet
                }
              }}
            />
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert mt-12 space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Understanding Your Paycheck</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your paycheck is more than just a number - it's a detailed breakdown of your earnings, taxes, and deductions. Understanding each component helps you optimize your take-home pay, plan your budget effectively, and make informed financial decisions. This paycheck calculator provides a comprehensive analysis of your gross pay, all deductions, tax withholdings, and net pay based on your salary, pay frequency, and location.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                The anatomy of a paycheck stub includes gross pay (your salary before deductions), pre-tax deductions (401k, health insurance, HSA, FSA), taxes (federal, state, FICA), post-tax deductions, and net pay (your actual take-home amount). Each line item affects your bottom line differently, with pre-tax deductions reducing your taxable income and post-tax deductions coming out of your net pay.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pay Frequency Impact</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                How often you get paid significantly impacts your budgeting and cash flow management:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Weekly (52 paychecks)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Receive payment every week, typically on the same day.</p>
                  <p className="text-sm"><strong>Pros:</strong> Most frequent cash flow, easier to budget short-term expenses</p>
                  <p className="text-sm"><strong>Cons:</strong> Smaller per-paycheck amount, more paychecks to track</p>
                </div>

                <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Bi-weekly (26 paychecks)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Paid every two weeks, most common pay frequency in the US.</p>
                  <p className="text-sm"><strong>Pros:</strong> Two "extra" paychecks per year (2 months have 3 paychecks), balanced frequency</p>
                  <p className="text-sm"><strong>Cons:</strong> Pay dates shift throughout the year, varying paychecks per month</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Semi-monthly (24 paychecks)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Paid twice per month, often on the 15th and last day.</p>
                  <p className="text-sm"><strong>Pros:</strong> Consistent 2 paychecks per month, easier to align with monthly bills</p>
                  <p className="text-sm"><strong>Cons:</strong> Varying days between paychecks (13-16 days)</p>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950 border-l-4 border-orange-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Monthly (12 paychecks)</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">Paid once per month, common for salaried professionals.</p>
                  <p className="text-sm"><strong>Pros:</strong> Largest per-paycheck amount, aligns perfectly with monthly bills</p>
                  <p className="text-sm"><strong>Cons:</strong> Requires strongest budgeting discipline, longest wait between paychecks</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Federal Withholding</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Federal income tax is withheld from each paycheck based on the information you provide on your Form W-4. The 2024 W-4 uses a different system than previous years, eliminating "allowances" in favor of more accurate withholding calculations.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">How Federal Withholding Works</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Your employer calculates federal withholding using your filing status, number of dependents, and any additional withholding you request. The system uses progressive tax brackets, meaning different portions of your income are taxed at different rates. Your actual annual tax liability may differ from withholding, resulting in either a refund or additional tax owed when you file your return.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Form W-4 Explained (2024 Version)</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The W-4 has five steps:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li><strong>Step 1:</strong> Enter personal information (name, address, SSN, filing status)</li>
                <li><strong>Step 2:</strong> Account for multiple jobs or spouse's income (use worksheet or online estimator)</li>
                <li><strong>Step 3:</strong> Claim dependents (number of qualifying children and other dependents)</li>
                <li><strong>Step 4:</strong> Optional adjustments (other income, deductions, extra withholding)</li>
                <li><strong>Step 5:</strong> Sign and date the form</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Adjusting Your Withholding</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You should update your W-4 when you experience major life changes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>Marriage or divorce</li>
                <li>Birth or adoption of a child</li>
                <li>Purchase of a home</li>
                <li>Starting a second job or side business</li>
                <li>Large refund or tax bill in previous year</li>
                <li>Significant increase or decrease in income</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">State Withholding Variations</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                State income tax withholding varies dramatically across the United States. Nine states have no income tax, while others have rates ranging from under 3% to over 13% for high earners.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">No Income Tax States (9)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Alaska</li>
                    <li>• Florida</li>
                    <li>• Nevada</li>
                    <li>• New Hampshire*</li>
                    <li>• South Dakota</li>
                    <li>• Tennessee</li>
                    <li>• Texas</li>
                    <li>• Washington</li>
                    <li>• Wyoming</li>
                  </ul>
                  <p className="text-xs mt-2">*NH taxes dividends & interest only</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">Low Tax States (&lt;4%)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• North Dakota: 2.9%</li>
                    <li>• Pennsylvania: 3.07%</li>
                    <li>• Indiana: 3.23%</li>
                    <li>• Arizona: 2.59%</li>
                    <li>• Ohio: 3.99%</li>
                  </ul>
                </div>

                <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-3">High Tax States (&gt;9%)</h3>
                  <ul className="text-sm space-y-1">
                    <li>• California: 9.3%+</li>
                    <li>• New York: 8.82%+</li>
                    <li>• New Jersey: 8.97%+</li>
                    <li>• Minnesota: 9.85%+</li>
                    <li>• Oregon: 9.9%+</li>
                  </ul>
                  <p className="text-xs mt-2">Top marginal rates shown</p>
                </div>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Some localities also impose additional income taxes. For example, New York City residents pay an additional 3.876% on top of state taxes. Consider both state and local tax rates when evaluating job offers or relocation decisions.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">FICA Taxes on Paychecks</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                FICA (Federal Insurance Contributions Act) taxes fund Social Security and Medicare. These are mandatory payroll taxes that apply to nearly all employees.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Social Security Tax</h3>
              <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                <p className="mb-2"><strong>Rate:</strong> 6.2% of gross wages</p>
                <p className="mb-2"><strong>2024 Wage Cap:</strong> $168,600</p>
                <p className="mb-2"><strong>Maximum Annual Tax:</strong> $10,453.20</p>
                <p className="text-sm mt-3">Once your year-to-date earnings exceed $168,600, you stop paying Social Security tax for the remainder of the year. High earners see a noticeable bump in net pay once they hit this threshold (usually in November or December).</p>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Medicare Tax</h3>
              <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                <p className="mb-2"><strong>Base Rate:</strong> 1.45% of all wages (no cap)</p>
                <p className="mb-2"><strong>Additional Medicare Tax:</strong> 0.9% on earnings over $200,000 (single) or $250,000 (married)</p>
                <p className="text-sm mt-3">Unlike Social Security, Medicare tax applies to all wages with no cap. The Additional Medicare Tax kicks in at high income levels and is an extra 0.9% on top of the base 1.45%, bringing total Medicare tax to 2.35% on wages above the threshold.</p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                <strong>Employer Match:</strong> Your employer also pays matching FICA taxes (6.2% Social Security + 1.45% Medicare). This is in addition to your salary and is part of the true cost of employing you. Self-employed individuals pay both the employee and employer portions (15.3% total) via self-employment tax.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Pre-Tax Deductions (Advantages)</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Pre-tax deductions reduce your taxable income, lowering your federal and state income tax liability. These are powerful tools for reducing your overall tax burden.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">401(k) Contributions</h3>
              <div className="bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500 p-6 rounded-lg mb-6">
                <p className="mb-2"><strong>2024 Contribution Limit:</strong> $23,000 (under age 50), $30,500 (age 50+)</p>
                <p className="mb-2"><strong>Tax Impact:</strong> Every $1,000 contributed saves approximately $220-370 in federal taxes (depending on tax bracket)</p>
                <p className="mb-2"><strong>Employer Match:</strong> Free money! Common matches: 50% of first 6%, or 100% of first 3%</p>
                <p className="text-sm mt-3">Contributing to your 401(k) reduces your current taxable income, meaning you pay less tax now. You'll pay taxes when you withdraw in retirement, ideally when you're in a lower tax bracket. Always contribute enough to get the full employer match - it's an immediate 50-100% return on investment.</p>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Health Savings Account (HSA)</h3>
              <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                <p className="mb-2"><strong>2024 Contribution Limit:</strong> $4,150 (individual), $8,300 (family)</p>
                <p className="mb-2"><strong>Triple Tax Advantage:</strong></p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Tax-deductible contributions (like 401k)</li>
                  <li>Tax-free growth (like Roth IRA)</li>
                  <li>Tax-free withdrawals for qualified medical expenses</li>
                </ul>
                <p className="text-sm mt-3">HSAs are available only with High Deductible Health Plans (HDHPs). Funds roll over year-to-year and can be invested like a 401(k). After age 65, you can withdraw for any purpose (taxed as ordinary income), making it similar to a traditional IRA with medical expense advantages.</p>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Health Insurance Premiums</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Employer-sponsored health insurance premiums are typically deducted pre-tax, reducing your taxable income. If your employer offers multiple plan tiers, calculate whether a higher premium / lower deductible plan makes sense based on your expected healthcare usage.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Flexible Spending Account (FSA)</h3>
              <div className="bg-yellow-50 dark:bg-yellow-950 border-l-4 border-yellow-500 p-6 rounded-lg mb-6">
                <p className="mb-2"><strong>2024 Contribution Limit:</strong> $3,200 (healthcare FSA), $5,000 (dependent care FSA)</p>
                <p className="mb-2"><strong>Use-It-or-Lose-It:</strong> Funds must generally be used by year-end or during grace period</p>
                <p className="mb-2"><strong>Carryover:</strong> Some employers allow up to $640 to carry over to the next year</p>
                <p className="text-sm mt-3">FSAs reduce taxable income but require careful planning. Only contribute what you're confident you'll spend on qualified medical expenses (copays, prescriptions, glasses, dental) or dependent care (daycare, after-school programs). Unlike HSAs, you can't invest FSA funds or carry large balances forward.</p>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Commuter Benefits</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Some employers offer pre-tax deductions for transit passes and parking (up to $315/month each in 2024). If you commute regularly, this benefit can save $600-1,200 annually in taxes.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Post-Tax Deductions</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Post-tax deductions come out of your net pay after all taxes are withheld. These don't reduce your taxable income but may offer other benefits:
              </p>

              <ul className="list-disc pl-6 space-y-3 text-gray-700 dark:text-gray-300 mb-6">
                <li>
                  <strong>Roth 401(k) Contributions:</strong> Unlike traditional 401(k), Roth contributions are made after-tax. You pay taxes now but enjoy tax-free withdrawals in retirement. Beneficial if you expect to be in a higher tax bracket later or want tax diversification.
                </li>
                <li>
                  <strong>Disability Insurance:</strong> Premiums for supplemental disability insurance are often post-tax, but this means benefits are tax-free if you need to use them.
                </li>
                <li>
                  <strong>Life Insurance:</strong> Employer-provided life insurance over $50,000 is taxable, and any additional coverage you purchase through your employer typically uses post-tax dollars.
                </li>
                <li>
                  <strong>Wage Garnishments:</strong> Court-ordered garnishments for child support, alimony, student loans, or tax liens are automatically deducted after taxes.
                </li>
                <li>
                  <strong>Union Dues:</strong> Labor union membership dues are typically post-tax deductions.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Optimizing Your Paycheck</h2>
              
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">1. Maximize Pre-Tax Deductions</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Every dollar you contribute pre-tax saves you 20-40% in taxes depending on your bracket. Prioritize:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li>401(k) up to employer match (minimum)</li>
                <li>HSA maximum if eligible (best tax treatment)</li>
                <li>Additional 401(k) contributions (up to limit)</li>
                <li>FSA for predictable medical expenses</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">2. Adjust W-4 to Avoid Large Refunds</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                A $3,000 tax refund means you gave the government an interest-free loan of $250/month. Use the IRS Tax Withholding Estimator to dial in your W-4 and get that money in your paychecks throughout the year instead. Invest or pay down debt with the extra cash flow rather than waiting for a refund.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">3. Calculate Your True Hourly Rate</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Divide your net annual pay by hours worked to understand your true take-home hourly rate. For example, $75,000 gross might be $55,000 net. If you work 2,080 hours/year (40 hrs/week × 52 weeks), your true rate is $26.44/hr, not $36.06/hr. This perspective helps evaluate side gigs, overtime, and time-money trade-offs.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">4. Understand Bonus and Overtime Taxation</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Bonuses and overtime are often withheld at higher rates (supplemental wage rate of 22% or your marginal rate). This doesn't mean you're taxed more - it's just withholding. You'll get overpaid taxes back when you file your return. Don't panic when your bonus check is withheld at 40-50% total.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    Why does my paycheck vary even though my salary is the same?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Paycheck variations occur for several reasons: (1) Different number of pay periods per month with bi-weekly pay, (2) Changes to pre-tax deductions like 401(k) contributions or insurance premiums, (3) Hitting the Social Security wage cap ($168,600) gives you a bump in late-year paychecks, (4) Overtime or bonus pay in some periods, (5) Updated tax withholding from a new W-4, or (6) Changes to benefits enrollment. Review your paystub details to identify the specific cause.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    Should I change my W-4 if I got a large refund or owed taxes?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Yes! A large refund means you're over-withholding (giving an interest-free loan to the government). Owing significant taxes means you're under-withholding and may face penalties. Use the IRS Tax Withholding Estimator tool to calculate optimal withholding and submit a new W-4. Aim to owe or receive less than $500 at tax time. Update your W-4 whenever you have major life changes (marriage, children, home purchase, second job).
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    How are bonuses taxed differently than regular pay?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Bonuses are "supplemental wages" and are typically withheld at either 22% (flat rate for bonuses under $1M) or your marginal tax rate. The total withholding including FICA and state tax can reach 40-50%. However, this is just withholding - your actual tax rate is determined when you file your annual return. If too much was withheld, you get it back as a refund. Bonuses are NOT taxed at a higher rate than regular income; they just have different withholding rules.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    What's the maximum I can contribute to my 401(k)?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    For 2024, you can contribute up to $23,000 to your 401(k) if you're under age 50, or $30,500 if you're 50 or older (includes $7,500 catch-up contribution). These limits apply to employee deferrals only - employer matching contributions don't count toward this limit. The total combined limit (employee + employer) is $69,000 ($76,500 for age 50+). Highly compensated employees may face additional restrictions based on company plan rules.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    Should I do pre-tax or Roth 401(k) contributions?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Choose pre-tax (traditional) if you expect lower tax rates in retirement or want to reduce current taxable income. Choose Roth if you expect higher tax rates in retirement, are early in your career with a relatively low current salary, or want tax diversification. Many experts recommend a mix of both. General rule of thumb: if you're in the 22% bracket or higher now and expect to be in the 12% bracket in retirement, choose pre-tax. If you're currently in the 12% bracket, Roth may be better.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    What happens to my paycheck if I hit the Social Security wage cap?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Once your year-to-date earnings reach $168,600 (2024), you stop paying the 6.2% Social Security tax for the remainder of the year. This means an immediate 6.2% increase in your net pay. For example, if you earn $200,000/year paid bi-weekly ($7,692/paycheck), you'll hit the cap around mid-November and see your net pay increase by about $477 per paycheck for the rest of the year. Medicare tax continues with no cap.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    How do I calculate my effective tax rate from my paycheck?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Effective tax rate = Total taxes paid / Gross income. Add federal tax + state tax + FICA (Social Security + Medicare) from your paystub, then divide by gross pay. For example: Federal tax $600 + State tax $300 + FICA $230 = $1,130 total taxes. $1,130 / $3,000 gross = 37.7% effective rate on your paycheck. Note that this paycheck rate may differ from your annual effective rate due to progressive tax brackets, and doesn't account for tax credits you might receive when filing your return.
                  </p>
                </details>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaycheckCalculator;
