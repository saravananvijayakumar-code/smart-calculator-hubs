// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Home, Info, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

const PropertyTaxCalculatorAustralia: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [purchaseType, setPurchaseType] = useState<string>('');
  const [isFirstHome, setIsFirstHome] = useState<string>('');
  const [purchaseDate, setPurchaseDate] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculatePropertyTax = () => {
    const value = parseFloat(propertyValue);
    if (!value || !state || !propertyType || !purchaseType) return;

    let stampDuty = 0;
    let landTax = 0;
    let transferFee = 0;
    let registrationFee = 200; // Base registration fee

    // Calculate stamp duty based on state and conditions
    stampDuty = calculateStampDuty(value, state, propertyType, purchaseType, isFirstHome === 'yes');
    
    // Calculate land tax (annual) - simplified calculation
    landTax = calculateLandTax(value, state, propertyType);

    // Calculate transfer fees
    transferFee = calculateTransferFee(value, state);

    // Additional costs
    const legalFees = Math.min(value * 0.001, 2000); // Approximate legal fees
    const inspectionFees = 500; // Building and pest inspection
    const lmiPremium = calculateLMI(value, purchaseType);
    const foreignBuyerSurcharge = calculateForeignBuyerSurcharge(value, state, purchaseType);

    const totalUpfrontCosts = stampDuty + transferFee + registrationFee + legalFees + inspectionFees + lmiPremium + foreignBuyerSurcharge;
    const annualCosts = landTax;

    // First home buyer benefits
    const fhbBenefits = calculateFHBBenefits(value, state, isFirstHome === 'yes');

    setResults({
      stampDuty,
      landTax,
      transferFee,
      registrationFee,
      legalFees,
      inspectionFees,
      lmiPremium,
      foreignBuyerSurcharge,
      totalUpfrontCosts,
      annualCosts,
      fhbBenefits,
      netUpfrontCosts: totalUpfrontCosts - fhbBenefits.totalBenefit,
      stampDutyRate: (stampDuty / value) * 100,
      totalCostPercentage: (totalUpfrontCosts / value) * 100
    });
  };

  const calculateStampDuty = (value: number, state: string, propType: string, purchaseType: string, firstHome: boolean) => {
    let duty = 0;
    
    switch (state) {
      case 'nsw':
        if (firstHome && value <= 650000) {
          duty = 0;
        } else if (firstHome && value <= 800000) {
          // Concession for first home buyers
          duty = Math.max(0, (value - 650000) * 0.0425);
        } else {
          // Standard NSW rates (2024)
          if (value <= 14000) duty = value * 0.0125;
          else if (value <= 32000) duty = 175 + (value - 14000) * 0.015;
          else if (value <= 85000) duty = 445 + (value - 32000) * 0.0175;
          else if (value <= 319000) duty = 1372.5 + (value - 85000) * 0.035;
          else if (value <= 1064000) duty = 9562.5 + (value - 319000) * 0.045;
          else duty = 43087.5 + (value - 1064000) * 0.055;
        }
        break;
        
      case 'vic':
        if (firstHome && value <= 600000) {
          duty = 0;
        } else if (firstHome && value <= 750000) {
          // Concession for first home buyers
          duty = Math.max(0, (value - 600000) * 0.05);
        } else {
          // Standard VIC rates (2024)
          if (value <= 25000) duty = value * 0.014;
          else if (value <= 130000) duty = 350 + (value - 25000) * 0.024;
          else if (value <= 960000) duty = 2870 + (value - 130000) * 0.06;
          else duty = 52670 + (value - 960000) * 0.065;
        }
        break;
        
      case 'qld':
        if (firstHome && value <= 550000) {
          duty = 0;
        } else {
          // Standard QLD rates (2024)
          if (value <= 5000) duty = 0;
          else if (value <= 75000) duty = (value - 5000) * 0.015;
          else if (value <= 540000) duty = 1050 + (value - 75000) * 0.035;
          else if (value <= 1000000) duty = 17325 + (value - 540000) * 0.045;
          else duty = 38025 + (value - 1000000) * 0.0575;
        }
        break;
        
      case 'wa':
        // Western Australia rates (2024)
        if (value <= 120000) duty = value * 0.02;
        else if (value <= 150000) duty = 2400 + (value - 120000) * 0.03;
        else if (value <= 360000) duty = 3300 + (value - 150000) * 0.04;
        else if (value <= 725000) duty = 11700 + (value - 360000) * 0.05;
        else duty = 29950 + (value - 725000) * 0.06;
        break;
        
      case 'sa':
        // South Australia rates (2024)
        if (value <= 12000) duty = value * 0.01;
        else if (value <= 30000) duty = 120 + (value - 12000) * 0.02;
        else if (value <= 50000) duty = 480 + (value - 30000) * 0.03;
        else if (value <= 100000) duty = 1080 + (value - 50000) * 0.035;
        else if (value <= 200000) duty = 2830 + (value - 100000) * 0.04;
        else if (value <= 250000) duty = 6830 + (value - 200000) * 0.045;
        else if (value <= 300000) duty = 9080 + (value - 250000) * 0.05;
        else if (value <= 500000) duty = 11580 + (value - 300000) * 0.055;
        else duty = 22580 + (value - 500000) * 0.065;
        break;
        
      default:
        // Generic calculation for other states
        duty = value * 0.04; // Approximate 4% rate
    }

    return Math.max(0, duty);
  };

  const calculateForeignBuyerSurcharge = (value: number, state: string, purchaseType: string) => {
    if (purchaseType !== 'foreign') return 0;

    switch (state) {
      case 'nsw':
        return value * 0.08; // 8% surcharge
      case 'vic':
        return value * 0.08; // 8% surcharge
      case 'qld':
        return value * 0.075; // 7.5% surcharge
      case 'wa':
        return value * 0.07; // 7% surcharge
      case 'sa':
        return value * 0.075; // 7.5% surcharge
      default:
        return value * 0.07; // Default 7% surcharge
    }
  };

  const calculateLandTax = (value: number, state: string, propType: string) => {
    if (propType === 'ppor') return 0; // No land tax on principal place of residence

    const landValue = value * 0.7; // Approximate land component (70% of property value)
    let landTax = 0;

    switch (state) {
      case 'nsw':
        if (landValue > 755000) {
          landTax = Math.max(0, 100 + (landValue - 755000) * 0.016);
        }
        break;
      case 'vic':
        if (landValue > 300000) {
          if (landValue <= 600000) {
            landTax = (landValue - 300000) * 0.005;
          } else if (landValue <= 1000000) {
            landTax = 1500 + (landValue - 600000) * 0.01;
          } else {
            landTax = 5500 + (landValue - 1000000) * 0.02;
          }
        }
        break;
      case 'qld':
        if (landValue > 600000) {
          landTax = (landValue - 600000) * 0.01;
        }
        break;
      case 'wa':
        if (landValue > 300000) {
          landTax = (landValue - 300000) * 0.025;
        }
        break;
      case 'sa':
        if (landValue > 391000) {
          landTax = (landValue - 391000) * 0.005;
        }
        break;
      default:
        if (landValue > 500000) {
          landTax = (landValue - 500000) * 0.01;
        }
    }

    return landTax;
  };

  const calculateTransferFee = (value: number, state: string) => {
    // Transfer fee calculation by state (2024 rates)
    switch (state) {
      case 'nsw':
        return Math.min(value * 0.0002, 500);
      case 'vic':
        return Math.min(value * 0.0003, 800);
      case 'qld':
        return Math.min(value * 0.0002, 400);
      case 'wa':
        return Math.min(value * 0.0002, 600);
      case 'sa':
        return Math.min(value * 0.0002, 500);
      default:
        return Math.min(value * 0.0002, 500);
    }
  };

  const calculateLMI = (value: number, purchaseType: string) => {
    if (purchaseType === 'investment') {
      // Assume 80% LVR for investment properties typically require LMI
      const loanAmount = value * 0.9; // Assume 90% LVR scenario
      if (loanAmount > value * 0.8) {
        return loanAmount * 0.015; // Approximate LMI rate (1.5% of loan amount)
      }
    }
    return 0; // Assume no LMI for other cases in this simplified calculation
  };

  const calculateFHBBenefits = (value: number, state: string, firstHome: boolean) => {
    if (!firstHome) return { stampDutyConcession: 0, grant: 0, totalBenefit: 0 };

    let stampDutyConcession = 0;
    let grant = 0;

    switch (state) {
      case 'nsw':
        if (value <= 650000) {
          stampDutyConcession = calculateStampDuty(value, state, 'residential', 'resident', false);
        } else if (value <= 800000) {
          const fullDuty = calculateStampDuty(value, state, 'residential', 'resident', false);
          const concessionalDuty = calculateStampDuty(value, state, 'residential', 'resident', true);
          stampDutyConcession = fullDuty - concessionalDuty;
        }
        grant = 10000; // First Home Owner Grant for new homes
        break;
      case 'vic':
        if (value <= 600000) {
          stampDutyConcession = calculateStampDuty(value, state, 'residential', 'resident', false);
        } else if (value <= 750000) {
          const fullDuty = calculateStampDuty(value, state, 'residential', 'resident', false);
          const concessionalDuty = calculateStampDuty(value, state, 'residential', 'resident', true);
          stampDutyConcession = fullDuty - concessionalDuty;
        }
        grant = 10000; // First Home Owner Grant
        break;
      case 'qld':
        if (value <= 550000) {
          stampDutyConcession = calculateStampDuty(value, state, 'residential', 'resident', false);
        }
        grant = 15000; // First Home Owner Grant
        break;
      case 'wa':
        grant = 10000; // First Home Owner Grant
        break;
      case 'sa':
        grant = 15000; // First Home Owner Grant
        break;
    }

    return {
      stampDutyConcession,
      grant,
      totalBenefit: stampDutyConcession + grant
    };
  };

  const reset = () => {
    setPropertyValue('');
    setState('');
    setPropertyType('');
    setPurchaseType('');
    setIsFirstHome('');
    setPurchaseDate('');
    setResults(null);
  };

  const tips = [
    "Stamp duty rates vary significantly between Australian states",
    "First home buyer concessions can provide substantial savings",
    "Foreign buyer surcharges apply in most states",
    "Land tax is ongoing - consider this in investment decisions",
    "Professional conveyancing advised for property transactions"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Australia Property Tax Calculator | Stamp Duty & Land Tax Calculator 2024"
      description="Comprehensive Australian property tax calculator covering stamp duty, land tax, transfer fees, and first home buyer concessions across all states. Calculate total property purchase costs and ongoing tax obligations."
      keywords="Australia property tax calculator, stamp duty calculator Australia, land tax calculator, first home buyer concessions, property transaction costs Australia, foreign buyer surcharge"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Property Tax Calculator
              </CardTitle>
              <CardDescription>
                Calculate comprehensive property taxes and transaction costs by state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="propertyValue">Property Value ($)</Label>
                <Input
                  id="propertyValue"
                  type="number"
                  placeholder="650000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Territory</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nsw">New South Wales</SelectItem>
                    <SelectItem value="vic">Victoria</SelectItem>
                    <SelectItem value="qld">Queensland</SelectItem>
                    <SelectItem value="wa">Western Australia</SelectItem>
                    <SelectItem value="sa">South Australia</SelectItem>
                    <SelectItem value="tas">Tasmania</SelectItem>
                    <SelectItem value="nt">Northern Territory</SelectItem>
                    <SelectItem value="act">Australian Capital Territory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="propertyType">Property Type</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ppor">Principal Place of Residence</SelectItem>
                    <SelectItem value="investment">Investment Property</SelectItem>
                    <SelectItem value="commercial">Commercial Property</SelectItem>
                    <SelectItem value="vacant_land">Vacant Land</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseType">Buyer Type</Label>
                <Select value={purchaseType} onValueChange={setPurchaseType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buyer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="resident">Australian Resident</SelectItem>
                    <SelectItem value="foreign">Foreign Buyer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isFirstHome">First Home Buyer?</Label>
                <Select value={isFirstHome} onValueChange={setIsFirstHome}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Expected Purchase Date (Optional)</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={calculatePropertyTax} className="flex-1">
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Property Tax Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Stamp Duty</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(results.stampDuty, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Transfer Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.transferFee, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Registration Fee</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.registrationFee, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Legal Fees (Est.)</p>
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(results.legalFees, 'AUD')}</p>
                  </div>
                </div>
                
                {results.foreignBuyerSurcharge > 0 && (
                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Foreign Buyer Surcharge: {formatCurrency(results.foreignBuyerSurcharge, 'AUD')}
                      </span>
                    </div>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-3">
                  <h4 className="font-medium">Total Costs Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Upfront Costs:</span>
                      <Badge variant="outline">{formatCurrency(results.totalUpfrontCosts, 'AUD')}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Annual Land Tax:</span>
                      <Badge variant="secondary">{formatCurrency(results.landTax, 'AUD')}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Stamp Duty Rate:</span>
                      <Badge variant="outline">{results.stampDutyRate.toFixed(2)}%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Total Cost as % of Value:</span>
                      <Badge variant="destructive">{results.totalCostPercentage.toFixed(2)}%</Badge>
                    </div>
                  </div>
                </div>

                {results.fhbBenefits.totalBenefit > 0 && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">First Home Buyer Benefits</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Stamp Duty Concession</p>
                          <p className="font-medium text-green-600">{formatCurrency(results.fhbBenefits.stampDutyConcession, 'AUD')}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">First Home Grant</p>
                          <p className="font-medium text-green-600">{formatCurrency(results.fhbBenefits.grant, 'AUD')}</p>
                        </div>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-sm font-medium">Net Upfront Costs:</span>
                        <Badge variant="default">{formatCurrency(results.netUpfrontCosts, 'AUD')}</Badge>
                      </div>
                    </div>
                  </>
                )}

                {results.lmiPremium > 0 && (
                  <div className="bg-amber-50 p-3 rounded-lg">
                    <p className="text-sm text-amber-800">
                      <strong>LMI Premium:</strong> {formatCurrency(results.lmiPremium, 'AUD')} 
                      (estimated for high LVR loans)
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
                calculatorType: "property-tax-australia",
                data: {
                  propertyValue: parseFloat(propertyValue) || 0,
                  taxRate: results.stampDutyRate / 100,
                  annualTax: results.landTax,
                  exemptions: results.fhbBenefits.totalBenefit,
                  netTax: results.netUpfrontCosts
                }
              }}
              autoRun={true}
              title="AI Property Tax Analysis"
              description="Get personalized strategies to minimize property taxes and optimize your property purchase timing."
            />

            <ExportShareButtons
              calculatorType="property-tax-australia"
              inputs={{
                propertyValue: parseFloat(propertyValue) || 0,
                state,
                propertyType,
                buyerType: propertyType
              }}
              results={{
                stampDuty: results.stampDuty,
                landTax: results.landTax,
                totalUpfrontCosts: results.totalUpfrontCosts,
                netUpfrontCosts: results.netUpfrontCosts
              }}
              title="Property Tax Calculator Australia Report"
              className="mt-6"
            />
          </>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Australian Property Taxes and Transaction Costs</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Property ownership in Australia involves a complex web of taxes, fees, and transaction costs that can 
                  significantly impact the affordability and profitability of real estate investments. Understanding these 
                  costs is crucial for property buyers, investors, and homeowners to make informed decisions and budget 
                  appropriately for their property transactions. The Australian property tax landscape varies considerably 
                  across states and territories, with different rules, rates, and concessions that can dramatically affect 
                  the total cost of property ownership.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Stamp Duty: Australia's Major Property Tax</h3>
                <p>
                  Stamp duty represents the largest upfront cost when purchasing property in Australia, functioning as a 
                  state-based transaction tax calculated as a percentage of the property's value. Each state and territory 
                  operates its own stamp duty regime with unique rate structures, typically featuring progressive scales 
                  where higher-value properties incur proportionally higher rates. The duty can range from 3% to over 7% 
                  of the property value, making it a substantial consideration in property affordability calculations and 
                  a key factor in interstate property investment decision-making.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">State-by-State Stamp Duty Variations</h3>
                <p>
                  The variation in stamp duty rates across Australian jurisdictions creates significant opportunities for 
                  strategic property investment and location selection. New South Wales and Victoria typically have the 
                  highest stamp duty rates, particularly for premium properties, while states like Queensland and Western 
                  Australia may offer more favorable rates for certain property types and price ranges. Understanding these 
                  variations helps investors optimize their property portfolio allocation and can influence decisions about 
                  where to buy primary residences versus investment properties.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Stamp Duty Rate Comparison (Approximate for $650,000 Property):</h4>
                  <ul className="space-y-1">
                    <li>• NSW: $25,080 (3.86%)</li>
                    <li>• VIC: $31,070 (4.78%)</li>
                    <li>• QLD: $21,175 (3.26%)</li>
                    <li>• WA: $23,200 (3.57%)</li>
                    <li>• SA: $26,330 (4.05%)</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">First Home Buyer Concessions and Support</h3>
                <p>
                  Australian governments provide extensive support to first home buyers through various concessions, grants, 
                  and schemes designed to improve housing affordability. These benefits include stamp duty concessions or 
                  complete exemptions for properties below certain price thresholds, first home owner grants for new construction, 
                  and shared equity schemes in some jurisdictions. The value and eligibility criteria vary significantly by 
                  state, with some offering complete stamp duty exemptions for first home buyers purchasing below specified 
                  price caps, potentially saving tens of thousands of dollars.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Land Tax: The Ongoing Annual Obligation</h3>
                <p>
                  Land tax represents an annual liability imposed on land holdings above specified thresholds, with each 
                  state maintaining different rates, thresholds, and aggregation rules. Generally, principal places of 
                  residence are exempt from land tax, making it primarily relevant for investment property owners and 
                  commercial property holders. Land tax calculations are based on the unimproved value of land and can 
                  accumulate across multiple properties within a state, making portfolio management and jurisdiction 
                  selection critical considerations for property investors seeking to minimize ongoing tax obligations.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Foreign Buyer Additional Duties and Surcharges</h3>
                <p>
                  Foreign property buyers face substantial additional costs through surcharges and duties designed to moderate 
                  foreign investment in Australian residential real estate. These surcharges typically range from 7% to 8% 
                  above standard stamp duty rates, effectively doubling the upfront tax cost for foreign purchasers. Additionally, 
                  foreign buyers often face annual land tax surcharges and must comply with Foreign Investment Review Board 
                  (FIRB) approval requirements for certain property purchases, adding both complexity and ongoing costs to 
                  their property investment strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Transaction Costs Beyond Government Taxes</h3>
                <p>
                  Property transactions involve numerous costs beyond government-imposed taxes, creating a comprehensive expense 
                  structure that buyers must consider. These include legal and conveyancing fees (typically $1,000-3,000), 
                  building and pest inspections ($400-800), mortgage establishment fees, valuation costs, and various searches 
                  and certificates. Transfer fees and registration costs add to upfront expenses, while ongoing costs may include 
                  council rates, strata fees, and property management expenses for investment properties.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Lender's Mortgage Insurance (LMI) Considerations</h3>
                <p>
                  Borrowers with deposits below 20% typically must pay Lender's Mortgage Insurance, which protects lenders 
                  against default risk while enabling buyers to purchase with smaller deposits. LMI premiums vary based on 
                  loan-to-value ratios, loan amounts, and borrower profiles, potentially adding $10,000-50,000+ to purchase 
                  costs for high LVR loans. While LMI enables earlier property market entry, the substantial additional cost 
                  must be weighed against the benefits of entering the market sooner versus accumulating a larger deposit 
                  to avoid LMI requirements altogether.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategic Property Tax Planning and Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">Timing Strategies for Property Purchases</h3>
                <p>
                  Strategic timing of property purchases can result in significant tax savings through careful consideration 
                  of rate changes, concession availability, and personal circumstances. Many states periodically adjust stamp 
                  duty rates and thresholds, creating windows of opportunity for savvy buyers. Additionally, first home buyer 
                  concessions often have sunset clauses or changing eligibility criteria, making timing crucial for maximizing 
                  available benefits. Coordinating property settlements with financial year boundaries can also optimize 
                  depreciation claims and other tax deductions for investment properties.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Interstate Investment Property Strategies</h3>
                <p>
                  The significant variations in property taxes between Australian states create opportunities for tax arbitrage 
                  and strategic property portfolio allocation. Sophisticated investors often consider total holding costs, 
                  including both acquisition expenses and ongoing tax liabilities, when selecting investment locations. Some 
                  states offer more favorable land tax treatment for certain property types or investor categories, while others 
                  provide better depreciation opportunities or capital gains tax treatment, making jurisdiction selection a 
                  critical component of long-term wealth building strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Trust Structures and Tax Optimization</h3>
                <p>
                  Sophisticated property investors often utilize trust structures to optimize their property tax positions 
                  across multiple jurisdictions and properties. Discretionary trusts can provide flexibility in distributing 
                  income and capital gains among beneficiaries in different tax brackets, while unit trusts can facilitate 
                  joint investments and succession planning. However, these structures come with additional compliance costs 
                  and complexity, requiring professional advice to ensure they provide net benefits and remain compliant 
                  with changing tax laws and regulations.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Property Tax Optimization Strategies:</h4>
                  <ul className="space-y-1">
                    <li>• Research first home buyer concessions before purchasing</li>
                    <li>• Consider interstate opportunities for lower stamp duty</li>
                    <li>• Plan purchase timing around policy changes</li>
                    <li>• Evaluate trust structures for investment properties</li>
                    <li>• Factor ongoing land tax into investment decisions</li>
                    <li>• Understand foreign buyer implications if applicable</li>
                    <li>• Budget for all transaction costs, not just purchase price</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Property Tax Reform and Future Changes</h3>
                <p>
                  Australian property taxation continues evolving through various reform proposals and policy adjustments 
                  across different jurisdictions. Some states have implemented or are considering broad-based land tax systems 
                  to replace stamp duty, which would fundamentally change the property cost structure from large upfront 
                  payments to ongoing annual liabilities. Understanding current reform trajectories and potential changes 
                  helps property owners and investors anticipate future tax obligations and adapt their strategies accordingly, 
                  particularly for long-term investment planning and retirement property decisions.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Capital Gains Tax Integration</h3>
                <p>
                  While not technically a property tax, Capital Gains Tax (CGT) significantly impacts overall property 
                  investment returns and must be considered alongside acquisition and holding costs. CGT applies to gains 
                  on investment properties upon sale, with a 50% discount available for assets held longer than 12 months. 
                  Principal places of residence generally qualify for the main residence exemption, though complex rules 
                  apply when properties have been used for income generation or when multiple residences are involved 
                  throughout the ownership period.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Professional Advice and Compliance</h3>
                <p>
                  The complexity of Australian property taxation across multiple jurisdictions, combined with the substantial 
                  financial implications of property transactions, makes professional advice invaluable for significant property 
                  decisions. Tax professionals, qualified conveyancers, and financial advisers can help navigate the various 
                  obligations, optimize tax positions, and ensure compliance with all applicable requirements. Professional 
                  guidance becomes particularly important for foreign buyers, complex investment structures, interstate 
                  transactions, and situations involving multiple properties or sophisticated timing strategies.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Technology and Property Tax Calculation</h3>
                <p>
                  Modern property tax calculators and digital tools provide valuable preliminary estimates for planning purposes, 
                  but they cannot replace professional advice for actual transactions. These tools help buyers understand the 
                  magnitude of costs across different scenarios and jurisdictions, enabling informed preliminary decisions about 
                  budget allocation and property selection. However, actual calculations may vary due to specific circumstances, 
                  recent law changes, and individual eligibility factors that automated calculators may not fully capture.
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
                    <h4 className="font-semibold text-gray-800 mb-2">Which Australian state has the lowest stamp duty?</h4>
                    <p>Stamp duty rates vary by property value, but generally Queensland and Western Australia offer more competitive rates for many price ranges. However, the "lowest" depends on specific property value, with different states being more favorable at different price points. Always calculate for your specific scenario.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I avoid stamp duty as a first home buyer?</h4>
                    <p>Yes, many states offer stamp duty exemptions or significant concessions for first home buyers. NSW offers full exemption up to $650,000, Victoria up to $600,000, and Queensland up to $550,000. Eligibility criteria and thresholds vary by state and change periodically.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Do I pay land tax on my principal place of residence?</h4>
                    <p>No, your principal place of residence is generally exempt from land tax in all Australian states. Land tax only applies to investment properties, vacant land, and commercial properties above the tax-free threshold, which varies by state.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What additional costs do foreign buyers face?</h4>
                    <p>Foreign buyers typically pay stamp duty surcharges of 7-8% above standard rates, annual land tax surcharges of 0.5-2%, and may require FIRB approval costing $13,200-117,100+ depending on property value. These additional costs can effectively double the tax burden.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How is land tax calculated across multiple properties?</h4>
                    <p>Land tax is calculated on the total unimproved land value of all taxable properties owned within a state. Properties are aggregated, and tax is calculated on the combined value using progressive rates. This means multiple smaller properties can push you into higher tax brackets.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">When is stamp duty payable?</h4>
                    <p>Stamp duty is typically payable within 30-90 days of contract signing, varying by state. Some states require payment by settlement, while others have earlier deadlines. Late payment incurs penalties and interest charges, so ensure you understand your state's specific requirements.</p>
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
              <p>• This calculator provides estimates only and should not be relied upon for final property transaction decisions.</p>
              <p>• Tax rates, thresholds, and concessions change regularly - always verify current rates with relevant authorities.</p>
              <p>• First home buyer eligibility has specific criteria that may not be covered by this simplified calculator.</p>
              <p>• Foreign buyer surcharges and FIRB requirements have complex rules requiring professional advice.</p>
              <p>• Land tax calculations are simplified estimates - actual assessments may vary based on official valuations.</p>
              <p>• Additional costs like mortgage establishment fees, conveyancing, and insurance are not included in calculations.</p>
              <p>• Professional conveyancing and tax advice is recommended for all significant property transactions.</p>
              <p>• State revenue offices are the authoritative source for current tax rates and payment requirements.</p>
              <p>• Results are estimates only and actual costs may vary significantly from calculations shown.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default PropertyTaxCalculatorAustralia;