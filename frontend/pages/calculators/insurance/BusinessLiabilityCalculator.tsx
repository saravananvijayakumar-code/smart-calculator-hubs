import { useState, useCallback, useEffect } from 'react';
import { Building2, Shield, DollarSign, TrendingUp, Users, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AppleStyleCard } from '../../../components/AppleStyleCard';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface BusinessLiabilityInputs {
  businessType: string;
  annualRevenue: number;
  employeeCount: number;
  coverageLimit: number;
  yearsInBusiness: number;
  claimsHistory: number;
  location: string;
  professionalServices: boolean;
  cyberCoverage: boolean;
  productLiability: boolean;
}

interface CalculationResults {
  annualPremium: number;
  monthlyPremium: number;
  coveragePerIncident: number;
  annualAggregate: number;
  costPerEmployee: number;
}

const businessTypes = [
  'Retail Store',
  'Restaurant/Food Service',
  'Professional Services',
  'Consulting',
  'Technology/Software',
  'Healthcare Services',
  'Construction',
  'Manufacturing',
  'Wholesale Distribution',
  'Real Estate',
  'Marketing/Advertising',
  'E-commerce',
];

const usStates = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const businessTypeRiskFactors: Record<string, number> = {
  'Technology/Software': 0.7,
  'Consulting': 0.8,
  'Professional Services': 0.85,
  'Marketing/Advertising': 0.9,
  'E-commerce': 0.95,
  'Real Estate': 1.0,
  'Retail Store': 1.1,
  'Healthcare Services': 1.2,
  'Wholesale Distribution': 1.3,
  'Restaurant/Food Service': 1.5,
  'Manufacturing': 1.6,
  'Construction': 2.0,
};

const highCostStates = ['CA', 'NY', 'FL', 'TX', 'IL', 'NJ', 'PA'];

