# INCOMPLETE CALCULATOR TASKS - DETAILED SPECIFICATION

**Created:** 2025-10-01  
**Status:** 0 out of 10 calculators completed  
**Purpose:** Track all calculator implementations needed for SEO keyword optimization

---

## OVERVIEW

Based on top 25 calculator search keywords analysis, we need to implement 10 calculators that are either missing or need comprehensive versions. Each calculator must have:

- ✅ 2000+ words of educational SEO content
- ✅ AI analysis integration using `AIAnalysis` component
- ✅ Proper TypeScript types
- ✅ Responsive design with Tailwind CSS
- ✅ Routes added to App.tsx
- ✅ Listed in appropriate hub pages
- ✅ Searchable in HomePage search index

---

## CALCULATOR #1: EMI Calculator (India) ❌

**File Path:** `./frontend/pages/calculators/india/EMICalculatorIndia.tsx`  
**Route:** `/calculators/india/emi`  
**Hub Page:** IndiaToolsPage  
**Search Keywords:** emi calculator, emi calculator india, home loan emi, car loan emi, personal loan emi, loan emi, equated monthly installment

### Functional Requirements:
1. **Inputs:**
   - Loan Amount (₹) - number input
   - Interest Rate (% per annum) - number input, step 0.1
   - Tenure - number input with toggle for Years/Months
   
2. **Calculations:**
   - Monthly EMI using formula: `EMI = [P × R × (1+R)^N] / [(1+R)^N-1]`
   - Total Payment = EMI × N
   - Total Interest = Total Payment - Principal
   - Amortization Schedule (month-by-month breakdown)

3. **Display:**
   - Monthly EMI amount (prominent)
   - Principal vs Interest breakdown (visual pie chart/bar)
   - Total payment summary
   - Amortization table (at least first 12 months visible)

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "emi_india",
     data: {
       loanAmount: number,
       interestRate: number,
       tenure: number, // in months
       emi: number,
       totalInterest: number,
       totalPayment: number
     }
   }
   ```

### Educational Content (2000+ words):
1. What is EMI? (definition, how it works in India)
2. EMI Calculation Formula (detailed explanation with example)
3. Types of Loans Using EMI:
   - Home Loans (rates, tenure, tax benefits)
   - Car Loans (rates, tenure, financing options)
   - Personal Loans (rates, tenure, unsecured nature)
   - Education Loans (rates, moratorium, Section 80E benefits)
4. Tax Benefits:
   - Section 80C (₹1.5L principal deduction)
   - Section 24(b) (₹2L interest deduction)
   - Section 80EEA (₹1.5L additional for first-time buyers)
5. Factors Affecting EMI:
   - Principal amount impact
   - Interest rate sensitivity (0.5% difference analysis)
   - Tenure selection (short vs long tenure trade-offs)
   - Fixed vs floating rates
6. EMI Payment Strategies:
   - Prepayment strategies (partial, annual, step-up)
   - Balance transfer options (when to do it, costs vs benefits)
   - EMI affordability rules (40-50% of income max)
7. Common EMI Mistakes to Avoid:
   - Taking maximum eligible loan
   - Ignoring processing fees
   - Not reading fine print
   - Missing payments (CIBIL impact)
   - Choosing wrong tenure
8. EMI Affordability - 50/30/20 Rule (with examples)
9. FAQ Section (5-7 common questions with detailed answers)

### Component Usage:
```typescript
import { AIAnalysis } from '../../../components/AIAnalysis';
import { SEOHead } from '../../../components/SEOHead';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
```

---

## CALCULATOR #2: Salary Calculator (General/US) ❌

**File Path:** `./frontend/pages/calculators/financial/SalaryCalculator.tsx`  
**Route:** `/calculator/salary`  
**Hub Page:** FinanceToolsPage  
**Search Keywords:** salary calculator, take home pay calculator, paycheck calculator, salary after tax, net salary calculator, gross to net salary, wage calculator

### Functional Requirements:
1. **Inputs:**
   - Salary Type (dropdown: Annual/Monthly/Hourly)
   - Salary Amount ($)
   - State (dropdown: all 50 US states)
   - Filing Status (dropdown: Single/Married Filing Jointly/Head of Household)
   - Hours per Week (if hourly, default 40)

2. **Calculations:**
   - Federal Tax (progressive brackets for 2024)
   - State Tax (state-specific rates)
   - Social Security (6.2%, cap at $168,600)
   - Medicare (1.45% + 0.9% for income >$200k)
   - Gross salary breakdown (annual/monthly/biweekly/weekly/daily/hourly)
   - Net salary breakdown (all time periods)
   - Effective tax rate

3. **Display:**
   - Net Annual Salary (prominent)
   - Breakdown by period (monthly, biweekly, weekly, hourly)
   - Tax deductions breakdown with visual representation
   - Effective tax rate percentage

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "salary_calculator",
     data: {
       grossAnnual: number,
       state: string,
       filingStatus: string,
       federalTax: number,
       stateTax: number,
       socialSecurity: number,
       medicare: number,
       netAnnual: number,
       effectiveTaxRate: number
     }
   }
   ```

### Educational Content (2000+ words):
1. Understanding Your Paycheck (gross vs net)
2. Federal Income Tax Brackets 2024 (table with all brackets)
3. State Income Tax Considerations:
   - No income tax states (9 states listed)
   - Low tax states (under 4%)
   - High tax states (over 9%)
