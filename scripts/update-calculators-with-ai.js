#!/usr/bin/env node

// Script to update all calculator components with AI Analysis
// This maps calculator file names to their analysis types

const fs = require('fs');
const path = require('path');

const calculatorMappings = {
  // US Calculators
  'MortgageCalculatorUS.tsx': { type: 'mortgage-us', title: 'AI Mortgage Analysis' },
  'AutoLoanCalculatorUS.tsx': { type: 'auto-loan', title: 'AI Auto Loan Analysis' },
  'BusinessLoanCalculatorUS.tsx': { type: 'business-loan', title: 'AI Business Loan Analysis' },
  'DebtConsolidationCalculatorUS.tsx': { type: 'debt-consolidation', title: 'AI Debt Consolidation Analysis' },
  'FederalTaxCalculatorUS.tsx': { type: 'federal-tax', title: 'AI Tax Analysis' },
  'HELOCCalculatorUS.tsx': { type: 'heloc', title: 'AI HELOC Analysis' },
  'LoanAffordabilityCalculatorUS.tsx': { type: 'loan-affordability', title: 'AI Loan Affordability Analysis' },
  'LoanCalculatorUS.tsx': { type: 'loan', title: 'AI Loan Analysis' },
  'RetirementCalculator401k.tsx': { type: '401k-retirement', title: 'AI Retirement Analysis' },
  'StateTaxCalculatorUS.tsx': { type: 'state-tax', title: 'AI State Tax Analysis' },
  'StudentLoanCalculatorUS.tsx': { type: 'student-loan', title: 'AI Student Loan Analysis' },
  
  // UK Calculators
  'BTLMortgageCalculatorUK.tsx': { type: 'btl-mortgage-uk', title: 'AI BTL Mortgage Analysis' },
  'ISACalculatorUK.tsx': { type: 'isa-calculator-uk', title: 'AI ISA Analysis' },
  'NationalInsuranceCalculatorUK.tsx': { type: 'national-insurance-uk', title: 'AI National Insurance Analysis' },
  'PensionCalculatorUK.tsx': { type: 'pension-calculator-uk', title: 'AI Pension Analysis' },
  'StampDutyCalculatorUK.tsx': { type: 'stamp-duty-uk', title: 'AI Stamp Duty Analysis' },
  
  // India Calculators
  'EPFCalculatorIndia.tsx': { type: 'epf-calculator-india', title: 'AI EPF Analysis' },
  'HomeLoanCalculatorIndia.tsx': { type: 'home-loan-calculator-india', title: 'AI Home Loan Analysis' },
  'IncomeTaxCalculatorIndia.tsx': { type: 'income-tax-calculator-india', title: 'AI Income Tax Analysis' },
  'PPFCalculatorIndia.tsx': { type: 'ppf-calculator-india', title: 'AI PPF Analysis' },
  'SIPCalculatorIndia.tsx': { type: 'sip-calculator-india', title: 'AI SIP Analysis' },
  
  // Australia Calculators
  'CGTCalculatorAustralia.tsx': { type: 'cgt-calculator-australia', title: 'AI CGT Analysis' },
  'FBTCalculatorAustralia.tsx': { type: 'fbt-calculator-australia', title: 'AI FBT Analysis' },
  'NegativeGearingCalculatorAustralia.tsx': { type: 'negative-gearing-australia', title: 'AI Negative Gearing Analysis' },
  'PropertyTaxCalculatorAustralia.tsx': { type: 'property-tax-australia', title: 'AI Property Tax Analysis' },
  'SuperannuationCalculatorAustralia.tsx': { type: 'superannuation-australia', title: 'AI Superannuation Analysis' },
  
  // Financial Calculators
  'CompoundInterestCalculator.tsx': { type: 'compound-interest', title: 'AI Investment Analysis' },
  'CreditCardPayoffCalculator.tsx': { type: 'credit-card-payoff', title: 'AI Credit Card Analysis' },
  'EmergencyFundCalculator.tsx': { type: 'emergency-fund', title: 'AI Emergency Fund Analysis' },
  'InvestmentCalculator.tsx': { type: 'investment', title: 'AI Investment Analysis' },
  'ROICalculator.tsx': { type: 'roi', title: 'AI ROI Analysis' },
  'RetirementCalculator.tsx': { type: 'retirement', title: 'AI Retirement Analysis' },
  'SimpleInterestCalculator.tsx': { type: 'simple-interest', title: 'AI Investment Analysis' },
  
  // Health Calculators
  'BMICalculator.tsx': { type: 'bmi', title: 'AI Health Analysis' },
  
  // Math Calculators
  'AgeCalculator.tsx': { type: 'age-calculator', title: 'AI Age Analysis' },
  'PercentageCalculator.tsx': { type: 'percentage', title: 'AI Percentage Analysis' },
  'UnitConverter.tsx': { type: 'unit-converter', title: 'AI Unit Conversion Analysis' },
  
  // Utility Calculators
  'CurrencyConverter.tsx': { type: 'currency-converter', title: 'AI Currency Analysis' },
  'TipCalculator.tsx': { type: 'tip-calculator', title: 'AI Tip Analysis' }
};

function findCalculatorFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files.push(...findCalculatorFiles(fullPath));
    } else if (item.endsWith('.tsx') && calculatorMappings[item]) {
      files.push({ path: fullPath, name: item });
    }
  }
  
  return files;
}

function updateCalculatorFile(filePath, fileName) {
  console.log(`Updating ${fileName}...`);
  
  const mapping = calculatorMappings[fileName];
  if (!mapping) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already updated
  if (content.includes('AIAnalysis') && !content.includes('QuickAIInsights')) {
    console.log(`  Already updated: ${fileName}`);
    return;
  }
  
  // Update import statement
  if (content.includes('QuickAIInsights')) {
    content = content.replace(
      /import { QuickAIInsights } from [^;]+;/,
      "import { AIAnalysis } from '../../../components/AIAnalysis';"
    );
  } else {
    // Add import if not present
    const importMatch = content.match(/import[^;]+from '@\/components\/ui\/[^;]+;\n/);
    if (importMatch) {
      const insertPoint = content.indexOf(importMatch[0]) + importMatch[0].length;
      content = content.slice(0, insertPoint) + 
        "import { AIAnalysis } from '../../../components/AIAnalysis';\n" +
        content.slice(insertPoint);
    }
  }
  
  // Update component usage (this is a simplified approach)
  if (content.includes('QuickAIInsights')) {
    content = content.replace(
      /<QuickAIInsights[^>]*>/,
      `<AIAnalysis\n              autoRun={true}\n              title="${mapping.title}"\n              description="Get personalized recommendations and insights based on your calculation results."\n              analysisRequest={{`
    );
    
    content = content.replace('calculatorType: "', `calculatorType: "${mapping.type}"`);
    content = content.replace('/>', '/>');
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`  Updated: ${fileName}`);
}

// Main execution
const calculatorsDir = path.join(__dirname, '../frontend/pages/calculators');
const calculatorFiles = findCalculatorFiles(calculatorsDir);

console.log(`Found ${calculatorFiles.length} calculator files to update:`);
calculatorFiles.forEach(file => console.log(`  - ${file.name}`));
console.log('');

calculatorFiles.forEach(file => {
  updateCalculatorFile(file.path, file.name);
});

console.log('\nUpdate complete!');