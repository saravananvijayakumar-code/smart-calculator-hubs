#!/bin/bash

# List of calculators that need AI Analysis added
# Based on grep search, these don't have AIAnalysis or EnhancedAIAnalysis

CALCULATORS_WITHOUT_AI=(
  "/frontend/pages/calculators/india/SIPCalculatorIndia.tsx"
  "/frontend/pages/calculators/india/PPFCalculatorIndia.tsx"
  "/frontend/pages/calculators/india/EPFCalculatorIndia.tsx"
  "/frontend/pages/calculators/india/HomeLoanCalculatorIndia.tsx"
  "/frontend/pages/calculators/australia/StudentLoanCalculatorAustralia.tsx"
  "/frontend/pages/calculators/australia/BonusTaxCalculatorAustralia.tsx"
  "/frontend/pages/calculators/australia/TaxDistributionAustralia.tsx"
  "/frontend/pages/calculators/australia/TaxInfoAustralia.tsx"
  "/frontend/pages/calculators/us/StudentLoanCalculatorUS.tsx"
  "/frontend/pages/calculators/us/AutoLoanCalculatorUS.tsx"
  "/frontend/pages/calculators/us/BusinessLoanCalculatorUS.tsx"
  "/frontend/pages/calculators/us/HELOCCalculatorUS.tsx"
  "/frontend/pages/calculators/us/LoanAffordabilityCalculatorUS.tsx"
  "/frontend/pages/calculators/us/FederalTaxCalculatorUS.tsx"
  "/frontend/pages/calculators/us/RetirementCalculator401k.tsx"
  "/frontend/pages/calculators/uk/ISACalculatorUK.tsx"
  "/frontend/pages/calculators/uk/NationalInsuranceCalculatorUK.tsx"
  "/frontend/pages/calculators/insurance/LifeInsuranceCalculator.tsx"
  "/frontend/pages/calculators/insurance/HealthInsuranceCalculator.tsx"
  "/frontend/pages/calculators/insurance/CarInsuranceCalculator.tsx"
  "/frontend/pages/calculators/financial/SimpleInterestCalculator.tsx"
  "/frontend/pages/calculators/viral/LifeExpectancyCalculator.tsx"
  "/frontend/pages/calculators/viral/LifePathNumberCalculator.tsx"
  "/frontend/pages/calculators/viral/FriendCompatibilityCalculator.tsx"
  "/frontend/pages/calculators/viral/CalorieBurnCalculator.tsx"
  "/frontend/pages/calculators/health/EnhancedBMICalculator.tsx"
  "/frontend/pages/calculators/health/BMICalculatorOld.tsx"
)

echo "Found ${#CALCULATORS_WITHOUT_AI[@]} calculators without AI Analysis"
for calc in "${CALCULATORS_WITHOUT_AI[@]}"; do
  echo "  - $calc"
done
