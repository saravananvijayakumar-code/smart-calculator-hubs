import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { Calculator, TrendingUp, AlertTriangle, MapPin, DollarSign, PieChart, BookOpen, Target } from 'lucide-react';
import type { StateTaxAnalysisData } from '~backend/ai-analysis/types';

interface TaxBracket {
  min: number;
  max: number;
  rate: number;
}

interface StateTaxInfo {
  name: string;
  brackets: TaxBracket[];
  standardDeduction: number;
  hasStateIncomeTax: boolean;
  notes?: string;
  rank?: number;
}

const stateTaxData: Record<string, StateTaxInfo> = {
  CA: {
    name: 'California',
    hasStateIncomeTax: true,
    standardDeduction: 5202,
    rank: 1,
    notes: 'Highest state income tax rates in the US, with top rate of 13.3% including mental health tax',
    brackets: [
      { min: 0, max: 10099, rate: 0.01 },
      { min: 10100, max: 23942, rate: 0.02 },
      { min: 23943, max: 37788, rate: 0.04 },
      { min: 37789, max: 52455, rate: 0.06 },
      { min: 52456, max: 66295, rate: 0.08 },
      { min: 66296, max: 338639, rate: 0.093 },
      { min: 338640, max: 406364, rate: 0.103 },
      { min: 406365, max: 677278, rate: 0.113 },
      { min: 677279, max: Infinity, rate: 0.123 }
    ]
  },
  NY: {
    name: 'New York',
    hasStateIncomeTax: true,
    standardDeduction: 8000,
    rank: 2,
    notes: 'High state tax rates, especially when combined with NYC local income tax',
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8501, max: 11700, rate: 0.045 },
      { min: 11701, max: 13900, rate: 0.0525 },
      { min: 13901, max: 80650, rate: 0.055 },
      { min: 80651, max: 215400, rate: 0.06 },
      { min: 215401, max: 1077550, rate: 0.0685 },
      { min: 1077551, max: 5000000, rate: 0.0965 },
      { min: 5000001, max: 25000000, rate: 0.103 },
      { min: 25000001, max: Infinity, rate: 0.109 }
    ]
  },
  TX: {
    name: 'Texas',
    hasStateIncomeTax: false,
    standardDeduction: 0,
    rank: 50,
    notes: 'No state income tax, relying on sales tax and property tax for revenue',
    brackets: []
  },
  FL: {
    name: 'Florida',
    hasStateIncomeTax: false,
    standardDeduction: 0,
    rank: 50,
    notes: 'No state income tax, popular retirement destination for tax benefits',
    brackets: []
  },
  WA: {
    name: 'Washington',
    hasStateIncomeTax: false,
    standardDeduction: 0,
    rank: 50,
    notes: 'No state income tax, but has a capital gains tax on high earners',
    brackets: []
  },
  NV: {
    name: 'Nevada',
    hasStateIncomeTax: false,
    standardDeduction: 0,
    rank: 50,
    notes: 'No state income tax, business-friendly environment',
    brackets: []
  },
  IL: {
    name: 'Illinois',
    hasStateIncomeTax: true,
    standardDeduction: 2775,
    rank: 15,
    notes: 'Flat tax state with 4.95% rate on all income levels',
    brackets: [
      { min: 0, max: Infinity, rate: 0.0495 }
    ]
  },
  NJ: {
    name: 'New Jersey',
    hasStateIncomeTax: true,
    standardDeduction: 1000,
    rank: 3,
    notes: 'High state tax rates, especially on high earners',
    brackets: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20001, max: 35000, rate: 0.0175 },
      { min: 35001, max: 40000, rate: 0.035 },
      { min: 40001, max: 75000, rate: 0.0553 },
      { min: 75001, max: 500000, rate: 0.0637 },
      { min: 500001, max: 5000000, rate: 0.0897 },
      { min: 5000001, max: Infinity, rate: 0.1075 }
    ]
  }
};

