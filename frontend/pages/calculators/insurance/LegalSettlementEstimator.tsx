import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Calculator, Scale, DollarSign, TrendingUp, AlertCircle, FileText, Shield } from "lucide-react";
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

interface SettlementCalculation {
  economicDamages: number;
  nonEconomicDamages: number;
  totalEstimateLow: number;
  totalEstimateHigh: number;
  averageEstimate: number;
  multiplierUsed: number;
  contingencyFee: number;
  netSettlement: number;
}

export default function LegalSettlementEstimator() {
  const [injuryType, setInjuryType] = useState("moderate");
  const [medicalExpenses, setMedicalExpenses] = useState(50000);
  const [lostWages, setLostWages] = useState(25000);
  const [permanentDisability, setPermanentDisability] = useState(false);
  const [lostEarningCapacity, setLostEarningCapacity] = useState(0);
  const [jurisdiction, setJurisdiction] = useState("standard");
  const [liabilityClarity, setLiabilityClarity] = useState(80);
  const [result, setResult] = useState<SettlementCalculation | null>(null);

  const injuryMultipliers: Record<string, { min: number; max: number; name: string }> = {
    minor: { min: 1.5, max: 2.5, name: "Minor Injury (Soft Tissue)" },
    moderate: { min: 2.5, max: 4, name: "Moderate Injury (Fractures)" },
    severe: { min: 4, max: 6, name: "Severe Injury (Major Trauma)" },
    catastrophic: { min: 6, max: 10, name: "Catastrophic Injury (Life-Changing)" }
  };

  const jurisdictionFactors: Record<string, number> = {
    conservative: 0.8,
    standard: 1.0,
    liberal: 1.3
  };

  useEffect(() => {
    calculateSettlement();
  }, [injuryType, medicalExpenses, lostWages, permanentDisability, lostEarningCapacity, jurisdiction, liabilityClarity]);

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

  const calculateSettlement = () => {
    const economicDamages = medicalExpenses + lostWages + (permanentDisability ? lostEarningCapacity : 0);
    const multiplier = injuryMultipliers[injuryType];
    const jurisdictionFactor = jurisdictionFactors[jurisdiction];
    const liabilityFactor = liabilityClarity / 100;

    const baseNonEconomicLow = economicDamages * multiplier.min;
    const baseNonEconomicHigh = economicDamages * multiplier.max;

    const nonEconomicDamagesLow = baseNonEconomicLow * jurisdictionFactor * liabilityFactor;
    const nonEconomicDamagesHigh = baseNonEconomicHigh * jurisdictionFactor * liabilityFactor;

    const totalLow = economicDamages + nonEconomicDamagesLow;
    const totalHigh = economicDamages + nonEconomicDamagesHigh;
    const average = (totalLow + totalHigh) / 2;

    const contingencyFee = average * 0.33;
    const netSettlement = average - contingencyFee;

    setResult({
      economicDamages,
      nonEconomicDamages: (nonEconomicDamagesLow + nonEconomicDamagesHigh) / 2,
      totalEstimateLow: totalLow,
      totalEstimateHigh: totalHigh,
      averageEstimate: average,
      multiplierUsed: (multiplier.min + multiplier.max) / 2,
      contingencyFee,
      netSettlement
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <CalculatorLayoutWithAds
      title="Personal Injury Settlement Calculator"
      description="Estimate your personal injury settlement value based on economic damages, injury severity, and jurisdiction factors"
    >
      <div className="space-y-8">
        {/* Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Personal Injury Settlement Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get an accurate estimate of your personal injury settlement value based on medical expenses, lost wages, injury severity, and jurisdiction
          </p>
        </div>

        {/* Calculator Card */}
        <Card className="p-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 border-2">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Inputs */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <Calculator className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold">Case Details</h2>
              </div>

              <div className="space-y-2">
                <Label>Injury Type</Label>
                <Select value={injuryType} onValueChange={setInjuryType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(injuryMultipliers).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Medical Expenses</Label>
                <Input
                  type="number"
                  value={medicalExpenses}
                  onChange={(e) => setMedicalExpenses(Number(e.target.value))}
                  min={0}
                  step={1000}
                />
              </div>

              <div className="space-y-2">
                <Label>Lost Wages</Label>
                <Input
                  type="number"
                  value={lostWages}
                  onChange={(e) => setLostWages(Number(e.target.value))}
                  min={0}
                  step={1000}
                />
              </div>

              <div className="space-y-2">
                <Label>Jurisdiction Type</Label>
                <Select value={jurisdiction} onValueChange={setJurisdiction}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="conservative">Conservative (Caps on Damages)</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="liberal">Liberal (Plaintiff-Friendly)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Permanent Disability</Label>
                  <Switch
                    checked={permanentDisability}
                    onCheckedChange={setPermanentDisability}
                  />
                </div>
              </div>

              {permanentDisability && (
                <div className="space-y-2">
                  <Label>Lost Earning Capacity</Label>
                  <Input
                    type="number"
                    value={lostEarningCapacity}
                    onChange={(e) => setLostEarningCapacity(Number(e.target.value))}
                    min={0}
                    step={10000}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Liability Clarity: {liabilityClarity}%</Label>
                <Slider
                  value={[liabilityClarity]}
                  onValueChange={(value) => setLiabilityClarity(value[0])}
                  min={0}
                  max={100}
                  step={5}
                  className="py-4"
                />
                <p className="text-xs text-muted-foreground">
                  How clear is the defendant's fault? (Higher = stronger case)
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold">Settlement Estimate</h2>
              </div>

              {result && (
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                    <div className="text-sm font-medium mb-2">Estimated Settlement Range</div>
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(result.totalEstimateLow)} - {formatCurrency(result.totalEstimateHigh)}
                    </div>
                    <div className="text-sm opacity-90">
                      Average: {formatCurrency(result.averageEstimate)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
                      <div className="text-xs text-muted-foreground mb-1">Economic Damages</div>
                      <div className="text-lg font-semibold">{formatCurrency(result.economicDamages)}</div>
                    </div>
                    <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
                      <div className="text-xs text-muted-foreground mb-1">Non-Economic Damages</div>
                      <div className="text-lg font-semibold">{formatCurrency(result.nonEconomicDamages)}</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950">
                    <div className="text-sm font-medium mb-2">After Legal Fees (33%)</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Contingency Fee:</span>
                        <span className="font-medium">{formatCurrency(result.contingencyFee)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Net to Client:</span>
                        <span className="font-bold text-lg">{formatCurrency(result.netSettlement)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div className="text-xs text-muted-foreground">
                        This is an estimate only. Actual settlements vary based on many factors including jurisdiction, insurance policy limits, and case specifics. Consult with an attorney for accurate valuation.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <ExportShareButtons
                calculatorType="legal-settlement"
                inputs={{}}
                results={result || {}}
                title="Personal Injury Settlement Estimate"
              />
            </div>
          </div>
        </Card>

        {/* Ad Slot - After Calculator */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* AI Analysis Section */}
        {result && (
          <EnhancedAIAnalysis
            calculatorType="legal-settlement"
            data={{
              medicalExpenses,
              lostWages,
              multiplier: result.multiplierUsed,
              state: jurisdiction,
              faultPercentage: liabilityClarity,
              estimatedSettlement: result.averageEstimate,
              lowRange: result.totalEstimateLow,
              highRange: result.totalEstimateHigh,
              economicDamages: result.economicDamages,
              nonEconomicDamages: result.nonEconomicDamages
            }}
          />
        )}

        {/* Ad Slot - After AI Analysis */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* Educational Content Part 1 */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Understanding Personal Injury Settlements
          </h2>

          <p className="text-lg leading-relaxed mb-6">
            Personal injury settlements represent the financial compensation awarded to individuals who have suffered harm due to another party's negligence or intentional actions. Understanding how these settlements are calculated is crucial for anyone pursuing a personal injury claim, whether from a car accident, slip and fall, medical malpractice, or any other type of injury case.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">What Are Economic Damages?</h3>
          <p className="mb-4">
            Economic damages represent the tangible, measurable financial losses you've incurred as a result of your injury. These are relatively straightforward to calculate because they have specific dollar amounts attached to them. Economic damages form the foundation of most personal injury settlements and include several key components.
          </p>

          <p className="mb-4">
            Medical expenses are typically the largest component of economic damages. This includes all past and future medical costs related to your injury, such as emergency room visits, hospital stays, surgery, medication, physical therapy, medical equipment, and ongoing care. It's essential to keep detailed records of all medical bills and expenses, as these will be crucial in proving your economic damages.
          </p>

          <p className="mb-4">
            Lost wages represent another significant portion of economic damages. If your injury prevented you from working, you're entitled to compensation for the income you lost during your recovery period. This includes not just your regular salary, but also bonuses, commissions, and other employment benefits you would have received. For severe injuries, lost earning capacity—the reduction in your ability to earn money in the future—can also be included.
          </p>

          {/* Ad Slot - Mid Educational Content */}
          <div className="not-prose my-8">
            <AutoAdSlot placement="mid-content" className="mx-auto" />
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Understanding Non-Economic Damages</h3>
          <p className="mb-4">
            Non-economic damages compensate you for intangible losses that don't have a specific price tag. These damages acknowledge that injuries cause more than just financial hardship—they affect your quality of life, emotional well-being, and overall happiness. Calculating non-economic damages is more subjective than economic damages, which is why the multiplier method is commonly used.
          </p>

          <p className="mb-4">
            Pain and suffering is the most common type of non-economic damage. This includes physical pain, discomfort, and suffering you've endured because of your injury. It also encompasses the anticipated pain you'll experience in the future if your injury has long-term effects. The severity and duration of your pain significantly impact the value of these damages.
          </p>

          <p className="mb-4">
            Emotional distress damages compensate for psychological impacts such as anxiety, depression, fear, insomnia, and post-traumatic stress disorder (PTSD) that may result from your injury. Mental health impacts can be just as debilitating as physical injuries and are increasingly recognized in personal injury settlements.
          </p>

          <p className="mb-4">
            Loss of enjoyment of life damages apply when your injury prevents you from participating in activities and hobbies you previously enjoyed. Whether it's playing sports, traveling, or simply playing with your children, if your injury has diminished your ability to engage in life's pleasures, you deserve compensation for that loss.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">The Multiplier Method Explained</h3>
          <p className="mb-4">
            The multiplier method is the most widely used approach for calculating non-economic damages in personal injury cases. This method works by multiplying your total economic damages by a number (the multiplier) that typically ranges from 1.5 to 10, depending on the severity of your injuries and other case factors.
          </p>

          <p className="mb-4">
            For minor injuries such as soft tissue injuries, whiplash, or sprains that heal relatively quickly, multipliers typically range from 1.5 to 2.5. These injuries, while painful, generally don't result in permanent damage or long-term complications. A person with $20,000 in medical bills and lost wages from a minor car accident might receive $30,000 to $50,000 in non-economic damages.
          </p>

          <p className="mb-4">
            Moderate injuries like bone fractures, herniated discs, or injuries requiring surgery typically warrant multipliers of 2.5 to 4. These injuries involve more significant pain, longer recovery periods, and potentially permanent effects. Someone with $50,000 in economic damages from a moderate injury might receive $125,000 to $200,000 in non-economic damages.
          </p>

          <p className="mb-4">
            Severe injuries such as traumatic brain injuries, spinal cord damage, or multiple fractures often receive multipliers of 4 to 6. These injuries typically result in significant lifestyle changes, ongoing medical treatment, and permanent disability. With $100,000 in economic damages, non-economic damages could range from $400,000 to $600,000.
          </p>

          <p className="mb-4">
            Catastrophic injuries that result in permanent disability, paralysis, or life-altering conditions may warrant multipliers of 6 to 10 or even higher in extreme cases. These injuries fundamentally change every aspect of a person's life and require lifetime care and support.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Factors That Influence Settlement Value</h3>
          <p className="mb-4">
            While the multiplier method provides a framework, numerous factors can increase or decrease your settlement value. Understanding these factors helps you better assess the potential value of your case and strengthen your claim.
          </p>

          <p className="mb-4">
            Liability clarity is perhaps the most critical factor. If the defendant's fault is absolutely clear—for example, they ran a red light and hit you—your settlement value will be higher than in cases where fault is disputed. Insurance companies are more willing to pay when they know they'll likely lose at trial. Conversely, if you share any fault for the accident (comparative negligence), your settlement may be reduced proportionally.
          </p>

          <p className="mb-4">
            The quality of medical documentation significantly impacts settlement value. Consistent medical treatment, thorough documentation of your injuries, and expert medical testimony all strengthen your case. Gaps in treatment or failure to follow medical advice can be used by insurance companies to argue that your injuries aren't as serious as claimed.
          </p>

          <p className="mb-4">
            Your age and occupation matter more than you might think. A young professional with decades of earning potential ahead will typically receive higher compensation for lost earning capacity than someone near retirement age. Similarly, if your injury prevents you from continuing in your chosen profession, this can significantly increase your settlement value.
          </p>
        </div>

        {/* Ad Slot - Between Content Sections */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* Educational Content Part 2 */}
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            Maximizing Your Settlement
          </h2>

          <h3 className="text-2xl font-semibold mt-8 mb-4">The Role of Insurance Policy Limits</h3>
          <p className="mb-4">
            One of the harshest realities in personal injury law is that your settlement can never exceed the defendant's insurance policy limits, regardless of how severe your injuries are. If you suffered $500,000 in damages but the at-fault party only has $100,000 in liability coverage, you'll likely only recover $100,000 unless you can pursue other avenues of compensation.
          </p>

          <p className="mb-4">
            This is why it's crucial to identify all possible sources of coverage. In car accident cases, this might include the at-fault driver's insurance, your own underinsured motorist coverage, and possibly coverage from other responsible parties. Your attorney should conduct thorough research to identify all available insurance policies that might apply to your case.
          </p>

          <p className="mb-4">
            In some cases, you may be able to pursue the defendant's personal assets if insurance coverage is insufficient, but this often requires filing a lawsuit and obtaining a judgment. Many defendants have limited personal assets, making this route less productive than it might seem.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Jurisdictional Differences</h3>
          <p className="mb-4">
            Where your case is filed can dramatically affect its value. Different states have vastly different approaches to personal injury damages, and understanding these differences is essential for setting realistic expectations.
          </p>

          <p className="mb-4">
            Conservative jurisdictions often have statutory caps on non-economic damages, particularly for medical malpractice cases. Some states limit pain and suffering damages to $250,000 or $500,000 regardless of injury severity. These jurisdictions also tend to have more defense-friendly juries who may be skeptical of large damage awards.
          </p>

          <p className="mb-4">
            Standard jurisdictions represent the middle ground, with no statutory caps and juries that evaluate each case on its merits. Most states fall into this category, and settlement values align closely with national averages.
          </p>

          <p className="mb-4">
            Liberal or plaintiff-friendly jurisdictions have no damage caps and historically award higher settlements and verdicts. Urban areas in states like California, New York, and Illinois often fall into this category. Juries in these jurisdictions may be more sympathetic to injured plaintiffs and more willing to award substantial compensation.
          </p>

          {/* Ad Slot - Mid Educational Content 2 */}
          <div className="not-prose my-8">
            <AutoAdSlot placement="mid-content" className="mx-auto" />
          </div>

          <h3 className="text-2xl font-semibold mt-8 mb-4">The Settlement Negotiation Process</h3>
          <p className="mb-4">
            Understanding how settlement negotiations work can help you make informed decisions throughout your case. Most personal injury cases settle before trial, but getting to a fair settlement requires patience, preparation, and often, leverage.
          </p>

          <p className="mb-4">
            The process typically begins when you or your attorney send a demand letter to the insurance company. This letter outlines the facts of the case, your injuries, your economic and non-economic damages, and demands a specific settlement amount. The initial demand is usually higher than what you expect to receive, leaving room for negotiation.
          </p>

          <p className="mb-4">
            The insurance company will respond with their own evaluation of the case and likely make a counteroffer that's significantly lower than your demand. This is normal and expected. The insurance company's first offer is almost always lower than what they're actually willing to pay.
          </p>

          <p className="mb-4">
            From here, the negotiation process involves back-and-forth offers and counteroffers. Your attorney will present evidence, medical records, expert opinions, and legal arguments to justify a higher settlement. The insurance company will look for any weaknesses in your case or ways to reduce their exposure.
          </p>

          <p className="mb-4">
            If negotiations stall, your attorney may file a lawsuit. This doesn't necessarily mean going to trial—in fact, many cases settle after a lawsuit is filed but before trial. Filing a lawsuit demonstrates your commitment to pursuing fair compensation and often motivates insurance companies to make more reasonable offers.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Attorney Fees and Costs</h3>
          <p className="mb-4">
            Most personal injury attorneys work on a contingency fee basis, meaning they only get paid if you recover compensation. The standard contingency fee is 33-40% of your settlement or verdict, with 33% being most common for cases that settle before trial.
          </p>

          <p className="mb-4">
            While giving up a third of your settlement might seem like a lot, hiring an experienced attorney almost always results in a higher net recovery than handling the case yourself. Studies show that represented plaintiffs receive settlements that are, on average, 3.5 times higher than unrepresented plaintiffs, even after accounting for attorney fees.
          </p>

          <p className="mb-4">
            In addition to attorney fees, you'll likely be responsible for case costs and expenses. These can include filing fees, expert witness fees, medical record fees, deposition costs, and investigation expenses. Some attorneys advance these costs and deduct them from your settlement, while others require clients to pay as costs are incurred.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Special Considerations for Different Injury Types</h3>
          <p className="mb-4">
            Different types of personal injury cases have unique factors that can affect settlement value. Understanding these nuances helps you better assess your specific situation.
          </p>

          <p className="mb-4">
            Car accident cases are among the most common personal injury claims. These cases often involve clear liability (especially with police reports and traffic violations) and well-defined insurance policies. However, they're also subject to insurance policy limits that may cap recovery. Severe injuries from car accidents, such as traumatic brain injuries or spinal cord damage, may warrant pursuing multiple insurance policies or even personal assets.
          </p>

          <p className="mb-4">
            Slip and fall cases can be more challenging because proving liability often requires demonstrating that the property owner knew or should have known about the dangerous condition. These cases benefit from photographs of the hazard, witness statements, and evidence of previous complaints or incidents.
          </p>

          <p className="mb-4">
            Medical malpractice cases are typically the most complex and expensive to pursue. They require extensive expert testimony, medical record review, and often years of litigation. However, they can also result in substantial settlements when the malpractice is clear and the damages are severe. Many states have special requirements for medical malpractice cases, including expert certificates and pre-filing review panels.
          </p>

          <p className="mb-4">
            Product liability cases involve injuries caused by defective products. These cases can be particularly valuable because they may involve corporate defendants with substantial resources and insurance coverage. Successful product liability cases may also result in recalls or design changes that protect others from similar injuries.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">When to Accept a Settlement Offer</h3>
          <p className="mb-4">
            Deciding whether to accept a settlement offer is one of the most important decisions you'll make in your case. While every situation is unique, several factors should guide your decision-making process.
          </p>

          <p className="mb-4">
            First, make sure you've reached maximum medical improvement (MMI)—the point where your condition has stabilized and further improvement is unlikely. Settling before MMI means you might not fully understand the extent of your permanent injuries or future medical needs. Once you settle, you can't come back for more money if your condition worsens.
          </p>

          <p className="mb-4">
            Second, compare the settlement offer to the realistic value of your case if you went to trial. Your attorney can provide an assessment of what a jury might award, though remember that jury verdicts are never guaranteed. Consider the strength of your case, the quality of available evidence, and how you might appear to a jury.
          </p>

          <p className="mb-4">
            Third, factor in the risks and costs of going to trial. Trials are expensive, time-consuming, and uncertain. You might win more than the settlement offer, but you could also lose entirely. Additionally, the emotional toll of testifying and reliving your injury should be considered.
          </p>

          <p className="mb-4">
            Finally, consider your personal circumstances. Do you need money now for medical bills or living expenses? Can you afford to wait months or years for a trial verdict? Sometimes accepting a reasonable settlement offer provides certainty and closure that's worth more than the possibility of a slightly higher verdict.
          </p>

          <h3 className="text-2xl font-semibold mt-8 mb-4">Protecting Your Settlement</h3>
          <p className="mb-4">
            Once you've successfully negotiated a settlement, there are important steps to protect your recovery and ensure you receive the maximum benefit from your compensation.
          </p>

          <p className="mb-4">
            First, understand that your settlement may be subject to liens from health insurance companies, Medicare, Medicaid, or medical providers who treated you on a lien basis. Your attorney should negotiate these liens to reduce the amounts owed, ensuring you keep more of your settlement.
          </p>

          <p className="mb-4">
            Second, be aware of the tax implications of your settlement. Generally, compensation for physical injuries is not taxable, but portions of your settlement allocated to lost wages or punitive damages may be taxable. Consult with a tax professional to understand your specific situation.
          </p>

          <p className="mb-4">
            Third, consider the long-term management of your settlement funds. For large settlements, you might benefit from a structured settlement that pays out over time rather than in a lump sum, providing financial security and potential tax advantages. For smaller settlements, consult with a financial advisor about investing or saving your compensation wisely.
          </p>

          <p className="mb-6">
            Finally, remember that your settlement comes with a release agreement—once you sign, you give up your right to pursue any future claims related to this injury against the defendant. Make absolutely certain you understand what you're releasing and that the settlement adequately compensates you for all past, present, and future damages.
          </p>
        </div>

        {/* Ad Slot - Before Affiliate Banner */}
        <AutoAdSlot placement="in-feed" className="my-8" />

        {/* Affiliate Banner */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Need Legal Representation?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced personal injury attorneys who work on contingency. Free consultations available.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
              Find an Attorney
            </button>
          </div>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
}
