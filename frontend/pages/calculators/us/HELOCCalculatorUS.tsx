import { useState } from 'react';
import { Calculator, Home, DollarSign, Calendar, AlertTriangle, CheckCircle, TrendingUp, Shield, BookOpen, Target } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency, formatPercentage } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';


interface HELOCCalculation {
  maxCreditLine: number;
  availableEquity: number;
  monthlyInterestOnly: number;
  monthlyPrincipalAndInterest: number;
  totalInterestDrawPeriod: number;
  totalPaymentRepaymentPeriod: number;
  loanToValueRatio: number;
}

export function HELOCCalculatorUS() {
  const [homeValue, setHomeValue] = useState<string>('400000');
  const [mortgageBalance, setMortgageBalance] = useState<string>('250000');
  const [creditLinePercentage, setCreditLinePercentage] = useState<string>('80');
  const [interestRate, setInterestRate] = useState<string>('7.5');
  const [drawPeriod, setDrawPeriod] = useState<string>('10');
  const [repaymentPeriod, setRepaymentPeriod] = useState<string>('15');
  const [drawAmount, setDrawAmount] = useState<string>('50000');
  const [results, setResults] = useState<HELOCCalculation | null>(null);

  const calculateHELOC = () => {
    const value = parseFloat(homeValue) || 0;
    const mortgage = parseFloat(mortgageBalance) || 0;
    const creditPercent = parseFloat(creditLinePercentage) / 100 || 0;
    const rate = parseFloat(interestRate) / 100 || 0;
    const drawYears = parseInt(drawPeriod) || 0;
    const repayYears = parseInt(repaymentPeriod) || 0;
    const draw = parseFloat(drawAmount) || 0;

    if (value <= 0 || mortgage < 0 || rate < 0) {
      setResults(null);
      return;
    }

    // Calculate available equity and credit line
    const availableEquity = Math.max(0, value - mortgage);
    const maxCreditLine = Math.max(0, (value * creditPercent) - mortgage);
    const actualCreditLine = Math.min(maxCreditLine, availableEquity);

    // Calculate LTV ratio
    const loanToValueRatio = ((mortgage + draw) / value) * 100;

    // Calculate monthly payments
    const monthlyRate = rate / 12;
    
    // Interest-only payment during draw period
    const monthlyInterestOnly = draw * monthlyRate;

    // Principal and interest payment during repayment period
    const repaymentMonths = repayYears * 12;
    let monthlyPrincipalAndInterest = 0;
    
    if (repaymentMonths > 0 && rate > 0) {
      monthlyPrincipalAndInterest = (draw * monthlyRate * Math.pow(1 + monthlyRate, repaymentMonths)) / 
                                   (Math.pow(1 + monthlyRate, repaymentMonths) - 1);
    } else if (repaymentMonths > 0) {
      monthlyPrincipalAndInterest = draw / repaymentMonths;
    }

    // Calculate total payments
    const totalInterestDrawPeriod = monthlyInterestOnly * drawYears * 12;
    const totalPaymentRepaymentPeriod = monthlyPrincipalAndInterest * repaymentMonths;

    setResults({
      maxCreditLine: actualCreditLine,
      availableEquity,
      monthlyInterestOnly,
      monthlyPrincipalAndInterest,
      totalInterestDrawPeriod,
      totalPaymentRepaymentPeriod,
      loanToValueRatio
    });
  };

  const tips = [
    "HELOCs typically have variable interest rates that can change monthly",
    "Draw period usually allows interest-only payments for flexibility",
    "Consider market conditions and Federal Reserve policy when timing applications",
    "Home equity loans offer fixed rates vs HELOC variable rates",
    "Use responsibly - your home is collateral for the entire credit line"
  ];

  return (
    <CalculatorLayoutWithAds
      title="HELOC Calculator (Home Equity Line of Credit) - Calculate Credit Lines & Payments"
      description="Free HELOC calculator to determine your available credit line, monthly payments, and total costs. Learn how Home Equity Lines of Credit work with comprehensive analysis and expert guidance."
      keywords="HELOC calculator, home equity line of credit, home equity calculator, second mortgage, variable rate loan, credit line calculator, home equity loan vs HELOC"
      tips={tips}
    >
      <div className="space-y-8">
        {/* Main Calculator */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home Equity Details
              </CardTitle>
              <CardDescription>
                Enter your home and loan information for comprehensive HELOC analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="homeValue">Current Home Value</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="homeValue"
                    type="number"
                    placeholder="400000"
                    value={homeValue}
                    onChange={(e) => setHomeValue(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Use current market value, not purchase price</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mortgageBalance">Current Mortgage Balance</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="mortgageBalance"
                    type="number"
                    placeholder="250000"
                    value={mortgageBalance}
                    onChange={(e) => setMortgageBalance(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Outstanding balance on all existing mortgages</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="creditLinePercentage">Max Credit Line (% of Home Value)</Label>
                <Select value={creditLinePercentage} onValueChange={setCreditLinePercentage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="75">75% - Conservative</SelectItem>
                    <SelectItem value="80">80% - Standard</SelectItem>
                    <SelectItem value="85">85% - Higher Risk</SelectItem>
                    <SelectItem value="90">90% - Maximum</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Combined loan-to-value ratio limit set by lender</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (APR)</Label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="7.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-muted-foreground">Variable rate - typically Prime Rate + margin</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawPeriod">Draw Period</Label>
                <Select value={drawPeriod} onValueChange={setDrawPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="10">10 years (Standard)</SelectItem>
                    <SelectItem value="15">15 years</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Period when you can draw funds and pay interest-only</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repaymentPeriod">Repayment Period</Label>
                <Select value={repaymentPeriod} onValueChange={setRepaymentPeriod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 years</SelectItem>
                    <SelectItem value="15">15 years (Standard)</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Period to repay principal and interest after draw period</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="drawAmount">Amount to Draw</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="drawAmount"
                    type="number"
                    placeholder="50000"
                    value={drawAmount}
                    onChange={(e) => setDrawAmount(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Amount you plan to borrow for payment calculations</p>
              </div>

              <Button onClick={calculateHELOC} className="w-full">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate HELOC
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>HELOC Analysis Results</CardTitle>
              <CardDescription>
                Your home equity credit line capacity and payment breakdown
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatCurrency(results.maxCreditLine)}
                      </div>
                      <div className="text-sm text-muted-foreground">Max Credit Line Available</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(results.availableEquity)}
                      </div>
                      <div className="text-sm text-muted-foreground">Total Home Equity</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Payment Schedule:
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Draw Period Payment (Interest Only):</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(results.monthlyInterestOnly)}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Repayment Period Payment (P&I):</span>
                        <span className="font-semibold text-orange-600">{formatCurrency(results.monthlyPrincipalAndInterest)}/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest During Draw Period:</span>
                        <span className="font-semibold">{formatCurrency(results.totalInterestDrawPeriod)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Combined Loan-to-Value (LTV):</span>
                        <span className="font-semibold">{results.loanToValueRatio.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-lg ${
                    results.loanToValueRatio <= 80 
                      ? 'bg-green-50 dark:bg-green-950' 
                      : results.loanToValueRatio <= 90 
                        ? 'bg-yellow-50 dark:bg-yellow-950' 
                        : 'bg-red-50 dark:bg-red-950'
                  }`}>
                    <h4 className={`font-semibold mb-2 flex items-center gap-2 ${
                      results.loanToValueRatio <= 80 
                        ? 'text-green-800 dark:text-green-200' 
                        : results.loanToValueRatio <= 90 
                          ? 'text-yellow-800 dark:text-yellow-200' 
                          : 'text-red-800 dark:text-red-200'
                    }`}>
                      {results.loanToValueRatio <= 80 ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                      Risk Assessment
                    </h4>
                    <div className={`text-sm ${
                      results.loanToValueRatio <= 80 
                        ? 'text-green-700 dark:text-green-300' 
                        : results.loanToValueRatio <= 90 
                          ? 'text-yellow-700 dark:text-yellow-300' 
                          : 'text-red-700 dark:text-red-300'
                    }`}>
                      {results.loanToValueRatio <= 80 && (
                        <p>Excellent LTV ratio. You have substantial equity cushion and should qualify for the best rates.</p>
                      )}
                      {results.loanToValueRatio > 80 && results.loanToValueRatio <= 90 && (
                        <p>Moderate LTV ratio. You may face slightly higher rates and stricter qualification requirements.</p>
                      )}
                      {results.loanToValueRatio > 90 && (
                        <p>High LTV ratio. Limited lender options and significantly higher rates. Consider building more equity first.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <Home className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Enter your home equity details to see comprehensive HELOC analysis</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Complete Guide to Home Equity Lines of Credit (HELOC)
            </CardTitle>
            <CardDescription>
              Everything you need to know about HELOCs, from basics to advanced strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basics">HELOC Basics</TabsTrigger>
                <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
                <TabsTrigger value="pros-cons">Pros & Cons</TabsTrigger>
                <TabsTrigger value="qualification">Qualification</TabsTrigger>
                <TabsTrigger value="strategies">Smart Uses</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-xl font-semibold mb-4">What is a Home Equity Line of Credit (HELOC)?</h3>
                  
                  <p className="mb-4">
                    A Home Equity Line of Credit (HELOC) is a revolving credit line secured by your home's equity. Unlike a traditional loan where you receive a lump sum, a HELOC works more like a credit card – you have access to a predetermined credit limit and can borrow against it as needed during the "draw period."
                  </p>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Key HELOC Features:</h4>
                    <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                      <li><strong>Variable Interest Rate:</strong> Rates typically adjust monthly based on the Prime Rate plus a margin</li>
                      <li><strong>Two-Phase Structure:</strong> Draw period (borrow and pay interest) followed by repayment period (pay principal + interest)</li>
                      <li><strong>Revolving Credit:</strong> Pay down the balance and borrow again during the draw period</li>
                      <li><strong>Home as Collateral:</strong> Your home secures the entire credit line, enabling lower rates but creating foreclosure risk</li>
                    </ul>
                  </div>

                  <h4 className="text-lg font-semibold mb-3">HELOC vs. Home Equity Loan: Key Differences</h4>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-green-600 mb-2">HELOC Advantages</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Flexibility to borrow as needed</li>
                        <li>• Interest-only payments during draw period</li>
                        <li>• Only pay interest on amount used</li>
                        <li>• Can reborrow during draw period</li>
                        <li>• Lower initial payments</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-4">
                      <h5 className="font-semibold text-blue-600 mb-2">Home Equity Loan Advantages</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Fixed interest rate and payments</li>
                        <li>• Predictable payment schedule</li>
                        <li>• Protection from rate increases</li>
                        <li>• Structured repayment plan</li>
                        <li>• Better for large, one-time expenses</li>
                      </ul>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mb-3">How Equity is Calculated</h4>
                  <p className="mb-4">
                    Your home equity is the difference between your home's current market value and the total amount you owe on all mortgages. For example, if your home is worth $400,000 and you owe $250,000 on your mortgage, you have $150,000 in equity.
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-sm"><strong>Formula:</strong> Home Equity = Current Home Value - Outstanding Mortgage Balance(s)</p>
                    <p className="text-sm mt-2"><strong>Available Credit:</strong> Most lenders allow you to borrow up to 80-90% of your home's value, minus existing mortgage balances.</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="how-it-works" className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-xl font-semibold mb-4">How Does a HELOC Work?</h3>

                  <div className="space-y-6">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="text-lg font-semibold text-blue-600 mb-2">Phase 1: Draw Period (Typically 10 Years)</h4>
                      <p className="mb-3">
                        During the draw period, you can access your credit line as needed, similar to using a credit card. You typically only pay interest on the amount you've borrowed, making monthly payments relatively low and manageable.
                      </p>
                      <ul className="space-y-2">
                        <li><strong>Access Methods:</strong> Checks, debit card, online transfers, or branch visits</li>
                        <li><strong>Payment Requirements:</strong> Usually interest-only minimum payments</li>
                        <li><strong>Borrowing Flexibility:</strong> Borrow, repay, and borrow again up to your credit limit</li>
                        <li><strong>Rate Adjustments:</strong> Variable rates typically adjust monthly with market conditions</li>
                      </ul>
                    </div>

                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="text-lg font-semibold text-orange-600 mb-2">Phase 2: Repayment Period (Typically 15-20 Years)</h4>
                      <p className="mb-3">
                        Once the draw period ends, you enter the repayment phase. You can no longer access the credit line, and your payments increase significantly as you must now pay both principal and interest to fully repay the outstanding balance.
                      </p>
                      <ul className="space-y-2">
                        <li><strong>No New Borrowing:</strong> Credit line is closed to new advances</li>
                        <li><strong>Higher Payments:</strong> Principal + interest payments, typically much higher than draw period</li>
                        <li><strong>Payment Shock:</strong> Monthly payments can double or triple from the draw period</li>
                        <li><strong>Amortization:</strong> Balance is paid down to zero over the repayment term</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Payment Shock Example
                      </h4>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        A $50,000 HELOC balance at 7.5% interest: <br/>
                        • Draw Period: ~$312/month (interest-only) <br/>
                        • Repayment Period: ~$465/month (15-year repayment) <br/>
                        <strong>49% payment increase!</strong> Plan for this transition carefully.
                      </p>
                    </div>

                    <h4 className="text-lg font-semibold mb-3">Interest Rate Mechanics</h4>
                    <p className="mb-4">
                      HELOC rates are typically variable and tied to the Prime Rate, which is influenced by Federal Reserve policy. Your rate equals the Prime Rate plus a margin determined by your creditworthiness, loan-to-value ratio, and lender policies.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h5 className="font-semibold mb-2">Rate Components</h5>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Prime Rate:</strong> Currently around 8.5% (varies)</li>
                          <li>• <strong>Lender Margin:</strong> -0.5% to +3% based on qualifications</li>
                          <li>• <strong>Your Rate:</strong> Prime + Margin</li>
                          <li>• <strong>Rate Caps:</strong> Annual and lifetime maximums</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h5 className="font-semibold mb-2">Rate Factors</h5>
                        <ul className="text-sm space-y-1">
                          <li>• Credit score and history</li>
                          <li>• Loan-to-value ratio</li>
                          <li>• Income and debt-to-income ratio</li>
                          <li>• Relationship with lender</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="pros-cons" className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-xl font-semibold mb-4">HELOC Advantages and Disadvantages</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-3 flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          HELOC Advantages
                        </h4>
                        <ul className="space-y-2 text-green-700 dark:text-green-300 text-sm">
                          <li><strong>Lower Interest Rates:</strong> Secured by home equity, rates are typically much lower than credit cards or personal loans</li>
                          <li><strong>Flexible Access:</strong> Borrow only what you need, when you need it, up to your credit limit</li>
                          <li><strong>Interest-Only Payments:</strong> During draw period, you can make minimum interest-only payments</li>
                          <li><strong>Revolving Credit:</strong> Pay down balance and reborrow during draw period without reapplying</li>
                          <li><strong>Potential Tax Benefits:</strong> Interest may be tax-deductible if used for home improvements (consult tax advisor)</li>
                          <li><strong>Large Credit Limits:</strong> Access substantial amounts based on your home equity</li>
                          <li><strong>No Prepayment Penalties:</strong> Most HELOCs allow early payoff without fees</li>
                          <li><strong>Rate Transparency:</strong> Variable rates are tied to published indices like Prime Rate</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Best HELOC Uses</h4>
                        <ul className="space-y-1 text-blue-700 dark:text-blue-300 text-sm">
                          <li>• Home improvements and renovations</li>
                          <li>• Debt consolidation (high-interest debt)</li>
                          <li>• Education expenses</li>
                          <li>• Investment property down payments</li>
                          <li>• Business investments</li>
                          <li>• Emergency fund backup</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                        <h4 className="font-semibold text-red-800 dark:text-red-200 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          HELOC Disadvantages
                        </h4>
                        <ul className="space-y-2 text-red-700 dark:text-red-300 text-sm">
                          <li><strong>Variable Interest Rates:</strong> Rates can increase significantly, raising your monthly payments</li>
                          <li><strong>Home as Collateral:</strong> Risk of foreclosure if you cannot make payments</li>
                          <li><strong>Payment Shock:</strong> Payments can increase dramatically when repayment period begins</li>
                          <li><strong>Temptation to Overspend:</strong> Easy access to funds can lead to unnecessary borrowing</li>
                          <li><strong>Closing Costs:</strong> Appraisal, origination, and other fees can total $2,000-$5,000</li>
                          <li><strong>Draw Period Ends:</strong> Eventually you lose access to the credit line</li>
                          <li><strong>Market Risk:</strong> Declining home values could trigger balance acceleration</li>
                          <li><strong>Introductory Rate Expiration:</strong> Promotional rates typically increase after initial period</li>
                        </ul>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Avoid Using HELOCs For</h4>
                        <ul className="space-y-1 text-orange-700 dark:text-orange-300 text-sm">
                          <li>• Vacations and luxury purchases</li>
                          <li>• Daily living expenses</li>
                          <li>• Risky investments or speculation</li>
                          <li>• Depreciating assets (cars, boats)</li>
                          <li>• Paying off HELOC with another HELOC</li>
                          <li>• Lifestyle inflation</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold mb-2">Risk Management Strategies</h4>
                    <ul className="text-sm space-y-1">
                      <li>• <strong>Rate Protection:</strong> Look for HELOCs with rate caps to limit how much your rate can increase</li>
                      <li>• <strong>Payment Planning:</strong> Budget for higher payments during the repayment period</li>
                      <li>• <strong>Conservative Borrowing:</strong> Don't max out your credit line - keep a cushion</li>
                      <li>• <strong>Fixed-Rate Option:</strong> Some lenders allow converting variable balances to fixed rates</li>
                      <li>• <strong>Emergency Fund:</strong> Maintain separate emergency savings to avoid HELOC dependency</li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="qualification" className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-xl font-semibold mb-4">HELOC Qualification Requirements</h3>

                  <p className="mb-6">
                    HELOC qualification requirements are generally stricter than first mortgage loans because lenders view them as riskier second liens. Understanding these requirements helps you prepare a stronger application and improves your chances of approval at favorable terms.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Credit Score Requirements
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Excellent (740+):</span>
                            <span className="text-green-600 font-semibold">Best rates, highest limits</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Good (680-739):</span>
                            <span className="text-blue-600 font-semibold">Competitive rates, good terms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fair (620-679):</span>
                            <span className="text-orange-600 font-semibold">Higher rates, lower limits</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Below 620:</span>
                            <span className="text-red-600 font-semibold">Difficult to qualify</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-green-600 mb-3">Income Requirements</h4>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Debt-to-Income Ratio:</strong> Typically max 43-50%</li>
                          <li>• <strong>Stable Income:</strong> 2+ years employment history</li>
                          <li>• <strong>Income Documentation:</strong> W-2s, pay stubs, tax returns</li>
                          <li>• <strong>Self-Employed:</strong> Additional documentation required</li>
                          <li>• <strong>Retirement Income:</strong> Social Security, pensions acceptable</li>
                        </ul>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-purple-600 mb-3">Loan-to-Value Limits</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Combined LTV ≤ 80%:</span>
                            <span className="text-green-600 font-semibold">Best terms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Combined LTV 80-85%:</span>
                            <span className="text-blue-600 font-semibold">Good terms</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Combined LTV 85-90%:</span>
                            <span className="text-orange-600 font-semibold">Higher rates</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Combined LTV &gt; 90%:</span>
                            <span className="text-red-600 font-semibold">Very limited options</span>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-orange-600 mb-3">Property Requirements</h4>
                        <ul className="text-sm space-y-1">
                          <li>• <strong>Property Type:</strong> Primary residence, second homes, investment properties</li>
                          <li>• <strong>Occupancy:</strong> Some lenders prefer owner-occupied</li>
                          <li>• <strong>Property Condition:</strong> Must meet lender standards</li>
                          <li>• <strong>Location:</strong> Must be in lender's service area</li>
                          <li>• <strong>Insurance:</strong> Adequate homeowner's coverage required</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Application Process Timeline</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">1</div>
                          <span><strong>Application Submission:</strong> 1-2 hours</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">2</div>
                          <span><strong>Document Collection:</strong> 2-5 days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">3</div>
                          <span><strong>Credit Check & Verification:</strong> 1-3 days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">4</div>
                          <span><strong>Home Appraisal:</strong> 1-2 weeks</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">5</div>
                          <span><strong>Underwriting Review:</strong> 1-2 weeks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">6</div>
                          <span><strong>Final Approval:</strong> 2-5 days</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">7</div>
                          <span><strong>Closing & Access:</strong> 3-5 days</span>
                        </div>
                        <div className="text-center font-semibold text-blue-700 dark:text-blue-300 mt-2">
                          Total: 30-45 days typical
                        </div>
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mb-3">Required Documentation</h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <h5 className="font-semibold mb-2">Income Verification</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Last 2 years W-2s</li>
                        <li>• Recent pay stubs</li>
                        <li>• Tax returns (if self-employed)</li>
                        <li>• Bank statements</li>
                        <li>• Asset statements</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-semibold mb-2">Property Information</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Property deed or title</li>
                        <li>• Current mortgage statements</li>
                        <li>• Property tax records</li>
                        <li>• Homeowner's insurance</li>
                        <li>• HOA documents (if applicable)</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-3">
                      <h5 className="font-semibold mb-2">Personal Financial</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Credit report authorization</li>
                        <li>• List of debts and obligations</li>
                        <li>• Investment account statements</li>
                        <li>• Retirement account balances</li>
                        <li>• Other asset documentation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="strategies" className="space-y-4">
                <div className="prose max-w-none dark:prose-invert">
                  <h3 className="text-xl font-semibold mb-4">Smart HELOC Strategies and Best Practices</h3>

                  <p className="mb-6">
                    A HELOC can be a powerful financial tool when used strategically. The key is to use it for investments that either appreciate in value, generate income, or improve your financial position. Here are proven strategies and best practices from financial experts.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        High-Value HELOC Uses
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="border-l-4 border-green-500 pl-3">
                          <h5 className="font-semibold">Home Improvements (ROI: 50-80%)</h5>
                          <p>Kitchen remodels, bathroom updates, adding square footage, energy efficiency upgrades. These can increase home value and are potentially tax-deductible.</p>
                        </div>
                        <div className="border-l-4 border-blue-500 pl-3">
                          <h5 className="font-semibold">Investment Property Down Payment</h5>
                          <p>Use equity to purchase rental properties that generate positive cash flow. The rental income can help service the HELOC debt.</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-3">
                          <h5 className="font-semibold">High-Interest Debt Consolidation</h5>
                          <p>Replace credit cards (15-25% APR) with HELOC rates (7-10% APR). Significant interest savings if you don't run up new debt.</p>
                        </div>
                        <div className="border-l-4 border-orange-500 pl-3">
                          <h5 className="font-semibold">Education Investment</h5>
                          <p>Fund education that increases earning potential. Often better rates than private student loans, but consider federal options first.</p>
                        </div>
                      </div>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Risk Management Tactics
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="border-l-4 border-red-500 pl-3">
                          <h5 className="font-semibold">Interest Rate Protection</h5>
                          <p>Look for HELOCs with annual caps (limit yearly increases to 1-2%) and lifetime caps (limit total rate increases to 5-6%).</p>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-3">
                          <h5 className="font-semibold">Payment Shock Preparation</h5>
                          <p>Calculate repayment period payments before borrowing. Ensure you can afford the higher payments or plan to pay down principal during draw period.</p>
                        </div>
                        <div className="border-l-4 border-indigo-500 pl-3">
                          <h5 className="font-semibold">Conservative LTV Management</h5>
                          <p>Keep combined LTV below 80% when possible. This provides equity cushion and access to better rates if you need to refinance.</p>
                        </div>
                        <div className="border-l-4 border-teal-500 pl-3">
                          <h5 className="font-semibold">Emergency Buffer</h5>
                          <p>Don't use entire credit line. Keep 20-30% available for true emergencies or opportunities.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-6 rounded-lg mb-6">
                    <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-4">Advanced Strategy: The HELOC Arbitrage Method</h4>
                    <p className="text-indigo-700 dark:text-indigo-300 mb-3 text-sm">
                      This sophisticated strategy involves using HELOC funds to pay down your primary mortgage faster, then drawing on the HELOC again to repeat the process. It works because mortgage interest is typically calculated daily, while HELOC interest is often calculated monthly.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded border">
                      <h5 className="font-semibold mb-2">How It Works:</h5>
                      <ol className="text-sm space-y-1 list-decimal list-inside">
                        <li>Draw $10,000 from HELOC and apply to mortgage principal</li>
                        <li>Use monthly income to pay living expenses and HELOC interest</li>
                        <li>When funds are needed, draw from HELOC to cover expenses</li>
                        <li>Repeat monthly, focusing surplus income on mortgage paydown</li>
                      </ol>
                      <p className="text-xs text-muted-foreground mt-2">
                        <strong>Caution:</strong> This strategy requires discipline and detailed tracking. Market rate changes can eliminate benefits. Consider professional financial advice.
                      </p>
                    </div>
                  </div>

                  <h4 className="text-lg font-semibold mb-3">HELOC vs. Other Financing Options</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300 dark:border-gray-600 text-sm">
                      <thead>
                        <tr className="bg-gray-100 dark:bg-gray-800">
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Financing Option</th>
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Typical Rate</th>
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Best For</th>
                          <th className="border border-gray-300 dark:border-gray-600 p-2 text-left">Key Advantage</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">HELOC</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">7-10%</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Flexible ongoing access to funds</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Pay interest only on amount used</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">Home Equity Loan</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">7-9%</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Large one-time expenses</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Fixed rate and payment</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">Cash-Out Refinance</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">6-8%</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Large amounts, rate improvement</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Lowest rates, single payment</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">Personal Loan</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">8-15%</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Smaller amounts, quick access</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">No home collateral risk</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 dark:border-gray-600 p-2 font-semibold">Credit Cards</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">15-25%</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Short-term, small purchases</td>
                          <td className="border border-gray-300 dark:border-gray-600 p-2">Instant access, rewards programs</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-950 p-4 rounded-lg mt-6">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">Before Applying: Financial Health Checklist</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <ul className="space-y-1 text-orange-700 dark:text-orange-300">
                        <li>✓ Emergency fund covers 3-6 months expenses</li>
                        <li>✓ Stable income and employment</li>
                        <li>✓ Credit score above 680</li>
                        <li>✓ Debt-to-income ratio below 43%</li>
                        <li>✓ Clear purpose for borrowed funds</li>
                      </ul>
                      <ul className="space-y-1 text-orange-700 dark:text-orange-300">
                        <li>✓ Budget includes higher repayment payments</li>
                        <li>✓ Comfortable with variable rate risk</li>
                        <li>✓ Plan to pay down balance during draw period</li>
                        <li>✓ Home value expected to remain stable</li>
                        <li>✓ Alternative repayment sources available</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>Common HELOC questions answered by financial experts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">What happens if home values drop significantly?</h4>
                <p className="text-sm text-muted-foreground">
                  If home values decline substantially, lenders may freeze your credit line or demand immediate repayment. This is why maintaining a conservative loan-to-value ratio (below 80%) provides important protection against market volatility.
                </p>
              </div>
              
              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Can I convert my variable HELOC rate to a fixed rate?</h4>
                <p className="text-sm text-muted-foreground">
                  Many lenders offer fixed-rate conversion options during the draw period. You can typically lock in portions of your balance at current fixed rates. This feature provides protection against rising interest rates but usually comes with slightly higher rates than the variable option.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">How does HELOC interest compare to mortgage rates?</h4>
                <p className="text-sm text-muted-foreground">
                  HELOC rates are typically 1-3% higher than first mortgage rates because they're considered riskier second liens. However, they're generally much lower than credit cards or personal loans. Current HELOC rates average 7-10% compared to first mortgage rates of 6-8%.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">What's the minimum credit line for most HELOCs?</h4>
                <p className="text-sm text-muted-foreground">
                  Most lenders require minimum credit lines of $10,000-$25,000, with maximum limits often reaching $500,000 or more for qualified borrowers. The actual limit depends on your home equity, income, creditworthiness, and the lender's policies.
                </p>
              </div>

              <div className="border-b pb-4">
                <h4 className="font-semibold mb-2">Are there penalties for paying off a HELOC early?</h4>
                <p className="text-sm text-muted-foreground">
                  Most HELOCs don't have prepayment penalties, allowing you to pay off the balance early without fees. However, some lenders charge early closure fees if you close the line within the first 2-3 years. Always review the terms before signing.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Can I use a HELOC to buy another property?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes, HELOC funds can be used for investment property down payments or to purchase a second home. This strategy can be effective for real estate investors, but ensure the rental income or appreciation potential justifies the additional debt and risk.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {results && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="heloc-us"
            inputs={{ homeValue, mortgageBalance, interestRate, creditLinePercentage, drawPeriod, repaymentPeriod, drawAmount }}
            results={results}
            title="HELOC Analysis"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
}