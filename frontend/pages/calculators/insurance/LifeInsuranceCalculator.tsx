import React, { useState, useCallback } from 'react';
import { Heart, Calculator, DollarSign, Users, TrendingUp, Shield, Info, BookOpen, AlertCircle } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AppleStyleCard } from '../../../components/AppleStyleCard';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { AppleStyleButton } from '../../../components/AppleStyleButton';
import { SEOHead } from '../../../components/SEOHead';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface LifeInsuranceInputs {
  currentAge: number;
  annualIncome: number;
  spouseIncome: number;
  numChildren: number;
  childrenAges: string;
  currentDebts: number;
  mortgageBalance: number;
  creditCardDebt: number;
  studentLoans: number;
  otherDebts: number;
  monthlyExpenses: number;
  yearsOfSupport: number;
  educationCosts: number;
  emergencyFund: number;
  existingLifeInsurance: number;
  existingSavings: number;
  retirementSavings: number;
  expectedInflation: number;
  rateOfReturn: number;
}

interface LifeInsuranceResults {
  totalCoverageNeeded: number;
  additionalCoverageNeeded: number;
  incomeReplacement: number;
  debtCoverage: number;
  educationFunding: number;
  emergencyReserve: number;
  finalExpenses: number;
  presentValueNeeded: number;
  monthlyPremiumEstimate: number;
  annualPremiumEstimate: number;
  coverageBreakdown: {
    incomeReplacement: number;
    immediateNeeds: number;
    futureObligations: number;
    emergencyBuffer: number;
  };
}

const LifeInsuranceCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<LifeInsuranceInputs>({
    currentAge: 35,
    annualIncome: 75000,
    spouseIncome: 45000,
    numChildren: 2,
    childrenAges: "8, 12",
    currentDebts: 25000,
    mortgageBalance: 200000,
    creditCardDebt: 8000,
    studentLoans: 12000,
    otherDebts: 5000,
    monthlyExpenses: 5500,
    yearsOfSupport: 20,
    educationCosts: 100000,
    emergencyFund: 35000,
    existingLifeInsurance: 100000,
    existingSavings: 50000,
    retirementSavings: 125000,
    expectedInflation: 3.0,
    rateOfReturn: 6.0
  });

  const [results, setResults] = useState<LifeInsuranceResults | null>(null);

  const handleInputChange = (field: keyof LifeInsuranceInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: field === 'childrenAges' ? value : parseFloat(value) || 0
    }));
  };

  const calculateLifeInsurance = useCallback(() => {
    const {
      currentAge,
      annualIncome,
      spouseIncome,
      numChildren,
      currentDebts,
      mortgageBalance,
      creditCardDebt,
      studentLoans,
      otherDebts,
      monthlyExpenses,
      yearsOfSupport,
      educationCosts,
      emergencyFund,
      existingLifeInsurance,
      existingSavings,
      retirementSavings,
      expectedInflation,
      rateOfReturn
    } = inputs;

    const inflationRate = expectedInflation / 100;
    const returnRate = rateOfReturn / 100;
    const realReturnRate = ((1 + returnRate) / (1 + inflationRate)) - 1;

    const annualExpenses = monthlyExpenses * 12;
    
    // More accurate income replacement calculation
    // Account for taxes, social security, and spouse income
    const socialSecurityBenefit = Math.min(annualIncome * 0.4, 35000); // Approximate survivor benefit
    const netIncomeNeeded = annualExpenses - (spouseIncome * 0.8) - socialSecurityBenefit; // Spouse keeps 80% income

    // Present value of income replacement using accurate annuity formula
    let incomeReplacement = 0;
    if (Math.abs(realReturnRate) > 0.001) {
      // Standard present value of annuity formula
      incomeReplacement = Math.max(0, netIncomeNeeded) * (1 - Math.pow(1 + realReturnRate, -yearsOfSupport)) / realReturnRate;
    } else {
      // If real return rate is near zero
      incomeReplacement = Math.max(0, netIncomeNeeded) * yearsOfSupport;
    }

    // Comprehensive debt calculation
    const totalCurrentDebts = mortgageBalance + creditCardDebt + studentLoans + otherDebts + currentDebts;
    
    // Final expenses with inflation adjustment
    const finalExpenses = 15000 * Math.pow(1 + inflationRate, 1);
    
    // Education funding with more accurate timing
    const childrenAgesList = inputs.childrenAges.split(',').map(age => parseInt(age.trim())).filter(age => !isNaN(age));
    let totalEducationCosts = 0;
    
    childrenAgesList.forEach(childAge => {
      const yearsToCollege = Math.max(0, 18 - childAge);
      const inflatedEducationCost = educationCosts * Math.pow(1 + inflationRate, yearsToCollege);
      // Present value of education cost
      totalEducationCosts += inflatedEducationCost / Math.pow(1 + returnRate, yearsToCollege);
    });
    
    // If no specific ages provided, use average calculation
    if (childrenAgesList.length === 0 && numChildren > 0) {
      const avgYearsToCollege = 10; // Assume average child is 8 years old
      const inflatedEducationCost = educationCosts * Math.pow(1 + inflationRate, avgYearsToCollege);
      totalEducationCosts = (inflatedEducationCost / Math.pow(1 + returnRate, avgYearsToCollege)) * numChildren;
    }
    
    // Emergency reserve (6-12 months of expenses)
    const emergencyReserve = Math.max(emergencyFund, annualExpenses * 0.75);
    
    // Total coverage calculation
    const totalCoverageNeeded = incomeReplacement + totalCurrentDebts + finalExpenses + totalEducationCosts + emergencyReserve;
    
    // Available assets (conservative approach - don't count all retirement savings)
    const availableAssets = existingSavings + (retirementSavings * 0.3); // Only 30% of retirement accessible
    const netCoverageNeeded = Math.max(0, totalCoverageNeeded - availableAssets);
    const additionalCoverageNeeded = Math.max(0, netCoverageNeeded - existingLifeInsurance);

    // More accurate premium estimation based on age, gender, and health
    const getMonthlyRate = (age: number): number => {
      // Rates per $1000 of coverage for healthy non-smoker (simplified)
      if (age < 25) return 0.8;
      if (age < 30) return 1.0;
      if (age < 35) return 1.3;
      if (age < 40) return 1.7;
      if (age < 45) return 2.4;
      if (age < 50) return 3.5;
      if (age < 55) return 5.2;
      if (age < 60) return 7.8;
      return 12.0;
    };

    const monthlyRate = getMonthlyRate(currentAge);
    const monthlyPremiumEstimate = (additionalCoverageNeeded / 1000) * monthlyRate;
    const annualPremiumEstimate = monthlyPremiumEstimate * 12;

    // Coverage adequacy analysis
    const currentCoverageRatio = existingLifeInsurance / totalCoverageNeeded;
    const adequacyLevel = currentCoverageRatio >= 1.0 ? 'Adequate' : 
                         currentCoverageRatio >= 0.7 ? 'Moderately Adequate' : 'Inadequate';

    const presentValueNeeded = totalCoverageNeeded;

    const coverageBreakdown = {
      incomeReplacement: incomeReplacement,
      immediateNeeds: totalCurrentDebts + finalExpenses,
      futureObligations: totalEducationCosts,
      emergencyBuffer: emergencyReserve
    };

    const calculatedResults: LifeInsuranceResults = {
      totalCoverageNeeded,
      additionalCoverageNeeded,
      incomeReplacement,
      debtCoverage: totalCurrentDebts,
      educationFunding: totalEducationCosts,
      emergencyReserve,
      finalExpenses,
      presentValueNeeded,
      monthlyPremiumEstimate,
      annualPremiumEstimate,
      coverageBreakdown
    };

    setResults(calculatedResults);
  }, [inputs]);

  React.useEffect(() => {
    calculateLifeInsurance();
  }, [calculateLifeInsurance]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <CalculatorLayoutWithAds
      title="Life Insurance Coverage Calculator"
      description="Calculate the optimal life insurance coverage amount based on your income, debts, expenses, and financial goals. Get personalized recommendations with AI analysis."
      keywords="life insurance calculator, coverage calculator, term life insurance, whole life insurance, insurance needs analysis"
    >
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AppleStyleCard>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Users className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Current Age"
                    type="number"
                    value={inputs.currentAge.toString()}
                    onChange={(e) => handleInputChange('currentAge', e.target.value)}
                    min="18"
                    max="80"
                  />
                  <AppleStyleInput
                    label="Annual Income"
                    type="number"
                    value={inputs.annualIncome.toString()}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    placeholder="75000"
                  />
                  <AppleStyleInput
                    label="Spouse Annual Income"
                    type="number"
                    value={inputs.spouseIncome.toString()}
                    onChange={(e) => handleInputChange('spouseIncome', e.target.value)}
                    placeholder="45000"
                  />
                  <AppleStyleInput
                    label="Number of Children"
                    type="number"
                    value={inputs.numChildren.toString()}
                    onChange={(e) => handleInputChange('numChildren', e.target.value)}
                    min="0"
                    max="10"
                  />
                  <AppleStyleInput
                    label="Children's Ages (comma separated)"
                    type="text"
                    value={inputs.childrenAges}
                    onChange={(e) => handleInputChange('childrenAges', e.target.value)}
                    placeholder="8, 12, 15"
                  />
                  <AppleStyleInput
                    label="Monthly Expenses"
                    type="number"
                    value={inputs.monthlyExpenses.toString()}
                    onChange={(e) => handleInputChange('monthlyExpenses', e.target.value)}
                    placeholder="5500"
                  />
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Debts & Obligations</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Mortgage Balance"
                    type="number"
                    value={inputs.mortgageBalance.toString()}
                    onChange={(e) => handleInputChange('mortgageBalance', e.target.value)}
                    placeholder="200000"
                  />
                  <AppleStyleInput
                    label="Credit Card Debt"
                    type="number"
                    value={inputs.creditCardDebt.toString()}
                    onChange={(e) => handleInputChange('creditCardDebt', e.target.value)}
                    placeholder="8000"
                  />
                  <AppleStyleInput
                    label="Student Loans"
                    type="number"
                    value={inputs.studentLoans.toString()}
                    onChange={(e) => handleInputChange('studentLoans', e.target.value)}
                    placeholder="12000"
                  />
                  <AppleStyleInput
                    label="Other Debts"
                    type="number"
                    value={inputs.otherDebts.toString()}
                    onChange={(e) => handleInputChange('otherDebts', e.target.value)}
                    placeholder="5000"
                  />
                  <AppleStyleInput
                    label="Education Costs per Child"
                    type="number"
                    value={inputs.educationCosts.toString()}
                    onChange={(e) => handleInputChange('educationCosts', e.target.value)}
                    placeholder="100000"
                  />
                  <AppleStyleInput
                    label="Years of Income Support"
                    type="number"
                    value={inputs.yearsOfSupport.toString()}
                    onChange={(e) => handleInputChange('yearsOfSupport', e.target.value)}
                    min="5"
                    max="30"
                  />
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Current Assets & Insurance</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Existing Life Insurance"
                    type="number"
                    value={inputs.existingLifeInsurance.toString()}
                    onChange={(e) => handleInputChange('existingLifeInsurance', e.target.value)}
                    placeholder="100000"
                  />
                  <AppleStyleInput
                    label="Current Savings"
                    type="number"
                    value={inputs.existingSavings.toString()}
                    onChange={(e) => handleInputChange('existingSavings', e.target.value)}
                    placeholder="50000"
                  />
                  <AppleStyleInput
                    label="Retirement Savings"
                    type="number"
                    value={inputs.retirementSavings.toString()}
                    onChange={(e) => handleInputChange('retirementSavings', e.target.value)}
                    placeholder="125000"
                  />
                  <AppleStyleInput
                    label="Emergency Fund Target"
                    type="number"
                    value={inputs.emergencyFund.toString()}
                    onChange={(e) => handleInputChange('emergencyFund', e.target.value)}
                    placeholder="35000"
                  />
                  <AppleStyleInput
                    label="Expected Inflation Rate (%)"
                    type="number"
                    value={inputs.expectedInflation.toString()}
                    onChange={(e) => handleInputChange('expectedInflation', e.target.value)}
                    step="0.1"
                    min="1"
                    max="10"
                  />
                  <AppleStyleInput
                    label="Expected Rate of Return (%)"
                    type="number"
                    value={inputs.rateOfReturn.toString()}
                    onChange={(e) => handleInputChange('rateOfReturn', e.target.value)}
                    step="0.1"
                    min="3"
                    max="12"
                  />
                </div>
              </div>
            </AppleStyleCard>
          </div>

          <div className="space-y-6">
            {results && (
              <>
                <AppleStyleCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Calculator className="w-6 h-6 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Coverage Analysis</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Coverage Needed</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(results.totalCoverageNeeded)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Coverage Needed</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(results.additionalCoverageNeeded)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Monthly Premium</span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {formatCurrency(results.monthlyPremiumEstimate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AppleStyleCard>

                <AppleStyleCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Coverage Breakdown</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Income Replacement</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(results.coverageBreakdown.incomeReplacement)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Immediate Needs</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(results.coverageBreakdown.immediateNeeds)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Future Obligations</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(results.coverageBreakdown.futureObligations)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Emergency Buffer</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(results.coverageBreakdown.emergencyBuffer)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AppleStyleCard>
              </>
            )}
          </div>
        </div>

        {results && (
          <div className="mt-8">
            <ExportShareButtons
              calculatorType="life-insurance"
              inputs={inputs}
              results={results}
              title="Life Insurance Coverage Estimate"
            />
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <AppleStyleCard>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Understanding Life Insurance Needs</h3>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Life insurance serves as a financial safety net for your loved ones, replacing your income and covering 
                  essential expenses if something happens to you. The right coverage amount depends on multiple factors 
                  including your income, debts, family size, and future financial obligations.
                </p>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Components of Coverage</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li><strong>Income Replacement:</strong> Typically 10-12 times your annual income to maintain your family's lifestyle</li>
                  <li><strong>Debt Coverage:</strong> Pay off mortgage, credit cards, and other outstanding debts</li>
                  <li><strong>Education Funding:</strong> Ensure children can attend college without financial burden</li>
                  <li><strong>Final Expenses:</strong> Cover funeral costs and immediate expenses</li>
                  <li><strong>Emergency Buffer:</strong> Additional funds for unexpected situations</li>
                </ul>
              </div>
            </div>
          </AppleStyleCard>

          <AppleStyleCard>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Info className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Types of Life Insurance</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Term Life Insurance</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Provides coverage for a specific period (10, 20, or 30 years). Most affordable option 
                    with pure death benefit protection. Ideal for temporary needs like mortgage protection.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Whole Life Insurance</h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Permanent coverage with cash value component. Higher premiums but provides lifelong 
                    protection and investment growth. Good for estate planning and long-term wealth building.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Universal Life Insurance</h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Flexible permanent insurance allowing premium and death benefit adjustments. 
                    Cash value earns interest based on market performance. Suitable for changing financial needs.
                  </p>
                </div>
              </div>
            </div>
          </AppleStyleCard>
        </div>

        <div className="mt-8">
          <AppleStyleCard>
            <div className="p-8">
              <div className="flex items-center mb-6">
                <AlertCircle className="w-8 h-8 text-orange-600 mr-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Life Insurance Planning Guide</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Factors Affecting Premium Costs</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Age:</strong> Younger applicants receive significantly lower premiums</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Health:</strong> Medical exams and health history impact rates</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Lifestyle:</strong> Smoking, drinking, and risky hobbies increase costs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Coverage Amount:</strong> Higher death benefits mean higher premiums</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Policy Type:</strong> Term vs. permanent insurance pricing differences</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Money-Saving Strategies</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Buy Young:</strong> Locking in rates early saves money long-term</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Annual Premiums:</strong> Pay yearly instead of monthly to avoid fees</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Shop Around:</strong> Compare quotes from multiple insurers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Group Policies:</strong> Employer-sponsored coverage may be cost-effective</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Healthy Lifestyle:</strong> Maintain good health for better rates</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">When to Review Your Coverage</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Life Changes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Marriage, divorce, birth of children, or career changes</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Financial Milestones</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Debt payoff, income changes, or major purchases</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Policy Changes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Term expiration, rate increases, or new product options</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Important Disclaimer</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      This calculator provides estimates based on general assumptions and should not replace professional 
                      financial advice. Actual insurance needs and premiums may vary based on individual circumstances, 
                      health conditions, and insurer underwriting guidelines. Consult with a licensed insurance professional 
                      for personalized recommendations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </AppleStyleCard>
        </div>
    </CalculatorLayoutWithAds>
  );
};

export default LifeInsuranceCalculator;