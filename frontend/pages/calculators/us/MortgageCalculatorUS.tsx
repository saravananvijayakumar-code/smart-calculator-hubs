import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Home, Info, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import { RelatedCalculators } from '../../../components/RelatedCalculators';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useCalculatorHistory } from '../../../hooks/useCalculatorHistory';
import { useToast } from '@/components/ui/use-toast';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface MortgageResult {
  monthlyPayment: number;
  principalAndInterest: number;
  pmi: number;
  propertyTax: number;
  homeInsurance: number;
  totalMonthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  totalPmiPaid: number;
}

export function MortgageCalculatorUS() {
  const { saveCalculation } = useCalculatorHistory();
  const { toast } = useToast();
  
  const [loanAmount, setLoanAmount] = useState('');
  const [homeValue, setHomeValue] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [propertyTaxRate, setPropertyTaxRate] = useState('1.2');
  const [homeInsuranceRate, setHomeInsuranceRate] = useState('0.5');
  const [pmiRate, setPmiRate] = useState('0.5');
  const [includePmi, setIncludePmi] = useState(true);
  const [includePropertyTax, setIncludePropertyTax] = useState(true);
  const [includeHomeInsurance, setIncludeHomeInsurance] = useState(true);
  const [result, setResult] = useState<MortgageResult | null>(null);

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const years = parseInt(loanTerm);
    const homeVal = parseFloat(homeValue) || principal;
    const downPmt = parseFloat(downPayment) || 0;

    if (!principal || !annualRate || !years || principal <= 0 || annualRate <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    const monthlyRate = annualRate / 12;
    const totalPayments = years * 12;

    // Calculate monthly principal and interest
    let monthlyPI: number;
    if (monthlyRate === 0) {
      monthlyPI = principal / totalPayments;
    } else {
      monthlyPI = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                              (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }

    // Calculate PMI (if down payment < 20%)
    const downPaymentPercent = (downPmt / homeVal) * 100;
    let monthlyPmi = 0;
    let totalPmiPaid = 0;
    
    if (includePmi && downPaymentPercent < 20) {
      monthlyPmi = (principal * (parseFloat(pmiRate) / 100)) / 12;
      
      // More accurate PMI removal calculation based on loan balance reaching 78% of original home value
      // Calculate when loan balance reaches 78% of original home value
      const targetBalance = homeVal * 0.78;
      let balance = principal;
      let monthsUntilPmiRemoval = totalPayments;
      
      for (let month = 1; month <= totalPayments; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPI - interestPayment;
        balance -= principalPayment;
        
        if (balance <= targetBalance) {
          monthsUntilPmiRemoval = month;
          break;
        }
      }
      
      totalPmiPaid = monthlyPmi * Math.min(monthsUntilPmiRemoval, totalPayments);
    }

    // Calculate property tax
    const monthlyPropertyTax = includePropertyTax ? 
      (homeVal * (parseFloat(propertyTaxRate) / 100)) / 12 : 0;

    // Calculate home insurance
    const monthlyInsurance = includeHomeInsurance ? 
      (homeVal * (parseFloat(homeInsuranceRate) / 100)) / 12 : 0;

    const totalAmount = monthlyPI * totalPayments;
    const totalInterest = totalAmount - principal;
    const totalMonthlyPayment = monthlyPI + monthlyPmi + monthlyPropertyTax + monthlyInsurance;

    setResult({
      monthlyPayment: monthlyPI,
      principalAndInterest: monthlyPI,
      pmi: monthlyPmi,
      propertyTax: monthlyPropertyTax,
      homeInsurance: monthlyInsurance,
      totalMonthlyPayment,
      totalInterest,
      totalAmount,
      totalPmiPaid
    });
  };

  // Update loan amount when home value and down payment change
  useEffect(() => {
    const homeVal = parseFloat(homeValue);
    const downPmt = parseFloat(downPayment);
    if (homeVal && downPmt >= 0) {
      setLoanAmount((homeVal - downPmt).toString());
    }
  }, [homeValue, downPayment]);

  const handleSaveCalculation = () => {
    if (!result) {
      toast({
        title: 'No calculation to save',
        description: 'Please complete the form to generate results first.',
        variant: 'destructive',
      });
      return;
    }

    saveCalculation({
      calculatorType: 'mortgage-us',
      calculatorName: 'US Mortgage Calculator',
      inputs: {
        loanAmount: parseFloat(loanAmount),
        homeValue: parseFloat(homeValue),
        downPayment: parseFloat(downPayment),
        interestRate: parseFloat(interestRate),
        loanTerm: parseInt(loanTerm),
        propertyTaxRate: parseFloat(propertyTaxRate),
        homeInsuranceRate: parseFloat(homeInsuranceRate),
        pmiRate: parseFloat(pmiRate),
      },
      results: {
        monthlyPayment: result.monthlyPayment,
        totalMonthlyPayment: result.totalMonthlyPayment,
        totalInterest: result.totalInterest,
        totalAmount: result.totalAmount,
        totalPmiPaid: result.totalPmiPaid,
      },
    });

    toast({
      title: 'Calculation saved!',
      description: 'View it in your calculation history.',
    });
  };

  // Realtime calculation whenever inputs change
  useEffect(() => {
    calculateMortgage();
  }, [loanAmount, interestRate, loanTerm, homeValue, downPayment, propertyTaxRate, 
      homeInsuranceRate, pmiRate, includePmi, includePropertyTax, includeHomeInsurance]);

  return (
    <CalculatorLayoutWithAds
      title="US Mortgage Calculator with PMI & Property Tax | Complete Home Loan Calculator"
      description="Comprehensive US mortgage calculator with PMI, property taxes, and insurance. Calculate total monthly payments, interest costs, and affordability for your home purchase."
      keywords="US mortgage calculator, PMI calculator, property tax calculator, home loan calculator, mortgage payment calculator, total monthly payment, home affordability"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Complete Mortgage Calculator</span>
            </CardTitle>
            <CardDescription>
              Calculate your total monthly housing payment including PMI, property taxes, and insurance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="homeValue">Home Value (USD)</Label>
                <Input
                  id="homeValue"
                  type="number"
                  placeholder="450000"
                  value={homeValue}
                  onChange={(e) => setHomeValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="downPayment">Down Payment (USD)</Label>
                <Input
                  id="downPayment"
                  type="number"
                  placeholder="50000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (USD)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="400000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (% APR)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="7.0"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term</Label>
                <Select value={loanTerm} onValueChange={setLoanTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyTaxRate">Property Tax Rate (%)</Label>
                <Input
                  id="propertyTaxRate"
                  type="number"
                  step="0.1"
                  placeholder="1.2"
                  value={propertyTaxRate}
                  onChange={(e) => setPropertyTaxRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeInsuranceRate">Home Insurance Rate (%)</Label>
                <Input
                  id="homeInsuranceRate"
                  type="number"
                  step="0.1"
                  placeholder="0.5"
                  value={homeInsuranceRate}
                  onChange={(e) => setHomeInsuranceRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pmiRate">PMI Rate (%)</Label>
                <Input
                  id="pmiRate"
                  type="number"
                  step="0.1"
                  placeholder="0.5"
                  value={pmiRate}
                  onChange={(e) => setPmiRate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includePmi" 
                  checked={includePmi}
                  onCheckedChange={(checked) => setIncludePmi(checked === true)}
                />
                <Label htmlFor="includePmi" className="text-sm">Include PMI</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includePropertyTax" 
                  checked={includePropertyTax}
                  onCheckedChange={(checked) => setIncludePropertyTax(checked === true)}
                />
                <Label htmlFor="includePropertyTax" className="text-sm">Include Property Tax</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeHomeInsurance" 
                  checked={includeHomeInsurance}
                  onCheckedChange={(checked) => setIncludeHomeInsurance(checked === true)}
                />
                <Label htmlFor="includeHomeInsurance" className="text-sm">Include Home Insurance</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button onClick={handleSaveCalculation} variant="outline" className="gap-2">
                <Save className="w-4 h-4" />
                Save to History
              </Button>
            </div>

            {/* AI Analysis */}
            <AIAnalysis
              analysisRequest={{
                calculatorType: "mortgage-us",
                data: {
                  loanAmount: parseFloat(loanAmount) || 0,
                  interestRate: parseFloat(interestRate) || 0,
                  loanTerm: parseInt(loanTerm) || 30,
                  downPayment: parseFloat(downPayment) || 0,
                  propertyValue: parseFloat(homeValue) || parseFloat(loanAmount) || 0,
                  monthlyPayment: result.principalAndInterest,
                  totalInterest: result.totalInterest,
                  totalPayment: result.totalAmount,
                  pmi: result.pmi,
                  propertyTax: result.propertyTax,
                  insurance: result.homeInsurance
                }
              }}
              autoRun={true}
              title="AI Mortgage Analysis"
              description="Get personalized recommendations for your mortgage strategy, including optimization opportunities and risk factors."
            />

            {/* Total Monthly Payment */}
            <Card className="border-2 border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-bold text-green-800">
                  Total Monthly Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  ${result.totalMonthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Including all selected components
                </p>
              </CardContent>
            </Card>

            {/* Payment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Principal & Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${result.principalAndInterest.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                  </div>
                </CardContent>
              </Card>

              {includePmi && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      PMI
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      ${result.pmi.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Until 20% equity
                    </p>
                  </CardContent>
                </Card>
              )}

              {includePropertyTax && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Property Tax
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      ${result.propertyTax.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {includeHomeInsurance && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Home Insurance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      ${result.homeInsurance.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Loan Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Interest Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    ${result.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Over life of loan
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Amount Paid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${result.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Principal + Interest only
                  </p>
                </CardContent>
              </Card>

              {includePmi && result.totalPmiPaid > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Total PMI Paid
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      ${result.totalPmiPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Until PMI removal
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* AI Analysis */}
            <EnhancedAIAnalysis
              calculatorType="mortgage-us"
              data={{
                loanAmount: parseFloat(loanAmount) || 0,
                interestRate: parseFloat(interestRate) || 0,
                loanTerm: parseInt(loanTerm) || 0,
                downPayment: parseFloat(downPayment) || 0,
                propertyValue: parseFloat(homeValue) || parseFloat(loanAmount) || 0,
                monthlyPayment: result?.principalAndInterest || 0,
                totalInterest: result?.totalInterest || 0,
                totalPayment: result?.totalAmount || 0,
                pmi: result?.pmi || 0,
                propertyTax: result?.propertyTax || 0,
                insurance: result?.homeInsurance || 0
              }}
              className="mt-8"
            />

            {/* Export/Share Buttons */}
            <ExportShareButtons
              calculatorType="mortgage-us"
              inputs={{
                loanAmount: parseFloat(loanAmount) || 0,
                homeValue: parseFloat(homeValue) || 0,
                downPayment: parseFloat(downPayment) || 0,
                interestRate: parseFloat(interestRate) || 0,
                loanTerm: parseInt(loanTerm) || 0,
                propertyTaxRate: parseFloat(propertyTaxRate) || 0,
                homeInsuranceRate: parseFloat(homeInsuranceRate) || 0,
                pmiRate: parseFloat(pmiRate) || 0,
                includePmi,
                includePropertyTax,
                includeHomeInsurance
              }}
              results={result || {}}
              title="US Mortgage Calculation"
              className="mt-6"
            />
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to US Mortgage Calculations</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-4">
                <p>
                  Understanding your complete monthly housing payment is crucial for effective budgeting and home affordability planning. 
                  This comprehensive mortgage calculator includes all major components: principal, interest, PMI, property taxes, and homeowners insurance - 
                  often referred to as PITI+PMI in the mortgage industry.
                </p>
                
                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Components of Your Total Payment:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Principal & Interest:</strong> Your base mortgage payment calculated using the loan amount, interest rate, and term</li>
                  <li><strong>PMI (Private Mortgage Insurance):</strong> Required when down payment is less than 20% of home value</li>
                  <li><strong>Property Taxes:</strong> Annual taxes paid to local government, typically 0.5-2.5% of home value</li>
                  <li><strong>Homeowners Insurance:</strong> Protects your investment, typically 0.3-1.5% of home value annually</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Understanding PMI in Detail:</h4>
                <p>
                  Private Mortgage Insurance (PMI) is an additional monthly cost for conventional loans with down payments less than 20%. 
                  PMI rates typically range from 0.3% to 1.5% of the loan amount annually, depending on your credit score, loan-to-value ratio, 
                  and loan type. The good news is PMI can be removed once you reach 20% equity in your home through payments or appreciation.
                </p>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Property Tax Considerations:</h4>
                <p>
                  Property taxes vary significantly by location and are based on your local tax rate and assessed home value. 
                  High-tax states like New Jersey and New Hampshire may have rates exceeding 2%, while states like Hawaii 
                  and Alabama typically have rates below 1%. These taxes fund local services like schools, roads, and emergency services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Strategies for US Homebuyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Reduce PMI Costs:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Save for a 20% down payment</li>
                      <li>Consider piggyback loans (80/10/10)</li>
                      <li>Look into lender-paid PMI options</li>
                      <li>Monitor home value for early PMI removal</li>
                      <li>Make extra principal payments to reach 20% equity faster</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Optimize Your Mortgage:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Shop multiple lenders for best rates</li>
                      <li>Improve credit score before applying</li>
                      <li>Consider different loan terms (15 vs 30 years)</li>
                      <li>Understand points vs. no-points options</li>
                      <li>Factor in closing costs and fees</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Regional Considerations:</h4>
                <p>
                  Housing costs vary dramatically across the United States. High-cost areas like California, New York, and Massachusetts 
                  often have higher property values, insurance costs, and property taxes. Conversely, states like Texas, Tennessee, 
                  and Florida may offer lower overall housing costs but with varying tax structures. Research local market conditions 
                  and cost factors specific to your target area.
                </p>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">First-Time Buyer Programs:</h4>
                <p>
                  Many states and localities offer first-time homebuyer programs with benefits like down payment assistance, 
                  reduced interest rates, or PMI alternatives. FHA loans require only 3.5% down, VA loans offer 0% down for 
                  eligible veterans, and USDA loans provide 0% down options for rural properties. Research available programs 
                  in your area to maximize your purchasing power.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Affordability Guidelines and Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3">The 28/36 Rule:</h4>
                <p>
                  Most lenders follow the 28/36 rule: your total housing payment (PITI+PMI) should not exceed 28% of your gross monthly income, 
                  and your total debt payments should not exceed 36% of gross monthly income. However, some loan programs allow higher ratios 
                  with compensating factors like high credit scores or significant assets.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Example Affordability Calculation:</h4>
                  <ul className="space-y-1">
                    <li>• Gross Monthly Income: $8,000</li>
                    <li>• Maximum Housing Payment (28%): $2,240</li>
                    <li>• Maximum Total Debt (36%): $2,880</li>
                    <li>• Available for Other Debts: $640</li>
                  </ul>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Beyond the Calculator:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Emergency Fund:</strong> Maintain 3-6 months of expenses for homeownership emergencies</li>
                  <li><strong>Maintenance Costs:</strong> Budget 1-3% of home value annually for repairs and maintenance</li>
                  <li><strong>Utilities:</strong> Factor in electricity, gas, water, internet, and other monthly services</li>
                  <li><strong>HOA Fees:</strong> If applicable, homeowners association fees can range from $50-500+ monthly</li>
                  <li><strong>Moving Costs:</strong> Budget for professional movers, deposits, and immediate home needs</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Long-term Financial Planning:</h4>
                <p>
                  Consider your mortgage within your broader financial picture. Factor in retirement savings goals, children's education costs, 
                  and career trajectory. A more conservative approach might target 25% or less of income for housing, allowing more flexibility 
                  for other financial goals and unexpected life changes.
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
                    <h4 className="font-semibold text-gray-800 mb-2">How accurate is this mortgage calculator?</h4>
                    <p>Our calculator provides comprehensive estimates including PMI, property taxes, and insurance. However, actual payments may vary based on lender-specific fees, exact tax rates, insurance quotes, and loan terms. Use this as a starting point and get pre-qualified with lenders for precise figures.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">When can I remove PMI from my mortgage?</h4>
                    <p>PMI can typically be removed when you reach 20% equity in your home. You can request removal at 20% equity or it's automatically removed at 22% equity. Equity builds through monthly payments and home value appreciation. Some loans have different PMI removal rules.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How do property taxes affect my mortgage payment?</h4>
                    <p>Most lenders require property taxes to be escrowed with your mortgage payment. The lender collects 1/12th of annual taxes monthly and pays them when due. Tax rates vary by location and can change annually based on local assessments and budget needs.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I put down 20% to avoid PMI?</h4>
                    <p>While 20% down eliminates PMI, it's not always the best choice. Consider opportunity costs of tying up cash, current interest rates, PMI costs, and your overall financial situation. Sometimes keeping cash for investments or emergencies while paying PMI temporarily makes sense.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What's included in escrow besides property taxes?</h4>
                    <p>Escrow typically includes property taxes and homeowners insurance. Some areas may also escrow flood insurance, special assessments, or HOA fees. Your lender analyzes these annually and adjusts your payment if escrow balances are too high or low.</p>
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
              <p>• This calculator provides estimates only and should not be relied upon for final financial decisions.</p>
              <p>• Actual payments will vary based on lender fees, exact tax rates, insurance costs, and specific loan terms.</p>
              <p>• PMI rates and removal criteria vary by lender and loan type - confirm details with your lender.</p>
              <p>• Property tax rates are estimates - check with local tax authorities for exact rates.</p>
              <p>• Insurance costs vary by location, home features, and coverage levels - get actual quotes.</p>
              <p>• Interest rates change daily and vary based on credit score, down payment, and other factors.</p>
              <p>• Consider additional costs like HOA fees, utilities, maintenance, and closing costs.</p>
              <p>• Consult with qualified mortgage professionals and financial advisors for personalized guidance.</p>
              <p>• This calculator is designed for US conventional mortgage loans and may not apply to all loan types.</p>
            </div>
          </CardContent>
        </Card>

        {/* Related Calculators */}
        <RelatedCalculators currentCalculatorId="mortgage" />
      </div>
    </CalculatorLayoutWithAds>
  );
}