import { IncomeTaxAustraliaAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateIncomeTaxAustraliaRecommendations(
  data: IncomeTaxAustraliaAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const isResident = data.residencyStatus === 'resident';

  if (data.effectiveTaxRate > 30) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "High Tax Burden - Tax Minimization Strategies",
      description: `Effective tax rate of ${data.effectiveTaxRate.toFixed(1)}% indicates significant tax liability. Consider tax optimization strategies.`,
      actionItems: [
        "Maximize salary sacrifice to superannuation (up to $30,000 concessional cap)",
        "Claim all eligible work-related deductions (home office, tools, training)",
        "Consider negative gearing if investing in property",
        "Explore income splitting opportunities with spouse",
        "Make use of tax offsets like Low Income Tax Offset (LITO)"
      ],
      potentialSavings: Math.round(data.grossIncome * 0.05)
    });
  }

  if (data.grossIncome > 100000 && data.grossIncome < 180000) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Salary Sacrifice to Superannuation",
      description: "High marginal tax rate makes super contributions highly tax-effective.",
      actionItems: [
        "Contribute up to $30,000 annually via salary sacrifice (taxed at 15% in super)",
        "Save up to 30% tax compared to income tax on contributions",
        "Consider Division 293 tax if income exceeds $250,000",
        "Use unused concessional cap carry-forward if applicable",
        "Review super fund performance and fees"
      ],
      potentialSavings: Math.round(Math.min(30000, data.grossIncome * 0.1) * (data.marginalTaxRate / 100 - 0.15))
    });
  }

  if (data.hasHELP === 'yes' && data.helpRepayment > 0) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "HELP Debt Management",
      description: `HELP repayment of $${data.helpRepayment.toLocaleString()} is required based on your income.`,
      actionItems: [
        "HELP debt is indexed annually - consider voluntary repayments to reduce indexation",
        "Plan for HELP repayments in your budget and cash flow",
        "Salary sacrifice to super can reduce reportable income and HELP repayment",
        "Voluntary repayments receive 10% bonus (effective until debt is paid)",
        "Check if income will cross next HELP threshold to optimize salary sacrifice"
      ]
    });
    keyInsights.push(`HELP debt repayment: $${data.helpRepayment.toLocaleString()}`);
  }

  if (isResident && data.medicareLevy > 0 && data.grossIncome > 97000) {
    const mls = data.grossIncome * 0.01;
    if (data.grossIncome > 97000 && data.hasMedicare === 'full') {
      recommendations.push({
        type: "warning",
        priority: "medium",
        title: "Medicare Levy Surcharge Risk",
        description: `Income above $97,000 threshold may trigger Medicare Levy Surcharge without private health insurance.`,
        actionItems: [
          "Consider private health insurance to avoid 1-1.5% Medicare Levy Surcharge",
          "Compare cost of appropriate private health cover vs MLS liability",
          "Family threshold is $194,000 for couples",
          "Hospital cover must meet minimum requirements to avoid MLS",
          "Register private health insurance by June 30 to avoid surcharge"
        ],
        potentialSavings: Math.round(mls)
      });
    }
  }

  if (data.marginalTaxRate >= 37) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Investment Income Tax Planning",
      description: "High marginal rate makes certain investment strategies advantageous.",
      actionItems: [
        "Franked dividends provide tax benefits for Australian shares",
        "Capital gains held >12 months receive 50% CGT discount",
        "Consider investment bonds for tax-effective investing",
        "Negative gearing becomes more valuable at higher tax brackets",
        "Explore tax-efficient ETFs and managed funds"
      ]
    });
  }

  if (data.grossIncome < 45000 && isResident) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Low Income Tax Offset (LITO) Benefits",
      description: "Eligible for enhanced tax offsets at lower income levels.",
      actionItems: [
        "Automatically receive up to $700 Low Income Tax Offset",
        "Consider government co-contributions for super (up to $500)",
        "Explore low income superannuation tax offset (LISTO)",
        "Check eligibility for Family Tax Benefit supplements",
        "Investigate Commonwealth Seniors Health Card benefits if over 60"
      ],
      potentialSavings: 700
    });
  }

  if (data.marginalTaxRate === 45 && data.grossIncome > 250000) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "High Income Tax Strategies",
      description: "Top marginal tax rate requires comprehensive tax planning.",
      actionItems: [
        "Division 293 tax applies to super contributions (additional 15%)",
        "Consider family trust structures for income splitting",
        "Maximize negatively geared investment deductions",
        "Explore business structure optimization if self-employed",
        "Engage tax advisor for advanced tax planning strategies",
        "Review timing of income and deductions across financial years"
      ]
    });
    riskFactors.push("Division 293 tax adds 15% to super contributions over $250k income");
  }

  if (!isResident) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Foreign Resident Tax Implications",
      description: "Foreign residents face different tax treatment in Australia.",
      actionItems: [
        "No tax-free threshold - all income taxed from first dollar",
        "Not liable for Medicare Levy (2% saving)",
        "Capital gains from Australian assets are taxable",
        "No access to most tax offsets and family benefits",
        "Consider tax treaty benefits if available with home country",
        "Review residency status regularly as circumstances change"
      ]
    });
    keyInsights.push("Foreign resident status - no tax-free threshold or Medicare Levy");
  }

  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Maximize Tax Deductions",
    description: "Ensure you're claiming all eligible deductions to reduce taxable income.",
    actionItems: [
      "Work-related expenses: tools, equipment, uniforms, training",
      "Home office deductions if working from home",
      "Motor vehicle expenses for work-related travel",
      "Self-education expenses related to current employment",
      "Income protection insurance premiums",
      "Tax agent fees and investment property expenses",
      "Donations to registered charities (DGR status required)"
    ]
  });

  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Tax Planning Throughout the Year",
    description: "Proactive tax planning can optimize your tax position.",
    actionItems: [
      "Review PAYG withholding to avoid large tax bills or refunds",
      "Time major deductions before June 30 financial year end",
      "Pre-pay deductible expenses in high-income years",
      "Defer income to lower-income years if possible",
      "Keep detailed records and receipts for all deductions",
      "Use myDeductions app to track work expenses year-round",
      "Lodge tax return early to receive refunds sooner"
    ]
  });

  if (data.grossIncome > 180000) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Temporary Budget Repair Levy Considerations",
      description: "High income earners should review tax position carefully.",
      actionItems: [
        "Monitor income levels near tax bracket thresholds",
        "Consider timing of bonuses and investment income",
        "Review employment structure (PAYG vs contractor)",
        "Explore spouse super contributions for tax deduction",
        "Investigate personal services income rules if contracting"
      ]
    });
  }

  keyInsights.push(`Gross income: $${data.grossIncome.toLocaleString()}`);
  keyInsights.push(`Total tax: $${data.totalTax.toLocaleString()}`);
  keyInsights.push(`Net income: $${data.netIncome.toLocaleString()}`);
  keyInsights.push(`Effective tax rate: ${data.effectiveTaxRate.toFixed(1)}%`);
  keyInsights.push(`Marginal tax rate: ${data.marginalTaxRate}%`);
  
  if (data.medicareLevy > 0) {
    keyInsights.push(`Medicare Levy: $${data.medicareLevy.toLocaleString()}`);
  }

  nextSteps.push("Review and maximize all eligible tax deductions");
  nextSteps.push("Consider salary sacrifice to superannuation for tax savings");
  nextSteps.push("Keep detailed records of work-related expenses");
  nextSteps.push("Lodge tax return by October 31 or use registered tax agent");
  nextSteps.push("Review tax position quarterly to avoid surprises");

  const summary = `On an income of $${data.grossIncome.toLocaleString()}, you'll pay $${data.totalTax.toLocaleString()} in total tax (${data.effectiveTaxRate.toFixed(1)}% effective rate), leaving net income of $${data.netIncome.toLocaleString()}. Your marginal tax rate is ${data.marginalTaxRate}%.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}
