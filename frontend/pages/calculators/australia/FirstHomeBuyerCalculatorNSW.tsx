// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Home, Info, TrendingUp, DollarSign, AlertCircle, Check } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';
import { MidContentAd } from '../../../components/ads/MidContentAd';

const FirstHomeBuyerCalculatorNSW: React.FC = () => {
  const [propertyPrice, setPropertyPrice] = useState<string>('');
  const [deposit, setDeposit] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [purchaseLocation, setPurchaseLocation] = useState<string>('');
  const [isNewHome, setIsNewHome] = useState<string>('');
  const [annualIncome, setAnnualIncome] = useState<string>('');
  const [hasLivedInAustralia, setHasLivedInAustralia] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateFirstHomeBuyer = () => {
    const price = parseFloat(propertyPrice);
    const depositAmount = parseFloat(deposit);
    const income = parseFloat(annualIncome) || 0;

    if (!price || !depositAmount || !propertyType || !purchaseLocation || !isNewHome) return;

    const depositPercentage = (depositAmount / price) * 100;
    const loanAmount = price - depositAmount;
    const lvrRatio = (loanAmount / price) * 100;

    let stampDuty = 0;
    let fhbStampDutyDiscount = 0;
    let fhogGrant = 0;
    let lmiPremium = 0;
    let monthlyRepayment = 0;

    stampDuty = calculateNSWStampDuty(price, false);
    const discountedStampDuty = calculateNSWStampDuty(price, true);
    fhbStampDutyDiscount = Math.max(0, stampDuty - discountedStampDuty);
    stampDuty = discountedStampDuty;

    if (isNewHome === 'yes' && price <= 800000 && propertyType !== 'vacant_land') {
      fhogGrant = 10000;
    }

    if (lvrRatio > 80) {
      lmiPremium = calculateLMI(price, lvrRatio);
    }

    const interestRate = 6.5;
    const loanTermYears = 30;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTermYears * 12;
    monthlyRepayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                       (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const legalFees = 1500;
    const buildingInspection = 500;
    const pestInspection = 300;
    const conveyancingFees = 1200;
    const mortgageRegistration = 150;
    const titleSearchFees = 100;

    const totalUpfrontCosts = stampDuty + legalFees + buildingInspection + pestInspection + 
                              conveyancingFees + mortgageRegistration + titleSearchFees + lmiPremium;
    
    const totalSavingsNeeded = depositAmount + totalUpfrontCosts - fhogGrant;
    const totalFHBBenefits = fhbStampDutyDiscount + fhogGrant;

    const fhssMaxSavings = 50000;
    const fhssDescription = "Save up to $50,000 in your super for your first home";

    const fhldsSupportAmount = Math.min(price * 0.20, 200000);
    const canUseFHLDS = propertyType !== 'vacant_land' && price <= 950000;

    const affordabilityRatio = (monthlyRepayment / (income / 12)) * 100;

    const nhficDetails = {
      eligible: price <= 950000 && propertyType !== 'vacant_land',
      guaranteeAmount: Math.min(price * 0.15, price - depositAmount),
      description: "Up to 15% guarantee to help you avoid LMI"
    };

    const eligibilityChecks = {
      australianCitizen: hasLivedInAustralia === 'yes',
      firstHomeBuyer: true,
      priceThreshold: price <= 800000,
      neverOwnedProperty: true,
      liveInProperty: true
    };

    const qualifiesForAllBenefits = Object.values(eligibilityChecks).every(check => check === true);

    setResults({
      propertyPrice: price,
      deposit: depositAmount,
      depositPercentage,
      loanAmount,
      lvrRatio,
      stampDuty,
      fhbStampDutyDiscount,
      fhogGrant,
      lmiPremium,
      totalUpfrontCosts,
      totalSavingsNeeded,
      monthlyRepayment,
      legalFees,
      buildingInspection,
      pestInspection,
      conveyancingFees,
      mortgageRegistration,
      titleSearchFees,
      totalFHBBenefits,
      fhssMaxSavings,
      fhssDescription,
      fhldsSupportAmount,
      canUseFHLDS,
      affordabilityRatio,
      nhficDetails,
      eligibilityChecks,
      qualifiesForAllBenefits
    });
  };

  const calculateNSWStampDuty = (value: number, isFirstHomeBuyer: boolean): number => {
    if (isFirstHomeBuyer && value <= 650000) {
      return 0;
    } else if (isFirstHomeBuyer && value <= 800000) {
      return Math.max(0, (value - 650000) * 0.0425);
    } else {
      let duty = 0;
      if (value <= 14000) duty = value * 0.0125;
      else if (value <= 32000) duty = 175 + (value - 14000) * 0.015;
      else if (value <= 85000) duty = 445 + (value - 32000) * 0.0175;
      else if (value <= 319000) duty = 1372.5 + (value - 85000) * 0.035;
      else if (value <= 1064000) duty = 9562.5 + (value - 319000) * 0.045;
      else duty = 43087.5 + (value - 1064000) * 0.055;
      return duty;
    }
  };

  const calculateLMI = (propertyValue: number, lvr: number): number => {
    let lmiRate = 0;
    if (lvr > 95) lmiRate = 0.045;
    else if (lvr > 90) lmiRate = 0.035;
    else if (lvr > 85) lmiRate = 0.025;
    else if (lvr > 80) lmiRate = 0.015;
    
    return propertyValue * lmiRate;
  };

  const reset = () => {
    setPropertyPrice('');
    setDeposit('');
    setPropertyType('');
    setPurchaseLocation('');
    setIsNewHome('');
    setAnnualIncome('');
    setHasLivedInAustralia('');
    setResults(null);
  };

  const tips = [
    "First home buyers in NSW can save up to $32,475 in stamp duty for properties under $650,000",
    "The First Home Owner Grant provides $10,000 for new homes valued up to $800,000",
    "First Home Loan Deposit Scheme helps you buy with just 5% deposit without LMI",
    "Save up to $50,000 in your super through the First Home Super Saver Scheme",
    "Budget for hidden costs: inspections, conveyancing, and legal fees can add $3,000-5,000"
  ];

  return (
    <CalculatorLayoutWithAds
      title="First Home Buyer Calculator NSW 2024 | Calculate FHB Costs & Grants"
      description="Complete NSW first home buyer calculator with stamp duty concessions, FHOG grants, FHLDS eligibility, and total purchase costs. Calculate savings, compare deposit scenarios, and plan your first home purchase in New South Wales."
      keywords="first home buyer calculator NSW, NSW stamp duty concession, first home owner grant NSW, FHLDS calculator, first home super saver scheme, NSW property calculator, first home deposit scheme"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                First Home Buyer Calculator NSW
              </CardTitle>
              <CardDescription>
                Calculate total costs, government grants, and eligibility for NSW first home buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="propertyPrice">Property Purchase Price ($)</Label>
                <Input
                  id="propertyPrice"
                  type="number"
                  placeholder="650000"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit">Your Deposit Amount ($)</Label>
                <Input
                  id="deposit"
                  type="number"
                  placeholder="50000"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new_house">New House/Townhouse</SelectItem>
                    <SelectItem value="established_house">Established House</SelectItem>
                    <SelectItem value="new_apartment">New Apartment/Unit</SelectItem>
                    <SelectItem value="established_apartment">Established Apartment/Unit</SelectItem>
                    <SelectItem value="vacant_land">Vacant Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseLocation">Location in NSW</Label>
                <Select value={purchaseLocation} onValueChange={setPurchaseLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sydney">Greater Sydney</SelectItem>
                    <SelectItem value="regional">Regional NSW</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isNewHome">Is this a new home?</Label>
                <Select value={isNewHome} onValueChange={setIsNewHome}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - New or Newly Built</SelectItem>
                    <SelectItem value="no">No - Established Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualIncome">Annual Income ($) - Optional</Label>
                <Input
                  id="annualIncome"
                  type="number"
                  placeholder="80000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasLivedInAustralia">Australian Citizen/Permanent Resident?</Label>
                <Select value={hasLivedInAustralia} onValueChange={setHasLivedInAustralia}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateFirstHomeBuyer} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Costs
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
                  Your First Home Purchase Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Property Price</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.propertyPrice, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Your Deposit</p>
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(results.deposit, 'AUD')} ({results.depositPercentage.toFixed(1)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Loan Amount</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.loanAmount, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">LVR Ratio</p>
                    <p className="text-lg font-semibold">{results.lvrRatio.toFixed(1)}%</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Government Benefits & Concessions</h4>
                  <div className="bg-green-50 p-3 rounded-lg space-y-2">
                    {results.fhbStampDutyDiscount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-800">Stamp Duty Concession</span>
                        <Badge variant="default" className="bg-green-600">
                          {formatCurrency(results.fhbStampDutyDiscount, 'AUD')}
                        </Badge>
                      </div>
                    )}
                    {results.fhogGrant > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-green-800">First Home Owner Grant</span>
                        <Badge variant="default" className="bg-green-600">
                          {formatCurrency(results.fhogGrant, 'AUD')}
                        </Badge>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2 border-t border-green-200">
                      <span className="text-sm font-semibold text-green-900">Total FHB Benefits</span>
                      <Badge variant="default" className="bg-green-700">
                        {formatCurrency(results.totalFHBBenefits, 'AUD')}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="font-medium">Upfront Costs Breakdown</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Stamp Duty</p>
                      <p className="font-medium">{formatCurrency(results.stampDuty, 'AUD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">LMI Premium</p>
                      <p className="font-medium">{formatCurrency(results.lmiPremium, 'AUD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Legal Fees</p>
                      <p className="font-medium">{formatCurrency(results.legalFees, 'AUD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Conveyancing</p>
                      <p className="font-medium">{formatCurrency(results.conveyancingFees, 'AUD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Building Inspection</p>
                      <p className="font-medium">{formatCurrency(results.buildingInspection, 'AUD')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Pest Inspection</p>
                      <p className="font-medium">{formatCurrency(results.pestInspection, 'AUD')}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
                    <span className="font-medium text-blue-900">Total Upfront Costs</span>
                    <Badge variant="outline" className="text-base">
                      {formatCurrency(results.totalUpfrontCosts, 'AUD')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg">
                    <span className="font-medium text-purple-900">Total Savings Needed</span>
                    <Badge variant="outline" className="text-base">
                      {formatCurrency(results.totalSavingsNeeded, 'AUD')}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Monthly Repayment (est.)</span>
                    <Badge variant="secondary">{formatCurrency(results.monthlyRepayment, 'AUD')}</Badge>
                  </div>
                  {results.affordabilityRatio > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Affordability Ratio</span>
                      <Badge variant={results.affordabilityRatio > 30 ? "destructive" : "default"}>
                        {results.affordabilityRatio.toFixed(1)}%
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {results && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-600" />
                  NSW First Home Buyer Schemes & Programs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">First Home Loan Deposit Scheme (FHLDS)</h4>
                  {results.canUseFHLDS ? (
                    <div className="space-y-2">
                      <p className="text-sm text-blue-800">
                        ✓ You may be eligible! This scheme allows you to buy with as little as 5% deposit without paying LMI.
                      </p>
                      <p className="text-sm text-blue-700">
                        Potential LMI savings: <strong>{formatCurrency(results.lmiPremium, 'AUD')}</strong>
                      </p>
                      <p className="text-xs text-blue-600 mt-2">
                        Property price limit: $950,000 in Sydney/NSW. Subject to income limits and eligibility criteria.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-blue-800">
                      Property price or type may not meet FHLDS criteria. Scheme applies to properties up to $950,000.
                    </p>
                  )}
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-2">First Home Super Saver Scheme (FHSS)</h4>
                  <p className="text-sm text-purple-800">
                    {results.fhssDescription}
                  </p>
                  <p className="text-sm text-purple-700 mt-2">
                    Maximum withdrawal: <strong>{formatCurrency(results.fhssMaxSavings, 'AUD')}</strong>
                  </p>
                  <p className="text-xs text-purple-600 mt-2">
                    Save in your super with tax benefits, then withdraw for your first home deposit. 
                    Contributions are taxed at 15% instead of your marginal rate.
                  </p>
                </div>

                {results.nhficDetails.eligible && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">NHFIC Guarantee (Optional)</h4>
                    <p className="text-sm text-green-800">
                      {results.nhficDetails.description}
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      Potential guarantee: <strong>{formatCurrency(results.nhficDetails.guaranteeAmount, 'AUD')}</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Available for eligible first home buyers with participating lenders. Helps reduce LMI costs.
                    </p>
                  </div>
                )}

                <div className="bg-amber-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-amber-900 mb-2">NSW Shared Equity Scheme</h4>
                  <p className="text-sm text-amber-800">
                    The NSW Government can contribute up to 40% equity for new homes or 30% for existing homes, 
                    helping eligible buyers with smaller deposits enter the market.
                  </p>
                  <p className="text-xs text-amber-600 mt-2">
                    Income limits apply: $90,000 for singles, $120,000 for couples. Property price caps vary by region.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Eligibility Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Australian citizen or permanent resident</span>
                    {results.eligibilityChecks.australianCitizen ? (
                      <Badge variant="default" className="bg-green-600">✓ Yes</Badge>
                    ) : (
                      <Badge variant="destructive">✗ No</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Never owned property before</span>
                    {results.eligibilityChecks.neverOwnedProperty ? (
                      <Badge variant="default" className="bg-green-600">✓ Required</Badge>
                    ) : (
                      <Badge variant="destructive">✗ Not Met</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Property under $800,000 (for full concessions)</span>
                    {results.eligibilityChecks.priceThreshold ? (
                      <Badge variant="default" className="bg-green-600">✓ Yes</Badge>
                    ) : (
                      <Badge variant="secondary">Partial concessions may apply</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Will live in the property as primary residence</span>
                    {results.eligibilityChecks.liveInProperty ? (
                      <Badge variant="default" className="bg-green-600">✓ Required</Badge>
                    ) : (
                      <Badge variant="destructive">✗ Not Met</Badge>
                    )}
                  </div>
                  
                  {results.qualifiesForAllBenefits && (
                    <div className="bg-green-100 border border-green-300 p-4 rounded-lg mt-4">
                      <p className="text-sm font-semibold text-green-900">
                        ✓ You appear to meet the basic eligibility criteria for NSW first home buyer benefits!
                      </p>
                      <p className="text-xs text-green-700 mt-2">
                        Always verify specific requirements with Service NSW and participating lenders.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <AIAnalysis
              analysisRequest={{
                calculatorType: "first-home-buyer-nsw",
                data: {
                  propertyValue: results.propertyPrice,
                  deposit: results.deposit,
                  stampDuty: results.stampDuty,
                  totalCosts: results.totalSavingsNeeded,
                  monthlyRepayment: results.monthlyRepayment,
                  benefits: results.totalFHBBenefits,
                  lvrRatio: results.lvrRatio
                }
              }}
              autoRun={true}
              title="AI First Home Buyer Analysis"
              description="Get personalized strategies to maximize your first home buyer benefits and optimize your purchase strategy."
            />

            <ExportShareButtons
              calculatorType="first-home-buyer-nsw"
              inputs={{
                propertyPrice: parseFloat(propertyPrice) || 0
              }}
              results={{
                deposit: results.deposit,
                stampDuty: results.stampDuty,
                totalSavingsNeeded: results.totalSavingsNeeded,
                monthlyRepayment: results.monthlyRepayment,
                totalFHBBenefits: results.totalFHBBenefits,
                lvrRatio: results.lvrRatio
              }}
              title="First Home Buyer Calculator NSW Report"
              className="mt-6"
            />
          </>
        )}

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to First Home Buying in NSW 2024</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Buying your first home in New South Wales represents one of the most significant financial decisions you'll 
                  make in your lifetime. The NSW property market offers diverse opportunities from Sydney's metropolitan areas 
                  to regional centers, each with unique characteristics, price points, and lifestyle considerations. Understanding 
                  the comprehensive landscape of first home buyer benefits, government schemes, upfront costs, and ongoing 
                  commitments is essential for making informed decisions and successfully navigating the path to homeownership. 
                  The NSW government, along with federal initiatives, provides substantial support through stamp duty concessions, 
                  grants, deposit assistance schemes, and innovative financing options designed to make the Australian dream of 
                  homeownership more accessible to first-time buyers.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">NSW Stamp Duty Concessions for First Home Buyers</h3>
                <p>
                  Stamp duty represents the single largest upfront cost for property buyers in NSW, but first home buyers 
                  benefit from generous concessions that can save tens of thousands of dollars. For properties valued up to 
                  $650,000, eligible first home buyers pay zero stamp duty—a complete exemption that can save over $25,000 
                  compared to standard rates. For properties between $650,000 and $800,000, concessional stamp duty rates 
                  apply, with savings gradually tapering as the property value approaches the upper threshold. This progressive 
                  concession structure means first home buyers purchasing a $700,000 property might save approximately $20,000, 
                  while those buying at $750,000 could still save around $12,000. These substantial savings can be redirected 
                  toward deposit requirements, renovation budgets, or furnishing costs, significantly improving the affordability 
                  equation for first-time buyers entering the competitive NSW property market.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">First Home Owner Grant (FHOG) in NSW</h3>
                <p>
                  The First Home Owner Grant provides $10,000 to eligible buyers purchasing or building a new home valued up 
                  to $800,000 in NSW. This grant applies exclusively to new dwellings, including newly constructed homes, 
                  substantially renovated homes, and new apartments or units purchased from developers. The grant does not 
                  apply to established properties, vacant land purchases, or investment properties. To qualify, applicants 
                  must be Australian citizens or permanent residents aged 18 or over, purchasing their first home to live in 
                  as their principal place of residence for at least six months. The $10,000 grant can be applied directly 
                  toward your deposit, reducing the amount you need to save before purchasing, or used to offset upfront costs 
                  like legal fees, building inspections, and conveyancing charges. When combined with stamp duty concessions, 
                  eligible first home buyers purchasing a new $650,000 property could receive total government benefits 
                  exceeding $35,000, dramatically improving purchase affordability and reducing the savings timeline.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">NSW First Home Buyer Benefits Summary:</h4>
                  <ul className="space-y-1">
                    <li>• Full stamp duty exemption for properties up to $650,000</li>
                    <li>• Concessional stamp duty for properties $650,000-$800,000</li>
                    <li>• $10,000 First Home Owner Grant for new homes up to $800,000</li>
                    <li>• First Home Loan Deposit Scheme - buy with 5% deposit</li>
                    <li>• First Home Super Saver Scheme - save up to $50,000 in super</li>
                    <li>• NSW Shared Equity Scheme - government co-contribution up to 40%</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">First Home Loan Deposit Scheme (FHLDS)</h3>
                <p>
                  The First Home Loan Deposit Scheme represents a game-changing federal initiative that allows eligible 
                  first home buyers to purchase property with as little as 5% deposit without paying Lender's Mortgage 
                  Insurance (LMI). The Australian Government guarantees up to 15% of the property value, allowing participating 
                  lenders to offer home loans to buyers who haven't yet saved the traditional 20% deposit. For a $700,000 
                  property, avoiding LMI could save $20,000-$35,000 in upfront costs, dramatically reducing the barrier to 
                  entry for first-time buyers. The scheme has price caps: $950,000 in Sydney and high-cost areas, and $600,000 
                  in regional NSW, with income limits of $125,000 for singles and $200,000 for couples. Places are allocated 
                  annually on a first-come, first-served basis through participating lenders, making early preparation and 
                  rapid decision-making crucial for securing a spot. The FHLDS cannot be combined with other government 
                  guarantee schemes but works alongside stamp duty concessions and the First Home Owner Grant.
                </p>

                <MidContentAd />

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">First Home Super Saver Scheme (FHSS)</h3>
                <p>
                  The First Home Super Saver Scheme offers a tax-effective way to save for your first home deposit by making 
                  voluntary contributions to your superannuation fund. Eligible individuals can contribute up to $15,000 per 
                  financial year (with a lifetime cap of $50,000) and later withdraw these contributions, along with associated 
                  earnings, to put toward purchasing their first home. The key advantage lies in the tax treatment: voluntary 
                  concessional contributions are taxed at just 15% within the super fund, compared to your marginal tax rate 
                  which could be 32.5%, 37%, or 45%. For a person earning $90,000 annually contributing $15,000 per year for 
                  three years, the tax savings alone could exceed $7,500 compared to saving the same amount in a standard 
                  savings account. When withdrawn, the funds are taxed at your marginal rate less a 30% offset, creating 
                  significant net benefit for most first home savers. The scheme requires careful planning around contribution 
                  timing, eligibility verification, and coordination with your purchase timeline, but offers one of the most 
                  powerful tax advantages available to first home buyers.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">NSW Shared Equity Scheme</h3>
                <p>
                  The NSW Shared Equity Scheme represents an innovative approach to homeownership, with the NSW Government 
                  contributing equity to help eligible buyers purchase property with smaller deposits. Under the scheme, 
                  the government can contribute up to 40% equity for new homes or 30% for existing homes, significantly 
                  reducing the amount you need to borrow and potentially eliminating LMI requirements. For example, purchasing 
                  a $600,000 property with 40% government equity means you'd only need to secure a $360,000 mortgage, dramatically 
                  improving affordability and reducing monthly repayments. The government doesn't charge rent on its equity 
                  share, and you maintain full occupancy rights as the homeowner. When you eventually sell the property or 
                  refinance, the government receives its proportional share of any capital gain (or loss). Strict eligibility 
                  criteria apply, including income limits of $90,000 for singles and $120,000 for couples, property price 
                  caps varying by region, and requirements to occupy the property as your principal place of residence. The 
                  scheme offers a pathway to homeownership for buyers who might otherwise struggle to save sufficient deposits 
                  in Sydney's competitive market.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Hidden Costs and Upfront Expenses Beyond the Deposit</h3>
                <p>
                  While saving for a deposit represents the most visible challenge for first home buyers, numerous additional 
                  upfront costs can catch unprepared buyers off guard. Conveyancing and legal fees typically range from 
                  $1,200-$2,500, covering the legal transfer of property ownership and contract review. Building and pest 
                  inspections, essential for identifying structural issues and potential problems, cost $500-$1,200 combined. 
                  Mortgage establishment fees, valuation costs, and title search fees add another $500-$1,500. Lender's 
                  Mortgage Insurance, while avoidable through schemes like FHLDS, can add $10,000-$40,000 for buyers with 
                  deposits below 20%. Moving costs, immediate maintenance or repairs, council rates adjustments, and connection 
                  fees for utilities create further expense layers. A comprehensive budget for purchasing a $650,000 property 
                  might include: stamp duty ($0 with FHB concession), conveyancing ($1,500), inspections ($800), mortgage 
                  costs ($800), and miscellaneous fees ($500), totaling approximately $3,600 in addition to your deposit—
                  even with maximum government concessions. Understanding and planning for these costs prevents financial 
                  stress and ensures you're truly ready for the responsibilities of homeownership.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Ongoing Homeownership Costs and Financial Planning</h3>
                <p>
                  The financial commitment of homeownership extends far beyond purchase price and mortgage repayments, with 
                  ongoing costs that first home buyers must budget for to maintain financial stability. Council rates in 
                  Sydney average $1,200-$2,000 annually, varying by property value and location. Water rates add another 
                  $500-$800 per year. Strata fees for apartments can range from $2,000-$8,000+ annually, covering building 
                  maintenance, insurance, and common area upkeep. Home and contents insurance typically costs $800-$2,000 
                  per year. Regular maintenance and repairs average 1-2% of property value annually—$6,000-$13,000 for a 
                  $650,000 home. Unexpected expenses like appliance replacements, urgent repairs, or building defects require 
                  emergency fund reserves. Energy bills, internet, and other utilities add $3,000-$6,000 annually. For a 
                  typical first home, total annual ongoing costs beyond mortgage repayments might reach $10,000-$20,000, 
                  equating to $800-$1,600 monthly on top of your mortgage. Financial institutions typically assess borrowing 
                  capacity allowing mortgage repayments of 30% of gross income, but total housing costs including rates, 
                  insurance, and maintenance can push this figure toward 40-45% for first home buyers, making comprehensive 
                  budgeting essential for sustainable homeownership.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Regional NSW Opportunities and Considerations</h3>
                <p>
                  Regional NSW offers first home buyers compelling alternatives to Sydney's expensive property market, with 
                  median house prices in areas like Newcastle, Wollongong, Central Coast, and inland centers often 30-50% 
                  lower than Sydney equivalents. This price differential creates opportunities for larger properties, reduced 
                  mortgage stress, and faster deposit accumulation. Regional buyers access the same first home buyer concessions 
                  and federal schemes, with potentially greater benefit due to lower property values maximizing stamp duty 
                  savings and grant accessibility. However, regional purchasing requires careful consideration of employment 
                  opportunities, income potential, lifestyle preferences, and long-term capital growth prospects. Some regional 
                  areas have experienced rapid growth and gentrification, offering strong investment fundamentals, while 
                  others face population decline and limited appreciation potential. The rise of remote work has transformed 
                  regional desirability for many first home buyers, particularly those in technology, creative, and knowledge 
                  sectors. Regional first home buyers should research local market trends, employment diversity, infrastructure 
                  development plans, and demographic patterns to ensure their property choice aligns with both immediate 
                  lifestyle needs and long-term financial objectives.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategic First Home Buying Planning and Preparation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Building Your Deposit: Savings Strategies and Timeline</h3>
                <p>
                  Accumulating a sufficient deposit represents the primary challenge for most first home buyers, requiring 
                  disciplined saving, strategic financial planning, and often significant lifestyle adjustments. With median 
                  Sydney house prices around $1.2 million and units near $750,000, even a 10% deposit represents $75,000-$120,000—
                  a daunting figure for young professionals. Effective deposit-building strategies include automatic transfer 
                  of a fixed percentage of each paycheck to a dedicated high-interest savings account, typically 20-30% of 
                  net income for serious savers. The First Home Super Saver Scheme enables tax-advantaged saving of up to 
                  $15,000 annually, potentially reducing a 3-4 year savings timeline by 6-12 months through tax benefits. 
                  Reducing discretionary spending on dining out, entertainment, subscriptions, and holidays can free up 
                  $500-$1,500 monthly for additional deposit contributions. Many first home buyers supplement savings through 
                  side hustles, freelance work, or investment income. Family gifts or loans, while requiring careful navigation 
                  of family dynamics and lender disclosure requirements, help some buyers bridge deposit gaps. Setting clear 
                  timeline goals, tracking progress monthly, and celebrating milestones maintains motivation throughout the 
                  multi-year journey toward homeownership.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Credit Score Optimization and Financial Readiness</h3>
                <p>
                  Your credit score significantly influences mortgage approval likelihood, interest rates offered, and loan 
                  terms available, making credit optimization a crucial element of first home buyer preparation. Lenders 
                  typically seek credit scores above 700 for favorable rates, with scores below 600 potentially triggering 
                  higher interest rates or loan rejections. Optimizing credit involves consistently paying all bills on time, 
                  reducing credit card balances below 30% of limits, avoiding new credit applications in the 6-12 months 
                  before mortgage application, and correcting any errors in your credit report. Many first-time buyers are 
                  surprised to discover that multiple credit inquiries, even for comparison shopping, can negatively impact 
                  scores. Closing unused credit cards and consolidating debt can improve debt-to-income ratios and demonstrate 
                  financial responsibility. Beyond credit scores, lenders assess overall financial behavior through bank 
                  statements, typically reviewing 3-6 months of transactions. Regular gambling, excessive discretionary spending, 
                  frequent overdrafts, or unpaid subscriptions can raise red flags. Establishing a pattern of consistent 
                  saving, minimal discretionary spending, and responsible financial management in the 6-12 months before 
                  applying demonstrates readiness for the responsibilities of mortgage debt.
                </p>

                <MidContentAd />

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Property Selection: New vs Established, Apartments vs Houses</h3>
                <p>
                  First home buyers face critical decisions about property type, each with distinct financial implications, 
                  benefits, and considerations. New properties qualify for the $10,000 First Home Owner Grant and typically 
                  offer modern amenities, energy efficiency, and lower immediate maintenance costs, but command premium prices 
                  and may appreciate more slowly than established properties in desirable locations. Established properties 
                  generally offer better value per square meter, established gardens and neighborhoods, and potentially superior 
                  locations, but require renovation budgets and immediate maintenance attention. Apartments provide affordability, 
                  lower maintenance responsibilities, and lifestyle amenities, particularly appealing to young professionals 
                  in inner-city locations, but involve strata fees, potential special levies, and sometimes limited capital 
                  growth compared to houses. Houses offer land value appreciation, renovation opportunities, privacy, and 
                  family-friendly features, but require higher purchase prices, greater maintenance commitments, and typically 
                  involve trade-offs on location proximity. First home buyers should evaluate lifestyle priorities, future 
                  family plans, work location, commute tolerance, and investment objectives when selecting property type, 
                  recognizing that the "perfect" first home likely involves compromises across location, size, type, and 
                  price dimensions.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">First Home Buyer Strategic Action Plan:</h4>
                  <ul className="space-y-1">
                    <li>• Research NSW first home buyer benefits and eligibility requirements</li>
                    <li>• Establish dedicated savings account and automate monthly contributions</li>
                    <li>• Consider First Home Super Saver Scheme for tax-advantaged saving</li>
                    <li>• Monitor and optimize credit score 12+ months before applying</li>
                    <li>• Obtain pre-approval to understand realistic budget parameters</li>
                    <li>• Research target suburbs for market trends and growth potential</li>
                    <li>• Engage mortgage broker to compare lender options and rates</li>
                    <li>• Budget comprehensively for upfront costs beyond deposit</li>
                    <li>• Plan for ongoing homeownership expenses in financial modeling</li>
                    <li>• Investigate government schemes like FHLDS and Shared Equity</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">The Role of Mortgage Brokers and Financial Advisers</h3>
                <p>
                  Professional guidance through mortgage brokers and financial advisers provides first home buyers with 
                  expertise, market access, and strategic insights that can save thousands of dollars and prevent costly 
                  mistakes. Mortgage brokers access multiple lenders, including smaller institutions and non-bank lenders 
                  often offering competitive rates unavailable to direct applicants. They navigate complex eligibility criteria, 
                  structure applications to maximize approval likelihood, and identify optimal loan features for individual 
                  circumstances. Importantly, most mortgage brokers are paid by lenders through commissions, making their 
                  services free to buyers, though this creates potential conflicts of interest that informed buyers should 
                  understand. Financial advisers provide broader perspective, helping first home buyers evaluate whether 
                  purchasing represents the optimal financial decision compared to continued renting with aggressive investment, 
                  considering factors like career mobility, family planning, and long-term wealth objectives. Professional 
                  advice becomes particularly valuable for complex situations involving self-employment, irregular income, 
                  family gifts, or coordination of multiple government schemes. While professional fees for financial advisers 
                  might reach $2,000-$5,000, the strategic insights and optimization opportunities often deliver return on 
                  investment many times over, particularly for significant property purchases.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Timing Your Purchase: Market Cycles and Personal Readiness</h3>
                <p>
                  The decision of when to buy involves balancing market conditions with personal financial readiness, career 
                  stability, and life circumstances. Property markets move in cycles of growth, peak, correction, and recovery, 
                  with timing significantly impacting purchase price and future appreciation. Buying during market peaks often 
                  means overpaying and facing potential short-term value declines, while purchasing during corrections offers 
                  value opportunities but requires confidence to act when market sentiment is negative. However, attempting 
                  to perfectly time markets often proves counterproductive, with buyers waiting years for optimal conditions 
                  that never materialize while prices appreciate beyond reach. Personal readiness—adequate deposit, stable 
                  employment, strong credit profile, and lifestyle alignment with homeownership—often matters more than 
                  perfect market timing. The 7-10 year average property holding period means short-term market fluctuations 
                  typically smooth out over time, with long-term Sydney property trends showing consistent appreciation despite 
                  periodic corrections. First home buyers should focus on purchasing property they can afford comfortably, 
                  in locations aligned with lifestyle needs, when personal circumstances support homeownership commitments, 
                  rather than attempting to optimize for potentially imaginary perfect market conditions.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Understanding Loan Features and Mortgage Structures</h3>
                <p>
                  Home loans come with numerous features and structures that significantly impact total interest paid, 
                  repayment flexibility, and financial outcomes over the loan lifetime. Variable rate loans fluctuate with 
                  market interest rates, offering flexibility and typically lower rates than fixed alternatives, but creating 
                  repayment uncertainty. Fixed rate loans provide repayment certainty for 1-5 year periods, valuable for 
                  budget planning and protection against rate rises, but often include break fees and limited flexibility. 
                  Many first home buyers opt for split loans combining variable and fixed portions, balancing certainty with 
                  flexibility. Offset accounts link transaction accounts to mortgages, reducing interest charged on balances 
                  while maintaining access to funds for emergencies—particularly valuable for disciplined savers. Redraw 
                  facilities allow access to extra repayments, though often with conditions and potential fees. Interest-only 
                  periods, typically available for investors, rarely benefit first home buyers who should prioritize principal 
                  reduction. Package deals bundling credit cards, transaction accounts, and insurance sometimes offer rate 
                  discounts but require careful evaluation of overall value. Understanding these features and selecting 
                  appropriate loan structures can save tens of thousands in interest while providing flexibility for life's 
                  inevitable changes and opportunities.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions - NSW First Home Buyers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How much deposit do I need to buy my first home in NSW?</h4>
                    <p>Traditionally, a 20% deposit is recommended to avoid Lender's Mortgage Insurance (LMI), meaning $130,000 for a $650,000 property. However, the First Home Loan Deposit Scheme allows eligible buyers to purchase with just 5% deposit ($32,500) without paying LMI. Many lenders also offer loans with 10-15% deposits, though LMI applies. Your required deposit depends on which schemes you qualify for and your lender's requirements.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I get stamp duty exemption in NSW if the property is $750,000?</h4>
                    <p>For first home buyers, properties up to $650,000 receive full stamp duty exemption. Properties between $650,000-$800,000 qualify for concessional stamp duty rates. At $750,000, you would pay reduced stamp duty rather than the full rate—saving approximately $12,000-15,000 compared to non-first home buyers, though not receiving complete exemption.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What is the income limit for first home buyer schemes in NSW?</h4>
                    <p>Income limits vary by scheme. The NSW Shared Equity Scheme has limits of $90,000 for singles and $120,000 for couples. The First Home Loan Deposit Scheme (federal) allows $125,000 for singles and $200,000 for couples. Stamp duty concessions and the First Home Owner Grant have no income limits, only property price thresholds.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I use the First Home Owner Grant for an established property?</h4>
                    <p>No, the $10,000 First Home Owner Grant applies only to new homes—newly constructed properties, substantially renovated properties, or new apartments purchased from developers. Established properties do not qualify for the grant, though they remain eligible for stamp duty concessions if under $800,000.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How long do I need to live in the property to keep first home buyer benefits?</h4>
                    <p>Generally, you must occupy the property as your principal place of residence for at least six months continuously. Some schemes have longer requirements—the NSW Shared Equity Scheme requires 10 years minimum occupancy. Moving out earlier may trigger repayment of benefits, though some schemes allow exceptions for employment relocation or genuine hardship.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I combine multiple first home buyer schemes?</h4>
                    <p>Yes, many schemes can be combined. You can use stamp duty concessions with the First Home Owner Grant, and also access the First Home Loan Deposit Scheme for deposit assistance. The First Home Super Saver Scheme can be used alongside these. However, you cannot combine the FHLDS with other government guarantee schemes. Always verify specific combination rules with Service NSW and your lender.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What happens if I previously owned property overseas?</h4>
                    <p>Generally, you remain eligible for NSW and federal first home buyer benefits if you've never owned property in Australia, even if you owned property overseas. However, specific schemes may have different rules. The First Home Owner Grant and stamp duty concessions typically focus on Australian property ownership history. Always disclose overseas property ownership when applying.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How do I apply for first home buyer benefits in NSW?</h4>
                    <p>Stamp duty concessions and the First Home Owner Grant are applied for through Revenue NSW when you purchase your property, typically facilitated by your conveyancer or solicitor. The First Home Loan Deposit Scheme is accessed through participating lenders when applying for your mortgage. The NSW Shared Equity Scheme requires separate application through the scheme administrator. Start by obtaining pre-approval from your lender, then work with professionals to coordinate applications.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Important Information & Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• This calculator provides estimates for informational purposes only and should not be relied upon for final property purchase decisions.</p>
              <p>• Eligibility for first home buyer schemes depends on numerous factors not fully assessed by this calculator.</p>
              <p>• Government schemes, rates, thresholds, and concessions change regularly—always verify current benefits with Service NSW and Revenue NSW.</p>
              <p>• Actual stamp duty, grants, and scheme availability depend on specific property characteristics and individual circumstances.</p>
              <p>• LMI premiums, interest rates, and loan terms vary by lender and individual financial profile.</p>
              <p>• Professional advice from mortgage brokers, financial advisers, and conveyancers is essential for property purchases.</p>
              <p>• First Home Loan Deposit Scheme places are limited and allocated on first-come, first-served basis through participating lenders.</p>
              <p>• This calculator does not constitute financial advice and cannot replace professional consultation.</p>
              <p>• Always conduct comprehensive due diligence, including building inspections, contract review, and financial planning before purchasing property.</p>
              <p>• Results are estimates only and actual costs and benefits may vary significantly from calculations shown.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default FirstHomeBuyerCalculatorNSW;
