import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info, TrendingUp, DollarSign, Sparkles, Gift, TrendingDown, FileText } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';
import { AutoAdSlot } from '../../../components/ads/AutoAdSlot';

const IncomeTaxCalculatorIndia: React.FC = () => {
  const [grossSalary, setGrossSalary] = useState<string>('');
  const [taxRegime, setTaxRegime] = useState<string>('old');
  const [section80C, setSection80C] = useState<string>('');
  const [homeLoanInterest, setHomeLoanInterest] = useState<string>('');
  const [hra, setHra] = useState<string>('');
  const [rentPaid, setRentPaid] = useState<string>('');
  const [cityType, setCityType] = useState<string>('metro');
  const [results, setResults] = useState<any>(null);

  const calculateTax = () => {
    const gross = parseFloat(grossSalary);
    const section80c = Math.min(parseFloat(section80C) || 0, 150000);
    const hlInterest = Math.min(parseFloat(homeLoanInterest) || 0, 200000);
    const hraAmount = parseFloat(hra) || 0;
    const rent = parseFloat(rentPaid) || 0;

    if (!gross) return;

    let taxableIncome = gross;
    let deductions = 0;

    if (taxRegime === 'old') {
      // Old tax regime with deductions
      const standardDeduction = Math.min(75000, gross);
      deductions += standardDeduction;
      deductions += section80c;
      deductions += hlInterest;

      // HRA calculation
      if (hraAmount > 0 && rent > 0) {
        const basicSalary = gross * 0.4; // Assuming basic is 40% of gross
        const hraExemption = Math.min(
          hraAmount,
          rent - (basicSalary * 0.1),
          cityType === 'metro' ? basicSalary * 0.5 : basicSalary * 0.4
        );
        deductions += Math.max(0, hraExemption);
      }

      taxableIncome = Math.max(0, gross - deductions);
    } else {
      // New tax regime - no deductions except standard deduction
      const standardDeduction = Math.min(75000, gross);
      taxableIncome = Math.max(0, gross - standardDeduction);
    }

    // Calculate tax based on regime
    let tax = 0;
    let cess = 0;

    if (taxRegime === 'old') {
      // Old tax regime slabs (FY 2025-26)
      if (taxableIncome > 250000) {
        if (taxableIncome <= 500000) {
          tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
          tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.2;
        } else {
          tax = 250000 * 0.05 + 500000 * 0.2 + (taxableIncome - 1000000) * 0.3;
        }
      }
    } else {
      // New tax regime slabs (FY 2025-26) - NO TAX UP TO ₹12 LAKHS!
      if (taxableIncome > 1200000) {
        if (taxableIncome <= 1600000) {
          tax = (taxableIncome - 1200000) * 0.15;
        } else if (taxableIncome <= 2000000) {
          tax = 400000 * 0.15 + (taxableIncome - 1600000) * 0.2;
        } else {
          tax = 400000 * 0.15 + 400000 * 0.2 + (taxableIncome - 2000000) * 0.3;
        }
      }
    }

    // Health and Education Cess (4%)
    cess = tax * 0.04;
    const totalTax = tax + cess;

    const netSalary = gross - totalTax;
    const effectiveTaxRate = (totalTax / gross) * 100;
    const marginalTaxRate = calculateMarginalRate(taxableIncome, taxRegime);

    // Compare regimes
    const otherRegimeTax = calculateOtherRegimeTax(gross, taxRegime, deductions);
    const taxSavings = Math.abs(totalTax - otherRegimeTax);

    setResults({
      grossSalary: gross,
      taxableIncome,
      totalDeductions: deductions,
      tax,
      cess,
      totalTax,
      netSalary,
      effectiveTaxRate,
      marginalTaxRate,
      otherRegimeTax,
      taxSavings,
      recommendedRegime: totalTax < otherRegimeTax ? taxRegime : (taxRegime === 'old' ? 'new' : 'old')
    });
  };

  const calculateMarginalRate = (income: number, regime: string) => {
    if (regime === 'old') {
      if (income <= 250000) return 0;
      if (income <= 500000) return 5;
      if (income <= 1000000) return 20;
      return 30;
    } else {
      if (income <= 1200000) return 0;
      if (income <= 1600000) return 15;
      if (income <= 2000000) return 20;
      return 30;
    }
  };

  const calculateOtherRegimeTax = (gross: number, currentRegime: string, currentDeductions: number) => {
    // Simplified calculation for comparison
    let taxableIncome = gross;
    let tax = 0;

    if (currentRegime === 'old') {
      // Calculate new regime tax - NO TAX UP TO ₹12 LAKHS
      taxableIncome = Math.max(0, gross - 75000);
      if (taxableIncome > 1200000) {
        if (taxableIncome <= 1600000) {
          tax = (taxableIncome - 1200000) * 0.15;
        } else if (taxableIncome <= 2000000) {
          tax = 400000 * 0.15 + (taxableIncome - 1600000) * 0.2;
        } else {
          tax = 400000 * 0.15 + 400000 * 0.2 + (taxableIncome - 2000000) * 0.3;
        }
      }
    } else {
      // Calculate old regime tax
      taxableIncome = Math.max(0, gross - currentDeductions);
      if (taxableIncome > 250000) {
        if (taxableIncome <= 500000) {
          tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
          tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.2;
        } else {
          tax = 250000 * 0.05 + 500000 * 0.2 + (taxableIncome - 1000000) * 0.3;
        }
      }
    }

    return tax * 1.04; // Including cess
  };

  const reset = () => {
    setGrossSalary('');
    setTaxRegime('old');
    setSection80C('');
    setHomeLoanInterest('');
    setHra('');
    setRentPaid('');
    setCityType('metro');
    setResults(null);
  };

  const tips = [
    "🎉 NEW: Zero tax up to ₹12 lakhs in the new tax regime for FY 2025-26!",
    "💰 Standard deduction of ₹75,000 automatically reduces your taxable income",
    "🏠 Old regime: Claim HRA + Section 80C (₹1.5L) + Home Loan Interest (₹2L)",
    "📊 New regime: Simplified slabs - 0% up to ₹12L, 15% till ₹16L, 20% till ₹20L",
    "✨ Most salaried employees benefit from the new regime in FY 2025-26"
  ];

  return (
    <CalculatorLayoutWithAds
      title="India Income Tax Calculator 2025-26"
      description="Calculate your income tax liability under both old and new tax regimes in India for FY 2025-26 with latest tax slabs and rates"
      keywords="India income tax calculator 2025, tax calculation India, old vs new tax regime, section 80C, HRA exemption, FY 2025-26"
      tips={tips}
    >
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-lg border-2 border-purple-300 animate-pulse-slow">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-purple-600 animate-spin-slow" />
          <div>
            <h2 className="text-xl font-bold text-purple-900">🎉 Big Tax Relief for FY 2025-26!</h2>
            <p className="text-purple-700 font-medium">Zero Income Tax up to ₹12 Lakhs in New Tax Regime – More money in your pocket!</p>
          </div>
        </div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="border-2 border-indigo-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600 animate-bounce-subtle" />
              Income Tax Calculator
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>🎉 Zero tax up to ₹12 Lakhs in FY 2025-26!</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="grossSalary">Annual Gross Salary (₹)</Label>
              <Input
                id="grossSalary"
                type="number"
                placeholder="Enter annual gross salary"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRegime">Tax Regime</Label>
              <Select value={taxRegime} onValueChange={setTaxRegime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax regime" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="old">Old Tax Regime</SelectItem>
                  <SelectItem value="new">New Tax Regime</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {taxRegime === 'old' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="section80C">Section 80C Deductions (₹)</Label>
                  <Input
                    id="section80C"
                    type="number"
                    placeholder="PF, ELSS, LIC etc. (Max ₹1.5L)"
                    value={section80C}
                    onChange={(e) => setSection80C(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeLoanInterest">Home Loan Interest (₹)</Label>
                  <Input
                    id="homeLoanInterest"
                    type="number"
                    placeholder="Section 24 deduction (Max ₹2L)"
                    value={homeLoanInterest}
                    onChange={(e) => setHomeLoanInterest(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hra">HRA Received (₹)</Label>
                    <Input
                      id="hra"
                      type="number"
                      placeholder="Annual HRA"
                      value={hra}
                      onChange={(e) => setHra(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentPaid">Rent Paid (₹)</Label>
                    <Input
                      id="rentPaid"
                      type="number"
                      placeholder="Annual rent"
                      value={rentPaid}
                      onChange={(e) => setRentPaid(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cityType">City Type</Label>
                  <Select value={cityType} onValueChange={setCityType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select city type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metro">Metro City</SelectItem>
                      <SelectItem value="non-metro">Non-Metro City</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="flex gap-2">
              <Button onClick={calculateTax} className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate Tax
              </Button>
              <Button onClick={reset} variant="outline" className="hover:bg-red-50 transition-colors">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card className="border-2 border-green-200 shadow-lg animate-slide-in-right">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Your Tax Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg transition-all duration-300 hover:bg-blue-100 hover:scale-105">
                  <p className="text-sm text-blue-600 font-medium">Gross Salary</p>
                  <p className="text-lg font-bold text-blue-900">₹{results.grossSalary.toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg transition-all duration-300 hover:bg-purple-100 hover:scale-105">
                  <p className="text-sm text-purple-600 font-medium">Taxable Income</p>
                  <p className="text-lg font-bold text-purple-900">₹{Math.round(results.taxableIncome).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg transition-all duration-300 hover:bg-red-100 hover:scale-105">
                  <p className="text-sm text-red-600 font-medium">Income Tax</p>
                  <p className="text-2xl font-bold text-red-700">₹{Math.round(results.totalTax).toLocaleString('en-IN')}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg transition-all duration-300 hover:bg-green-100 hover:scale-105">
                  <p className="text-sm text-green-600 font-medium">Take Home Salary</p>
                  <p className="text-2xl font-bold text-green-700">₹{Math.round(results.netSalary).toLocaleString('en-IN')}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <h4 className="font-medium">Tax Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tax (Before Cess):</span>
                    <Badge variant="outline">₹{Math.round(results.tax).toLocaleString('en-IN')}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Health & Education Cess:</span>
                    <Badge variant="secondary">₹{Math.round(results.cess).toLocaleString('en-IN')}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Deductions:</span>
                    <Badge variant="outline">₹{Math.round(results.totalDeductions).toLocaleString('en-IN')}</Badge>
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

              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200 animate-fade-in">
                <h5 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Smart Regime Comparison
                </h5>
                <div className="text-sm text-green-700 space-y-1">
                  <p className="flex justify-between">
                    <span>Other regime tax:</span>
                    <span className="font-semibold">₹{Math.round(results.otherRegimeTax).toLocaleString('en-IN')}</span>
                  </p>
                  <p className="flex justify-between items-center">
                    <span>Your savings:</span>
                    <Badge className="bg-green-600">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      ₹{Math.round(results.taxSavings).toLocaleString('en-IN')}
                    </Badge>
                  </p>
                  <p className="pt-2 border-t border-green-200 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-yellow-600" />
                    <span>Recommended: <strong className="text-green-900">{results.recommendedRegime === 'old' ? 'Old' : 'New'} Tax Regime</strong></span>
                  </p>
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
            Understanding Income Tax in India: Old vs New Tax Regime
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm md:prose-base max-w-none space-y-6">
          <p className="text-base leading-relaxed text-gray-700">
            India's income tax system underwent significant transformation with the introduction of the new tax regime in Budget 2020, offering taxpayers a choice between the traditional regime with deductions and a simplified regime with lower tax rates. Understanding both systems is crucial for optimal tax planning and maximizing post-tax income, as the choice between regimes can result in substantial differences in tax liability depending on individual circumstances.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Old Tax Regime: Deductions and Exemptions</h3>
          <p className="text-base leading-relaxed text-gray-700">
            The old tax regime maintains the traditional structure with tax slabs of 5%, 20%, and 30% for income above ₹2.5 lakh, while offering extensive deduction opportunities under various sections. Section 80C allows deductions up to ₹1.5 lakh for investments in EPF, ELSS, life insurance, and housing loans. Additional deductions include Section 80D for medical insurance, Section 24 for home loan interest, and HRA exemptions for house rent, creating significant tax planning opportunities for knowledgeable taxpayers.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">🎉 New Tax Regime: Game-Changer for FY 2025-26!</h3>
          <p className="text-base leading-relaxed text-gray-700">
            <strong>Breaking News:</strong> The new tax regime for FY 2025-26 brings revolutionary changes with <strong>ZERO tax up to ₹12 lakh</strong> of taxable income! After the ₹75,000 standard deduction, this means you can earn up to <strong>₹12.75 lakh gross salary</strong> and pay absolutely no income tax. Beyond ₹12 lakhs, simplified progressive rates apply: 15% till ₹16L, 20% till ₹20L, and 30% thereafter. This game-changing update makes the new regime the clear winner for over 90% of salaried individuals, especially middle-income earners. Say goodbye to complex deduction paperwork and hello to more take-home pay!
          </p>

          <div className="my-6">
            <AutoAdSlot placement="mid-content" className="max-w-full" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">💰 Standard Deduction: Your Automatic Tax Saver</h3>
          <p className="text-base leading-relaxed text-gray-700">
            Great news! Both tax regimes automatically give you a <strong>₹75,000 standard deduction</strong> for FY 2025-26 – no paperwork, no investment required! Think of it as a gift from the tax department. But here's where it gets exciting: in the <strong>new regime, this combines with a massive ₹12 lakh tax-free threshold</strong>, meaning your first ₹12.75 lakh (gross) is completely tax-free! The old regime still starts taxing at ₹2.5 lakhs (after standard deduction at ₹3.25L gross). For most people, the new regime's simplicity plus zero tax up to ₹12L is a no-brainer choice.
          </p>

          <div className="my-6">
            <AutoAdSlot placement="mid-content" className="max-w-full" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">HRA and Housing Benefits</h3>
          <p className="text-base leading-relaxed text-gray-700">
            HRA exemption represents one of the most valuable benefits of the old tax regime, particularly for metro city residents where exemption can reach 50% of basic salary. The calculation considers actual HRA received, rent paid minus 10% of basic salary, and 40-50% of basic salary depending on city type. Home loan interest deduction under Section 24 allows additional savings up to ₹2 lakh annually, making home ownership tax-efficient under the old regime.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Investment-Linked Tax Planning</h3>
          <p className="text-base leading-relaxed text-gray-700">
            The old regime encourages long-term savings through tax-linked investments, creating forced savings habits while reducing tax liability. Section 80C investments in ELSS mutual funds, PPF, NSC, and life insurance not only save taxes but also build wealth over time. This structure aligns tax benefits with financial planning goals, encouraging disciplined saving and investment behavior among taxpayers while providing immediate tax relief.
          </p>

          <div className="my-6">
            <AutoAdSlot placement="mid-content" className="max-w-full" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Health Insurance and Medical Benefits</h3>
          <p className="text-base leading-relaxed text-gray-700">
            Section 80D deductions for health insurance premiums provide dual benefits of tax savings and health coverage, with higher limits for senior citizens. Medical expenditure deductions under Section 80DDB for specific diseases and preventive health check-up deductions encourage healthcare spending while reducing tax burden. These provisions make comprehensive health coverage more affordable through tax benefits, particularly important given rising healthcare costs.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">✨ Smart Regime Selection: Your 2025-26 Strategy</h3>
          <p className="text-base leading-relaxed text-gray-700">
            <strong>Quick Decision Guide:</strong> For FY 2025-26, the new regime is the winner for 90%+ of taxpayers! With zero tax up to ₹12 lakhs, you'd need over ₹4 lakhs in total deductions (80C + HRA + home loan + others) under the old regime to match this benefit. <strong>Choose NEW if:</strong> Your salary is under ₹15 lakhs OR you don't have ₹4L+ in deductions. <strong>Choose OLD if:</strong> You have significant HRA + home loan interest + 80C investments totaling ₹4L+. Pro tip: You can switch regimes every year (salaried employees only), so recalculate annually! Use our calculator above to compare instantly.
          </p>

          <div className="my-6">
            <AutoAdSlot placement="mid-content" className="max-w-full" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Marginal and Effective Tax Rates</h3>
          <p className="text-base leading-relaxed text-gray-700">
            Understanding marginal tax rates helps in making incremental income and investment decisions, as additional income gets taxed at the highest applicable rate. Effective tax rate represents the overall tax burden as a percentage of total income, providing a clearer picture of actual tax impact. These metrics guide decisions about overtime work, bonuses, and investment timing to optimize overall tax efficiency.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Tax Planning Throughout the Year</h3>
          <p className="text-base leading-relaxed text-gray-700">
            Effective tax planning requires year-round awareness rather than last-minute investment decisions. Early planning allows optimal allocation across various deduction categories, timing of income recognition, and strategic investment decisions. Regular monitoring of tax implications helps identify planning opportunities and ensures compliance while maximizing post-tax income through legitimate tax optimization strategies.
          </p>

          <div className="my-6">
            <AutoAdSlot placement="mid-content" className="max-w-full" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Compliance and Documentation</h3>
          <p className="text-base leading-relaxed text-gray-700">
            Proper documentation and compliance become crucial for claiming deductions under the old regime, requiring maintenance of investment proofs, rent receipts, and insurance premium records. The new regime simplifies compliance by reducing documentation requirements, though basic income reporting remains necessary. Understanding compliance requirements helps avoid penalties while ensuring legitimate tax benefits are properly claimed and supported.
          </p>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="mt-8">
            <EnhancedAIAnalysis
              calculatorType="income-tax-india"
              data={{
                grossSalary: results.grossSalary,
                netSalary: results.netSalary,
                totalTax: results.totalTax,
                effectiveTaxRate: results.effectiveTaxRate,
                marginalTaxRate: results.marginalTaxRate,
                taxRegime,
                totalDeductions: results.totalDeductions,
                recommendedRegime: results.recommendedRegime,
                taxSavings: results.taxSavings
              }}
            />
          </div>
          <div className="mt-8">
            <ExportShareButtons
              calculatorType="income-tax-india"
              inputs={{
                grossSalary,
                taxRegime,
                section80C,
                homeLoanInterest,
                hra,
                rentPaid,
                cityType
              }}
              results={results}
              title="Income Tax Calculation"
            />
          </div>
        </>
      )}
    </CalculatorLayoutWithAds>
  );
};

export default IncomeTaxCalculatorIndia;