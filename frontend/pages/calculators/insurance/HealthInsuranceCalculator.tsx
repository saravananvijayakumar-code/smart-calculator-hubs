import React, { useState, useCallback } from 'react';
import { Shield, Calculator, Heart, Users, TrendingUp, DollarSign, Info, BookOpen, AlertCircle, Activity } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AppleStyleCard } from '../../../components/AppleStyleCard';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { AppleStyleButton } from '../../../components/AppleStyleButton';
import { SEOHead } from '../../../components/SEOHead';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface HealthInsuranceInputs {
  age: number;
  spouseAge: number;
  numChildren: number;
  location: string;
  annualIncome: number;
  employerContribution: number;
  currentHealthStatus: string;
  preExistingConditions: boolean;
  smoker: boolean;
  preferredDeductible: number;
  maxOutOfPocket: number;
  preferredCoinsurance: number;
  doctorVisitsPerYear: number;
  prescriptionsPerMonth: number;
  chronicConditions: boolean;
  hospitalVisitsPerYear: number;
  familyMedicalHistory: boolean;
  planType: string;
  networkPreference: string;
  hsa_eligible: boolean;
}

interface HealthInsuranceResults {
  estimatedMonthlyPremium: number;
  annualPremium: number;
  totalAnnualCost: number;
  outOfPocketEstimate: number;
  deductibleAmount: number;
  coinsuranceAmount: number;
  copayAmount: number;
  subsidyEligible: boolean;
  subsidyAmount: number;
  netMonthlyPremium: number;
  planRecommendations: {
    bronze: { premium: number; deductible: number; maxOutOfPocket: number };
    silver: { premium: number; deductible: number; maxOutOfPocket: number };
    gold: { premium: number; deductible: number; maxOutOfPocket: number };
    platinum: { premium: number; deductible: number; maxOutOfPocket: number };
  };
  costBreakdown: {
    premiums: number;
    deductible: number;
    copays: number;
    coinsurance: number;
    prescriptions: number;
  };
}

const HealthInsuranceCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<HealthInsuranceInputs>({
    age: 35,
    spouseAge: 33,
    numChildren: 2,
    location: "Texas",
    annualIncome: 85000,
    employerContribution: 3600,
    currentHealthStatus: "good",
    preExistingConditions: false,
    smoker: false,
    preferredDeductible: 2500,
    maxOutOfPocket: 8000,
    preferredCoinsurance: 20,
    doctorVisitsPerYear: 4,
    prescriptionsPerMonth: 2,
    chronicConditions: false,
    hospitalVisitsPerYear: 0,
    familyMedicalHistory: false,
    planType: "ppo",
    networkPreference: "broad",
    hsa_eligible: true
  });

  const [results, setResults] = useState<HealthInsuranceResults | null>(null);

  const handleInputChange = (field: keyof HealthInsuranceInputs, value: string | boolean) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'boolean' ? value : 
               (field === 'location' || field === 'currentHealthStatus' || field === 'planType' || field === 'networkPreference') ? 
               value : parseFloat(value as string) || 0
    }));
  };

  const calculateHealthInsurance = useCallback(() => {
    const {
      age,
      spouseAge,
      numChildren,
      annualIncome,
      employerContribution,
      currentHealthStatus,
      preExistingConditions,
      smoker,
      preferredDeductible,
      maxOutOfPocket,
      preferredCoinsurance,
      doctorVisitsPerYear,
      prescriptionsPerMonth,
      chronicConditions,
      hospitalVisitsPerYear,
      familyMedicalHistory,
      planType,
      networkPreference,
      hsa_eligible
    } = inputs;

    let basePremium = 450;
    
    if (age > 50) basePremium += 150;
    else if (age > 40) basePremium += 75;
    else if (age < 30) basePremium -= 50;

    if (spouseAge > 0) {
      let spousePremium = 400;
      if (spouseAge > 50) spousePremium += 140;
      else if (spouseAge > 40) spousePremium += 70;
      else if (spouseAge < 30) spousePremium -= 45;
      basePremium += spousePremium;
    }

    basePremium += numChildren * 275;

    if (smoker) basePremium *= 1.5;
    if (preExistingConditions) basePremium *= 1.3;
    if (chronicConditions) basePremium *= 1.25;
    if (familyMedicalHistory) basePremium *= 1.1;

    if (currentHealthStatus === "excellent") basePremium *= 0.9;
    else if (currentHealthStatus === "poor") basePremium *= 1.4;

    if (planType === "hmo") basePremium *= 0.85;
    else if (planType === "epo") basePremium *= 0.95;
    else if (planType === "ppo") basePremium *= 1.1;

    if (networkPreference === "narrow") basePremium *= 0.9;
    else if (networkPreference === "broad") basePremium *= 1.05;

    const fpl = 30000;
    const incomeRatio = annualIncome / fpl;
    let subsidyEligible = false;
    let subsidyAmount = 0;

    if (incomeRatio <= 4.0 && annualIncome >= fpl) {
      subsidyEligible = true;
      if (incomeRatio <= 1.33) subsidyAmount = basePremium * 0.7;
      else if (incomeRatio <= 1.5) subsidyAmount = basePremium * 0.6;
      else if (incomeRatio <= 2.0) subsidyAmount = basePremium * 0.5;
      else if (incomeRatio <= 2.5) subsidyAmount = basePremium * 0.4;
      else if (incomeRatio <= 3.0) subsidyAmount = basePremium * 0.3;
      else if (incomeRatio <= 4.0) subsidyAmount = basePremium * 0.2;
    }

    const netMonthlyPremium = Math.max(0, basePremium - subsidyAmount - (employerContribution / 12));
    const annualPremium = netMonthlyPremium * 12;

    const copayAmount = doctorVisitsPerYear * 35 + hospitalVisitsPerYear * 250;
    const prescriptionCosts = prescriptionsPerMonth * 12 * 25;
    
    let estimatedMedicalExpenses = doctorVisitsPerYear * 200 + hospitalVisitsPerYear * 5000;
    if (chronicConditions) estimatedMedicalExpenses += 3000;
    if (preExistingConditions) estimatedMedicalExpenses += 2000;

    const deductibleAmount = Math.min(preferredDeductible, estimatedMedicalExpenses);
    const remainingExpenses = Math.max(0, estimatedMedicalExpenses - preferredDeductible);
    const coinsuranceAmount = remainingExpenses * (preferredCoinsurance / 100);
    
    const totalOutOfPocket = Math.min(
      deductibleAmount + coinsuranceAmount + copayAmount + prescriptionCosts,
      maxOutOfPocket
    );

    const totalAnnualCost = annualPremium + totalOutOfPocket;

    const planRecommendations = {
      bronze: {
        premium: basePremium * 0.75,
        deductible: 7000,
        maxOutOfPocket: 8700
      },
      silver: {
        premium: basePremium * 1.0,
        deductible: 4500,
        maxOutOfPocket: 8700
      },
      gold: {
        premium: basePremium * 1.35,
        deductible: 1500,
        maxOutOfPocket: 8700
      },
      platinum: {
        premium: basePremium * 1.75,
        deductible: 350,
        maxOutOfPocket: 8200
      }
    };

    const costBreakdown = {
      premiums: annualPremium,
      deductible: deductibleAmount,
      copays: copayAmount,
      coinsurance: coinsuranceAmount,
      prescriptions: prescriptionCosts
    };

    const calculatedResults: HealthInsuranceResults = {
      estimatedMonthlyPremium: basePremium,
      annualPremium,
      totalAnnualCost,
      outOfPocketEstimate: totalOutOfPocket,
      deductibleAmount,
      coinsuranceAmount,
      copayAmount,
      subsidyEligible,
      subsidyAmount,
      netMonthlyPremium,
      planRecommendations,
      costBreakdown
    };

    setResults(calculatedResults);
  }, [inputs]);

  React.useEffect(() => {
    calculateHealthInsurance();
  }, [calculateHealthInsurance]);

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
      title="Health Insurance Premium Calculator"
      description="Calculate health insurance premiums and compare plans based on your age, location, health status, and coverage needs. Get personalized recommendations with AI analysis."
      keywords="health insurance calculator, premium calculator, healthcare costs, insurance plans, ACA marketplace, health insurance comparison"
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
                    label="Your Age"
                    type="number"
                    value={inputs.age.toString()}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    min="18"
                    max="80"
                  />
                  <AppleStyleInput
                    label="Spouse Age (if applicable)"
                    type="number"
                    value={inputs.spouseAge.toString()}
                    onChange={(e) => handleInputChange('spouseAge', e.target.value)}
                    min="0"
                    max="80"
                  />
                  <AppleStyleInput
                    label="Number of Children"
                    type="number"
                    value={inputs.numChildren.toString()}
                    onChange={(e) => handleInputChange('numChildren', e.target.value)}
                    min="0"
                    max="10"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Location (State)</label>
                    <select
                      value={inputs.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Texas">Texas</option>
                      <option value="California">California</option>
                      <option value="Florida">Florida</option>
                      <option value="New York">New York</option>
                      <option value="Illinois">Illinois</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <AppleStyleInput
                    label="Annual Household Income"
                    type="number"
                    value={inputs.annualIncome.toString()}
                    onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                    placeholder="85000"
                  />
                  <AppleStyleInput
                    label="Employer Contribution (Annual)"
                    type="number"
                    value={inputs.employerContribution.toString()}
                    onChange={(e) => handleInputChange('employerContribution', e.target.value)}
                    placeholder="3600"
                  />
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Activity className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Health Profile</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Health Status</label>
                    <select
                      value={inputs.currentHealthStatus}
                      onChange={(e) => handleInputChange('currentHealthStatus', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="smoker"
                        checked={inputs.smoker}
                        onChange={(e) => handleInputChange('smoker', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="smoker" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Smoker</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preExisting"
                        checked={inputs.preExistingConditions}
                        onChange={(e) => handleInputChange('preExistingConditions', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="preExisting" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Pre-existing Conditions</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="chronic"
                        checked={inputs.chronicConditions}
                        onChange={(e) => handleInputChange('chronicConditions', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="chronic" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Chronic Conditions</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="familyHistory"
                        checked={inputs.familyMedicalHistory}
                        onChange={(e) => handleInputChange('familyMedicalHistory', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="familyHistory" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Family Medical History</label>
                    </div>
                  </div>
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <Heart className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Healthcare Usage</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Doctor Visits per Year"
                    type="number"
                    value={inputs.doctorVisitsPerYear.toString()}
                    onChange={(e) => handleInputChange('doctorVisitsPerYear', e.target.value)}
                    min="0"
                    max="50"
                  />
                  <AppleStyleInput
                    label="Prescriptions per Month"
                    type="number"
                    value={inputs.prescriptionsPerMonth.toString()}
                    onChange={(e) => handleInputChange('prescriptionsPerMonth', e.target.value)}
                    min="0"
                    max="20"
                  />
                  <AppleStyleInput
                    label="Hospital Visits per Year"
                    type="number"
                    value={inputs.hospitalVisitsPerYear.toString()}
                    onChange={(e) => handleInputChange('hospitalVisitsPerYear', e.target.value)}
                    min="0"
                    max="10"
                  />
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard>
              <div className="p-6">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Coverage Preferences</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Preferred Deductible"
                    type="number"
                    value={inputs.preferredDeductible.toString()}
                    onChange={(e) => handleInputChange('preferredDeductible', e.target.value)}
                    placeholder="2500"
                  />
                  <AppleStyleInput
                    label="Max Out-of-Pocket"
                    type="number"
                    value={inputs.maxOutOfPocket.toString()}
                    onChange={(e) => handleInputChange('maxOutOfPocket', e.target.value)}
                    placeholder="8000"
                  />
                  <AppleStyleInput
                    label="Preferred Coinsurance (%)"
                    type="number"
                    value={inputs.preferredCoinsurance.toString()}
                    onChange={(e) => handleInputChange('preferredCoinsurance', e.target.value)}
                    min="0"
                    max="50"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Plan Type</label>
                    <select
                      value={inputs.planType}
                      onChange={(e) => handleInputChange('planType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="hmo">HMO</option>
                      <option value="ppo">PPO</option>
                      <option value="epo">EPO</option>
                      <option value="pos">POS</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Network Preference</label>
                    <select
                      value={inputs.networkPreference}
                      onChange={(e) => handleInputChange('networkPreference', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="narrow">Narrow Network</option>
                      <option value="standard">Standard Network</option>
                      <option value="broad">Broad Network</option>
                    </select>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hsaEligible"
                      checked={inputs.hsa_eligible}
                      onChange={(e) => handleInputChange('hsa_eligible', e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="hsaEligible" className="ml-2 text-sm text-gray-700 dark:text-gray-300">HSA Eligible Plan Preferred</label>
                  </div>
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
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Premium Estimate</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Premium</span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatCurrency(results.estimatedMonthlyPremium)}
                        </span>
                      </div>
                      {results.subsidyEligible && (
                        <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">After Subsidies</span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            {formatCurrency(results.netMonthlyPremium)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Out-of-Pocket</span>
                        <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {formatCurrency(results.outOfPocketEstimate)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Annual Cost</span>
                        <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          {formatCurrency(results.totalAnnualCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </AppleStyleCard>

                <AppleStyleCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Plan Comparison</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-orange-600">Bronze</span>
                          <span className="text-sm font-medium">{formatCurrency(results.planRecommendations.bronze.premium)}/mo</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Deductible: {formatCurrency(results.planRecommendations.bronze.deductible)}
                        </div>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-blue-600">Silver</span>
                          <span className="text-sm font-medium">{formatCurrency(results.planRecommendations.silver.premium)}/mo</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Deductible: {formatCurrency(results.planRecommendations.silver.deductible)}
                        </div>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-yellow-600">Gold</span>
                          <span className="text-sm font-medium">{formatCurrency(results.planRecommendations.gold.premium)}/mo</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Deductible: {formatCurrency(results.planRecommendations.gold.deductible)}
                        </div>
                      </div>
                      <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-600">Platinum</span>
                          <span className="text-sm font-medium">{formatCurrency(results.planRecommendations.platinum.premium)}/mo</span>
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Deductible: {formatCurrency(results.planRecommendations.platinum.deductible)}
                        </div>
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
              calculatorType="health-insurance"
              inputs={inputs}
              results={results}
              title="Health Insurance Premium Estimate"
            />
          </div>
        )}

        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <AppleStyleCard>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <BookOpen className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Understanding Health Insurance Plans</h3>
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Health insurance helps protect you from high medical costs by sharing expenses between you and 
                  your insurance company. Understanding different plan types and their costs helps you choose 
                  the right coverage for your health needs and budget.
                </p>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Key Cost Components</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li><strong>Premium:</strong> Monthly payment to maintain coverage</li>
                  <li><strong>Deductible:</strong> Amount you pay before insurance kicks in</li>
                  <li><strong>Copayment:</strong> Fixed amount for specific services</li>
                  <li><strong>Coinsurance:</strong> Percentage you pay after meeting deductible</li>
                  <li><strong>Out-of-pocket maximum:</strong> Most you'll pay in a year</li>
                </ul>
              </div>
            </div>
          </AppleStyleCard>

          <AppleStyleCard>
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Info className="w-6 h-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Health Plan Metal Tiers</h3>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Bronze Plans (60% Coverage)</h4>
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    Lowest premiums, highest deductibles. Good for healthy individuals who want protection 
                    against major medical expenses but don't expect frequent care.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Silver Plans (70% Coverage)</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Balanced premiums and out-of-pocket costs. May qualify for cost-sharing reductions 
                    if income is between 100-250% of federal poverty level.
                  </p>
                </div>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Gold Plans (80% Coverage)</h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Higher premiums, lower out-of-pocket costs. Good if you use medical services frequently 
                    or take expensive medications regularly.
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Platinum Plans (90% Coverage)</h4>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    Highest premiums, lowest out-of-pocket costs. Best for those with chronic conditions 
                    or who expect high medical expenses.
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Health Insurance Planning Guide</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Choosing the Right Plan</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Assess Your Health Needs:</strong> Consider current conditions, medications, and expected care</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Check Provider Networks:</strong> Ensure your doctors and hospitals are covered</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Calculate Total Costs:</strong> Consider premiums plus expected out-of-pocket expenses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Review Drug Formularies:</strong> Check if your medications are covered</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Consider HSA Options:</strong> High-deductible plans may qualify for tax-advantaged savings</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Cost-Saving Strategies</h3>
                  <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Use Preventive Care:</strong> Most plans cover annual checkups and screenings at no cost</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Generic Medications:</strong> Choose generic drugs when available to reduce costs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>In-Network Providers:</strong> Stay within your plan's network to minimize expenses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>Urgent Care vs ER:</strong> Use urgent care for non-emergency situations</span>
                    </li>
                    <li className="flex items-start">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span><strong>HSA Contributions:</strong> Maximize tax-deductible health savings account contributions</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Special Enrollment Periods</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Life Events</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Marriage, birth, adoption, or loss of coverage</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Income Changes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Significant income increase or decrease affecting subsidies</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Coverage Loss</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Job loss, employer plan changes, or aging out of parents' plan</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Important Disclaimer</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      This calculator provides estimates based on general market data and should not replace 
                      professional insurance advice. Actual premiums may vary significantly based on specific 
                      plan details, insurance company, exact location, and individual health factors. Always 
                      compare actual quotes from licensed insurance agents or marketplace plans.
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

export default HealthInsuranceCalculator;