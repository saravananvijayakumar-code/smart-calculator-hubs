import { useState } from 'react';
import { Calculator, CreditCard, DollarSign, Calendar, Plus, Trash2, Brain, TrendingUp, AlertTriangle, CheckCircle, Target, Lightbulb, BookOpen, Shield, Clock, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency, formatPercentage } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { DebtConsolidationAnalysisData } from '~backend/ai-analysis/types';


interface Debt {
  id: string;
  name: string;
  balance: number;
  interestRate: number;
  minimumPayment: number;
}

interface ConsolidationCalculation {
  currentTotalBalance: number;
  currentTotalMinimumPayments: number;
  currentWeightedAPR: number;
  newMonthlyPayment: number;
  newTotalInterest: number;
  newPayoffTime: number;
  totalSavings: number;
  monthlySavings: number;
  isWorthwhile: boolean;
}

interface EducationalSection {
  title: string;
  content: string;
  icon: React.ReactNode;
}

export function DebtConsolidationCalculatorUS() {
  const [debts, setDebts] = useState<Debt[]>([
    { id: '1', name: 'Credit Card 1', balance: 5000, interestRate: 18.99, minimumPayment: 150 },
    { id: '2', name: 'Credit Card 2', balance: 3000, interestRate: 22.99, minimumPayment: 90 }
  ]);
  const [consolidationRate, setConsolidationRate] = useState<string>('12.5');
  const [consolidationTerm, setConsolidationTerm] = useState<string>('60');
  const [consolidationType, setConsolidationType] = useState<string>('personal-loan');
  const [results, setResults] = useState<ConsolidationCalculation | null>(null);
  const [showEducationalContent, setShowEducationalContent] = useState(false);

  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: `Debt ${debts.length + 1}`,
      balance: 0,
      interestRate: 0,
      minimumPayment: 0
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter(debt => debt.id !== id));
    }
  };

  const updateDebt = (id: string, field: keyof Debt, value: string | number) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  const calculateConsolidation = () => {
    const validDebts = debts.filter(debt => debt.balance > 0 && debt.interestRate > 0);
    
    if (validDebts.length === 0) {
      setResults(null);
      return;
    }

    const rate = parseFloat(consolidationRate) / 100 || 0;
    const months = parseInt(consolidationTerm) || 0;

    // Calculate current debt totals
    const currentTotalBalance = validDebts.reduce((sum, debt) => sum + debt.balance, 0);
    const currentTotalMinimumPayments = validDebts.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    
    // Calculate weighted average APR
    const totalInterestPayments = validDebts.reduce((sum, debt) => sum + (debt.balance * debt.interestRate / 100), 0);
    const currentWeightedAPR = currentTotalBalance > 0 ? (totalInterestPayments / currentTotalBalance) * 100 : 0;

    // Calculate new consolidated loan payment
    const monthlyRate = rate / 12;
    let newMonthlyPayment = 0;
    
    if (currentTotalBalance > 0 && rate > 0 && months > 0) {
      newMonthlyPayment = (currentTotalBalance * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                         (Math.pow(1 + monthlyRate, months) - 1);
    } else if (currentTotalBalance > 0 && months > 0) {
      newMonthlyPayment = currentTotalBalance / months;
    }

    const newTotalPaid = newMonthlyPayment * months;
    const newTotalInterest = newTotalPaid - currentTotalBalance;

    // Calculate current total interest (simplified estimate)
    const averageMonthsToPayoff = 60; // Estimate for minimum payments
    const currentTotalInterestEstimate = validDebts.reduce((sum, debt) => {
      const monthsToPayoff = Math.log(1 + (debt.balance * (debt.interestRate / 100 / 12)) / debt.minimumPayment) / 
                            Math.log(1 + (debt.interestRate / 100 / 12));
      return sum + (debt.minimumPayment * Math.min(monthsToPayoff, 360) - debt.balance);
    }, 0);

    const totalSavings = currentTotalInterestEstimate - newTotalInterest;
    const monthlySavings = currentTotalMinimumPayments - newMonthlyPayment;
    const isWorthwhile = totalSavings > 0 && rate < currentWeightedAPR;

    setResults({
      currentTotalBalance,
      currentTotalMinimumPayments,
      currentWeightedAPR,
      newMonthlyPayment,
      newTotalInterest,
      newPayoffTime: months,
      totalSavings,
      monthlySavings,
      isWorthwhile
    });
  };



  const getAIAnalysisData = (): DebtConsolidationAnalysisData | null => {
    if (!results) return null;
    
    return {
      currentTotalBalance: results.currentTotalBalance,
      currentWeightedAPR: results.currentWeightedAPR,
      consolidationRate: parseFloat(consolidationRate) || 0,
      consolidationTerm: parseInt(consolidationTerm) || 0,
      currentTotalMinimumPayments: results.currentTotalMinimumPayments,
      newMonthlyPayment: results.newMonthlyPayment,
      totalSavings: results.totalSavings,
      monthlySavings: results.monthlySavings
    };
  };

  const educationalSections: EducationalSection[] = [
    {
      title: "Understanding Debt Consolidation",
      icon: <BookOpen className="h-5 w-5" />,
      content: "Debt consolidation combines multiple debts into a single loan, ideally with better terms. This strategy can simplify your finances, potentially lower your interest rates, and help you pay off debt faster. The key is securing a consolidation loan with a lower APR than your current average rate."
    },
    {
      title: "Types of Consolidation Options",
      icon: <Target className="h-5 w-5" />,
      content: "Personal loans offer fixed rates and terms, making payments predictable. Balance transfer credit cards provide 0% intro rates but require discipline. Home equity loans offer lower rates but risk your home. HELOCs provide flexibility but have variable rates. Choose based on your credit score, debt amount, and risk tolerance."
    },
    {
      title: "When Consolidation Makes Sense",
      icon: <CheckCircle className="h-5 w-5" />,
      content: "Consolidation is most beneficial when you qualify for a significantly lower interest rate, have good credit, and can commit to not accumulating new debt. It's ideal for high-interest credit card debt, multiple monthly payments, or when you need a structured payoff plan."
    },
    {
      title: "Potential Risks and Pitfalls",
      icon: <AlertTriangle className="h-5 w-5" />,
      content: "Extending your payoff period may increase total interest paid despite lower monthly payments. Secured loans like home equity put assets at risk. Some consolidation loans have origination fees. The biggest risk is accumulating new debt after consolidating, leading to a worse financial situation."
    },
    {
      title: "Improving Your Credit Score",
      icon: <TrendingUp className="h-5 w-5" />,
      content: "Debt consolidation can improve your credit score by reducing credit utilization ratios and simplifying payments to avoid missed due dates. However, hard credit inquiries may temporarily lower your score. Closing old accounts can reduce credit history length, so consider keeping them open."
    },
    {
      title: "Alternative Debt Strategies",
      icon: <Lightbulb className="h-5 w-5" />,
      content: "The debt avalanche method focuses on paying highest-interest debt first, minimizing total interest. The debt snowball method targets smallest balances first for psychological wins. Debt management plans through credit counseling offer structured repayment. Consider these alternatives if consolidation isn't beneficial."
    },
    {
      title: "Building Long-term Financial Health",
      icon: <Shield className="h-5 w-5" />,
      content: "Create an emergency fund to avoid future debt. Build a budget that allocates funds for debt repayment and savings. Automate payments to ensure consistency. Focus on increasing income through career development or side hustles. Establish healthy spending habits to prevent debt accumulation."
    },
    {
      title: "Choosing the Right Lender",
      icon: <Wallet className="h-5 w-5" />,
      content: "Compare APRs, fees, and terms from multiple lenders including banks, credit unions, and online lenders. Credit unions often offer competitive rates to members. Online lenders may have faster approval but higher rates. Check for prepayment penalties, origination fees, and customer service quality."
    }
  ];

  const tips = [
    "Consolidation works best when you secure a lower interest rate",
    "Consider balance transfer cards for short-term debt",
    "Personal loans offer fixed rates and predictable payments",
    "Avoid taking on new debt after consolidating",
    "Compare total cost, not just monthly payment amounts",
    "Check for origination fees and prepayment penalties",
    "Credit unions often offer competitive consolidation rates",
    "Use consolidation as part of a broader debt elimination strategy"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Debt Consolidation Calculator"
      description="Compare debt consolidation options and calculate potential savings from combining multiple debts into one loan."
      keywords="debt consolidation calculator, debt payoff, personal loan, credit card debt"
      tips={tips}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Debts
            </CardTitle>
            <CardDescription>
              Enter your existing debts and consolidation loan details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {debts.map((debt, index) => (
              <div key={debt.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <Input
                    placeholder="Debt name"
                    value={debt.name}
                    onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                    className="flex-1 mr-2"
                  />
                  {debts.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDebt(debt.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Balance</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                      <Input
                        type="number"
                        placeholder="5000"
                        value={debt.balance || ''}
                        onChange={(e) => updateDebt(debt.id, 'balance', parseFloat(e.target.value) || 0)}
                        className="pl-7 text-xs"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">APR %</Label>
                    <div className="relative">
                      <Calculator className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="18.99"
                        value={debt.interestRate || ''}
                        onChange={(e) => updateDebt(debt.id, 'interestRate', parseFloat(e.target.value) || 0)}
                        className="pl-7 text-xs"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-xs">Min Payment</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3 w-3" />
                      <Input
                        type="number"
                        placeholder="150"
                        value={debt.minimumPayment || ''}
                        onChange={(e) => updateDebt(debt.id, 'minimumPayment', parseFloat(e.target.value) || 0)}
                        className="pl-7 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <Button variant="outline" onClick={addDebt} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Another Debt
            </Button>

            <div className="border-t pt-4 space-y-4">
              <h4 className="font-semibold">Consolidation Loan Details</h4>
              
              <div className="space-y-2">
                <Label htmlFor="consolidationType">Loan Type</Label>
                <Select value={consolidationType} onValueChange={setConsolidationType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal-loan">Personal Loan</SelectItem>
                    <SelectItem value="balance-transfer">Balance Transfer Card</SelectItem>
                    <SelectItem value="home-equity">Home Equity Loan</SelectItem>
                    <SelectItem value="heloc">HELOC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consolidationRate">Interest Rate</Label>
                <div className="relative">
                  <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="consolidationRate"
                    type="number"
                    step="0.1"
                    placeholder="12.5"
                    value={consolidationRate}
                    onChange={(e) => setConsolidationRate(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="consolidationTerm">Loan Term</Label>
                <Select value={consolidationTerm} onValueChange={setConsolidationTerm}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24">24 months (2 years)</SelectItem>
                    <SelectItem value="36">36 months (3 years)</SelectItem>
                    <SelectItem value="48">48 months (4 years)</SelectItem>
                    <SelectItem value="60">60 months (5 years)</SelectItem>
                    <SelectItem value="72">72 months (6 years)</SelectItem>
                    <SelectItem value="84">84 months (7 years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={calculateConsolidation} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Analyze Consolidation
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consolidation Analysis</CardTitle>
            <CardDescription>
              Compare your current debts vs. consolidation loan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                    <div className="text-lg font-bold text-red-600">
                      {formatCurrency(results.currentTotalMinimumPayments)}
                    </div>
                    <div className="text-sm text-muted-foreground">Current Payments</div>
                    <div className="text-xs text-red-500">{results.currentWeightedAPR.toFixed(2)}% Avg APR</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">
                      {formatCurrency(results.newMonthlyPayment)}
                    </div>
                    <div className="text-sm text-muted-foreground">New Payment</div>
                    <div className="text-xs text-blue-500">{consolidationRate}% APR</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Debt Balance:</span>
                    <span className="font-semibold">{formatCurrency(results.currentTotalBalance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monthly Payment Change:</span>
                    <span className={`font-semibold ${results.monthlySavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.monthlySavings > 0 ? '-' : '+'}{formatCurrency(Math.abs(results.monthlySavings))}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>New Payoff Time:</span>
                    <span className="font-semibold">{results.newPayoffTime} months</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Total Interest Savings:</span>
                    <span className={`font-semibold ${results.totalSavings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {results.totalSavings > 0 ? '' : '-'}{formatCurrency(Math.abs(results.totalSavings))}
                    </span>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  results.isWorthwhile 
                    ? 'bg-green-50 dark:bg-green-950' 
                    : 'bg-yellow-50 dark:bg-yellow-950'
                }`}>
                  <h4 className={`font-semibold mb-2 ${
                    results.isWorthwhile 
                      ? 'text-green-800 dark:text-green-200' 
                      : 'text-yellow-800 dark:text-yellow-200'
                  }`}>
                    {results.isWorthwhile 
                      ? '✅ Consolidation Recommended' 
                      : '⚠️ Review Carefully'
                    }
                  </h4>
                  <ul className={`text-sm space-y-1 ${
                    results.isWorthwhile 
                      ? 'text-green-700 dark:text-green-300' 
                      : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {results.isWorthwhile ? (
                      <>
                        <li>• Lower interest rate will save you money</li>
                        <li>• Simplified payments with one monthly bill</li>
                        <li>• Consider automatic payments for rate discounts</li>
                        <li>• Avoid taking on new debt after consolidating</li>
                      </>
                    ) : (
                      <>
                        <li>• Interest rate may not provide significant savings</li>
                        <li>• Consider debt avalanche or snowball methods</li>
                        <li>• Look for promotional balance transfer offers</li>
                        <li>• Focus on paying more than minimums first</li>
                      </>
                    )}
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Loan Type Insights</h4>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    {consolidationType === 'personal-loan' && (
                      <p>Personal loans offer fixed rates and predictable payments, typically 2-7 years.</p>
                    )}
                    {consolidationType === 'balance-transfer' && (
                      <p>Balance transfer cards often have 0% intro rates but watch for high rates after promotion ends.</p>
                    )}
                    {consolidationType === 'home-equity' && (
                      <p>Home equity loans offer lower rates but put your home at risk if you can't repay.</p>
                    )}
                    {consolidationType === 'heloc' && (
                      <p>HELOCs offer flexibility but have variable rates that can increase over time.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <CreditCard className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Enter your debt details to see consolidation analysis</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Educational Content Section */}
      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Complete Guide to Debt Consolidation</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowEducationalContent(!showEducationalContent)}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            {showEducationalContent ? 'Hide Guide' : 'Show Complete Guide'}
          </Button>
        </div>
        
        {showEducationalContent && (
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="understanding" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="understanding">Basics</TabsTrigger>
                  <TabsTrigger value="options">Options</TabsTrigger>
                  <TabsTrigger value="strategy">Strategy</TabsTrigger>
                  <TabsTrigger value="health">Financial Health</TabsTrigger>
                </TabsList>
                
                <TabsContent value="understanding" className="space-y-4">
                  <div className="grid gap-6">
                    {educationalSections.slice(0, 2).map((section, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {section.icon}
                          <h3 className="text-xl font-semibold">{section.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="options" className="space-y-4">
                  <div className="grid gap-6">
                    {educationalSections.slice(2, 4).map((section, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {section.icon}
                          <h3 className="text-xl font-semibold">{section.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="strategy" className="space-y-4">
                  <div className="grid gap-6">
                    {educationalSections.slice(4, 6).map((section, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {section.icon}
                          <h3 className="text-xl font-semibold">{section.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="health" className="space-y-4">
                  <div className="grid gap-6">
                    {educationalSections.slice(6, 8).map((section, index) => (
                      <div key={index} className="border rounded-lg p-6">
                        <div className="flex items-center gap-3 mb-3">
                          {section.icon}
                          <h3 className="text-xl font-semibold">{section.title}</h3>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Comprehensive Educational Content */}
      <div className="mt-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Debt Consolidation: Your Complete Financial Strategy Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <div className="space-y-6 text-muted-foreground">
              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">What Is Debt Consolidation and How Does It Work?</h3>
                <p className="leading-relaxed mb-4">
                  Debt consolidation is a financial strategy that combines multiple debts into a single loan or payment plan. Instead of juggling several credit card payments, personal loans, or other debts with varying interest rates and due dates, you obtain one new loan to pay off all existing debts. This leaves you with just one monthly payment, ideally at a lower interest rate than what you were paying before.
                </p>
                <p className="leading-relaxed mb-4">
                  The process typically involves evaluating your current debts, shopping for consolidation options, applying for a new loan, using the funds to pay off existing debts, and then making regular payments on the new consolidated loan. Success depends largely on securing better terms than your current situation and maintaining discipline to avoid accumulating new debt.
                </p>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">Types of Debt Consolidation Methods</h3>
                <div className="grid gap-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Personal Loans
                    </h4>
                    <p className="text-sm mt-2">
                      Unsecured loans with fixed interest rates and terms, typically 2-7 years. Best for borrowers with good credit seeking predictable payments and clear payoff timelines.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Balance Transfer Cards
                    </h4>
                    <p className="text-sm mt-2">
                      Credit cards offering 0% introductory APR for 12-21 months. Ideal for those who can pay off debt quickly and qualify for promotional rates.
                    </p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Home Equity Loans/HELOCs
                    </h4>
                    <p className="text-sm mt-2">
                      Secured loans using home equity as collateral. Offer lower rates but put your home at risk. Best for homeowners with significant equity and stable income.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">When Debt Consolidation Makes Financial Sense</h3>
                <p className="leading-relaxed mb-4">
                  Debt consolidation is most beneficial when you can secure a significantly lower interest rate than your current weighted average APR. It's particularly valuable if you're paying high credit card interest rates (often 18-29%) and can qualify for a personal loan at 6-15%. The strategy works best for borrowers with good credit scores (660+) who have steady income and are committed to not accumulating new debt.
                </p>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Ideal Scenarios for Consolidation:</h4>
                  <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                    <li>• Multiple high-interest credit card debts</li>
                    <li>• Good credit score enabling lower rates</li>
                    <li>• Stable income for consistent payments</li>
                    <li>• Desire for simplified payment structure</li>
                    <li>• Commitment to avoid new debt accumulation</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">Understanding the Risks and Potential Pitfalls</h3>
                <p className="leading-relaxed mb-4">
                  While debt consolidation can be an effective strategy, it's not without risks. The most significant danger is the temptation to accumulate new debt after consolidating, potentially leaving you in a worse financial position. Extended repayment terms might lower monthly payments but increase total interest paid over time.
                </p>
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">Common Pitfalls to Avoid:</h4>
                  <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                    <li>• Focusing only on lower monthly payments, not total cost</li>
                    <li>• Ignoring origination fees and closing costs</li>
                    <li>• Using home equity without considering foreclosure risk</li>
                    <li>• Closing old credit accounts, reducing credit history</li>
                    <li>• Continuing spending habits that created debt</li>
                  </ul>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">Impact on Your Credit Score</h3>
                <p className="leading-relaxed mb-4">
                  Debt consolidation can positively impact your credit score by improving your credit utilization ratio and simplifying payment schedules, reducing the risk of missed payments. However, the application process involves hard credit inquiries that may temporarily lower your score by a few points.
                </p>
                <p className="leading-relaxed mb-4">
                  Long-term benefits include improved payment history (35% of your score), lower credit utilization (30% of your score), and potentially better credit mix (10% of your score). Avoid closing old credit accounts after consolidation, as this can reduce your credit history length and available credit limit.
                </p>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">Alternative Debt Elimination Strategies</h3>
                <p className="leading-relaxed mb-4">
                  If debt consolidation isn't beneficial for your situation, consider alternative strategies. The debt avalanche method involves paying minimum amounts on all debts while directing extra payments toward the highest-interest debt. This approach minimizes total interest paid but requires discipline and patience.
                </p>
                <div className="grid gap-4 mb-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground">Debt Avalanche Method</h4>
                    <p className="text-sm mt-2">Focus extra payments on highest-interest debt first. Mathematically optimal for minimizing total interest paid.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground">Debt Snowball Method</h4>
                    <p className="text-sm mt-2">Pay off smallest balances first for psychological wins and momentum. May cost more in interest but provides motivation.</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold text-foreground">Debt Management Plans</h4>
                    <p className="text-sm mt-2">Work with credit counseling agencies for structured repayment plans, often with reduced interest rates from creditors.</p>
                  </div>
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">Building Long-term Financial Health</h3>
                <p className="leading-relaxed mb-4">
                  Successful debt consolidation is just the beginning of building lasting financial health. Create an emergency fund of 3-6 months' expenses to avoid future debt accumulation. Develop a realistic budget that includes debt payments, essential expenses, and savings goals.
                </p>
                <p className="leading-relaxed mb-4">
                  Focus on increasing your income through career development, skill building, or side hustles. Automate your consolidated debt payments to ensure consistency and avoid late fees. Most importantly, address the underlying spending habits that led to debt accumulation in the first place.
                </p>
              </section>

              <Separator />

              <section>
                <h3 className="text-xl font-semibold text-foreground mb-3">Choosing the Right Consolidation Lender</h3>
                <p className="leading-relaxed mb-4">
                  Research multiple lenders including traditional banks, credit unions, and online lenders. Credit unions often offer competitive rates to members and may have more flexible qualification criteria. Online lenders typically provide faster application processes but may have higher rates than banks.
                </p>
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Key Factors to Compare:</h4>
                  <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                    <li>• Annual Percentage Rate (APR) including all fees</li>
                    <li>• Origination fees and closing costs</li>
                    <li>• Prepayment penalties</li>
                    <li>• Loan terms and monthly payment amounts</li>
                    <li>• Customer service quality and reviews</li>
                    <li>• Speed of funding and application process</li>
                  </ul>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Analysis Section */}
      {results && getAIAnalysisData() && (
        <div className="mt-8 space-y-6">
          <AIAnalysis
            analysisRequest={{
              calculatorType: "debt-consolidation",
              data: getAIAnalysisData()!
            }}
            className="w-full"
          />

          <ExportShareButtons
            calculatorType="debt-consolidation"
            inputs={{
              totalDebtBalance: results.currentTotalBalance,
              weightedAverageAPR: results.currentWeightedAPR,
              consolidationRate: parseFloat(consolidationRate) || 0,
              consolidationTerm: parseInt(consolidationTerm) || 0
            }}
            results={{
              monthlyPaymentBefore: results.currentTotalMinimumPayments,
              monthlyPaymentAfter: results.newMonthlyPayment,
              monthlySavings: results.monthlySavings,
              totalInterestBefore: 0,
              totalInterestAfter: results.newTotalInterest,
              totalSavings: results.totalSavings
            }}
            title="Debt Consolidation Calculator Report"
          />
        </div>
      )}

    </CalculatorLayoutWithAds>
  );
}