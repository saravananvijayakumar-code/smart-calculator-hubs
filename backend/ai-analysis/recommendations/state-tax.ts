import type { StateTaxAnalysisData, Recommendation, AnalysisResponse } from "../types";

export function generateStateTaxAnalysis(data: StateTaxAnalysisData, userContext?: any): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Analyze tax efficiency and burden
  const federalTaxRate = data.federalTaxableIncome > 0 ? (data.federalTax / data.federalTaxableIncome) * 100 : 0;
  const stateTaxRate = data.stateTaxableIncome > 0 ? (data.stateTax / data.stateTaxableIncome) * 100 : 0;
  const totalTaxBurden = data.effectiveTaxRate;

  // Income bracket analysis
  const isHighEarner = data.grossIncome > 200000;
  const isMiddleEarner = data.grossIncome >= 50000 && data.grossIncome <= 200000;
  const isLowEarner = data.grossIncome < 50000;

  // State-specific analysis
  const noStateTaxStates = ["TX", "FL", "AK", "NV", "SD", "TN", "WA", "WY", "NH"];
  const highTaxStates = ["CA", "NY", "NJ", "CT", "OR", "MN"];
  const isNoStateTaxState = !data.hasStateIncomeTax;
  const isHighTaxState = highTaxStates.includes(data.state);

  // Generate insights based on tax situation
  if (isNoStateTaxState) {
    keyInsights.push(`Living in ${data.state === "TX" ? "Texas" : data.state === "FL" ? "Florida" : "your state"} provides significant tax advantages with no state income tax, saving you approximately $${data.stateTax.toLocaleString()} annually compared to high-tax states.`);
    
    if (isHighEarner) {
      recommendations.push({
        type: "opportunity",
        priority: "medium",
        title: "Maximize Your No-State-Tax Advantage",
        description: "As a high earner in a no-state-tax state, you're already benefiting from substantial tax savings.",
        actionItems: [
          "Consider additional retirement contributions to reduce federal tax burden",
          "Explore tax-advantaged investment accounts like HSAs and 529 plans",
          "Review itemized deductions vs. standard deduction annually"
        ],
        potentialSavings: Math.round(data.federalTax * 0.05),
        estimatedImpact: "5-10% reduction in total tax burden"
      });
    }
  } else {
    keyInsights.push(`Your state tax burden of $${data.stateTax.toLocaleString()} represents ${stateTaxRate.toFixed(1)}% of your taxable income.`);
    
    if (isHighTaxState && isHighEarner) {
      riskFactors.push("High state tax burden in your current location may significantly impact long-term wealth accumulation");
      
      recommendations.push({
        type: "strategy",
        priority: "high",
        title: "Consider Tax-Efficient Relocation Strategies",
        description: "Your high income in a high-tax state creates substantial tax burden. Consider relocation or tax optimization strategies.",
        actionItems: [
          "Research domicile change to low-tax states for retirement",
          "Maximize pre-tax retirement contributions to reduce current tax burden",
          "Consider tax-loss harvesting for investment accounts",
          "Explore state-specific tax credits and deductions"
        ],
        potentialSavings: Math.round(data.stateTax * 0.7),
        estimatedImpact: "Potential savings of 70%+ of state taxes through relocation"
      });
    }
  }

  // Marginal tax rate analysis
  if (data.marginalTaxRate > 35) {
    riskFactors.push(`High marginal tax rate of ${data.marginalTaxRate.toFixed(1)}% means additional income is heavily taxed`);
    
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Strategic Income and Deduction Planning",
      description: "Your high marginal tax rate makes tax planning crucial for additional income and deductions.",
      actionItems: [
        "Maximize contributions to tax-deferred accounts (401k, IRA, HSA)",
        "Consider timing of bonuses and stock option exercises",
        "Explore tax-efficient investment strategies",
        "Review timing of large deductible expenses"
      ],
      potentialSavings: Math.round(data.grossIncome * 0.02),
      estimatedImpact: "2-5% reduction in effective tax rate"
    });
  }

  // Deduction optimization
  const federalStandardDeductions = {
    single: 14600,
    marriedJointly: 29200,
    marriedSeparately: 14600,
    headOfHousehold: 21900
  };
  
  const standardDed = federalStandardDeductions[data.filingStatus as keyof typeof federalStandardDeductions] || 14600;
  
  if (data.federalDeductions <= standardDed * 1.1) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Explore Itemized Deduction Opportunities",
      description: "You're close to the standard deduction threshold. Exploring itemized deductions could reduce your tax burden.",
      actionItems: [
        "Track charitable contributions throughout the year",
        "Consider bunching deductible expenses in alternating years",
        "Review state and local tax deduction limits (SALT cap)",
        "Explore mortgage interest and property tax deductions"
      ],
      potentialSavings: Math.round((standardDed * 0.2) * (data.marginalTaxRate / 100)),
      estimatedImpact: "Potential additional deductions worth hundreds to thousands"
    });
  }

  // Filing status optimization
  if (data.filingStatus === "marriedSeparately") {
    nextSteps.push("Compare tax liability between married filing separately vs. jointly to optimize your filing status");
  }

  // Effective tax rate insights
  if (totalTaxBurden < 15) {
    keyInsights.push(`Your effective tax rate of ${totalTaxBurden.toFixed(1)}% is relatively low, indicating efficient tax planning or moderate income levels.`);
  } else if (totalTaxBurden > 25) {
    keyInsights.push(`Your effective tax rate of ${totalTaxBurden.toFixed(1)}% is substantial, highlighting opportunities for tax optimization strategies.`);
    
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Comprehensive Tax Reduction Strategy",
      description: "Your high effective tax rate indicates significant opportunities for tax planning and optimization.",
      actionItems: [
        "Consult with a tax professional for advanced strategies",
        "Consider tax-advantaged retirement and healthcare accounts",
        "Evaluate timing of income and deductions",
        "Explore business expense deductions if self-employed"
      ],
      potentialSavings: Math.round(data.totalTax * 0.15),
      estimatedImpact: "10-20% reduction in total tax liability"
    });
  }

  // After-tax income analysis
  const savingsRate = (data.afterTaxIncome - (data.grossIncome * 0.7)) / data.afterTaxIncome;
  if (savingsRate > 0.2) {
    keyInsights.push(`Your after-tax income of $${data.afterTaxIncome.toLocaleString()} provides good potential for savings and investment.`);
  }

  // State-specific recommendations
  if (data.state === "CA") {
    nextSteps.push("Explore California-specific tax credits like the California Earned Income Tax Credit");
    nextSteps.push("Consider timing of stock option exercises due to California's high tax rates");
  } else if (data.state === "NY") {
    nextSteps.push("Review New York State and City tax obligations if living in NYC");
    nextSteps.push("Consider New York's STAR property tax exemption if you own a home");
  }

  // General recommendations
  nextSteps.push("Review and update tax withholdings if receiving large refunds or owing significant amounts");
  nextSteps.push("Consider quarterly estimated payments if you have additional income sources");
  nextSteps.push("Maintain organized records of all deductible expenses throughout the year");

  // Risk factors
  if (data.grossIncome > 400000) {
    riskFactors.push("High income may trigger additional Medicare taxes and net investment income taxes");
  }

  if (isHighTaxState) {
    riskFactors.push("State tax burden may increase with future rate changes or income growth");
  }

  // Summary
  const summary = `Based on your ${data.filingStatus} filing status with $${data.grossIncome.toLocaleString()} gross income in ${data.state === "CA" ? "California" : data.state === "NY" ? "New York" : data.state === "TX" ? "Texas" : data.state === "FL" ? "Florida" : "your state"}, your total tax burden is $${data.totalTax.toLocaleString()} (${totalTaxBurden.toFixed(1)}% effective rate). ${isNoStateTaxState ? "You benefit from no state income tax, saving thousands compared to high-tax states." : `Your state tax of $${data.stateTax.toLocaleString()} represents ${stateTaxRate.toFixed(1)}% of your taxable income.`} ${data.marginalTaxRate > 30 ? "Your high marginal rate emphasizes the importance of strategic tax planning for additional income." : "Your moderate tax rates provide flexibility for income and investment timing."} Key opportunities include ${data.federalDeductions <= standardDed * 1.1 ? "exploring itemized deductions, " : ""}maximizing retirement contributions, and ${isHighTaxState ? "considering long-term relocation strategies." : "optimizing current tax-advantaged accounts."}`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}