import { describe, expect, test } from "vitest";
import { analyze } from "./analyze";

describe("AI Analysis Service - Comprehensive Tests", () => {
  describe("Edge Cases and Validation", () => {
    test("handles zero or negative values gracefully", async () => {
      const result = await analyze({
        calculatorType: "mortgage",
        data: {
          loanAmount: 0,
          interestRate: 0,
          loanTerm: 0,
          downPayment: 0,
          propertyValue: 0,
          monthlyPayment: 0,
          totalInterest: 0,
          totalPayment: 0
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    test("handles extremely high values", async () => {
      const result = await analyze({
        calculatorType: "investment",
        data: {
          initialInvestment: 10000000,
          monthlyContribution: 100000,
          annualReturn: 50,
          years: 50,
          finalAmount: 100000000000,
          totalContributions: 60000000,
          totalReturn: 99940000000
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      // Should warn about unrealistic returns
      const unrealisticWarning = result.recommendations.find(r => 
        r.type === "warning" && (
          r.title.toLowerCase().includes("unrealistic") ||
          r.title.toLowerCase().includes("optimistic")
        )
      );
      expect(unrealisticWarning).toBeDefined();
    });
  });

  describe("BMI Analysis", () => {
    test("provides appropriate recommendations for underweight BMI", async () => {
      const result = await analyze({
        calculatorType: "bmi",
        data: {
          bmi: 17.5,
          category: "Underweight",
          height: 170,
          weight: 50,
          unit: "metric",
          riskLevel: "Medium",
          idealWeightRange: { min: 55, max: 72 }
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      const healthWarning = result.recommendations.find(r => 
        r.priority === "high" && r.type === "warning"
      );
      expect(healthWarning).toBeDefined();
    });

    test("provides recommendations for obese BMI", async () => {
      const result = await analyze({
        calculatorType: "bmi",
        data: {
          bmi: 35.0,
          category: "Obese",
          height: 170,
          weight: 100,
          unit: "metric",
          riskLevel: "High",
          idealWeightRange: { min: 53, max: 72 }
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      expect(result.riskFactors.length).toBeGreaterThan(0);
    });
  });

  describe("Student Loan Analysis", () => {
    test("identifies high interest rates and repayment strategies", async () => {
      const result = await analyze({
        calculatorType: "student-loan",
        data: {
          loanAmount: 50000,
          interestRate: 8.5,
          loanTerm: 10,
          repaymentPlan: "Standard",
          monthlyPayment: 623,
          totalInterest: 24760,
          totalPayment: 74760
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      // Should have strategy recommendations
      const strategyRec = result.recommendations.find(r => r.type === "strategy");
      expect(strategyRec).toBeDefined();
    });
  });

  describe("Auto Loan Analysis", () => {
    test("warns about poor affordability ratio", async () => {
      const result = await analyze({
        calculatorType: "auto-loan",
        data: {
          vehiclePrice: 80000,
          downPayment: 5000,
          interestRate: 12.0,
          loanTerm: 84,
          monthlyPayment: 1200,
          totalInterest: 25000,
          affordabilityRatio: 0.4  // 40% of income - too high
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      const affordabilityWarning = result.recommendations.find(r => 
        r.priority === "high" && 
        r.title.toLowerCase().includes("affordability")
      );
      expect(affordabilityWarning).toBeDefined();
    });
  });

  describe("HELOC Analysis", () => {
    test("warns about high loan-to-value ratio", async () => {
      const result = await analyze({
        calculatorType: "heloc",
        data: {
          homeValue: 400000,
          mortgageBalance: 300000,
          maxCreditLine: 80000,
          interestRate: 8.5,
          drawAmount: 75000,
          monthlyInterestOnly: 531,
          monthlyPrincipalAndInterest: 750,
          loanToValueRatio: 0.95  // 95% LTV - very high
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      const ltvWarning = result.recommendations.find(r => 
        r.priority === "high" && 
        r.title.toLowerCase().includes("loan-to-value")
      );
      expect(ltvWarning).toBeDefined();
    });
  });

  describe("Business Loan Analysis", () => {
    test("identifies poor debt service coverage ratio", async () => {
      const result = await analyze({
        calculatorType: "business-loan",
        data: {
          loanAmount: 100000,
          interestRate: 9.0,
          loanTerm: 5,
          loanType: "Term Loan",
          monthlyPayment: 2076,
          totalInterest: 24560,
          debtServiceCoverageRatio: 1.05,  // Barely above 1.0
          monthlyRevenue: 15000
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      const cashFlowWarning = result.recommendations.find(r => 
        r.priority === "high" && (
          r.title.toLowerCase().includes("cash flow") ||
          r.title.toLowerCase().includes("debt service")
        )
      );
      expect(cashFlowWarning).toBeDefined();
    });
  });

  describe("Debt Consolidation Analysis", () => {
    test("validates consolidation benefits", async () => {
      const result = await analyze({
        calculatorType: "debt-consolidation",
        data: {
          currentTotalBalance: 25000,
          currentWeightedAPR: 22.5,
          consolidationRate: 8.5,
          consolidationTerm: 60,
          currentTotalMinimumPayments: 750,
          newMonthlyPayment: 512,
          totalSavings: 15000,
          monthlySavings: 238
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      // Should highlight savings opportunity
      const savingsOpportunity = result.recommendations.find(r => 
        r.type === "opportunity" && r.potentialSavings && r.potentialSavings > 0
      );
      expect(savingsOpportunity).toBeDefined();
    });

    test("warns when consolidation offers minimal benefits", async () => {
      const result = await analyze({
        calculatorType: "debt-consolidation",
        data: {
          currentTotalBalance: 10000,
          currentWeightedAPR: 12.0,
          consolidationRate: 11.5,
          consolidationTerm: 60,
          currentTotalMinimumPayments: 300,
          newMonthlyPayment: 295,
          totalSavings: 500,  // Minimal savings
          monthlySavings: 5
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      // Should warn about minimal benefit
      const minimalBenefitWarning = result.recommendations.find(r => 
        r.type === "warning" && 
        r.title.toLowerCase().includes("minimal")
      );
      expect(minimalBenefitWarning).toBeDefined();
    });
  });

  describe("User Context Integration", () => {
    test("provides age-appropriate investment recommendations", async () => {
      const youngInvestorResult = await analyze({
        calculatorType: "investment",
        data: {
          initialInvestment: 5000,
          monthlyContribution: 500,
          annualReturn: 8,
          years: 40,
          finalAmount: 1500000,
          totalContributions: 245000,
          totalReturn: 1255000
        },
        userContext: {
          age: 25,
          riskTolerance: "high"
        }
      });

      const olderInvestorResult = await analyze({
        calculatorType: "investment",
        data: {
          initialInvestment: 100000,
          monthlyContribution: 2000,
          annualReturn: 8,
          years: 10,
          finalAmount: 400000,
          totalContributions: 340000,
          totalReturn: 60000
        },
        userContext: {
          age: 55,
          riskTolerance: "low"
        }
      });

      // Young investor should get growth-focused recommendations
      expect(youngInvestorResult.recommendations.length).toBeGreaterThan(0);
      
      // Older investor should get more conservative recommendations
      expect(olderInvestorResult.recommendations.length).toBeGreaterThan(0);
      
      // Recommendations should differ based on age
      expect(youngInvestorResult.summary).not.toBe(olderInvestorResult.summary);
    });

    test("considers income level in recommendations", async () => {
      const result = await analyze({
        calculatorType: "emergency-fund",
        data: {
          monthlyExpenses: 8000,
          targetMonths: 6,
          currentSavings: 5000,
          targetAmount: 48000,
          shortfall: 43000,
          monthlyContribution: 1000
        },
        userContext: {
          income: 15000,  // High income relative to expenses
          riskTolerance: "medium"
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations.length).toBeGreaterThan(0);
      
      // Should suggest higher contributions given good income
      const contributionRec = result.recommendations.find(r => 
        r.title.toLowerCase().includes("contribution") ||
        r.title.toLowerCase().includes("saving")
      );
      expect(contributionRec).toBeDefined();
    });
  });

  describe("Risk Assessment", () => {
    test("identifies multiple risk factors in complex scenarios", async () => {
      const result = await analyze({
        calculatorType: "mortgage",
        data: {
          loanAmount: 800000,
          interestRate: 8.0,  // High rate
          loanTerm: 30,
          downPayment: 40000,  // Low down payment (5%)
          propertyValue: 840000,
          monthlyPayment: 5870,
          totalInterest: 1313200,
          totalPayment: 2113200,
          pmi: 350,  // High PMI
          propertyTax: 1200,
          insurance: 300
        },
        userContext: {
          age: 28,
          income: 12000  // High debt-to-income ratio
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.riskFactors.length).toBeGreaterThan(2);  // Multiple risks
      
      // Should have high priority warnings
      const highPriorityWarnings = result.recommendations.filter(r => 
        r.priority === "high" && r.type === "warning"
      );
      expect(highPriorityWarnings.length).toBeGreaterThan(0);
    });
  });

  describe("Percentage Calculator Analysis", () => {
    test("provides context for percentage calculations", async () => {
      const result = await analyze({
        calculatorType: "percentage",
        data: {
          type: "percentage_of",
          result1: 500,  // 25% of 2000
          inputs: {
            percentage: 25,
            number: 2000
          }
        }
      });

      expect(result.summary).toBeDefined();
      expect(result.recommendations).toBeDefined();
      expect(result.keyInsights.length).toBeGreaterThan(0);
    });
  });
});