import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Calculator, Sun, TrendingUp, Zap, DollarSign, Leaf, Home } from "lucide-react";
import { CalculatorLayoutWithAds } from "../../../components/CalculatorLayoutWithAds";
import EnhancedAIAnalysis from "@/components/EnhancedAIAnalysis";
import ExportShareButtons from "@/components/ExportShareButtons";
import { AutoAdSlot } from "@/components/ads/AutoAdSlot";
import { ADS_CONFIG } from "@/config/ads";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface SolarCalculation {
  systemSize: number;
  annualGeneration: number;
  annualSelfConsumption: number;
  annualExport: number;
  annualSavings: number;
  feedInEarnings: number;
  totalAnnualBenefit: number;
  systemCost: number;
  afterRebates: number;
  paybackPeriod: number;
  savings25Years: number;
  roi: number;
  co2Offset: number;
  treesEquivalent: number;
}

export default function SolarSavingsCalculator() {
  const [state, setState] = useState("nsw");
  const [systemSize, setSystemSize] = useState(6.6);
  const [dailyUsage, setDailyUsage] = useState(20);
  const [electricityRate, setElectricityRate] = useState(0.30);
  const [feedInTariff, setFeedInTariff] = useState(0.10);
  const [roofOrientation, setRoofOrientation] = useState("north");
  const [shading, setShading] = useState(0);
  const [result, setResult] = useState<SolarCalculation | null>(null);

  const stateData: Record<string, { 
    name: string; 
    sunHours: number; 
    rebate: number;
    installCost: number;
  }> = {
    nsw: { name: "New South Wales", sunHours: 4.5, rebate: 1850, installCost: 1100 },
    vic: { name: "Victoria", sunHours: 4.2, rebate: 2200, installCost: 1000 },
    qld: { name: "Queensland", sunHours: 5.2, rebate: 1650, installCost: 950 },
    sa: { name: "South Australia", sunHours: 4.8, rebate: 1800, installCost: 1050 },
    wa: { name: "Western Australia", sunHours: 5.5, rebate: 1600, installCost: 1100 },
    tas: { name: "Tasmania", sunHours: 3.9, rebate: 1900, installCost: 1200 },
    nt: { name: "Northern Territory", sunHours: 5.8, rebate: 1500, installCost: 1300 },
    act: { name: "Australian Capital Territory", sunHours: 4.4, rebate: 2000, installCost: 1050 }
  };

  const orientationFactors: Record<string, number> = {
    north: 1.0,
    northeast: 0.95,
    northwest: 0.95,
    east: 0.85,
    west: 0.85,
    southeast: 0.75,
    southwest: 0.75,
    south: 0.6
  };

  useEffect(() => {
    calculateSavings();
  }, [state, systemSize, dailyUsage, electricityRate, feedInTariff, roofOrientation, shading]);

  useEffect(() => {
    // Trigger AdSense auto ads for this premium calculator
    if (typeof window !== 'undefined' && ADS_CONFIG.AUTO_ADS.ENABLED) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense error:', e);
      }
    }
  }, []);

  const calculateSavings = () => {
    const stateInfo = stateData[state];
    const orientationFactor = orientationFactors[roofOrientation];
    const shadingFactor = 1 - (shading / 100);
    
    // Calculate annual generation (kWh)
    const effectiveSunHours = stateInfo.sunHours * orientationFactor * shadingFactor;
    const annualGeneration = systemSize * effectiveSunHours * 365;
    
    // Calculate self-consumption (typically 30-40% for residential)
    const selfConsumptionRate = 0.35;
    const annualSelfConsumption = annualGeneration * selfConsumptionRate;
    const annualExport = annualGeneration - annualSelfConsumption;
    
    // Calculate savings
    const annualSavings = annualSelfConsumption * electricityRate;
    const feedInEarnings = annualExport * feedInTariff;
    const totalAnnualBenefit = annualSavings + feedInEarnings;
    
    // Calculate costs (approximately $1,000-1,200 per kW installed in Australia)
    const systemCost = systemSize * stateInfo.installCost;
    const afterRebates = systemCost - stateInfo.rebate;
    
    // Calculate payback period
    const paybackPeriod = afterRebates / totalAnnualBenefit;
    
    // Calculate 25-year savings (accounting for 0.5% annual degradation)
    let savings25Years = 0;
    for (let year = 1; year <= 25; year++) {
      const degradation = Math.pow(0.995, year - 1);
      savings25Years += totalAnnualBenefit * degradation;
    }
    savings25Years -= afterRebates;
    
    // Calculate ROI
    const roi = (savings25Years / afterRebates) * 100;
    
    // Environmental impact
    const co2Offset = annualGeneration * 0.82; // kg CO2 per kWh in Australia
    const treesEquivalent = co2Offset / 21.77; // One tree absorbs ~21.77 kg CO2/year
    
    setResult({
      systemSize,
      annualGeneration,
      annualSelfConsumption,
      annualExport,
      annualSavings,
      feedInEarnings,
      totalAnnualBenefit,
      systemCost,
      afterRebates,
      paybackPeriod,
      savings25Years,
      roi,
      co2Offset,
      treesEquivalent
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

  const formatNumber = (value: number, decimals: number = 0) => {
    return value.toLocaleString("en-AU", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };

  return (
    <CalculatorLayoutWithAds
      title="Solar Savings Calculator Australia"
      description="Calculate your solar panel ROI, payback period, and lifetime savings for Australian homes with accurate state-based rebates and feed-in tariffs"
    >
      <div className="space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 text-white mb-4">
            <Sun className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
            Solar Savings Calculator Australia
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your solar panel investment return, payback period, and lifetime savings with accurate Australian state rebates and feed-in tariffs
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="p-8 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-900 dark:to-yellow-950 border-2">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-yellow-600" />
                <h2 className="text-xl font-semibold">System Details</h2>
              </div>

              <div className="space-y-2">
                <Label>State/Territory</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(stateData).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>System Size: {systemSize} kW</Label>
                <Slider
                  value={[systemSize]}
                  onValueChange={(value) => setSystemSize(value[0])}
                  min={3}
                  max={13.2}
                  step={0.33}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  Typical residential systems: 6.6kW - 10kW
                </p>
              </div>

              <div className="space-y-2">
                <Label>Daily Electricity Usage (kWh)</Label>
                <Input
                  type="number"
                  value={dailyUsage}
                  onChange={(e) => setDailyUsage(Number(e.target.value))}
                  min={5}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Electricity Rate ($/kWh)</Label>
                <Input
                  type="number"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(Number(e.target.value))}
                  min={0.15}
                  max={0.60}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label>Feed-in Tariff ($/kWh)</Label>
                <Input
                  type="number"
                  value={feedInTariff}
                  onChange={(e) => setFeedInTariff(Number(e.target.value))}
                  min={0.03}
                  max={0.20}
                  step={0.01}
                />
              </div>

              <div className="space-y-2">
                <Label>Roof Orientation</Label>
                <Select value={roofOrientation} onValueChange={setRoofOrientation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="north">North (Best)</SelectItem>
                    <SelectItem value="northeast">North-East</SelectItem>
                    <SelectItem value="northwest">North-West</SelectItem>
                    <SelectItem value="east">East</SelectItem>
                    <SelectItem value="west">West</SelectItem>
                    <SelectItem value="southeast">South-East</SelectItem>
                    <SelectItem value="southwest">South-West</SelectItem>
                    <SelectItem value="south">South (Worst)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Shading Impact: {shading}%</Label>
                <Slider
                  value={[shading]}
                  onValueChange={(value) => setShading(value[0])}
                  min={0}
                  max={50}
                  step={5}
                  className="py-4"
                />
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Your Savings</h2>
              </div>

              {result && (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <div className="text-sm font-medium mb-2">25-Year Net Savings</div>
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(result.savings25Years)}
                    </div>
                    <div className="text-sm opacity-90">
                      {result.roi.toFixed(0)}% ROI over 25 years
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                      <div className="text-xs text-muted-foreground mb-1">Annual Benefit</div>
                      <div className="text-lg font-semibold">{formatCurrency(result.totalAnnualBenefit)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <div className="text-xs text-muted-foreground mb-1">Payback Period</div>
                      <div className="text-lg font-semibold">{result.paybackPeriod.toFixed(1)} years</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">System Cost:</span>
                        <span className="font-medium">{formatCurrency(result.systemCost)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">State Rebate:</span>
                        <span className="font-medium text-green-600">-{formatCurrency(result.systemCost - result.afterRebates)}</span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex justify-between">
                        <span className="font-medium">Net Cost:</span>
                        <span className="font-bold">{formatCurrency(result.afterRebates)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                    <div className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Annual Generation Breakdown
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Generated:</span>
                        <span className="font-medium">{formatNumber(result.annualGeneration, 0)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Self-Consumed:</span>
                        <span className="font-medium">{formatNumber(result.annualSelfConsumption, 0)} kWh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exported to Grid:</span>
                        <span className="font-medium">{formatNumber(result.annualExport, 0)} kWh</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <div className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Leaf className="w-4 h-4" />
                      Environmental Impact
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Annual CO₂ Offset:</span>
                        <span className="font-medium">{formatNumber(result.co2Offset, 0)} kg</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Equivalent to:</span>
                        <span className="font-medium">{formatNumber(result.treesEquivalent, 0)} trees planted</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ExportShareButtons
                calculatorType="solar-savings"
                inputs={{ state }}
                results={result || {}}
                title="Solar Savings Analysis"
              />
            </div>
          </div>
        </Card>

        {/* Ad Slot - After Calculator */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* AI Analysis Section */}
        {result && (
          <EnhancedAIAnalysis
            calculatorType="solar-savings"
            data={{
              monthlyBill: dailyUsage * 30 * electricityRate,
              state,
              systemSize: result.systemSize,
              electricityRate,
              installationCost: result.afterRebates,
              annualSavings: result.totalAnnualBenefit,
              paybackYears: result.paybackPeriod,
              totalSavings25Years: result.savings25Years,
              co2ReductionTons: result.co2Offset / 1000
            }}
          />
        )}

        {/* Ad Slot - After AI Analysis */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* Educational Content Part 1 */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Sun className="w-8 h-8 text-yellow-600" />
            Complete Guide to Solar Power in Australia
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Australia is one of the sunniest countries on Earth, making it ideal for solar power generation. With rising electricity costs and generous government incentives, solar panels have become an increasingly attractive investment for Australian homeowners. This comprehensive guide will help you understand everything you need to know about going solar in Australia.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Why Solar Power Makes Sense in Australia</h3>
          <p className="mb-4">
            Australia's abundant sunshine provides exceptional conditions for solar power generation. Most Australian capital cities receive between 4 and 6 peak sun hours per day on average, with some regions receiving even more. This means a typical 6.6kW solar system can generate 24-30 kWh of electricity per day, enough to power an average Australian home and often with excess to export to the grid.
          </p>

          <p className="mb-4">
            The economic case for solar has never been stronger. Electricity prices in Australia have increased by over 120% in the last decade, with no signs of slowing down. Meanwhile, the cost of solar panels has dropped by approximately 80% since 2010, making the payback period for solar systems shorter than ever before. Most residential solar systems in Australia now pay for themselves in 3-6 years.
          </p>

          <p className="mb-4">
            Beyond the financial benefits, solar power provides energy independence and protection against future electricity price increases. Once your system is paid off, you're essentially generating free electricity for the remaining 15-20+ years of the panels' lifespan. This can result in tens of thousands of dollars in savings over the system's lifetime.
          </p>

          {/* Ad Slot - Mid Educational Content */}
          <div className="not-prose my-8">
            <AutoAdSlot placement="mid-content" className="mx-auto" />
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Understanding System Sizes and Generation</h3>
          <p className="mb-4">
            Solar systems in Australia are typically sized in kilowatts (kW), referring to the system's maximum power output under ideal conditions. The most common residential system sizes are 6.6kW, 8kW, 10kW, and 13.2kW. Choosing the right size depends on your electricity consumption, available roof space, and budget.
          </p>

          <p className="mb-4">
            A 6.6kW system has become the most popular choice for Australian homes. This size is perfectly matched to the maximum size inverter (5kW) allowed for single-phase connections under most feed-in tariff schemes. A 6.6kW system typically consists of 15-20 solar panels (depending on panel wattage) and requires approximately 35-40 square meters of roof space.
          </p>

          <p className="mb-4">
            To estimate how much electricity your system will generate, you need to consider your location's peak sun hours. Queensland and Western Australia typically receive 5-5.5+ peak sun hours, while Tasmania receives around 3.9. The orientation and tilt of your roof also significantly impact generation, with north-facing roofs being optimal in Australia.
          </p>

          <p className="mb-4">
            Your solar panels won't always operate at their rated capacity. Panel efficiency is affected by temperature (they actually produce slightly less in extreme heat), shading from trees or buildings, and natural degradation over time. Quality panels degrade at approximately 0.5% per year, meaning they'll still produce around 87-90% of their original capacity after 25 years.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">State-by-State Rebates and Incentives</h3>
          <p className="mb-4">
            The Australian Government offers the Small-scale Renewable Energy Scheme (SRES), which provides Small-scale Technology Certificates (STCs) to eligible solar installations. These certificates can be traded and essentially function as an upfront discount on your system cost. The number of STCs you receive depends on your system size and location, with the rebate typically worth $1,500-$2,500 for a 6.6kW system.
          </p>

          <p className="mb-4">
            In addition to federal incentives, several states offer their own rebate programs. Victoria provides the Solar Homes Program, offering rebates of up to $1,400 plus interest-free loans for eligible households. South Australia offers subsidies and battery incentives through their Home Battery Scheme. New South Wales has offered various programs including the Empowering Homes program for battery installations.
          </p>

          <p className="mb-4">
            These state programs often have eligibility requirements based on property value, household income, or whether you're a first-time solar adopter. They also have limited funding and may have waiting lists, so it's important to check current availability and requirements for your state.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Feed-in Tariffs Explained</h3>
          <p className="mb-4">
            Feed-in tariffs (FiT) are payments you receive for excess solar electricity exported to the grid. When your solar panels generate more electricity than your home is using, that surplus is fed back into the grid, and your electricity retailer pays you for it. Feed-in tariff rates vary significantly between states and retailers, typically ranging from 3 to 12 cents per kWh.
          </p>

          <p className="mb-4">
            It's important to understand that feed-in tariffs are generally much lower than the rate you pay for electricity from the grid (which is typically 25-35 cents per kWh). This creates a strong financial incentive to maximize self-consumption—using your solar power directly rather than exporting it. The more of your solar generation you can use in your home, the better your financial return.
          </p>

          <p className="mb-4">
            To maximize self-consumption, consider running high-energy appliances like dishwashers, washing machines, and pool pumps during the day when your solar system is generating. Smart home energy management systems can automate this process, ensuring you use solar power optimally throughout the day.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Installation Costs and What's Included</h3>
          <p className="mb-4">
            The cost of solar installations in Australia has decreased dramatically in recent years. As of 2024, you can expect to pay approximately $900-$1,200 per kilowatt installed for a quality system, meaning a 6.6kW system typically costs $6,000-$8,000 before rebates. After STCs and any state rebates, your out-of-pocket cost might be as low as $3,500-$5,500.
          </p>

          <p className="mb-4">
            This price should include everything needed for a complete, functioning system: solar panels, inverter, mounting hardware, electrical work, connection to the grid, and necessary approvals and paperwork. Reputable installers will handle all the bureaucracy, including applying for STCs and arranging grid connection approval.
          </p>

          <p className="mb-4">
            Be wary of extremely low-priced quotes, as they often involve inferior components or cut corners on installation quality. The cheapest system is rarely the best value over its lifetime. Quality panels from manufacturers like LG, SunPower, or REC, paired with reliable inverters from Fronius, SMA, or Enphase, will provide better performance and longevity.
          </p>

          <p className="mb-4">
            When comparing quotes, ensure you're comparing like with like. Check panel efficiency ratings, inverter warranties, installer certifications (Clean Energy Council accreditation is essential), and what's included in the warranty. A good warranty should cover panels for at least 25 years, inverters for 5-10 years, and workmanship for 5-10 years.
          </p>
        </div>

        {/* Ad Slot - Between Content Sections */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* Educational Content Part 2 */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Home className="w-8 h-8 text-orange-600" />
            Maximizing Your Solar Investment
          </h2>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Roof Suitability and Orientation</h3>
          <p className="mb-4">
            In Australia, north-facing roofs receive the most direct sunlight and are ideal for solar panels. However, east and west-facing roofs can still be highly productive, typically generating 85-95% of what a north-facing roof would produce. Even south-facing roofs can work for solar, though they'll generate approximately 60-70% of optimal output.
          </p>

          <p className="mb-4">
            The ideal roof pitch for solar panels in Australia varies by latitude but generally falls between 20 and 35 degrees. Fortunately, most Australian homes have roof pitches within this range. Flat roofs can also accommodate solar panels using tilt frames, though this adds to installation costs.
          </p>

          <p className="mb-4">
            Shading is one of the most critical factors affecting solar performance. Even partial shading from trees, chimneys, or neighboring buildings can significantly reduce system output. Before installation, a reputable installer should conduct a shade analysis to identify and minimize shading impacts. In some cases, tree trimming or strategic panel placement can overcome shading issues.
          </p>

          <p className="mb-4">
            Your roof's condition matters too. Solar panels last 25+ years, so your roof should be in good condition before installation. If your roof needs replacement within the next 5-10 years, consider doing it before installing solar to avoid the cost of removing and reinstalling panels later.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Inverter Technologies and Options</h3>
          <p className="mb-4">
            The inverter is the brain of your solar system, converting the DC electricity generated by your panels into AC electricity usable in your home. There are three main types of inverters to consider: string inverters, microinverters, and power optimizers.
          </p>

          <p className="mb-4">
            String inverters are the most common and cost-effective option. All panels connect in series (a "string") to a single central inverter. They work well for roofs without shading issues and where all panels face the same direction. However, the entire string performs only as well as the weakest panel, so shading or a dirty panel can impact the whole system.
          </p>

          <p className="mb-4">
            Microinverters attach to each individual panel, allowing each to operate independently. This is ideal for complex roofs with multiple orientations or shading issues. If one panel is shaded or malfunctioning, it doesn't affect the others. Microinverters are more expensive but can provide better overall performance in challenging installations.
          </p>

          <p className="mb-4">
            Power optimizers are a middle ground, combining features of both technologies. They attach to each panel like microinverters but work in conjunction with a central inverter. This provides much of the panel-level optimization of microinverters while keeping costs closer to traditional string inverters.
          </p>

          {/* Ad Slot - Mid Educational Content 2 */}
          <div className="not-prose my-8">
            <AutoAdSlot placement="mid-content" className="mx-auto" />
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Battery Storage Considerations</h3>
          <p className="mb-4">
            Solar batteries allow you to store excess solar generation for use at night or during peak pricing periods. While batteries are becoming more popular, they're not financially necessary for most households. The payback period for batteries alone is typically 10-15 years, compared to 3-6 years for solar panels without storage.
          </p>

          <p className="mb-4">
            However, batteries make sense in several scenarios. If you're on a time-of-use tariff with high peak rates, storing solar energy for use during expensive evening periods can provide significant savings. If you experience frequent blackouts, a battery with backup capability provides energy security. Some people also value the energy independence and environmental benefits of battery storage, even if the financial case is marginal.
          </p>

          <p className="mb-4">
            Battery costs have been falling but remain substantial. A typical 10-13.5kWh home battery system costs $8,000-$15,000 installed, though state rebates can reduce this significantly. Battery technology is also evolving rapidly, so unless you have a specific need now, it might be worth installing solar panels first and adding a battery in a few years when prices drop further.
          </p>

          <p className="mb-4">
            If you think you might add a battery later, ensure your initial solar installation is battery-ready. This means installing a hybrid inverter (which can work with batteries) rather than a standard string inverter, or choosing a system that can be easily retrofitted with battery storage.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Monitoring and Maintenance</h3>
          <p className="mb-4">
            Modern solar systems come with monitoring apps that show real-time generation, consumption, and export data. This visibility is valuable for understanding your energy usage patterns and ensuring your system is performing as expected. Most monitoring systems will alert you to any problems or underperformance.
          </p>

          <p className="mb-4">
            Solar panels require minimal maintenance, but some attention ensures optimal performance. In most areas of Australia, rain provides sufficient cleaning. However, in dusty regions or areas with bird activity, panels may benefit from occasional cleaning. Dirty panels can lose 5-20% of their efficiency, so an annual clean can be worthwhile.
          </p>

          <p className="mb-4">
            Professional cleaning typically costs $150-$300 and involves safely accessing your roof and cleaning panels with deionized water to prevent mineral deposits. Some homeowners clean panels themselves with a long-handled brush and hose, but roof safety should be a priority.
          </p>

          <p className="mb-4">
            Beyond cleaning, have your system inspected every few years by a qualified technician. They'll check electrical connections, inspect mounting hardware, and ensure everything is secure and functioning properly. This preventative maintenance can catch small issues before they become expensive problems.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Understanding Electricity Plans with Solar</h3>
          <p className="mb-4">
            Once you have solar, your electricity plan becomes more important than ever. Different retailers offer varying feed-in tariff rates, and some offer plans specifically designed for solar customers. Shopping around can save you hundreds of dollars annually.
          </p>

          <p className="mb-4">
            Time-of-use (TOU) tariffs can work well with solar, especially if you have a battery. These plans charge different rates depending on the time of day—peak (typically 2-8pm), shoulder, and off-peak periods. If you can shift electricity usage to off-peak times or use battery storage during peak times, TOU tariffs can reduce your bills significantly.
          </p>

          <p className="mb-4">
            Some retailers offer virtual power plant (VPP) programs where your battery participates in a network that helps stabilize the grid during high-demand periods. In exchange, you receive higher feed-in tariffs or other financial incentives. These programs are becoming more common as more households install solar and battery systems.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Property Value and Solar Panels</h3>
          <p className="mb-4">
            Multiple studies have shown that homes with solar panels sell faster and for higher prices than comparable homes without solar. Australian real estate data suggests solar panels can increase property value by $10,000-$20,000 or more, depending on system size and quality.
          </p>

          <p className="mb-4">
            Buyers appreciate the immediate electricity cost savings and protection against future price increases. In the competitive Australian property market, solar panels are increasingly seen as a standard feature rather than an upgrade, particularly in sunny states like Queensland and Western Australia.
          </p>

          <p className="mb-4">
            If you're planning to sell your home in the near future, installing solar beforehand can provide a good return on investment. Even if you only own the home for a few years post-installation, the increased sale price often equals or exceeds the cost of the system, and you benefit from reduced electricity bills in the interim.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Common Mistakes to Avoid</h3>
          <p className="mb-4">
            One of the biggest mistakes is choosing a solar installer based solely on price. While cost matters, the cheapest quote often means inferior components, inexperienced installers, or inadequate warranties. A quality installation from a reputable company provides better long-term value and peace of mind.
          </p>

          <p className="mb-4">
            Oversizing your system beyond your needs is another common error. While it might seem logical to install the biggest system your roof can accommodate, if you're not using the electricity or battery storage, you're paying more upfront for minimal additional benefit. The lower feed-in tariffs mean you won't recoup the extra investment through exports alone.
          </p>

          <p className="mb-4">
            Failing to research and compare feed-in tariffs is leaving money on the table. Some homeowners stick with their existing retailer without realizing other retailers offer significantly better solar feed-in rates. Switching can be quick and easy, potentially saving hundreds annually.
          </p>

          <p className="mb-4">
            Not understanding how your system warranty works is risky. Know what's covered, for how long, and whether the installer or manufacturer is responsible. Keep all warranty documentation safe and understand the claims process. Some warranties require regular maintenance to remain valid.
          </p>

          <p className="mb-6">
            Finally, don't ignore the importance of quality components. While all solar panels might look similar, differences in cell technology, manufacturing quality, and degradation rates significantly impact long-term performance. Investing in tier-one panels from established manufacturers provides better reliability and output over the system's 25+ year lifespan.
          </p>
        </div>

        {/* Ad Slot - Before Affiliate Banner */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* Affiliate Banner */}
        <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Go Solar?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get free quotes from CEC-accredited solar installers in your area. Compare prices and find the best system for your home.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Get Free Quotes
            </button>
          </div>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}
