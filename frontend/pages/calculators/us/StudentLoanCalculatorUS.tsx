import { useState } from 'react';
import { Calculator, BookOpen, DollarSign, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency, formatPercentage } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';


interface StudentLoanCalculation {
  monthlyPayment: number;
  totalInterestPaid: number;
  totalAmountPaid: number;
  payoffDate: string;
  monthlyBudgetNeeded: number;
}

export function StudentLoanCalculatorUS() {
  const [loanAmount, setLoanAmount] = useState<string>('50000');
  const [interestRate, setInterestRate] = useState<string>('5.5');
  const [loanTerm, setLoanTerm] = useState<string>('10');
  const [repaymentPlan, setRepaymentPlan] = useState<string>('standard');
  const [gracePeriod, setGracePeriod] = useState<string>('6');
  const [results, setResults] = useState<StudentLoanCalculation | null>(null);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) / 100 || 0;
    const years = parseFloat(loanTerm) || 0;
    const grace = parseInt(gracePeriod) || 0;

    if (principal <= 0 || annualRate < 0 || years <= 0) {
      setResults(null);
      return;
    }

    const monthlyRate = annualRate / 12;
    const totalPayments = years * 12;

    // Calculate monthly payment
    let monthlyPayment: number;
    if (repaymentPlan === 'standard') {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                      (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (repaymentPlan === 'graduated') {
      monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                      (Math.pow(1 + monthlyRate, totalPayments) - 1) * 0.7; // Start with 70% of standard
    } else {
      // Income-driven - estimate based on 10% of discretionary income
      monthlyPayment = principal * 0.002; // Rough estimate
    }

    const totalAmountPaid = monthlyPayment * totalPayments;
    const totalInterestPaid = totalAmountPaid - principal;

    // Calculate payoff date
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + grace + totalPayments);
    const payoffDate = currentDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });

    // Budget recommendation (30% of gross income)
    const monthlyBudgetNeeded = monthlyPayment / 0.1; // Assume 10% of income for student loans

    setResults({
      monthlyPayment,
      totalInterestPaid,
      totalAmountPaid,
      payoffDate,
      monthlyBudgetNeeded
    });
  };



  const tips = [
    "Federal loans typically offer better terms than private loans",
    "Income-driven repayment plans can reduce monthly payments",
    "Consider loan forgiveness programs for public service careers",
    "Pay extra toward principal to reduce total interest",
    "Consolidation may simplify payments but could increase costs"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Student Loan Calculator"
      description="Calculate monthly payments, total interest, and repayment strategies for student loans with different repayment plans."
      keywords="student loan calculator, education financing, loan repayment, student debt"
      tips={tips}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Student Loan Details
            </CardTitle>
            <CardDescription>
              Enter your student loan information to calculate payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loanAmount">Total Loan Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="loanAmount"
                  type="number"
                  placeholder="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  placeholder="5.5"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="loanTerm">Loan Term</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="loanTerm"
                  type="number"
                  placeholder="10"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-sm text-muted-foreground">Years</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="repaymentPlan">Repayment Plan</Label>
              <Select value={repaymentPlan} onValueChange={setRepaymentPlan}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (Fixed)</SelectItem>
                  <SelectItem value="graduated">Graduated (Increasing)</SelectItem>
                  <SelectItem value="income-driven">Income-Driven</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gracePeriod">Grace Period</Label>
              <Select value={gracePeriod} onValueChange={setGracePeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0 months</SelectItem>
                  <SelectItem value="6">6 months</SelectItem>
                  <SelectItem value="9">9 months</SelectItem>
                  <SelectItem value="12">12 months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateLoan} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate Student Loan
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calculation Results</CardTitle>
            <CardDescription>
              Your student loan payment breakdown and timeline
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
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {results.payoffDate}
                    </div>
                    <div className="text-sm text-muted-foreground">Payoff Date</div>
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
                    <span>Recommended Monthly Income:</span>
                    <span className="font-semibold">{formatCurrency(results.monthlyBudgetNeeded)}</span>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">💡 Quick Tips</h4>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                    <li>• Consider automatic payments for interest rate reductions</li>
                    <li>• Make extra principal payments to reduce total interest</li>
                    <li>• Research loan forgiveness programs for your career</li>
                    <li>• Consider refinancing if you have good credit</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Enter your loan details to see calculation results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>


      {results && (
        <>
          <div className="mt-8">
            <EnhancedAIAnalysis
              calculatorType="student-loan"
              data={{
                loanAmount: parseFloat(loanAmount),
                interestRate: parseFloat(interestRate),
                loanTerm: parseInt(loanTerm),
                monthlyPayment: results.monthlyPayment,
                totalInterest: results.totalInterestPaid,
                totalAmount: results.totalAmountPaid,
                repaymentPlan
              }}
            />
          </div>
          <div className="mt-8">
            <ExportShareButtons
              calculatorType="student-loan-us"
              inputs={{ loanAmount, interestRate, loanTerm, repaymentPlan, gracePeriod }}
              results={results}
              title="Student Loan Repayment Plan"
            />
          </div>
        </>
      )}
    </CalculatorLayoutWithAds>
  );
}