4. FICA Taxes Explained:
   - Social Security Tax (6.2%, cap, benefits)
   - Medicare Tax (1.45%, Additional Medicare Tax)
5. Pre-Tax Deductions:
   - 401(k) contributions ($23,000 limit 2024)
   - HSA contributions (triple tax advantage)
   - FSA (healthcare and dependent care)
6. Salary Negotiation & Total Compensation:
   - Financial benefits (signing bonus, stock options, annual bonus, 401k match)
   - Quality of life benefits (health insurance value, remote work, PTO)
7. Budgeting with Net Salary:
   - 50/30/20 rule (detailed breakdown with examples)
   - Example budgets at different income levels
8. Tax Withholding Optimization:
   - W-4 form explanation
   - Avoiding over-withholding
   - Avoiding under-withholding penalties
9. FAQ Section (5+ questions including bonuses taxation, W-4 adjustments, 401k contribution amounts)

### State Tax Rates Data:
```typescript
const STATE_TAX_RATES: { [key: string]: number } = {
  'AL': 5.0, 'AK': 0, 'AZ': 2.59, 'AR': 4.9, 'CA': 9.3,
  'CO': 4.4, 'CT': 5.0, 'DE': 6.6, 'FL': 0, 'GA': 5.75,
  // ... all 50 states
};
```

---

## CALCULATOR #3: GST Calculator (India) ❌

**File Path:** `./frontend/pages/calculators/india/GSTCalculatorIndia.tsx`  
**Route:** `/calculators/india/gst`  
**Hub Page:** IndiaToolsPage  
**Search Keywords:** gst calculator, gst calculator india, cgst sgst calculator, igst calculator, goods and services tax calculator, gst tax calculator, gst rate calculator

### Functional Requirements:
1. **Inputs:**
   - Calculation Type (dropdown: Add GST/Remove GST)
   - Amount (₹) - before or after GST based on type
   - GST Rate (dropdown: 0%, 0.25%, 3%, 5%, 12%, 18%, 28%)
   - Transaction Type (toggle: Intra-State/Inter-State)

2. **Calculations:**
   - GST Amount
   - For Intra-State: CGST = GST/2, SGST = GST/2
   - For Inter-State: IGST = GST
   - Base Amount (without GST)
   - Total Amount (with GST)

3. **Display:**
   - Total Amount (prominent)
   - Base Amount
   - GST Amount
   - CGST/SGST breakdown (if intra-state) OR IGST (if inter-state)
   - Visual breakdown (pie chart)

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "gst_india",
     data: {
       transactionType: string, // "intrastate" or "interstate"
       baseAmount: number,
       gstRate: number,
       gstAmount: number,
       cgst?: number,
       sgst?: number,
       igst?: number,
       totalAmount: number
     }
   }
   ```

### Educational Content (2000+ words):
1. What is GST? (introduction, implementation date, unified tax system)
2. Types of GST:
   - CGST (Central GST) - explanation with examples
   - SGST (State GST) - explanation with examples
   - IGST (Integrated GST) - explanation with examples
3. GST Tax Slabs in India (comprehensive table):
   - 0% - essential items with examples
   - 0.25% - precious stones
   - 3% - gold/silver
   - 5% - essential goods
   - 12% - standard goods
   - 18% - most goods/services
   - 28% - luxury items
4. GST Registration Requirements:
   - Mandatory thresholds (₹40L goods, ₹20L services)
   - Documents required
   - Registration process
5. Input Tax Credit (ITC):
   - What is ITC (detailed explanation)
   - How ITC works (with calculation example)
   - What ITC is available on
   - What ITC is NOT available on
6. GST Returns Filing:
   - GSTR-1, GSTR-3B, GSTR-2A, GSTR-9 (table with due dates)
   - Late filing penalties
   - Filing process overview
7. E-Way Bill Requirements:
   - When mandatory (₹50,000 threshold)
   - Validity periods
   - Generation process
8. Common GST Mistakes to Avoid (5+ mistakes with explanations)
9. FAQ Section (5+ questions about CGST/SGST vs IGST, ITC claims, registration, returns revision, RCM)

### GST Rates Data:
```typescript
const GST_RATES = [
  { value: '0', label: '0% - Essential items (grains, milk, books)' },
  { value: '0.25', label: '0.25% - Precious stones' },
  { value: '3', label: '3% - Gold, silver' },
  { value: '5', label: '5% - Essential goods (sugar, tea, coal)' },
  { value: '12', label: '12% - Processed foods, computers' },
  { value: '18', label: '18% - Most goods & services' },
  { value: '28', label: '28% - Luxury items (cars, tobacco)' }
];
```

---

## CALCULATOR #4: Profit Margin Calculator ❌

**File Path:** `./frontend/pages/calculators/financial/ProfitMarginCalculator.tsx`  
**Route:** `/calculator/profit-margin`  
**Hub Page:** FinanceToolsPage  
**Search Keywords:** profit margin calculator, gross margin calculator, net margin calculator, operating margin, profit calculator, business profitability, margin analysis

### Functional Requirements:
1. **Inputs:**
   - Total Revenue ($)
   - Cost of Goods Sold - COGS ($)
   - Operating Expenses ($)
   - Other Expenses (Interest, Taxes) ($)

2. **Calculations:**
   - Gross Profit = Revenue - COGS
   - Gross Margin % = (Gross Profit / Revenue) × 100
   - Operating Profit = Gross Profit - Operating Expenses
   - Operating Margin % = (Operating Profit / Revenue) × 100
   - Net Profit = Operating Profit - Other Expenses
   - Net Margin % = (Net Profit / Revenue) × 100

3. **Display:**
   - All three margins (prominent): Gross %, Operating %, Net %
   - Revenue breakdown waterfall (Revenue → COGS → OpEx → Other → Net)
   - Visual representation of each margin
   - Industry benchmark comparison indicators

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "profit_margin",
     data: {
       revenue: number,
       cogs: number,
       operatingExpenses: number,
       otherExpenses: number,
       grossMargin: number,
       operatingMargin: number,
       netMargin: number,
       grossProfit: number,
       operatingProfit: number,
       netProfit: number
     }
   }
   ```

