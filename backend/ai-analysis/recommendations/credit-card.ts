import { CreditCardAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateCreditCardRecommendations(
  data: CreditCardAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const extraPayment = data.paymentAmount - data.minimumPayment;
  const payoffYears = data.timeToPayoff / 12;
  const monthlyIncome = userContext?.income ? userContext.income / 12 : null;

  // High interest rate warning
  if (data.apr > 25) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Extremely High Interest Rate",
      description: `Your ${data.apr}% APR is extremely high and will cost you significantly in interest.`,
      actionItems: [
        "Consider balance transfer to a 0% APR card if available",
        "Look into personal loan consolidation at lower rate",
        "Contact card issuer to negotiate lower rate",
        "Prioritize this debt above all other financial goals"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.5)
    });
    riskFactors.push("Extremely high interest rate compounds debt rapidly");
  } else if (data.apr > 20) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High Interest Rate",
      description: `Your ${data.apr}% APR is quite high and significantly increases payoff costs.`,
      actionItems: [
        "Look for balance transfer offers with lower rates",
        "Consider debt consolidation loan",
        "Negotiate with current card issuer for rate reduction",
        "Focus on paying off this card before others"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.3)
    });
  }

  // Minimum payment analysis
  if (extraPayment <= 0) {
    const minimumPayoffTime = data.balance / data.minimumPayment;
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Minimum Payment Trap",
      description: "Paying only the minimum will keep you in debt for decades and cost thousands in interest.",
      actionItems: [
        "Add any extra amount to monthly payment, even $25 helps significantly",
        "Use windfalls (tax refunds, bonuses) for debt payment",
        "Consider debt snowball or avalanche method",
        "Review budget to find areas to cut spending"
      ],
      estimatedImpact: `Paying minimum only would take ${minimumPayoffTime.toFixed(0)} months and cost much more`
    });
    riskFactors.push("Minimum payments barely cover interest, extending payoff indefinitely");
  } else {
    keyInsights.push(`Extra payment of $${extraPayment.toFixed(2)} will save significantly on interest`);
  }

  // Payoff timeline analysis
  if (payoffYears > 5) {
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Long Payoff Timeline",
      description: `It will take ${payoffYears.toFixed(1)} years to pay off this debt at your current payment.`,
      actionItems: [
        "Increase monthly payment by $50-100 if possible",
        "Consider debt consolidation for lower rate and shorter term",
        "Use any extra income directly for debt payment",
        "Avoid adding any new charges to this card"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.25),
      estimatedImpact: "Increasing payment by $100 could cut years off payoff time"
    });
  } else if (payoffYears < 2) {
    keyInsights.push(`Excellent! You'll be debt-free in ${payoffYears.toFixed(1)} years`);
  }

  // Balance transfer opportunities
  if (data.apr > 15 && data.balance > 2000) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Balance Transfer Opportunity",
      description: "A balance transfer to a 0% APR card could save substantial interest.",
      actionItems: [
        "Research 0% balance transfer credit card offers",
        "Calculate break-even point including transfer fees",
        "Apply before your credit score is impacted by high utilization",
        "Create plan to pay off balance during 0% period"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.6),
      estimatedImpact: "Could save 60-80% of total interest costs"
    });
  }

  // Debt consolidation analysis
  if (data.balance > 5000 && data.apr > 12) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Debt Consolidation Loan",
      description: "A personal loan might offer better terms than credit card debt.",
      actionItems: [
        "Shop for personal loans with rates below your current APR",
        "Compare credit union and online lender options",
        "Calculate total costs including loan fees",
        "Ensure you won't rack up new credit card debt"
      ],
      estimatedImpact: "Could reduce APR by 5-10 percentage points"
    });
  }

  // Payment strategy recommendations
  if (extraPayment > 0) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Accelerated Payment Strategy",
      description: "Your extra payments are helping - consider optimizing further.",
      actionItems: [
        "Pay bi-weekly instead of monthly to make extra payment per year",
        "Round up payments to nearest $50 or $100",
        "Apply any raises or bonuses directly to debt",
        "Use debt avalanche method if you have multiple cards"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.15)
    });
  }

  // Credit utilization impact
  const utilizationImpact = data.balance / (data.balance / 0.3); // Assume 30% utilization
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Credit Score Improvement",
    description: "Paying down this debt will improve your credit utilization ratio.",
    actionItems: [
      "Keep card open after paying off to maintain credit history",
      "Consider making multiple payments per month to keep utilization low",
      "Don't close the card once paid off - it helps your credit score",
      "Monitor credit score improvement as balance decreases"
    ],
    estimatedImpact: "Could improve credit score by 50-100 points"
  });

  // Prevent future debt accumulation
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Prevent Future Credit Card Debt",
    description: "Avoid falling back into credit card debt after payoff.",
    actionItems: [
      "Build emergency fund to avoid future credit card reliance",
      "Create and stick to a monthly budget",
      "Use cash or debit for discretionary spending",
      "Consider automating savings to reduce temptation to overspend"
    ]
  });

  // Income-based recommendations
  if (monthlyIncome && data.paymentAmount > 0) {
    const paymentToIncomeRatio = (data.paymentAmount / monthlyIncome) * 100;
    
    if (paymentToIncomeRatio > 20) {
      recommendations.push({
        type: "warning",
        priority: "medium",
        title: "High Payment Burden",
        description: `Your payment represents ${paymentToIncomeRatio.toFixed(1)}% of monthly income.`,
        actionItems: [
          "Consider debt consolidation to reduce monthly burden",
          "Look for ways to increase income temporarily",
          "Review budget for additional cuts to support debt payment",
          "Avoid taking on additional debt while paying this off"
        ]
      });
    } else if (paymentToIncomeRatio < 10) {
      recommendations.push({
        type: "opportunity",
        priority: "medium",
        title: "Room for Higher Payments",
        description: `Your payment is only ${paymentToIncomeRatio.toFixed(1)}% of income - you might be able to pay more.`,
        actionItems: [
          "Consider increasing payment by $100-200 per month",
          "Use percentage of income rule: aim for 15-20% toward debt",
          "Apply any spending cuts directly to debt payment",
          "Set aggressive payoff goal to stay motivated"
        ],
        potentialSavings: Math.round(data.totalInterest * 0.4)
      });
    }
  }

  // Generate insights
  keyInsights.push(`Total interest cost: $${data.totalInterest.toLocaleString()}`);
  keyInsights.push(`Time to payoff: ${(data.timeToPayoff / 12).toFixed(1)} years`);
  keyInsights.push(`Total amount paid: $${data.totalPayment.toLocaleString()}`);
  
  const interestPercentage = (data.totalInterest / data.balance) * 100;
  keyInsights.push(`Interest represents ${interestPercentage.toFixed(0)}% of your current balance`);

  if (extraPayment > 0) {
    const minimumOnlyInterest = data.totalInterest * 2; // Rough estimate
    const interestSaved = minimumOnlyInterest - data.totalInterest;
    keyInsights.push(`Extra payments save approximately $${interestSaved.toLocaleString()} vs minimum payments`);
  }

  // Risk factors
  if (data.apr > 20) {
    riskFactors.push("High interest rate compounds debt rapidly if not addressed");
  }
  riskFactors.push("Credit card debt can negatively impact credit score and future borrowing");
  riskFactors.push("High credit utilization affects credit score");
  if (payoffYears > 3) {
    riskFactors.push("Long payoff timeline increases total interest costs significantly");
  }
  riskFactors.push("Risk of accumulating additional debt while paying off current balance");

  // Next steps
  nextSteps.push("Stop using the credit card for new purchases");
  nextSteps.push("Set up automatic payments to ensure consistency");
  nextSteps.push("Research balance transfer or consolidation options");
  
  if (data.paymentAmount <= data.minimumPayment * 1.5) {
    nextSteps.push("Find ways to increase monthly payment amount");
  }
  
  nextSteps.push("Create plan to prevent future credit card debt accumulation");
  nextSteps.push("Monitor credit score improvement as balance decreases");

  const urgencyLevel = data.apr > 25 ? "critical" :
                      data.apr > 20 ? "high priority" :
                      payoffYears > 5 ? "moderate priority" : "manageable";

  const summary = `Your credit card debt will take ${payoffYears.toFixed(1)} years to pay off, costing $${data.totalInterest.toLocaleString()} in interest (${urgencyLevel}). ${
    data.apr > 20 
      ? "The high interest rate makes this a priority for aggressive payoff or refinancing."
      : "Focus on consistent payments and avoiding new debt."
  }`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}