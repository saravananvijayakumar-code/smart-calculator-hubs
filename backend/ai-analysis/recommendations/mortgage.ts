import { MortgageAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateMortgageRecommendations(
  data: MortgageAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Calculate DTI and LTV ratios
  const ltvRatio = (data.loanAmount / data.propertyValue) * 100;
  const monthlyIncome = userContext?.income ? userContext.income / 12 : null;
  const dtiRatio = monthlyIncome ? (data.monthlyPayment / monthlyIncome) * 100 : null;

  // LTV Analysis
  if (ltvRatio > 80) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High Loan-to-Value Ratio",
      description: `Your LTV ratio is ${ltvRatio.toFixed(1)}%, which means you're borrowing more than 80% of the home's value.`,
      actionItems: [
        "Consider increasing your down payment to reduce LTV below 80%",
        "Shop around for lenders that offer competitive rates for high-LTV loans",
        "Factor in PMI costs which will increase your monthly payment"
      ],
      estimatedImpact: "Reducing LTV to 80% could eliminate PMI and save hundreds monthly"
    });
    riskFactors.push("High LTV ratio increases lending risk and monthly costs");
  } else {
    keyInsights.push(`Excellent LTV ratio of ${ltvRatio.toFixed(1)}% - no PMI required`);
  }

  // DTI Analysis
  if (dtiRatio && dtiRatio > 28) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High Debt-to-Income Ratio",
      description: `Your housing payment represents ${dtiRatio.toFixed(1)}% of your monthly income, above the recommended 28%.`,
      actionItems: [
        "Consider a less expensive home or larger down payment",
        "Look into extending the loan term to reduce monthly payments",
        "Pay down existing debts before applying for the mortgage"
      ]
    });
    riskFactors.push("High DTI ratio may strain monthly budget and limit financial flexibility");
  }

  // Interest rate optimization
  if (data.interestRate > 7.0) {
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Interest Rate Optimization",
      description: `Your interest rate of ${data.interestRate}% is relatively high in the current market.`,
      actionItems: [
        "Shop with multiple lenders to compare rates",
        "Consider paying points to buy down the rate",
        "Improve credit score before applying if possible",
        "Consider adjustable-rate mortgages if planning short-term ownership"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.15)
    });
  }

  // Loan term analysis
  if (data.loanTerm === 30) {
    const monthlyDiff = data.monthlyPayment * 0.25; // Approximate difference for 15-year
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Consider 15-Year Mortgage",
      description: "A 15-year mortgage could save significantly on total interest.",
      actionItems: [
        "Compare 15-year mortgage options",
        "Ensure the higher payment fits your budget",
        "Consider bi-weekly payments as an alternative"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.4),
      estimatedImpact: `Monthly payment would increase by approximately $${monthlyDiff.toFixed(0)}`
    });
  }

  // Refinancing opportunities
  if (data.interestRate > 6.5) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Future Refinancing Opportunity",
      description: "Monitor interest rates for potential refinancing opportunities.",
      actionItems: [
        "Set up rate alerts with your lender",
        "Maintain good credit to qualify for best rates",
        "Consider refinancing if rates drop 0.5% or more",
        "Factor in closing costs when evaluating refinancing"
      ]
    });
  }

  // Investment strategy
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Mortgage vs Investment Strategy",
    description: "Consider the opportunity cost of your down payment and extra payments.",
    actionItems: [
      "Compare mortgage rate to potential investment returns",
      "If mortgage rate < 5%, consider investing extra funds instead of extra payments",
      "Maximize 401(k) match before making extra mortgage payments",
      "Build emergency fund before aggressive mortgage paydown"
    ]
  });

  // Generate insights
  keyInsights.push(`Total interest over loan term: $${data.totalInterest.toLocaleString()}`);
  keyInsights.push(`Monthly payment represents ${(data.monthlyPayment / data.loanAmount * 1200).toFixed(2)}% of loan amount annually`);
  
  if (data.totalInterest > data.loanAmount) {
    keyInsights.push("Total interest exceeds principal - consider strategies to reduce interest costs");
  }

  // Next steps
  nextSteps.push("Get pre-approved with multiple lenders to compare offers");
  nextSteps.push("Budget for closing costs, moving expenses, and immediate home maintenance");
  nextSteps.push("Consider getting a home inspection to avoid unexpected costs");
  
  if (recommendations.length > 0) {
    nextSteps.push("Prioritize high-priority recommendations to optimize your mortgage");
  }

  const summary = `Based on your mortgage calculation, your monthly payment of $${data.monthlyPayment.toLocaleString()} represents a ${ltvRatio.toFixed(1)}% LTV ratio. ${
    recommendations.filter(r => r.priority === "high").length > 0 
      ? "There are several high-priority optimizations that could improve your mortgage terms."
      : "Your mortgage parameters look reasonable with some opportunities for optimization."
  }`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}