### Educational Content (2000+ words):
1. Understanding Profit Margins (why they matter)
2. Types of Profit Margins:
   - Gross Profit Margin (definition, formula, what it measures, benchmarks by industry)
   - Operating Profit Margin (definition, formula, what it measures, benchmarks)
   - Net Profit Margin (definition, formula, what it measures, benchmarks)
3. Industry Benchmarks (comprehensive table):
   - Software/SaaS (70-90%, 10-25%, 15-25%)
   - Consulting (50-70%, 15-25%, 10-20%)
   - Retail (25-50%, 5-10%, 2-6%)
   - Restaurant (60-70%, 5-10%, 3-6%)
   - Manufacturing (20-40%, 8-15%, 5-10%)
   - Construction (15-25%, 3-8%, 2-5%)
4. Strategies to Improve Profit Margins:
   - Increase Revenue Per Transaction (upselling, bundling, premium tiers, value pricing)
   - Reduce COGS (supplier negotiation, bulk buying, waste reduction, automation)
   - Cut Operating Expenses (automation, renegotiate contracts, optimize staffing)
   - Optimize Pricing Strategy (competitor analysis, psychological pricing, tiered pricing)
5. Common Profit Margin Mistakes (5+ mistakes including competing on price alone, ignoring hidden costs, not tracking by product)
6. Margin vs Markup (explanation of difference with examples)
7. Using Margins for Business Decisions:
   - Product profitability analysis
   - Pricing decisions
   - Cost control priorities
   - Growth vs profitability trade-offs
8. FAQ Section (5+ questions about good margins, calculation frequency, high gross/low net scenarios, markup vs margin)

---

## CALCULATOR #5: Paycheck Calculator (US) ❌

**File Path:** `./frontend/pages/calculators/financial/PaycheckCalculator.tsx`  
**Route:** `/calculator/paycheck`  
**Hub Page:** FinanceToolsPage  
**Search Keywords:** paycheck calculator, paycheck calculator after taxes, biweekly paycheck calculator, net pay calculator, check calculator

### Functional Requirements:
1. **Inputs:**
   - Annual Salary ($)
   - Pay Frequency (dropdown: Weekly/Bi-weekly/Semi-monthly/Monthly)
   - State (dropdown: all 50 states)
   - Filing Status (dropdown: Single/Married/Head of Household)
   - Pre-tax Deductions:
     - 401(k) Contribution ($ or %)
     - Health Insurance Premium ($)
     - HSA Contribution ($)
     - FSA Contribution ($)
   - Post-tax Deductions:
     - Additional withholding ($)

2. **Calculations:**
   - Gross pay per paycheck
   - Federal withholding per paycheck
   - State withholding per paycheck
   - FICA (Social Security + Medicare) per paycheck
   - Pre-tax deductions per paycheck
   - Post-tax deductions per paycheck
   - Net pay per paycheck
   - Annual projections for all categories

3. **Display:**
   - Net Pay Per Paycheck (prominent)
   - Gross pay breakdown by frequency
   - Deductions breakdown (stacked visualization)
   - Annual totals
   - Year-to-date projections

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "paycheck_calculator",
     data: {
       annualSalary: number,
       payFrequency: string,
       state: string,
       grossPerPaycheck: number,
       netPerPaycheck: number,
       federalWithholding: number,
       stateWithholding: number,
       ficaTotal: number,
       preTaxDeductions: number,
       postTaxDeductions: number,
       annualNetPay: number
     }
   }
   ```

### Educational Content (2000+ words):
1. Understanding Your Paycheck (anatomy of a paycheck stub)
2. Pay Frequency Impact:
   - Weekly (52 paychecks)
   - Bi-weekly (26 paychecks, 2 "extra" months)
   - Semi-monthly (24 paychecks)
   - Monthly (12 paychecks)
3. Federal Withholding:
   - How withholding works
   - W-4 form explained (2024 version)
   - Allowances vs new W-4 system
   - Adjusting withholding
4. State Withholding Variations
5. FICA Taxes on Paychecks:
   - Social Security per paycheck
   - Medicare per paycheck
   - Additional Medicare Tax threshold
6. Pre-Tax Deductions (advantages):
   - 401(k) (impact on taxes, employer match)
   - HSA (triple tax advantage)
   - Health Insurance premiums
   - FSA (use-it-or-lose-it rules)
   - Commuter benefits
7. Post-Tax Deductions:
   - Roth 401(k)
   - Disability insurance
   - Life insurance
   - Wage garnishments
8. Optimizing Your Paycheck:
   - Maximize pre-tax deductions
   - Adjust W-4 to avoid large refunds
   - Calculate true hourly rate
   - Bonus and overtime taxation
9. FAQ Section (5+ questions about pay frequency, W-4 changes, bonuses taxation, pre-tax vs post-tax)

---

## CALCULATOR #6: VAT Calculator (UK/EU) ❌

**File Path:** `./frontend/pages/calculators/uk/VATCalculatorUK.tsx`  
**Route:** `/calculators/uk/vat`  
**Hub Page:** UKToolsPage  
**Search Keywords:** vat calculator, vat calculator uk, vat calculator eu, value added tax calculator, uk vat rates, eu vat rates

### Functional Requirements:
1. **Inputs:**
   - Country (dropdown: UK, plus major EU countries)
   - Calculation Type (toggle: Add VAT/Remove VAT)
   - Amount (£ or €) - before or after VAT
   - VAT Rate (dropdown, country-specific):
     - UK: 20% Standard, 5% Reduced, 0% Zero-rated
     - EU: Country-specific rates

2. **Calculations:**
   - VAT Amount
   - Net Amount (excluding VAT)
   - Gross Amount (including VAT)

3. **Display:**
   - Gross Amount (prominent)
   - Net Amount
   - VAT Amount
   - VAT Rate applied
   - Visual breakdown

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "vat_calculator",
     data: {
       country: string,
       netAmount: number,
       vatRate: number,
       vatAmount: number,
       grossAmount: number,
       calculationType: string
     }
   }
   ```

