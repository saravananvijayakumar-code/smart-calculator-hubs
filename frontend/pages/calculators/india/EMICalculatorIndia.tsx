import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { AIAnalysis } from '../../../components/AIAnalysis';
import { SEOHead } from '../../../components/SEOHead';
import { formatCurrency } from '../../../utils/formatting';

interface AmortizationEntry {
  month: number;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export function EMICalculatorIndia() {
  const [loanAmount, setLoanAmount] = useState<string>('2500000');
  const [interestRate, setInterestRate] = useState<string>('8.5');
  const [tenure, setTenure] = useState<string>('20');
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  const [showResults, setShowResults] = useState(false);

  const calculateEMI = () => {
    const P = parseFloat(loanAmount) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const R = annualRate / 12 / 100;
    const tenureValue = parseFloat(tenure) || 0;
    const N = tenureType === 'years' ? tenureValue * 12 : tenureValue;

    if (P <= 0 || R <= 0 || N <= 0) return null;

    const emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emi * N;
    const totalInterest = totalPayment - P;

    const amortization: AmortizationEntry[] = [];
    let balance = P;

    for (let i = 1; i <= Math.min(N, 360); i++) {
      const interestPayment = balance * R;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      amortization.push({
        month: i,
        emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    return {
      emi,
      totalPayment,
      totalInterest,
      principal: P,
      tenure: N,
      amortization
    };
  };

  const results = calculateEMI();

  const handleCalculate = () => {
    setShowResults(true);
  };

  return (
    <>
      <SEOHead
        title="EMI Calculator India - Home Loan, Car Loan, Personal Loan EMI Calculator"
        description="Calculate your Equated Monthly Installment (EMI) for home loans, car loans, and personal loans in India. Get detailed amortization schedule and tax benefit information."
        keywords="emi calculator, emi calculator india, home loan emi, car loan emi, personal loan emi, loan emi, equated monthly installment, emi calculation"
      />

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              EMI Calculator India
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Calculate your monthly loan payments for home loans, car loans, and personal loans with detailed amortization schedule
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <AppleStyleInput
                  label="Loan Amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="2500000"
                  prefix="₹"
                />

                <AppleStyleInput
                  label="Interest Rate (per annum)"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="8.5"
                  suffix="%"
                  step="0.1"
                />

                <div className="space-y-2">
                  <Label>Loan Tenure</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <AppleStyleInput
                      type="number"
                      value={tenure}
                      onChange={(e) => setTenure(e.target.value)}
                      placeholder="20"
                    />
                    <Select value={tenureType} onValueChange={(value: 'years' | 'months') => setTenureType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="years">Years</SelectItem>
                        <SelectItem value="months">Months</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button 
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                  size="lg"
                >
                  Calculate EMI
                </Button>
              </CardContent>
            </Card>

            {results && (
              <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                    Your EMI Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-white rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-2">Monthly EMI</p>
                    <p className="text-4xl font-bold text-orange-600">
                      {formatCurrency(results.emi, 'INR')}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">Principal Amount</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(results.principal, 'INR')}
                      </p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                      <p className="text-xs text-gray-600 mb-1">Total Interest</p>
                      <p className="text-lg font-semibold text-red-600">
                        {formatCurrency(results.totalInterest, 'INR')}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <p className="text-sm text-gray-600 mb-2">Total Payment</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(results.totalPayment, 'INR')}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-orange-600" />
                      <p className="font-semibold">Payment Breakdown</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Principal:</span>
                        <span className="font-semibold">
                          {((results.principal / results.totalPayment) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(results.principal / results.totalPayment) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mt-3">
                        <span>Interest:</span>
                        <span className="font-semibold">
                          {((results.totalInterest / results.totalPayment) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(results.totalInterest / results.totalPayment) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {results && results.amortization.length > 0 && (
            <Card className="shadow-lg mb-12">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-6 w-6 text-orange-600" />
                  Amortization Schedule (First 12 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-3 text-left">Month</th>
                        <th className="p-3 text-right">EMI</th>
                        <th className="p-3 text-right">Principal</th>
                        <th className="p-3 text-right">Interest</th>
                        <th className="p-3 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.amortization.slice(0, 12).map((entry) => (
                        <tr key={entry.month} className="border-b hover:bg-gray-50">
                          <td className="p-3">{entry.month}</td>
                          <td className="p-3 text-right">{formatCurrency(entry.emi, 'INR')}</td>
                          <td className="p-3 text-right text-green-600">{formatCurrency(entry.principal, 'INR')}</td>
                          <td className="p-3 text-right text-red-600">{formatCurrency(entry.interest, 'INR')}</td>
                          <td className="p-3 text-right font-semibold">{formatCurrency(entry.balance, 'INR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {showResults && results && (
            <div className="mb-12">
              <AIAnalysis
                analysisRequest={{
                  calculatorType: 'emi_india',
                  data: {
                    loanAmount: results.principal,
                    interestRate: parseFloat(interestRate),
                    tenure: results.tenure,
                    emi: results.emi,
                    totalInterest: results.totalInterest,
                    totalPayment: results.totalPayment
                  }
                }}
              />
            </div>
          )}

          <div className="prose prose-lg max-w-none space-y-8">
            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">What is EMI?</h2>
                <p className="text-gray-700 mb-4">
                  EMI stands for <strong>Equated Monthly Installment</strong>. It is a fixed payment amount made by a borrower to a lender at a specified date each calendar month. EMIs are used to pay off both the principal and interest on a loan over a specific period, ensuring that the loan is fully paid by the end of the tenure.
                </p>
                <p className="text-gray-700 mb-4">
                  In India, EMIs are the most common way to repay loans, including home loans, car loans, personal loans, and education loans. The EMI payment structure makes it easier for borrowers to plan their finances as they know exactly how much they need to pay each month.
                </p>
                <p className="text-gray-700">
                  The EMI amount remains constant throughout the loan tenure (in case of fixed-rate loans), but the proportion of principal and interest changes. In the initial years, a larger portion goes towards interest, while in later years, more goes towards the principal repayment.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">EMI Calculation Formula</h2>
                <p className="text-gray-700 mb-4">
                  The EMI is calculated using the following mathematical formula:
                </p>
                <div className="bg-orange-50 p-6 rounded-lg mb-4 text-center">
                  <p className="font-mono text-lg">
                    EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
                  </p>
                </div>
                <p className="text-gray-700 mb-4">Where:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>P</strong> = Principal loan amount</li>
                  <li><strong>R</strong> = Monthly interest rate (Annual rate / 12 / 100)</li>
                  <li><strong>N</strong> = Loan tenure in months</li>
                </ul>
                <h3 className="text-2xl font-bold mb-3">Example Calculation</h3>
                <p className="text-gray-700 mb-3">
                  Let's say you take a home loan of ₹25,00,000 at an annual interest rate of 8.5% for 20 years:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>P = ₹25,00,000</li>
                  <li>Annual Interest Rate = 8.5%</li>
                  <li>R = 8.5 / 12 / 100 = 0.00708333</li>
                  <li>N = 20 × 12 = 240 months</li>
                  <li>EMI = [25,00,000 × 0.00708333 × (1.00708333)^240] / [(1.00708333)^240 - 1]</li>
                  <li><strong>EMI ≈ ₹21,698</strong></li>
                  <li>Total Payment = ₹21,698 × 240 = ₹52,07,520</li>
                  <li>Total Interest = ₹52,07,520 - ₹25,00,000 = ₹27,07,520</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Types of Loans Using EMI in India</h2>
                
                <h3 className="text-2xl font-bold mb-3 mt-6">1. Home Loans</h3>
                <p className="text-gray-700 mb-3">
                  Home loans are the most popular type of loan in India, allowing individuals to purchase residential property.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Interest Rates:</strong> Typically range from 8.0% to 9.5% per annum</li>
                  <li><strong>Tenure:</strong> Usually 10 to 30 years</li>
                  <li><strong>Loan Amount:</strong> Up to 90% of property value (80-85% common)</li>
                  <li><strong>Tax Benefits:</strong> Section 80C (principal) and Section 24(b) (interest)</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3 mt-6">2. Car Loans</h3>
                <p className="text-gray-700 mb-3">
                  Car loans help finance the purchase of new or used vehicles.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Interest Rates:</strong> Typically 7.5% to 12% per annum</li>
                  <li><strong>Tenure:</strong> Usually 3 to 7 years</li>
                  <li><strong>Loan Amount:</strong> Up to 90% of vehicle value</li>
                  <li><strong>Processing:</strong> Quick approval, often within 24-48 hours</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3 mt-6">3. Personal Loans</h3>
                <p className="text-gray-700 mb-3">
                  Personal loans are unsecured loans that can be used for any purpose - medical emergencies, weddings, travel, debt consolidation, etc.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li><strong>Interest Rates:</strong> Typically 10.5% to 24% per annum (higher due to unsecured nature)</li>
                  <li><strong>Tenure:</strong> Usually 1 to 5 years</li>
                  <li><strong>Loan Amount:</strong> ₹50,000 to ₹40,00,000 (based on income)</li>
                  <li><strong>No Tax Benefits:</strong> Unlike home loans</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3 mt-6">4. Education Loans</h3>
                <p className="text-gray-700 mb-3">
                  Education loans help students finance higher education in India or abroad.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li><strong>Interest Rates:</strong> Typically 7.5% to 13% per annum</li>
                  <li><strong>Tenure:</strong> Usually 10 to 15 years</li>
                  <li><strong>Moratorium Period:</strong> Course duration + 6 months to 1 year</li>
                  <li><strong>Tax Benefits:</strong> Interest deduction under Section 80E (for 8 years)</li>
                  <li><strong>No Collateral:</strong> For loans up to ₹7.5 lakh</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Tax Benefits on Home Loans in India</h2>
                
                <h3 className="text-2xl font-bold mb-3 mt-4">Section 80C - Principal Repayment</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Deduction up to <strong>₹1.5 lakh per year</strong> on principal repayment</li>
                  <li>Available for self-occupied property only</li>
                  <li>Property should not be sold within 5 years of possession</li>
                  <li>Stamp duty and registration charges also eligible in the year of payment</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3 mt-6">Section 24(b) - Interest Deduction</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Deduction up to <strong>₹2 lakh per year</strong> on interest paid</li>
                  <li>For self-occupied property</li>
                  <li>No limit on interest deduction for let-out property</li>
                  <li>Pre-construction interest can be claimed in 5 equal installments</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3 mt-6">Section 80EEA - Additional Deduction for First-Time Buyers</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Additional deduction of <strong>₹1.5 lakh</strong> on interest</li>
                  <li>Only for first-time home buyers</li>
                  <li>Property value should be less than ₹45 lakh</li>
                  <li>Loan sanctioned between April 1, 2019, and March 31, 2022</li>
                </ul>

                <div className="bg-green-50 p-6 rounded-lg mt-6">
                  <h4 className="text-xl font-bold mb-3">Maximum Tax Benefit Example</h4>
                  <p className="text-gray-700 mb-3">
                    For a first-time home buyer in the highest tax bracket (30%):
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Principal deduction (80C): ₹1,50,000 × 30% = ₹45,000</li>
                    <li>Interest deduction (24b): ₹2,00,000 × 30% = ₹60,000</li>
                    <li>Additional interest (80EEA): ₹1,50,000 × 30% = ₹45,000</li>
                    <li><strong>Total Annual Tax Savings: ₹1,50,000</strong></li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Factors Affecting Your EMI</h2>
                
                <h3 className="text-2xl font-bold mb-3">1. Principal Amount Impact</h3>
                <p className="text-gray-700 mb-4">
                  The loan amount is directly proportional to EMI. A higher loan amount means a higher EMI and vice versa. Even a 10% increase in loan amount can significantly impact your monthly outflow and total interest paid over the tenure.
                </p>

                <h3 className="text-2xl font-bold mb-3">2. Interest Rate Sensitivity</h3>
                <p className="text-gray-700 mb-4">
                  Even a small change in interest rate can have a substantial impact on your EMI and total interest outflow. Let's see how a 0.5% difference affects a ₹25 lakh loan for 20 years:
                </p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-3 text-left">Interest Rate</th>
                        <th className="border p-3 text-right">Monthly EMI</th>
                        <th className="border p-3 text-right">Total Interest</th>
                        <th className="border p-3 text-right">Difference</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-3">8.0%</td>
                        <td className="border p-3 text-right">₹20,911</td>
                        <td className="border p-3 text-right">₹25,18,640</td>
                        <td className="border p-3 text-right">-</td>
                      </tr>
                      <tr>
                        <td className="border p-3">8.5%</td>
                        <td className="border p-3 text-right">₹21,698</td>
                        <td className="border p-3 text-right">₹27,07,520</td>
                        <td className="border p-3 text-right text-red-600">+₹1,88,880</td>
                      </tr>
                      <tr>
                        <td className="border p-3">9.0%</td>
                        <td className="border p-3 text-right">₹22,500</td>
                        <td className="border p-3 text-right">₹29,00,000</td>
                        <td className="border p-3 text-right text-red-600">+₹3,81,360</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-2xl font-bold mb-3 mt-6">3. Tenure Selection</h3>
                <p className="text-gray-700 mb-4">
                  Tenure has an inverse relationship with EMI but a direct relationship with total interest. Let's compare different tenures for a ₹25 lakh loan at 8.5%:
                </p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full border-collapse border">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-3 text-left">Tenure</th>
                        <th className="border p-3 text-right">Monthly EMI</th>
                        <th className="border p-3 text-right">Total Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border p-3">10 years</td>
                        <td className="border p-3 text-right">₹30,942</td>
                        <td className="border p-3 text-right">₹12,13,040</td>
                      </tr>
                      <tr>
                        <td className="border p-3">15 years</td>
                        <td className="border p-3 text-right">₹24,629</td>
                        <td className="border p-3 text-right">₹19,33,220</td>
                      </tr>
                      <tr>
                        <td className="border p-3">20 years</td>
                        <td className="border p-3 text-right">₹21,698</td>
                        <td className="border p-3 text-right">₹27,07,520</td>
                      </tr>
                      <tr>
                        <td className="border p-3">30 years</td>
                        <td className="border p-3 text-right">₹19,228</td>
                        <td className="border p-3 text-right">₹44,22,080</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-gray-700">
                  <strong>Key Insight:</strong> While a longer tenure reduces monthly EMI, it significantly increases the total interest paid. Choose the shortest tenure you can comfortably afford.
                </p>

                <h3 className="text-2xl font-bold mb-3 mt-6">4. Fixed vs Floating Interest Rates</h3>
                <p className="text-gray-700 mb-3">
                  <strong>Fixed Rate:</strong> EMI remains constant throughout the tenure. Provides certainty but usually starts higher than floating rates.
                </p>
                <p className="text-gray-700">
                  <strong>Floating Rate:</strong> EMI changes with market rates (linked to MCLR or repo rate). Can benefit from rate cuts but exposes you to rate hike risk. Most home loans in India are floating rate loans.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">EMI Payment Strategies</h2>
                
                <h3 className="text-2xl font-bold mb-3">1. Prepayment Strategies</h3>
                <p className="text-gray-700 mb-4">
                  Prepaying your loan can significantly reduce your interest burden. Here are effective prepayment strategies:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-gray-700 mb-6">
                  <li>
                    <strong>Partial Prepayment:</strong> Make lump sum payments whenever you have surplus funds (bonus, inheritance, tax refund). Most banks allow partial prepayment without penalty for floating rate loans.
                  </li>
                  <li>
                    <strong>Annual Prepayment:</strong> Commit to prepaying a fixed amount annually, say 10% of the outstanding principal. This can reduce your tenure by several years.
                  </li>
                  <li>
                    <strong>Step-up EMI:</strong> Increase your EMI by 5-10% every year as your income grows. This dramatically reduces interest outflow.
                  </li>
                  <li>
                    <strong>Early Years Focus:</strong> Prepayments in the first 5 years of the loan have the maximum impact as the outstanding principal is highest.
                  </li>
                </ul>

                <div className="bg-blue-50 p-6 rounded-lg mb-6">
                  <h4 className="text-xl font-bold mb-3">Prepayment Example</h4>
                  <p className="text-gray-700 mb-2">
                    Loan: ₹25 lakh at 8.5% for 20 years (EMI: ₹21,698)
                  </p>
                  <p className="text-gray-700 mb-2">
                    If you prepay ₹1 lakh every year:
                  </p>
                  <ul className="list-disc pl-6 space-y-1 text-gray-700">
                    <li>Tenure reduces from 20 years to approximately 13 years</li>
                    <li>Total interest paid: ₹16.8 lakh (vs ₹27.1 lakh)</li>
                    <li><strong>Interest Saved: ₹10.3 lakh</strong></li>
                  </ul>
                </div>

                <h3 className="text-2xl font-bold mb-3 mt-6">2. Balance Transfer Options</h3>
                <p className="text-gray-700 mb-4">
                  Transferring your loan to another lender offering lower interest rates can reduce your EMI or tenure.
                </p>
                <p className="text-gray-700 mb-3"><strong>When to Consider Balance Transfer:</strong></p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-4">
                  <li>Interest rate difference is at least 0.5% - 1%</li>
                  <li>Substantial loan amount and tenure remaining</li>
                  <li>Processing fees and charges are lower than potential savings</li>
                  <li>Your credit score has improved since taking the original loan</li>
                </ul>
                <p className="text-gray-700 mb-3"><strong>Costs vs Benefits:</strong></p>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Processing fee: 0.5% - 1% of loan amount</li>
                  <li>Legal and technical charges: ₹5,000 - ₹10,000</li>
                  <li>Prepayment charges on old loan: Usually nil for floating rate home loans</li>
                  <li>Calculate break-even: Time taken to recover the transfer costs from EMI savings</li>
                </ul>

                <h3 className="text-2xl font-bold mb-3 mt-6">3. EMI Affordability Rules</h3>
                <p className="text-gray-700 mb-4">
                  Financial experts recommend that your total EMI obligations (all loans combined) should not exceed <strong>40-50% of your monthly income</strong>.
                </p>
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Affordability Example</h4>
                  <p className="text-gray-700 mb-2">Monthly Income: ₹1,00,000</p>
                  <p className="text-gray-700 mb-2">Maximum EMI (40%): ₹40,000</p>
                  <p className="text-gray-700 mb-4">Maximum EMI (50%): ₹50,000</p>
                  <p className="text-gray-700 mb-2">
                    If you already have a car loan EMI of ₹15,000, your home loan EMI should ideally be between ₹25,000 - ₹35,000 to maintain financial stability.
                  </p>
                  <p className="text-gray-700 font-semibold mt-4">
                    Remember: Keep a buffer for emergencies, investments, and lifestyle expenses. Don't max out your EMI capacity.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Common EMI Mistakes to Avoid</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-red-600">1. Taking Maximum Eligible Loan</h3>
                    <p className="text-gray-700">
                      Just because a bank approves you for a ₹50 lakh loan doesn't mean you should take it. Borrow based on your actual need and comfortable repayment capacity, not maximum eligibility. Leave room for other financial goals and emergencies.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-red-600">2. Ignoring Processing Fees and Hidden Costs</h3>
                    <p className="text-gray-700">
                      Many borrowers focus only on interest rates and ignore other costs like processing fees (0.5-2% of loan amount), legal charges, valuation fees, insurance, and prepayment penalties. These can add ₹50,000 - ₹1,00,000 to your loan cost.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-red-600">3. Not Reading the Fine Print</h3>
                    <p className="text-gray-700">
                      Always read the loan agreement thoroughly. Check for clauses related to prepayment penalties, interest rate reset frequency (for floating rate loans), foreclosure charges, and bounce charges. Some lenders have unfavorable terms hidden in complex legal language.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-red-600">4. Missing EMI Payments</h3>
                    <p className="text-gray-700">
                      Missing even one EMI payment can have serious consequences: late payment fees (₹500-₹1,000 per delay), negative impact on CIBIL score (can drop by 50-100 points), and difficulty in getting loans in the future. Set up auto-debit to avoid missing payments.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-red-600">5. Choosing Wrong Tenure</h3>
                    <p className="text-gray-700">
                      Many borrowers opt for maximum tenure to get lower EMI, but this means paying 2-3 times the principal amount in interest. Conversely, choosing too short a tenure can strain your monthly budget. Find the right balance based on your income growth trajectory and other financial commitments.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-red-600">6. Not Considering Insurance</h3>
                    <p className="text-gray-700">
                      While home loan insurance is not mandatory, it protects your family from the burden of the loan in case of your untimely death. The premium is tax-deductible and provides peace of mind. Similarly, consider critical illness riders.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-red-600">7. Ignoring the Impact of Inflation on Income</h3>
                    <p className="text-gray-700">
                      While your EMI remains fixed (for fixed-rate loans), your income typically grows with time due to salary hikes and inflation. What seems like a high EMI today (40% of income) will become more manageable in 5-10 years. However, don't bank entirely on future income growth when deciding loan amount.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">EMI Affordability - The 50/30/20 Rule</h2>
                <p className="text-gray-700 mb-4">
                  The 50/30/20 rule is a simple budgeting framework that can help you manage your finances while servicing EMIs:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">50% - Needs</h3>
                    <p className="text-gray-700 mb-2">Essential expenses including:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                      <li>EMIs (home, car, personal loans)</li>
                      <li>Rent (if not paid off)</li>
                      <li>Utilities (electricity, water, gas)</li>
                      <li>Groceries</li>
                      <li>Insurance premiums</li>
                      <li>Transportation</li>
                    </ul>
                  </div>

                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">30% - Wants</h3>
                    <p className="text-gray-700 mb-2">Lifestyle and discretionary spending:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                      <li>Dining out and entertainment</li>
                      <li>Shopping (clothes, gadgets)</li>
                      <li>Hobbies and recreation</li>
                      <li>Vacations and travel</li>
                      <li>Subscriptions (OTT, gym)</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-lg">
                    <h3 className="text-xl font-bold mb-3">20% - Savings</h3>
                    <p className="text-gray-700 mb-2">Future planning and wealth building:</p>
                    <ul className="list-disc pl-6 space-y-1 text-sm text-gray-700">
                      <li>Emergency fund (6 months expenses)</li>
                      <li>Retirement savings (EPF, NPS, PPF)</li>
                      <li>Investments (mutual funds, stocks)</li>
                      <li>Children's education fund</li>
                      <li>Additional loan prepayment</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Example: ₹1,00,000 Monthly Income</h4>
                  <div className="space-y-3 text-gray-700">
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span>Monthly Income:</span>
                      <span className="font-bold">₹1,00,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Needs (50%):</span>
                      <span className="font-semibold">₹50,000</span>
                    </div>
                    <div className="pl-6 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>• Home Loan EMI:</span>
                        <span>₹25,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Car Loan EMI:</span>
                        <span>₹10,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Utilities & Groceries:</span>
                        <span>₹15,000</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span>Wants (30%):</span>
                      <span className="font-semibold">₹30,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Savings (20%):</span>
                      <span className="font-semibold">₹20,000</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 italic">
                    Note: This is a guideline. Adjust percentages based on your life stage, city, and financial goals. In expensive cities, needs might go up to 60-65%.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions (FAQ)</h2>
                
                <div className="space-y-4">
                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      What is the difference between reducing balance and flat rate interest?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      <strong>Reducing Balance:</strong> Interest is calculated on the outstanding principal, which reduces with each EMI payment. This is the most common and borrower-friendly method used in India. Your interest burden decreases over time.
                      <br /><br />
                      <strong>Flat Rate:</strong> Interest is calculated on the original principal throughout the tenure, even though you're paying it back. This results in a much higher effective interest rate. A 10% flat rate is equivalent to approximately 18-19% reducing balance rate.
                      <br /><br />
                      Always check which method is being used. All our calculators use the reducing balance method, which is standard for home, car, and personal loans in India.
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      Can I change my EMI amount during the loan tenure?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      Yes, there are several ways to change your EMI:
                      <br /><br />
                      <strong>1. Step-up EMI:</strong> Some lenders offer increasing EMI schemes where your EMI increases by a fixed percentage every year. Good for young professionals expecting salary growth.
                      <br /><br />
                      <strong>2. Partial Prepayment:</strong> After making a lump sum prepayment, you can choose to either reduce tenure (EMI stays same) or reduce EMI (tenure stays same).
                      <br /><br />
                      <strong>3. Balance Transfer:</strong> Moving to a new lender with different interest rates will change your EMI.
                      <br /><br />
                      <strong>4. Top-up Loan:</strong> Taking an additional loan will increase your total EMI.
                      <br /><br />
                      Note: For fixed-rate loans, the EMI remains constant. For floating-rate loans, EMI may change when the lender revises interest rates based on RBI policy changes or MCLR adjustments.
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      What happens if I miss an EMI payment?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      Missing an EMI payment can have several consequences:
                      <br /><br />
                      <strong>Immediate Impact:</strong>
                      <br />• Late payment fee charged (typically ₹500-₹1,000)
                      <br />• Penal interest of 2-4% per annum on the overdue amount
                      <br />• Daily interest accumulation on the unpaid EMI
                      <br /><br />
                      <strong>CIBIL Score Impact:</strong>
                      <br />• 30 days overdue: Score can drop by 50-80 points
                      <br />• 60 days overdue: Score can drop by 100+ points
                      <br />• 90+ days overdue: Marked as default, severe score damage
                      <br /><br />
                      <strong>Long-term Consequences:</strong>
                      <br />• Difficulty in getting future loans
                      <br />• Higher interest rates even if approved
                      <br />• Legal action by lender for recovery
                      <br />• In case of secured loans (home/car), asset may be repossessed
                      <br /><br />
                      <strong>What to do if you can't pay:</strong> Contact your lender immediately. Many banks offer restructuring options, temporary EMI reduction, or moratorium during genuine financial hardship.
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      Is it better to reduce tenure or reduce EMI when prepaying?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      This depends on your financial goals and situation:
                      <br /><br />
                      <strong>Reduce Tenure (Keep EMI Same):</strong>
                      <br />✅ Saves more on total interest paid
                      <br />✅ Become debt-free faster
                      <br />✅ Better if you have stable income and no cash flow issues
                      <br />✅ Recommended for most borrowers
                      <br /><br />
                      <strong>Reduce EMI (Keep Tenure Same):</strong>
                      <br />✅ Improves monthly cash flow
                      <br />✅ Helpful during financial uncertainty
                      <br />✅ Better if you're approaching retirement
                      <br />✅ Good if you have other high-priority expenses
                      <br /><br />
                      <strong>Example:</strong> ₹25 lakh loan at 8.5% for 20 years, prepay ₹2 lakh after 2 years:
                      <br />• Reduce Tenure: Saves ₹5.2 lakh in interest, loan ends 3.5 years earlier
                      <br />• Reduce EMI: Saves ₹3.8 lakh in interest, EMI reduces by ₹1,850
                      <br /><br />
                      <strong>Recommendation:</strong> If you can afford it, always choose to reduce tenure for maximum interest savings. The goal should be to become debt-free as soon as possible.
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      What is MCLR and how does it affect my home loan EMI?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      MCLR stands for <strong>Marginal Cost of Funds based Lending Rate</strong>. It is the internal benchmark rate that banks use to determine interest rates on loans.
                      <br /><br />
                      <strong>How it works:</strong>
                      <br />• Your loan interest rate = MCLR + Spread (e.g., MCLR 8.25% + Spread 0.50% = 8.75%)
                      <br />• MCLR changes based on RBI's repo rate and bank's cost of funds
                      <br />• Your loan rate resets on the reset date (annual, quarterly, or monthly)
                      <br />• Spread remains constant throughout the loan tenure
                      <br /><br />
                      <strong>Impact on EMI:</strong>
                      <br />• When MCLR decreases: Your EMI reduces (or tenure reduces if EMI is kept constant)
                      <br />• When MCLR increases: Your EMI increases (or tenure increases)
                      <br /><br />
                      <strong>Example:</strong> If your loan is linked to 1-year MCLR and it decreases from 8.50% to 8.25% on your reset date, your effective rate drops to 8.75% to 8.50%, reducing your EMI.
                      <br /><br />
                      <strong>New Alternative - Repo Rate Linked Loans:</strong> Since October 2019, many banks offer loans linked directly to RBI's repo rate. These adjust faster to rate changes and are generally more transparent and beneficial for borrowers.
                    </p>
                  </details>

                  <details className="border-b pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      Can I claim tax benefits on EMI for a second home?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      Yes, but the rules differ from the first home:
                      <br /><br />
                      <strong>For Second Home (Self-Occupied):</strong>
                      <br />• From FY 2019-20 onwards, you can claim both homes as self-occupied
                      <br />• Combined interest deduction limit of ₹2 lakh under Section 24(b) for both homes
                      <br />• Principal repayment: ₹1.5 lakh under Section 80C (combined limit for all investments)
                      <br /><br />
                      <strong>For Second Home (Let-Out/Deemed Let-Out):</strong>
                      <br />• No limit on interest deduction under Section 24(b)
                      <br />• You can claim full interest amount as deduction
                      <br />• Rental income is taxable
                      <br />• Net income = Rental Income - (Interest + 30% standard deduction on rent)
                      <br />• Principal repayment still eligible for ₹1.5 lakh deduction under 80C
                      <br /><br />
                      <strong>Example:</strong> If you earn ₹3 lakh as rent and pay ₹4 lakh as interest:
                      <br />• Taxable rental income = ₹3,00,000 - ₹90,000 (30% deduction) - ₹4,00,000 (interest) = <strong>Loss of ₹1,90,000</strong>
                      <br />• This loss can be set off against other income, reducing your overall tax liability
                      <br /><br />
                      <strong>Note:</strong> If you have more than 2 houses, all properties beyond the first two are deemed to be let-out for tax purposes, even if you don't earn any rent.
                    </p>
                  </details>

                  <details className="pb-4">
                    <summary className="font-bold cursor-pointer text-lg">
                      Should I take a loan with longer tenure and invest the difference, or take shorter tenure?
                    </summary>
                    <p className="text-gray-700 mt-3">
                      This is a common dilemma. Let's analyze with numbers:
                      <br /><br />
                      <strong>Scenario:</strong> ₹25 lakh loan at 8.5%
                      <br /><br />
                      <strong>Option 1 - 20-year tenure:</strong>
                      <br />• EMI: ₹21,698
                      <br />• Total interest paid: ₹27.1 lakh
                      <br /><br />
                      <strong>Option 2 - 10-year tenure:</strong>
                      <br />• EMI: ₹30,942
                      <br />• Total interest paid: ₹12.1 lakh
                      <br />• Interest saved: ₹15 lakh
                      <br />• Additional monthly outflow: ₹9,244
                      <br /><br />
                      <strong>Investment Math:</strong>
                      <br />If you invest the ₹9,244 difference for 10 years at 12% annual return:
                      <br />• Total corpus after 10 years: ₹21.4 lakh
                      <br />• But you still have 10 years of loan remaining with ₹14 lakh outstanding
                      <br /><br />
                      <strong>Verdict:</strong>
                      <br />✅ If you can earn &gt;12-15% returns consistently: Longer tenure + invest might work
                      <br />✅ For most people: Shorter tenure is safer and guaranteed savings
                      <br />✅ Middle path: Take moderate tenure (15 years), prepay regularly, and invest surplus
                      <br /><br />
                      <strong>Risk Factor:</strong> Investment returns are not guaranteed, but loan interest is a guaranteed cost. The psychological burden of debt and risk of job loss also favor shorter tenure.
                    </p>
                  </details>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default EMICalculatorIndia;