export default function BusinessLiabilityCalculator() {
  const [inputs, setInputs] = useState<BusinessLiabilityInputs>({
    businessType: 'Professional Services',
    annualRevenue: 500000,
    employeeCount: 5,
    coverageLimit: 1000000,
    yearsInBusiness: 3,
    claimsHistory: 0,
    location: 'CA',
    professionalServices: false,
    cyberCoverage: false,
    productLiability: false,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  const calculatePremium = useCallback(() => {
    // Base premium calculation
    let basePremium = 1200; // Starting point

    // Business type risk factor
    const typeFactor = businessTypeRiskFactors[inputs.businessType] || 1.0;
    basePremium *= typeFactor;

    // Revenue-based adjustment
    const revenueMultiplier = Math.sqrt(inputs.annualRevenue / 500000);
    basePremium *= revenueMultiplier;

    // Employee count factor
    const employeeFactor = 1 + (Math.log(inputs.employeeCount + 1) * 0.15);
    basePremium *= employeeFactor;

    // Coverage limit adjustment
    if (inputs.coverageLimit === 500000) basePremium *= 0.75;
    else if (inputs.coverageLimit === 1000000) basePremium *= 1.0;
    else basePremium *= 1.4; // $2M

    // Years in business discount
    if (inputs.yearsInBusiness < 2) basePremium *= 1.3;
    else if (inputs.yearsInBusiness >= 5) basePremium *= 0.85;
    else if (inputs.yearsInBusiness >= 10) basePremium *= 0.75;

    // Claims history surcharge
    if (inputs.claimsHistory > 0) {
      basePremium *= 1 + (inputs.claimsHistory * 0.25);
    }

    // Location factor
    const locationFactor = highCostStates.includes(inputs.location) ? 1.3 : 1.0;
    basePremium *= locationFactor;

    // Add-ons
    let totalPremium = basePremium;
    if (inputs.professionalServices) {
      totalPremium += basePremium * 0.4; // E&O coverage
    }
    if (inputs.cyberCoverage) {
      totalPremium += 800 + (inputs.annualRevenue / 1000000) * 500;
    }
    if (inputs.productLiability) {
      totalPremium += basePremium * 0.3;
    }

    const annualPremium = Math.round(totalPremium * 100) / 100;
    const monthlyPremium = Math.round((annualPremium / 12) * 100) / 100;
    const coveragePerIncident = inputs.coverageLimit;
    const annualAggregate = inputs.coverageLimit * 2;
    const costPerEmployee = inputs.employeeCount > 0 ? Math.round((annualPremium / inputs.employeeCount) * 100) / 100 : 0;

    setResults({
      annualPremium,
      monthlyPremium,
      coveragePerIncident,
      annualAggregate,
      costPerEmployee,
    });
  }, [inputs]);

  useEffect(() => {
    calculatePremium();
  }, [calculatePremium]);

  return (
    <CalculatorLayoutWithAds
      title="Business Liability Insurance Calculator | Small Business Insurance Cost Estimator"
      description="Calculate business liability insurance costs for your company. Estimate general liability, E&O, and cyber insurance premiums based on industry, revenue, and coverage needs."
      keywords="business liability insurance calculator, small business insurance cost, general liability premium, commercial insurance estimator, business insurance quote"
    >
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent">
          🏢 Business Liability Insurance Calculator
        </h1>
        <p className="text-xl text-muted-foreground">
          Estimate insurance costs to protect your business from lawsuits, claims, and unexpected liabilities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <AppleStyleCard className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              Business Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Business Type</label>
                <select
                  value={inputs.businessType}
                  onChange={(e) => setInputs(prev => ({ ...prev, businessType: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {businessTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <AppleStyleInput
                label="Annual Revenue ($)"
                type="number"
                value={inputs.annualRevenue}
                onChange={(value) => setInputs(prev => ({ ...prev, annualRevenue: Number(value) }))}
                min={0}
                step={50000}
              />

              <AppleStyleInput
                label="Number of Employees"
                type="number"
                value={inputs.employeeCount}
                onChange={(value) => setInputs(prev => ({ ...prev, employeeCount: Number(value) }))}
                min={0}
              />

              <AppleStyleInput
                label="Years in Business"
                type="number"
                value={inputs.yearsInBusiness}
                onChange={(value) => setInputs(prev => ({ ...prev, yearsInBusiness: Number(value) }))}
                min={0}
              />

              <div>
                <label className="block text-sm font-medium mb-2">Claims History (past 5 years)</label>
                <select
                  value={inputs.claimsHistory}
                  onChange={(e) => setInputs(prev => ({ ...prev, claimsHistory: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value={0}>No Claims</option>
                  <option value={1}>1 Claim</option>
                  <option value={2}>2 Claims</option>
                  <option value={3}>3 Claims</option>
                  <option value={4}>4 Claims</option>
                  <option value={5}>5+ Claims</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location (State)</label>
                <select
                  value={inputs.location}
                  onChange={(e) => setInputs(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {usStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
          </AppleStyleCard>

          <AppleStyleCard className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Coverage Options
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Coverage Limit</label>
                <select
                  value={inputs.coverageLimit}
                  onChange={(e) => setInputs(prev => ({ ...prev, coverageLimit: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value={500000}>$500,000</option>
                  <option value={1000000}>$1,000,000</option>
                  <option value={2000000}>$2,000,000</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium">Professional Services (E&O)</span>
                  <p className="text-xs text-muted-foreground">Errors & Omissions coverage</p>
                </div>
                <button
                  onClick={() => setInputs(prev => ({ ...prev, professionalServices: !prev.professionalServices }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inputs.professionalServices ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    inputs.professionalServices ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium">Cyber Coverage</span>
                  <p className="text-xs text-muted-foreground">Data breach & cyber liability</p>
                </div>
                <button
                  onClick={() => setInputs(prev => ({ ...prev, cyberCoverage: !prev.cyberCoverage }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inputs.cyberCoverage ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    inputs.cyberCoverage ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-sm font-medium">Product Liability</span>
                  <p className="text-xs text-muted-foreground">For physical product sales</p>
                </div>
                <button
                  onClick={() => setInputs(prev => ({ ...prev, productLiability: !prev.productLiability }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inputs.productLiability ? 'bg-teal-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    inputs.productLiability ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </AppleStyleCard>
        </div>

        <div className="space-y-6">
          {results && (
            <>
              <AppleStyleCard className="bg-gradient-to-br from-teal-600 to-cyan-600 text-white">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <p className="text-lg opacity-90 mb-2">Estimated Annual Premium</p>
                  <p className="text-5xl font-bold mb-4">${results.annualPremium.toLocaleString()}</p>
                  <p className="text-xl opacity-90">
                    ${results.monthlyPremium.toFixed(2)} / month
                  </p>
                </div>
              </AppleStyleCard>

              <div>
                <AppleStyleCard>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Coverage Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Per Incident Coverage</span>
                      <span className="font-semibold">${results.coveragePerIncident.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Annual Aggregate</span>
                      <span className="font-semibold">${results.annualAggregate.toLocaleString()}</span>
                    </div>
                    {inputs.employeeCount > 0 && (
                      <div className="flex justify-between items-center py-2 bg-teal-50 dark:bg-teal-950/20 rounded-lg px-3">
                        <span className="font-medium">Cost Per Employee</span>
                        <span className="font-bold text-lg text-teal-600 dark:text-teal-400">
                          ${results.costPerEmployee.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>
                </AppleStyleCard>
              </div>

              <div>
                <AppleStyleCard>
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Coverage Breakdown
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between py-2">
                      <span>General Liability</span>
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                    {inputs.professionalServices && (
                      <div className="flex items-center justify-between py-2">
                        <span>Professional Liability (E&O)</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                    {inputs.cyberCoverage && (
                      <div className="flex items-center justify-between py-2">
                        <span>Cyber Liability</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                    {inputs.productLiability && (
                      <div className="flex items-center justify-between py-2">
                        <span>Product Liability</span>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                    )}
                  </div>
                </AppleStyleCard>
              </div>

              <div>
                <AppleStyleCard className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Recommendations
                  </h3>
                  <div className="space-y-2 text-sm">
                    {businessTypeRiskFactors[inputs.businessType] > 1.4 && (
                      <p className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                        <span>Your industry has higher liability risk. Consider umbrella coverage for additional protection.</span>
                      </p>
                    )}
                    {inputs.employeeCount > 10 && (
                      <p className="flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 text-blue-600 flex-shrink-0" />
                        <span>With {inputs.employeeCount} employees, also consider Employment Practices Liability Insurance (EPLI).</span>
                      </p>
                    )}
                    {inputs.claimsHistory > 0 && (
                      <p className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
                        <span>Your claims history affects pricing. Implementing risk management practices can reduce future premiums.</span>
                      </p>
                    )}
                    {!inputs.cyberCoverage && inputs.businessType.includes('Technology') && (
                      <p className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                        <span>Technology businesses should strongly consider cyber liability coverage for data breach protection.</span>
                      </p>
                    )}
                  </div>
                </AppleStyleCard>
              </div>

              <ExportShareButtons
                calculatorType="business-liability"
                inputs={inputs}
                results={results}
                title="Business Liability Insurance Estimate"
              />
            </>
          )}
        </div>
      </div>

      <BusinessLiabilityArticle />
    </CalculatorLayoutWithAds>
  );
}

function BusinessLiabilityArticle() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "What does general liability insurance cover?",
      a: "General liability (GL) insurance protects your business against claims of bodily injury, property damage, and personal/advertising injury caused by your operations, products, or services. This includes customer slip-and-fall accidents, damage to client property during work, libel or slander claims, and copyright infringement in your advertising. It's the foundation of business insurance and often required by contracts and leases."
    },
    {
      q: "What's the difference between General Liability and Professional Liability (E&O)?",
      a: "General Liability covers physical injuries and property damage. Professional Liability (Errors & Omissions or E&O) covers financial losses resulting from your professional advice, services, or work product - like a consultant's bad advice costing a client money, or a designer's mistake causing project delays. Service-based businesses need both types of coverage."
    },
    {
      q: "How much business insurance coverage do I need?",
      a: "Most small businesses start with $1 million per occurrence and $2 million aggregate. However, needs vary: if you have commercial leases, landlords often require $1-2M. Client contracts may mandate $2-5M or more. High-risk industries or large contracts need higher limits. Consider your revenue, assets, contract requirements, and industry standards when deciding."
    },
    {
      q: "What is cyber liability insurance and do I need it?",
      a: "Cyber liability covers costs from data breaches, including forensic investigation, customer notification, credit monitoring, legal defense, regulatory fines, and business interruption. ANY business storing customer data electronically needs it - not just tech companies. Even a small breach affecting 100 customers can cost $50,000-$100,000+. If you collect emails, payment info, or personal data, you need cyber coverage."
    },
    {
      q: "Why do premiums vary so much by industry?",
      a: "Insurers price based on claim frequency and severity in your industry. Construction and manufacturing have high injury rates (expensive claims). Restaurants face food poisoning lawsuits. Consultants risk costly E&O claims. Retail has slip-and-fall exposure. Tech companies need cyber coverage. Your industry's loss history directly affects what insurers charge. Higher risk = higher premiums."
    },
    {
      q: "Can I get business insurance if I work from home or am self-employed?",
      a: "Absolutely! In fact, home-based businesses especially need coverage since homeowners policies exclude business activities. If you have clients visiting, deliver services, or sell products, you need business insurance. Many insurers offer affordable policies for sole proprietors and home-based businesses, often starting at $400-600/year for basic GL coverage."
    },
    {
      q: "What's the difference between occurrence and claims-made policies?",
      a: "Occurrence policies cover incidents that happened during the policy period, regardless of when the claim is filed. Claims-made policies only cover claims filed while the policy is active. Occurrence is simpler and provides longer protection but costs more. Claims-made is cheaper but requires 'tail coverage' if you cancel to protect against future claims for past work."
    },
    {
      q: "How can I reduce my business insurance costs?",
      a: "Several strategies work: Bundle multiple policies (GL, property, auto) with one insurer for 10-25% discounts. Choose higher deductibles if you can afford them. Implement safety programs and employee training. Maintain a claims-free history. Join industry associations offering group rates. Increase your deductible from $500 to $2,500 can save 15-30% annually."
    }
  ];

  return (
    <div className="prose prose-lg max-w-none mt-16 dark:prose-invert">
      <div>
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          🏢 The Complete Guide to Business Liability Insurance
        </h2>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-2xl p-8 mb-8 not-prose">
          <p className="text-lg leading-relaxed mb-0">
            Starting a business is exciting - until you realize how many things can go wrong! 😰 A customer slips in your store, 
            a client sues over bad advice, a data breach exposes customer information, or a product defect causes injury. Without 
            proper insurance, a single lawsuit could bankrupt your business and wipe out your personal assets. Business liability 
            insurance is your financial shield against the unexpected risks of running a company. Let's explore how to protect 
            everything you've worked so hard to build!
          </p>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">🎯 Types of Business Liability Insurance Explained</h3>
        <p>
          Business insurance isn't one-size-fits-all. Different types of liability insurance protect against different risks. 
          Understanding each type helps you build comprehensive protection:
        </p>

        <div className="space-y-6 my-8">
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-xl p-6 not-prose">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              1. General Liability Insurance (GL)
            </h4>
            <p className="mb-4">
              The foundation of business insurance, covering bodily injury, property damage, and personal/advertising injury. This is 
              what protects you when a customer falls in your store, your work damages client property, or your ad infringes on a 
              competitor's trademark.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="font-semibold mb-2">✅ What's Covered:</p>
                <ul className="space-y-1 text-xs ml-3">
                  <li>• Customer injuries at your location</li>
                  <li>• Property damage during operations</li>
                  <li>• Libel, slander, defamation claims</li>
                  <li>• Copyright/trademark infringement</li>
                  <li>• Legal defense costs</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                <p className="font-semibold mb-2">❌ What's NOT Covered:</p>
                <ul className="space-y-1 text-xs ml-3">
                  <li>• Professional mistakes/advice</li>
                  <li>• Employee injuries (need Workers Comp)</li>
                  <li>• Auto accidents (need Commercial Auto)</li>
                  <li>• Intentional acts</li>
                  <li>• Pollution/environmental damage</li>
                </ul>
              </div>
            </div>
            <p className="mt-4 text-sm"><strong>Typical Cost:</strong> $400-$1,500/year for small businesses | <strong>Who Needs It:</strong> Every business</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 not-prose">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Users className="w-6 h-6" />
              2. Professional Liability / E&O Insurance
            </h4>
            <p className="mb-4">
              Errors & Omissions (E&O) insurance protects service-based professionals against claims of negligence, mistakes, or failure 
              to deliver promised services. If your advice, designs, or professional work causes financial harm to a client, this coverage 
              pays for defense and damages.
            </p>
            <div className="bg-blue-100 dark:bg-blue-900/50 rounded-lg p-4 mb-3">
              <p className="text-sm mb-2 font-semibold">💼 Industries That MUST Have E&O:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p>• Consultants</p>
                  <p>• Lawyers/Accountants</p>
                  <p>• Real Estate Agents</p>
                  <p>• Insurance Agents</p>
                </div>
                <div>
                  <p>• IT/Tech Services</p>
                  <p>• Marketing Agencies</p>
                  <p>• Engineers/Architects</p>
                  <p>• Healthcare Providers</p>
                </div>
              </div>
            </div>
            <p className="text-sm"><strong>Typical Cost:</strong> $500-$3,000/year | <strong>Coverage:</strong> $1M-$5M per claim</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-6 not-prose">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
              <Building2 className="w-6 h-6" />
              3. Cyber Liability Insurance
            </h4>
            <p className="mb-4">
              In today's digital world, data breaches aren't just a big-company problem. If you store ANY customer information 
              electronically (emails, payment data, addresses), you're at risk. Cyber insurance covers breach response costs, 
              customer notification, credit monitoring, legal fees, and regulatory fines.
            </p>
            <div className="bg-purple-100 dark:bg-purple-900/50 rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">⚠️ Average Cost of a Data Breach:</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-white dark:bg-gray-800 rounded p-2">
                  <p className="font-bold text-lg text-purple-600">$150/record</p>
                  <p>Average per-customer cost</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-2">
                  <p className="font-bold text-lg text-purple-600">$40,000+</p>
                  <p>Small breach (100-500 records)</p>
                </div>
              </div>
            </div>
            <p className="mt-3 text-sm"><strong>Typical Cost:</strong> $800-$2,500/year | <strong>Who Needs It:</strong> Any business with customer data</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-6 not-prose">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              4. Product Liability Insurance
            </h4>
            <p className="mb-3">
              If you manufacture, wholesale, distribute, or sell physical products, you need product liability coverage. This protects 
              against claims that your product caused injury or property damage due to defects, inadequate warnings, or design flaws.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white dark:bg-gray-800 rounded p-3">
                <p className="font-bold mb-1">Manufacturing Defect</p>
                <p className="text-xs">Product differs from design specs and causes harm</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-3">
                <p className="font-bold mb-1">Design Defect</p>
                <p className="text-xs">Inherently dangerous design even when properly made</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded p-3">
                <p className="font-bold mb-1">Failure to Warn</p>
                <p className="text-xs">Inadequate instructions or safety warnings</p>
              </div>
            </div>
            <p className="mt-3 text-sm"><strong>Typical Cost:</strong> Varies widely | <strong>Note:</strong> Food/supplements/health products cost significantly more</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">📊 Industry-Specific Insurance Needs</h3>
        <p>
          Different industries face unique liability risks. Here's what businesses in various sectors typically need:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-teal-500">
            <h5 className="font-bold mb-2">🏪 Retail & Restaurants</h5>
            <ul className="text-sm space-y-1 ml-4">
              <li>• General Liability (slip-and-fall, injuries)</li>
              <li>• Product Liability (if selling products)</li>
              <li>• Liquor Liability (for bars/restaurants)</li>
              <li>• Property Insurance</li>
              <li>• Workers Compensation</li>
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">Premium range: $1,200-$3,500/year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-blue-500">
            <h5 className="font-bold mb-2">💼 Professional Services</h5>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Professional Liability/E&O (essential)</li>
              <li>• General Liability</li>
              <li>• Cyber Liability</li>
              <li>• Directors & Officers (D&O) if incorporated</li>
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">Premium range: $1,500-$5,000/year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-purple-500">
            <h5 className="font-bold mb-2">💻 Technology & Software</h5>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Tech E&O (software errors/failures)</li>
              <li>• Cyber Liability (data breaches)</li>
              <li>• General Liability</li>
              <li>• Media Liability (content risks)</li>
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">Premium range: $2,000-$7,000/year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-orange-500">
            <h5 className="font-bold mb-2">🔨 Construction & Trades</h5>
            <ul className="text-sm space-y-1 ml-4">
              <li>• General Liability (injury/property damage)</li>
              <li>• Tools & Equipment Insurance</li>
              <li>• Commercial Auto</li>
              <li>• Workers Compensation (if employees)</li>
              <li>• Completed Operations coverage</li>
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">Premium range: $2,500-$8,000/year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-pink-500">
            <h5 className="font-bold mb-2">🏥 Healthcare Services</h5>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Medical Malpractice/Professional Liability</li>
              <li>• General Liability</li>
              <li>• Cyber Liability (HIPAA compliance)</li>
              <li>• EPLI (Employment Practices)</li>
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">Premium range: $3,000-$15,000+/year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border-l-4 border-indigo-500">
            <h5 className="font-bold mb-2">🏭 Manufacturing</h5>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Product Liability (critical)</li>
              <li>• General Liability</li>
              <li>• Property/Equipment Insurance</li>
              <li>• Completed Operations</li>
              <li>• Workers Compensation</li>
            </ul>
            <p className="text-xs mt-2 text-muted-foreground">Premium range: $3,000-$12,000+/year</p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">💡 Pro Tips for Reducing Insurance Costs</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8 not-prose">
          <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950/30 dark:to-emerald-900/30 rounded-xl p-5">
            <div className="text-3xl mb-3">📦</div>
            <h4 className="font-bold mb-2">Bundle Policies</h4>
            <p className="text-sm">
              Combine GL, property, and auto insurance with one carrier for 10-25% discounts. Business Owner's Policies (BOP) bundle 
              GL and property at lower cost than buying separately.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30 rounded-xl p-5">
            <div className="text-3xl mb-3">🎓</div>
            <h4 className="font-bold mb-2">Implement Safety Programs</h4>
            <p className="text-sm">
              Employee safety training, workplace safety procedures, and documented risk management practices can earn 5-15% premium 
              discounts from many insurers.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30 rounded-xl p-5">
            <div className="text-3xl mb-3">💰</div>
            <h4 className="font-bold mb-2">Higher Deductibles</h4>
            <p className="text-sm">
              Increasing deductible from $500 to $2,500 can reduce premiums 15-30%. Only makes sense if you have emergency funds to 
              cover potential claims.
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/30 rounded-xl p-5">
            <div className="text-3xl mb-3">🏆</div>
            <h4 className="font-bold mb-2">Maintain Claims-Free History</h4>
            <p className="text-sm">
              No claims for 3-5 years can earn 10-20% discounts. Consider paying small claims out-of-pocket to avoid rate increases 
              that cost more long-term.
            </p>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/30 rounded-xl p-5">
            <div className="text-3xl mb-3">🤝</div>
            <h4 className="font-bold mb-2">Join Industry Associations</h4>
            <p className="text-sm">
              Many professional/trade associations offer group insurance rates 15-30% below retail. Membership dues often pay for 
              themselves in insurance savings alone.
            </p>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/30 rounded-xl p-5">
            <div className="text-3xl mb-3">🔍</div>
            <h4 className="font-bold mb-2">Shop Around Annually</h4>
            <p className="text-sm">
              Insurance markets fluctuate. Get 3-4 quotes every renewal. You might find 20-40% savings by switching carriers for 
              identical coverage.
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">⚠️ Common Mistakes That Cost Businesses Dearly</h3>

        <div className="space-y-4 my-6">
          <div className="bg-white dark:bg-gray-800 border-l-4 border-red-500 rounded-r-xl p-5 not-prose">
            <h4 className="font-bold mb-2 text-red-600 dark:text-red-400">❌ Assuming You're Too Small to Need Insurance</h4>
            <p className="text-sm">
              "I'm just a freelancer/solopreneur" is the #1 mistake. A single lawsuit can bankrupt even small businesses. Sole 
              proprietors are personally liable - your home, savings, and future earnings are at risk. Basic GL coverage costs 
              $400-800/year - far cheaper than one lawsuit.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border-l-4 border-orange-500 rounded-r-xl p-5 not-prose">
            <h4 className="font-bold mb-2 text-orange-600 dark:text-orange-400">❌ Relying Only on Client's Insurance</h4>
            <p className="text-sm">
              If you're an independent contractor or vendor, don't assume the client's insurance covers you. Most contracts require 
              YOU to carry insurance and often name the client as "additional insured." Without it, you can't get contracts with 
              larger companies.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border-l-4 border-amber-500 rounded-r-xl p-5 not-prose">
            <h4 className="font-bold mb-2 text-amber-600 dark:text-amber-400">❌ Underestimating Coverage Limits</h4>
            <p className="text-sm">
              Choosing minimum coverage ($100K-$300K) to save money backfires when facing serious claims. Medical bills for severe 
              injuries easily exceed $500K. Court judgments can be millions. Most businesses need $1-2M minimum, with umbrella 
              policies providing additional $1-5M coverage.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border-l-4 border-yellow-500 rounded-r-xl p-5 not-prose">
            <h4 className="font-bold mb-2 text-yellow-600 dark:text-yellow-400">❌ Not Reading Policy Exclusions</h4>
            <p className="text-sm">
              Assuming you're covered without reading the policy is dangerous. GL doesn't cover professional advice. E&O might exclude 
              certain services. Cyber policies may not cover employee errors. Know what's excluded and add riders or separate policies 
              to close gaps.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 border-l-4 border-lime-500 rounded-r-xl p-5 not-prose">
            <h4 className="font-bold mb-2 text-lime-600 dark:text-lime-400">❌ Letting Coverage Lapse</h4>
            <p className="text-sm">
              Gaps in coverage can haunt you for years. With claims-made policies (common for E&O), you're only covered for claims 
              filed while the policy is active. If you let it lapse, incidents from your covered period become uninsured if claimed 
              later. Maintain continuous coverage!
            </p>
          </div>
        </div>

        <h3 className="text-2xl font-bold mt-8 mb-4">📋 Frequently Asked Questions</h3>
        <div className="space-y-4 mt-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <span className="font-semibold pr-4">{faq.q}</span>
                <div
                  className="transition-transform duration-300"
                  style={{ transform: openFaq === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <AlertCircle className="w-5 h-5 text-teal-500 flex-shrink-0" />
                </div>
              </button>
              <div
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: openFaq === index ? '500px' : '0',
                  opacity: openFaq === index ? 1 : 0
                }}
              >
                <div className="px-6 pb-4 text-muted-foreground">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 rounded-2xl p-8 mt-12 not-prose">
          <h3 className="text-2xl font-bold mb-4">🏁 Final Thoughts: Insurance as a Business Asset</h3>
          <p className="mb-4">
            Many entrepreneurs view insurance as an expensive necessity - a cost center that drains resources. But smart business owners 
            understand that insurance is actually a strategic asset that enables growth, protects personal wealth, and provides 
            competitive advantages.
          </p>
          <p className="mb-4">
            <strong>Insurance lets you say YES to opportunities:</strong> Win contracts with major clients who require insurance. Take 
            on higher-risk, higher-reward projects without betting the farm. Grow confidently knowing one mistake won't destroy 
            everything. Sleep soundly knowing your family's financial security isn't tied to business risks.
          </p>
          <p className="mb-4">
            For most businesses, the sweet spot is: <strong>$1-2M General Liability, industry-appropriate E&O/Professional Liability, 
            cyber coverage if handling data, and a $1-3M umbrella policy</strong>. Total cost? Often $2,000-$5,000/year - a small 
            price for protecting assets worth orders of magnitude more.
          </p>
          <p className="font-bold text-lg text-teal-700 dark:text-teal-400 mb-0">
            Remember: The cheapest insurance is useless if it doesn't actually protect you. Invest in quality coverage from rated 
            carriers, understand what you're buying, and review it annually as your business grows. Your future self will thank you! 🏢
          </p>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 mt-8 text-sm text-muted-foreground not-prose">
          <p className="mb-2"><strong>⚠️ Disclaimer:</strong></p>
          <p>
            This calculator provides rough estimates for educational purposes only and does not constitute insurance advice or a binding 
            quote. Actual premiums vary significantly based on detailed underwriting factors including specific business activities, 
            location, claims history, revenue details, employee information, and numerous other risk factors. Coverage terms, exclusions, 
            and availability differ substantially between insurers and jurisdictions. Always consult with licensed insurance professionals 
            and carefully review all policy documents before purchasing coverage. This information should not be considered legal, 
            financial, or professional advice.
          </p>
        </div>
      </div>
    </div>
  );
}