### Educational Content (2000+ words):
1. What is VAT? (Value Added Tax explanation, how it differs from sales tax)
2. UK VAT Rates:
   - Standard Rate (20%) - what's included
   - Reduced Rate (5%) - domestic fuel, children's car seats, etc.
   - Zero Rate (0%) - food, books, children's clothes, etc.
   - Exempt items (no VAT, no reclaim)
3. EU VAT Rates by Country (table with major EU countries and their standard rates)
4. VAT Registration in UK:
   - £90,000 threshold (2024)
   - Voluntary registration
   - Benefits and obligations
   - Registration process
5. Making Tax Digital (MTD):
   - What is MTD
   - Software requirements
   - Deadlines and compliance
   - Penalties for non-compliance
6. VAT Returns and Filing:
   - Quarterly return process
   - Payment deadlines
   - What to include
   - Corrections and amendments
7. VAT Schemes:
   - Flat Rate Scheme (simplified accounting)
   - Cash Accounting Scheme
   - Annual Accounting Scheme
   - Retail Schemes
8. Reverse Charge Mechanism (construction, digital services)
9. Cross-Border VAT:
   - Selling to EU (post-Brexit rules)
   - Importing goods (VAT on imports)
   - One Stop Shop (OSS) scheme
10. FAQ Section (5+ questions about registration threshold, MTD, reverse charge, zero-rated vs exempt)

### VAT Rates Data:
```typescript
const VAT_RATES_UK = [
  { value: '20', label: '20% - Standard Rate' },
  { value: '5', label: '5% - Reduced Rate' },
  { value: '0', label: '0% - Zero Rate' }
];

const VAT_RATES_EU: { [key: string]: number } = {
  'DE': 19, 'FR': 20, 'IT': 22, 'ES': 21, 'NL': 21,
  'BE': 21, 'AT': 20, 'SE': 25, 'DK': 25, 'FI': 24,
  'IE': 23, 'PT': 23, 'GR': 24, 'PL': 23, 'CZ': 21
};
```

---

## CALCULATOR #7: Tax Calculator US (Comprehensive) ❌

**File Path:** `./frontend/pages/calculators/us/TaxCalculatorUS.tsx`  
**Route:** `/calculator/tax-us`  
**Hub Page:** USToolsPage  
**Search Keywords:** tax calculator us, tax calculator, income tax calculator, us tax calculator, federal and state tax calculator, tax estimator

