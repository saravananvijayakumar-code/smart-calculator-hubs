import { InvestmentAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateInvestmentRecommendations(
  data: InvestmentAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const userAge = userContext?.age || 35;
  const riskTolerance = userContext?.riskTolerance || "medium";
  const returnRate = data.annualReturn;
  const timeHorizon = data.years;

  // Risk assessment based on return expectations
  if (returnRate > 12) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Overly Optimistic Return Assumptions",
      description: `An expected return of ${returnRate}% is quite aggressive and may not be sustainable long-term.`,
      actionItems: [
        "Consider more conservative projections (7-10% for diversified portfolios)",
        "Research historical market returns for your investment mix",
        "Plan for market volatility and potential downturns",
        "Diversify across asset classes to reduce risk"
      ]
    });
    riskFactors.push("High return expectations may lead to excessive risk-taking");
  } else if (returnRate < 4) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Conservative Return Assumptions",
      description: `Your expected return of ${returnRate}% is quite conservative. You might be missing growth opportunities.`,
      actionItems: [
        "Consider a balanced portfolio with some growth investments",
        "Review age-appropriate asset allocation strategies",
        "Explore low-cost index funds for better long-term returns",
        "Consider tax-advantaged accounts to boost effective returns"
      ]
    });
  }

  // Age-based asset allocation recommendations
  const recommendedStockPercentage = Math.max(100 - userAge, 20);
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Age-Appropriate Asset Allocation",
    description: `At age ${userAge}, consider a portfolio with approximately ${recommendedStockPercentage}% stocks.`,
    actionItems: [
      `Target ${recommendedStockPercentage}% stocks and ${100 - recommendedStockPercentage}% bonds/fixed income`,
      "Rebalance annually to maintain target allocation",
      "Consider target-date funds for automatic rebalancing",
      "Adjust allocation as you age (reduce stock percentage over time)"
    ]
  });

  // Time horizon analysis
  if (timeHorizon < 5) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Short Investment Timeline",
      description: `A ${timeHorizon}-year timeline is relatively short for equity investments.`,
      actionItems: [
        "Consider more conservative investments for short-term goals",
        "Use high-yield savings or CDs for money needed within 3-5 years",
        "Avoid volatile investments if you need the money soon",
        "Build emergency fund before long-term investing"
      ]
    });
    riskFactors.push("Short investment timeline increases risk of losses");
  } else if (timeHorizon > 20) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Long Investment Timeline Advantage",
      description: `Your ${timeHorizon}-year timeline allows for aggressive growth strategies.`,
      actionItems: [
        "Take advantage of compound growth with consistent investing",
        "Consider growth-oriented investments",
        "Don't panic during market downturns - stay the course",
        "Maximize tax-advantaged accounts (401k, IRA, Roth IRA)"
      ]
    });
  }

  // Monthly contribution analysis
  const monthlyAsPercentOfInitial = (data.monthlyContribution * 12) / data.initialInvestment * 100;
  if (data.monthlyContribution === 0) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Add Regular Contributions",
      description: "Regular monthly contributions can significantly boost your investment growth through dollar-cost averaging.",
      actionItems: [
        "Set up automatic monthly investments",
        "Start with even small amounts ($50-100/month)",
        "Use dollar-cost averaging to reduce timing risk",
        "Increase contributions annually or with raises"
      ],
      potentialSavings: Math.round(data.finalAmount * 0.3)
    });
  } else if (monthlyAsPercentOfInitial < 10) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Increase Regular Contributions",
      description: "Increasing your monthly contributions could significantly impact your long-term results.",
      actionItems: [
        "Consider increasing monthly contributions by 10-20%",
        "Automate contribution increases annually",
        "Invest windfalls like bonuses or tax refunds",
        "Review and optimize your budget for more investment capacity"
      ]
    });
  }

  // Tax optimization
  recommendations.push({
    type: "optimization",
    priority: "high",
    title: "Tax Optimization Strategy",
    description: "Maximize tax-advantaged accounts to keep more of your returns.",
    actionItems: [
      "Max out 401(k) contributions, especially if there's employer matching",
      "Consider Roth IRA for tax-free growth if income allows",
      "Use HSA as additional retirement account if available",
      "Hold tax-inefficient investments in tax-advantaged accounts"
    ],
    estimatedImpact: "Could save 15-25% in taxes over the investment period"
  });

  // Diversification recommendations
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Diversification Strategy",
    description: "Proper diversification helps manage risk while maintaining growth potential.",
    actionItems: [
      "Diversify across asset classes (stocks, bonds, real estate)",
      "Include international exposure (20-30% of stock allocation)",
      "Consider low-cost index funds for broad market exposure",
      "Avoid over-concentration in any single investment"
    ]
  });

  // Risk tolerance adjustment
  if (riskTolerance === "low" && returnRate > 8) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "Risk/Return Mismatch",
      description: "Your conservative risk tolerance may not align with high return expectations.",
      actionItems: [
        "Adjust return expectations to match risk tolerance",
        "Consider balanced funds for moderate risk/return",
        "Focus on steady, consistent growth rather than high returns",
        "Build comfort with market volatility through education"
      ]
    });
  }

  // Generate insights
  keyInsights.push(`Projected compound annual growth rate: ${((data.finalAmount / data.totalContributions) ** (1/timeHorizon) - 1 * 100).toFixed(1)}%`);
  keyInsights.push(`Total contributions: $${data.totalContributions.toLocaleString()}`);
  keyInsights.push(`Investment gains: $${data.totalReturn.toLocaleString()}`);
  
  const gainPercentage = (data.totalReturn / data.totalContributions) * 100;
  keyInsights.push(`Your investment gains represent ${gainPercentage.toFixed(0)}% of your total contributions`);

  if (data.monthlyContribution > 0) {
    const monthlyImpact = data.monthlyContribution * 12 * timeHorizon * (1 + returnRate/100) ** (timeHorizon/2);
    keyInsights.push(`Regular contributions account for approximately $${monthlyImpact.toLocaleString()} of your final amount`);
  }

  // Risk factors
  if (returnRate > 10) {
    riskFactors.push("High return expectations require accepting significant market volatility");
  }
  if (timeHorizon < 10) {
    riskFactors.push("Shorter timeframes increase the impact of market timing");
  }
  riskFactors.push("Inflation could erode purchasing power of future dollars");
  riskFactors.push("Market downturns could temporarily reduce portfolio value");

  // Next steps
  nextSteps.push("Open investment accounts if you haven't already");
  nextSteps.push("Research low-cost index funds or target-date funds");
  nextSteps.push("Set up automatic monthly investments");
  nextSteps.push("Review and rebalance portfolio annually");
  nextSteps.push("Consider working with a fee-only financial advisor for complex situations");

  const summary = `Your investment projection shows strong potential with a final amount of $${data.finalAmount.toLocaleString()} over ${timeHorizon} years. ${
    data.totalReturn > data.totalContributions 
      ? "The power of compound growth is working in your favor."
      : "Consider strategies to optimize your returns and contribution amounts."
  }`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}