import { 
  BTLMortgageAnalysisData, 
  ISAAnalysisData, 
  NationalInsuranceAnalysisData, 
  PensionAnalysisData, 
  StampDutyAnalysisData, 
  AnalysisResponse, 
  Recommendation 
} from "../types";

export function generateBTLMortgageRecommendations(
  data: BTLMortgageAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Rental yield analysis
  if (data.rentalYield < 5) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Low Rental Yield",
      description: `Your rental yield of ${data.rentalYield.toFixed(1)}% is below the recommended 5-6% for BTL properties.`,
      actionItems: [
        "Consider properties in higher-yield areas",
        "Negotiate a lower purchase price",
        "Look for properties with rental increase potential",
        "Factor in potential void periods"
      ]
    });
    riskFactors.push("Low rental yield may result in poor investment returns");
  } else {
    keyInsights.push(`Strong rental yield of ${data.rentalYield.toFixed(1)}%`);
  }

  // Cash flow analysis
  if (data.monthlyCashFlow < 0) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Negative Cash Flow",
      description: `Monthly cash flow of £${data.monthlyCashFlow.toFixed(0)} means you'll need to top up payments.`,
      actionItems: [
        "Increase the rental amount if market allows",
        "Consider a larger deposit to reduce mortgage payments",
        "Budget for monthly top-ups and void periods",
        "Review all property expenses for optimization"
      ]
    });
    riskFactors.push("Negative cash flow requires ongoing financial support");
  } else if (data.monthlyCashFlow < 100) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "Tight Cash Flow",
      description: "Low positive cash flow leaves little buffer for unexpected costs.",
      actionItems: [
        "Build a property maintenance reserve fund",
        "Consider rent protection insurance",
        "Plan for potential void periods"
      ]
    });
  }

  // LTV analysis
  if (data.ltvRatio > 75) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "High LTV Ratio",
      description: `LTV of ${data.ltvRatio.toFixed(1)}% may limit lender options and increase rates.`,
      actionItems: [
        "Consider increasing deposit to improve LTV",
        "Shop around for specialist BTL lenders",
        "Factor in higher interest rates for high LTV"
      ]
    });
  }

  // Tax considerations
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "BTL Tax Strategy",
    description: "Consider tax implications of BTL property ownership.",
    actionItems: [
      "Understand Section 24 mortgage interest restrictions",
      "Consider incorporation for tax efficiency",
      "Plan for capital gains tax on disposal",
      "Keep detailed records of all expenses",
      "Consider professional tax advice"
    ]
  });

  keyInsights.push(`Monthly mortgage payment: £${data.monthlyPayment.toLocaleString()}`);
  keyInsights.push(`Monthly rental income: £${data.monthlyRent.toLocaleString()}`);
  
  nextSteps.push("Get mortgage agreement in principle from BTL specialist lender");
  nextSteps.push("Arrange property survey and legal checks");
  nextSteps.push("Set up property management systems");

  const summary = `Your BTL property shows a ${data.rentalYield.toFixed(1)}% rental yield with ${
    data.monthlyCashFlow >= 0 ? 'positive' : 'negative'
  } monthly cash flow of £${Math.abs(data.monthlyCashFlow).toFixed(0)}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateISARecommendations(
  data: ISAAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const currentAllowance = 20000; // 2024/25 ISA allowance

  // Contribution optimization
  if (data.annualContribution < currentAllowance) {
    const missedContribution = currentAllowance - data.annualContribution;
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Maximize ISA Allowance",
      description: `You're contributing £${data.annualContribution.toLocaleString()} but could contribute up to £${currentAllowance.toLocaleString()}.`,
      actionItems: [
        `Consider increasing contribution by £${missedContribution.toLocaleString()}`,
        "Set up automatic monthly transfers to maximize allowance",
        "Use any spare cash or bonuses to top up ISA"
      ],
      potentialSavings: Math.round(missedContribution * data.expectedReturn * 0.01 * data.years)
    });
  } else {
    keyInsights.push("Maximizing annual ISA allowance - excellent tax planning!");
  }

  // Return expectations
  if (data.expectedReturn > 8) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "Aggressive Return Expectations",
      description: `Expected return of ${data.expectedReturn}% may be optimistic for long-term planning.`,
      actionItems: [
        "Consider more conservative return estimates (5-7%)",
        "Diversify investments to manage risk",
        "Review portfolio regularly"
      ]
    });
    riskFactors.push("High return expectations may not materialize consistently");
  }

  // ISA type optimization
  if (data.isaType === "Cash ISA" && data.expectedReturn < 4) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Consider Stocks & Shares ISA",
      description: "Cash ISA returns may not keep pace with inflation over longer terms.",
      actionItems: [
        "Consider transferring to Stocks & Shares ISA for higher returns",
        "Maintain some cash ISA for emergency funds",
        "Start with low-cost index funds for diversification"
      ]
    });
  }

  keyInsights.push(`Total tax-free growth: £${data.totalReturns.toLocaleString()}`);
  keyInsights.push(`Equivalent taxable account would lose significant returns to tax`);
  
  nextSteps.push("Review and maximize current year's ISA allowance");
  nextSteps.push("Consider ISA transfers from previous years if beneficial");
  nextSteps.push("Set up regular contribution plan");

  const summary = `Your ISA strategy will generate £${data.finalAmount.toLocaleString()} tax-free over ${data.years} years, with total returns of £${data.totalReturns.toLocaleString()}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateNationalInsuranceRecommendations(
  data: NationalInsuranceAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // High earner considerations
  if (data.annualSalary > 100000) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "High Earner NI Strategy",
      description: "Consider strategies to optimize National Insurance contributions.",
      actionItems: [
        "Maximize pension contributions to reduce NI liability",
        "Consider salary sacrifice arrangements",
        "Review benefits in kind vs cash salary",
        "Consider incorporation if self-employed"
      ]
    });
  }

  // Pension contributions
  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Pension Contribution Benefits",
    description: "Pension contributions can reduce both income tax and National Insurance.",
    actionItems: [
      "Maximize employer pension matching",
      "Consider additional voluntary contributions",
      "Use salary sacrifice for pension contributions",
      "Review annual allowance limits"
    ]
  });

  keyInsights.push(`Total NI contributions: £${data.niContributions.toLocaleString()}`);
  keyInsights.push(`Employee portion: £${data.employeeContributions.toLocaleString()}`);
  keyInsights.push(`Employer portion: £${data.employerContributions.toLocaleString()}`);
  
  nextSteps.push("Review payslip to ensure correct NI category");
  nextSteps.push("Check state pension forecast");
  nextSteps.push("Consider NI voluntary contributions if gaps exist");

  const summary = `Based on your £${data.annualSalary.toLocaleString()} salary, your total National Insurance contributions are £${data.niContributions.toLocaleString()} annually.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generatePensionRecommendations(
  data: PensionAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const yearsToRetirement = data.retirementAge - data.currentAge;
  const targetMultiplier = 25; // Rule of thumb: 25x annual expenses

  // Contribution adequacy
  const recommendedAnnual = data.annualIncome * 0.15; // 15% rule of thumb
  const currentAnnual = data.monthlyContribution * 12;
  
  if (currentAnnual < recommendedAnnual) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Insufficient Pension Contributions",
      description: `Contributing £${currentAnnual.toLocaleString()} annually, but experts recommend 15% of income (£${recommendedAnnual.toLocaleString()}).`,
      actionItems: [
        `Increase contributions by £${(recommendedAnnual - currentAnnual).toLocaleString()} annually`,
        "Maximize employer matching first",
        "Use salary sacrifice to boost contributions",
        "Consider additional voluntary contributions"
      ],
      potentialSavings: Math.round((recommendedAnnual - currentAnnual) * (1 + data.expectedReturn * 0.01) ** yearsToRetirement)
    });
  }

  // Retirement adequacy
  const targetPensionPot = data.annualIncome * targetMultiplier;
  if (data.finalPensionPot < targetPensionPot) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Retirement Income Gap",
      description: `Projected pension pot of £${data.finalPensionPot.toLocaleString()} may not provide adequate retirement income.`,
      actionItems: [
        "Consider increasing retirement age",
        "Boost pension contributions significantly",
        "Explore additional income sources in retirement",
        "Review investment strategy for better returns"
      ]
    });
    riskFactors.push("Current savings trajectory may not meet retirement income needs");
  }

  // Time to retirement
  if (yearsToRetirement < 10) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Pre-Retirement Planning",
      description: "With retirement approaching, focus on reducing risk and maximizing contributions.",
      actionItems: [
        "Gradually shift to more conservative investments",
        "Maximize final salary years if in defined benefit scheme",
        "Plan pension drawdown strategy",
        "Consider phased retirement options"
      ]
    });
  }

  keyInsights.push(`Years to retirement: ${yearsToRetirement}`);
  keyInsights.push(`Projected annual retirement income: £${data.annualIncome.toLocaleString()}`);
  
  nextSteps.push("Review all existing pension pots and consider consolidation");
  nextSteps.push("Get annual pension statements");
  nextSteps.push("Consider independent financial advice for retirement planning");

  const summary = `Your pension projections show £${data.finalPensionPot.toLocaleString()} at retirement, providing approximately £${data.annualIncome.toLocaleString()} annual income.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateStampDutyRecommendations(
  data: StampDutyAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // High stamp duty warning
  if (data.effectiveRate > 5) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "High Stamp Duty Rate",
      description: `Effective stamp duty rate of ${data.effectiveRate.toFixed(1)}% is significant.`,
      actionItems: [
        "Factor stamp duty into total purchase budget",
        "Consider properties just below stamp duty thresholds",
        "Ensure adequate cash reserves for completion"
      ]
    });
  }

  // First-time buyer benefits
  if (data.buyerType === "first-time" && data.propertyValue <= 625000) {
    keyInsights.push("Benefiting from first-time buyer stamp duty relief");
    recommendations.push({
      type: "opportunity",
      priority: "low",
      title: "First-Time Buyer Benefits",
      description: "You're eligible for first-time buyer stamp duty relief.",
      actionItems: [
        "Ensure you meet all first-time buyer criteria",
        "Consider Help to Buy ISA or Lifetime ISA benefits",
        "Factor savings into property budget"
      ]
    });
  }

  // Additional property surcharge
  if (data.buyerType === "additional") {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Additional Property Surcharge",
      description: "3% surcharge applies to additional property purchases.",
      actionItems: [
        "Consider if primary residence can be sold before completion",
        "Factor 3% surcharge into investment returns",
        "Explore company purchase for BTL properties"
      ]
    });
  }

  keyInsights.push(`Total stamp duty: £${data.stampDuty.toLocaleString()}`);
  keyInsights.push(`Effective rate: ${data.effectiveRate.toFixed(2)}%`);
  
  nextSteps.push("Budget for stamp duty in purchase calculations");
  nextSteps.push("Arrange funds for completion day");
  nextSteps.push("Confirm buyer status with solicitor");

  const summary = `For a property valued at £${data.propertyValue.toLocaleString()}, stamp duty will be £${data.stampDuty.toLocaleString()} (${data.effectiveRate.toFixed(1)}% effective rate).`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}