import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, Home, Info, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface AffordabilityResult {
  maxLoanAmount: number;
  maxHomePrice: number;
  monthlyPayment: number;
  monthlyHousingPayment: number;
  debtToIncomeRatio: number;
  housingToIncomeRatio: number;
  frontEndRatio: number;
  backEndRatio: number;
  remainingMonthlyIncome: number;
  downPaymentNeeded: number;
  qualificationStatus: 'excellent' | 'good' | 'marginal' | 'poor';
  recommendations: string[];
}

export function LoanAffordabilityCalculatorUS() {
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');
  const [creditScore, setCreditScore] = useState('740');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [interestRate, setInterestRate] = useState('7.0');
  const [loanTerm, setLoanTerm] = useState('30');
  const [propertyTaxRate, setPropertyTaxRate] = useState('1.2');
  const [homeInsuranceRate, setHomeInsuranceRate] = useState('0.5');
  const [hoaFees, setHoaFees] = useState('');
  const [includePmi, setIncludePmi] = useState(true);
  const [pmiRate, setPmiRate] = useState('0.5');
  const [useConservativeRatio, setUseConservativeRatio] = useState(false);
  const [result, setResult] = useState<AffordabilityResult | null>(null);

  const calculateAffordability = () => {
    const income = parseFloat(monthlyIncome);
    const debts = parseFloat(monthlyDebts) || 0;
    const creditScoreNum = parseInt(creditScore);
    const rate = parseFloat(interestRate) / 100 / 12;
    const payments = parseInt(loanTerm) * 12;
    const downPayment = parseFloat(downPaymentPercent) / 100;
    const propTaxRate = parseFloat(propertyTaxRate) / 100 / 12;
    const insuranceRate = parseFloat(homeInsuranceRate) / 100 / 12;
    const hoa = parseFloat(hoaFees) || 0;

    if (!income || income <= 0) {
      setResult(null);
      return;
    }

    // Determine DTI limits based on credit score and loan type
    let maxBackEndRatio = 0.36; // Standard conventional loan
    let maxFrontEndRatio = 0.28;

    if (creditScoreNum >= 740) {
      maxBackEndRatio = 0.43; // QM limit for excellent credit
      maxFrontEndRatio = 0.31;
    } else if (creditScoreNum >= 680) {
      maxBackEndRatio = 0.40;
      maxFrontEndRatio = 0.30;
    } else if (creditScoreNum >= 620) {
      maxBackEndRatio = 0.37;
      maxFrontEndRatio = 0.29;
    } else {
      maxBackEndRatio = 0.35; // Harder to qualify
      maxFrontEndRatio = 0.27;
    }

    if (useConservativeRatio) {
      maxBackEndRatio = Math.min(maxBackEndRatio, 0.36);
      maxFrontEndRatio = Math.min(maxFrontEndRatio, 0.28);
    }

    // Calculate maximum monthly housing payment
    const maxTotalDebt = income * maxBackEndRatio;
    const maxHousingPayment = Math.min(
      income * maxFrontEndRatio,
      maxTotalDebt - debts
    );

    // Calculate what portion is available for principal and interest
    let maxPIPayment = maxHousingPayment - hoa;

    // Use iterative approach to find maximum loan amount considering all costs
    let maxLoanAmount = 0;
    let homePrice = 0;
    let monthlyPI = 0;

    if (rate > 0 && maxPIPayment > 0) {
      // Start with an estimate
      let testLoan = maxPIPayment / rate * (1 - Math.pow(1 + rate, -payments));
      
      for (let i = 0; i < 10; i++) { // Iterate to find accurate amount
        homePrice = testLoan / (1 - downPayment);
        
        // Calculate property tax and insurance
        const monthlyPropTax = homePrice * propTaxRate;
        const monthlyInsurance = homePrice * insuranceRate;
        
        // Calculate PMI if applicable
        let monthlyPmi = 0;
        if (includePmi && downPayment < 0.20) {
          monthlyPmi = testLoan * (parseFloat(pmiRate) / 100) / 12;
        }
        
        // Total housing costs minus PI
        const otherHousingCosts = monthlyPropTax + monthlyInsurance + monthlyPmi + hoa;
        
        // Available for PI
        const availableForPI = maxHousingPayment - otherHousingCosts;
        
        if (availableForPI <= 0) {
          testLoan = 0;
          break;
        }
        
        // Calculate what loan amount this PI payment supports
        const supportedLoan = availableForPI / rate * (1 - Math.pow(1 + rate, -payments));
        
        // Check if we're close enough
        if (Math.abs(supportedLoan - testLoan) < 100) {
          testLoan = supportedLoan;
          break;
        }
        
        testLoan = supportedLoan;
      }
      
      maxLoanAmount = Math.max(0, testLoan);
      homePrice = maxLoanAmount / (1 - downPayment);
      monthlyPI = maxLoanAmount * rate / (1 - Math.pow(1 + rate, -payments));
    }

    // Calculate final payment details
    const monthlyPropTax = homePrice * propTaxRate;
    const monthlyInsurance = homePrice * insuranceRate;
    let monthlyPmi = 0;
    if (includePmi && downPayment < 0.20) {
      monthlyPmi = maxLoanAmount * (parseFloat(pmiRate) / 100) / 12;
    }

    const totalMonthlyHousing = monthlyPI + monthlyPropTax + monthlyInsurance + monthlyPmi + hoa;
    const totalMonthlyDebts = totalMonthlyHousing + debts;

    // Calculate ratios
    const frontEndRatio = (totalMonthlyHousing / income) * 100;
    const backEndRatio = (totalMonthlyDebts / income) * 100;
    const remainingIncome = income - totalMonthlyDebts;
    const downPaymentNeeded = homePrice * downPayment;

    // Determine qualification status
    let qualificationStatus: 'excellent' | 'good' | 'marginal' | 'poor' = 'poor';
    if (backEndRatio <= 30 && frontEndRatio <= 25) {
      qualificationStatus = 'excellent';
    } else if (backEndRatio <= 36 && frontEndRatio <= 28) {
      qualificationStatus = 'good';
    } else if (backEndRatio <= 43 && frontEndRatio <= 31) {
      qualificationStatus = 'marginal';
    }

    // Generate recommendations
    const recommendations: string[] = [];
    if (backEndRatio > 36) {
      recommendations.push('Consider paying down existing debts to improve your debt-to-income ratio');
    }
    if (frontEndRatio > 28) {
      recommendations.push('Look for homes in a lower price range or increase your down payment');
    }
    if (creditScoreNum < 740) {
      recommendations.push('Improve your credit score to qualify for better rates and higher loan amounts');
    }
    if (downPayment < 0.20) {
      recommendations.push('Consider saving for a 20% down payment to eliminate PMI');
    }
    if (remainingIncome < income * 0.2) {
      recommendations.push('Ensure you have enough remaining income for emergencies and other expenses');
    }

    setResult({
      maxLoanAmount,
      maxHomePrice: homePrice,
      monthlyPayment: monthlyPI,
      monthlyHousingPayment: totalMonthlyHousing,
      debtToIncomeRatio: backEndRatio,
      housingToIncomeRatio: frontEndRatio,
      frontEndRatio,
      backEndRatio,
      remainingMonthlyIncome: remainingIncome,
      downPaymentNeeded,
      qualificationStatus,
      recommendations
    });
  };

  useEffect(() => {
    calculateAffordability();
  }, [monthlyIncome, monthlyDebts, creditScore, downPaymentPercent, interestRate, 
      loanTerm, propertyTaxRate, homeInsuranceRate, hoaFees, includePmi, pmiRate, useConservativeRatio]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'marginal': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <CalculatorLayoutWithAds
      title="Loan Affordability Calculator USA | How Much House Can I Afford? | Smart Calculator Hubs"
      description="Calculate how much house you can afford with our comprehensive loan affordability calculator. Includes DTI ratios, PMI, taxes, and personalized recommendations."
      keywords="loan affordability calculator, house affordability, how much house can I afford, DTI calculator, mortgage pre-qualification, home loan calculator USA"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Home className="h-5 w-5" />
              <span>Income & Debt Information</span>
            </CardTitle>
            <CardDescription>
              Enter your financial details to calculate your maximum loan affordability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyIncome">Gross Monthly Income (USD)</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="6000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Before taxes and deductions
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthlyDebts">Monthly Debt Payments (USD)</Label>
                  <Input
                    id="monthlyDebts"
                    type="number"
                    placeholder="500"
                    value={monthlyDebts}
                    onChange={(e) => setMonthlyDebts(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Credit cards, auto loans, student loans, etc.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditScore">Credit Score</Label>
                  <Select value={creditScore} onValueChange={setCreditScore}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select score range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="800">800+ (Excellent)</SelectItem>
                      <SelectItem value="760">760-799 (Very Good)</SelectItem>
                      <SelectItem value="740">740-759 (Good)</SelectItem>
                      <SelectItem value="700">700-739 (Good)</SelectItem>
                      <SelectItem value="660">660-699 (Fair)</SelectItem>
                      <SelectItem value="620">620-659 (Fair)</SelectItem>
                      <SelectItem value="580">580-619 (Poor)</SelectItem>
                      <SelectItem value="500">Below 580 (Poor)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="downPaymentPercent">Down Payment (%)</Label>
                  <Input
                    id="downPaymentPercent"
                    type="number"
                    placeholder="20"
                    min="3"
                    max="50"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (% APR)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
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
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="20">20 years</SelectItem>
                      <SelectItem value="25">25 years</SelectItem>
                      <SelectItem value="30">30 years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
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
                  <Label htmlFor="hoaFees">Monthly HOA Fees (USD)</Label>
                  <Input
                    id="hoaFees"
                    type="number"
                    placeholder="0"
                    value={hoaFees}
                    onChange={(e) => setHoaFees(e.target.value)}
                  />
                </div>
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
              
              {includePmi && (
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
              )}

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="useConservativeRatio" 
                  checked={useConservativeRatio}
                  onCheckedChange={(checked) => setUseConservativeRatio(checked === true)}
                />
                <Label htmlFor="useConservativeRatio" className="text-sm">Use Conservative DTI Ratios</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Qualification Status */}
            <Card className={`border-2 ${getStatusColor(result.qualificationStatus)}`}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Loan Qualification Status: {result.qualificationStatus.charAt(0).toUpperCase() + result.qualificationStatus.slice(1)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-3xl font-bold">
                      ${result.maxHomePrice.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-sm mt-1">Maximum home price</p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      ${result.maxLoanAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </div>
                    <p className="text-sm mt-1">Maximum loan amount</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Monthly Housing Payment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${result.monthlyHousingPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    PITI + PMI + HOA
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Principal & Interest
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${result.monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Loan payment only
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Down Payment Needed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    ${result.downPaymentNeeded.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {downPaymentPercent}% of home price
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Remaining Income
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    ${result.remainingMonthlyIncome.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    After all payments
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* DTI Ratios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Debt-to-Income Ratios</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Front-end Ratio (Housing):</span>
                      <span className={`font-bold ${result.frontEndRatio <= 28 ? 'text-green-600' : result.frontEndRatio <= 31 ? 'text-orange-600' : 'text-red-600'}`}>
                        {result.frontEndRatio.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${result.frontEndRatio <= 28 ? 'bg-green-500' : result.frontEndRatio <= 31 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(result.frontEndRatio, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: ≤28%</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Back-end Ratio (Total Debt):</span>
                      <span className={`font-bold ${result.backEndRatio <= 36 ? 'text-green-600' : result.backEndRatio <= 43 ? 'text-orange-600' : 'text-red-600'}`}>
                        {result.backEndRatio.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${result.backEndRatio <= 36 ? 'bg-green-500' : result.backEndRatio <= 43 ? 'bg-orange-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(result.backEndRatio, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground">Recommended: ≤36%</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  {result.recommendations.length > 0 ? (
                    <ul className="space-y-2">
                      {result.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-600">
                      ✓ Your financial profile looks excellent for home buying! You have strong ratios and good affordability.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Understanding Loan Affordability in the USA</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-4">
                <p>
                  Determining how much house you can afford is one of the most important financial decisions you'll make. 
                  Lenders use specific ratios and criteria to evaluate your ability to repay a mortgage, but understanding 
                  these requirements helps you make informed decisions about your home purchase budget.
                </p>
                
                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Key Affordability Factors:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Debt-to-Income Ratio (DTI):</strong> The percentage of your monthly income that goes to debt payments</li>
                  <li><strong>Credit Score:</strong> Higher scores qualify for better rates and higher DTI ratios</li>
                  <li><strong>Down Payment:</strong> Larger down payments reduce loan amounts and may eliminate PMI</li>
                  <li><strong>Employment History:</strong> Stable employment for 2+ years preferred by lenders</li>
                  <li><strong>Cash Reserves:</strong> Money left over after down payment and closing costs</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">The 28/36 Rule:</h4>
                <p>
                  Traditional lending guidelines suggest your housing payment shouldn't exceed 28% of gross monthly income 
                  (front-end ratio), and total debt payments shouldn't exceed 36% (back-end ratio). However, many modern 
                  loan programs allow higher ratios with compensating factors like excellent credit or significant assets.
                </p>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Beyond Basic Ratios:</h4>
                <p>
                  While DTI ratios are important, they don't tell the whole story. Consider your lifestyle, career stability, 
                  future financial goals, and comfort level with debt. A conservative approach might target 25% for housing 
                  and 30% for total debt, leaving more room for emergencies and other financial priorities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Maximizing Your Home Buying Power</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Improve Your Credit Score:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Pay all bills on time consistently</li>
                      <li>Pay down credit card balances below 30% utilization</li>
                      <li>Don't close old credit accounts</li>
                      <li>Check credit reports for errors and dispute them</li>
                      <li>Avoid new credit applications before buying</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Reduce Debt-to-Income Ratio:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Pay off credit cards and personal loans</li>
                      <li>Avoid taking on new debt</li>
                      <li>Consider debt consolidation if beneficial</li>
                      <li>Increase income through raises or side work</li>
                      <li>Pay down student loan balances</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Down Payment Strategies:</h4>
                <p>
                  While 20% down is ideal to avoid PMI, many programs offer lower down payment options. FHA loans require 
                  only 3.5% down, VA loans offer 0% down for veterans, and conventional loans may accept as little as 3% 
                  down. Consider the trade-offs between lower down payments (higher monthly costs) versus saving longer for 
                  a larger down payment.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Down Payment Options:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Conventional: 3-5% minimum</li>
                    <li>• FHA: 3.5% minimum</li>
                    <li>• VA: 0% for eligible veterans</li>
                    <li>• USDA: 0% for rural properties</li>
                    <li>• Jumbo: Often 10-20% minimum</li>
                  </ul>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Additional Costs to Budget For:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Closing Costs:</strong> Typically 2-5% of loan amount</li>
                  <li><strong>Moving Expenses:</strong> Professional movers, utility deposits, immediate needs</li>
                  <li><strong>Home Maintenance:</strong> Budget 1-3% of home value annually</li>
                  <li><strong>Property Improvements:</strong> Immediate repairs, upgrades, furnishings</li>
                  <li><strong>Emergency Fund:</strong> Maintain 3-6 months of expenses after purchase</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">First-Time Buyer Programs:</h4>
                <p>
                  Many states and localities offer first-time homebuyer programs with benefits like down payment assistance, 
                  reduced interest rates, or closing cost help. These programs often have income limits and may require 
                  homebuyer education courses, but they can significantly improve affordability for qualified buyers.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Loan Types and Qualification Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <h4 className="font-semibold text-gray-800 mb-3">Conventional Loans:</h4>
                <p>
                  Not backed by the government, these loans typically offer the most flexibility but may have stricter 
                  requirements. They're available with down payments as low as 3% but require PMI for anything less than 20% down. 
                  Conventional loans often have the best rates for borrowers with excellent credit.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Conventional Loan Benefits:</h5>
                    <ul className="text-xs space-y-1">
                      <li>• No upfront mortgage insurance premium</li>
                      <li>• PMI can be removed at 20% equity</li>
                      <li>• Available for vacation homes and investment properties</li>
                      <li>• Higher loan limits than government programs</li>
                      <li>• No funding fee</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">FHA Loan Benefits:</h5>
                    <ul className="text-xs space-y-1">
                      <li>• 3.5% down payment minimum</li>
                      <li>• More flexible credit requirements</li>
                      <li>• Higher DTI ratios allowed</li>
                      <li>• Gift funds allowed for down payment</li>
                      <li>• Assumable loans</li>
                    </ul>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Government-Backed Loans:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>FHA Loans:</strong> 3.5% down, more lenient credit (580+ typically), MIP required</li>
                  <li><strong>VA Loans:</strong> 0% down for veterans, no PMI, competitive rates, funding fee applies</li>
                  <li><strong>USDA Loans:</strong> 0% down for rural areas, income limits apply, guarantee fee required</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Jumbo Loans:</h4>
                <p>
                  For home purchases exceeding conforming loan limits ($766,550 in most areas for 2024), jumbo loans 
                  are required. These typically require larger down payments (10-20%), excellent credit scores (740+), 
                  lower DTI ratios, and significant cash reserves. Rates may be slightly higher or lower than conforming loans 
                  depending on market conditions.
                </p>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Alternative Loan Programs:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Bank Statement Loans:</strong> For self-employed borrowers with non-traditional income documentation</li>
                  <li><strong>Asset-Based Loans:</strong> Qualify based on assets rather than income</li>
                  <li><strong>Non-QM Loans:</strong> Non-qualified mortgages for unique situations</li>
                  <li><strong>Portfolio Loans:</strong> Kept by lenders, more flexible underwriting</li>
                </ul>
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
                    <h4 className="font-semibold text-gray-800 mb-2">How accurate is this affordability calculator?</h4>
                    <p>This calculator provides estimates based on standard lending guidelines and the information you provide. Actual qualification depends on many factors including employment history, assets, and specific lender requirements. Use this as a starting point and get pre-qualified with lenders for accurate figures.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Should I buy the most house I can afford?</h4>
                    <p>Not necessarily. While lenders may approve you for a certain amount, consider your comfort level, other financial goals, and potential life changes. Many financial advisors recommend staying below maximum approval amounts to maintain financial flexibility.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What if my DTI is too high?</h4>
                    <p>Focus on paying down existing debts, increasing your income, or considering a less expensive home. Some loan programs allow higher DTI ratios with compensating factors like excellent credit, significant assets, or larger down payments.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How does my credit score affect affordability?</h4>
                    <p>Higher credit scores typically qualify for better interest rates, which can significantly increase affordability. They also allow for higher DTI ratios and may require smaller down payments. Even a 20-point improvement in credit score can save thousands over the loan term.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What's included in the debt-to-income calculation?</h4>
                    <p>Monthly debt payments include credit cards, auto loans, student loans, personal loans, alimony, and other recurring debts. It does not include utilities, insurance (except mortgage insurance), taxes, or other living expenses.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I use gift money for my down payment?</h4>
                    <p>Most loan programs allow gift funds from family members for down payments. You'll typically need a gift letter stating the money doesn't need to be repaid and documentation of the source of funds.</p>
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
              <p>• This calculator provides estimates only and does not guarantee loan approval or specific terms.</p>
              <p>• Actual qualification depends on employment history, assets, credit profile, and lender-specific requirements.</p>
              <p>• DTI ratios and qualification standards vary between lenders and loan programs.</p>
              <p>• Consider additional costs like closing costs, moving expenses, maintenance, and emergency funds.</p>
              <p>• Interest rates change daily and vary based on credit score, down payment, and other factors.</p>
              <p>• This calculator assumes current income will continue - consider job stability and future earnings potential.</p>
              <p>• Some loan programs have specific requirements not reflected in these general calculations.</p>
              <p>• Consult with qualified mortgage professionals and financial advisors for personalized guidance.</p>
              <p>• Regional costs for taxes, insurance, and other expenses can vary significantly from estimates used here.</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {result && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="loan-affordability-us"
            inputs={{ monthlyIncome, monthlyDebts, creditScore, downPaymentPercent, interestRate, loanTerm, propertyTaxRate, homeInsuranceRate, hoaFees, pmiRate }}
            results={result}
            title="Loan Affordability Analysis"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
}