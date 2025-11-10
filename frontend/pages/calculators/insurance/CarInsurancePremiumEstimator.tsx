import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, Car, Shield, DollarSign, TrendingDown, AlertCircle, Award } from "lucide-react";
import { CalculatorLayoutWithAds } from "../../../components/CalculatorLayoutWithAds";
import EnhancedAIAnalysis from "@/components/EnhancedAIAnalysis";
import ExportShareButtons from "@/components/ExportShareButtons";
import { AdsterraSlot } from "@/components/ads/AdsterraSlot";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface InsuranceCalculation {
  comprehensivePremium: number;
  thirdPartyProperty: number;
  thirdPartyFireTheft: number;
  basePremium: number;
  ageAdjustment: number;
  locationAdjustment: number;
  vehicleAdjustment: number;
  claimsAdjustment: number;
  excessDiscount: number;
  ncdDiscount: number;
  estimatedAnnualCost: number;
  potentialSavings: number;
}

export default function CarInsurancePremiumEstimator() {
  const [state, setState] = useState("nsw");
  const [age, setAge] = useState(35);
  const [gender, setGender] = useState("male");
  const [vehicleAge, setVehicleAge] = useState(3);
  const [vehicleValue, setVehicleValue] = useState(30000);
  const [vehicleType, setVehicleType] = useState("sedan");
  const [annualKm, setAnnualKm] = useState(15000);
  const [parkingLocation, setParkingLocation] = useState("garage");
  const [claimsHistory, setClaimsHistory] = useState(0);
  const [ncdYears, setNcdYears] = useState(5);
  const [excess, setExcess] = useState(500);
  const [coverageType, setCoverageType] = useState("comprehensive");
  const [result, setResult] = useState<InsuranceCalculation | null>(null);

  const stateRiskFactors: Record<string, number> = {
    nsw: 1.1,
    vic: 1.0,
    qld: 1.05,
    sa: 0.95,
    wa: 1.0,
    tas: 0.85,
    nt: 1.15,
    act: 0.9
  };

  const vehicleTypeFactors: Record<string, number> = {
    sedan: 1.0,
    hatchback: 0.95,
    suv: 1.1,
    ute: 1.15,
    van: 1.2,
    sports: 1.5,
    luxury: 1.4,
    electric: 1.25
  };

  const parkingFactors: Record<string, number> = {
    garage: 0.9,
    carport: 0.95,
    driveway: 1.0,
    street: 1.15
  };

  useEffect(() => {
    calculatePremium();
  }, [state, age, gender, vehicleAge, vehicleValue, vehicleType, annualKm, parkingLocation, claimsHistory, ncdYears, excess, coverageType]);

  const calculatePremium = () => {
    // Base premium calculation (simplified model)
    let basePremium = 800;
    
    // Age adjustments
    let ageAdjustment = 0;
    if (age < 25) {
      ageAdjustment = 300;
      basePremium *= 1.4;
    } else if (age < 30) {
      ageAdjustment = 150;
      basePremium *= 1.2;
    } else if (age > 65) {
      ageAdjustment = 100;
      basePremium *= 1.1;
    }

    // Gender adjustment (where legal)
    if (gender === "male" && age < 25) {
      basePremium *= 1.1;
    }

    // Location/state adjustment
    const locationFactor = stateRiskFactors[state];
    const locationAdjustment = basePremium * (locationFactor - 1);
    basePremium *= locationFactor;

    // Vehicle type and value adjustment
    const vehicleFactor = vehicleTypeFactors[vehicleType];
    const valueImpact = (vehicleValue / 30000) * 0.3 + 0.7; // Scale with value
    const vehicleAdjustment = basePremium * ((vehicleFactor * valueImpact) - 1);
    basePremium *= vehicleFactor * valueImpact;

    // Vehicle age adjustment
    const ageDiscount = Math.min(vehicleAge * 0.03, 0.15); // Up to 15% for older cars
    basePremium *= (1 - ageDiscount);

    // Annual kilometers adjustment
    if (annualKm > 20000) {
      basePremium *= 1.1;
    } else if (annualKm < 10000) {
      basePremium *= 0.95;
    }

    // Parking location
    const parkingFactor = parkingFactors[parkingLocation];
    basePremium *= parkingFactor;

    // Claims history adjustment
    const claimsAdjustment = basePremium * (claimsHistory * 0.25);
    basePremium *= (1 + claimsHistory * 0.25);

    // No Claim Discount (NCD)
    const ncdRate = Math.min(ncdYears * 0.1, 0.65); // Max 65% discount
    const ncdDiscount = basePremium * ncdRate;
    basePremium *= (1 - ncdRate);

    // Excess adjustment
    const excessDiscount = ((excess - 500) / 500) * 0.1 * basePremium;
    if (excess > 500) {
      basePremium *= (1 - ((excess - 500) / 500) * 0.1);
    } else if (excess < 500) {
      basePremium *= (1 + ((500 - excess) / 500) * 0.15);
    }

    // Calculate different coverage types
    const comprehensivePremium = basePremium;
    const thirdPartyProperty = comprehensivePremium * 0.35;
    const thirdPartyFireTheft = comprehensivePremium * 0.55;

    let estimatedAnnualCost = comprehensivePremium;
    if (coverageType === "thirdPartyProperty") {
      estimatedAnnualCost = thirdPartyProperty;
    } else if (coverageType === "thirdPartyFireTheft") {
      estimatedAnnualCost = thirdPartyFireTheft;
    }

    // Calculate potential savings
    const potentialSavings = (comprehensivePremium * 0.25); // Assume 25% potential savings by shopping around

    setResult({
      comprehensivePremium,
      thirdPartyProperty,
      thirdPartyFireTheft,
      basePremium: 800,
      ageAdjustment,
      locationAdjustment,
      vehicleAdjustment,
      claimsAdjustment,
      excessDiscount,
      ncdDiscount,
      estimatedAnnualCost,
      potentialSavings
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <CalculatorLayoutWithAds
      title="Car Insurance Premium Calculator Australia"
      description="Estimate your car insurance premium based on age, vehicle, location, and driving history for Australian drivers"
    >
      <div className="space-y-8">
        <AdsterraSlot position="top" className="mb-6" />

        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white mb-4">
            <Car className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Car Insurance Premium Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get accurate car insurance premium estimates for Australia based on your age, vehicle, location, and driving history
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-2">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Your Details</h2>
              </div>

              <div className="space-y-2">
                <Label>State/Territory</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nsw">New South Wales</SelectItem>
                    <SelectItem value="vic">Victoria</SelectItem>
                    <SelectItem value="qld">Queensland</SelectItem>
                    <SelectItem value="sa">South Australia</SelectItem>
                    <SelectItem value="wa">Western Australia</SelectItem>
                    <SelectItem value="tas">Tasmania</SelectItem>
                    <SelectItem value="nt">Northern Territory</SelectItem>
                    <SelectItem value="act">Australian Capital Territory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Your Age: {age}</Label>
                <Slider
                  value={[age]}
                  onValueChange={(value) => setAge(value[0])}
                  min={18}
                  max={80}
                  step={1}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Vehicle Type</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">Sedan</SelectItem>
                    <SelectItem value="hatchback">Hatchback</SelectItem>
                    <SelectItem value="suv">SUV</SelectItem>
                    <SelectItem value="ute">Ute</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="sports">Sports Car</SelectItem>
                    <SelectItem value="luxury">Luxury Vehicle</SelectItem>
                    <SelectItem value="electric">Electric Vehicle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Vehicle Value</Label>
                <Input
                  type="number"
                  value={vehicleValue}
                  onChange={(e) => setVehicleValue(Number(e.target.value))}
                  min={5000}
                  max={200000}
                  step={5000}
                />
              </div>

              <div className="space-y-2">
                <Label>Vehicle Age: {vehicleAge} years</Label>
                <Slider
                  value={[vehicleAge]}
                  onValueChange={(value) => setVehicleAge(value[0])}
                  min={0}
                  max={20}
                  step={1}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Annual Kilometers</Label>
                <Input
                  type="number"
                  value={annualKm}
                  onChange={(e) => setAnnualKm(Number(e.target.value))}
                  min={1000}
                  max={50000}
                  step={1000}
                />
              </div>

              <div className="space-y-2">
                <Label>Parking Location</Label>
                <Select value={parkingLocation} onValueChange={setParkingLocation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="garage">Locked Garage</SelectItem>
                    <SelectItem value="carport">Carport</SelectItem>
                    <SelectItem value="driveway">Driveway</SelectItem>
                    <SelectItem value="street">Street Parking</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Claims in Last 5 Years: {claimsHistory}</Label>
                <Slider
                  value={[claimsHistory]}
                  onValueChange={(value) => setClaimsHistory(value[0])}
                  min={0}
                  max={5}
                  step={1}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>No Claim Discount Years: {ncdYears}</Label>
                <Slider
                  value={[ncdYears]}
                  onValueChange={(value) => setNcdYears(value[0])}
                  min={0}
                  max={10}
                  step={1}
                  className="py-4"
                />
              </div>

              <div className="space-y-2">
                <Label>Excess Amount</Label>
                <Select value={excess.toString()} onValueChange={(value) => setExcess(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="250">$250</SelectItem>
                    <SelectItem value="500">$500</SelectItem>
                    <SelectItem value="750">$750</SelectItem>
                    <SelectItem value="1000">$1,000</SelectItem>
                    <SelectItem value="1500">$1,500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Premium Estimates</h2>
              </div>

              {result && (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <button
                      onClick={() => setCoverageType("comprehensive")}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        coverageType === "comprehensive"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <div className="font-semibold">Comprehensive</div>
                          <div className="text-xs text-muted-foreground">Full coverage</div>
                        </div>
                        <div className="text-xl font-bold">{formatCurrency(result.comprehensivePremium)}/yr</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCoverageType("thirdPartyFireTheft")}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        coverageType === "thirdPartyFireTheft"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <div className="font-semibold">Third Party Fire & Theft</div>
                          <div className="text-xs text-muted-foreground">Basic protection</div>
                        </div>
                        <div className="text-xl font-bold">{formatCurrency(result.thirdPartyFireTheft)}/yr</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setCoverageType("thirdPartyProperty")}
                      className={`w-full p-4 rounded-xl border-2 transition-all ${
                        coverageType === "thirdPartyProperty"
                          ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950"
                          : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-left">
                          <div className="font-semibold">Third Party Property</div>
                          <div className="text-xs text-muted-foreground">Minimum coverage</div>
                        </div>
                        <div className="text-xl font-bold">{formatCurrency(result.thirdPartyProperty)}/yr</div>
                      </div>
                    </button>
                  </div>

                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <div className="text-sm font-medium mb-2">Estimated Annual Premium</div>
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(result.estimatedAnnualCost)}
                    </div>
                    <div className="text-sm opacity-90">
                      Monthly: {formatCurrency(result.estimatedAnnualCost / 12)}
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-4 h-4 text-amber-600" />
                      <div className="text-sm font-medium">Potential Savings</div>
                    </div>
                    <div className="text-2xl font-bold text-amber-600">
                      {formatCurrency(result.potentialSavings)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      By comparing quotes from multiple insurers
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border">
                    <div className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Premium Breakdown
                    </div>
                    <div className="space-y-2 text-sm">
                      {result.ncdDiscount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">No Claim Discount:</span>
                          <span className="font-medium text-green-600">-{formatCurrency(result.ncdDiscount)}</span>
                        </div>
                      )}
                      {result.excessDiscount !== 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Excess Adjustment:</span>
                          <span className={`font-medium ${result.excessDiscount > 0 ? "text-green-600" : "text-red-600"}`}>
                            {result.excessDiscount > 0 ? "-" : "+"}{formatCurrency(Math.abs(result.excessDiscount))}
                          </span>
                        </div>
                      )}
                      {result.claimsAdjustment > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Claims History:</span>
                          <span className="font-medium text-red-600">+{formatCurrency(result.claimsAdjustment)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {ncdYears >= 5 && (
                    <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-4 h-4 text-purple-600" />
                        <div className="text-sm font-medium">Great Driver!</div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Your {ncdYears} years claim-free driving has earned you a {Math.min(ncdYears * 10, 65)}% discount
                      </div>
                    </div>
                  )}

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">
                        This is an estimate only. Actual premiums vary by insurer and individual circumstances. Always compare quotes from multiple providers for the best rate.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ExportShareButtons
                calculatorType="car-insurance"
                inputs={{ coverageType }}
                results={result || {}}
                title="Car Insurance Premium Estimate"
              />
            </div>
          </div>
        </Card>

        <AdsterraSlot position="middle" className="my-6" />

        {/* AI Analysis Section */}
        {result && (
          <EnhancedAIAnalysis
            calculatorType="car-insurance"
            data={{
              age,
              vehicleType,
              vehicleValue,
              vehicleAge,
              state,
              estimatedPremium: result.estimatedAnnualCost,
              estimatedAnnualCost: result.estimatedAnnualCost,
              coverageType,
              ncdYears,
              claimsHistory,
              parkingLocation,
              annualKm,
              excess,
              potentialSavings: result.potentialSavings
            }}
          />
        )}

        <AdsterraSlot position="middle" className="my-6" />

        {/* Educational Content Part 1 */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-blue-600" />
            Understanding Car Insurance in Australia
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Car insurance is a critical financial protection for Australian drivers, yet many people don't fully understand how premiums are calculated or how to get the best value for their coverage. Whether you're a new driver purchasing your first policy or a seasoned motorist looking to reduce costs, understanding the factors that influence insurance premiums can save you hundreds or even thousands of dollars annually.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Types of Car Insurance Coverage</h3>
          <p className="mb-4">
            Australian car insurance comes in three main types, each offering different levels of protection and corresponding premium costs. Understanding these options is essential for choosing the right coverage for your situation and budget.
          </p>

          <p className="mb-4">
            Comprehensive insurance provides the most complete protection, covering damage to your vehicle regardless of fault, as well as theft, fire, vandalism, and weather damage. It also covers damage you cause to other vehicles and property. While comprehensive insurance has the highest premiums, it offers peace of mind and financial protection in almost any scenario. This coverage is typically required if you have a car loan or lease.
          </p>

          <p className="mb-4">
            Third party property damage insurance is the minimum legal requirement in most Australian states. It covers damage you cause to other people's vehicles and property but doesn't cover your own vehicle. This option has the lowest premiums but leaves you financially exposed if your car is damaged or stolen. It's most suitable for older vehicles with low market value where the cost of comprehensive coverage exceeds the vehicle's worth.
          </p>

          <p className="mb-4">
            Third party fire and theft insurance sits between comprehensive and basic third party coverage. It covers damage to other vehicles and property, plus damage to your vehicle from fire or theft. This option provides more protection than basic third party at a moderate additional cost, making it popular for vehicles that are valuable enough to warrant theft protection but not expensive enough to justify comprehensive coverage.
          </p>

          {/* Ad Slot - Mid Educational Content */}
          <div className="not-prose my-8">
            <AutoAdSlot placement="mid-content" className="mx-auto" />
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4">How Insurance Premiums Are Calculated</h3>
          <p className="mb-4">
            Insurance companies use sophisticated actuarial models to assess risk and determine premiums. While the exact formulas vary between insurers, several key factors consistently influence your insurance costs. Understanding these factors helps you make informed decisions about reducing your premiums.
          </p>

          <p className="mb-4">
            Age is one of the most significant premium factors. Drivers under 25 face substantially higher premiums due to statistical evidence showing higher accident rates in this age group. Young male drivers typically pay the highest premiums, sometimes 50-100% more than drivers in their 30s and 40s. Premiums generally decrease as you gain experience, with the lowest rates typically occurring between ages 30-60. After 65, premiums may increase slightly as reflexes and vision decline.
          </p>

          <p className="mb-4">
            Your vehicle's make, model, and value significantly impact premiums. Sports cars, luxury vehicles, and high-performance models attract higher premiums due to increased theft risk, expensive repair costs, and statistical correlation with higher claim rates. Conversely, family sedans and vehicles with strong safety ratings often receive lower premiums. Electric vehicles may face higher premiums due to expensive battery replacement costs and limited repair networks.
          </p>

          <p className="mb-4">
            Geographic location affects premiums substantially. Urban areas typically have higher rates due to increased accident frequency, theft rates, and vandalism. Specific suburbs within cities can vary significantly—areas with high crime rates or accident statistics will have higher premiums. Regional and rural areas generally enjoy lower premiums, though this can be offset by factors like limited repair facilities and wildlife collision risks.
          </p>

          <p className="mb-4">
            Your claims history is crucial to premium calculations. Even a single claim can increase your premiums for several years. Multiple claims can result in dramatic premium increases or even make it difficult to obtain coverage. Conversely, maintaining a claim-free record earns you a No Claim Discount (NCD) or No Claim Bonus, which can reduce premiums by up to 65% depending on how many consecutive claim-free years you've accumulated.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">The No Claim Discount Explained</h3>
          <p className="mb-4">
            The No Claim Discount (NCD) is one of the most valuable benefits available to Australian drivers. It rewards claim-free driving with substantial premium reductions that grow each year you don't make a claim. Understanding how NCDs work helps you maximize this valuable discount.
          </p>

          <p className="mb-4">
            Most insurers offer NCD scales that increase your discount by 10% per claim-free year, typically capping at 60-65% after six or seven years. For example, after one year without claims, you might receive a 10% discount. After two years, 20%, and so on. Once you reach the maximum discount, maintaining it requires continued claim-free driving.
          </p>

          <p className="mb-4">
            Making a claim typically resets your NCD to zero or reduces it significantly, depending on the insurer's policy. However, many insurers now offer NCD protection as an add-on feature. For an additional premium, you can make one or two claims without losing your NCD. This protection is particularly valuable if you have a high NCD percentage that would be costly to rebuild.
          </p>

          <p className="mb-4">
            When switching insurers, your NCD usually transfers, but you'll need to provide proof from your previous insurer. Some insurers have partnerships allowing automatic NCD transfer, while others require you to request a letter confirming your claim-free history. Don't assume your NCD will transfer automatically—always confirm this when getting quotes.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Understanding Excess and How It Affects Premiums</h3>
          <p className="mb-4">
            The excess (or deductible) is the amount you pay when making a claim before insurance coverage applies. Choosing the right excess involves balancing lower premiums against potential out-of-pocket costs if you need to claim.
          </p>

          <p className="mb-4">
            Standard excess amounts range from $250 to $1,500, with $500-$750 being most common. Choosing a higher excess reduces your premiums because you're assuming more financial risk. For example, increasing your excess from $500 to $1,000 might reduce your annual premium by 10-15%. However, this means paying an additional $500 if you need to claim.
          </p>

          <p className="mb-4">
            In addition to your chosen excess, insurers may apply additional excess amounts based on risk factors. Age excess applies to drivers under 25, typically adding $400-$1,000 to claims. Inexperienced driver excess may apply to those who've held their license for less than two years. Some policies include excess for drivers not listed on the policy or those with suspended licenses.
          </p>

          <p className="mb-4">
            When deciding on excess amounts, consider your emergency savings and risk tolerance. If you have substantial savings and drive carefully, a higher excess can save money on premiums. However, if you'd struggle to pay a $1,000-$1,500 excess in an emergency, choosing a lower excess provides financial security despite higher premiums.
          </p>
        </div>

        {/* Ad Slot - Between Content Sections */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* Educational Content Part 2 */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-600" />
            Reducing Your Insurance Costs
          </h2>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Effective Strategies to Lower Premiums</h3>
          <p className="mb-4">
            While some premium factors like age and location are beyond your control, numerous strategies can significantly reduce your insurance costs. Implementing multiple approaches can lead to substantial savings without compromising necessary coverage.
          </p>

          <p className="mb-4">
            Installing security devices can reduce premiums by 5-15%. Approved car alarms, immobilizers, GPS tracking devices, and steering wheel locks all demonstrate reduced theft risk to insurers. Many modern vehicles have factory-installed security features that qualify for discounts—ensure you inform your insurer about all security equipment in your vehicle.
          </p>

          <p className="mb-4">
            Parking location significantly affects premiums. Vehicles parked in locked garages attract the lowest premiums, while street parking results in the highest. If you have access to secure parking but haven't told your insurer, updating this information could immediately reduce your premium. Even upgrading from street parking to a carport or driveway can provide meaningful savings.
          </p>

          <p className="mb-4">
            Reducing annual kilometers driven can lower premiums. Many insurers offer low-mileage discounts for drivers who travel less than 10,000-12,000 kilometers annually. If you work from home, use public transport, or have reduced your driving for any reason, inform your insurer. Some companies now offer usage-based insurance where premiums are directly tied to kilometers driven, monitored through smartphone apps or vehicle telematics.
          </p>

          <p className="mb-4">
            Bundling insurance policies with a single provider often yields multi-policy discounts of 10-25%. If you have home insurance, contents insurance, or multiple vehicles, combining them with one insurer can significantly reduce total insurance costs. However, always compare the bundled price against separate policies from different providers to ensure you're actually saving money.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">The Importance of Comparing Quotes</h3>
          <p className="mb-4">
            One of the most effective ways to reduce insurance costs is simply shopping around. Premium variations between insurers for identical coverage can range from 20-40% or more, meaning you could save hundreds of dollars by comparing quotes annually.
          </p>

          <p className="mb-4">
            Insurance companies regularly adjust their pricing strategies, targeting different customer segments at different times. An insurer offering competitive rates one year might increase prices significantly the next, while competitors lower their rates to attract customers. This dynamic means your cheapest option changes regularly, making annual comparison essential.
          </p>

          <p className="mb-4">
            When comparing quotes, ensure you're comparing identical coverage levels, excess amounts, and policy features. A cheaper policy might exclude coverage included in a more expensive one, such as rental car coverage, windscreen protection, or coverage for modifications. Read policy documents carefully and create a comparison spreadsheet noting all coverage differences.
          </p>

          <p className="mb-4">
            Don't ignore smaller or online-only insurers when comparing quotes. While major brands have name recognition and established reputations, smaller insurers often offer competitive rates and excellent service. Check insurer financial strength ratings and customer reviews to ensure reliability, but don't automatically dismiss unfamiliar companies.
          </p>

          {/* Ad Slot - Mid Educational Content 2 */}
          <div className="not-prose my-8">
            <AutoAdSlot placement="mid-content" className="mx-auto" />
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4">When to Make a Claim vs. Pay Out of Pocket</h3>
          <p className="mb-4">
            Deciding whether to make an insurance claim or pay for repairs yourself is a crucial decision that significantly impacts your long-term insurance costs. Making unnecessary claims can cost you far more in increased premiums than paying for minor repairs yourself.
          </p>

          <p className="mb-4">
            Consider the claim's value relative to your excess and potential premium increases. If repair costs are only slightly higher than your excess, paying yourself may be wiser. For example, if repairs cost $800 and your excess is $500, you'd only receive $300 from insurance. However, making this claim could increase your premiums by several hundred dollars annually for the next 3-5 years and reset your NCD.
          </p>

          <p className="mb-4">
            Small claims (under $1,000-$1,500) often aren't financially worthwhile when considering long-term premium impacts. A single claim can increase premiums by 20-40% annually for several years. If your premium is $1,000 per year, a 30% increase costs you an extra $300 annually. Over five years, that's $1,500 in additional premiums for a small claim that might have cost $800 to pay yourself.
          </p>

          <p className="mb-4">
            Reserve insurance claims for significant damage where repair costs substantially exceed your excess and where paying yourself would create financial hardship. Claims for major accidents, total vehicle loss, or damage exceeding several thousand dollars are exactly what insurance is designed to cover. Don't hesitate to claim for these situations—that's why you pay premiums.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Understanding Policy Exclusions and Limitations</h3>
          <p className="mb-4">
            Every insurance policy contains exclusions and limitations that could affect your coverage when you need it most. Understanding these before you buy prevents unpleasant surprises when making claims.
          </p>

          <p className="mb-4">
            Common exclusions include damage occurring while driving under the influence of alcohol or drugs, intentional damage, wear and tear, mechanical failures, and damage from driving on unsealed roads (unless specifically covered). Some policies exclude coverage if your vehicle is used for business purposes, ride-sharing, or courier work without disclosure.
          </p>

          <p className="mb-4">
            Market value limitations affect how much you'll receive for total loss claims. Insurers typically pay your vehicle's market value at the time of loss, which may be less than you paid or what you owe on a loan. New car replacement coverage (available on vehicles less than 1-2 years old) provides a new car if yours is totaled, but read the conditions carefully—some policies have mileage limits or other restrictions.
          </p>

          <p className="mb-4">
            Agreed value versus market value policies handle claims differently. Agreed value policies pay a pre-agreed amount regardless of depreciation, providing certainty about claim payouts. Market value policies pay what your vehicle is worth at claim time, which can be disputed. Agreed value policies typically cost more but provide greater certainty for owners of unique, modified, or collectable vehicles.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Special Considerations for Different Driver Groups</h3>
          <p className="mb-4">
            Different driver demographics face unique insurance challenges and opportunities. Understanding your specific situation helps you optimize coverage and costs.
          </p>

          <p className="mb-4">
            Young drivers face the highest premiums but have options to reduce costs. Choosing a lower-performance vehicle significantly reduces premiums. Remaining on parents' policies as named drivers (where permitted) is often cheaper than separate policies. Some insurers offer young driver programs with telematics monitoring—safe driving earns discounts, though privacy and driving freedom trade-offs exist.
          </p>

          <p className="mb-4">
            Senior drivers may see premium increases after 65-70 as insurers account for age-related factors. However, mature driver discounts, reduced annual kilometers, and excellent claim histories often offset these increases. If premiums rise significantly, don't assume all insurers will increase rates equally—shop around specifically among insurers targeting mature drivers.
          </p>

          <p className="mb-4">
            High-performance and luxury vehicle owners face premium challenges due to expensive repairs and higher theft risk. Specialist insurers focusing on prestige vehicles often provide better coverage and rates than mainstream insurers. Agreed value coverage is particularly important for these vehicles to avoid market value disputes. Consider higher excess amounts to reduce premiums if you have the financial capacity.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">The Claims Process: What to Expect</h3>
          <p className="mb-4">
            Understanding the claims process before you need it reduces stress and ensures smoother resolution when accidents occur. Knowing your responsibilities and insurer's obligations helps you navigate claims effectively.
          </p>

          <p className="mb-4">
            Immediately after an accident, prioritize safety and legal obligations. Call emergency services if anyone is injured. Exchange details with other parties including names, addresses, phone numbers, license plate numbers, and insurance information. Take photographs of damage, road conditions, and accident scene. Don't admit fault or make statements about the accident—factual information only.
          </p>

          <p className="mb-4">
            Contact your insurer as soon as possible, ideally within 24-48 hours. Most insurers have 24/7 claims lines. Provide accurate information about the accident, but again, stick to facts without admitting fault. Your insurer will guide you through their specific claims process, which typically involves completing claim forms, providing photographs, and possibly having your vehicle assessed.
          </p>

          <p className="mb-4">
            The assessment and repair process varies by insurer and claim type. Some insurers have preferred repair networks offering guaranteed repairs and direct billing. Others allow you to choose your repairer, though you may need to obtain quotes and handle payment before reimbursement. Ask about rental car coverage during repairs—some policies include this, others charge extra.
          </p>

          <p className="mb-4">
            If your claim is denied or you disagree with the settlement amount, you have options. Request a detailed explanation in writing. Gather additional evidence supporting your position. Many insurers have internal dispute resolution processes. If unresolved, you can escalate to the Australian Financial Complaints Authority (AFCA), which provides free, independent dispute resolution for financial services including insurance.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Future Trends in Australian Car Insurance</h3>
          <p className="mb-4">
            The Australian car insurance market is evolving rapidly with technological advances and changing mobility patterns. Understanding emerging trends helps you make informed long-term decisions about coverage.
          </p>

          <p className="mb-4">
            Telematics and usage-based insurance are growing in popularity. These programs use smartphone apps or vehicle devices to monitor driving behavior—acceleration, braking, cornering, speed, and time of day. Safe drivers receive discounts or cashback, while risky drivers pay more. Privacy-conscious consumers may resist this monitoring, but potential savings of 20-30% attract many drivers, particularly young people facing high premiums.
          </p>

          <p className="mb-4">
            Electric and autonomous vehicles are reshaping insurance. EVs currently face higher premiums due to expensive battery repairs and limited repairer networks, but this is changing as EV technology matures. Autonomous vehicle insurance will likely shift from individual driver coverage to manufacturer liability, fundamentally changing the insurance landscape in coming decades.
          </p>

          <p className="mb-4">
            Climate change impacts are increasingly affecting insurance. More frequent severe weather events—floods, storms, bushfires—lead to higher claims and potentially higher premiums, particularly in affected areas. Some insurers are adjusting coverage for climate-related damage or increasing premiums in high-risk regions. Consider climate risks when choosing where to live and vehicle type.
          </p>

          <p className="mb-6">
            Subscription and pay-per-drive insurance models are emerging, offering flexibility for occasional drivers. Instead of annual policies, you might pay only for months you need coverage or even per trip. These models suit people with multiple vehicles, seasonal usage, or those reducing car dependency. While currently niche, these could become mainstream as mobility patterns change.
          </p>
        </div>

        {/* Ad Slot - End of Content */}
        <AutoAdSlot placement="in-feed" className="my-8" />

      </div>
    </CalculatorLayoutWithAds>
  );
}
