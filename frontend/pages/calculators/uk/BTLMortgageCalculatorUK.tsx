import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Home, Info, TrendingUp, Building } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';

const BTLMortgageCalculatorUK: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [mortgageTerm, setMortgageTerm] = useState<string>('25');
  const [monthlyRent, setMonthlyRent] = useState<string>('');
  const [monthlyExpenses, setMonthlyExpenses] = useState<string>('');
  const [taxRate, setTaxRate] = useState<string>('20');
  const [results, setResults] = useState<any>(null);

  const calculateBTL = () => {
    const propValue = parseFloat(propertyValue);
    const depositAmount = parseFloat(deposit);
    const rate = parseFloat(interestRate) / 100;
    const termYears = parseFloat(mortgageTerm);
    const rent = parseFloat(monthlyRent);
    const expenses = parseFloat(monthlyExpenses) || 0;
    const tax = parseFloat(taxRate) / 100;

    if (!propValue || !depositAmount || !rate || !termYears || !rent) return;

    const loanAmount = propValue - depositAmount;
    const monthlyRate = rate / 12;
    const totalPayments = termYears * 12;

    // Monthly mortgage payment calculation
    const monthlyPayment = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    // Cash flow calculations
    const grossRentalIncome = rent * 12;
    const totalAnnualExpenses = (expenses * 12) + (monthlyPayment * 12);
    const netRentalIncome = grossRentalIncome - totalAnnualExpenses;
    
    // Tax calculations (Section 24 rules - interest not fully deductible)
    const annualInterest = loanAmount * rate;
    const taxableProfit = Math.max(0, grossRentalIncome - (expenses * 12) - annualInterest);
    const taxLiability = taxableProfit * tax;
    const netIncomeAfterTax = netRentalIncome - taxLiability;

    // Yield calculations
    const grossYield = (grossRentalIncome / propValue) * 100;
    const netYield = (netIncomeAfterTax / propValue) * 100;
    const cashOnCashReturn = (netIncomeAfterTax / depositAmount) * 100;

    // LTV and stress testing
    const ltv = (loanAmount / propValue) * 100;
    const rentCover = rent / monthlyPayment;
    
    // Stress test at 5.5% interest rate
    const stressRate = 0.055 / 12;
    const stressPayment = loanAmount * 
      (stressRate * Math.pow(1 + stressRate, totalPayments)) /
      (Math.pow(1 + stressRate, totalPayments) - 1);
    const stressRentCover = rent / stressPayment;

    // Total costs
    const stampDuty = calculateStampDutyBTL(propValue);
    const totalUpfrontCosts = depositAmount + stampDuty + 5000; // Assuming £5k other costs

    setResults({
      loanAmount,
      monthlyPayment,
      grossYield,
      netYield,
      cashOnCashReturn,
      ltv,
      rentCover,
      stressRentCover,
      netIncomeAfterTax,
      monthlyNetIncome: netIncomeAfterTax / 12,
      totalUpfrontCosts,
      stampDuty,
      taxLiability
    });
  };

  const calculateStampDutyBTL = (value: number) => {
    // BTL stamp duty rates (additional 3% surcharge)
    let stampDuty = 0;
    if (value <= 250000) {
      stampDuty = value * 0.03;
    } else if (value <= 925000) {
      stampDuty = 250000 * 0.03 + (value - 250000) * 0.08;
    } else if (value <= 1500000) {
      stampDuty = 250000 * 0.03 + (925000 - 250000) * 0.08 + (value - 925000) * 0.13;
    } else {
      stampDuty = 250000 * 0.03 + (925000 - 250000) * 0.08 + (1500000 - 925000) * 0.13 + (value - 1500000) * 0.15;
    }
    return stampDuty;
  };

  const reset = () => {
    setPropertyValue('');
    setDeposit('');
    setInterestRate('');
    setMortgageTerm('25');
    setMonthlyRent('');
    setMonthlyExpenses('');
    setTaxRate('20');
    setResults(null);
  };

  const tips = [
    "BTL mortgages typically require 25% minimum deposit",
    "Rental income should cover 125-145% of mortgage payments",
    "Consider additional costs: management fees, void periods, maintenance",
    "BTL properties attract 3% stamp duty surcharge",
    "Rental income is subject to income tax - consider tax efficiency"
  ];

  return (
    <CalculatorLayoutWithAds
      title="UK Buy-to-Let Mortgage Calculator"
      description="Calculate buy-to-let mortgage payments, yields, and rental returns for UK property investment"
      keywords="UK buy to let calculator, BTL mortgage calculator, rental yield calculator, property investment UK"
      tips={tips}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              BTL Mortgage Calculator
            </CardTitle>
            <CardDescription>
              Calculate buy-to-let investment returns and cash flow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="propertyValue">Property Value (£)</Label>
              <Input
                id="propertyValue"
                type="number"
                placeholder="Enter property value"
                value={propertyValue}
                onChange={(e) => setPropertyValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit">Deposit (£)</Label>
              <Input
                id="deposit"
                type="number"
                placeholder="Enter deposit amount"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="interestRate">Interest Rate (%)</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.01"
                  placeholder="Enter rate"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mortgageTerm">Term (Years)</Label>
                <Input
                  id="mortgageTerm"
                  type="number"
                  placeholder="Enter term"
                  value={mortgageTerm}
                  onChange={(e) => setMortgageTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyRent">Monthly Rent (£)</Label>
              <Input
                id="monthlyRent"
                type="number"
                placeholder="Enter monthly rent"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyExpenses">Monthly Expenses (£)</Label>
              <Input
                id="monthlyExpenses"
                type="number"
                placeholder="Management, insurance, maintenance"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Select value={taxRate} onValueChange={setTaxRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tax rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">Basic Rate (20%)</SelectItem>
                  <SelectItem value="40">Higher Rate (40%)</SelectItem>
                  <SelectItem value="45">Additional Rate (45%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateBTL} className="flex-1">
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
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  BTL Analysis
                </CardTitle>
              </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Payment</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(results.monthlyPayment, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Net Income</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(results.monthlyNetIncome, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gross Yield</p>
                  <p className="text-lg font-semibold">{results.grossYield.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Yield</p>
                  <p className="text-lg font-semibold text-blue-600">{results.netYield.toFixed(2)}%</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Investment Metrics</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">LTV</p>
                    <Badge variant="outline">{results.ltv.toFixed(1)}%</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rent Cover</p>
                    <Badge variant={results.rentCover >= 1.25 ? "default" : "destructive"}>
                      {results.rentCover.toFixed(2)}x
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cash-on-Cash Return</p>
                    <Badge variant="secondary">{results.cashOnCashReturn.toFixed(2)}%</Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Stress Test (5.5%)</p>
                    <Badge variant={results.stressRentCover >= 1.25 ? "default" : "destructive"}>
                      {results.stressRentCover.toFixed(2)}x
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium">Upfront Costs</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Deposit:</span>
                    <span>{formatCurrency(parseFloat(deposit), 'GBP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stamp Duty:</span>
                    <span>{formatCurrency(results.stampDuty, 'GBP')}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Total Upfront:</span>
                    <span>{formatCurrency(results.totalUpfrontCosts, 'GBP')}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            </Card>
            
            <AIAnalysis
              analysisRequest={{
                calculatorType: "btl-mortgage-uk",
                data: {
                  propertyValue: parseFloat(propertyValue) || 0,
                  loanAmount: results.loanAmount,
                  interestRate: parseFloat(interestRate) || 0,
                  loanTerm: parseFloat(mortgageTerm) || 25,
                  monthlyRent: parseFloat(monthlyRent) || 0,
                  monthlyPayment: results.monthlyPayment,
                  rentalYield: results.grossYield,
                  ltvRatio: results.ltv,
                  monthlyCashFlow: results.monthlyNetIncome
                }
              }}
              autoRun={true}
              title="AI BTL Investment Analysis"
              description="Get personalized recommendations for your buy-to-let investment strategy, including yield optimization and risk factors."
            />

            <ExportShareButtons
              calculatorType="btl-mortgage-uk"
              inputs={{
                propertyValue: parseFloat(propertyValue) || 0,
                deposit: parseFloat(deposit) || 0,
                interestRate: parseFloat(interestRate) || 0,
                mortgageTerm: parseFloat(mortgageTerm) || 25,
                monthlyRent: parseFloat(monthlyRent) || 0
              }}
              results={{
                monthlyPayment: results.monthlyPayment,
                grossYield: results.grossYield,
                netYield: results.netYield,
                monthlyNetIncome: results.monthlyNetIncome,
                ltv: results.ltv
              }}
              title="BTL Mortgage Calculator UK Report"
            />
          </>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Understanding UK Buy-to-Let Property Investment
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            Buy-to-let property investment in the UK has evolved into a sophisticated asset class requiring careful 
            analysis of yields, tax implications, and market dynamics. While property remains a cornerstone of UK 
            wealth building, recent regulatory changes and tax reforms have fundamentally altered the investment 
            landscape, making thorough financial analysis essential for successful property investment strategies.
          </p>

          <h3>The Current Buy-to-Let Landscape</h3>
          <p>
            Today's buy-to-let market operates in a heavily regulated environment with specific lending criteria, 
            tax treatments, and regulatory requirements. Lenders typically require 20-25% deposits for BTL mortgages, 
            with interest rates generally higher than residential mortgages. The rental income must typically cover 
            125-145% of mortgage payments at a stressed interest rate, ensuring adequate cash flow even during 
            challenging periods.
          </p>

          <h3>Section 24 Tax Changes: The Game Changer</h3>
          <p>
            The introduction of Section 24 tax rules fundamentally changed BTL profitability by restricting mortgage 
            interest tax relief. Previously, landlords could deduct all mortgage interest from rental income before 
            calculating tax. Now, interest relief is limited to a basic rate tax credit, meaning higher-rate taxpayers 
            face significantly increased tax liabilities. This change particularly impacts highly leveraged properties 
            and higher-rate taxpayer landlords.
          </p>

          <h3>Stamp Duty Surcharge and Capital Costs</h3>
          <p>
            BTL investors face a 3% stamp duty surcharge on top of standard rates, significantly increasing upfront 
            costs. For a £300,000 property, this surcharge alone costs £9,000, requiring careful consideration in 
            investment calculations. Combined with legal fees, surveys, and potential refurbishment costs, total 
            upfront expenses often reach 30-35% of property value, affecting overall returns and cash requirements.
          </p>

          <h3>Yield Calculations and Investment Metrics</h3>
          <p>
            Successful BTL investment requires understanding multiple yield calculations. Gross yield measures annual 
            rent as a percentage of property value, providing basic return comparisons. Net yield accounts for all 
            expenses including mortgage payments, management fees, insurance, and maintenance, offering realistic 
            income expectations. Cash-on-cash return measures annual net income against initial cash invested, 
            helping evaluate capital efficiency.
          </p>

          <h3>Rental Coverage and Stress Testing</h3>
          <p>
            Lenders require rental income to cover mortgage payments by specific multiples, typically 125-145% of 
            monthly payments calculated at stressed interest rates around 5.5-6%. This stress testing ensures 
            properties remain viable during interest rate rises or rental voids. Properties failing stress tests 
            may require larger deposits or different financing structures, impacting overall investment viability 
            and returns.
          </p>

          <h3>Property Management and Ongoing Costs</h3>
          <p>
            Successful BTL investment requires realistic budgeting for ongoing costs beyond mortgage payments. 
            Professional management typically costs 8-12% of rental income, while maintenance, insurance, and 
            periodic refurbishment add further expenses. Void periods between tenants, potential rent arrears, and 
            regulatory compliance costs must all factor into investment planning and yield calculations.
          </p>

          <h3>Location Analysis and Market Dynamics</h3>
          <p>
            Property location fundamentally determines rental demand, yield potential, and capital growth prospects. 
            Areas with strong employment, transport links, and local amenities typically offer better rental security 
            and tenant demand. Student areas might offer higher yields but increased management complexity, while 
            professional areas provide stability but potentially lower returns. Understanding local rental markets 
            is crucial for investment success.
          </p>

          <h3>Financing Structures and Portfolio Building</h3>
          <p>
            BTL financing offers various structures from simple buy-to-let mortgages to complex limited company 
            arrangements. Limited company ownership can provide tax advantages for higher-rate taxpayers, allowing 
            full mortgage interest deductibility and corporation tax rates on profits. However, company structures 
            involve additional costs and complexity, requiring careful analysis of individual circumstances and 
            long-term investment goals.
          </p>

          <h3>Exit Strategies and Capital Gains</h3>
          <p>
            Successful BTL investment requires clear exit strategy planning, considering both capital gains tax 
            implications and market timing. Capital gains tax applies to investment property sales, with rates 
            depending on total income and gains. Private residence relief doesn't apply to BTL properties, making 
            tax planning essential for portfolio optimization. Market cycles affect optimal exit timing, requiring 
            flexibility in investment strategies.
          </p>

          <h3>Regulatory Environment and Future Considerations</h3>
          <p>
            The BTL sector faces ongoing regulatory evolution including energy efficiency requirements, selective 
            licensing schemes, and potential rent controls. Properties must meet minimum energy ratings, requiring 
            investment in improvements or restrictions on letting. Understanding current and proposed regulations 
            helps investors prepare for compliance costs and operational changes that might affect investment 
            viability and returns.
          </p>
        </CardContent>
      </Card>
    </CalculatorLayoutWithAds>
  );
};

export default BTLMortgageCalculatorUK;