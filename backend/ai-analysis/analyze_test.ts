import { describe, expect, test } from "vitest";
import { analyze } from "./analyze";

describe("AI Analysis Service", () => {
  test("mortgage analysis provides recommendations", async () => {
    const result = await analyze({
      calculatorType: "mortgage",
      data: {
        loanAmount: 400000,
        interestRate: 7.5,
        loanTerm: 30,
        downPayment: 40000,
        propertyValue: 500000,
        monthlyPayment: 2797,
        totalInterest: 606920,
        totalPayment: 1006920,
        pmi: 167,
        propertyTax: 500,
        insurance: 208
      }
    });

    expect(result.summary).toBeDefined();
    expect(result.summary.length).toBeGreaterThan(0);
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
    expect(result.keyInsights).toBeDefined();
    expect(Array.isArray(result.keyInsights)).toBe(true);
    expect(result.riskFactors).toBeDefined();
    expect(Array.isArray(result.riskFactors)).toBe(true);
    expect(result.nextSteps).toBeDefined();
    expect(Array.isArray(result.nextSteps)).toBe(true);

    // Should have high-priority recommendations for high LTV and interest rate
    const highPriorityRecs = result.recommendations.filter(r => r.priority === "high");
    expect(highPriorityRecs.length).toBeGreaterThan(0);

    // Should contain LTV ratio insight
    const ltvInsight = result.keyInsights.find(insight => 
      insight.toLowerCase().includes("ltv") || insight.toLowerCase().includes("loan-to-value")
    );
    expect(ltvInsight).toBeDefined();
  });

  test("retirement analysis identifies shortfall", async () => {
    const result = await analyze({
      calculatorType: "retirement",
      data: {
        currentAge: 35,
        retirementAge: 65,
        currentSavings: 50000,
        monthlyContribution: 500,
        expectedReturn: 7,
        retirementGoal: 1500000,
        projectedSavings: 1200000,
        monthlyIncomeNeeded: 5000
      }
    });

    expect(result.summary).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);

    // Should identify shortfall
    const shortfallWarning = result.recommendations.find(r => 
      r.title.toLowerCase().includes("shortfall") && r.priority === "high"
    );
    expect(shortfallWarning).toBeDefined();

    // Should have actionable items
    expect(shortfallWarning?.actionItems.length).toBeGreaterThan(0);
  });

  test("investment analysis provides age-appropriate recommendations", async () => {
    const result = await analyze({
      calculatorType: "investment",
      data: {
        initialInvestment: 10000,
        monthlyContribution: 1000,
        annualReturn: 15, // Unrealistically high
        years: 20,
        finalAmount: 2000000,
        totalContributions: 250000,
        totalReturn: 1750000
      },
      userContext: {
        age: 25,
        riskTolerance: "medium"
      }
    });

    expect(result.summary).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);

    // Should warn about overly optimistic returns
    const returnWarning = result.recommendations.find(r => 
      r.type === "warning" && r.title.toLowerCase().includes("optimistic")
    );
    expect(returnWarning).toBeDefined();

    // Should have asset allocation recommendation
    const assetAllocation = result.recommendations.find(r => 
      r.title.toLowerCase().includes("asset allocation")
    );
    expect(assetAllocation).toBeDefined();
  });

  test("credit card analysis identifies high interest rate", async () => {
    const result = await analyze({
      calculatorType: "credit-card-payoff",
      data: {
        balance: 10000,
        apr: 29.99,
        minimumPayment: 200,
        paymentAmount: 300,
        timeToPayoff: 45,
        totalInterest: 3500,
        totalPayment: 13500
      }
    });

    expect(result.summary).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);

    // Should identify high APR as warning
    const highAprWarning = result.recommendations.find(r => 
      r.priority === "high" && 
      (r.title.toLowerCase().includes("high interest") || r.title.toLowerCase().includes("extremely high"))
    );
    expect(highAprWarning).toBeDefined();

    // Should suggest balance transfer
    const balanceTransfer = result.recommendations.find(r => 
      r.title.toLowerCase().includes("balance transfer")
    );
    expect(balanceTransfer).toBeDefined();
  });

  test("emergency fund analysis provides appropriate urgency", async () => {
    const result = await analyze({
      calculatorType: "emergency-fund",
      data: {
        monthlyExpenses: 4000,
        targetMonths: 6,
        currentSavings: 1000,
        targetAmount: 24000,
        shortfall: 23000,
        monthlyContribution: 500
      }
    });

    expect(result.summary).toBeDefined();
    expect(result.recommendations.length).toBeGreaterThan(0);

    // Should identify insufficient emergency fund
    const insufficientWarning = result.recommendations.find(r => 
      r.priority === "high" && 
      r.title.toLowerCase().includes("insufficient")
    );
    expect(insufficientWarning).toBeDefined();

    // Should have risk factors
    expect(result.riskFactors.length).toBeGreaterThan(0);
  });
});