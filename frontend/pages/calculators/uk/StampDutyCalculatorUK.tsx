import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, Home, Info, TrendingUp, AlertCircle, FileText, DollarSign, Clock, Building, Users, HelpCircle, Shield, Wallet, Target } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { formatCurrency } from '../../../utils/formatting';
import type { StampDutyAnalysisData, AnalysisRequest } from '~backend/ai-analysis/types';
import { SEOHead } from '../../../components/SEOHead';

const StampDutyCalculatorUK: React.FC = () => {
  const [propertyValue, setPropertyValue] = useState<string>('');
  const [propertyType, setPropertyType] = useState<string>('');
  const [buyerType, setBuyerType] = useState<string>('');
  const [results, setResults] = useState<any>(null);
  const [analysisRequest, setAnalysisRequest] = useState<AnalysisRequest | null>(null);

  const calculateStampDuty = () => {
    const value = parseFloat(propertyValue);
    if (!value || !propertyType || !buyerType) return;

    let stampDuty = 0;
    let rate = 0;

    // Residential property rates (as of 2024)
    if (propertyType === 'residential') {
      if (buyerType === 'first-time') {
        // First-time buyer rates
        if (value <= 425000) {
          stampDuty = 0;
          rate = 0;
        } else if (value <= 625000) {
          stampDuty = (value - 425000) * 0.05;
          rate = 5;
        } else {
          stampDuty = (625000 - 425000) * 0.05 + (value - 625000) * 0.1;
          rate = 10;
        }
      } else if (buyerType === 'additional') {
        // Additional property rates (3% surcharge)
        if (value <= 250000) {
          stampDuty = value * 0.03;
          rate = 3;
        } else if (value <= 925000) {
          stampDuty = 250000 * 0.03 + (value - 250000) * 0.08;
          rate = 8;
        } else if (value <= 1500000) {
          stampDuty = 250000 * 0.03 + (925000 - 250000) * 0.08 + (value - 925000) * 0.13;
          rate = 13;
        } else {
          stampDuty = 250000 * 0.03 + (925000 - 250000) * 0.08 + (1500000 - 925000) * 0.13 + (value - 1500000) * 0.15;
          rate = 15;
        }
      } else {
        // Standard residential rates
        if (value <= 250000) {
          stampDuty = 0;
          rate = 0;
        } else if (value <= 925000) {
          stampDuty = (value - 250000) * 0.05;
          rate = 5;
        } else if (value <= 1500000) {
          stampDuty = (925000 - 250000) * 0.05 + (value - 925000) * 0.1;
          rate = 10;
        } else {
          stampDuty = (925000 - 250000) * 0.05 + (1500000 - 925000) * 0.1 + (value - 1500000) * 0.12;
          rate = 12;
        }
      }
    } else {
      // Commercial property rates
      if (value <= 150000) {
        stampDuty = 0;
        rate = 0;
      } else if (value <= 250000) {
        stampDuty = (value - 150000) * 0.02;
        rate = 2;
      } else {
        stampDuty = (250000 - 150000) * 0.02 + (value - 250000) * 0.05;
        rate = 5;
      }
    }

    const totalCost = value + stampDuty;
    const effectiveRate = (stampDuty / value) * 100;

    const calculationResults = {
      propertyValue: value,
      stampDuty,
      totalCost,
      effectiveRate,
      marginalRate: rate
    };
    
    setResults(calculationResults);
    
    // Prepare AI analysis request
    const analysisData: StampDutyAnalysisData = {
      propertyValue: value,
      stampDuty,
      effectiveRate,
      buyerType: buyerType || 'standard',
      location: 'England/Northern Ireland'
    };
    
    setAnalysisRequest({
      calculatorType: 'stamp-duty-uk',
      data: analysisData
    });
  };

  const reset = () => {
    setPropertyValue('');
    setPropertyType('');
    setBuyerType('');
    setResults(null);
    setAnalysisRequest(null);
  };

  const tips = [
    "First-time buyers get relief on properties up to £425,000",
    "Additional property purchases attract a 3% surcharge",
    "Commercial properties have different rates from residential",
    "Stamp duty is payable within 14 days of completion",
    "Consider getting professional advice for complex purchases",
    "Scotland has LBTT and Wales has LTT with different rates",
    "Budget for additional costs like legal fees and surveys",
    "Multiple dwellings relief may apply for bulk purchases"
  ];

  return (
    <>
      <SEOHead 
        title="UK Stamp Duty Calculator 2024 | SDLT Calculator with AI Analysis"
        description="Calculate UK Stamp Duty Land Tax (SDLT) for 2024 with our comprehensive calculator. Get AI-powered insights, first-time buyer relief calculations, and expert property tax guidance for England and Northern Ireland."
        keywords="UK stamp duty calculator 2024, SDLT calculator, stamp duty land tax, first time buyer relief, property tax UK, additional property surcharge, commercial property tax, AI property analysis"
      />
      <CalculatorLayoutWithAds
        title="UK Stamp Duty Calculator 2024"
        description="Calculate stamp duty land tax (SDLT) for property purchases in England and Northern Ireland with AI-powered insights"
        keywords="UK stamp duty calculator, SDLT calculator, property tax UK, first time buyer relief"
        tips={tips}
      >
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Stamp Duty Calculator
            </CardTitle>
            <CardDescription>
              Enter property details to calculate stamp duty land tax
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
              <Label htmlFor="propertyType">Property Type</Label>
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {propertyType === 'residential' && (
              <div className="space-y-2">
                <Label htmlFor="buyerType">Buyer Type</Label>
                <Select value={buyerType} onValueChange={setBuyerType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select buyer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Purchase</SelectItem>
                    <SelectItem value="first-time">First-Time Buyer</SelectItem>
                    <SelectItem value="additional">Additional Property</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={calculateStampDuty} className="flex-1">
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
                Stamp Duty Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Property Value</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.propertyValue, 'en-GB')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stamp Duty</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(results.stampDuty, 'en-GB')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.totalCost, 'en-GB')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Effective Rate</p>
                  <p className="text-lg font-semibold">{results.effectiveRate.toFixed(2)}%</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  Marginal Rate: {results.marginalRate}%
                </Badge>
                <Badge variant={results.stampDuty === 0 ? "secondary" : "destructive"}>
                  {results.stampDuty === 0 ? "No SDLT Due" : "SDLT Payable"}
                </Badge>
                {buyerType === 'first-time' && (
                  <Badge variant="default">
                    First-Time Buyer Relief
                  </Badge>
                )}
                {buyerType === 'additional' && (
                  <Badge variant="destructive">
                    3% Additional Property Surcharge
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {analysisRequest && results && (
        <>
          <AIAnalysis 
            analysisRequest={analysisRequest}
            className="mt-8"
            title="AI Stamp Duty Analysis"
            description="Get personalized insights about your stamp duty calculation and property purchase strategy."
          />

          <ExportShareButtons
            calculatorType="stamp-duty-uk"
            inputs={{
              propertyValue: parseFloat(propertyValue) || 0,
              propertyType,
              buyerType
            }}
            results={{
              stampDuty: results.totalStampDuty,
              effectiveRate: results.effectiveRate,
              totalCost: results.totalCost
            }}
            title="Stamp Duty Calculator UK Report"
            className="mt-6"
          />
        </>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Complete Guide to UK Stamp Duty Land Tax (SDLT) 2024
          </CardTitle>
          <CardDescription>
            Everything you need to know about stamp duty calculations, reliefs, and property tax planning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rates">Rates & Bands</TabsTrigger>
              <TabsTrigger value="reliefs">Reliefs & Exemptions</TabsTrigger>
              <TabsTrigger value="planning">Tax Planning</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="prose max-w-none">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <FileText className="h-5 w-5" />
                  What is Stamp Duty Land Tax?
                </h3>
                <p className="text-base leading-relaxed mb-4">
                  Stamp Duty Land Tax (SDLT) is a crucial tax levied on property purchases in England and Northern Ireland. 
                  Administered by HM Revenue and Customs (HMRC), SDLT can significantly impact your total property costs, 
                  making it essential to understand how calculations work and when the tax applies to your situation.
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 mb-2">Key Facts About SDLT:</h4>
                  <ul className="text-blue-800 space-y-1">
                    <li>• Progressive tax system with multiple rate bands</li>
                    <li>• Different rates for residential and commercial properties</li>
                    <li>• Special reliefs available for first-time buyers</li>
                    <li>• Additional 3% surcharge for second homes and buy-to-let</li>
                    <li>• Payment due within 14 days of completion</li>
                  </ul>
                </div>
                
                <h4 className="font-semibold text-lg mb-3">How SDLT Works</h4>
                <p className="mb-4">
                  SDLT operates on a progressive system similar to income tax bands. You only pay higher rates on the portion 
                  of the purchase price that exceeds each threshold, not on the entire property value. This ensures fairness 
                  and means that higher-value properties contribute proportionally more to public finances.
                </p>
                
                <h4 className="font-semibold text-lg mb-3">Geographic Coverage</h4>
                <p className="mb-4">
                  This calculator applies to property purchases in England and Northern Ireland. Scotland uses the Land and 
                  Buildings Transaction Tax (LBTT) system, while Wales has its own Land Transaction Tax (LTT). These devolved 
                  systems have different rates and thresholds, reflecting local priorities and housing market conditions.
                </p>
                
                <h4 className="font-semibold text-lg mb-3">Market Impact and Considerations</h4>
                <p className="mb-4">
                  SDLT significantly influences property market dynamics across the UK. The various thresholds create natural 
                  clustering points in property prices, particularly around the £250,000 nil-rate threshold and the £425,000 
                  first-time buyer relief limit. Understanding these market effects helps both buyers and sellers make 
                  informed decisions about pricing and timing.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="rates" className="mt-6 space-y-6">
              <div className="prose max-w-none">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <DollarSign className="h-5 w-5" />
                  SDLT Rates and Thresholds 2024
                </h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Residential Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <p className="font-semibold text-green-900">£0 - £250,000</p>
                          <p className="text-green-700">0% (No SDLT)</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="font-semibold text-blue-900">£250,001 - £925,000</p>
                          <p className="text-blue-700">5% on excess</p>
                        </div>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <p className="font-semibold text-orange-900">£925,001 - £1,500,000</p>
                          <p className="text-orange-700">10% on excess</p>
                        </div>
                        <div className="p-3 bg-red-50 border border-red-200 rounded">
                          <p className="font-semibold text-red-900">Above £1,500,000</p>
                          <p className="text-red-700">12% on excess</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Commercial Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                          <p className="font-semibold text-green-900">£0 - £150,000</p>
                          <p className="text-green-700">0% (No SDLT)</p>
                        </div>
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                          <p className="font-semibold text-blue-900">£150,001 - £250,000</p>
                          <p className="text-blue-700">2% on excess</p>
                        </div>
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded">
                          <p className="font-semibold text-orange-900">Above £250,000</p>
                          <p className="text-orange-700">5% on excess</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Additional Property Surcharge:</strong> Buyers purchasing additional residential properties 
                    (second homes, buy-to-let investments) pay an extra 3% on top of standard rates across the entire purchase price.
                  </AlertDescription>
                </Alert>
                
                <h4 className="font-semibold text-lg mt-6 mb-3">Rate Calculation Examples</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold mb-2">Example: £400,000 residential property (standard purchase)</p>
                  <ul className="space-y-1 text-sm">
                    <li>• First £250,000: £0 (0%)</li>
                    <li>• Next £150,000 (£250,001-£400,000): £7,500 (5%)</li>
                    <li>• <strong>Total SDLT: £7,500</strong></li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reliefs" className="mt-6 space-y-6">
              <div className="prose max-w-none">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <Wallet className="h-5 w-5" />
                  SDLT Reliefs and Exemptions
                </h3>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      First-Time Buyer Relief
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p>
                        The government provides substantial SDLT relief for first-time buyers to help them enter the property market. 
                        This relief can save thousands of pounds and makes homeownership more accessible.
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Relief Thresholds</h4>
                          <ul className="text-green-800 space-y-1">
                            <li>• Properties up to £425,000: 0% SDLT</li>
                            <li>• £425,001 - £625,000: 5% on excess only</li>
                            <li>• Above £625,000: Standard rates apply</li>
                          </ul>
                        </div>
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Eligibility Criteria</h4>
                          <ul className="text-blue-800 space-y-1">
                            <li>• Must be first property purchase</li>
                            <li>• Property must be your main residence</li>
                            <li>• Maximum property value £625,000</li>
                            <li>• Cannot own property anywhere else</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h4 className="font-semibold text-yellow-900 mb-2">Potential Savings Example</h4>
                        <p className="text-yellow-800">
                          On a £500,000 first home: Standard SDLT would be £12,500, but with first-time buyer relief, 
                          you pay only £3,750 - saving £8,750!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Other Important Reliefs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-semibold mb-1">Multiple Dwellings Relief</h4>
                        <p className="text-sm text-muted-foreground">
                          Available when purchasing multiple residential properties in a single transaction. 
                          Can provide significant savings for bulk purchases or property developers.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-green-500 pl-4">
                        <h4 className="font-semibold mb-1">Shared Ownership Relief</h4>
                        <p className="text-sm text-muted-foreground">
                          Special SDLT treatment for shared ownership purchases, typically resulting in lower tax liability 
                          as you only pay on your share of the property value.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-semibold mb-1">Corporate Transactions</h4>
                        <p className="text-sm text-muted-foreground">
                          Various reliefs available for corporate restructuring, group relief, and acquisition relief 
                          for companies purchasing property assets.
                        </p>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-semibold mb-1">Disadvantaged Areas Relief</h4>
                        <p className="text-sm text-muted-foreground">
                          Historically available for certain designated areas, though most schemes have now ended. 
                          Always check current availability for specific locations.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="planning" className="mt-6 space-y-6">
              <div className="prose max-w-none">
                <h3 className="flex items-center gap-2 text-xl font-semibold mb-4">
                  <Target className="h-5 w-5" />
                  Strategic SDLT Planning
                </h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Timing Strategies
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Coordinate completion dates in property chains to manage additional property surcharge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Consider 36-month replacement of main residence rule for avoiding surcharge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Plan disposals within three years to reclaim additional property surcharge</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Monitor potential temporary reliefs or rate changes</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Legal Structures
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Consider joint ownership structures for married couples</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Evaluate corporate ownership for investment properties</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Assess trust structures for family property arrangements</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span>Review partnership arrangements for commercial investments</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert className="mt-6">
                  <HelpCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Professional Advice Recommended:</strong> SDLT planning can be complex, especially for high-value 
                    properties or investment purchases. Consider consulting a tax advisor or solicitor specializing in property law.
                  </AlertDescription>
                </Alert>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Additional Cost Considerations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        While SDLT is often the largest additional cost in a property purchase, don't forget to budget for these other expenses:
                      </p>
                      
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold mb-2">Legal and Professional Fees</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Solicitor/conveyancer fees (£800-£2,000+)</li>
                            <li>• Survey costs (£300-£1,500+)</li>
                            <li>• Search fees (£200-£500)</li>
                            <li>• Mortgage arrangement fees</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold mb-2">Moving and Setup Costs</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Removal/moving costs</li>
                            <li>• Buildings insurance</li>
                            <li>• Utility connections and deposits</li>
                            <li>• Council tax and other ongoing costs</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mt-4">
                        <p className="text-blue-900 font-semibold mb-1">Total Additional Costs</p>
                        <p className="text-blue-800 text-sm">
                          Typically budget 3-5% of property value for all additional costs beyond the purchase price, 
                          including SDLT, legal fees, surveys, and moving expenses.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Payment and Compliance Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <h4 className="font-semibold text-red-900 mb-2">Payment Deadline</h4>
                          <p className="text-red-800 text-sm">
                            SDLT must be paid within 14 days of completion. Late payment incurs penalties and interest charges.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">SDLT Return</h4>
                          <p className="text-blue-800 text-sm">
                            Form SDLT1 must be submitted to HMRC, usually handled by your solicitor or conveyancer.
                          </p>
                        </div>
                        
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Certificate</h4>
                          <p className="text-green-800 text-sm">
                            HMRC issues an SDLT5 certificate confirming payment, needed for Land Registry registration.
                          </p>
                        </div>
                      </div>
                      
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Most conveyancers handle SDLT payment and returns as part of their service. Ensure this is 
                          included in your conveyancing quote and that adequate funds are available for completion.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </CalculatorLayoutWithAds>
    </>
  );
};

export default StampDutyCalculatorUK;