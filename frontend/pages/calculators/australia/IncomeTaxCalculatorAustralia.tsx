// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info, TrendingUp, FileText } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

const IncomeTaxCalculatorAustralia: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState<string>('');
  const [residencyStatus, setResidencyStatus] = useState<string>('resident');
  const [hasMedicare, setHasMedicare] = useState<string>('full');
  const [hasHELP, setHasHELP] = useState<string>('no');
  const [results, setResults] = useState<any>(null);

  const taxBrackets2025: TaxBracket[] = [
    { min: 0, max: 18200, rate: 0 },
    { min: 18201, max: 45000, rate: 0.16 },
    { min: 45001, max: 135000, rate: 0.30 },
    { min: 135001, max: 190000, rate: 0.37 },
    { min: 190001, max: Infinity, rate: 0.45 }
  ];

  const foreignResidentBrackets: TaxBracket[] = [
    { min: 0, max: 135000, rate: 0.30 },
    { min: 135001, max: 190000, rate: 0.37 },
    { min: 190001, max: Infinity, rate: 0.45 }
  ];

  const medicareLevy = 0.02;
  const medicareLevySurchargeThreshold = 97000;

  const calculateTax = () => {
    const income = parseFloat(grossIncome);
    if (!income || income <= 0) return;

    const brackets = residencyStatus === 'resident' ? taxBrackets2025 : foreignResidentBrackets;
    let incomeTax = 0;

    for (const bracket of brackets) {
      if (income <= bracket.min) break;
      
      const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
      if (taxableInBracket > 0) {
        incomeTax += taxableInBracket * bracket.rate;
      }
    }

    let medicareLevy = 0;
    if (residencyStatus === 'resident' && hasMedicare === 'full') {
      medicareLevy = income * 0.02;
    } else if (residencyStatus === 'resident' && hasMedicare === 'half') {
      medicareLevy = income * 0.01;
    }

    let helpRepayment = 0;
    if (hasHELP === 'yes') {
      if (income > 54435) {
        const helpRate = calculateHELPRate(income);
        helpRepayment = income * helpRate;
      }
    }

    const totalTax = incomeTax + medicareLevy + helpRepayment;
    const netIncome = income - totalTax;
    const effectiveTaxRate = (totalTax / income) * 100;
    
    const marginalTaxRate = calculateMarginalRate(income, residencyStatus);

    setResults({
      grossIncome: income,
      incomeTax,
      medicareLevy,
      helpRepayment,
      totalTax,
      netIncome,
      effectiveTaxRate,
      marginalTaxRate,
      monthlyGross: income / 12,
      monthlyNet: netIncome / 12,
      fortnightlyGross: income / 26,
      fortnightlyNet: netIncome / 26
    });
  };

  const calculateHELPRate = (income: number): number => {
    if (income <= 54434) return 0;
    if (income <= 62850) return 0.01;
    if (income <= 66619) return 0.02;
    if (income <= 70617) return 0.025;
    if (income <= 74855) return 0.03;
    if (income <= 79346) return 0.035;
    if (income <= 84107) return 0.04;
    if (income <= 89154) return 0.045;
    if (income <= 94504) return 0.05;
    if (income <= 100174) return 0.055;
    if (income <= 106185) return 0.06;
    if (income <= 112556) return 0.065;
    if (income <= 119309) return 0.07;
    if (income <= 126467) return 0.075;
    if (income <= 134056) return 0.08;
    if (income <= 142100) return 0.085;
    if (income <= 150626) return 0.09;
    if (income <= 159663) return 0.095;
    return 0.10;
  };

  const calculateMarginalRate = (income: number, residency: string): number => {
    if (residency === 'resident') {
      if (income <= 18200) return 0;
      if (income <= 45000) return 16;
      if (income <= 135000) return 30;
      if (income <= 190000) return 37;
      return 45;
    } else {
      if (income <= 135000) return 30;
      if (income <= 190000) return 37;
      return 45;
    }
  };

  const reset = () => {
    setGrossIncome('');
    setResidencyStatus('resident');
    setHasMedicare('full');
    setHasHELP('no');
    setResults(null);
  };

  const tips = [
    "Tax-free threshold: $18,200 for Australian residents",
    "Medicare Levy: 2% of taxable income for most residents",
    "HELP/HECS debt repayment starts at $54,435 income",
    "Stage 3 tax cuts effective from 1 July 2024",
    "Foreign residents don't pay Medicare Levy but have no tax-free threshold"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Australia Income Tax Calculator 2025-26"
      description="Calculate your Australian income tax for the 2025-26 financial year with updated tax brackets, Medicare Levy, and HELP/HECS repayments"
      keywords="Australia income tax calculator, tax calculator 2025-26, Medicare Levy, HELP debt, HECS, Australian tax rates"
      tips={tips}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Income Tax Calculator
            </CardTitle>
            <CardDescription>
              Calculate your tax for FY 2025-26 (1 July 2025 - 30 June 2026)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="grossIncome">Annual Gross Income (AUD)</Label>
              <Input
                id="grossIncome"
                type="number"
                placeholder="Enter annual gross income"
                value={grossIncome}
                onChange={(e) => setGrossIncome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="residencyStatus">Residency Status</Label>
              <Select value={residencyStatus} onValueChange={setResidencyStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select residency status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="resident">Australian Resident</SelectItem>
                  <SelectItem value="foreign">Foreign Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {residencyStatus === 'resident' && (
              <div className="space-y-2">
                <Label htmlFor="hasMedicare">Medicare Levy</Label>
                <Select value={hasMedicare} onValueChange={setHasMedicare}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Medicare status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full Medicare Levy (2%)</SelectItem>
                    <SelectItem value="half">Half Medicare Levy (1%)</SelectItem>
                    <SelectItem value="exempt">Exempt from Medicare Levy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="hasHELP">HELP/HECS Debt</Label>
              <Select value={hasHELP} onValueChange={setHasHELP}>
                <SelectTrigger>
                  <SelectValue placeholder="Do you have HELP/HECS debt?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no">No HELP/HECS Debt</SelectItem>
                  <SelectItem value="yes">Yes, I have HELP/HECS Debt</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateTax} className="flex-1">
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
                Tax Calculation Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gross Income</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.grossIncome, 'AUD')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Income</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(results.netIncome, 'AUD')}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Tax Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Income Tax:</span>
                    <Badge variant="outline">{formatCurrency(results.incomeTax, 'AUD')}</Badge>
                  </div>
                  {results.medicareLevy > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Medicare Levy:</span>
                      <Badge variant="outline">{formatCurrency(results.medicareLevy, 'AUD')}</Badge>
                    </div>
                  )}
                  {results.helpRepayment > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm">HELP Repayment:</span>
                      <Badge variant="secondary">{formatCurrency(results.helpRepayment, 'AUD')}</Badge>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total Tax:</span>
                    <Badge className="bg-red-600">{formatCurrency(results.totalTax, 'AUD')}</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Tax Rates</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Effective Rate</p>
                    <Badge variant="outline">{results.effectiveTaxRate.toFixed(2)}%</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Marginal Rate</p>
                    <Badge variant="secondary">{results.marginalTaxRate}%</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Take-Home Pay</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Monthly</p>
                    <p className="font-medium text-green-600">{formatCurrency(results.monthlyNet, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fortnightly</p>
                    <p className="font-medium text-green-600">{formatCurrency(results.fortnightlyNet, 'AUD')}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Understanding Australian Income Tax 2025-26
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Australia's income tax system operates on a progressive basis, where higher earners pay a higher 
            percentage of their income in tax. The 2024-25 financial year saw the implementation of Stage 3 tax 
            cuts, which have been continued into 2025-26, providing tax relief across all income brackets while 
            maintaining the progressive nature of the tax system.
          </p>

          <h3>2025-26 Tax Brackets for Residents</h3>
          <p>
            For Australian residents, the tax system includes a tax-free threshold of $18,200, meaning the first 
            $18,200 of income is not taxed. Above this threshold, the following rates apply:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>$18,201 - $45,000: 16% tax rate</li>
            <li>$45,001 - $135,000: 30% tax rate</li>
            <li>$135,001 - $190,000: 37% tax rate</li>
            <li>$190,001 and above: 45% tax rate</li>
          </ul>

          <h3>Medicare Levy</h3>
          <p>
            Most Australian residents pay the Medicare Levy, which is 2% of taxable income. This levy helps 
            fund Australia's public health system. Low-income earners may be eligible for a reduction or 
            exemption from the Medicare Levy. Additionally, high-income earners without private health insurance 
            may be subject to the Medicare Levy Surcharge.
          </p>

          <h3>HELP/HECS Debt Repayment</h3>
          <p>
            If you have a Higher Education Loan Program (HELP) or Higher Education Contribution Scheme (HECS) 
            debt, you must make compulsory repayments once your income exceeds $54,435 (2025-26 threshold). 
            The repayment rate increases progressively with income, ranging from 1% to 10% of your taxable income.
          </p>

          <h3>Foreign Residents</h3>
          <p>
            Foreign residents (non-residents for tax purposes) do not receive the tax-free threshold and pay 
            tax from the first dollar earned in Australia. They are also generally not liable for the Medicare 
            Levy. The tax rates for foreign residents start at 30% for income up to $135,000.
          </p>

          <h3>Stage 3 Tax Cuts Impact</h3>
          <p>
            The Stage 3 tax cuts, which began in 2024-25, have simplified the tax system by reducing the number 
            of tax brackets and lowering rates for middle and higher income earners. The 16% rate for income 
            between $18,201 and $45,000 represents a reduction from the previous 19% rate, while the threshold 
            for the 45% top rate was increased from $180,000 to $190,000.
          </p>

          <h3>Tax Offsets and Deductions</h3>
          <p>
            Various tax offsets and deductions can reduce your taxable income or tax payable. Common deductions 
            include work-related expenses, self-education expenses, donations to charities, and investment 
            property expenses. The Low and Middle Income Tax Offset (LMITO) ended after 2021-22, but the Low 
            Income Tax Offset (LITO) of up to $700 remains available for eligible taxpayers.
          </p>

          <h3>Superannuation Considerations</h3>
          <p>
            Superannuation contributions are generally taxed at 15% within the super fund, which is typically 
            lower than personal income tax rates. Making additional concessional (before-tax) super contributions 
            can be a tax-effective strategy, subject to contribution caps. For 2025-26, the concessional 
            contributions cap is $30,000 per year.
          </p>

          <h3>Planning for Tax Time</h3>
          <p>
            Understanding your tax obligations helps with financial planning throughout the year. Consider 
            keeping records of all tax-deductible expenses, reviewing your salary sacrifice options, and 
            consulting with a registered tax agent for personalized advice. The Australian Tax Office (ATO) 
            provides extensive resources and tools to help taxpayers understand their obligations and maximize 
            legitimate deductions.
          </p>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="mt-8">
            <EnhancedAIAnalysis
              calculatorType="income-tax-australia"
              data={{
                grossIncome: results.grossIncome,
                netIncome: results.netIncome,
                totalTax: results.totalTax,
                effectiveTaxRate: results.effectiveTaxRate,
                marginalTaxRate: results.marginalTaxRate,
                residencyStatus,
                hasMedicare,
                hasHELP
              }}
            />
          </div>
          <div className="mt-8">
            <ExportShareButtons
              calculatorType="income-tax-australia"
              inputs={{
                grossIncome,
                residencyStatus,
                hasMedicare,
                hasHELP
              }}
              results={results}
              title="Australian Income Tax Calculation"
            />
          </div>
        </>
      )}
    </CalculatorLayoutWithAds>
  );
};

export default IncomeTaxCalculatorAustralia;
