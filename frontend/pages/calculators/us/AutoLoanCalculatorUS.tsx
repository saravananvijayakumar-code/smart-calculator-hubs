import { useState } from 'react';
import { Calculator, Car, DollarSign, Calendar, Info, TrendingUp, Shield, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency, formatPercentage } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';


interface AutoLoanCalculation {
  monthlyPayment: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  totalCostOfOwnership: number;
  affordabilityRatio: number;
}

export function AutoLoanCalculatorUS() {
  const [vehiclePrice, setVehiclePrice] = useState<string>('30000');
  const [downPayment, setDownPayment] = useState<string>('5000');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [loanTerm, setLoanTerm] = useState<string>('60');
  const [tradeInValue, setTradeInValue] = useState<string>('0');
  const [salesTax, setSalesTax] = useState<string>('8.5');
  const [monthlyIncome, setMonthlyIncome] = useState<string>('5000');
  const [results, setResults] = useState<AutoLoanCalculation | null>(null);

  const calculateLoan = () => {
    const price = parseFloat(vehiclePrice) || 0;
    const down = parseFloat(downPayment) || 0;
    const rate = parseFloat(interestRate) / 100 || 0;
    const months = parseInt(loanTerm) || 0;
    const tradeIn = parseFloat(tradeInValue) || 0;
    const tax = parseFloat(salesTax) / 100 || 0;
    const income = parseFloat(monthlyIncome) || 0;

    if (price <= 0 || months <= 0) {
      setResults(null);
      return;
    }

    // Calculate total vehicle cost including tax
    const taxAmount = price * tax;
    const totalVehicleCost = price + taxAmount;
    
    // Calculate loan amount after down payment and trade-in
    const loanAmount = Math.max(0, totalVehicleCost - down - tradeIn);

    // Calculate monthly payment
    const monthlyRate = rate / 12;
    let monthlyPayment = 0;
    
    if (loanAmount > 0 && rate > 0) {
      monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                      (Math.pow(1 + monthlyRate, months) - 1);
    } else if (loanAmount > 0) {
      monthlyPayment = loanAmount / months;
    }

    const totalAmountPaid = monthlyPayment * months;
    const totalInterestPaid = totalAmountPaid - loanAmount;
    const totalCostOfOwnership = totalAmountPaid + down + (price - tradeIn) * 0.15; // Estimated 15% depreciation
    const affordabilityRatio = income > 0 ? (monthlyPayment / income) * 100 : 0;

    setResults({
      monthlyPayment,
      totalInterestPaid,
      totalAmountPaid,
      totalCostOfOwnership,
      affordabilityRatio
    });
  };



  const tips = [
    "Aim for total car expenses (payment + insurance + gas) under 20% of income",
    "Consider certified pre-owned vehicles for better value and lower insurance costs",
    "Larger down payments reduce monthly payments and total interest paid",
    "Shop around for the best interest rates from banks, credit unions, and online lenders",
    "Factor in depreciation when considering new vs used vehicles - new cars lose 20-30% value in first year",
    "Get pre-approved for financing before shopping to understand your budget and negotiate better",
    "Consider the total cost of ownership including maintenance, insurance, fuel, and depreciation",
    "Shorter loan terms save money on interest but increase monthly payments"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Auto Loan Calculator - Car Payment & Financing Calculator"
      description="Calculate monthly car payments, total interest, and determine if an auto loan fits your budget. Get instant results with our comprehensive auto financing calculator."
      keywords="auto loan calculator, car payment calculator, vehicle financing, car loan, auto financing, monthly payment calculator, car loan rates, vehicle loan calculator"
      tips={tips}
    >
      {/* Educational Content Section */}
      <div className="mb-8 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Understanding Auto Loans
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-foreground mb-4">
                An auto loan is a secured loan where the vehicle serves as collateral. This comprehensive calculator helps you understand the true cost of financing a vehicle, including monthly payments, total interest, and affordability based on your income.
              </p>
              
              <Tabs defaultValue="basics" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basics">Loan Basics</TabsTrigger>
                  <TabsTrigger value="rates">Interest Rates</TabsTrigger>
                  <TabsTrigger value="terms">Loan Terms</TabsTrigger>
                  <TabsTrigger value="tips">Smart Tips</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basics" className="space-y-4">
                  <h4 className="font-semibold text-foreground">How Auto Loans Work</h4>
                  <ul className="space-y-2 text-foreground">
                    <li><strong>Principal:</strong> The amount you borrow (vehicle price minus down payment and trade-in)</li>
                    <li><strong>Interest:</strong> The cost of borrowing money, expressed as an Annual Percentage Rate (APR)</li>
                    <li><strong>Term:</strong> The length of time to repay the loan, typically 36-84 months</li>
                    <li><strong>Monthly Payment:</strong> Fixed amount paid each month including principal and interest</li>
                  </ul>
                  <p className="text-foreground">
                    Auto loans are typically secured by the vehicle itself, meaning the lender can repossess the car if payments aren't made. This security allows for lower interest rates compared to unsecured loans.
                  </p>
                </TabsContent>
                
                <TabsContent value="rates" className="space-y-4">
                  <h4 className="font-semibold text-foreground">Interest Rate Factors</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Credit Score Impact:</h5>
                      <ul className="text-sm space-y-1 text-foreground">
                        <li>• Excellent (750+): 3-5% APR</li>
                        <li>• Good (700-749): 5-7% APR</li>
                        <li>• Fair (650-699): 7-12% APR</li>
                        <li>• Poor (600-649): 12-18% APR</li>
                        <li>• Bad (below 600): 18%+ APR</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground mb-2">Other Rate Factors:</h5>
                      <ul className="text-sm space-y-1 text-foreground">
                        <li>• Vehicle age and mileage</li>
                        <li>• New vs. used vehicle</li>
                        <li>• Loan term length</li>
                        <li>• Down payment amount</li>
                        <li>• Debt-to-income ratio</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="terms" className="space-y-4">
                  <h4 className="font-semibold text-foreground">Choosing the Right Loan Term</h4>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-green-600 mb-2">✅ Shorter Terms (36-48 months)</h5>
                      <ul className="text-sm space-y-1 text-foreground">
                        <li>• Lower total interest paid</li>
                        <li>• Higher monthly payments</li>
                        <li>• Build equity faster</li>
                        <li>• Less risk of being upside down</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-medium text-orange-600 mb-2">⚠️ Longer Terms (60-84 months)</h5>
                      <ul className="text-sm space-y-1 text-foreground">
                        <li>• Lower monthly payments</li>
                        <li>• Much higher total interest</li>
                        <li>• Higher risk of negative equity</li>
                        <li>• May exceed warranty period</li>
                      </ul>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="tips" className="space-y-4">
                  <h4 className="font-semibold text-foreground">Smart Auto Financing Tips</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="border-l-4 border-green-500 pl-4">
                        <h5 className="font-medium text-foreground">Before You Shop</h5>
                        <ul className="text-sm space-y-1 text-foreground">
                          <li>• Check your credit score</li>
                          <li>• Get pre-approved for financing</li>
                          <li>• Research vehicle values</li>
                          <li>• Set a realistic budget</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h5 className="font-medium text-foreground">Shopping Strategy</h5>
                        <ul className="text-sm space-y-1 text-foreground">
                          <li>• Compare dealer vs. bank financing</li>
                          <li>• Negotiate price before financing</li>
                          <li>• Consider certified pre-owned</li>
                          <li>• Factor in all costs</li>
                        </ul>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="border-l-4 border-orange-500 pl-4">
                        <h5 className="font-medium text-foreground">Financial Wisdom</h5>
                        <ul className="text-sm space-y-1 text-foreground">
                          <li>• 20% down payment ideal</li>
                          <li>• Keep total transport costs under 20% of income</li>
                          <li>• Emergency fund comes first</li>
                          <li>• Consider insurance costs</li>
                        </ul>
                      </div>
                      <div className="border-l-4 border-red-500 pl-4">
                        <h5 className="font-medium text-foreground">Avoid These Mistakes</h5>
                        <ul className="text-sm space-y-1 text-foreground">
                          <li>• Focusing only on monthly payment</li>
                          <li>• Extending loan for lower payment</li>
                          <li>• Rolling negative equity into new loan</li>
                          <li>• Skipping gap insurance on new cars</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle & Loan Details
            </CardTitle>
            <CardDescription>
              Enter your vehicle and financing information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vehiclePrice">Vehicle Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="vehiclePrice"
                  type="number"
                  placeholder="30000"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="downPayment">Down Payment</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="downPayment"
                  type="number"
                  placeholder="5000"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tradeInValue">Trade-In Value</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="tradeInValue"
                  type="number"
                  placeholder="0"
                  value={tradeInValue}
                  onChange={(e) => setTradeInValue(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">APR (Annual Percentage Rate)</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="4.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term</Label>
              <Select value={loanTerm} onValueChange={setLoanTerm}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="36">36 months (3 years)</SelectItem>
                  <SelectItem value="48">48 months (4 years)</SelectItem>
                  <SelectItem value="60">60 months (5 years)</SelectItem>
                  <SelectItem value="72">72 months (6 years)</SelectItem>
                  <SelectItem value="84">84 months (7 years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="salesTax">Sales Tax Rate</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="salesTax"
                  type="number"
                  step="0.1"
                  placeholder="8.5"
                  value={salesTax}
                  onChange={(e) => setSalesTax(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyIncome">Monthly Gross Income</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="monthlyIncome"
                  type="number"
                  placeholder="5000"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">For affordability analysis</p>
            </div>

            <Button onClick={calculateLoan} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Auto Loan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
            <CardDescription>
              Your auto loan payment breakdown and affordability
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(results.monthlyPayment)}
                    </div>
                    <div className="text-sm text-muted-foreground">Monthly Payment</div>
                  </div>
                  <div className={`text-center p-4 rounded-lg ${
                    results.affordabilityRatio <= 15 
                      ? 'bg-green-50 dark:bg-green-950' 
                      : results.affordabilityRatio <= 20 
                        ? 'bg-yellow-50 dark:bg-yellow-950' 
                        : 'bg-red-50 dark:bg-red-950'
                  }`}>
                    <div className={`text-2xl font-bold ${
                      results.affordabilityRatio <= 15 
                        ? 'text-green-600' 
                        : results.affordabilityRatio <= 20 
                          ? 'text-yellow-600' 
                          : 'text-red-600'
                    }`}>
                      {results.affordabilityRatio.toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Of Income</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Interest Paid:</span>
                    <span className="font-semibold">{formatCurrency(results.totalInterestPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount Paid:</span>
                    <span className="font-semibold">{formatCurrency(results.totalAmountPaid)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Total Cost of Ownership:</span>
                    <span className="font-semibold">{formatCurrency(results.totalCostOfOwnership)}</span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  results.affordabilityRatio <= 15 
                    ? 'bg-green-50 dark:bg-green-950' 
                    : results.affordabilityRatio <= 20 
                      ? 'bg-yellow-50 dark:bg-yellow-950' 
                      : 'bg-red-50 dark:bg-red-950'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    results.affordabilityRatio <= 15 
                      ? 'text-green-800 dark:text-green-200' 
                      : results.affordabilityRatio <= 20 
                        ? 'text-yellow-800 dark:text-yellow-200' 
                        : 'text-red-800 dark:text-red-200'
                  }`}>
                    {results.affordabilityRatio <= 15 
                      ? '✅ Affordable' 
                      : results.affordabilityRatio <= 20 
                        ? '⚠️ Borderline' 
                        : '❌ May Be Too Expensive'
                    }
                  </h4>
                  <ul className={`text-sm space-y-1 ${
                    results.affordabilityRatio <= 15 
                      ? 'text-green-700 dark:text-green-300' 
                      : results.affordabilityRatio <= 20 
                        ? 'text-yellow-700 dark:text-yellow-300' 
                        : 'text-red-700 dark:text-red-300'
                  }`}>
                    <li>• Recommended: Keep auto payments under 15% of income</li>
                    <li>• Consider gap insurance for new vehicles</li>
                    <li>• Factor in insurance, maintenance, and fuel costs</li>
                    <li>• Shorter terms save money but increase monthly payments</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Car className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Enter your vehicle details to see calculation results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Information Sections */}
      <div className="mt-8 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Factors Affecting Your Auto Loan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Credit Score Impact</h4>
                  <p className="text-sm text-foreground mb-2">
                    Your credit score is the most significant factor in determining your interest rate. A difference of just 2% in APR can cost thousands over the life of the loan.
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>Example:</strong> On a $25,000 loan for 60 months, improving your credit from 650 to 750 could save you over $3,000 in interest.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Down Payment Benefits</h4>
                  <ul className="text-sm space-y-1 text-foreground">
                    <li>• Reduces loan amount and monthly payment</li>
                    <li>• Lowers total interest paid</li>
                    <li>• Provides immediate equity in the vehicle</li>
                    <li>• May qualify you for better rates</li>
                    <li>• Reduces risk of being upside down on the loan</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Vehicle Age Considerations</h4>
                  <p className="text-sm text-foreground">
                    Newer vehicles typically qualify for lower interest rates and longer terms. However, they also depreciate faster. Vehicles older than 7-10 years may have limited financing options or higher rates.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Total Cost of Vehicle Ownership
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-foreground mb-4">
                The monthly payment is just one part of vehicle ownership costs. Consider these additional expenses when budgeting:
              </p>
              
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-foreground mb-2">Insurance Costs</h4>
                  <ul className="text-sm space-y-1 text-foreground">
                    <li>• Full coverage required on financed vehicles</li>
                    <li>• Newer/more expensive cars cost more to insure</li>
                    <li>• Shop around for competitive rates</li>
                    <li>• Consider deductibles and coverage limits</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-foreground mb-2">Maintenance & Repairs</h4>
                  <ul className="text-sm space-y-1 text-foreground">
                    <li>• Regular maintenance: $500-$1,200/year</li>
                    <li>• Unexpected repairs increase with age</li>
                    <li>• Warranty coverage considerations</li>
                    <li>• Premium fuel requirements for some vehicles</li>
                  </ul>
                </div>
                
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-foreground mb-2">Depreciation</h4>
                  <ul className="text-sm space-y-1 text-foreground">
                    <li>• New cars lose 20-30% value in first year</li>
                    <li>• 50-60% value lost in first 5 years</li>
                    <li>• Certified pre-owned can offer better value</li>
                    <li>• Consider gap insurance for new vehicles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Avoiding Common Auto Loan Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-red-600 dark:text-red-400">Costly Mistakes to Avoid</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium text-foreground">Focusing Only on Monthly Payment</h5>
                    <p className="text-sm text-foreground">
                      Dealers may extend loan terms to lower monthly payments while increasing total cost. Always consider the total amount you'll pay.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium text-foreground">Rolling Negative Equity</h5>
                    <p className="text-sm text-foreground">
                      Adding what you owe on your current car to a new loan puts you further underwater and increases costs significantly.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-red-500 pl-4">
                    <h5 className="font-medium text-foreground">Skipping Pre-approval</h5>
                    <p className="text-sm text-foreground">
                      Getting pre-approved gives you negotiating power and helps you understand your true budget before shopping.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-green-600 dark:text-green-400">Smart Strategies</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-foreground">Shop Multiple Lenders</h5>
                    <p className="text-sm text-foreground">
                      Banks, credit unions, and online lenders often offer better rates than dealer financing. Compare all options.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-foreground">Negotiate Separately</h5>
                    <p className="text-sm text-foreground">
                      Negotiate the vehicle price, trade-in value, and financing separately to ensure you get the best deal on each.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4">
                    <h5 className="font-medium text-foreground">Consider Total Transportation Budget</h5>
                    <p className="text-sm text-foreground">
                      Keep total transportation costs (payment, insurance, gas, maintenance) under 15-20% of gross income.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Pro Tip</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Consider making extra principal payments early in the loan to significantly reduce total interest paid. Even an extra $50/month can save thousands over the loan term.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Auto Loan Calculator FAQ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-2">What's a good interest rate for an auto loan?</h4>
                <p className="text-sm text-foreground">
                  Auto loan rates vary based on credit score, loan term, and vehicle type. As of 2024, excellent credit (750+) can secure rates around 3-5% for new cars, while average credit (650-700) typically sees 6-10% rates. Used car rates are generally 1-3% higher.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">How much should I put down on a car?</h4>
                <p className="text-sm text-foreground">
                  Financial experts recommend putting down at least 20% for a new car and 10% for a used car. This reduces your loan amount, monthly payment, and helps avoid being upside down on the loan. However, ensure you maintain an emergency fund.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">Should I finance through the dealer or my bank?</h4>
                <p className="text-sm text-foreground">
                  Shop both options. Banks and credit unions often offer competitive rates, especially for borrowers with good credit. Dealers may have promotional rates but could mark up the interest. Get pre-approved from your bank for comparison leverage.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-2">What's the maximum loan term I should consider?</h4>
                <p className="text-sm text-foreground">
                  While loans up to 84 months are available, shorter terms (36-60 months) are generally better. Longer terms mean more interest paid and higher risk of being upside down. Choose the shortest term you can comfortably afford.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {results && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="auto-loan-us"
            inputs={{ vehiclePrice, downPayment, interestRate, loanTerm, tradeInValue, salesTax, monthlyIncome }}
            results={results}
            title="Auto Loan Estimate"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
}