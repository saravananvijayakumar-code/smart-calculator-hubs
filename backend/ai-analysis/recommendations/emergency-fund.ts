import { EmergencyFundAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateEmergencyFundRecommendations(
  data: EmergencyFundAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const monthsToGoal = data.monthlyContribution > 0 ? data.shortfall / data.monthlyContribution : 0;
  const currentMonthsCovered = data.currentSavings / data.monthlyExpenses;

  // Emergency fund adequacy assessment
  if (currentMonthsCovered < 1) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Critical Emergency Fund Shortage",
      description: "You have less than one month of expenses saved - this is a financial emergency waiting to happen.",
      actionItems: [
        "Immediately cut all non-essential spending",
        "Save every extra dollar until you reach $1,000 minimum",
        "Consider temporary side income to boost savings",
        "Avoid any new debt or major purchases"
      ]
    });
    riskFactors.push("No financial buffer for unexpected expenses or income loss");
  } else if (currentMonthsCovered < 3) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Insufficient Emergency Fund",
      description: `With only ${currentMonthsCovered.toFixed(1)} months covered, you're vulnerable to financial setbacks.`,
      actionItems: [
        "Prioritize emergency fund over other financial goals temporarily",
        "Aim for at least 3 months of expenses as immediate goal",
        "Review budget for areas to cut spending and boost savings",
        "Consider high-yield savings account for emergency fund"
      ]
    });
  } else if (currentMonthsCovered >= data.targetMonths) {
    keyInsights.push(`Excellent! You've reached your ${data.targetMonths}-month emergency fund goal`);
    
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Emergency Fund Goal Achieved",
      description: "You've successfully built your emergency fund. Consider next steps.",
      actionItems: [
        "Redirect emergency fund contributions to other financial goals",
        "Focus on debt payoff or investment contributions",
        "Consider slightly higher yield options for the emergency fund",
        "Review the fund annually and adjust for expense changes"
      ]
    });
  } else {
    const monthsShort = data.targetMonths - currentMonthsCovered;
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Continue Building Emergency Fund",
      description: `You're ${monthsShort.toFixed(1)} months short of your ${data.targetMonths}-month goal.`,
      actionItems: [
        "Maintain consistent monthly contributions",
        "Use windfalls (tax refunds, bonuses) to boost the fund",
        "Consider temporarily reducing other savings to prioritize emergency fund",
        "Celebrate reaching 3-month milestone, then work toward full goal"
      ]
    });
  }

  // Target months analysis
  if (data.targetMonths < 3) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "Consider Larger Emergency Fund",
      description: "A 3-6 month emergency fund is typically recommended for most people.",
      actionItems: [
        "Increase target to at least 3 months of expenses",
        "Consider 6 months if you have irregular income",
        "Factor in job market conditions in your industry",
        "Consider family responsibilities and dependents"
      ]
    });
  } else if (data.targetMonths > 12) {
    recommendations.push({
      type: "optimization",
      priority: "low",
      title: "Large Emergency Fund Target",
      description: `A ${data.targetMonths}-month fund is quite large - ensure it's not hindering other goals.`,
      actionItems: [
        "Consider if this amount is truly necessary",
        "Balance emergency fund with other financial priorities",
        "Once you reach 6-8 months, focus on debt payoff or investing",
        "Consider keeping excess in slightly higher-yield investments"
      ]
    });
  }

  // Monthly contribution analysis
  if (data.monthlyContribution === 0) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "No Emergency Fund Contributions",
      description: "Without regular contributions, your emergency fund won't grow.",
      actionItems: [
        "Set up automatic monthly transfers to emergency fund",
        "Start with any amount - even $25/month helps",
        "Review budget to find areas for emergency fund savings",
        "Treat emergency fund contribution as a non-negotiable bill"
      ]
    });
  } else if (monthsToGoal > 24) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Increase Monthly Contributions",
      description: `At $${data.monthlyContribution}/month, it will take ${monthsToGoal.toFixed(0)} months to reach your goal.`,
      actionItems: [
        "Consider increasing monthly contribution by 50-100%",
        "Use the 50/30/20 budget rule (50% needs, 20% savings)",
        "Direct tax refunds and bonuses to emergency fund",
        "Find ways to reduce monthly expenses to boost savings"
      ],
      estimatedImpact: `Doubling contributions would reach goal in ${(monthsToGoal/2).toFixed(0)} months`
    });
  }

  // Storage and accessibility recommendations
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Emergency Fund Storage Strategy",
    description: "Your emergency fund should be safe and easily accessible.",
    actionItems: [
      "Use high-yield savings account for better returns",
      "Keep funds separate from checking account to avoid spending",
      "Ensure FDIC insurance coverage",
      "Consider online banks for higher interest rates"
    ],
    estimatedImpact: "High-yield account could earn extra $100-300 annually"
  });

  // Budget and expense optimization
  if (data.monthlyExpenses > 5000) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Review Monthly Expenses",
      description: "High monthly expenses increase your emergency fund requirement.",
      actionItems: [
        "Review all monthly expenses for potential cuts",
        "Distinguish between needs and wants in your budget",
        "Consider downsizing if housing costs are high",
        "Look for ways to reduce recurring subscriptions and bills"
      ],
      potentialSavings: Math.round(data.monthlyExpenses * 0.1 * data.targetMonths)
    });
  }

  // Income stability considerations
  const riskTolerance = userContext?.riskTolerance;
  if (riskTolerance === "low" || userContext?.jobStability === "low") {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Income Stability Considerations",
      description: "Consider a larger emergency fund due to income uncertainty.",
      actionItems: [
        "Target 6-8 months of expenses instead of 3-6",
        "Prioritize emergency fund over other savings goals",
        "Consider additional income streams for stability",
        "Build professional network and keep skills current"
      ]
    });
  }

  // Generate insights
  keyInsights.push(`Current emergency fund covers ${currentMonthsCovered.toFixed(1)} months of expenses`);
  keyInsights.push(`Target emergency fund: $${data.targetAmount.toLocaleString()}`);
  
  if (data.shortfall > 0) {
    keyInsights.push(`Amount needed to reach goal: $${data.shortfall.toLocaleString()}`);
    if (data.monthlyContribution > 0) {
      keyInsights.push(`Time to reach goal at current savings rate: ${monthsToGoal.toFixed(0)} months`);
    }
  }

  const emergencyFundYield = data.targetAmount * 0.04; // Assume 4% high-yield savings
  keyInsights.push(`Annual interest potential in high-yield account: $${emergencyFundYield.toFixed(0)}`);

  // Risk factors
  if (currentMonthsCovered < 3) {
    riskFactors.push("Insufficient buffer for job loss or major unexpected expenses");
  }
  riskFactors.push("Inflation may increase monthly expenses over time");
  riskFactors.push("Emergency fund in low-yield account loses purchasing power");
  if (data.targetMonths < 6) {
    riskFactors.push("May be insufficient for extended unemployment or major emergencies");
  }

  // Next steps
  nextSteps.push("Open high-yield savings account dedicated to emergency fund");
  nextSteps.push("Set up automatic monthly transfers to emergency fund");
  nextSteps.push("Review and update monthly expense calculation annually");
  
  if (currentMonthsCovered < 1) {
    nextSteps.push("Focus entirely on emergency fund before other financial goals");
  } else if (currentMonthsCovered < 3) {
    nextSteps.push("Prioritize emergency fund over non-essential financial goals");
  } else if (currentMonthsCovered >= data.targetMonths) {
    nextSteps.push("Redirect contributions to debt payoff or investment goals");
  }
  
  nextSteps.push("Review emergency fund needs annually or after major life changes");

  const urgencyLevel = currentMonthsCovered < 1 ? "critical" : 
                      currentMonthsCovered < 3 ? "high priority" : "on track";

  const summary = `Your emergency fund currently covers ${currentMonthsCovered.toFixed(1)} months of expenses (${urgencyLevel}). ${
    data.shortfall > 0 
      ? `You need $${data.shortfall.toLocaleString()} more to reach your ${data.targetMonths}-month goal.`
      : "You've successfully reached your emergency fund target!"
  }`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}