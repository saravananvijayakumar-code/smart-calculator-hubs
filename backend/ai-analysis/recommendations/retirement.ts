import { RetirementAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateRetirementRecommendations(
  data: RetirementAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const yearsToRetirement = data.retirementAge - data.currentAge;
  const shortfall = data.retirementGoal - data.projectedSavings;
  const catchUpNeeded = shortfall > 0;

  // Retirement readiness assessment
  if (catchUpNeeded) {
    const additionalMonthlyNeeded = shortfall / (yearsToRetirement * 12);
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Retirement Savings Shortfall",
      description: `You're projected to be $${shortfall.toLocaleString()} short of your retirement goal.`,
      actionItems: [
        `Increase monthly contributions by $${additionalMonthlyNeeded.toFixed(0)} to close the gap`,
        "Consider working 1-2 years longer to boost savings",
        "Explore catch-up contributions if you're over 50",
        "Review and potentially reduce retirement expenses"
      ],
      estimatedImpact: `Need additional $${additionalMonthlyNeeded.toFixed(0)}/month to meet goal`
    });
  } else {
    const surplus = data.projectedSavings - data.retirementGoal;
    keyInsights.push(`You're on track to exceed your retirement goal by $${surplus.toLocaleString()}`);
    
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Ahead of Retirement Goals",
      description: "You're on track to exceed your retirement savings goal.",
      actionItems: [
        "Consider early retirement possibilities",
        "Explore additional goals like travel or legacy planning",
        "Look into tax-optimization strategies",
        "Consider helping family members with their goals"
      ]
    });
  }

  // Age-based recommendations
  if (data.currentAge < 30) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Early Career Advantage",
      description: "Starting early gives you a huge compound interest advantage.",
      actionItems: [
        "Prioritize high-growth investments (80-90% stocks)",
        "Maximize employer 401(k) match immediately",
        "Consider Roth IRA for tax-free growth",
        "Don't worry about market volatility - time is on your side"
      ]
    });
  } else if (data.currentAge >= 50) {
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Catch-Up Contribution Eligibility",
      description: "At 50+, you can make additional catch-up contributions.",
      actionItems: [
        "Maximize catch-up contributions: extra $7,500 to 401(k), $1,000 to IRA",
        "Consider more conservative asset allocation (60-70% stocks)",
        "Review Social Security projections and optimization strategies",
        "Plan for healthcare costs in retirement"
      ],
      potentialSavings: Math.round((7500 + 1000) * yearsToRetirement * 1.07)
    });
  }

  // Contribution analysis
  const currentSavingsRate = data.monthlyContribution * 12;
  const recommendedRate = userContext?.income ? userContext.income * 0.15 : null;
  
  if (recommendedRate && currentSavingsRate < recommendedRate) {
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Increase Savings Rate",
      description: `Consider saving 15-20% of income for retirement. You're currently saving less than recommended.`,
      actionItems: [
        `Gradually increase contributions by 1% annually`,
        "Automate contribution increases with salary raises",
        "Use tax refunds and bonuses for retirement savings",
        "Consider reducing discretionary spending to boost savings"
      ],
      potentialSavings: Math.round((recommendedRate - currentSavingsRate) * yearsToRetirement * 1.07)
    });
  }

  // Return rate analysis
  if (data.expectedReturn < 6) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Conservative Return Assumptions",
      description: `Your expected ${data.expectedReturn}% return might be too conservative for long-term retirement savings.`,
      actionItems: [
        "Consider age-appropriate asset allocation with more growth investments",
        "Review investment fees - high fees can dramatically reduce returns",
        "Look into low-cost index funds or target-date funds",
        "Don't let fear of volatility keep you too conservative"
      ],
      estimatedImpact: "2% higher returns could increase final savings by 30-50%"
    });
  } else if (data.expectedReturn > 10) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "Optimistic Return Assumptions",
      description: `Expecting ${data.expectedReturn}% returns may be overly optimistic.`,
      actionItems: [
        "Consider more realistic long-term projections (7-8% for balanced portfolios)",
        "Plan for market downturns and volatility",
        "Diversify investments to manage risk",
        "Have contingency plans if returns are lower than expected"
      ]
    });
    riskFactors.push("High return expectations may lead to inadequate savings if not achieved");
  }

  // Timeline analysis
  if (yearsToRetirement < 10) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Approaching Retirement",
      description: "With retirement approaching, focus on preservation and income planning.",
      actionItems: [
        "Gradually shift to more conservative investments",
        "Plan withdrawal strategies to minimize taxes",
        "Consider working part-time in early retirement",
        "Research healthcare options and costs"
      ]
    });
    riskFactors.push("Limited time to recover from market downturns");
  } else if (yearsToRetirement > 30) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Long Timeline Advantage",
      description: "Your long timeline allows for aggressive growth strategies.",
      actionItems: [
        "Take advantage of compound growth with aggressive asset allocation",
        "Consider growth stocks and emerging market exposure",
        "Don't panic during market downturns - stay invested",
        "Review and adjust strategy every 5-10 years"
      ]
    });
  }

  // Tax optimization
  recommendations.push({
    type: "optimization",
    priority: "high",
    title: "Tax Optimization Strategy",
    description: "Optimize your retirement savings for tax efficiency.",
    actionItems: [
      "Maximize pre-tax 401(k) contributions for current tax savings",
      "Consider Roth IRA conversions during low-income years",
      "Balance traditional and Roth accounts for tax diversification",
      "Use HSA as additional retirement account if available"
    ],
    estimatedImpact: "Could save 15-25% in lifetime taxes"
  });

  // Social Security optimization
  if (data.currentAge >= 55) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Social Security Optimization",
      description: "Plan your Social Security claiming strategy carefully.",
      actionItems: [
        "Create account at ssa.gov to track projected benefits",
        "Consider delaying benefits until age 70 for maximum payout",
        "Coordinate spousal claiming strategies if married",
        "Factor Social Security into overall retirement income plan"
      ]
    });
  }

  // Healthcare planning
  if (data.currentAge >= 45) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Healthcare Cost Planning",
      description: "Healthcare will be a major retirement expense.",
      actionItems: [
        "Research Medicare options and costs",
        "Consider long-term care insurance",
        "Maximize HSA contributions for healthcare expenses",
        "Plan for potential healthcare inflation"
      ]
    });
  }

  // Generate insights
  keyInsights.push(`Years until retirement: ${yearsToRetirement}`);
  keyInsights.push(`Current monthly savings: $${data.monthlyContribution.toLocaleString()}`);
  keyInsights.push(`Projected savings at retirement: $${data.projectedSavings.toLocaleString()}`);
  
  const replacementRatio = data.monthlyIncomeNeeded / (userContext?.income ? userContext.income / 12 : data.monthlyIncomeNeeded / 0.8) * 100;
  if (userContext?.income) {
    keyInsights.push(`Retirement income will replace ${replacementRatio.toFixed(0)}% of current income`);
  }

  const savingsMultiple = data.projectedSavings / (userContext?.income || 50000);
  if (userContext?.income) {
    keyInsights.push(`Projected savings: ${savingsMultiple.toFixed(1)}x current annual income`);
  }

  // Risk factors
  if (yearsToRetirement < 15) {
    riskFactors.push("Limited time to recover from market downturns");
  }
  riskFactors.push("Inflation will reduce purchasing power of fixed retirement income");
  riskFactors.push("Healthcare costs may increase faster than general inflation");
  riskFactors.push("Market volatility could impact savings just before/during retirement");
  if (data.expectedReturn > 8) {
    riskFactors.push("Return assumptions may be optimistic");
  }

  // Next steps
  nextSteps.push("Review and optimize investment allocation for your age");
  nextSteps.push("Automate retirement contributions to ensure consistency");
  nextSteps.push("Review beneficiaries on all retirement accounts");
  nextSteps.push("Consider consulting with a fee-only financial advisor");
  
  if (catchUpNeeded) {
    nextSteps.push("Create plan to increase savings rate to close shortfall");
  }
  
  if (data.currentAge >= 50) {
    nextSteps.push("Research Social Security and Medicare options");
  }

  const summary = `${catchUpNeeded 
    ? `You need to save an additional $${(shortfall / (yearsToRetirement * 12)).toFixed(0)}/month to reach your $${data.retirementGoal.toLocaleString()} retirement goal.`
    : `You're on track for retirement with projected savings of $${data.projectedSavings.toLocaleString()}.`
  } ${yearsToRetirement > 15 ? "Time is still on your side for optimization." : "Focus on preservation and tax-efficient strategies."}`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}