import { useState, useEffect } from 'react';
import { Calculator, DollarSign, TrendingUp, CreditCard, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { useCalculatorHistory } from '../../../hooks/useCalculatorHistory';
import { useToast } from '@/components/ui/use-toast';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
}

export function LoanCalculatorUS() {
  const { saveCalculation } = useCalculatorHistory();
  const { toast } = useToast();
  
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [result, setResult] = useState<LoanResult | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const years = parseInt(loanTerm);

    if (!principal || !annualRate || !years || principal <= 0 || annualRate <= 0 || years <= 0) {
      setResult(null);
      return;
    }

    const monthlyRate = annualRate / 12;
    const totalPayments = years * 12;

    // Handle case where interest rate is 0
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = principal / totalPayments;
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                              (Math.pow(1 + monthlyRate, totalPayments) - 1);
    }

    const totalAmount = monthlyPayment * totalPayments;
    const totalInterest = totalAmount - principal;

    setResult({
      monthlyPayment,
      totalInterest,
      totalAmount
    });
  };

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
      calculatorType: 'loan',
      calculatorName: 'US Loan Calculator',
      inputs: {
        loanAmount: parseFloat(loanAmount),
        interestRate: parseFloat(interestRate),
        loanTerm: parseInt(loanTerm),
      },
      results: {
        monthlyPayment: result.monthlyPayment,
        totalInterest: result.totalInterest,
        totalAmount: result.totalAmount,
      },
    });

    toast({
      title: 'Calculation saved!',
      description: 'View it in your calculation history.',
    });
  };

  // Realtime calculation whenever inputs change
  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <CalculatorLayoutWithAds
      title="Loan Calculator USA | Personal Loan Payment Calculator | Smart Calculator Hubs"
      description="Free US loan calculator. Calculate loan payments, total interest, and payment schedules for personal loans, auto loans, and more. Get instant results."
      keywords="loan calculator USA, personal loan calculator, auto loan calculator, loan payment calculator, US loan rates, loan interest calculator"
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        {/* Input Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Loan Details</span>
            </CardTitle>
            <CardDescription>
              Enter your loan details to calculate monthly payments. All calculations are estimates only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Loan Amount (USD)</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="25000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (% APR)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="8.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                <Select value={loanTerm} onValueChange={setLoanTerm}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select loan term" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 year</SelectItem>
                    <SelectItem value="2">2 years</SelectItem>
                    <SelectItem value="3">3 years</SelectItem>
                    <SelectItem value="4">4 years</SelectItem>
                    <SelectItem value="5">5 years</SelectItem>
                    <SelectItem value="6">6 years</SelectItem>
                    <SelectItem value="7">7 years</SelectItem>
                  </SelectContent>
                </Select>
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

            <AIAnalysis
              analysisRequest={{
                calculatorType: "loan-us",
                data: {
                  principal: parseFloat(loanAmount) || 0,
                  interestRate: parseFloat(interestRate) || 0,
                  term: parseInt(loanTerm) || 0,
                  monthlyPayment: result.monthlyPayment,
                  totalInterest: result.totalInterest,
                  totalPayment: result.totalAmount
                }
              }}
              autoRun={true}
              title="AI Loan Analysis"
              description="Get personalized loan optimization strategies and refinancing recommendations based on your loan terms."
            />

            <ExportShareButtons
              calculatorType="loan-us"
              inputs={{
                loanAmount: parseFloat(loanAmount),
                interestRate: parseFloat(interestRate),
                loanTerm: parseInt(loanTerm)
              }}
              results={{
                monthlyPayment: result.monthlyPayment,
                totalInterest: result.totalInterest,
                totalAmount: result.totalAmount
              }}
              title="US Loan Calculator Report"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Payment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${result.monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Principal & Interest
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Interest
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
                  Total Amount
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  ${result.totalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Principal + Interest
                </p>
              </CardContent>
            </Card>
            </div>
          </div>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Understanding US Loans</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-4">
                <p>
                  A loan is a sum of money borrowed from a lender that must be repaid with interest over a specified period. 
                  In the United States, loans come in various forms including personal loans, auto loans, student loans, and business loans.
                </p>
                
                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Types of US Loans:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Personal Loans:</strong> Unsecured loans for various purposes (5-36% APR typical)</li>
                  <li><strong>Auto Loans:</strong> Secured by the vehicle (3-15% APR typical)</li>
                  <li><strong>Student Loans:</strong> For education expenses (federal and private options)</li>
                  <li><strong>Home Equity Loans:</strong> Secured by home equity (5-10% APR typical)</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mt-6 mb-3">Loan Terms to Know:</h4>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>APR:</strong> Annual Percentage Rate includes interest and fees</li>
                  <li><strong>Principal:</strong> The original amount borrowed</li>
                  <li><strong>Term:</strong> The length of time to repay the loan</li>
                  <li><strong>Secured vs Unsecured:</strong> Whether collateral is required</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Factors Affecting Your Loan Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Credit Score Impact:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Excellent (750+): Best rates available</li>
                      <li>Good (700-749): Competitive rates</li>
                      <li>Fair (650-699): Higher rates</li>
                      <li>Poor (&lt;650): Highest rates or denial</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Other Factors:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Income and employment history</li>
                      <li>Debt-to-income ratio</li>
                      <li>Loan amount and term</li>
                      <li>Type of loan (secured vs unsecured)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips for Getting the Best Loan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Before Applying:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Check your credit score</li>
                      <li>Shop around with multiple lenders</li>
                      <li>Consider pre-qualification</li>
                      <li>Improve your credit if needed</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Smart Strategies:</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Consider shorter terms for lower total cost</li>
                      <li>Make extra payments toward principal</li>
                      <li>Avoid unnecessary fees</li>
                      <li>Read all terms carefully</li>
                    </ul>
                  </div>
                </div>
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
                    <h4 className="font-semibold text-gray-800 mb-2">What's the difference between APR and interest rate?</h4>
                    <p>The interest rate is the cost of borrowing the principal amount. APR includes the interest rate plus other costs like fees, making it a more complete picture of the loan's total cost.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How does loan term affect my payments?</h4>
                    <p>Longer terms mean lower monthly payments but more interest paid over time. Shorter terms have higher monthly payments but less total interest cost.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I pay off my loan early?</h4>
                    <p>Most loans allow early payoff, but some have prepayment penalties. Check your loan terms and consider the penalty cost versus interest savings.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What credit score do I need for a personal loan?</h4>
                    <p>Most lenders prefer a credit score of 600 or higher for personal loans. Better credit scores (720+) qualify for the best rates and terms.</p>
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
              <TrendingUp className="h-5 w-5" />
              <span>Important Information & Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• This calculator provides estimates only and should not be relied upon for financial decisions.</p>
              <p>• Actual loan terms may vary based on creditworthiness, lender policies, and loan type.</p>
              <p>• APR may include additional fees not calculated here.</p>
              <p>• Interest rates are subject to change and vary significantly between lenders.</p>
              <p>• Consult with qualified financial professionals for personalized loan advice.</p>
              <p>• This calculator is designed for US residents and standard US loan practices.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}