const federalTaxBrackets2025: TaxBracket[] = [
  { min: 0, max: 11925, rate: 0.10 },
  { min: 11926, max: 48475, rate: 0.12 },
  { min: 48476, max: 103350, rate: 0.22 },
  { min: 103351, max: 197300, rate: 0.24 },
  { min: 197301, max: 250525, rate: 0.32 },
  { min: 250526, max: 626350, rate: 0.35 },
  { min: 626351, max: Infinity, rate: 0.37 }
];

const federalStandardDeduction = {
  single: 15000,
  marriedJointly: 30000,
  marriedSeparately: 15000,
  headOfHousehold: 22500
};

function calculateTax(income: number, brackets: TaxBracket[]): number {
  let tax = 0;
  
  for (const bracket of brackets) {
    if (income <= bracket.min) break;
    
    const taxableInBracket = Math.min(income, bracket.max) - bracket.min;
    tax += taxableInBracket * bracket.rate;
  }
  
  return tax;
}

function calculateTaxBreakdown(income: number, brackets: TaxBracket[]) {
  const breakdown = [];
  let remainingIncome = income;
  
  for (const bracket of brackets) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min);
    if (taxableInBracket > 0) {
      breakdown.push({
        range: `$${bracket.min.toLocaleString()} - ${bracket.max === Infinity ? 'Above' : `$${bracket.max.toLocaleString()}`}`,
        rate: (bracket.rate * 100).toFixed(1) + '%',
        income: taxableInBracket,
        tax: taxableInBracket * bracket.rate
      });
      remainingIncome -= taxableInBracket;
    }
  }
  
  return breakdown;
}