### Functional Requirements:
1. **Inputs:**
   - Filing Status (dropdown: Single/Married Filing Jointly/Married Filing Separately/Head of Household)
   - Annual Income ($)
   - State (dropdown: all 50 states)
   - Deduction Type (toggle: Standard/Itemized)
   - If Itemized:
     - Mortgage Interest ($)
     - State/Local Taxes ($, max $10k)
     - Charitable Contributions ($)
     - Medical Expenses ($)
   - Tax Credits:
     - Child Tax Credit (# of qualifying children)
     - Dependent Care Credit ($)
     - Education Credits ($)
     - Other Credits ($)

2. **Calculations:**
   - Adjusted Gross Income (AGI)
   - Taxable Income
   - Federal Tax (using 2024 brackets)
   - State Tax
   - Total Tax
   - Effective Tax Rate
   - Marginal Tax Rate
   - Tax Credits applied
   - Total Tax Owed

3. **Display:**
   - Total Tax Owed (prominent)
   - Federal vs State breakdown
   - Effective vs Marginal rate comparison
   - Standard vs Itemized deduction comparison
   - Tax credits impact
   - Visual tax bracket breakdown

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "tax_calculator_us",
     data: {
       filingStatus: string,
       grossIncome: number,
       state: string,
       deductionType: string,
       deductionAmount: number,
       taxableIncome: number,
       federalTax: number,
       stateTax: number,
       taxCredits: number,
       totalTax: number,
       effectiveRate: number,
       marginalRate: number
     }
   }
   ```

### Educational Content (2000+ words):
1. US Tax System Overview (progressive taxation)
2. 2024 Federal Tax Brackets (detailed tables for all filing statuses)
3. Filing Status Selection:
   - Single (when to use)
   - Married Filing Jointly (benefits, when to use)
   - Married Filing Separately (rare cases)
   - Head of Household (qualifying criteria)
   - Qualifying Surviving Spouse
4. Standard vs Itemized Deductions:
   - 2024 Standard deductions by status
   - When to itemize
   - Common itemized deductions (detailed)
   - SALT cap ($10,000 limit)
5. Tax Credits (vs Deductions):
   - Child Tax Credit ($2,000 per child, income limits)
   - Earned Income Tax Credit (EITC)
   - American Opportunity Credit (education)
   - Lifetime Learning Credit
   - Child and Dependent Care Credit
   - Saver's Credit
6. State Tax Variations:
   - No income tax states
   - High tax states
   - Local taxes (NYC, etc.)
7. Tax Planning Strategies:
   - Maximize retirement contributions
   - Tax-loss harvesting
   - Bunching itemized deductions
   - Qualified charitable distributions
   - Tax bracket management
8. Estimated Tax Payments (quarterly deadlines, who needs to pay)
9. Common Tax Mistakes (5+ mistakes)
10. FAQ Section (7+ questions about brackets, credits vs deductions, estimated taxes, AMT)

---

## CALCULATOR #8: Capital Gains Tax Calculator (US) ❌

**File Path:** `./frontend/pages/calculators/us/CapitalGainsTaxCalculatorUS.tsx`  
**Route:** `/calculator/capital-gains-us`  
**Hub Page:** USToolsPage  
**Search Keywords:** capital gains tax calculator, capital gains calculator, stock tax calculator, investment tax calculator, long term capital gains, short term capital gains

### Functional Requirements:
1. **Inputs:**
   - Filing Status (dropdown)
   - Annual Income ($) - for determining capital gains rate
   - Asset Type (dropdown: Stocks/Real Estate/Other)
   - Purchase Price (Cost Basis) ($)
   - Sale Price ($)
   - Purchase Date (date picker)
   - Sale Date (date picker)
   - State (dropdown)

2. **Calculations:**
   - Holding Period (days/months/years)
   - Short-term vs Long-term determination (< 1 year vs ≥ 1 year)
   - Capital Gain/Loss = Sale Price - Purchase Price
   - Tax Rate determination:
     - Short-term: Ordinary income rates
     - Long-term: 0%, 15%, or 20% based on income
   - Net Investment Income Tax (3.8% if income > threshold)
   - State capital gains tax
   - Total capital gains tax

3. **Display:**
   - Capital Gain/Loss (prominent)
   - Holding period (short-term or long-term)
   - Federal capital gains tax
   - NIIT (if applicable)
   - State tax
   - Total tax
   - Net proceeds after tax

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "capital_gains_us",
     data: {
       filingStatus: string,
       annualIncome: number,
       state: string,
       purchasePrice: number,
       salePrice: number,
       holdingPeriod: number, // days
       isLongTerm: boolean,
       capitalGain: number,
       taxRate: number,
       federalTax: number,
       niit: number,
       stateTax: number,
       totalTax: number,
       netProceeds: number
     }
   }
   ```

### Educational Content (2000+ words):
1. What are Capital Gains? (definition, how they occur)
2. Short-Term vs Long-Term Capital Gains:
   - Short-term (≤ 1 year) - taxed as ordinary income
   - Long-term (> 1 year) - preferential rates
   - Importance of holding period
3. Long-Term Capital Gains Tax Rates 2024:
   - 0% rate (income thresholds by filing status)
   - 15% rate (income thresholds)
   - 20% rate (high earners)
   - Table with all thresholds
4. Net Investment Income Tax (NIIT):
   - 3.8% surtax
   - Income thresholds ($200k single, $250k married)
   - What investment income is included
5. State Capital Gains Taxes:
   - States with no capital gains tax
   - States with special rates
   - States taxing as ordinary income
6. Cost Basis Calculation:
   - What is cost basis
   - Adjusted cost basis (improvements, splits, etc.)
   - Inherited assets (step-up in basis)
   - Gifted assets
7. Tax-Loss Harvesting:
   - What it is
   - How to use it effectively
   - $3,000 annual loss deduction limit
   - Carrying losses forward
8. Wash Sale Rule:
   - What it is (30-day rule)
   - How to avoid violations
   - Impact on loss deductions
9. Special Capital Gains Rules:
   - Section 1250 (real estate depreciation recapture)
   - Collectibles (28% rate)
   - Qualified Small Business Stock (Section 1202)
   - Primary residence exclusion ($250k/$500k)
10. Strategies to Minimize Capital Gains Tax (6+ strategies)
11. FAQ Section (7+ questions about holding period, wash sales, inherited assets, real estate exclusion)

---

## CALCULATOR #9: Inheritance Tax Calculator (UK) ❌

**File Path:** `./frontend/pages/calculators/uk/InheritanceTaxCalculatorUK.tsx`  
**Route:** `/calculators/uk/inheritance-tax`  
**Hub Page:** UKToolsPage  
**Search Keywords:** inheritance tax calculator uk, iht calculator, estate tax calculator uk, inheritance tax uk, nil rate band calculator

