import { AnalysisResponse, Recommendation } from "../types";

export function generateEMIRecommendations(
  data: any,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const loanAmount = data.loanAmount || 0;
  const interestRate = data.interestRate || 0;
  const tenure = data.tenure || 0;
  const emi = data.emi || 0;
  const totalInterest = data.totalInterest || 0;
  const totalPayment = data.totalPayment || 0;

  const interestPercentage = (totalInterest / totalPayment) * 100;
  const principalPercentage = (loanAmount / totalPayment) * 100;

  keyInsights.push(`Total Interest: ₹${totalInterest.toLocaleString()} (${interestPercentage.toFixed(1)}% of total payment)`);
  keyInsights.push(`Principal Amount: ₹${loanAmount.toLocaleString()} (${principalPercentage.toFixed(1)}% of total payment)`);
  keyInsights.push(`Loan Tenure: ${Math.floor(tenure / 12)} years ${tenure % 12} months`);

  if (interestPercentage > 60) {
    keyInsights.push("⚠️ Interest exceeds 60% of total payment - consider shorter tenure to save significantly");
  } else if (interestPercentage > 50) {
    keyInsights.push("Interest is over 50% of total payment - prepayment can reduce this substantially");
  } else {
    keyInsights.push("✓ Reasonable interest-to-principal ratio for this tenure");
  }

  if (tenure > 240) {
    riskFactors.push("Very long tenure (20+ years) means paying 2-3x the principal in interest");
    riskFactors.push("Interest rate changes can significantly impact your total cost over this period");
    
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Reduce Loan Tenure to Save Lakhs",
      description: `With a ${Math.floor(tenure / 12)}-year tenure, you're paying ₹${totalInterest.toLocaleString()} in interest. Reducing tenure by 5 years could save ₹${Math.floor(totalInterest * 0.2).toLocaleString()} or more.`,
      actionItems: [
        `Try to increase EMI by 10-15% to reduce tenure by 3-5 years`,
        `Every ₹1 lakh prepayment in first 5 years can save ₹40,000-60,000 in interest`,
        `Consider step-up EMI option that increases 5% annually with your salary`,
        `Use annual bonuses or tax refunds for partial prepayment`
      ],
      potentialSavings: Math.floor(totalInterest * 0.2)
    });
  }

  if (interestRate > 9) {
    riskFactors.push(`Interest rate of ${interestRate}% is on the higher side for home loans`);
    
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Consider Balance Transfer for Lower Rate",
      description: `At ${interestRate}% interest, you could save significantly with a balance transfer to a lender offering 8-8.5%. Even a 0.5% reduction can save lakhs over the tenure.`,
      actionItems: [
        `Check current market rates - many lenders offer 8-8.75% for home loans`,
        `Calculate break-even: processing fee (0.5-1%) vs interest savings`,
        `Negotiate with current lender first - they may match competitive rates`,
        `Good credit score (750+) qualifies you for best rates`
      ],
      estimatedImpact: "0.5% rate reduction can save ₹50,000-2,00,000 depending on loan size"
    });
  } else if (interestRate >= 8 && interestRate <= 9) {
    keyInsights.push(`Competitive interest rate of ${interestRate}% - within market range`);
  } else {
    keyInsights.push(`Excellent interest rate of ${interestRate}% - below market average`);
  }

  if (loanAmount >= 2500000) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Maximize Tax Benefits on Home Loan",
      description: "You can claim significant tax deductions on both principal and interest components of your home loan EMI.",
      actionItems: [
        `Section 80C: Deduct up to ₹1.5 lakh on principal repayment annually`,
        `Section 24(b): Deduct up to ₹2 lakh on interest paid annually`,
        `Section 80EEA: First-time buyers get additional ₹1.5 lakh on interest (conditions apply)`,
        `Combined tax benefit can be ₹5 lakh+ at 30% tax bracket`,
        `Keep all loan certificates and statements for ITR filing`
      ],
      potentialSavings: 150000
    });
  }

  const annualEMI = emi * 12;
  if (userContext?.income && annualEMI > userContext.income * 0.4) {
    riskFactors.push("EMI exceeds 40% of annual income - may strain monthly budget");
    riskFactors.push("Limited room for other savings and investments");
    
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "EMI-to-Income Ratio Too High",
      description: `Your annual EMI (₹${annualEMI.toLocaleString()}) is more than 40% of income. Financial experts recommend keeping total EMIs under 40-50% of monthly income.`,
      actionItems: [
        `Maintain emergency fund of 6 months expenses before taking loan`,
        `Avoid taking additional loans (car, personal) for 2-3 years`,
        `Consider co-applicant to improve affordability ratio`,
        `If possible, increase down payment to reduce loan amount`
      ]
    });
  }

  const prepaymentSavings = totalInterest * 0.3;
  recommendations.push({
    type: "optimization",
    priority: "medium",
    title: "Prepayment Strategy to Save Interest",
    description: `Regular prepayments can reduce your interest burden significantly. Even ₹50,000-1,00,000 annual prepayment can save ₹${Math.floor(prepaymentSavings).toLocaleString()} over the loan tenure.`,
    actionItems: [
      `Make prepayments in first 5-7 years for maximum impact`,
      `Most banks allow partial prepayment without penalty for floating rate loans`,
      `Choose "reduce tenure" option over "reduce EMI" for maximum interest savings`,
      `Prepay ₹1 lakh annually: can reduce 20-year tenure to 13-15 years`,
      `Use windfall gains (bonus, inheritance, tax refunds) for prepayment`
    ],
    potentialSavings: Math.floor(prepaymentSavings),
    estimatedImpact: "30-40% reduction in total interest paid"
  });

  if (interestRate > 8.5) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Monitor Interest Rate Changes",
      description: `If you have a floating rate loan, monitor MCLR/repo rate changes. RBI rate cuts should reflect in your EMI within 3-6 months based on reset frequency.`,
      actionItems: [
        `Check if your loan is linked to MCLR or repo rate`,
        `Repo-linked loans adjust faster to RBI rate changes`,
        `If MCLR-linked, note your reset date (annual/quarterly)`,
        `Switch to repo-linked if available - more transparent and responsive`
      ]
    });
  }

  if (tenure >= 120) {
    recommendations.push({
      type: "strategy",
      priority: "low",
      title: "Step-Up EMI for Growing Income",
      description: "If you expect salary growth, opt for step-up EMI that increases 5-10% annually. This matches your income growth and reduces interest burden.",
      actionItems: [
        `Check if your lender offers step-up EMI facility`,
        `Suitable for young professionals in 20s-30s with expected income growth`,
        `Can reduce tenure by 3-5 years vs fixed EMI`,
        `Alternatively, voluntarily increase EMI by 10% every 2 years`
      ]
    });
  }

  nextSteps.push("Set up auto-debit for EMI to avoid missing payments (impacts CIBIL score)");
  nextSteps.push("Take home loan insurance to protect your family from loan burden");
  nextSteps.push("Review your loan statement annually to track principal vs interest breakdown");
  nextSteps.push("Keep all loan documents safe: sanction letter, loan agreement, property papers");
  
  if (loanAmount >= 2500000) {
    nextSteps.push("Consult CA to optimize tax benefits under Sections 80C, 24(b), and 80EEA");
  }
  
  nextSteps.push("Build emergency fund of 6 months expenses before aggressive prepayment");

  const summary = `Your monthly EMI is ₹${Math.floor(emi).toLocaleString()} for a ${Math.floor(tenure / 12)}-year loan of ₹${loanAmount.toLocaleString()} at ${interestRate}% interest. You'll pay ₹${totalInterest.toLocaleString()} as interest, which is ${interestPercentage.toFixed(1)}% of your total payment. ${
    interestPercentage > 50
      ? `Consider prepayment or tenure reduction to save significantly on interest.`
      : `This is a reasonable interest-to-principal ratio for your tenure.`
  } ${
    loanAmount >= 2500000
      ? `Don't forget to claim tax benefits worth up to ₹1.5 lakh annually under Sections 80C and 24(b).`
      : ``
  }`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps,
  };
}