export function StateTaxCalculatorUS() {
  const [grossIncome, setGrossIncome] = useState<string>('75000');
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [state, setState] = useState<string>('CA');
  const [federalDeductions, setFederalDeductions] = useState<string>('');
  const [stateDeductions, setStateDeductions] = useState<string>('');
  const [activeTab, setActiveTab] = useState('calculator');

  const [results, setResults] = useState({
    federalTaxableIncome: 0,
    stateTaxableIncome: 0,
    federalTax: 0,
    stateTax: 0,
    totalTax: 0,
    effectiveTaxRate: 0,
    marginalTaxRate: 0,
    afterTaxIncome: 0,
    federalBreakdown: [] as any[],
    stateBreakdown: [] as any[],
    comparison: [] as any[]
  });

  useEffect(() => {
    const income = parseFloat(grossIncome) || 0;
    const fedDeductions = parseFloat(federalDeductions) || federalStandardDeduction[filingStatus as keyof typeof federalStandardDeduction];
    const stateInfo = stateTaxData[state];
    const stDeductions = parseFloat(stateDeductions) || (stateInfo.hasStateIncomeTax ? stateInfo.standardDeduction : 0);

    const federalTaxableIncome = Math.max(0, income - fedDeductions);
    const stateTaxableIncome = Math.max(0, income - stDeductions);

    const federalTax = calculateTax(federalTaxableIncome, federalTaxBrackets2025);
    const stateTax = stateInfo.hasStateIncomeTax ? calculateTax(stateTaxableIncome, stateInfo.brackets) : 0;

    const totalTax = federalTax + stateTax;
    const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;
    const afterTaxIncome = income - totalTax;

    // Calculate marginal tax rate
    let marginalTaxRate = 0;
    if (federalTaxableIncome > 0) {
      const federalMarginal = federalTaxBrackets2025.find(bracket => 
        federalTaxableIncome > bracket.min && federalTaxableIncome <= bracket.max
      )?.rate || 0;
      
      const stateMarginal = stateInfo.hasStateIncomeTax && stateTaxableIncome > 0 
        ? stateInfo.brackets.find(bracket => 
            stateTaxableIncome > bracket.min && stateTaxableIncome <= bracket.max
          )?.rate || 0
        : 0;
      
      marginalTaxRate = (federalMarginal + stateMarginal) * 100;
    }

    // Calculate tax breakdowns
    const federalBreakdown = calculateTaxBreakdown(federalTaxableIncome, federalTaxBrackets2025);
    const stateBreakdown = stateInfo.hasStateIncomeTax ? calculateTaxBreakdown(stateTaxableIncome, stateInfo.brackets) : [];

    // State comparison
    const comparison = Object.entries(stateTaxData).map(([code, info]) => {
      const stateStateTax = info.hasStateIncomeTax 
        ? calculateTax(Math.max(0, income - (info.standardDeduction || 0)), info.brackets || [])
        : 0;
      return {
        state: info.name || 'Unknown State',
        code,
        stateTax: isNaN(stateStateTax) ? 0 : stateStateTax,
        totalTax: isNaN(federalTax + stateStateTax) ? 0 : federalTax + stateStateTax,
        effectiveRate: income > 0 && !isNaN(federalTax + stateStateTax) ? ((federalTax + stateStateTax) / income) * 100 : 0,
        hasStateIncomeTax: info.hasStateIncomeTax || false
      };
    }).filter(item => item.state !== 'Unknown State').sort((a, b) => a.totalTax - b.totalTax);

    setResults({
      federalTaxableIncome,
      stateTaxableIncome,
      federalTax,
      stateTax,
      totalTax,
      effectiveTaxRate,
      marginalTaxRate,
      afterTaxIncome,
      federalBreakdown,
      stateBreakdown,
      comparison
    });
  }, [grossIncome, filingStatus, state, federalDeductions, stateDeductions]);

  const stateInfo = stateTaxData[state];

  const analysisData: StateTaxAnalysisData = {
    grossIncome: parseFloat(grossIncome) || 0,
    filingStatus,
    state,
    federalTaxableIncome: results.federalTaxableIncome,
    stateTaxableIncome: results.stateTaxableIncome,
    federalTax: results.federalTax,
    stateTax: results.stateTax,
    totalTax: results.totalTax,
    effectiveTaxRate: results.effectiveTaxRate,
    marginalTaxRate: results.marginalTaxRate,
    afterTaxIncome: results.afterTaxIncome,
    federalDeductions: parseFloat(federalDeductions) || federalStandardDeduction[filingStatus as keyof typeof federalStandardDeduction],
    stateDeductions: parseFloat(stateDeductions) || (stateInfo.hasStateIncomeTax ? stateInfo.standardDeduction : 0),
    hasStateIncomeTax: stateInfo.hasStateIncomeTax
  };

  const educationalContent = (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-6 w-6" />
            Complete Guide to US State Income Taxes
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-3">Understanding State Income Tax Systems</h3>
            <p className="text-muted-foreground">
              State income taxes vary dramatically across the United States, creating significant differences in your overall tax burden depending on where you live. Understanding these differences is crucial for financial planning, career decisions, and retirement planning. This comprehensive guide explores everything you need to know about state income taxes in 2024.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">The Three Categories of State Tax Systems</h3>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <Card className="p-4">
                <h4 className="font-semibold text-green-700 mb-2">No State Income Tax (9 States)</h4>
                <p className="text-sm text-muted-foreground mb-2">Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee, Texas, Washington, Wyoming</p>
                <p className="text-sm">These states don't impose income tax on individuals, though they may have other taxes like sales tax or property tax.</p>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold text-blue-700 mb-2">Flat Tax States (9 States)</h4>
                <p className="text-sm text-muted-foreground mb-2">Colorado, Illinois, Indiana, Kentucky, Michigan, North Carolina, Pennsylvania, Utah</p>
                <p className="text-sm">These states apply the same tax rate to all income levels, regardless of how much you earn.</p>
              </Card>
              
              <Card className="p-4">
                <h4 className="font-semibold text-orange-700 mb-2">Progressive Tax States (32 States + DC)</h4>
                <p className="text-sm text-muted-foreground mb-2">Including California, New York, New Jersey</p>
                <p className="text-sm">These states use graduated tax brackets where higher earners pay higher rates on income above certain thresholds.</p>
              </Card>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">How State Income Taxes Work</h3>
            <p className="mb-4">
              State income taxes operate similarly to federal taxes but with important differences. Most states that impose income tax use your federal adjusted gross income (AGI) as a starting point, then apply state-specific deductions, exemptions, and credits. However, the calculation methods vary significantly between states.
            </p>
            
            <h4 className="font-semibold mb-2">Key Components of State Tax Calculation:</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li><strong>Starting Point:</strong> Most states begin with your federal AGI or taxable income</li>
              <li><strong>State Additions:</strong> Income items that may be taxable at the state level but not federal</li>
              <li><strong>State Subtractions:</strong> Deductions or exemptions specific to your state</li>
              <li><strong>State Standard Deduction:</strong> Often different from the federal standard deduction</li>
              <li><strong>State Tax Brackets:</strong> Progressive rates applied to your state taxable income</li>
              <li><strong>State Credits:</strong> Direct reductions in your tax liability</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Highest and Lowest Tax States</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-red-700 mb-3">Highest Tax Burden States</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">California</span>
                    <span className="text-sm text-red-700">Up to 13.3%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">New York</span>
                    <span className="text-sm text-red-700">Up to 10.9%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">New Jersey</span>
                    <span className="text-sm text-red-700">Up to 10.75%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="font-medium">Oregon</span>
                    <span className="text-sm text-red-700">Up to 9.9%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-green-700 mb-3">No State Income Tax</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">Texas</span>
                    <span className="text-sm text-green-700">0%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">Florida</span>
                    <span className="text-sm text-green-700">0%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">Washington</span>
                    <span className="text-sm text-green-700">0%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="font-medium">Nevada</span>
                    <span className="text-sm text-green-700">0%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Strategic Tax Planning Considerations</h3>
            
            <h4 className="font-semibold mb-2">Income Timing Strategies</h4>
            <p className="mb-4">
              If you live in a high-tax state, timing your income recognition can significantly impact your tax liability. Consider deferring bonuses, stock option exercises, or retirement account distributions to years when you might be in a lower tax bracket or living in a lower-tax state.
            </p>
            
            <h4 className="font-semibold mb-2">Retirement Planning</h4>
            <p className="mb-4">
              Many retirees relocate to states with no income tax to preserve their retirement savings. States like Florida, Texas, and Nevada are popular retirement destinations partly due to their tax advantages. However, consider other factors like cost of living, healthcare access, and quality of life.
            </p>
            
            <h4 className="font-semibold mb-2">Business Considerations</h4>
            <p className="mb-4">
              If you're self-employed or own a business, state taxes become even more complex. Some states offer favorable treatment for business income, while others may impose additional taxes on business profits. Research your state's specific rules for business taxation.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Common State Tax Deductions and Credits</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Popular State Deductions</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>State and local taxes paid to other states</li>
                  <li>Retirement income exemptions</li>
                  <li>Student loan interest (in some states)</li>
                  <li>Health insurance premiums for self-employed</li>
                  <li>Charitable contributions (varies by state)</li>
                  <li>Mortgage interest (some states)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Common State Tax Credits</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Earned Income Tax Credit (state version)</li>
                  <li>Child and dependent care credits</li>
                  <li>Education credits and deductions</li>
                  <li>Energy efficiency home improvements</li>
                  <li>Electric vehicle purchase credits</li>
                  <li>Senior citizen property tax credits</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Multi-State Tax Situations</h3>
            <p className="mb-4">
              If you live in one state but work in another, you may face complex multi-state tax obligations. Generally, you'll file as a resident in your home state and as a non-resident in your work state. Most states provide credits for taxes paid to other states to prevent double taxation, but the rules vary significantly.
            </p>
            
            <h4 className="font-semibold mb-2">Reciprocity Agreements</h4>
            <p className="mb-4">
              Some neighboring states have reciprocity agreements that simplify tax filing for border workers. For example, if you live in Pennsylvania but work in New Jersey, you may only need to file in Pennsylvania. Research whether your states have such agreements.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">2024 Tax Law Changes and Trends</h3>
            <p className="mb-4">
              Several states have made significant changes to their tax codes in 2024. Some states have reduced tax rates to compete for residents and businesses, while others have increased rates to fund state programs. Key trends include:
            </p>
            
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Increased standard deductions in several states to match federal changes</li>
              <li>New tax brackets and rate adjustments for inflation</li>
              <li>Enhanced tax credits for families and education</li>
              <li>Modified treatment of federal tax law changes</li>
              <li>Special provisions related to remote work taxation</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Maximizing Your State Tax Benefits</h3>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Pro Tips for State Tax Optimization</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Track all state-specific deductions throughout the year</li>
                <li>Consider timing major financial decisions around tax year boundaries</li>
                <li>Review your state's tax code annually for new opportunities</li>
                <li>Maintain detailed records for multi-state tax situations</li>
                <li>Consider professional tax preparation for complex situations</li>
                <li>Evaluate the total tax impact of relocation decisions</li>
                <li>Take advantage of state-specific retirement account options</li>
                <li>Monitor proposed state tax law changes that might affect you</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-3">Planning for the Future</h3>
            <p>
              State tax planning should be an integral part of your overall financial strategy. Whether you're just starting your career, planning for retirement, or considering a move, understanding state tax implications can save you thousands of dollars annually. Use tools like this calculator to model different scenarios and make informed decisions about your financial future.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const tips = [
    "Nine states have no state income tax: AK, FL, NV, NH, SD, TN, TX, WA, WY",
    "California has the highest state income tax rate at 13.3% for high earners",
    "State taxes vary significantly - relocating can save thousands annually",
    "Most states use your federal AGI as the starting point for state taxes",
    "Some states don't tax retirement income from pensions and 401(k)s",
    "Multi-state workers may need to file returns in multiple states",
    "State tax deductions and credits often differ from federal options",
    "Consider state taxes when planning major financial decisions"
  ];

  return (
    <CalculatorLayoutWithAds
      title="US State Tax Calculator 2025 - Compare State Income Tax Rates"
      description="Calculate and compare state income taxes across all 50 US states. Get personalized AI analysis and tax optimization strategies for 2025 tax planning."
      keywords="state tax calculator, US state income tax, tax comparison, state tax rates 2025, California tax, New York tax, Texas no tax, Florida tax benefits, tax planning strategies"
      tips={tips}
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">US State Tax Calculator 2025</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Calculate your federal and state income taxes, compare rates across states, and get personalized optimization strategies. 
            Make informed decisions about relocation, retirement planning, and tax strategies with our comprehensive analysis.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="calculator" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger value="comparison" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              State Comparison
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Complete Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Tax Information
                    </CardTitle>
                    <CardDescription>Enter your income and filing details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="grossIncome">Annual Gross Income</Label>
                      <Input
                        id="grossIncome"
                        type="number"
                        value={grossIncome}
                        onChange={(e) => setGrossIncome(e.target.value)}
                        placeholder="75000"
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="filingStatus">Filing Status</Label>
                      <Select value={filingStatus} onValueChange={setFilingStatus}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="marriedJointly">Married Filing Jointly</SelectItem>
                          <SelectItem value="marriedSeparately">Married Filing Separately</SelectItem>
                          <SelectItem value="headOfHousehold">Head of Household</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <Select value={state} onValueChange={setState}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(stateTaxData).map(([code, info]) => (
                            <SelectItem key={code} value={code}>
                              {info.name} {!info.hasStateIncomeTax && '(No Income Tax)'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="federalDeductions">Federal Deductions (optional)</Label>
                      <Input
                        id="federalDeductions"
                        type="number"
                        value={federalDeductions}
                        onChange={(e) => setFederalDeductions(e.target.value)}
                        placeholder={`Standard: $${federalStandardDeduction[filingStatus as keyof typeof federalStandardDeduction].toLocaleString()}`}
                      />
                    </div>

                    {stateInfo.hasStateIncomeTax && (
                      <div>
                        <Label htmlFor="stateDeductions">State Deductions (optional)</Label>
                        <Input
                          id="stateDeductions"
                          type="number"
                          value={stateDeductions}
                          onChange={(e) => setStateDeductions(e.target.value)}
                          placeholder={`Standard: $${stateInfo.standardDeduction.toLocaleString()}`}
                        />
                      </div>
                    )}

                    {stateInfo.notes && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{stateInfo.notes}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      Tax Results
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {stateInfo.name}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <Label className="text-sm text-muted-foreground">Federal Tax</Label>
                        <p className="text-2xl font-bold text-blue-600">${results.federalTax.toLocaleString()}</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <Label className="text-sm text-muted-foreground">State Tax</Label>
                        <p className="text-2xl font-bold text-red-600">
                          {stateInfo.hasStateIncomeTax ? `$${results.stateTax.toLocaleString()}` : '$0'}
                        </p>
                      </div>
                    </div>

                    <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <Label className="text-sm text-muted-foreground">Total Tax Burden</Label>
                      <p className="text-3xl font-bold text-purple-600">${results.totalTax.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {results.effectiveTaxRate.toFixed(2)}% effective rate
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">After-Tax Income</Label>
                        <p className="text-xl font-bold text-green-600">${results.afterTaxIncome.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Marginal Rate</Label>
                        <p className="text-xl font-bold">{results.marginalTaxRate.toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Federal Burden</span>
                        <span>{((results.federalTax / results.totalTax) * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={(results.federalTax / results.totalTax) * 100} className="h-2" />
                      
                      {stateInfo.hasStateIncomeTax && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>State Burden</span>
                            <span>{((results.stateTax / results.totalTax) * 100).toFixed(1)}%</span>
                          </div>
                          <Progress value={(results.stateTax / results.totalTax) * 100} className="h-2" />
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {(results.federalBreakdown.length > 0 || results.stateBreakdown.length > 0) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Breakdown by Bracket</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {results.federalBreakdown.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Federal Tax Brackets</h4>
                          <div className="space-y-2">
                            {results.federalBreakdown.map((bracket, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span>{bracket.range} ({bracket.rate})</span>
                                <span className="font-medium">${bracket.tax.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {results.stateBreakdown.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">{stateInfo.name} Tax Brackets</h4>
                          <div className="space-y-2">
                            {results.stateBreakdown.map((bracket, index) => (
                              <div key={index} className="flex justify-between items-center text-sm">
                                <span>{bracket.range} ({bracket.rate})</span>
                                <span className="font-medium">${bracket.tax.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>State Tax Comparison</CardTitle>
                <CardDescription>
                  Compare your tax burden across different states with your current income of ${parseFloat(grossIncome || '0').toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {results.comparison && results.comparison.length > 0 ? (
                  <div className="grid gap-3">
                    {results.comparison.slice(0, 10).map((compState, index) => (
                      <div key={compState.code} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                          <div>
                            <p className="font-medium">{compState.state}</p>
                            <p className="text-sm text-muted-foreground">
                              {compState.hasStateIncomeTax ? `$${compState.stateTax.toLocaleString()} state tax` : 'No state income tax'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${compState.totalTax.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{compState.effectiveRate.toFixed(2)}% total</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>Enter your income to see state comparisons</p>
                  </div>
                )}
                
                {results.comparison.length > 1 && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Potential Savings by Moving</h4>
                    <p className="text-sm">
                      {(() => {
                        const currentState = results.comparison.find(s => s.code === state);
                        const lowestTaxState = results.comparison[0];
                        
                        if (currentState && lowestTaxState && currentState.totalTax > lowestTaxState.totalTax) {
                          const savings = currentState.totalTax - lowestTaxState.totalTax;
                          return (
                            <>
                              Moving from {stateInfo.name} to {lowestTaxState.state} could save you{' '}
                              <span className="font-bold text-green-600">
                                ${savings.toLocaleString()}
                              </span>{' '}
                              annually in taxes.
                            </>
                          );
                        } else {
                          return `${stateInfo.name} already offers competitive tax rates compared to other states.`;
                        }
                      })()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <AIAnalysis
              analysisRequest={{
                calculatorType: "state-tax",
                data: analysisData
              }}
              className="w-full"
              title="State Tax Analysis"
              description="Get personalized tax optimization strategies and insights based on your state tax situation."
            />

            {results && (
              <ExportShareButtons
                calculatorType="state-tax"
                inputs={{
                  income: parseFloat(grossIncome) || 0,
                  filingStatus,
                  state
                }}
                results={{
                  federalTax: results.federalTax,
                  stateTax: results.stateTax,
                  totalTax: results.totalTax,
                  effectiveRate: results.effectiveTaxRate,
                  takeHomePay: results.afterTaxIncome
                }}
                title="State Tax Calculator Report"
              />
            )}
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            {educationalContent}
          </TabsContent>
        </Tabs>
      </div>
    </CalculatorLayoutWithAds>
  );
}