### Functional Requirements:
1. **Inputs:**
   - Total Estate Value (£)
   - Left to Spouse/Civil Partner (£)
   - Left to Charity (£)
   - Gifts in Last 7 Years (£)
   - Residence Nil-Rate Band Applicable? (checkbox - if main residence left to direct descendants)
   - Unused Spouse Allowance? (checkbox - if inheriting from spouse who didn't use full allowance)

2. **Calculations:**
   - Nil-Rate Band: £325,000 (standard)
   - Residence Nil-Rate Band: £175,000 (if applicable)
   - Spouse allowance transfer (doubling bands if applicable)
   - Exempt gifts (spouse, charity)
   - Taper relief on 7-year gifts:
     - 3-4 years: 80% of £325k = £260k threshold
     - 4-5 years: 60% = £195k
     - 5-6 years: 40% = £130k
     - 6-7 years: 20% = £65k
     - 7+ years: fully exempt
   - Taxable estate
   - IHT at 40% (or 36% if 10%+ to charity)

3. **Display:**
   - Total IHT Due (prominent)
   - Estate value breakdown
   - Nil-rate bands applied
   - Exemptions and reliefs
   - Taxable estate
   - Effective IHT rate

4. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "inheritance_tax_uk",
     data: {
       totalEstate: number,
       nilRateBand: number,
       residenceNilRateBand: number,
       exemptions: number,
       taxableEstate: number,
       ihtRate: number, // 40% or 36%
       totalIHT: number,
       effectiveRate: number
     }
   }
   ```

### Educational Content (2000+ words):
1. What is Inheritance Tax (IHT)? (UK estate taxation)
2. Current IHT Rates and Thresholds:
   - Standard rate: 40%
   - Reduced rate: 36% (if 10%+ to charity)
   - Nil-Rate Band: £325,000
   - Residence Nil-Rate Band: £175,000
3. Nil-Rate Band Explained:
   - Standard £325,000 allowance
   - Frozen until 2028
   - Transferable between spouses
   - How transfers work
4. Residence Nil-Rate Band:
   - £175,000 additional allowance
   - Conditions (main residence, direct descendants)
   - Taper for estates over £2 million
   - Spouse transfer
5. Exemptions from IHT:
   - Spouse/civil partner exemption (unlimited)
   - Charity exemption (unlimited)
   - Annual exemption (£3,000/year)
   - Small gifts exemption (£250 per person)
   - Wedding gifts exemption
6. Gifts and the 7-Year Rule:
   - Potentially Exempt Transfers (PETs)
   - Taper relief (detailed table)
   - Gifts with reservation of benefit
   - Lifetime gifts vs estate
7. IHT Planning Strategies:
   - Making gifts early (7-year rule)
   - Using annual exemptions
   - Trusts (discretionary, bare, interest in possession)
   - Life insurance in trust
   - Business Property Relief (BPR)
   - Agricultural Property Relief (APR)
   - Pensions (outside estate)
8. Charitable Giving Benefits:
   - Reduced IHT rate (36% vs 40%)
   - 10% threshold calculation
   - Tax relief on lifetime gifts
9. Common IHT Mistakes (5+ mistakes)
10. FAQ Section (7+ questions about nil-rate bands, 7-year rule, trusts, charitable giving, lifetime gifts)

---

## CALCULATOR #10: Rent vs Buy Calculator ❌

**File Path:** `./frontend/pages/calculators/financial/RentVsBuyCalculator.tsx`  
**Route:** `/calculator/rent-vs-buy`  
**Hub Page:** FinanceToolsPage  
**Search Keywords:** rent vs buy calculator, should i rent or buy, renting vs buying calculator, homeownership calculator, rent or buy home

### Functional Requirements:
1. **Inputs - Buying:**
   - Home Price ($)
   - Down Payment ($ or %)
   - Mortgage Interest Rate (%)
   - Loan Term (years: 15/30)
   - Property Tax (annual $)
   - HOA Fees (monthly $)
   - Home Insurance (annual $)
   - Maintenance (annual $, default 1% of home price)
   - Closing Costs ($ or %, default 3%)
   - Home Appreciation Rate (%, default 3%)

2. **Inputs - Renting:**
   - Monthly Rent ($)
   - Rent Increase (annual %, default 3%)
   - Renter's Insurance (annual $)
   - Security Deposit ($)

3. **Inputs - Investment:**
   - Investment Return Rate (%, for down payment opportunity cost)

4. **Inputs - Timeline:**
   - Time Horizon (dropdown: 5/10/15/20/30 years)

5. **Calculations:**
   - **Buying Total Costs:**
     - Down payment
     - Monthly mortgage payment
     - Total mortgage interest paid
     - Property taxes (cumulative)
     - HOA fees (cumulative)
     - Insurance (cumulative)
     - Maintenance (cumulative)
     - Closing costs
     - Less: Home appreciation (equity gained)
     - Less: Mortgage principal paid down
   - **Renting Total Costs:**
     - Monthly rent (with annual increases)
     - Renter's insurance (cumulative)
     - Security deposit (initial)
   - **Opportunity Cost:**
     - Down payment invested at return rate
     - Monthly difference invested (if rent < buy monthly cost)
   - **Break-Even Point:** Year when buying becomes cheaper than renting
   - **Net Cost Comparison:** Total cost of buying vs renting over time horizon

6. **Display:**
   - Total Cost Comparison (prominent): Rent vs Buy
   - Break-even year
   - Monthly cost comparison (Year 1 and Year N)
   - Cumulative cost chart over time
   - Equity/wealth comparison
   - Recommendation based on results

7. **AI Analysis Data:**
   ```typescript
   {
     calculatorType: "rent_vs_buy",
     data: {
       homePrice: number,
       downPayment: number,
       monthlyMortgage: number,
       monthlyRent: number,
       timeHorizon: number,
       totalCostBuying: number,
       totalCostRenting: number,
       homeEquity: number,
       investmentGains: number,
       breakEvenYear: number,
       netDifference: number,
       recommendation: string
     }
   }
   ```

### Educational Content (2000+ words):
1. The Rent vs Buy Decision (introduction, factors beyond math)
2. True Cost of Homeownership:
   - Mortgage principal & interest
   - Property taxes (ongoing, increase over time)
   - HOA fees (if applicable)
   - Homeowners insurance (required by lender)
   - Maintenance & repairs (1% rule, unexpected costs)
   - Utilities (often higher than renting)
   - Closing costs (3-6% of purchase price)
   - Opportunity cost of down payment
3. Hidden Costs of Renting:
   - Rent increases (3-5% annually in hot markets)
   - Moving costs (frequent moves)
   - Renter's insurance
   - No equity building
   - Lack of control (landlord decisions)
4. Benefits of Buying:
   - Equity building (forced savings)
   - Home appreciation potential
   - Stability and control
   - Tax benefits (mortgage interest deduction, up to $750k)
   - Fixed payment (with fixed-rate mortgage)
   - Rental income potential (renting out rooms)
5. Benefits of Renting:
   - Flexibility to move
   - No maintenance responsibility
   - Lower upfront costs
   - Landlord handles major repairs
   - Access to amenities (pool, gym) without ownership
   - Easier budgeting (predictable costs)
6. Break-Even Analysis:
   - What is break-even point
   - Typical break-even: 5-7 years
   - Factors that shorten break-even (low rates, high rent, appreciation)
   - Factors that lengthen break-even (high HOA, maintenance, low appreciation)
7. Market Conditions Impact:
   - Interest rates (major impact on affordability)
   - Housing market trends (buyer vs seller market)
   - Local rent trends
   - Job market stability
8. Life Situation Factors:
   - Career stability (likely to stay 5+ years?)
   - Family planning (need for space)
   - Financial readiness (emergency fund, down payment, good credit)
   - Lifestyle preferences (maintenance tolerance, desire for stability)
9. Opportunity Cost of Down Payment:
   - Stock market returns (historical 10%)
   - Bond returns (lower risk)
   - Real estate as investment (leverage, appreciation)
   - Diversification considerations
10. When to Buy vs When to Rent (decision framework):
    - Buy if: staying 5+ years, stable income, 20% down payment saved, low debt-to-income ratio
    - Rent if: short-term (< 3 years), unstable income, no down payment, prefer flexibility
11. FAQ Section (7+ questions about break-even, down payment size, interest rates, renting while saving, market timing)

---

## IMPLEMENTATION CHECKLIST FOR EACH CALCULATOR

When implementing each calculator, ensure:

### ✅ Code Structure:
- [ ] Proper TypeScript interfaces for all data structures
- [ ] State management with React hooks (useState)
- [ ] Calculation functions are pure and testable
- [ ] Input validation (prevent negative numbers, division by zero, etc.)
- [ ] Error handling for edge cases

### ✅ Components Used:
- [ ] `SEOHead` with proper title, description, keywords
- [ ] `AIAnalysis` component with correct `analysisRequest` prop structure
- [ ] `AppleStyleInput` for number inputs (with prefix/suffix where appropriate)
- [ ] shadcn/ui components (Card, Button, Alert, Select, Input, Label)
- [ ] Lucide React icons
- [ ] Proper Tailwind CSS classes (responsive, accessible)

### ✅ Layout & Design:
- [ ] 2-column layout on desktop (lg breakpoint)
- [ ] Input form on left, results on right
- [ ] Mobile-responsive (stacks vertically)
- [ ] Visual data representation (charts, progress bars, pie charts)
- [ ] Color-coded results (green for positive, red for negative/costs)
- [ ] Loading states (if using AI analysis)

### ✅ Educational Content:
- [ ] Minimum 2000 words total
- [ ] Proper heading hierarchy (h2, h3, h4)
- [ ] Tables for data (tax brackets, rates, comparisons)
- [ ] Examples with real numbers
- [ ] Visual breaks (cards, colored boxes, borders)
- [ ] FAQ section with expandable details tags
- [ ] Lists (bulleted and numbered)
- [ ] Emphasis on key terms (strong/bold tags)

### ✅ SEO Optimization:
- [ ] Title tag optimized for target keyword
- [ ] Meta description compelling and keyword-rich
- [ ] H1 tag with primary keyword
- [ ] H2/H3 tags with secondary keywords
- [ ] Alt text for any images (if used)
- [ ] Internal links to related calculators
- [ ] Semantic HTML structure

### ✅ Integration:
- [ ] Route added to `./frontend/App.tsx`
- [ ] Import statement added to App.tsx
- [ ] Calculator added to appropriate hub page (IndiaToolsPage, FinanceToolsPage, UKToolsPage, USToolsPage)
- [ ] Calculator added to `HomePage.tsx` search index with keywords
- [ ] Build completes without errors
- [ ] No TypeScript warnings

---

## ROUTE CONFIGURATION TEMPLATE

Add to `./frontend/App.tsx`:

```typescript
// Import
import { CalculatorName } from './pages/calculators/category/CalculatorName';

