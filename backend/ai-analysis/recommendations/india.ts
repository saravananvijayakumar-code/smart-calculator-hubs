import { 
  EPFAnalysisData, 
  HomeLoanAnalysisData, 
  IncomeTaxAnalysisData, 
  PPFAnalysisData, 
  SIPAnalysisData, 
  AnalysisResponse, 
  Recommendation 
} from "../types";

export function generateEPFRecommendations(
  data: EPFAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const yearsToRetirement = data.retirementAge - data.currentAge;

  // VPF contribution optimization
  if (data.employeeContribution < data.monthlyBasicSalary * 0.12) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Maximize EPF Contribution",
      description: "Consider contributing to Voluntary Provident Fund (VPF) for additional tax benefits.",
      actionItems: [
        "Increase EPF contribution beyond 12% if allowed",
        "Contribute to VPF for additional tax deduction",
        "Balance EPF with other investment options for diversification"
      ]
    });
  }

  // Withdrawal planning
  if (yearsToRetirement < 5) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "EPF Withdrawal Planning",
      description: "Plan your EPF withdrawal strategy for tax efficiency.",
      actionItems: [
        "Understand EPF withdrawal rules after 58",
        "Consider partial vs full withdrawal options",
        "Plan for EPS pension vs lump sum withdrawal",
        "Factor in tax implications of withdrawals"
      ]
    });
  }

  // Diversification strategy
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Investment Diversification",
    description: "While EPF is safe, consider diversifying retirement portfolio.",
    actionItems: [
      "Invest in equity mutual funds through SIP",
      "Consider PPF for additional tax benefits",
      "Explore NPS for additional retirement corpus",
      "Balance safety with growth potential"
    ]
  });

  keyInsights.push(`Total EPF corpus at retirement: ₹${data.finalBalance.toLocaleString()}`);
  keyInsights.push(`Monthly pension eligibility: ₹${data.monthlyPension.toLocaleString()}`);
  keyInsights.push(`Employee contribution: ₹${data.employeeContribution.toLocaleString()}/month`);
  
  nextSteps.push("Check EPF account statement regularly");
  nextSteps.push("Ensure UAN is linked to Aadhaar and bank account");
  nextSteps.push("Consider additional retirement investments");

  const summary = `Your EPF will accumulate to ₹${data.finalBalance.toLocaleString()} by retirement, providing a monthly pension of approximately ₹${data.monthlyPension.toLocaleString()}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateHomeLoanRecommendations(
  data: HomeLoanAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Interest rate optimization
  if (data.interestRate > 9.0) {
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "High Interest Rate",
      description: `Your interest rate of ${data.interestRate}% is above current market rates.`,
      actionItems: [
        "Compare rates across multiple banks and NBFCs",
        "Negotiate with current lender for rate reduction",
        "Consider loan transfer for better rates",
        "Improve credit score for better rate eligibility"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.15)
    });
  }

  // EMI optimization
  const emiToIncomeRatio = userContext?.income ? (data.emi * 12 / userContext.income) * 100 : null;
  if (emiToIncomeRatio && emiToIncomeRatio > 40) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "High EMI-to-Income Ratio",
      description: `EMI represents ${emiToIncomeRatio.toFixed(1)}% of income, above recommended 40%.`,
      actionItems: [
        "Consider increasing loan tenure to reduce EMI",
        "Make larger down payment to reduce loan amount",
        "Explore co-applicant option to improve eligibility",
        "Review other monthly expenses for optimization"
      ]
    });
    riskFactors.push("High EMI burden may strain monthly finances");
  }

  // Prepayment strategy
  if (data.loanTerm > 15) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Prepayment Strategy",
      description: "Consider prepayment strategy to reduce total interest burden.",
      actionItems: [
        "Make annual prepayments from bonus/increment",
        "Increase EMI by 10-15% annually with salary growth",
        "Use tax refunds for prepayment",
        "Balance prepayment with other investment opportunities"
      ],
      potentialSavings: Math.round(data.totalInterest * 0.25)
    });
  }

  // Tax benefits
  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Maximize Tax Benefits",
    description: "Optimize home loan tax deductions under various sections.",
    actionItems: [
      "Claim principal repayment under Section 80C (up to ₹1.5L)",
      "Claim interest deduction under Section 24 (up to ₹2L)",
      "For first home, additional ₹1.5L under Section 80EE if applicable",
      "Maintain proper documentation for tax filing"
    ]
  });

  keyInsights.push(`Total interest payable: ₹${data.totalInterest.toLocaleString()}`);
  keyInsights.push(`Monthly EMI: ₹${data.emi.toLocaleString()}`);
  keyInsights.push(`Loan tenure: ${data.loanTerm} years`);
  
  nextSteps.push("Get loan pre-approval from multiple lenders");
  nextSteps.push("Compare processing fees and other charges");
  nextSteps.push("Set up EMI auto-debit for timely payments");

  const summary = `Your home loan of ₹${data.loanAmount.toLocaleString()} at ${data.interestRate}% will cost ₹${data.emi.toLocaleString()} monthly EMI with total interest of ₹${data.totalInterest.toLocaleString()}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateIncomeTaxRecommendations(
  data: IncomeTaxAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Tax regime optimization
  if (data.regime === "old" && data.effectiveTaxRate > 15) {
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Tax Regime Comparison",
      description: "Compare old vs new tax regime to optimize tax liability.",
      actionItems: [
        "Calculate tax under new regime without deductions",
        "Compare total tax liability under both regimes",
        "Consider switching regime if beneficial",
        "Plan investments based on chosen regime"
      ]
    });
  }

  // Deduction optimization
  if (data.deductions < 150000 && data.regime === "old") {
    const missedDeductions = 150000 - data.deductions;
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Maximize Tax Deductions",
      description: `You can claim additional ₹${missedDeductions.toLocaleString()} in deductions under Section 80C.`,
      actionItems: [
        "Invest in ELSS mutual funds for tax saving",
        "Increase PPF contribution up to ₹1.5L",
        "Consider life/health insurance premiums",
        "Explore home loan principal repayment deduction"
      ],
      potentialSavings: Math.round(missedDeductions * 0.3) // Assuming 30% tax bracket
    });
  }

  // High tax liability warning
  if (data.effectiveTaxRate > 25) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "High Tax Liability",
      description: `Effective tax rate of ${data.effectiveTaxRate.toFixed(1)}% suggests need for tax planning.`,
      actionItems: [
        "Maximize all available deductions and exemptions",
        "Consider salary restructuring with employer",
        "Explore tax-efficient investment options",
        "Plan for advance tax payments to avoid penalty"
      ]
    });
  }

  // Investment planning
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Tax-Efficient Investment Planning",
    description: "Align investments with tax planning for optimal returns.",
    actionItems: [
      "Invest in ELSS for Section 80C with equity exposure",
      "Consider Section 80D for health insurance premiums",
      "Use Section 24 for home loan interest deduction",
      "Plan NPS investment for additional deduction under 80CCD(1B)"
    ]
  });

  keyInsights.push(`Total tax liability: ₹${data.taxLiability.toLocaleString()}`);
  keyInsights.push(`Effective tax rate: ${data.effectiveTaxRate.toFixed(1)}%`);
  keyInsights.push(`Taxable income: ₹${data.taxableIncome.toLocaleString()}`);
  
  nextSteps.push("File ITR before due date to avoid penalty");
  nextSteps.push("Plan tax-saving investments for next year");
  nextSteps.push("Keep all investment proofs ready for tax filing");

  const summary = `On income of ₹${data.annualIncome.toLocaleString()}, your tax liability is ₹${data.taxLiability.toLocaleString()} with an effective rate of ${data.effectiveTaxRate.toFixed(1)}%.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generatePPFRecommendations(
  data: PPFAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const maxContribution = 150000;

  // Contribution optimization
  if (data.annualContribution < maxContribution) {
    const missedContribution = maxContribution - data.annualContribution;
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Maximize PPF Contribution",
      description: `You can increase contribution by ₹${missedContribution.toLocaleString()} to reach ₹1.5L limit.`,
      actionItems: [
        "Increase monthly SIP to maximize annual limit",
        "Make lump sum contribution before March 31st",
        "Set up automatic transfer to avoid missing contributions",
        "Use bonus/increment to boost PPF contribution"
      ],
      potentialSavings: Math.round(missedContribution * (1.075 ** 15)) // Assuming 7.5% return
    });
  } else {
    keyInsights.push("Maximizing PPF contribution - excellent tax planning!");
  }

  // Investment strategy
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "PPF Extension Strategy",
    description: "Plan for PPF maturity and extension options.",
    actionItems: [
      "Understand 15-year lock-in period",
      "Plan for extension in blocks of 5 years",
      "Consider partial withdrawal after 15 years",
      "Explore family PPF accounts for higher contribution limits"
    ]
  });

  // Loan facility
  if (data.years > 6) {
    recommendations.push({
      type: "opportunity",
      priority: "low",
      title: "PPF Loan Facility",
      description: "PPF offers loan facility from 7th year onwards.",
      actionItems: [
        "Understand loan eligibility (25% of balance 2 years ago)",
        "Consider PPF loan for emergency needs",
        "Compare PPF loan rates with other options",
        "Maintain loan repayment discipline"
      ]
    });
  }

  keyInsights.push(`Total corpus at maturity: ₹${data.finalAmount.toLocaleString()}`);
  keyInsights.push(`Total tax-free returns: ₹${data.totalReturns.toLocaleString()}`);
  keyInsights.push(`EEE benefit: Exempt from tax at investment, returns, and maturity`);
  
  nextSteps.push("Open family members' PPF accounts if not done");
  nextSteps.push("Set up SIP for systematic PPF contribution");
  nextSteps.push("Track PPF balance and interest credits");

  const summary = `Your PPF investment of ₹${data.annualContribution.toLocaleString()} annually will grow to ₹${data.finalAmount.toLocaleString()} tax-free over ${data.years} years.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateSIPRecommendations(
  data: SIPAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Return expectations
  if (data.expectedReturn > 15) {
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "Aggressive Return Expectations",
      description: `Expected return of ${data.expectedReturn}% may be too optimistic for equity markets.`,
      actionItems: [
        "Consider more realistic return expectations (10-12%)",
        "Factor in market volatility and economic cycles",
        "Plan for potential underperformance scenarios",
        "Review and adjust expectations based on fund performance"
      ]
    });
    riskFactors.push("High return expectations may lead to investment disappointment");
  }

  // SIP amount optimization
  const sipToIncomeRatio = userContext?.income ? (data.monthlyInvestment * 12 / userContext.income) * 100 : null;
  if (sipToIncomeRatio && sipToIncomeRatio < 10) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Increase SIP Amount",
      description: `SIP represents only ${sipToIncomeRatio.toFixed(1)}% of income. Consider increasing for better wealth creation.`,
      actionItems: [
        "Aim for 15-20% of income in equity investments",
        "Set up SIP top-up facility for annual increases",
        "Use increment/bonus for additional SIP",
        "Consider step-up SIP with salary growth"
      ]
    });
  }

  // Diversification strategy
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Diversification Strategy",
    description: "Ensure proper diversification across asset classes and fund categories.",
    actionItems: [
      "Diversify across large-cap, mid-cap, and small-cap funds",
      "Consider international equity funds for global exposure",
      "Add debt funds for stability and asset allocation",
      "Review and rebalance portfolio annually"
    ]
  });

  // Goal-based planning
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Goal-Based Investment",
    description: "Align SIP investments with specific financial goals.",
    actionItems: [
      "Define clear investment goals (retirement, children's education, etc.)",
      "Match investment tenure with goal timeline",
      "Adjust asset allocation based on goal proximity",
      "Set up separate SIPs for different goals"
    ]
  });

  keyInsights.push(`Total investment over ${data.years} years: ₹${data.totalInvestment.toLocaleString()}`);
  keyInsights.push(`Wealth gained through compounding: ₹${data.wealthGained.toLocaleString()}`);
  keyInsights.push(`Power of rupee cost averaging in volatile markets`);
  
  nextSteps.push("Choose appropriate mutual fund schemes based on risk profile");
  nextSteps.push("Set up auto-debit for SIP consistency");
  nextSteps.push("Review fund performance quarterly");

  const summary = `Your monthly SIP of ₹${data.monthlyInvestment.toLocaleString()} will grow to ₹${data.finalAmount.toLocaleString()} over ${data.years} years, generating wealth of ₹${data.wealthGained.toLocaleString()}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}