import { LoanAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateLoanRecommendations(
  data: LoanAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const monthlyIncome = userContext?.income ? userContext.income / 12 : null;
  const interestRate = data.interestRate;
  const term = data.term;

  // Interest rate analysis
  if (interestRate > 15) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High Interest Rate",
      description: `Your interest rate of ${interestRate}% is quite high and will significantly increase the total cost.`,
      actionItems: [
        "Shop around with multiple lenders for better rates",
        "Improve your credit score before applying",
        "Consider secured loans if you have collateral",
        "Look into credit unions which often offer better rates"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.3)
    });
    riskFactors.push("High interest rate increases total loan cost significantly");
  } else if (interestRate > 10) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Interest Rate Optimization",
      description: `Your ${interestRate}% rate could potentially be improved with some preparation.`,
      actionItems: [
        "Check your credit report for errors and dispute any inaccuracies",
        "Pay down existing debts to improve debt-to-income ratio",
        "Consider waiting 3-6 months to improve credit profile",
        "Get quotes from multiple lenders to compare offers"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.15)
    });
  }

  // DTI analysis if income is provided
  if (monthlyIncome && data.monthlyPayment > 0) {
    const dtiRatio = (data.monthlyPayment / monthlyIncome) * 100;
    
    if (dtiRatio > 20) {
      recommendations.push({
        type: "warning",
        priority: "high",
        title: "High Payment-to-Income Ratio",
        description: `This loan payment represents ${dtiRatio.toFixed(1)}% of your monthly income, which may strain your budget.`,
        actionItems: [
          "Consider a longer loan term to reduce monthly payments",
          "Look for a smaller loan amount if possible",
          "Ensure you have adequate emergency savings",
          "Budget carefully for other monthly expenses"
        ]
      });
      riskFactors.push("High payment ratio may limit financial flexibility");
    } else if (dtiRatio < 10) {
      recommendations.push({
        type: "opportunity",
        priority: "medium",
        title: "Consider Shorter Term",
        description: `Your payment represents only ${dtiRatio.toFixed(1)}% of income - you might afford a shorter term.`,
        actionItems: [
          "Explore shorter loan terms to save on total interest",
          "Consider making extra principal payments",
          "Ensure you maintain emergency fund and other savings goals"
        ],
        potentialSavings: Math.round(data.totalInterest * 0.4)
      });
    }
  }

  // Loan term analysis
  if (term > 5) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Long Loan Term Impact",
      description: `Your ${term}-year term will result in significant interest payments over time.`,
      actionItems: [
        "Consider shorter terms if monthly budget allows",
        "Make extra principal payments when possible",
        "Set up bi-weekly payments to reduce term",
        "Use windfalls (bonuses, tax refunds) for extra payments"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.25)
    });
  }

  // Total interest analysis
  const interestToLoanRatio = (data.totalInterest / data.principal) * 100;
  if (interestToLoanRatio > 50) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Excessive Interest Costs",
      description: `You'll pay ${interestToLoanRatio.toFixed(0)}% of the loan amount in interest - that's $${data.totalInterest.toLocaleString()}!`,
      actionItems: [
        "Strongly consider shorter loan terms",
        "Shop for significantly better interest rates",
        "Consider whether the purchase is truly necessary",
        "Explore alternative financing options"
      ]
    });
  } else if (interestToLoanRatio > 25) {
    keyInsights.push(`Interest represents ${interestToLoanRatio.toFixed(0)}% of your loan amount`);
  }

  // Prepayment strategy
  if (data.totalInterest > data.principal * 0.1) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Prepayment Strategy",
      description: "Consider strategies to pay off the loan faster and reduce total interest.",
      actionItems: [
        "Add $50-100 extra to each payment toward principal",
        "Make one extra payment per year",
        "Apply raises and bonuses to loan principal",
        "Switch to bi-weekly payments (26 payments vs 12)"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.2),
      estimatedImpact: "Could reduce loan term by 2-4 years"
    });
  }

  // Refinancing opportunities
  if (interestRate > 8) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Future Refinancing Potential",
      description: "Monitor your credit and market rates for refinancing opportunities.",
      actionItems: [
        "Set calendar reminders to check rates every 6 months",
        "Continue improving credit score",
        "Consider refinancing if you can get 1-2% better rate",
        "Factor in any prepayment penalties or refinancing costs"
      ]
    });
  }

  // Alternative considerations
  recommendations.push({
    type: "strategy",
    priority: "low",
    title: "Alternative Financing Considerations",
    description: "Explore other options that might be more cost-effective.",
    actionItems: [
      "Consider borrowing from retirement accounts (if applicable)",
      "Look into family loans with better terms",
      "Explore peer-to-peer lending platforms",
      "Consider whether you can delay the purchase to save up more"
    ]
  });

  // Generate insights
  keyInsights.push(`Total cost of loan: $${data.totalPayment.toLocaleString()}`);
  keyInsights.push(`You'll pay $${data.totalInterest.toLocaleString()} in interest over the life of the loan`);
  
  if (data.totalInterest > 0) {
    const monthlyInterest = data.totalInterest / (term * 12);
    keyInsights.push(`Average monthly interest: $${monthlyInterest.toFixed(2)}`);
  }

  const effectiveRate = (data.totalPayment / data.principal - 1) * 100;
  keyInsights.push(`Effective cost increase: ${effectiveRate.toFixed(1)}% above principal`);

  // Risk factors
  if (interestRate > 12) {
    riskFactors.push("High interest rate significantly increases financial burden");
  }
  if (term > 5) {
    riskFactors.push("Long loan term increases exposure to interest rate and income changes");
  }
  riskFactors.push("Fixed payments may strain budget during income reductions");
  riskFactors.push("Early payoff penalties may limit refinancing options");

  // Next steps
  nextSteps.push("Get final loan approval and review all terms carefully");
  nextSteps.push("Set up automatic payments to avoid late fees");
  nextSteps.push("Create a payoff strategy with target dates");
  
  if (recommendations.some(r => r.type === "warning" && r.priority === "high")) {
    nextSteps.push("Consider delaying the loan to improve terms");
  }
  
  nextSteps.push("Monitor your credit score for future refinancing opportunities");

  const summary = `Your loan will cost $${data.totalPayment.toLocaleString()} total, with $${data.totalInterest.toLocaleString()} in interest over ${term} years. ${
    interestToLoanRatio > 30 
      ? "The interest costs are quite high - consider optimization strategies."
      : "The terms are reasonable, but there may still be opportunities to save."
  }`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}