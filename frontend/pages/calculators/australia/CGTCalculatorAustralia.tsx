// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingUp, Info, DollarSign, FileText } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

const CGTCalculatorAustralia: React.FC = () => {
  const [purchasePrice, setPurchasePrice] = useState<string>('');
  const [salePrice, setSalePrice] = useState<string>('');
  const [purchaseCosts, setPurchaseCosts] = useState<string>('');
  const [improvementCosts, setImprovementCosts] = useState<string>('');
  const [saleCosts, setSaleCosts] = useState<string>('');
  const [holdingPeriod, setHoldingPeriod] = useState<string>('');
  const [taxableIncome, setTaxableIncome] = useState<string>('');
  const [assetType, setAssetType] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateCGT = () => {
    const purchase = parseFloat(purchasePrice);
    const sale = parseFloat(salePrice);
    const purchaseCost = parseFloat(purchaseCosts) || 0;
    const improvements = parseFloat(improvementCosts) || 0;
    const saleCost = parseFloat(saleCosts) || 0;
    const holding = parseFloat(holdingPeriod);
    const income = parseFloat(taxableIncome);

    if (!purchase || !sale || !holding || !income) return;

    const costBase = purchase + purchaseCost + improvements;
    const netProceeds = sale - saleCost;
    const capitalGain = Math.max(0, netProceeds - costBase);

    // CGT discount for assets held > 12 months
    const discountEligible = holding >= 12;
    const discountRate = discountEligible ? 0.5 : 0;
    const discountedGain = capitalGain * (1 - discountRate);

    // Calculate marginal tax rate (2024-25 rates)
    let marginalRate = 0;
    if (income <= 18200) marginalRate = 0;
    else if (income <= 45000) marginalRate = 0.19;
    else if (income <= 120000) marginalRate = 0.325;
    else if (income <= 180000) marginalRate = 0.37;
    else marginalRate = 0.45;

    const cgtLiability = discountedGain * marginalRate;
    const netGain = capitalGain - cgtLiability;

    setResults({
      capitalGain,
      costBase,
      netProceeds,
      discountAmount: capitalGain * discountRate,
      discountedGain,
      cgtLiability,
      netGain,
      marginalRate: marginalRate * 100,
      discountEligible,
      effectiveCGTRate: capitalGain > 0 ? (cgtLiability / capitalGain) * 100 : 0
    });
  };

  const reset = () => {
    setPurchasePrice('');
    setSalePrice('');
    setPurchaseCosts('');
    setImprovementCosts('');
    setSaleCosts('');
    setHoldingPeriod('');
    setTaxableIncome('');
    setAssetType('');
    setResults(null);
  };

  const tips = [
    "CGT discount of 50% applies to assets held longer than 12 months",
    "Principal place of residence is generally CGT-free",
    "Include purchase costs, improvement costs, and sale costs in calculations",
    "Consider timing of asset sales for tax optimization",
    "Small business CGT concessions may apply to qualifying business assets"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Australia Capital Gains Tax Calculator | CGT Calculator 2024-25"
      description="Comprehensive Australian Capital Gains Tax calculator with CGT discount, cost base calculation, and marginal tax rates. Calculate your CGT liability accurately for investment properties, shares, and other assets."
      keywords="Australia CGT calculator, capital gains tax Australia, CGT discount, asset disposal tax, Australian tax calculator, investment property CGT, share CGT Australia"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                CGT Calculator
              </CardTitle>
              <CardDescription>
                Calculate your capital gains tax liability with Australian tax rates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="assetType">Asset Type</Label>
                <Select value={assetType} onValueChange={setAssetType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property">Investment Property</SelectItem>
                    <SelectItem value="shares">Shares/Stocks</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="collectibles">Collectibles</SelectItem>
                    <SelectItem value="business">Business Assets</SelectItem>
                    <SelectItem value="other">Other Assets</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="Original cost"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salePrice">Sale Price ($)</Label>
                  <Input
                    id="salePrice"
                    type="number"
                    placeholder="Sale proceeds"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchaseCosts">Purchase Costs ($)</Label>
                  <Input
                    id="purchaseCosts"
                    type="number"
                    placeholder="Stamp duty, legal fees"
                    value={purchaseCosts}
                    onChange={(e) => setPurchaseCosts(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="saleCosts">Sale Costs ($)</Label>
                  <Input
                    id="saleCosts"
                    type="number"
                    placeholder="Agent, legal fees"
                    value={saleCosts}
                    onChange={(e) => setSaleCosts(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="improvementCosts">Improvement Costs ($)</Label>
                <Input
                  id="improvementCosts"
                  type="number"
                  placeholder="Capital improvements"
                  value={improvementCosts}
                  onChange={(e) => setImprovementCosts(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="holdingPeriod">Holding Period (Months)</Label>
                  <Input
                    id="holdingPeriod"
                    type="number"
                    placeholder="Months owned"
                    value={holdingPeriod}
                    onChange={(e) => setHoldingPeriod(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxableIncome">Annual Taxable Income ($)</Label>
                  <Input
                    id="taxableIncome"
                    type="number"
                    placeholder="Other taxable income"
                    value={taxableIncome}
                    onChange={(e) => setTaxableIncome(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateCGT} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate CGT
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
                  CGT Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Capital Gain</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(results.capitalGain, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CGT Liability</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(results.cgtLiability, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">CGT Discount</p>
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(results.discountAmount, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Net Gain After Tax</p>
                    <p className="text-lg font-semibold text-green-600">{formatCurrency(results.netGain, 'AUD')}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Tax Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Marginal Tax Rate</p>
                      <Badge variant="outline">{results.marginalRate.toFixed(1)}%</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Effective CGT Rate</p>
                      <Badge variant="secondary">{results.effectiveCGTRate.toFixed(1)}%</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">CGT Discount Eligible</p>
                      <Badge variant={results.discountEligible ? "default" : "destructive"}>
                        {results.discountEligible ? "Yes (50%)" : "No"}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cost Base</p>
                      <Badge variant="outline">{formatCurrency(results.costBase, 'AUD')}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {results && (
          <>
            <AIAnalysis
              analysisRequest={{
                calculatorType: "cgt-calculator-australia",
                data: {
                  purchasePrice: parseFloat(purchasePrice) || 0,
                  salePrice: parseFloat(salePrice) || 0,
                  capitalGain: results.capitalGain,
                  cgtLiability: results.cgtLiability,
                  discount: results.discountAmount,
                  netGain: results.netGain
                }
              }}
              autoRun={true}
              title="AI CGT Analysis & Tax Optimization"
              description="Get personalized strategies to minimize your capital gains tax and optimize your investment timing."
            />

            <ExportShareButtons
              calculatorType="cgt-calculator-australia"
              inputs={{
                purchasePrice: parseFloat(purchasePrice) || 0,
                salePrice: parseFloat(salePrice) || 0,
                purchaseCosts: parseFloat(purchaseCosts) || 0,
                improvementCosts: parseFloat(improvementCosts) || 0,
                saleCosts: parseFloat(saleCosts) || 0,
                holdingPeriod: parseFloat(holdingPeriod) || 0,
                taxableIncome: parseFloat(taxableIncome) || 0
              }}
              results={{
                capitalGain: results.capitalGain,
                cgtLiability: results.cgtLiability,
                discountAmount: results.discountAmount,
                netGain: results.netGain,
                effectiveCGTRate: results.effectiveCGTRate
              }}
              title="CGT Calculator Australia Report"
              className="mt-6"
            />
          </>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Australian Capital Gains Tax (CGT)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Capital Gains Tax (CGT) is one of Australia's most significant investment taxes, affecting millions of property investors, 
                  share traders, and asset holders across the country. Understanding CGT is crucial for making informed investment decisions, 
                  optimizing tax outcomes, and ensuring compliance with Australian Tax Office (ATO) requirements. This comprehensive guide 
                  covers everything you need to know about CGT calculations, exemptions, and strategic planning.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">What is Capital Gains Tax?</h3>
                <p>
                  Capital Gains Tax is not a separate tax but forms part of your income tax assessment. When you dispose of an asset 
                  (such as selling, gifting, or transferring it), any capital gain is included in your assessable income and taxed at 
                  your marginal tax rate. CGT applies to assets acquired after 20 September 1985, including investment properties, 
                  shares, units in unit trusts, cryptocurrency, collectibles, and business assets.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">The 50% CGT Discount: Australia's Most Valuable Tax Benefit</h3>
                <p>
                  Australian tax residents can claim a 50% CGT discount on assets held for more than 12 months. This means only half 
                  of your capital gain is subject to tax, effectively halving your CGT liability. For example, if you make a $100,000 
                  capital gain on shares held for 18 months, only $50,000 is added to your taxable income. This substantial benefit 
                  makes long-term investing extremely attractive and is one of the key reasons why property and share investments 
                  remain popular in Australia.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Understanding Cost Base Calculations</h3>
                <p>
                  The cost base of an asset includes the original purchase price plus incidental costs such as stamp duty, legal fees, 
                  brokerage, and transfer costs. Capital improvements that increase the asset's value or extend its useful life can 
                  also be added to the cost base. However, maintenance and repair costs generally cannot be included. For investment 
                  properties, this might include renovations, extensions, or major upgrades, but not routine maintenance like painting 
                  or garden care.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Cost Base Example - Investment Property:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Purchase Price: $500,000</li>
                    <li>• Stamp Duty: $25,000</li>
                    <li>• Legal Fees: $2,500</li>
                    <li>• Building Inspection: $800</li>
                    <li>• Kitchen Renovation: $30,000</li>
                    <li>• Total Cost Base: $558,300</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Main Residence Exemption</h3>
                <p>
                  The family home is generally exempt from CGT under the main residence exemption, provided it has been your principal 
                  place of residence throughout the ownership period. The exemption can apply to up to 2 hectares of land and may be 
                  partially available when a property has been used for income production (such as rental) or when you've had multiple 
                  residences. This exemption represents one of the most valuable benefits in the Australian tax system, allowing families 
                  to build wealth through their primary residence without tax consequences.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Investment Property and CGT Strategies</h3>
                <p>
                  For investment property owners, CGT planning is crucial for maximizing returns. Consider these strategies: timing 
                  sales to coincide with lower income years, using the six-year rule if you move out and rent your former home, 
                  claiming all eligible cost base improvements, and considering partial exemptions if the property was your main 
                  residence for part of the ownership period. The six-year rule allows you to treat your former main residence as 
                  CGT-exempt for up to six years after you stop living in it and start renting it out.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Share Trading and CGT</h3>
                <p>
                  Share investors must distinguish between capital gains and ordinary income. If you're considered a share trader 
                  (buying and selling frequently for profit), your gains may be treated as ordinary income without access to the CGT 
                  discount. Factors the ATO considers include frequency of transactions, intention to make profit, use of borrowed money, 
                  and whether share trading is part of a business. Dividend reinvestment plans (DRPs) can complicate cost base 
                  calculations, requiring careful record-keeping of each parcel's acquisition cost and date.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Cryptocurrency and Digital Assets</h3>
                <p>
                  Cryptocurrency transactions are subject to CGT in Australia. Each disposal (sale, exchange, or spend) is a CGT event 
                  requiring calculation of capital gains or losses. The ATO requires records of all transactions including dates, 
                  amounts in AUD, purposes of transactions, and parties involved. Using the FIFO (First In, First Out) method for 
                  cost base calculations is generally accepted, though specific record-keeping for each unit can be more accurate.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Small Business CGT Concessions</h3>
                <p>
                  Small business owners may access additional CGT concessions that can significantly reduce or eliminate CGT liability. 
                  These include the small business 15-year exemption (for assets owned for 15+ years), 50% active asset reduction, 
                  retirement exemption (up to $500,000 lifetime limit), and roll-over relief for replacement assets. To qualify, 
                  businesses must meet specific tests including maximum net asset value of $6 million, aggregated turnover under $2 million, 
                  and active asset requirements.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced CGT Planning Strategies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Tax Loss Harvesting</h3>
                <p>
                  Capital losses can offset capital gains in the same tax year, and excess losses can be carried forward indefinitely. 
                  Strategic realization of losses near year-end can reduce current year tax liability. However, be aware of wash sale 
                  rules and ensure investment decisions aren't purely tax-driven. Consider the 30-day rule for shares to avoid having 
                  the loss disallowed if you repurchase the same or substantially similar assets.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Timing Strategies</h3>
                <p>
                  Consider timing asset sales to optimize tax outcomes. Selling in a lower income year, spreading sales across multiple 
                  years, or accelerating/deferring sales based on expected income changes can significantly impact tax liability. 
                  Remember that the 12-month holding period for CGT discount eligibility starts from the contract date, not settlement date.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Family and Estate Planning</h3>
                <p>
                  CGT has implications for estate planning and family wealth transfers. Assets receive a 'stepped-up basis' when 
                  inherited, meaning beneficiaries acquire the asset at market value at the time of death, potentially eliminating 
                  unrealized capital gains. Joint ownership structures, family discretionary trusts, and gifting strategies can be 
                  used to optimize CGT outcomes across family groups, though professional advice is essential.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Key CGT Planning Tips:</h4>
                  <ul className="space-y-1">
                    <li>• Hold assets for at least 12 months to access the 50% CGT discount</li>
                    <li>• Keep detailed records of all purchase costs and improvements</li>
                    <li>• Consider timing of sales to coincide with lower income years</li>
                    <li>• Use capital losses to offset capital gains where possible</li>
                    <li>• Understand main residence exemption rules for property investments</li>
                    <li>• Consider small business concessions if eligible</li>
                    <li>• Seek professional advice for complex situations</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Record Keeping Requirements</h3>
                <p>
                  The ATO requires taxpayers to keep CGT records for five years after disposal of the asset. For assets held for 
                  many years, this means maintaining records potentially decades old. Digital record-keeping is recommended, with 
                  cloud storage ensuring accessibility. Essential records include purchase contracts, settlement statements, 
                  improvement receipts, professional valuations, and any relevant correspondence with advisors.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">CGT and Superannuation</h3>
                <p>
                  Superannuation funds pay CGT at concessional rates: 15% during accumulation phase and 0% during pension phase 
                  (for funds in retirement mode). This makes superannuation an attractive vehicle for long-term wealth building, 
                  especially for assets likely to generate significant capital gains. The CGT discount also applies to super funds 
                  for assets held longer than 12 months, reducing the effective rate to 10% during accumulation.
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
                    <h4 className="font-semibold text-gray-800 mb-2">How accurate is this CGT calculator?</h4>
                    <p>This calculator provides estimates based on current Australian tax rates and standard CGT rules. Actual calculations may vary based on specific circumstances, ATO interpretations, and changes to tax law. Always consult a qualified tax professional for complex situations or significant transactions.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What assets are exempt from CGT?</h4>
                    <p>Main residence (with conditions), personal use assets under $10,000, cars and motorcycles for personal use, assets acquired before 20 September 1985, and certain government bonds are generally CGT-exempt. Collectibles under $500 and personal use assets under $10,000 may also be exempt.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I claim a capital loss if my asset decreased in value?</h4>
                    <p>Yes, capital losses can offset capital gains in the same year. Excess losses can be carried forward indefinitely to offset future capital gains. However, capital losses cannot be offset against ordinary income like salary or business income.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What's the difference between CGT and ordinary income?</h4>
                    <p>Capital gains arise from disposal of assets and may qualify for the 50% CGT discount if held for more than 12 months. Ordinary income (like salary, rent, or business income) doesn't qualify for the discount. The ATO considers factors like frequency of transactions and business intention when determining classification.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How does CGT apply to inherited assets?</h4>
                    <p>Inherited assets receive a 'stepped-up basis' equal to market value at the time of death, potentially eliminating unrealized capital gains. Beneficiaries acquire the asset at this market value, and future CGT calculations are based on this stepped-up cost base rather than the original purchase price.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What records do I need to keep for CGT purposes?</h4>
                    <p>Keep purchase contracts, settlement statements, receipts for improvements and incidental costs, professional valuations, and any relevant legal documents. Records must be kept for five years after asset disposal. For shares, maintain dividend statements and any corporate action notifications.</p>
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
              <p>• This calculator provides estimates only and should not be relied upon for final tax decisions.</p>
              <p>• Tax laws are complex and subject to change - current rates and rules apply to 2024-25 financial year.</p>
              <p>• Individual circumstances may affect CGT calculations including residency status and asset classification.</p>
              <p>• Main residence exemption has specific conditions that may not be covered by this calculator.</p>
              <p>• Small business CGT concessions have detailed eligibility requirements not assessed here.</p>
              <p>• This calculator doesn't consider indexation (abolished for assets acquired after September 1999).</p>
              <p>• Professional tax advice is recommended for significant transactions or complex situations.</p>
              <p>• The ATO is the authoritative source for current tax law and interpretations.</p>
              <p>• Results are estimates only and actual tax outcomes may vary significantly from calculations.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default CGTCalculatorAustralia;