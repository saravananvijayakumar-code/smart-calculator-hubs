import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Wallet, Info, TrendingUp, Target } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';

const ISACalculatorUK: React.FC = () => {
  const [isaType, setIsaType] = useState<string>('');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('');
  const [initialInvestment, setInitialInvestment] = useState<string>('');
  const [expectedReturn, setExpectedReturn] = useState<string>('');
  const [investmentPeriod, setInvestmentPeriod] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateISA = () => {
    const monthly = parseFloat(monthlyContribution) || 0;
    const initial = parseFloat(initialInvestment) || 0;
    const annualReturn = parseFloat(expectedReturn) / 100 || 0;
    const years = parseFloat(investmentPeriod) || 0;

    if (years <= 0) return;

    const monthlyReturn = annualReturn / 12;
    const totalMonths = years * 12;

    // Calculate compound growth
    const futureValueInitial = initial * Math.pow(1 + annualReturn, years);
    
    // Calculate annuity future value for monthly contributions
    let futureValueContributions = 0;
    if (monthly > 0 && monthlyReturn > 0) {
      futureValueContributions = monthly * (Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn;
    } else if (monthly > 0) {
      futureValueContributions = monthly * totalMonths;
    }

    const totalValue = futureValueInitial + futureValueContributions;
    const totalContributed = initial + (monthly * totalMonths);
    const totalGrowth = totalValue - totalContributed;
    const taxSaved = totalGrowth * 0.2; // Assuming 20% tax rate

    // ISA allowance calculations
    const currentAllowance = 20000; // 2024/25 allowance
    const annualContribution = initial + (monthly * 12);
    const allowanceUsed = Math.min(annualContribution, currentAllowance);
    const allowanceRemaining = currentAllowance - allowanceUsed;

    setResults({
      totalValue,
      totalContributed,
      totalGrowth,
      taxSaved,
      allowanceUsed,
      allowanceRemaining,
      effectiveReturn: ((totalValue - totalContributed) / totalContributed) * 100,
      annualizedReturn: Math.pow(totalValue / totalContributed, 1 / years) - 1
    });
  };

  const reset = () => {
    setIsaType('');
    setMonthlyContribution('');
    setInitialInvestment('');
    setExpectedReturn('');
    setInvestmentPeriod('');
    setResults(null);
  };

  const tips = [
    "Current ISA allowance is £20,000 per tax year (2024/25)",
    "Stocks & Shares ISAs offer higher growth potential than Cash ISAs",
    "ISA gains and income are completely tax-free",
    "You can split your allowance between different ISA types",
    "Consider your risk tolerance when choosing ISA investments"
  ];

  return (
    <CalculatorLayoutWithAds
      title="UK ISA Calculator"
      description="Calculate potential returns and tax savings from Individual Savings Accounts (ISAs) in the UK"
      keywords="UK ISA calculator, stocks and shares ISA, cash ISA calculator, ISA allowance, tax free savings"
      tips={tips}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              ISA Calculator
            </CardTitle>
            <CardDescription>
              Calculate your ISA returns and tax savings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="isaType">ISA Type</Label>
              <Select value={isaType} onValueChange={setIsaType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ISA type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash ISA</SelectItem>
                  <SelectItem value="stocks">Stocks & Shares ISA</SelectItem>
                  <SelectItem value="lifetime">Lifetime ISA</SelectItem>
                  <SelectItem value="innovative">Innovative Finance ISA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialInvestment">Initial Investment (£)</Label>
              <Input
                id="initialInvestment"
                type="number"
                placeholder="Enter initial amount"
                value={initialInvestment}
                onChange={(e) => setInitialInvestment(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyContribution">Monthly Contribution (£)</Label>
              <Input
                id="monthlyContribution"
                type="number"
                placeholder="Enter monthly contribution"
                value={monthlyContribution}
                onChange={(e) => setMonthlyContribution(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedReturn">Expected Annual Return (%)</Label>
              <Input
                id="expectedReturn"
                type="number"
                step="0.1"
                placeholder="Enter expected return"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentPeriod">Investment Period (Years)</Label>
              <Input
                id="investmentPeriod"
                type="number"
                placeholder="Enter investment period"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateISA} className="flex-1">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
              </Button>
              <Button onClick={reset} variant="outline">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                ISA Projection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(results.totalValue, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Contributed</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.totalContributed, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Growth</p>
                  <p className="text-lg font-semibold text-blue-600">{formatCurrency(results.totalGrowth, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tax Saved</p>
                  <p className="text-lg font-semibold text-orange-600">{formatCurrency(results.taxSaved, 'GBP')}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Allowance Used:</span>
                  <Badge variant="outline">{formatCurrency(results.allowanceUsed, 'GBP')}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Allowance Remaining:</span>
                  <Badge variant="secondary">{formatCurrency(results.allowanceRemaining, 'GBP')}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Effective Return:</span>
                  <Badge variant="outline">{results.effectiveReturn.toFixed(2)}%</Badge>
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
            Understanding UK Individual Savings Accounts (ISAs)
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Individual Savings Accounts (ISAs) represent one of the most valuable tax-efficient savings vehicles 
            available to UK residents. These government-backed schemes allow you to save and invest money while 
            enjoying complete freedom from income tax, capital gains tax, and dividend tax on your returns. 
            Understanding ISAs is crucial for anyone serious about building wealth in the UK.
          </p>

          <h3>The ISA Landscape: Types and Opportunities</h3>
          <p>
            The UK offers several ISA variants, each designed for different financial goals and life stages. 
            Cash ISAs provide secure, accessible savings with guaranteed capital protection, making them ideal 
            for emergency funds and short-term goals. Stocks and Shares ISAs offer higher growth potential through 
            investment in funds, shares, and bonds, though with associated market risks. Lifetime ISAs specifically 
            target first-time home buyers and retirement savers aged 18-39, offering a 25% government bonus on 
            contributions up to £1,000 annually.
          </p>

          <h3>Annual Allowances and Strategic Planning</h3>
          <p>
            The 2024/25 ISA allowance stands at £20,000, representing a substantial opportunity for tax-efficient 
            saving. This allowance operates on a use-it-or-lose-it basis, resetting each April without the ability 
            to carry forward unused portions. Strategic planners often maximize their ISA contributions early in 
            the tax year to maximize compound growth benefits. The allowance can be split across different ISA 
            types, though specific rules govern combinations and transfers.
          </p>

          <h3>Compound Growth and Tax Benefits</h3>
          <p>
            The true power of ISAs lies in their ability to shelter compound growth from taxation indefinitely. 
            While a basic-rate taxpayer might lose 20% of their investment gains to tax in a general investment 
            account, ISA holders keep every penny of growth. Over long periods, this tax advantage compounds 
            dramatically. A £20,000 annual investment growing at 7% annually would be worth significantly more 
            in an ISA wrapper than in a taxable account after 20 years.
          </p>

          <h3>Cash ISAs: Security and Accessibility</h3>
          <p>
            Cash ISAs offer the security of guaranteed capital protection while providing tax-free interest. 
            Current interest rates, while historically low, still benefit from tax shelter advantages. Easy-access 
            Cash ISAs provide immediate liquidity for emergency funds, while fixed-rate versions offer higher 
            returns for savers who can commit funds for specific periods. Regular savings Cash ISAs encourage 
            disciplined monthly saving habits with competitive rates.
          </p>

          <h3>Stocks and Shares ISAs: Growth Potential</h3>
          <p>
            For long-term wealth building, Stocks and Shares ISAs offer unparalleled opportunities. These accounts 
            can hold individual shares, investment funds, ETFs, and bonds, all growing completely tax-free. 
            Historical market returns suggest average annual growth of 6-8% over long periods, though past 
            performance never guarantees future results. The key advantage lies in tax-free dividend income 
            and capital gains, which can be substantial over decades.
          </p>

          <h3>Lifetime ISAs: Targeted Incentives</h3>
          <p>
            Lifetime ISAs uniquely combine ISA tax benefits with direct government contributions. Savers aged 
            18-39 can contribute up to £4,000 annually and receive a 25% government bonus, effectively earning 
            immediate 25% returns. However, early withdrawal penalties and specific usage restrictions make 
            LISAs suitable only for committed home buyers or retirement savers. The government bonus continues 
            until age 50, making LISAs powerful long-term wealth-building tools.
          </p>

          <h3>Portfolio Construction and Risk Management</h3>
          <p>
            Successful ISA investing requires thoughtful portfolio construction balancing growth potential with 
            risk tolerance. Diversified index funds offer broad market exposure with low costs, while individual 
            shares provide opportunities for higher returns with increased risk. Asset allocation should reflect 
            investment timeframes, with younger investors typically accepting higher equity exposure for growth 
            potential, while those approaching retirement might favor more conservative allocations.
          </p>

          <h3>ISA Transfers and Flexibility</h3>
          <p>
            ISA holders enjoy significant flexibility through transfer mechanisms allowing movement between providers 
            and ISA types without losing tax advantages. Current year contributions can be transferred unlimited 
            times, while previous years' ISAs can be consolidated or moved for better terms. This flexibility 
            ensures savers can always access the best rates and investment options without sacrificing their 
            valuable ISA wrapper benefits.
          </p>

          <h3>Common Mistakes and Optimization Strategies</h3>
          <p>
            Many savers underutilize their ISA allowances or make suboptimal choices that limit long-term wealth 
            accumulation. Common mistakes include keeping Cash ISAs with poor interest rates, not maximizing 
            annual allowances, or choosing inappropriate risk levels for investment timeframes. Successful ISA 
            strategies involve regular allowance maximization, periodic provider reviews, and maintaining 
            appropriate asset allocation as circumstances change.
          </p>
        </CardContent>
      </Card>

      {results && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="isa-uk"
            inputs={{
              isaType,
              monthlyContribution,
              initialInvestment,
              expectedReturn,
              investmentPeriod
            }}
            results={results}
            title="ISA Investment Projection"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
};

export default ISACalculatorUK;