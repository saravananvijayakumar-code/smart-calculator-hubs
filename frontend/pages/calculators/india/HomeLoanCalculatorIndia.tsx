import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Home, Info, TrendingUp, DollarSign } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';

const HomeLoanCalculatorIndia: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [downPayment, setDownPayment] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [loanTenure, setLoanTenure] = useState<string>('');
  const [processingFee, setProcessingFee] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('20');
  const [results, setResults] = useState<any>(null);

  const calculateHomeLoan = () => {
    const propValue = parseFloat(propertyValue);
    const downPmt = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100;
    const tenure = parseFloat(loanTenure);
    const procFee = parseFloat(processingFee) || 0;
    const tax = parseFloat(taxRate) / 100;

    if (!propValue || !downPmt || !rate || !tenure) return;

    const loanAmount = propValue - downPmt;
    const monthlyRate = rate / 12;
    const totalMonths = tenure * 12;

    // EMI calculation
    const emi = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    const totalPayment = emi * totalMonths;
    const totalInterest = totalPayment - loanAmount;

    // Tax benefits calculation
    const maxPrincipalDeduction = 150000; // Section 80C
    const maxInterestDeduction = 200000; // Section 24 for self-occupied

    // Calculate year-wise breakdown for first few years
    let remainingPrincipal = loanAmount;
    let yearlyBreakdown = [];
    
    for (let year = 1; year <= Math.min(5, tenure); year++) {
      let yearlyInterest = 0;
      let yearlyPrincipal = 0;
      
      for (let month = 1; month <= 12; month++) {
        const monthlyInterest = remainingPrincipal * monthlyRate;
        const monthlyPrincipal = emi - monthlyInterest;
        
        yearlyInterest += monthlyInterest;
        yearlyPrincipal += monthlyPrincipal;
        remainingPrincipal -= monthlyPrincipal;
      }
      
      const taxBenefit = Math.min(yearlyInterest, maxInterestDeduction) * tax + 
                        Math.min(yearlyPrincipal, maxPrincipalDeduction) * tax;
      
      yearlyBreakdown.push({
        year,
        yearlyInterest,
        yearlyPrincipal,
        taxBenefit,
        remainingBalance: remainingPrincipal
      });
    }

    // Total tax benefits over loan tenure
    const avgAnnualInterest = totalInterest / tenure;
    const avgAnnualPrincipal = loanAmount / tenure;
    const avgTaxBenefit = Math.min(avgAnnualInterest, maxInterestDeduction) * tax + 
                         Math.min(avgAnnualPrincipal, maxPrincipalDeduction) * tax;
    const totalTaxBenefits = avgTaxBenefit * tenure;

    // Affordability ratios
    const ltv = (loanAmount / propValue) * 100;
    
    // Registration and other costs (approximate)
    const stampDuty = propValue * 0.05; // Varies by state, assuming 5%
    const registrationCost = propValue * 0.01;
    const totalUpfrontCosts = downPmt + procFee + stampDuty + registrationCost;

    setResults({
      loanAmount,
      emi,
      totalPayment,
      totalInterest,
      totalTaxBenefits,
      ltv,
      yearlyBreakdown,
      totalUpfrontCosts,
      stampDuty,
      registrationCost,
      effectiveInterestRate: ((totalInterest - totalTaxBenefits) / loanAmount / tenure) * 100,
      netEMI: emi - (avgTaxBenefit / 12)
    });
  };

  const reset = () => {
    setPropertyValue('');
    setDownPayment('');
    setInterestRate('');
    setLoanTenure('');
    setProcessingFee('');
    setTaxRate('20');
    setResults(null);
  };

  const tips = [
    "Home loan interest eligible for deduction up to ₹2 lakh under Section 24(b)",
    "Principal repayment qualifies for ₹1.5 lakh deduction under Section 80C",
    "First-time buyers get additional ₹50,000 deduction under Section 80EE",
    "Affordable housing loans offer ₹1.5 lakh interest deduction under Section 80EEA",
    "Consider prepayment to reduce interest burden significantly"
  ];

  return (
    <CalculatorLayoutWithAds
      title="India Home Loan Calculator"
      description="Calculate home loan EMI, tax benefits, and total costs for property purchase in India"
      keywords="India home loan calculator, home loan EMI, home loan tax benefits, section 24b, section 80C"
      tips={tips}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Home Loan Calculator
            </CardTitle>
            <CardDescription>
              Calculate EMI, tax benefits, and total costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="propertyValue">Property Value (₹)</Label>
              <Input
                id="propertyValue"
                type="number"
                placeholder="Enter property value"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment (₹)</Label>
              <Input
                id="downPayment"
                type="number"
                placeholder="Enter down payment (min 20%)"
                value={downPayment}
                onChange={(e) => setDownPayment(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loanTenure">Tenure (Years)</Label>
                <Input
                  id="loanTenure"
                  type="number"
                  placeholder="Enter tenure"
                  value={loanTenure}
                  onChange={(e) => setLoanTenure(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="processingFee">Processing Fee (₹)</Label>
              <Input
                id="processingFee"
                type="number"
                placeholder="Enter processing fee"
                value={processingFee}
                onChange={(e) => setProcessingFee(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Income Tax Rate (%)</Label>
              <Select value={taxRate} onValueChange={setTaxRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">No Tax (Below ₹2.5L)</SelectItem>
                  <SelectItem value="5">5% (₹2.5L - ₹5L)</SelectItem>
                  <SelectItem value="20">20% (₹5L - ₹10L)</SelectItem>
                  <SelectItem value="30">30% (Above ₹10L)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateHomeLoan} className="flex-1">
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
                Loan Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Loan Amount</p>
                  <p className="text-lg font-semibold">₹{Math.round(results.loanAmount).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly EMI</p>
                  <p className="text-lg font-semibold text-red-600">₹{Math.round(results.emi).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Interest</p>
                  <p className="text-lg font-semibold text-orange-600">₹{Math.round(results.totalInterest).toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Benefits</p>
                  <p className="text-lg font-semibold text-green-600">₹{Math.round(results.totalTaxBenefits).toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">After Tax Benefits</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Effective Interest Rate:</span>
                    <Badge variant="outline">{results.effectiveInterestRate.toFixed(2)}%</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Net EMI (After Tax):</span>
                    <Badge variant="default">₹{Math.round(results.netEMI).toLocaleString('en-IN')}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">LTV Ratio:</span>
                    <Badge variant="secondary">{results.ltv.toFixed(1)}%</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Upfront Costs</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Down Payment:</span>
                    <span>₹{Math.round(parseFloat(downPayment)).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stamp Duty (Est.):</span>
                    <span>₹{Math.round(results.stampDuty).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Registration:</span>
                    <span>₹{Math.round(results.registrationCost).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Upfront:</span>
                    <span>₹{Math.round(results.totalUpfrontCosts).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {results.yearlyBreakdown && results.yearlyBreakdown.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium">First 3 Years Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      {results.yearlyBreakdown.slice(0, 3).map((year: any) => (
                        <div key={year.year} className="grid grid-cols-3 gap-2">
                          <div>
                            <p className="text-muted-foreground">Year {year.year}</p>
                            <p className="font-medium">Interest: ₹{Math.round(year.yearlyInterest).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Principal</p>
                            <p className="font-medium">₹{Math.round(year.yearlyPrincipal).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Tax Benefit</p>
                            <p className="font-medium text-green-600">₹{Math.round(year.taxBenefit).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Understanding Home Loans in India: Tax Benefits and Financial Planning
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Home loans in India represent more than just financing for property purchase; they serve as powerful 
            financial planning tools that combine wealth creation through real estate ownership with significant 
            tax benefits. Understanding the intricate relationship between loan structuring, tax implications, 
            and long-term financial impact is crucial for making informed decisions about one of life's largest 
            financial commitments and most important wealth-building opportunities.
          </p>

          <h3>Home Loan Structure and Interest Calculation</h3>
          <p>
            Indian home loans typically operate on reducing balance method where interest is calculated on the 
            outstanding principal amount, resulting in higher interest components in initial EMIs gradually 
            shifting toward principal repayment in later years. Interest rates vary based on credit profiles, 
            loan amounts, and market conditions, with options including fixed rates for certainty or floating 
            rates for potential savings during declining rate cycles. Understanding this structure helps borrowers 
            optimize their loan terms and prepayment strategies.
          </p>

          <h3>Tax Benefits: Section 80C and Section 24</h3>
          <p>
            Home loans offer dual tax benefits through Section 80C deductions for principal repayment up to 
            ₹1.5 lakh annually and Section 24 deductions for interest payments up to ₹2 lakh for self-occupied 
            properties. These deductions can result in substantial tax savings, effectively reducing the cost 
            of borrowing and enhancing the affordability of home ownership. For rental properties, the entire 
            interest amount is deductible against rental income, making investment properties more tax-efficient.
          </p>

          <h3>Down Payment and LTV Considerations</h3>
          <p>
            Reserve Bank of India regulations mandate minimum 20% down payment for home loans, creating a maximum 
            loan-to-value ratio of 80%. Higher down payments reduce EMI burden, total interest outflow, and 
            qualification requirements while potentially securing better interest rates. Strategic down payment 
            planning involves balancing immediate cash flow requirements with long-term interest savings, considering 
            opportunity costs of deploying large amounts as down payment versus alternative investments.
          </p>

          <h3>EMI Affordability and Debt Service Ratios</h3>
          <p>
            Lenders typically limit EMI obligations to 40-50% of net monthly income, ensuring sustainable debt 
            service without compromising lifestyle quality. This ratio includes all existing loan obligations, 
            making it crucial to consider overall debt portfolio when planning home loan amounts. Conservative 
            borrowers often target lower ratios to maintain financial flexibility for other goals and emergency 
            situations, while aggressive borrowers might maximize leverage to acquire larger properties.
          </p>

          <h3>Prepayment Strategies and Interest Savings</h3>
          <p>
            Strategic prepayments can dramatically reduce total interest outflow and loan tenure, with even modest 
            additional payments creating substantial savings over time. Prepayment decisions should consider tax 
            benefits foregone, opportunity costs of alternative investments, and personal financial goals. Some 
            borrowers use annual bonuses, tax refunds, or windfalls for prepayments, while others increase EMIs 
            gradually as income grows, balancing debt reduction with wealth creation opportunities.
          </p>

          <h3>Property Registration and Associated Costs</h3>
          <p>
            Home purchases involve significant additional costs beyond the property price, including stamp duty 
            varying by state (typically 3-8% of property value), registration charges, legal fees, and processing 
            charges. These costs require substantial upfront capital and should be factored into total investment 
            calculations. Some states offer stamp duty concessions for women buyers or first-time homebuyers, 
            providing additional savings opportunities for eligible purchasers.
          </p>

          <h3>Fixed vs. Floating Interest Rate Decision</h3>
          <p>
            Choosing between fixed and floating interest rates involves balancing interest rate risk with potential 
            savings. Fixed rates provide EMI certainty throughout the loan tenure, facilitating budget planning 
            but potentially missing benefits from declining rate cycles. Floating rates offer potential savings 
            when rates decline but expose borrowers to payment increases during rising rate periods. Many borrowers 
            opt for floating rates with prepayment flexibility to manage rate risk actively.
          </p>

          <h3>Home Loan Insurance and Protection</h3>
          <p>
            Comprehensive protection through term life insurance and home insurance safeguards against financial 
            disruption from unforeseen events. Term insurance should cover outstanding loan amounts ensuring family 
            members aren't burdened with debt obligations. Home insurance protects the property investment while 
            some lenders mandate coverage as loan conditions. Credit protection insurance, though expensive, provides 
            EMI payment support during unemployment or disability, though term insurance often offers better value.
          </p>

          <h3>Refinancing and Balance Transfer Opportunities</h3>
          <p>
            Changing market conditions and improved credit profiles create opportunities for refinancing at better 
            rates or terms. Home loan balance transfers can reduce interest costs, extend tenures, or access 
            additional funding for renovations or other needs. However, switching costs including processing fees, 
            legal charges, and prepayment penalties must be weighed against potential savings to ensure financial 
            benefit from refinancing decisions.
          </p>

          <h3>Long-term Wealth Building Through Real Estate</h3>
          <p>
            Beyond providing shelter, home ownership creates forced savings through EMI payments while building 
            equity in appreciating real estate. Property appreciation combined with loan amortization gradually 
            increases net worth, providing financial security and potential borrowing capacity for future needs. 
            Strategic property selection in growth areas can enhance appreciation potential, making home loans 
            effective wealth creation tools when combined with disciplined repayment and sound property choices.
          </p>
        </CardContent>
      </Card>

      {results && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="home-loan-india"
            inputs={{
              propertyValue,
              downPayment,
              interestRate,
              loanTenure,
              processingFee,
              taxRate
            }}
            results={results}
            title="Home Loan Analysis"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
};

export default HomeLoanCalculatorIndia;