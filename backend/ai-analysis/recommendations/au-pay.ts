import { AnalysisResponse, Recommendation, AUPayAnalysisData } from "../types";

export function generateAUPayRecommendations(
  data: AUPayAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const isResident = data.residency === 'resident';
  const periodLabel = {
    weekly: 'Weekly',
    fortnightly: 'Fortnightly',
    monthly: 'Monthly',
    annual: 'Annual',
  }[data.period];

  if (data.effectiveTaxRate > 30 && isResident) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "High Tax Burden - Salary Sacrifice Opportunity",
      description: `Effective tax rate of ${data.effectiveTaxRate.toFixed(1)}% indicates significant potential savings through salary sacrifice.`,
      actionItems: [
        `Salary sacrifice to super saves ${data.marginalTaxRate - 15}% in tax (marginal rate ${data.marginalTaxRate}% vs super rate 15%)`,
        "Contribute up to $30,000 annually via salary sacrifice (concessional cap)",
        "Reduces taxable income, lowering income tax and HELP repayments",
        "Check with employer about salary sacrifice arrangements",
        "Consider Division 293 tax if income exceeds $250,000"
      ],
      potentialSavings: Math.round(Math.min(30000, data.grossAnnual * 0.1) * ((data.marginalTaxRate - 15) / 100))
    });
  }

  if (data.grossAnnual > 100000 && data.marginalTaxRate >= 37) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Tax-Effective Super Contributions",
      description: "High marginal tax rate makes super contributions highly attractive.",
      actionItems: [
        `Save ${data.marginalTaxRate - 15}% on each dollar contributed to super via salary sacrifice`,
        "Maximum $30,000 concessional contributions per year",
        "Use unused concessional cap carry-forward if total super balance < $500k",
        "Consider spouse super contributions for additional tax deduction",
        "Review super fund performance and fees regularly"
      ],
      potentialSavings: Math.round(30000 * ((data.marginalTaxRate - 15) / 100))
    });
  }

  if (data.hasHelp && data.helpRepayment > 0) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "HELP Debt Management Strategy",
      description: `Annual HELP repayment of ${formatCurrency(data.helpRepayment)} based on your income.`,
      actionItems: [
        "HELP debt is indexed annually on June 1 - consider voluntary repayments before indexation",
        "Salary sacrifice to super reduces HELP repayment income",
        "Voluntary repayments can be made anytime to reduce debt",
        `Budget for ${formatCurrency(data.helpRepayment / (data.period === 'weekly' ? 52 : data.period === 'fortnightly' ? 26 : data.period === 'monthly' ? 12 : 1))} per ${data.period} for HELP`,
        "Track HELP balance via myGov to plan payoff strategy"
      ]
    });
    keyInsights.push(`HELP repayment: ${formatCurrency(data.helpRepayment)} per year`);
  }

  if (isResident && data.grossAnnual > 97000 && data.medicareLevySurcharge === 0) {
    const potentialMLS = data.grossAnnual * 0.01;
    recommendations.push({
      type: "warning",
      priority: "medium",
      title: "Medicare Levy Surcharge Risk",
      description: "Income above $97,000 threshold - ensure you maintain adequate private health cover.",
      actionItems: [
        "Maintain hospital cover with minimum required benefits to avoid MLS",
        "MLS ranges from 1.0% to 1.5% depending on income tier",
        `Potential MLS liability: ${formatCurrency(potentialMLS)} if cover lapses`,
        "Register new cover before June 30 to avoid surcharge for full year",
        "Family threshold is $194,000 (plus $1,500 per child after first)"
      ],
      potentialSavings: Math.round(potentialMLS)
    });
  }

  if (data.medicareLevySurcharge > 0) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Medicare Levy Surcharge Applied",
      description: `Currently paying ${formatCurrency(data.medicareLevySurcharge)} in MLS - consider private health insurance.`,
      actionItems: [
        `Paying ${formatCurrency(data.medicareLevySurcharge)} annually in MLS`,
        "Compare cost of appropriate private hospital cover vs MLS",
        "Private health insurance provides both tax benefit and health coverage",
        "Hospital cover must meet minimum requirements to avoid MLS",
        "Take out cover before June 30 to avoid surcharge for current year"
      ],
      potentialSavings: Math.round(data.medicareLevySurcharge)
    });
    riskFactors.push(`Medicare Levy Surcharge: ${formatCurrency(data.medicareLevySurcharge)}/yr`);
  }

  if (data.lito > 0) {
    keyInsights.push(`Receiving Low Income Tax Offset (LITO): ${formatCurrency(data.lito)}`);
  }

  if (data.marginalTaxRate >= 37) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Investment Tax Planning",
      description: "High marginal rate makes tax-effective investment strategies valuable.",
      actionItems: [
        "Franked dividends from Australian shares provide tax credits",
        "Capital gains held >12 months receive 50% CGT discount",
        "Consider negative gearing for investment property deductions",
        "Tax-effective investment options: super, investment bonds, ETFs",
        "Maximize work-related deductions and investment expenses"
      ]
    });
  }

  if (data.grossAnnual < 45000 && isResident) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Low Income Support & Super Co-Contribution",
      description: "Eligible for government support programs at lower income levels.",
      actionItems: [
        `Receiving ${formatCurrency(data.lito)} Low Income Tax Offset automatically`,
        "Government super co-contribution: up to $500 for eligible contributions",
        "Low Income Superannuation Tax Offset (LISTO) refunds 15% tax on contributions",
        "Check eligibility for Family Tax Benefit and supplements",
        "Consider Commonwealth Seniors Health Card if over 60"
      ],
      potentialSavings: 500
    });
  }

  if (!isResident) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Foreign Resident Tax Treatment",
      description: "Different tax rules apply to foreign residents in Australia.",
      actionItems: [
        "No tax-free threshold - all income taxed from first dollar",
        "Not liable for Medicare Levy (2% saving)",
        "Limited access to tax offsets and government benefits",
        "May be eligible for tax treaty benefits with home country",
        "Review residency status if circumstances change",
        "Consider departing Australia super payment (DASP) rules"
      ]
    });
    keyInsights.push("Foreign resident status - no tax-free threshold or Medicare Levy");
  }

  if (data.residency === 'whm') {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Working Holiday Maker Tax Rates",
      description: "Special tax rates apply to working holiday makers.",
      actionItems: [
        "15% tax on income up to $45,000",
        "32.5% tax on income $45,001 to $120,000",
        "Not eligible for tax-free threshold",
        "No Medicare Levy on WHM income",
        "Can claim certain work-related deductions",
        "May be eligible for superannuation refund when leaving Australia"
      ]
    });
  }

  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Maximize Your Tax Deductions",
    description: "Ensure you're claiming all eligible work-related expenses.",
    actionItems: [
      "Work-related expenses: tools, equipment, uniforms, training courses",
      "Home office deductions if working from home (fixed rate or actual cost)",
      "Motor vehicle expenses for work-related travel (logbook or cents per km)",
      "Self-education expenses related to current employment",
      "Income protection insurance premiums",
      "Tax agent fees and investment property expenses",
      "Use myDeductions app to track expenses throughout the year"
    ]
  });

  const superRate = data.year === '2024-25' ? 11.5 : 12.0;
  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Superannuation Strategy",
    description: `Employer contributing ${formatCurrency(data.superannuation)} annually (${superRate}% SG).`,
    actionItems: [
      `Employer super: ${formatCurrency(data.superannuation)} per year (${superRate}% of ordinary time earnings)`,
      "Consider additional voluntary contributions to boost retirement savings",
      "Salary sacrifice contributions taxed at 15% vs your marginal rate",
      "Check if employer offers super matching or co-contribution",
      "Review super fund performance, fees, and insurance annually",
      "Consolidate multiple super accounts to reduce fees"
    ]
  });

  keyInsights.push(`Gross income: ${formatCurrency(data.grossAnnual)} per year`);
  keyInsights.push(`Take-home pay: ${formatCurrency(data.netPeriod)} ${data.period}`);
  keyInsights.push(`Total tax: ${formatCurrency(data.totalTax)} (${data.effectiveTaxRate.toFixed(1)}% effective rate)`);
  keyInsights.push(`Marginal tax rate: ${data.marginalTaxRate}%`);
  keyInsights.push(`Superannuation: ${formatCurrency(data.superannuation)} per year (${superRate}%)`);

  if (data.medicareLevy > 0) {
    keyInsights.push(`Medicare Levy: ${formatCurrency(data.medicareLevy)} (2%)`);
  }

  nextSteps.push("Review PAYG withholding on next payslip to ensure accuracy");
  nextSteps.push("Consider salary sacrifice to super for tax savings");
  nextSteps.push("Track work-related expenses for tax deduction claims");
  nextSteps.push("Lodge tax return by October 31 or use registered tax agent");
  nextSteps.push("Review superannuation fund performance and fees");

  if (data.hasHelp) {
    nextSteps.push("Monitor HELP debt balance and plan repayment strategy");
  }

  const summary = `On a salary of ${formatCurrency(data.grossAnnual)}, your take-home pay is ${formatCurrency(data.netPeriod)} ${data.period} (${formatCurrency(data.netAnnual)}/year) after ${formatCurrency(data.totalTax)} in total tax and levies (${data.effectiveTaxRate.toFixed(1)}% effective rate). Your employer also contributes ${formatCurrency(data.superannuation)} to super annually.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
