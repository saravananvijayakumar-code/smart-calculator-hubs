import { 
  CGTAnalysisData, 
  FBTAnalysisData, 
  NegativeGearingAnalysisData, 
  PropertyTaxAnalysisData, 
  SuperannuationAnalysisData,
  FirstHomeBuyerNSWAnalysisData,
  AnalysisResponse, 
  Recommendation 
} from "../types";

export function generateCGTRecommendations(
  data: CGTAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // CGT discount optimization
  if (data.discount === 0) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "CGT Discount Eligibility",
      description: "Hold assets for more than 12 months to qualify for 50% CGT discount.",
      actionItems: [
        "Consider timing of asset sales to qualify for discount",
        "Plan asset disposal after 12-month holding period",
        "Factor in discount when making investment decisions",
        "Keep detailed records of purchase and sale dates"
      ],
      potentialSavings: Math.round(data.cgtLiability * 0.5)
    });
  } else {
    keyInsights.push(`Benefiting from 50% CGT discount - saving $${(data.capitalGain * 0.5).toLocaleString()}`);
  }

  // High CGT liability
  if (data.cgtLiability > 10000) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "CGT Liability Management",
      description: `CGT liability of $${data.cgtLiability.toLocaleString()} requires careful tax planning.`,
      actionItems: [
        "Consider spreading asset sales across financial years",
        "Realize capital losses to offset gains",
        "Make additional super contributions to reduce taxable income",
        "Consider timing of other income to manage tax brackets"
      ]
    });
  }

  // Loss harvesting opportunity
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Capital Loss Harvesting",
    description: "Consider realizing capital losses to offset gains.",
    actionItems: [
      "Review portfolio for underperforming assets",
      "Consider selling loss-making investments before June 30",
      "Carry forward unused capital losses to future years",
      "Maintain detailed records of all capital transactions"
    ]
  });

  // Primary residence strategy
  if (data.capitalGain > 100000) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Primary Residence CGT Exemption",
      description: "Consider primary residence strategies for future property investments.",
      actionItems: [
        "Understand main residence exemption rules",
        "Consider living in investment property to claim exemption",
        "Plan for 6-year rule if renting out former home",
        "Document any periods of primary residence"
      ]
    });
  }

  keyInsights.push(`Capital gain: $${data.capitalGain.toLocaleString()}`);
  keyInsights.push(`CGT liability: $${data.cgtLiability.toLocaleString()}`);
  keyInsights.push(`Net gain after tax: $${data.netGain.toLocaleString()}`);
  
  nextSteps.push("Keep detailed records of all purchase and improvement costs");
  nextSteps.push("Consider timing of asset sales for tax optimization");
  nextSteps.push("Consult tax advisor for complex CGT situations");

  const summary = `Your capital gain of $${data.capitalGain.toLocaleString()} results in CGT liability of $${data.cgtLiability.toLocaleString()}, leaving net gain of $${data.netGain.toLocaleString()}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateFBTRecommendations(
  data: FBTAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // High FBT rate impact
  if (data.effectiveRate > 30) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High FBT Impact",
      description: `Effective FBT rate of ${data.effectiveRate.toFixed(1)}% significantly increases cost of benefits.`,
      actionItems: [
        "Review whether benefits are more valuable than cash equivalent",
        "Consider salary sacrifice arrangements to reduce FBT",
        "Explore exempt benefits like superannuation contributions",
        "Calculate total employment package including FBT"
      ]
    });
  }

  // Salary sacrifice optimization
  recommendations.push({
    type: "opportunity",
    priority: "high",
    title: "Salary Sacrifice Opportunities",
    description: "Consider FBT-exempt salary sacrifice options.",
    actionItems: [
      "Maximize superannuation contributions via salary sacrifice",
      "Consider novated lease for vehicle if beneficial",
      "Explore meal entertainment and corporate credit card benefits",
      "Use portable electronic devices for work purposes"
    ]
  });

  // Alternative benefit structures
  if (data.fbtLiability > 5000) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Benefit Structure Optimization",
      description: "Consider alternative benefit arrangements to minimize FBT.",
      actionItems: [
        "Negotiate cash equivalent instead of high-FBT benefits",
        "Structure benefits to fall under minor benefit exemption",
        "Consider employee contribution to reduce FBT liability",
        "Explore otherwise deductible rule for work-related benefits"
      ]
    });
  }

  keyInsights.push(`FBT liability: $${data.fbtLiability.toLocaleString()}`);
  keyInsights.push(`Gross-up value: $${data.grossUpValue.toLocaleString()}`);
  keyInsights.push(`FBT rate: ${data.fbtRate}%`);
  
  nextSteps.push("Review total employment package including FBT");
  nextSteps.push("Discuss salary sacrifice options with employer");
  nextSteps.push("Calculate net benefit after FBT implications");

  const summary = `Your benefit of $${data.benefitValue.toLocaleString()} incurs FBT of $${data.fbtLiability.toLocaleString()}, creating an effective rate of ${data.effectiveRate.toFixed(1)}%.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateNegativeGearingRecommendations(
  data: NegativeGearingAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Negative gearing viability
  if (data.netCashFlow < -200) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High Negative Cash Flow",
      description: `Monthly negative cash flow of $${Math.abs(data.netCashFlow).toFixed(0)} requires significant ongoing funding.`,
      actionItems: [
        "Ensure adequate cash flow to sustain negative gearing",
        "Budget for potential rent increases to improve cash flow",
        "Consider capital growth prospects to justify strategy",
        "Plan for vacancy periods and unexpected expenses"
      ]
    });
    riskFactors.push("High negative cash flow creates ongoing financial pressure");
  }

  // Tax benefit optimization
  if (data.taxSavings > 0) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Tax Deduction Optimization",
      description: `Tax savings of $${data.taxSavings.toLocaleString()} help offset negative cash flow.`,
      actionItems: [
        "Maximize all allowable deductions (interest, depreciation, repairs)",
        "Keep detailed records of all property expenses",
        "Consider building depreciation schedule for maximum deductions",
        "Factor in tax timing for cash flow planning"
      ]
    });
  }

  // Investment strategy review
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Investment Strategy Assessment",
    description: "Evaluate whether negative gearing aligns with investment goals.",
    actionItems: [
      "Focus on properties with strong capital growth potential",
      "Consider renovation opportunities to add value",
      "Monitor rental market trends in property location",
      "Plan exit strategy if fundamentals deteriorate"
    ]
  });

  // Cash flow improvement
  if (data.netCashFlow < 0) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Cash Flow Improvement",
      description: "Explore options to improve property cash flow.",
      actionItems: [
        "Negotiate rent increases at lease renewal",
        "Reduce property management fees if possible",
        "Consider refinancing to reduce interest payments",
        "Explore additional income streams (parking, storage)"
      ]
    });
  }

  keyInsights.push(`Annual rental income: $${data.rentalIncome.toLocaleString()}`);
  keyInsights.push(`Total property expenses: $${data.propertyExpenses.toLocaleString()}`);
  keyInsights.push(`Interest deductions: $${data.interestExpenses.toLocaleString()}`);
  
  nextSteps.push("Monitor property market conditions and rental trends");
  nextSteps.push("Keep detailed expense records for tax purposes");
  nextSteps.push("Review strategy annually based on cash flow and growth");

  const summary = `Your investment property generates $${data.rentalIncome.toLocaleString()} annually but costs $${data.propertyExpenses.toLocaleString()}, resulting in ${data.netCashFlow >= 0 ? 'positive' : 'negative'} cash flow of $${Math.abs(data.netCashFlow).toLocaleString()}/month.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generatePropertyTaxRecommendations(
  data: PropertyTaxAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // High property tax burden
  if (data.netTax > data.propertyValue * 0.02) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "High Property Tax Burden",
      description: `Property tax of $${data.netTax.toLocaleString()} represents over 2% of property value.`,
      actionItems: [
        "Review property valuation for accuracy",
        "Investigate available exemptions and concessions",
        "Consider objecting to valuation if property has declined",
        "Factor high taxes into investment return calculations"
      ]
    });
  }

  // Exemption optimization
  if (data.exemptions === 0 && data.propertyValue < 500000) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Property Tax Exemptions",
      description: "You may be eligible for property tax exemptions or concessions.",
      actionItems: [
        "Check eligibility for pensioner concessions",
        "Investigate first home owner exemptions",
        "Consider primary place of residence exemptions",
        "Apply for disability or veteran concessions if applicable"
      ]
    });
  }

  // Payment planning
  recommendations.push({
    type: "strategy",
    priority: "low",
    title: "Property Tax Payment Strategy",
    description: "Plan for property tax payments in your budget.",
    actionItems: [
      "Set up regular savings for annual property tax bill",
      "Consider quarterly payment options to spread cost",
      "Factor property tax into rental yield calculations",
      "Review payment methods for any available discounts"
    ]
  });

  keyInsights.push(`Annual property tax: $${data.annualTax.toLocaleString()}`);
  keyInsights.push(`Tax rate: ${data.taxRate}% of property value`);
  keyInsights.push(`Net tax after exemptions: $${data.netTax.toLocaleString()}`);
  
  nextSteps.push("Review property tax notice for accuracy");
  nextSteps.push("Budget for annual property tax payments");
  nextSteps.push("Investigate available concessions and exemptions");

  const summary = `Your property valued at $${data.propertyValue.toLocaleString()} incurs annual property tax of $${data.netTax.toLocaleString()} after exemptions.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateSuperannuationRecommendations(
  data: SuperannuationAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const currentAge = userContext?.age || 35;
  const yearsToRetirement = 65 - currentAge;

  // Contribution adequacy
  const totalAnnualContribution = (data.monthlyContribution + data.employerContribution) * 12;
  const recommendedContribution = (userContext?.income || 70000) * 0.12; // 12% recommended

  if (totalAnnualContribution < recommendedContribution) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Insufficient Super Contributions",
      description: `Total contributions of $${totalAnnualContribution.toLocaleString()} are below recommended 12% of income.`,
      actionItems: [
        "Increase salary sacrifice contributions to super",
        "Make voluntary after-tax contributions",
        "Ensure employer is paying correct SG rate (11%)",
        "Consider spouse contribution splitting"
      ],
      potentialSavings: Math.round((recommendedContribution - totalAnnualContribution) * (1.07 ** yearsToRetirement))
    });
  }

  // Investment option review
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Investment Option Optimization",
    description: "Review super investment options for age-appropriate risk level.",
    actionItems: [
      "Consider higher growth options if more than 10 years to retirement",
      "Gradually shift to conservative options as retirement approaches",
      "Review fees and performance of current investment options",
      "Consider low-cost index options for fee reduction"
    ]
  });

  // Consolidation strategy
  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Super Fund Consolidation",
    description: "Consolidate multiple super accounts to reduce fees.",
    actionItems: [
      "Find and consolidate lost super accounts",
      "Compare fees across different super funds",
      "Consider switching to low-fee industry or retail funds",
      "Review insurance coverage before consolidating"
    ]
  });

  // Retirement income planning
  if (yearsToRetirement < 15) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Retirement Income Planning",
      description: "Plan transition to retirement and income strategies.",
      actionItems: [
        "Consider transition to retirement pensions",
        "Plan for account-based pension vs annuity",
        "Understand minimum drawdown requirements",
        "Factor in Centrelink eligibility and age pension"
      ]
    });
  }

  keyInsights.push(`Projected super balance at retirement: $${data.finalBalance.toLocaleString()}`);
  keyInsights.push(`Annual retirement income capacity: $${data.retirementIncome.toLocaleString()}`);
  keyInsights.push(`Combined employer + employee contributions: $${totalAnnualContribution.toLocaleString()}`);
  
  nextSteps.push("Review and consolidate all super accounts");
  nextSteps.push("Optimize investment options for age and risk tolerance");
  nextSteps.push("Consider additional voluntary contributions");

  const summary = `Your superannuation balance of $${data.currentBalance.toLocaleString()} will grow to $${data.finalBalance.toLocaleString()} by retirement, supporting annual income of $${data.retirementIncome.toLocaleString()}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateFirstHomeBuyerNSWRecommendations(
  data: FirstHomeBuyerNSWAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const depositPercentage = (data.deposit / data.propertyValue) * 100;

  // Deposit adequacy assessment
  if (depositPercentage < 10) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Low Deposit - Consider FHLDS",
      description: `Your ${depositPercentage.toFixed(1)}% deposit is below the standard 20% threshold.`,
      actionItems: [
        "Apply for First Home Loan Deposit Scheme to avoid LMI with 5% deposit",
        "Consider First Home Super Saver Scheme to boost savings",
        "Explore family guarantor options if available",
        "Continue saving to reach 10-20% to improve loan terms"
      ],
      potentialSavings: Math.round(data.propertyValue * 0.03)
    });
    riskFactors.push("Low deposit increases borrowing costs and repayment burden");
  } else if (depositPercentage < 20) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Deposit Optimization",
      description: `Your ${depositPercentage.toFixed(1)}% deposit may incur LMI costs.`,
      actionItems: [
        "Consider saving additional deposit to reach 20% and avoid LMI",
        "Explore FHLDS to eliminate LMI with current deposit",
        "Calculate whether delaying purchase to save more provides net benefit",
        "Use First Home Super Saver Scheme for tax-effective savings"
      ]
    });
  } else {
    keyInsights.push(`Strong ${depositPercentage.toFixed(1)}% deposit position - no LMI required`);
  }

  // Government benefits optimization
  if (data.benefits < 20000 && data.propertyValue <= 800000) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Maximize Government Benefits",
      description: "You may be eligible for additional NSW first home buyer benefits.",
      actionItems: [
        "Verify eligibility for full stamp duty exemption (properties under $650k)",
        "Confirm First Home Owner Grant eligibility for new homes ($10,000)",
        "Explore NSW Shared Equity Scheme for government co-contribution",
        "Investigate First Home Super Saver Scheme withdrawal benefits"
      ],
      potentialSavings: Math.round(35000 - data.benefits)
    });
  }

  // Affordability and repayment management
  const annualRepayment = data.monthlyRepayment * 12;
  const estimatedIncome = userContext?.income || 80000;
  const repaymentToIncomeRatio = (annualRepayment / estimatedIncome) * 100;

  if (repaymentToIncomeRatio > 30) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High Repayment Burden",
      description: `Monthly repayments of $${data.monthlyRepayment.toLocaleString()} represent ${repaymentToIncomeRatio.toFixed(1)}% of estimated income.`,
      actionItems: [
        "Review budget to ensure sustainable repayment capacity",
        "Consider properties at lower price points for reduced debt burden",
        "Build emergency fund covering 6 months of repayments",
        "Explore income increase opportunities before committing",
        "Calculate total housing costs including rates, insurance, maintenance"
      ]
    });
    riskFactors.push("High debt-to-income ratio creates financial stress and limited flexibility");
  } else if (repaymentToIncomeRatio > 25) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Repayment Planning",
      description: "Ensure comprehensive budgeting for sustainable homeownership.",
      actionItems: [
        "Create detailed budget including all housing costs",
        "Establish emergency fund for unexpected expenses",
        "Consider income protection insurance",
        "Plan for interest rate rises in repayment capacity"
      ]
    });
  }

  // First home buyer strategy
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "First Home Purchase Strategy",
    description: "Strategic considerations for your first home purchase in NSW.",
    actionItems: [
      "Compare new vs established properties for FHOG eligibility",
      "Research suburbs with strong capital growth potential",
      "Consider proximity to employment, transport, and amenities",
      "Engage mortgage broker to compare lender options and rates",
      "Obtain building and pest inspections before purchase",
      "Budget for upfront costs: legal fees, inspections, moving costs"
    ]
  });

  // Long-term wealth building
  if (data.lvrRatio < 90) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Long-term Wealth Strategies",
      description: "Leverage your first home for future wealth building.",
      actionItems: [
        "Make extra repayments during early loan years to reduce interest",
        "Consider offset account to reduce interest while maintaining liquidity",
        "Plan for future investment property acquisition",
        "Monitor property market for renovation/improvement opportunities",
        "Build equity through consistent repayments and capital growth"
      ]
    });
  }

  // NSW-specific schemes
  recommendations.push({
    type: "opportunity",
    priority: "high",
    title: "NSW-Specific First Home Buyer Schemes",
    description: "Explore NSW government programs to reduce purchase costs.",
    actionItems: [
      "Apply for NSW Shared Equity Scheme (up to 40% government co-contribution)",
      "Verify stamp duty exemption or concession eligibility",
      "Confirm FHOG eligibility if purchasing new construction",
      "Consider regional NSW for lower prices and same benefits",
      "Review income and property price thresholds for all schemes"
    ]
  });

  keyInsights.push(`Property value: $${data.propertyValue.toLocaleString()}`);
  keyInsights.push(`Total government benefits: $${data.benefits.toLocaleString()}`);
  keyInsights.push(`Total upfront costs: $${data.totalCosts.toLocaleString()}`);
  keyInsights.push(`Loan-to-value ratio: ${data.lvrRatio.toFixed(1)}%`);
  
  nextSteps.push("Obtain pre-approval from multiple lenders to compare offers");
  nextSteps.push("Verify eligibility for all applicable NSW first home buyer schemes");
  nextSteps.push("Engage conveyancer or solicitor for property purchase");
  nextSteps.push("Build emergency fund covering 6+ months of expenses");
  nextSteps.push("Research target suburbs and property types thoroughly");

  const summary = `Purchasing a $${data.propertyValue.toLocaleString()} property with $${data.deposit.toLocaleString()} deposit (${depositPercentage.toFixed(1)}%). Government benefits of $${data.benefits.toLocaleString()} reduce upfront costs. Monthly repayments estimated at $${data.monthlyRepayment.toLocaleString()}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}