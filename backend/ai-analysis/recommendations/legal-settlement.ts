import { LegalSettlementAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateLegalSettlementRecommendations(
  data: LegalSettlementAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const economicDamages = data.economicDamages;
  const estimatedSettlement = data.estimatedSettlement;
  const lowRange = data.lowRange;
  const highRange = data.highRange;
  const multiplier = data.multiplier;
  const faultPercentage = data.faultPercentage;

  if (faultPercentage >= 90) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Strong Liability Case",
      description: `With ${faultPercentage}% liability clarity, your case is exceptionally strong. This positions you well for maximum settlement value.`,
      actionItems: [
        "Document everything meticulously - photos, medical records, witness statements",
        "Preserve all evidence including accident scene photos and police reports",
        "Consider pushing for higher settlement given strong liability position",
        "Leverage the strength of your case in negotiations"
      ],
      estimatedImpact: "Could increase settlement by 10-20% above baseline estimates"
    });
  } else if (faultPercentage < 70) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Disputed Liability May Reduce Settlement",
      description: `With only ${faultPercentage}% liability clarity, the defendant may contest fault, potentially reducing your settlement significantly.`,
      actionItems: [
        "Gather additional evidence to strengthen your liability claim",
        "Obtain expert witness testimony to support your version of events",
        "Be prepared for potential comparative negligence arguments",
        "Consider litigation if insurance negotiations stall"
      ]
    });
    riskFactors.push("Disputed fault can reduce settlement by 30-50% or more");
  }

  if (multiplier >= 5) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Severe Injury Requires Specialized Counsel",
      description: "Your severe or catastrophic injuries warrant an attorney specializing in high-value personal injury cases.",
      actionItems: [
        "Seek attorneys with experience in catastrophic injury cases",
        "Ensure proper documentation of all long-term care needs",
        "Consider life care planners and economic experts for future damages",
        "Don't rush settlement - ensure you've reached maximum medical improvement"
      ],
      estimatedImpact: "Specialized counsel can increase settlement by 50-200% for severe cases"
    });
    keyInsights.push("Catastrophic injuries typically require 18-36 months to fully assess damages");
  } else if (multiplier < 2.5) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Minor Injury Settlement Timeline",
      description: "Minor injuries typically settle faster, often within 6-12 months. Consider timing vs. settlement value.",
      actionItems: [
        "Ensure you've completed all recommended medical treatment",
        "Don't settle before reaching maximum medical improvement",
        "Minor cases may settle quickly but still deserve fair compensation",
        "Consider whether quick settlement outweighs potentially higher but delayed offers"
      ]
    });
  }

  if (data.medicalExpenses > 50000) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Manage Medical Liens and Reimbursement Claims",
      description: `With $${data.medicalExpenses.toLocaleString()} in medical expenses, you likely have health insurance liens to negotiate.`,
      actionItems: [
        "Identify all liens from health insurers, Medicare, Medicaid, or providers",
        "Your attorney should negotiate lien reductions (often 20-40% reduction possible)",
        "Factor lien amounts into your settlement acceptance decision",
        "Don't ignore liens - they have legal right to repayment from settlement"
      ],
      estimatedImpact: "Lien negotiation can save $10,000-$50,000 on six-figure medical bills"
    });
  }

  if (data.lostWages > 25000) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Document Lost Earning Capacity",
      description: `Significant lost wages ($${data.lostWages.toLocaleString()}) suggest potential long-term earning capacity issues.`,
      actionItems: [
        "Obtain vocational expert evaluation of future earning capacity",
        "Document all employment benefits lost (health insurance, retirement, bonuses)",
        "Consider tax implications of lost wage awards",
        "If unable to return to previous career, emphasize lifetime earning loss"
      ]
    });
  }

  if (data.state && ["CA", "NY", "IL", "TX", "FL"].includes(data.state.toUpperCase())) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Favorable Jurisdiction for Settlement",
      description: `${data.state.toUpperCase()} is generally a plaintiff-friendly jurisdiction with higher average settlement values.`,
      actionItems: [
        "Leverage your jurisdiction's favorable case law in negotiations",
        "Research recent jury verdicts in your area for similar injuries",
        "Your attorney should reference local precedents when making demands",
        "Be willing to go to trial if settlement offers are unreasonably low"
      ]
    });
  }

  const netAfterFees = estimatedSettlement * 0.67;
  if (data.medicalExpenses + data.lostWages > netAfterFees * 0.7) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Settlement May Barely Cover Economic Damages",
      description: "After attorney fees and liens, your net recovery may not significantly exceed your economic losses.",
      actionItems: [
        "Negotiate vigorously for higher settlement given low net recovery",
        "Consider litigation if insurance offers don't adequately compensate you",
        "Ensure all future medical costs are included in settlement demands",
        "Don't accept settlement that doesn't fairly compensate your damages"
      ]
    });
    riskFactors.push("Net settlement after fees and liens may leave little compensation for pain and suffering");
  }

  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Attorney Selection is Critical",
    description: "The right attorney can increase your settlement by 200-400% compared to handling the case yourself.",
    actionItems: [
      "Interview 3-5 personal injury attorneys before choosing one",
      "Verify attorney specializes in your specific injury type (car accident, medical malpractice, etc.)",
      "Check track record with similar cases and average settlements obtained",
      "Understand fee structure (typical 33% contingency, 40% if litigation required)",
      "Ensure attorney has resources to take case to trial if necessary"
    ],
    estimatedImpact: "Represented plaintiffs receive 3.5x higher settlements on average than self-represented"
  });

  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Consider Structured Settlement Options",
    description: "For larger settlements, structured settlements can provide tax advantages and long-term financial security.",
    actionItems: [
      "Consult tax advisor about lump sum vs. structured settlement tax implications",
      "Structured settlements provide guaranteed income but reduce lump sum amount",
      "Consider hybrid approach - partial lump sum, partial structured payments",
      "Evaluate if immediate cash needs outweigh long-term payment benefits"
    ]
  });

  keyInsights.push(`Economic damages: $${economicDamages.toLocaleString()} (medical: $${data.medicalExpenses.toLocaleString()}, lost wages: $${data.lostWages.toLocaleString()})`);
  keyInsights.push(`Settlement estimate range: $${lowRange.toLocaleString()} - $${highRange.toLocaleString()}`);
  keyInsights.push(`After typical 33% attorney fees: $${Math.round(estimatedSettlement * 0.67).toLocaleString()} net to you`);
  keyInsights.push("Most personal injury cases (95%+) settle before trial, typically 18-36 months from incident");
  
  if (multiplier >= 4) {
    keyInsights.push("Severe injury cases often take 2-3 years to settle properly - don't rush for quick payment");
  }

  riskFactors.push("Policy limits may cap recovery regardless of injury severity");
  riskFactors.push("Pre-existing injuries or conditions may complicate settlement value");
  riskFactors.push("Gaps in medical treatment can be used to argue injuries aren't serious");
  
  if (faultPercentage < 100) {
    riskFactors.push(`Comparative negligence (${100 - faultPercentage}%) will reduce your settlement proportionally`);
  }

  nextSteps.push("Consult with experienced personal injury attorney immediately (most offer free consultations)");
  nextSteps.push("Continue all recommended medical treatment and keep detailed records");
  nextSteps.push("Do not speak with insurance adjusters without attorney present");
  nextSteps.push("Preserve all evidence: photos, medical bills, pay stubs, witness contact information");
  nextSteps.push("Do not post about accident or injuries on social media - insurers monitor this");
  
  if (multiplier >= 4) {
    nextSteps.push("Ensure you've reached maximum medical improvement before settling");
    nextSteps.push("Consider vocational and life care planning experts for future damages");
  }

  const summary = `Your estimated settlement range is $${lowRange.toLocaleString()} - $${highRange.toLocaleString()} (average: $${estimatedSettlement.toLocaleString()}). ${
    faultPercentage >= 90 
      ? "Strong liability case positions you well for maximum value." 
      : faultPercentage >= 70
      ? "Moderate liability clarity suggests reasonable settlement prospects."
      : "Disputed liability may significantly reduce settlement value."
  } ${
    multiplier >= 5
      ? "Severe injuries warrant specialized counsel and thorough damage documentation."
      : "Ensure all damages are properly documented even for less severe injuries."
  } After typical 33% attorney fees, you'd receive approximately $${Math.round(estimatedSettlement * 0.67).toLocaleString()} net.`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}
