// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, Info, TrendingUp, AlertCircle, FileText, DollarSign, TrendingDown, Award, Save, Wallet } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';
import EnhancedAIAnalysis from '../../../components/EnhancedAIAnalysis';
import { useCalculatorHistory } from '../../../hooks/useCalculatorHistory';
import { useToast } from '@/components/ui/use-toast';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface TaxResults {
  grossIncome: number;
  incomeTax: number;
  medicareLevy: number;
  medicareLevySurcharge: number;
  helpRepayment: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  marginalTaxRate: number;
  monthlyGross: number;
  monthlyNet: number;
  fortnightlyGross: number;
  fortnightlyNet: number;
  weeklyGross: number;
  weeklyNet: number;
  taxRefundOrOwing?: number;
  litoOffset?: number;
  limiOffset?: number;
}

const ComprehensiveTaxCalculatorAustralia: React.FC = () => {
  const [grossIncome, setGrossIncome] = useState<string>('');
  const [residencyStatus, setResidencyStatus] = useState<string>('resident');
  const [hasMedicare, setHasMedicare] = useState<string>('full');
  const [hasHELP, setHasHELP] = useState<string>('no');
  const [hasPrivateHealth, setHasPrivateHealth] = useState<string>('no');
  const [deductions, setDeductions] = useState<string>('');
  const [taxWithheld, setTaxWithheld] = useState<string>('');
  const [results, setResults] = useState<TaxResults | null>(null);
  const { saveCalculation } = useCalculatorHistory();
  const { toast } = useToast();

  const taxBrackets2025: TaxBracket[] = [
    { min: 0, max: 18200, rate: 0 },
    { min: 18201, max: 45000, rate: 0.16 },
    { min: 45001, max: 135000, rate: 0.30 },
    { min: 135001, max: 190000, rate: 0.37 },
    { min: 190001, max: Infinity, rate: 0.45 }
  ];

  const foreignResidentBrackets: TaxBracket[] = [
    { min: 0, max: 135000, rate: 0.30 },
    { min: 135001, max: 190000, rate: 0.37 },
    { min: 190001, max: Infinity, rate: 0.45 }
  ];

  const calculateTax = () => {
    const income = parseFloat(grossIncome);
    const deductionAmount = parseFloat(deductions) || 0;
    const withheldAmount = parseFloat(taxWithheld) || 0;
    
    if (!income || income <= 0) return;

    const taxableIncome = Math.max(0, income - deductionAmount);
    const isResident = residencyStatus === 'resident';
    const brackets = isResident ? taxBrackets2025 : foreignResidentBrackets;
    
    let incomeTax = 0;
    for (const bracket of brackets) {
      if (taxableIncome <= bracket.min) break;
      
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      if (taxableInBracket > 0) {
        incomeTax += taxableInBracket * bracket.rate;
      }
    }

    let litoOffset = 0;
    if (isResident && taxableIncome <= 66667) {
      if (taxableIncome <= 37500) {
        litoOffset = 700;
      } else if (taxableIncome <= 45000) {
        litoOffset = 700 - ((taxableIncome - 37500) * 0.05);
      } else if (taxableIncome <= 66667) {
        litoOffset = 325 - ((taxableIncome - 45000) * 0.015);
      }
      incomeTax = Math.max(0, incomeTax - litoOffset);
    }

    let medicareLevy = 0;
    if (isResident && hasMedicare === 'full') {
      medicareLevy = taxableIncome * 0.02;
    } else if (isResident && hasMedicare === 'half') {
      medicareLevy = taxableIncome * 0.01;
    }

    let medicareLevySurcharge = 0;
    if (isResident && hasPrivateHealth === 'no' && taxableIncome > 97000) {
      if (taxableIncome <= 113000) {
        medicareLevySurcharge = taxableIncome * 0.01;
      } else if (taxableIncome <= 151000) {
        medicareLevySurcharge = taxableIncome * 0.0125;
      } else {
        medicareLevySurcharge = taxableIncome * 0.015;
      }
    }

    let helpRepayment = 0;
    if (hasHELP === 'yes' && income > 54435) {
      const helpRate = calculateHELPRate(income);
      helpRepayment = income * helpRate;
    }

    const totalTax = incomeTax + medicareLevy + medicareLevySurcharge + helpRepayment;
    const netIncome = income - totalTax;
    const effectiveTaxRate = (totalTax / income) * 100;
    const marginalTaxRate = calculateMarginalRate(taxableIncome, isResident);
    const taxRefundOrOwing = withheldAmount - totalTax;

    setResults({
      grossIncome: income,
      incomeTax,
      medicareLevy,
      medicareLevySurcharge,
      helpRepayment,
      totalTax,
      netIncome,
      effectiveTaxRate,
      marginalTaxRate,
      monthlyGross: income / 12,
      monthlyNet: netIncome / 12,
      fortnightlyGross: income / 26,
      fortnightlyNet: netIncome / 26,
      weeklyGross: income / 52,
      weeklyNet: netIncome / 52,
      taxRefundOrOwing: withheldAmount > 0 ? taxRefundOrOwing : undefined,
      litoOffset: litoOffset > 0 ? litoOffset : undefined
    });
  };

  const calculateHELPRate = (income: number): number => {
    if (income <= 54434) return 0;
    if (income <= 62850) return 0.01;
    if (income <= 66619) return 0.02;
    if (income <= 70617) return 0.025;
    if (income <= 74855) return 0.03;
    if (income <= 79346) return 0.035;
    if (income <= 84107) return 0.04;
    if (income <= 89154) return 0.045;
    if (income <= 94504) return 0.05;
    if (income <= 100174) return 0.055;
    if (income <= 106185) return 0.06;
    if (income <= 112556) return 0.065;
    if (income <= 119309) return 0.07;
    if (income <= 126467) return 0.075;
    if (income <= 134056) return 0.08;
    if (income <= 142100) return 0.085;
    if (income <= 150626) return 0.09;
    if (income <= 159663) return 0.095;
    return 0.10;
  };

  const calculateMarginalRate = (income: number, isResident: boolean): number => {
    if (isResident) {
      if (income <= 18200) return 0;
      if (income <= 45000) return 16;
      if (income <= 135000) return 30;
      if (income <= 190000) return 37;
      return 45;
    } else {
      if (income <= 135000) return 30;
      if (income <= 190000) return 37;
      return 45;
    }
  };

  const reset = () => {
    setGrossIncome('');
    setResidencyStatus('resident');
    setHasMedicare('full');
    setHasHELP('no');
    setHasPrivateHealth('no');
    setDeductions('');
    setTaxWithheld('');
    setResults(null);
  };

  const handleSaveToHistory = () => {
    if (!results) return;

    try {
      saveCalculation({
        calculatorType: 'income-tax' as any,
        calculatorName: 'Australia Income Tax Calculator 2025-26',
        inputs: {
          grossIncome: parseFloat(grossIncome),
          residencyStatus,
          hasMedicare,
          hasHELP,
          hasPrivateHealth,
          deductions: parseFloat(deductions) || 0,
          taxWithheld: parseFloat(taxWithheld) || 0
        },
        results: {
          grossIncome: results.grossIncome,
          incomeTax: results.incomeTax,
          medicareLevy: results.medicareLevy,
          medicareLevySurcharge: results.medicareLevySurcharge,
          helpRepayment: results.helpRepayment,
          totalTax: results.totalTax,
          netIncome: results.netIncome,
          effectiveTaxRate: results.effectiveTaxRate,
          marginalTaxRate: results.marginalTaxRate
        }
      });

      toast({
        title: "Saved to History",
        description: "Your tax calculation has been saved to your history.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save calculation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const tips = [
    "2025-26 FY: Tax-free threshold is $18,200 for Australian residents",
    "Stage 3 tax cuts: 16% rate on $18,201-$45,000 (reduced from 19%)",
    "Medicare Levy: 2% for most residents, plus surcharge if no private health insurance",
    "HELP/HECS repayment threshold: $54,435 for 2025-26",
    "Low Income Tax Offset: Up to $700 for incomes under $66,667",
    "Concessional super contributions capped at $30,000 annually",
    "Division 293 tax: Extra 15% on super contributions if income exceeds $250,000"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Comprehensive Australia Tax Calculator 2025-26 | Income Tax, Medicare, HELP Calculator"
      description="Calculate your Australian income tax for 2025-26 FY with Stage 3 tax cuts, Medicare Levy, Medicare Levy Surcharge, HELP/HECS debt, tax offsets, and deductions. Get AI-powered tax planning recommendations."
      keywords="Australia tax calculator, income tax calculator 2025-26, Medicare Levy calculator, HELP debt calculator, Stage 3 tax cuts, Australian tax rates, ATO tax calculator, tax refund calculator Australia"
      tips={tips}
    >
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Australia Income Tax Calculator 2025-26
              </CardTitle>
              <CardDescription>
                Calculate your comprehensive tax liability for the 2025-26 financial year (1 July 2025 - 30 June 2026)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Details</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced Options</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="grossIncome">Annual Gross Income (AUD)</Label>
                    <Input
                      id="grossIncome"
                      type="number"
                      placeholder="Enter annual gross income"
                      value={grossIncome}
                      onChange={(e) => setGrossIncome(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="residencyStatus">Residency Status</Label>
                    <Select value={residencyStatus} onValueChange={setResidencyStatus}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select residency status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="resident">Australian Resident for Tax Purposes</SelectItem>
                        <SelectItem value="foreign">Foreign Resident (Non-Resident)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {residencyStatus === 'resident' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="hasMedicare">Medicare Levy Status</Label>
                        <Select value={hasMedicare} onValueChange={setHasMedicare}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Medicare status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="full">Full Medicare Levy (2%)</SelectItem>
                            <SelectItem value="half">Half Medicare Levy (1%)</SelectItem>
                            <SelectItem value="exempt">Exempt from Medicare Levy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hasPrivateHealth">Private Health Insurance</Label>
                        <Select value={hasPrivateHealth} onValueChange={setHasPrivateHealth}>
                          <SelectTrigger>
                            <SelectValue placeholder="Do you have appropriate private health insurance?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="no">No Private Health Insurance</SelectItem>
                            <SelectItem value="yes">Yes, I have Appropriate Hospital Cover</SelectItem>
                          </SelectContent>
                        </Select>
                        {hasPrivateHealth === 'no' && parseFloat(grossIncome) > 97000 && (
                          <p className="text-sm text-amber-600 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            Medicare Levy Surcharge may apply (1-1.5% depending on income)
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="hasHELP">HELP/HECS Debt</Label>
                    <Select value={hasHELP} onValueChange={setHasHELP}>
                      <SelectTrigger>
                        <SelectValue placeholder="Do you have HELP/HECS debt?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no">No HELP/HECS Debt</SelectItem>
                        <SelectItem value="yes">Yes, I have HELP/HECS Debt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="deductions">Total Tax Deductions (AUD)</Label>
                    <Input
                      id="deductions"
                      type="number"
                      placeholder="Work expenses, donations, investment costs, etc."
                      value={deductions}
                      onChange={(e) => setDeductions(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Include work-related expenses, charitable donations, investment property costs
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="taxWithheld">Tax Already Withheld (PAYG)</Label>
                    <Input
                      id="taxWithheld"
                      type="number"
                      placeholder="Tax withheld by employer during the year"
                      value={taxWithheld}
                      onChange={(e) => setTaxWithheld(e.target.value)}
                    />
                    <p className="text-sm text-muted-foreground">
                      Enter PAYG tax withheld to estimate refund or amount owing
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-2">
                <Button onClick={calculateTax} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Tax
                </Button>
                <Button onClick={reset} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {results && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Your Tax Calculation Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Gross Income</p>
                      <p className="text-2xl font-bold text-blue-600">{formatCurrency(results.grossIncome, 'AUD')}</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Net Income</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(results.netIncome, 'AUD')}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Tax Breakdown
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <span className="text-sm">Income Tax:</span>
                        <Badge variant="outline" className="font-mono">{formatCurrency(results.incomeTax, 'AUD')}</Badge>
                      </div>
                      {results.medicareLevy > 0 && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">Medicare Levy (2%):</span>
                          <Badge variant="outline" className="font-mono">{formatCurrency(results.medicareLevy, 'AUD')}</Badge>
                        </div>
                      )}
                      {results.medicareLevySurcharge > 0 && (
                        <div className="flex justify-between items-center p-2 bg-amber-50 rounded">
                          <span className="text-sm flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            Medicare Levy Surcharge:
                          </span>
                          <Badge variant="secondary" className="bg-amber-600 text-white font-mono">{formatCurrency(results.medicareLevySurcharge, 'AUD')}</Badge>
                        </div>
                      )}
                      {results.helpRepayment > 0 && (
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span className="text-sm">HELP/HECS Repayment:</span>
                          <Badge variant="secondary" className="font-mono">{formatCurrency(results.helpRepayment, 'AUD')}</Badge>
                        </div>
                      )}
                      {results.litoOffset && results.litoOffset > 0 && (
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                          <span className="text-sm flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            Low Income Tax Offset:
                          </span>
                          <Badge variant="secondary" className="bg-green-600 text-white font-mono">-{formatCurrency(results.litoOffset, 'AUD')}</Badge>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded border-t-2 border-red-600">
                        <span className="font-semibold">Total Tax Payable:</span>
                        <Badge className="bg-red-600 text-lg">{formatCurrency(results.totalTax, 'AUD')}</Badge>
                      </div>
                      {results.taxRefundOrOwing !== undefined && (
                        <div className={`flex justify-between items-center p-3 ${results.taxRefundOrOwing >= 0 ? 'bg-green-50 border-green-600' : 'bg-amber-50 border-amber-600'} rounded border-t-2`}>
                          <span className="font-semibold">
                            {results.taxRefundOrOwing >= 0 ? 'Estimated Refund:' : 'Amount Owing:'}
                          </span>
                          <Badge className={results.taxRefundOrOwing >= 0 ? 'bg-green-600' : 'bg-amber-600'}>
                            {formatCurrency(Math.abs(results.taxRefundOrOwing), 'AUD')}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Effective Tax Rate</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-lg">{results.effectiveTaxRate.toFixed(2)}%</Badge>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Marginal Tax Rate</p>
                      <Badge variant="secondary" className="text-lg">{results.marginalTaxRate}%</Badge>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Take-Home Pay Breakdown
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Annual</p>
                        <p className="font-semibold text-green-600">{formatCurrency(results.netIncome, 'AUD')}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                        <p className="font-semibold text-green-600">{formatCurrency(results.monthlyNet, 'AUD')}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Fortnightly</p>
                        <p className="font-semibold text-green-600">{formatCurrency(results.fortnightlyNet, 'AUD')}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Weekly</p>
                        <p className="font-semibold text-green-600">{formatCurrency(results.weeklyNet, 'AUD')}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex gap-2">
                    <Button onClick={handleSaveToHistory} variant="outline" className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      Save to History
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <ExportShareButtons
                calculatorType="income-tax-australia"
                inputs={{
                  grossIncome,
                  residencyStatus,
                  hasMedicare,
                  hasHELP,
                  hasPrivateHealth,
                  deductions,
                  taxWithheld
                }}
                results={results}
                title="Australian Income Tax Calculation 2025-26"
              />

              {results && (
                <EnhancedAIAnalysis
                  calculatorType="income-tax-australia"
                  data={{
                    grossIncome: results.grossIncome,
                    residencyStatus,
                    hasMedicare,
                    hasHELP,
                    incomeTax: results.incomeTax,
                    medicareLevy: results.medicareLevy,
                    helpRepayment: results.helpRepayment,
                    totalTax: results.totalTax,
                    netIncome: results.netIncome,
                    effectiveTaxRate: results.effectiveTaxRate,
                    marginalTaxRate: results.marginalTaxRate
                  }}
                />
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Info className="h-5 w-5" />
                2025-26 Tax Quick Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-sm">Tax Brackets (Residents)</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>$0 - $18,200</span>
                    <Badge variant="outline">0%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>$18,201 - $45,000</span>
                    <Badge variant="outline">16%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>$45,001 - $135,000</span>
                    <Badge variant="outline">30%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>$135,001 - $190,000</span>
                    <Badge variant="outline">37%</Badge>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>$190,001+</span>
                    <Badge variant="outline">45%</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 text-sm">Key Thresholds</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HELP Threshold:</span>
                    <span className="font-medium">$54,435</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">MLS Threshold:</span>
                    <span className="font-medium">$97,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Super Cap:</span>
                    <span className="font-medium">$30,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Division 293:</span>
                    <span className="font-medium">$250,000</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2 text-sm flex items-center gap-1">
                  <Wallet className="h-4 w-4" />
                  Tax Saving Tips
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Salary sacrifice to super (15% tax vs your marginal rate)</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Claim all work-related deductions</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Get private health insurance to avoid MLS</span>
                  </li>
                  <li className="flex gap-2">
                    <span>•</span>
                    <span>Time deductions before June 30</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Complete Guide to Australian Income Tax 2025-26
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none space-y-6">
          <section>
            <h2 className="text-2xl font-bold mb-4">Understanding Australian Income Tax in 2025-26</h2>
            <p className="mb-4">
              Australia's income tax system is progressive, meaning higher earners pay a higher percentage of their income 
              in tax. The 2025-26 financial year continues to implement the Stage 3 tax cuts that began in July 2024, 
              providing meaningful tax relief across all income brackets while maintaining the progressive nature of the system.
            </p>
            <p className="mb-4">
              This comprehensive tax calculator helps Australian taxpayers understand their complete tax position, including 
              income tax, Medicare Levy, Medicare Levy Surcharge, HELP/HECS debt repayments, tax offsets, and deductions. 
              Whether you're an employee, contractor, or business owner, understanding your tax obligations is crucial for 
              effective financial planning.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2025-26 Tax Rates and Brackets</h2>
            
            <h3 className="text-xl font-semibold mb-3">Resident Tax Rates</h3>
            <p className="mb-4">
              For Australian residents for tax purposes, the tax system includes a tax-free threshold of $18,200. This means 
              the first $18,200 you earn is completely tax-free. Above this threshold, the following progressive tax rates apply:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>$0 - $18,200:</strong> No tax payable (tax-free threshold)</li>
              <li><strong>$18,201 - $45,000:</strong> 16% on every dollar over $18,200</li>
              <li><strong>$45,001 - $135,000:</strong> $4,288 plus 30% on every dollar over $45,000</li>
              <li><strong>$135,001 - $190,000:</strong> $31,288 plus 37% on every dollar over $135,000</li>
              <li><strong>$190,001 and above:</strong> $51,638 plus 45% on every dollar over $190,000</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Foreign Resident Tax Rates</h3>
            <p className="mb-4">
              Foreign residents (non-residents for tax purposes) do not receive the tax-free threshold and pay tax from 
              the first dollar earned in Australia. They are generally not liable for the Medicare Levy. The rates are:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>$0 - $135,000:</strong> 30% on every dollar</li>
              <li><strong>$135,001 - $190,000:</strong> $40,500 plus 37% on every dollar over $135,000</li>
              <li><strong>$190,001 and above:</strong> $60,850 plus 45% on every dollar over $190,000</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Stage 3 Tax Cuts - What Changed?</h2>
            <p className="mb-4">
              The Stage 3 tax cuts, implemented from 1 July 2024, represent the most significant tax reform in recent years:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Lower 16% rate:</strong> The tax rate for income between $18,201 and $45,000 was reduced from 19% to 16%</li>
              <li><strong>Expanded 30% bracket:</strong> The 30% tax bracket now extends to $135,000 (previously $120,000)</li>
              <li><strong>Higher 45% threshold:</strong> The top tax rate now applies from $190,000 (previously $180,000)</li>
              <li><strong>Simplified structure:</strong> These changes create a simpler, fairer tax system benefiting all taxpayers</li>
            </ul>
            <p className="mb-4">
              For a person earning $80,000, these changes save approximately $1,500 per year. For someone on $150,000, 
              the savings are around $3,500 annually. Even those earning $50,000 benefit by about $800 per year.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Medicare Levy and Surcharge</h2>
            
            <h3 className="text-xl font-semibold mb-3">Medicare Levy (2%)</h3>
            <p className="mb-4">
              Most Australian residents pay the Medicare Levy of 2% of taxable income to help fund Australia's public 
              health system (Medicare). Low-income earners may be eligible for a reduction or full exemption from the Medicare Levy:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Single individuals earning less than $26,000 may receive a reduction</li>
              <li>Families and seniors have higher thresholds for reductions</li>
              <li>Foreign residents are generally exempt from the Medicare Levy</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Medicare Levy Surcharge (1-1.5%)</h3>
            <p className="mb-4">
              The Medicare Levy Surcharge (MLS) is an additional levy on taxpayers who don't have appropriate private 
              hospital insurance and earn above certain thresholds. The surcharge rates for 2025-26 are:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Tier 1:</strong> $97,001 - $113,000 singles ($194,001 - $226,000 families) - 1% surcharge</li>
              <li><strong>Tier 2:</strong> $113,001 - $151,000 singles ($226,001 - $302,000 families) - 1.25% surcharge</li>
              <li><strong>Tier 3:</strong> $151,001+ singles ($302,001+ families) - 1.5% surcharge</li>
            </ul>
            <p className="mb-4">
              Many taxpayers find it cost-effective to obtain appropriate private health insurance rather than pay the MLS. 
              For example, someone earning $110,000 without private health insurance pays $1,100 in MLS annually, which 
              could cover basic hospital insurance premiums.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">HELP/HECS Debt Repayment</h2>
            <p className="mb-4">
              If you have a Higher Education Loan Program (HELP) or Higher Education Contribution Scheme (HECS) debt, 
              you must make compulsory repayments once your income exceeds the minimum threshold of $54,435 (2025-26). 
              The repayment is calculated on your total income, not just the amount above the threshold.
            </p>
            
            <h3 className="text-xl font-semibold mb-3">HELP Repayment Rates 2025-26</h3>
            <p className="mb-4">
              The repayment rate increases progressively with income, ranging from 1% to 10%:
            </p>
            <ul className="list-disc pl-6 space-y-1 mb-4">
              <li>$54,435 - $62,850: 1% repayment rate</li>
              <li>$62,851 - $66,619: 2% repayment rate</li>
              <li>$66,620 - $70,617: 2.5% repayment rate</li>
              <li>$70,618 - $74,855: 3% repayment rate</li>
              <li>Continues increasing to 10% for incomes over $159,663</li>
            </ul>
            <p className="mb-4">
              HELP debt is indexed annually on June 1 based on the Consumer Price Index (CPI). The indexation rate for 
              June 2024 was 4.7%. While HELP debt doesn't accrue interest, indexation can significantly increase the 
              debt over time, making voluntary repayments attractive for those who can afford them.
            </p>
            <p className="mb-4">
              <strong>Important:</strong> Voluntary HELP repayments receive a 10% bonus reduction on the amount paid. 
              For example, if you make a $1,000 voluntary payment, $1,100 is deducted from your debt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Tax Offsets and Deductions</h2>
            
            <h3 className="text-xl font-semibold mb-3">Low Income Tax Offset (LITO)</h3>
            <p className="mb-4">
              The Low Income Tax Offset (LITO) reduces the amount of tax payable for low and middle-income earners:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Maximum offset of $700 for incomes up to $37,500</li>
              <li>Phases out at 5 cents per dollar between $37,500 and $45,000</li>
              <li>Phases out at 1.5 cents per dollar between $45,000 and $66,667</li>
              <li>Automatically applied - no need to claim</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Common Tax Deductions</h3>
            <p className="mb-4">
              Claiming all eligible deductions reduces your taxable income and overall tax liability. Common deductions include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Work-related expenses:</strong> Tools, equipment, uniforms, protective clothing, professional subscriptions</li>
              <li><strong>Home office expenses:</strong> If you work from home, claim running costs and equipment depreciation</li>
              <li><strong>Vehicle and travel expenses:</strong> Work-related car travel, parking, tolls (not normal commute)</li>
              <li><strong>Self-education expenses:</strong> Courses and training directly related to current employment</li>
              <li><strong>Investment property expenses:</strong> Loan interest, repairs, property management, depreciation</li>
              <li><strong>Donations:</strong> Gifts over $2 to registered Deductible Gift Recipients (DGRs)</li>
              <li><strong>Income protection insurance:</strong> Premiums for policies that replace income if you can't work</li>
            </ul>
            <p className="mb-4">
              Keep detailed records and receipts for all deductions. The ATO's myDeductions app helps track expenses 
              throughout the year, making tax time much easier.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Superannuation and Tax Planning</h2>
            
            <h3 className="text-xl font-semibold mb-3">Salary Sacrificing to Super</h3>
            <p className="mb-4">
              Salary sacrifice to superannuation is one of the most tax-effective strategies available to Australian workers. 
              Instead of receiving income (taxed at your marginal rate), you contribute to super where it's taxed at just 15%:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Tax saving = (Your marginal rate - 15%) × contribution amount</li>
              <li>Someone on 30% marginal rate saves 15% on each dollar contributed</li>
              <li>Someone on 45% marginal rate saves 30% on each dollar contributed</li>
              <li>Concessional contributions capped at $30,000 per year (includes employer contributions)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Division 293 Tax</h3>
            <p className="mb-4">
              High-income earners (over $250,000) pay an additional 15% tax on concessional super contributions through 
              Division 293 tax. This means their super contributions are effectively taxed at 30% instead of 15%, though 
              this is still typically lower than their marginal tax rate of 45%.
            </p>

            <h3 className="text-xl font-semibold mb-3">Carry-Forward Concessional Contributions</h3>
            <p className="mb-4">
              Since 1 July 2018, you can carry forward unused concessional contribution cap amounts for up to five years. 
              This allows you to make larger contributions in years when you have extra cash available, provided your 
              total super balance was less than $500,000 at the previous June 30.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Tax Planning Strategies</h2>
            
            <h3 className="text-xl font-semibold mb-3">Timing Income and Deductions</h3>
            <p className="mb-4">
              Strategic timing of income and deductions can optimize your tax position:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Defer income to lower-income years when possible</li>
              <li>Bring forward deductions into higher-income years</li>
              <li>Pre-pay deductible expenses before June 30 in high-income years</li>
              <li>Time asset sales to utilize capital gains discount or harvest losses</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Investment Tax Strategies</h3>
            <p className="mb-4">
              Tax-effective investing is crucial for long-term wealth building:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Franked dividends:</strong> Australian company dividends come with franking credits, reducing overall tax</li>
              <li><strong>Capital gains discount:</strong> Hold assets for more than 12 months for 50% CGT discount</li>
              <li><strong>Negative gearing:</strong> Investment property losses can offset other taxable income</li>
              <li><strong>Superannuation investing:</strong> Investment earnings taxed at maximum 15% inside super</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3">Family Income Splitting</h3>
            <p className="mb-4">
              While income splitting is limited in Australia, some legitimate strategies exist:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Spouse super contributions (tax deduction up to $3,000 if spouse earns less than $37,000)</li>
              <li>Income from business structures (companies, trusts, partnerships)</li>
              <li>Investment income from jointly owned assets</li>
              <li>Ensure higher-income spouse claims shared deductions like investment property expenses</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Important Tax Dates and Deadlines</h2>
            <p className="mb-4">
              Mark these key dates in your calendar for the 2025-26 financial year:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>1 July 2025:</strong> Start of 2025-26 financial year</li>
              <li><strong>30 June 2026:</strong> End of 2025-26 financial year - deadline for deductions</li>
              <li><strong>14 July 2026:</strong> PAYG payment summaries issued by employers</li>
              <li><strong>31 October 2026:</strong> Tax return lodgment deadline (if lodging yourself)</li>
              <li><strong>15 May 2027:</strong> Extended deadline if using registered tax agent</li>
              <li><strong>21st of each month:</strong> PAYG installment due dates for business income</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Common Tax Mistakes to Avoid</h2>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Forgetting to declare all income:</strong> Include bank interest, dividends, rental income, and foreign income</li>
              <li><strong>Claiming ineligible deductions:</strong> Personal expenses, fines, and commuting costs are not deductible</li>
              <li><strong>Poor record keeping:</strong> Keep receipts and documentation for at least 5 years</li>
              <li><strong>Missing the lodgment deadline:</strong> Late fees and penalties apply to overdue returns</li>
              <li><strong>Incorrect HELP repayments:</strong> Ensure your employer withholds correct amount if you have HELP debt</li>
              <li><strong>Not updating details:</strong> Inform ATO of address changes, bank details, and residency status</li>
              <li><strong>Overclaiming work from home expenses:</strong> Must have records to substantiate claims</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">When to Seek Professional Tax Advice</h2>
            <p className="mb-4">
              While this calculator provides comprehensive estimates, consider consulting a registered tax agent if you:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Have complex investment structures (trusts, companies, partnerships)</li>
              <li>Own investment properties or rental income</li>
              <li>Have foreign income or assets</li>
              <li>Are self-employed or run a business</li>
              <li>Have significant capital gains or losses</li>
              <li>Changed residency status during the year</li>
              <li>Have cryptocurrency investments or transactions</li>
              <li>Want to optimize tax strategies for your situation</li>
            </ul>
            <p className="mb-4">
              A good tax agent can often save you more than their fee through legitimate deductions and tax planning strategies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            
            <h3 className="text-xl font-semibold mb-3">Do I need to lodge a tax return?</h3>
            <p className="mb-4">
              Most Australian workers need to lodge a tax return. You must lodge if you earned over $18,200, had tax 
              withheld from your income, or operated a business. Even if you're below the threshold, you may want to 
              lodge to claim a refund of tax withheld.
            </p>

            <h3 className="text-xl font-semibold mb-3">How long does a tax refund take?</h3>
            <p className="mb-4">
              Most tax refunds are processed within 2 weeks if you lodge electronically (via myTax or a tax agent). 
              Paper returns can take up to 10 weeks. The ATO issues refunds to your nominated bank account.
            </p>

            <h3 className="text-xl font-semibold mb-3">Can I claim tax back on my work from home expenses?</h3>
            <p className="mb-4">
              Yes, if you work from home you can claim a portion of running costs (electricity, internet, phone) and 
              depreciation on equipment. You need records to support your claim - either actual costs, or use the ATO's 
              fixed rate method (67 cents per hour for 2025-26).
            </p>

            <h3 className="text-xl font-semibold mb-3">What happens if I don't lodge my tax return on time?</h3>
            <p className="mb-4">
              Failure to lodge on time results in penalties. The failure to lodge penalty is one penalty unit ($313 for 
              2025-26) for each 28-day period or part thereof that the return is overdue, up to a maximum of five penalty 
              units. Additional penalties and interest may apply to unpaid tax.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Using This Tax Calculator</h2>
            <p className="mb-4">
              This comprehensive Australian tax calculator provides accurate estimates for the 2025-26 financial year 
              based on current ATO rates and thresholds. It includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Income tax calculation for residents and foreign residents</li>
              <li>Medicare Levy (2%) calculation</li>
              <li>Medicare Levy Surcharge for those without private health insurance</li>
              <li>HELP/HECS debt repayment calculations</li>
              <li>Low Income Tax Offset (LITO) automatic application</li>
              <li>Tax refund or amount owing estimates when tax withheld is entered</li>
              <li>AI-powered tax planning recommendations</li>
            </ul>
            <p className="mb-4">
              Remember that this calculator provides estimates only. Your actual tax liability may vary based on your 
              specific circumstances, additional income sources, offsets, and deductions not captured in the calculator. 
              Always verify with the ATO or a registered tax agent for your individual situation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Additional Resources</h2>
            <p className="mb-4">
              For more information about Australian taxation:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li><strong>Australian Taxation Office (ATO):</strong> ato.gov.au - official source for all tax information</li>
              <li><strong>myTax:</strong> Online tax lodgment system through myGov</li>
              <li><strong>myDeductions app:</strong> ATO app for tracking deductions throughout the year</li>
              <li><strong>Tax Agent Portal:</strong> Find registered tax agents in your area</li>
              <li><strong>Moneysmart.gov.au:</strong> ASIC's guide to managing money and taxes</li>
            </ul>
          </section>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <p className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Disclaimer
            </p>
            <p className="text-sm text-muted-foreground">
              This calculator provides estimates based on the information provided and current tax rates for the 2025-26 
              financial year. It should not be considered financial or tax advice. Tax laws are complex and individual 
              circumstances vary. Always consult with a registered tax agent or the Australian Taxation Office for advice 
              specific to your situation. The calculations do not account for all possible tax offsets, surcharges, or 
              special circumstances that may apply to your situation.
            </p>
          </div>
        </CardContent>
      </Card>
    </CalculatorLayoutWithAds>
  );
};

export default ComprehensiveTaxCalculatorAustralia;
