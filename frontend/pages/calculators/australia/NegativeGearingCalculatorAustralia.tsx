// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Home, Info, TrendingUp, DollarSign } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

const NegativeGearingCalculatorAustralia: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [weeklyRent, setWeeklyRent] = useState<string>('');
  const [loanAmount, setLoanAmount] = useState<string>('');
  const [interestRate, setInterestRate] = useState<string>('');
  const [annualExpenses, setAnnualExpenses] = useState<string>('');
  const [taxableIncome, setTaxableIncome] = useState<string>('');
  const [depreciationClaim, setDepreciationClaim] = useState<string>('');
  const [propertyManagement, setPropertyManagement] = useState<string>('');
  const [insurance, setInsurance] = useState<string>('');
  const [councilRates, setCouncilRates] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateNegativeGearing = () => {
    const propValue = parseFloat(propertyValue);
    const rent = parseFloat(weeklyRent);
    const loan = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100;
    const expenses = parseFloat(annualExpenses) || 0;
    const income = parseFloat(taxableIncome);
    const depreciation = parseFloat(depreciationClaim) || 0;
    const management = parseFloat(propertyManagement) || 0;
    const insuranceAmt = parseFloat(insurance) || 0;
    const rates = parseFloat(councilRates) || 0;

    if (!propValue || !rent || !loan || !rate || !income) return;

    const annualRent = rent * 52;
    const annualInterest = loan * rate;
    
    // Calculate total deductions including all expense categories
    const totalDeductions = annualInterest + expenses + depreciation + management + insuranceAmt + rates;
    const netRentalIncome = annualRent - totalDeductions;
    
    // Calculate marginal tax rate (2024-25 rates)
    let marginalRate = 0;
    if (income <= 18200) marginalRate = 0;
    else if (income <= 45000) marginalRate = 0.19;
    else if (income <= 120000) marginalRate = 0.325;
    else if (income <= 180000) marginalRate = 0.37;
    else marginalRate = 0.45;

    const taxBenefit = netRentalIncome < 0 ? Math.abs(netRentalIncome) * marginalRate : 0;
    const afterTaxLoss = netRentalIncome < 0 ? Math.abs(netRentalIncome) - taxBenefit : 0;
    const weeklyAfterTaxLoss = afterTaxLoss / 52;

    // Yield calculations
    const grossYield = (annualRent / propValue) * 100;
    const netYield = (netRentalIncome / propValue) * 100;

    // Break-even calculations
    const breakEvenRent = totalDeductions / 52;
    const rentIncreaseNeeded = Math.max(0, breakEvenRent - rent);

    // Capital growth requirements
    const minimumCapitalGrowth = afterTaxLoss; // Minimum growth needed to break even on cash flow
    const minimumGrowthRate = (minimumCapitalGrowth / propValue) * 100;

    // Investment metrics
    const loanToValueRatio = (loan / propValue) * 100;
    const equityPosition = propValue - loan;

    setResults({
      annualRent,
      annualInterest,
      totalDeductions,
      netRentalIncome,
      taxBenefit,
      afterTaxLoss: netRentalIncome < 0 ? afterTaxLoss : 0,
      weeklyAfterTaxLoss: netRentalIncome < 0 ? weeklyAfterTaxLoss : 0,
      grossYield,
      netYield,
      marginalRate: marginalRate * 100,
      breakEvenRent,
      rentIncreaseNeeded,
      minimumCapitalGrowth,
      minimumGrowthRate,
      loanToValueRatio,
      equityPosition,
      isNegativelyGeared: netRentalIncome < 0,
      positivelyGeared: netRentalIncome > 0
    });
  };

  const reset = () => {
    setPropertyValue('');
    setWeeklyRent('');
    setLoanAmount('');
    setInterestRate('');
    setAnnualExpenses('');
    setTaxableIncome('');
    setDepreciationClaim('');
    setPropertyManagement('');
    setInsurance('');
    setCouncilRates('');
    setResults(null);
  };

  const tips = [
    "Negative gearing allows tax deductions for rental property losses",
    "Interest, maintenance, and depreciation are all deductible expenses",
    "Tax savings depend on your marginal tax rate",
    "Consider both cash flow and capital growth in investment decisions",
    "Professional advice recommended for complex investment strategies"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Australia Negative Gearing Calculator | Investment Property Tax Calculator"
      description="Comprehensive Australian negative gearing calculator for investment properties. Calculate tax benefits, cash flow, rental yields, and break-even analysis for property investments."
      keywords="Australia negative gearing calculator, investment property tax, rental property deductions, property investment Australia, tax benefits property"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Negative Gearing Calculator
              </CardTitle>
              <CardDescription>
                Calculate tax benefits and cash flow from your investment property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyValue">Property Value ($)</Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    placeholder="Total property value"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyRent">Weekly Rent ($)</Label>
                  <Input
                    id="weeklyRent"
                    type="number"
                    placeholder="Current weekly rent"
                    value={weeklyRent}
                    onChange={(e) => setWeeklyRent(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount ($)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    placeholder="Outstanding loan"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="Annual interest rate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxableIncome">Annual Taxable Income ($)</Label>
                <Input
                  id="taxableIncome"
                  type="number"
                  placeholder="Your annual taxable income"
                  value={taxableIncome}
                  onChange={(e) => setTaxableIncome(e.target.value)}
                />
              </div>

              <Separator />
              <h4 className="font-medium">Deductible Expenses</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyManagement">Property Management ($)</Label>
                  <Input
                    id="propertyManagement"
                    type="number"
                    placeholder="Annual management fees"
                    value={propertyManagement}
                    onChange={(e) => setPropertyManagement(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance ($)</Label>
                  <Input
                    id="insurance"
                    type="number"
                    placeholder="Annual insurance cost"
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="councilRates">Council Rates ($)</Label>
                  <Input
                    id="councilRates"
                    type="number"
                    placeholder="Annual council rates"
                    value={councilRates}
                    onChange={(e) => setCouncilRates(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depreciationClaim">Depreciation Claim ($)</Label>
                  <Input
                    id="depreciationClaim"
                    type="number"
                    placeholder="Annual depreciation"
                    value={depreciationClaim}
                    onChange={(e) => setDepreciationClaim(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualExpenses">Other Annual Expenses ($)</Label>
                <Input
                  id="annualExpenses"
                  type="number"
                  placeholder="Repairs, maintenance, etc."
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateNegativeGearing} className="flex-1">
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
                  Investment Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 rounded-lg" 
                     style={{backgroundColor: results.isNegativelyGeared ? '#fef2f2' : '#f0f9ff'}}>
                  <h3 className="font-semibold">
                    {results.isNegativelyGeared ? 'Negatively Geared' : results.positivelyGeared ? 'Positively Geared' : 'Break Even'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {results.isNegativelyGeared ? 'Property makes a loss before tax' : 
                     results.positivelyGeared ? 'Property generates positive cash flow' : 
                     'Property breaks even on cash flow'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Annual Rental Income</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(results.annualRent, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deductions</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(results.totalDeductions, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Rental Income</p>
                    <p className={`text-lg font-semibold ${results.netRentalIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(results.netRentalIncome, 'AUD')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tax Benefit</p>
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(results.taxBenefit, 'AUD')}</p>
                  </div>
                </div>
                
                {results.isNegativelyGeared && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-sm text-muted-foreground">After-Tax Loss (Annual)</p>
                      <p className="text-lg font-semibold text-orange-600">{formatCurrency(results.afterTaxLoss, 'AUD')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">After-Tax Loss (Weekly)</p>
                      <p className="text-lg font-semibold text-orange-600">{formatCurrency(results.weeklyAfterTaxLoss, 'AUD')}</p>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Investment Metrics</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Gross Yield</p>
                      <Badge variant="outline">{results.grossYield.toFixed(2)}%</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Net Yield</p>
                      <Badge variant={results.netYield >= 0 ? "secondary" : "destructive"}>
                        {results.netYield.toFixed(2)}%
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Marginal Tax Rate</p>
                      <Badge variant="outline">{results.marginalRate.toFixed(1)}%</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">LVR</p>
                      <Badge variant="secondary">{results.loanToValueRatio.toFixed(1)}%</Badge>
                    </div>
                  </div>
                </div>

                {results.isNegativelyGeared && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Capital Growth Required</h4>
                    <p className="text-xs text-muted-foreground">
                      Minimum annual capital growth needed: {formatCurrency(results.minimumCapitalGrowth, 'AUD')} 
                      ({results.minimumGrowthRate.toFixed(2)}% of property value)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {results && (
          <>
            <AIAnalysis
              analysisRequest={{
                calculatorType: "negative-gearing-australia",
                data: {
                  rentalIncome: results.annualRent,
                  propertyExpenses: results.totalDeductions - results.annualInterest,
                  interestExpenses: results.annualInterest,
                  negativeGearing: Math.abs(Math.min(0, results.netRentalIncome)),
                  taxSavings: results.taxBenefit,
                  netCashFlow: results.netRentalIncome
                }
              }}
              autoRun={true}
              title="AI Property Investment Analysis"
              description="Get personalized insights on your negative gearing strategy, cash flow optimization, and investment performance."
            />

            <ExportShareButtons
              calculatorType="negative-gearing-australia"
              inputs={{
                propertyValue: parseFloat(propertyValue) || 0,
                weeklyRent: parseFloat(weeklyRent) || 0,
                loanAmount: parseFloat(loanAmount) || 0,
                interestRate: parseFloat(interestRate) || 0,
                taxableIncome: parseFloat(taxableIncome) || 0
              }}
              results={{
                annualRent: results.annualRent,
                annualInterest: results.annualInterest,
                totalDeductions: results.totalDeductions,
                netRentalIncome: results.netRentalIncome,
                taxBenefit: results.taxBenefit,
                cashFlowAfterTax: results.cashFlowAfterTax
              }}
              title="Negative Gearing Calculator Australia Report"
              className="mt-6"
            />
          </>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Negative Gearing in Australia</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Negative gearing is a popular investment strategy in Australia that allows property investors to claim tax deductions 
                  when their investment property expenses exceed rental income. This comprehensive guide explains how negative gearing 
                  works, its benefits and risks, tax implications, and strategic considerations for Australian property investors. 
                  Understanding negative gearing is crucial for making informed investment decisions and maximizing the tax benefits 
                  available to property investors.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">What is Negative Gearing?</h3>
                <p>
                  Negative gearing occurs when the costs of owning an investment property (including loan interest, maintenance, 
                  insurance, and other expenses) exceed the rental income received. The resulting loss can be offset against other 
                  taxable income, reducing your overall tax liability. This tax benefit effectively reduces the out-of-pocket cost 
                  of holding the investment property, making it more affordable for investors to build wealth through real estate.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Deductible Expenses for Investment Properties</h3>
                <p>
                  Australian tax law allows investors to claim various expenses as tax deductions for investment properties. These 
                  include loan interest (the largest deduction for most investors), property management fees, insurance premiums, 
                  council rates, land tax, repairs and maintenance, advertising for tenants, legal fees, and depreciation on the 
                  building and fixtures. Understanding which expenses are deductible helps investors maximize their tax benefits 
                  and improve their investment returns.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Common Deductible Expenses:</h4>
                  <ul className="space-y-1">
                    <li>• Loan interest payments</li>
                    <li>• Property management fees (typically 5-8% of rent)</li>
                    <li>• Insurance premiums (landlord insurance, building insurance)</li>
                    <li>• Council rates and land tax</li>
                    <li>• Repairs and maintenance</li>
                    <li>• Depreciation (building and fixtures)</li>
                    <li>• Professional fees (accountant, property manager)</li>
                    <li>• Advertising costs for finding tenants</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Tax Benefits and Marginal Tax Rates</h3>
                <p>
                  The tax benefit from negative gearing depends on your marginal tax rate. Higher income earners receive greater 
                  tax benefits because losses offset income taxed at higher rates. For example, someone in the 37% tax bracket 
                  receives 37 cents back for every dollar of deductible loss, while someone in the 19% bracket receives only 19 cents. 
                  This makes negative gearing particularly attractive for high-income earners seeking to reduce their tax liability.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Capital Growth vs Cash Flow Strategy</h3>
                <p>
                  Negative gearing is typically part of a capital growth investment strategy where investors accept short-term 
                  cash flow losses in expectation of long-term capital appreciation. The theory is that tax benefits reduce the 
                  cost of holding the property while capital growth provides the primary return. However, investors must carefully 
                  consider whether expected capital growth will exceed the cumulative after-tax losses over the holding period.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Depreciation Benefits</h3>
                <p>
                  Depreciation represents a significant tax benefit for property investors, allowing claims for the decline in 
                  value of the building and fixtures over time. Building depreciation (previously capital works deduction) applies 
                  to properties built after 15 September 1987 at 2.5% per year for 40 years. Plant and equipment depreciation 
                  covers items like air conditioning, carpets, and appliances. A quantity surveyor's depreciation schedule can 
                  help maximize these claims.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Interest-Only Loans and Negative Gearing</h3>
                <p>
                  Many negatively geared investors use interest-only loans to maximize their interest deductions and minimize 
                  cash flow requirements. Interest-only loans don't reduce the principal balance, meaning the loan amount and 
                  interest deductions remain constant (assuming fixed rates). However, investors must plan for the eventual 
                  transition to principal and interest payments and consider the long-term implications of not building equity 
                  through loan repayments.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Considerations and Risk Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Cash Flow Management</h3>
                <p>
                  While negative gearing provides tax benefits, investors must have sufficient cash flow to cover the after-tax 
                  losses. The tax refund typically comes 12-18 months after expenses are incurred, requiring investors to fund 
                  the property from other sources in the meantime. Planning for vacancy periods, unexpected repairs, and interest 
                  rate increases is crucial for maintaining the investment strategy long-term.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Interest Rate Risk</h3>
                <p>
                  Rising interest rates can significantly impact negatively geared properties by increasing the largest expense 
                  (loan interest) while potentially reducing property values. Investors should model various interest rate scenarios 
                  and consider their capacity to service higher loan payments. Fixed-rate loans can provide certainty but may 
                  limit flexibility if rates fall.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Market Timing and Location Selection</h3>
                <p>
                  Successful negative gearing strategies depend heavily on capital growth, making property selection and market 
                  timing crucial. Investors should research growth markets, consider population growth, infrastructure development, 
                  and economic drivers in their target areas. Diversification across different locations and property types can 
                  help reduce concentration risk.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Key Risk Factors to Consider:</h4>
                  <ul className="space-y-1">
                    <li>• Interest rate increases affecting serviceability</li>
                    <li>• Vacancy periods reducing rental income</li>
                    <li>• Unexpected maintenance and repair costs</li>
                    <li>• Market downturns affecting capital values</li>
                    <li>• Changes to tax laws affecting deductibility</li>
                    <li>• Personal income changes affecting tax benefits</li>
                    <li>• Liquidity constraints during market stress</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Tax Law Changes and Political Risk</h3>
                <p>
                  Negative gearing has been subject to political debate in Australia, with proposals to limit or abolish the 
                  strategy creating uncertainty for investors. Changes to depreciation rules in recent years have already reduced 
                  some benefits. Investors should consider the potential for future tax law changes and avoid over-leveraging 
                  based solely on current tax benefits.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Alternative Investment Strategies</h3>
                <p>
                  While negative gearing is popular, investors should consider alternative strategies such as positive gearing 
                  (where rental income exceeds expenses), neutral gearing (break-even cash flow), or investing in growth assets 
                  outside property. Each strategy has different risk/return profiles and tax implications that may be more suitable 
                  depending on an investor's circumstances and objectives.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Exit Strategies and Capital Gains Tax</h3>
                <p>
                  Investors must plan their exit strategy from the outset, considering capital gains tax implications upon sale. 
                  The 50% CGT discount for assets held over 12 months can significantly improve returns, but the discount doesn't 
                  apply to depreciation recapture. Timing of sales to coincide with lower income years can also optimize tax outcomes.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Professional Advice and Ongoing Management</h3>
                <p>
                  Successful property investment requires ongoing professional support including accountants for tax planning, 
                  buyer's agents for property selection, property managers for day-to-day management, and financial advisors for 
                  overall strategy. Regular reviews ensure the investment remains aligned with changing circumstances and market 
                  conditions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much can I claim for depreciation on my investment property?</h4>
                    <p>Depreciation claims depend on the property's age, construction date, and fixtures. Building depreciation is 2.5% annually for properties built after 1987. Plant and equipment depreciation varies by item. A quantity surveyor's report typically costs $600-800 but can identify thousands in additional deductions.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What happens if I make my property positively geared?</h4>
                    <p>If rental income exceeds expenses, the property becomes positively geared and you'll pay tax on the net rental income. However, you can still claim all legitimate deductions. Some investors prefer positive gearing for better cash flow, especially as they approach retirement.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I use negative gearing losses against my spouse's income?</h4>
                    <p>No, rental losses can only be offset against the income of the person who owns the investment property. However, couples can structure ownership to optimize tax benefits, such as having the higher income earner own investment properties while the lower income earner owns positively geared assets.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What records do I need to keep for negative gearing claims?</h4>
                    <p>Keep all receipts for property-related expenses, loan statements showing interest paid, rental income records, property management statements, and any professional reports. Records must be kept for five years after lodging your tax return. Digital record-keeping is acceptable and often more convenient.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Is negative gearing worth it for lower income earners?</h4>
                    <p>Negative gearing benefits are proportional to your marginal tax rate. Lower income earners receive smaller tax refunds, making positive or neutral gearing potentially more attractive. Consider your total financial position, risk tolerance, and investment objectives rather than just tax benefits.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How do interest rate changes affect my negative gearing strategy?</h4>
                    <p>Rising rates increase your largest expense (interest) and potential tax deductions, but also increase out-of-pocket costs. Falling rates reduce both expenses and deductions. Model different rate scenarios and ensure you can service loans even if rates rise significantly.</p>
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
              <Info className="h-5 w-5" />
              <span>Important Information & Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• This calculator provides estimates only and should not be relied upon for investment or tax decisions.</p>
              <p>• Tax laws are complex and subject to change - seek professional tax advice for your specific circumstances.</p>
              <p>• Negative gearing involves investment risk including potential capital losses and cash flow pressure.</p>
              <p>• Interest rates, rental yields, and property values can fluctuate significantly affecting returns.</p>
              <p>• Past performance and tax benefits are not guarantees of future results.</p>
              <p>• This calculator doesn't consider all possible expenses or income sources related to property investment.</p>
              <p>• Professional advice from qualified accountants, financial advisors, and property professionals is recommended.</p>
              <p>• Consider your personal financial situation, risk tolerance, and investment objectives before investing.</p>
              <p>• Results are estimates only and actual outcomes may vary significantly from calculations shown.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default NegativeGearingCalculatorAustralia;