// Route (in Routes section)
<Route path="/calculator/route-name" element={<CalculatorName />} />
// or
<Route path="/calculators/country/route-name" element={<CalculatorName />} />
```

---

## HUB PAGE CONFIGURATION

### For India Calculators (IndiaToolsPage):
```typescript
{
  id: 'calculator-id',
  title: 'Calculator Name',
  description: 'Short description',
  icon: IconName,
  path: '/calculators/india/route',
  category: 'Category',
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

### For General Financial Calculators (FinanceToolsPage):
```typescript
{
  name: 'Calculator Name',
  description: 'Short description',
  path: '/calculator/route',
  icon: IconName,
  category: 'Category'
}
```

### For UK Calculators (UKToolsPage):
```typescript
{
  id: 'calculator-id',
  title: 'Calculator Name',
  description: 'Short description',
  icon: IconName,
  path: '/calculators/uk/route',
  category: 'Category',
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

### For US Calculators (USToolsPage):
```typescript
{
  id: 'calculator-id',
  title: 'Calculator Name',
  description: 'Short description',
  icon: IconName,
  path: '/calculator/route',
  category: 'Category',
  features: ['Feature 1', 'Feature 2', 'Feature 3']
}
```

---

## HOMEPAGE SEARCH INDEX

Add to `allCalculators` array in `./frontend/pages/HomePage.tsx`:

```typescript
{ 
  name: 'Calculator Name', 
  path: '/calculator/route', 
  category: 'Category', 
  keywords: ['keyword1', 'keyword2', 'keyword3', 'keyword4'] 
}
```

---

## TESTING CHECKLIST

Before considering a calculator "complete":

- [ ] Calculator performs all calculations correctly
- [ ] Input validation works (prevents invalid inputs)
- [ ] Results display properly on desktop
- [ ] Results display properly on mobile
- [ ] AI Analysis loads and displays (when user calculates)
- [ ] Educational content is readable and well-formatted
- [ ] FAQ details expand/collapse properly
- [ ] SEO Head tags render correctly (check page source)
- [ ] No console errors
- [ ] No TypeScript errors in build
- [ ] Calculator appears in hub page
- [ ] Calculator appears in homepage search
- [ ] Search finds calculator with keywords

---

## PRIORITY ORDER RECOMMENDATION

Based on search volume and user needs:

1. **EMI Calculator (India)** - High search volume, common need
2. **Salary Calculator** - Universal need, high search volume
3. **Rent vs Buy Calculator** - Major life decision, high engagement
4. **Profit Margin Calculator** - Business need, simpler implementation
5. **Capital Gains Tax Calculator (US)** - Investment need, tax season relevance
6. **GST Calculator (India)** - Business need in India
7. **Paycheck Calculator** - Similar to salary calculator, builds on it
8. **Tax Calculator US** - Comprehensive, complex, tax season relevance
9. **VAT Calculator (UK/EU)** - Business need in UK/EU
10. **Inheritance Tax Calculator (UK)** - Niche but important, lower priority

---

## NOTES FOR IMPLEMENTATION

1. **Component Imports:** Always verify the exact export pattern:
   - Some components use default export: `import ComponentName from '...'`
   - Some use named export: `import { ComponentName } from '...'`
   - Check existing working calculators for correct import pattern

2. **AI Analysis:** Use `AIAnalysis` component (not `EnhancedAIAnalysis`):
   ```typescript
   <AIAnalysis
     analysisRequest={{
       calculatorType: "type_name",
       data: { /* calculator results */ }
     }}
   />
   ```

3. **AppleStyleInput:** Has specific props:
   ```typescript
   <AppleStyleInput
     label="Label Text"
     type="number"
     value={stateVariable}
     onChange={(e) => setStateVariable(e.target.value)}
     placeholder="0"
     prefix="$"  // or suffix="%"
   />
   ```

4. **Currency Formatting:** Use the utility function:
   ```typescript
   import { formatCurrency } from '../../../utils/formatting';
   
   formatCurrency(amount, 'USD') // for $1,234.56
   formatCurrency(amount, 'INR') // for ₹1,234.56
   formatCurrency(amount, 'GBP') // for £1,234.56
   ```

5. **Build Errors:** If encountering JSX syntax errors:
   - Ensure return statement wraps multiple elements in `<>...</>` or single parent div
   - Check all opening tags have matching closing tags
   - Verify component imports are correct
   - Check for typos in component names

---

## COMPLETION CRITERIA

A calculator is **COMPLETE** when:

✅ All functional requirements implemented  
✅ All calculations verified accurate  
✅ 2000+ words of educational content included  
✅ AI Analysis integration working  
✅ SEO optimization complete  
✅ Routes configured  
✅ Hub pages updated  
✅ Search index updated  
✅ Build completes without errors  
✅ Tested on desktop and mobile  
✅ All checklist items marked complete  

---

**END OF SPECIFICATION DOCUMENT**

*This document can be referenced for implementing any of the 10 calculators individually or in batches.*
