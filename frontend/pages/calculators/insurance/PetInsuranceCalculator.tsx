import { useState, useCallback, useEffect } from 'react';
import { DogIcon, CatIcon, DollarSign, Shield, Heart, TrendingUp, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AppleStyleCard } from '../../../components/AppleStyleCard';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface PetInsuranceInputs {
  petType: 'dog' | 'cat';
  breed: string;
  age: number;
  zipCode: string;
  coverageLevel: 'accident' | 'accident-illness' | 'comprehensive';
  annualLimit: number;
  deductible: number;
  reimbursement: number;
  preExisting: boolean;
  wellness: boolean;
  dental: boolean;
}

interface CalculationResults {
  monthlyPremium: number;
  annualPremium: number;
  estimatedOOP: number;
  coverageBreakdown: {
    accidentCoverage: number;
    illnessCoverage: number;
    wellnessCoverage: number;
    dentalCoverage: number;
  };
}

const dogBreeds = [
  'Mixed Breed',
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Yorkshire Terrier',
  'Boxer',
  'Dachshund',
  'Siberian Husky',
  'Great Dane',
  'Doberman',
  'Shih Tzu',
  'Boston Terrier',
  'Pomeranian',
  'Havanese',
  'Cavalier King Charles',
  'Chihuahua',
  'Cocker Spaniel',
];

const catBreeds = [
  'Mixed Breed',
  'Persian',
  'Maine Coon',
  'Siamese',
  'Ragdoll',
  'Bengal',
  'Abyssinian',
  'Birman',
  'Oriental Shorthair',
  'Sphynx',
  'Devon Rex',
  'American Shorthair',
  'British Shorthair',
  'Scottish Fold',
  'Russian Blue',
  'Himalayan',
  'Burmese',
  'Exotic Shorthair',
  'Norwegian Forest',
  'Cornish Rex',
  'Manx',
  'Balinese',
];

const breedRiskFactors: Record<string, number> = {
  'Mixed Breed': 0.9,
  'French Bulldog': 1.8,
  'Bulldog': 1.9,
  'Great Dane': 1.7,
  'Rottweiler': 1.5,
  'German Shepherd': 1.4,
  'Doberman': 1.4,
  'Persian': 1.6,
  'Maine Coon': 1.4,
  'Sphynx': 1.5,
  'Scottish Fold': 1.5,
  'Himalayan': 1.6,
};

export default function PetInsuranceCalculator() {
  const [inputs, setInputs] = useState<PetInsuranceInputs>({
    petType: 'dog',
    breed: 'Mixed Breed',
    age: 3,
    zipCode: '10001',
    coverageLevel: 'accident-illness',
    annualLimit: 10000,
    deductible: 250,
    reimbursement: 80,
    preExisting: false,
    wellness: false,
    dental: false,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);

  const calculatePremium = useCallback(() => {
    // Base premiums by pet type and coverage level
    let basePremium = 0;
    if (inputs.petType === 'dog') {
      if (inputs.coverageLevel === 'accident') basePremium = 20;
      else if (inputs.coverageLevel === 'accident-illness') basePremium = 45;
      else basePremium = 65;
    } else {
      if (inputs.coverageLevel === 'accident') basePremium = 15;
      else if (inputs.coverageLevel === 'accident-illness') basePremium = 35;
      else basePremium = 50;
    }

    // Breed risk factor
    const breedFactor = breedRiskFactors[inputs.breed] || 1.0;
    basePremium *= breedFactor;

    // Age multiplier
    let ageFactor = 1.0;
    if (inputs.age < 2) ageFactor = 0.8;
    else if (inputs.age <= 5) ageFactor = 1.0;
    else if (inputs.age <= 8) ageFactor = 1.3;
    else if (inputs.age <= 11) ageFactor = 1.7;
    else ageFactor = 2.2;
    basePremium *= ageFactor;

    // Annual limit factor
    if (inputs.annualLimit === 5000) basePremium *= 0.85;
    else if (inputs.annualLimit === 10000) basePremium *= 1.0;
    else basePremium *= 1.25; // Unlimited

    // Deductible discount
    if (inputs.deductible === 100) basePremium *= 1.15;
    else if (inputs.deductible === 250) basePremium *= 1.0;
    else if (inputs.deductible === 500) basePremium *= 0.85;
    else basePremium *= 0.7; // $1000

    // Reimbursement percentage
    if (inputs.reimbursement === 70) basePremium *= 0.9;
    else if (inputs.reimbursement === 80) basePremium *= 1.0;
    else basePremium *= 1.15; // 90%

    // Location multiplier (simple ZIP-based)
    const zipNum = parseInt(inputs.zipCode) || 10000;
    const locationFactor = 0.9 + ((zipNum % 100) / 200);
    basePremium *= locationFactor;

    // Add-ons
    let wellnessCost = 0;
    let dentalCost = 0;
    if (inputs.wellness) {
      wellnessCost = 15;
      basePremium += wellnessCost;
    }
    if (inputs.dental) {
      dentalCost = 12;
      basePremium += dentalCost;
    }

    // Pre-existing conditions surcharge
    if (inputs.preExisting) {
      basePremium *= 1.2;
    }

    const monthlyPremium = Math.round(basePremium * 100) / 100;
    const annualPremium = Math.round(monthlyPremium * 12 * 100) / 100;

    // Estimated annual out-of-pocket
    const avgAnnualClaim = inputs.petType === 'dog' ? 800 : 600;
    const reimbursementDecimal = inputs.reimbursement / 100;
    const estimatedOOP = Math.round((inputs.deductible + (avgAnnualClaim - inputs.deductible) * (1 - reimbursementDecimal)) * 100) / 100;

    const coverageBreakdown = {
      accidentCoverage: inputs.annualLimit,
      illnessCoverage: inputs.coverageLevel !== 'accident' ? inputs.annualLimit : 0,
      wellnessCoverage: inputs.wellness ? 300 : 0,
      dentalCoverage: inputs.dental ? inputs.annualLimit : 0,
    };

    setResults({
      monthlyPremium,
      annualPremium,
      estimatedOOP,
      coverageBreakdown,
    });
  }, [inputs]);

  useEffect(() => {
    calculatePremium();
  }, [calculatePremium]);

  const breeds = inputs.petType === 'dog' ? dogBreeds : catBreeds;

  return (
    <CalculatorLayoutWithAds
      title="Pet Insurance Premium Estimator | Dog & Cat Coverage Calculator"
      description="Calculate pet insurance costs for dogs and cats. Compare coverage levels, deductibles, and reimbursement rates to find the best pet insurance plan for your furry friend."
      keywords="pet insurance calculator, dog insurance cost, cat insurance premium, pet coverage estimator, veterinary insurance"
    >
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
          🐾 Pet Insurance Premium Estimator
        </h1>
        <p className="text-xl text-muted-foreground">
          Calculate the cost of protecting your furry family member with comprehensive pet insurance coverage
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <div>
          <AppleStyleCard className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              {inputs.petType === 'dog' ? <DogIcon className="w-6 h-6" /> : <CatIcon className="w-6 h-6" />}
              Pet Information
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pet Type</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, petType: 'dog', breed: 'Mixed Breed' }))}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      inputs.petType === 'dog'
                        ? 'bg-orange-500 text-white shadow-lg'
                        : 'bg-background border border-border hover:border-orange-500'
                    }`}
                  >
                    🐕 Dog
                  </button>
                  <button
                    onClick={() => setInputs(prev => ({ ...prev, petType: 'cat', breed: 'Mixed Breed' }))}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      inputs.petType === 'cat'
                        ? 'bg-amber-500 text-white shadow-lg'
                        : 'bg-background border border-border hover:border-amber-500'
                    }`}
                  >
                    🐈 Cat
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Breed</label>
                <select
                  value={inputs.breed}
                  onChange={(e) => setInputs(prev => ({ ...prev, breed: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  {breeds.map(breed => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              </div>

              <AppleStyleInput
                label="Age (years)"
                type="number"
                value={inputs.age}
                onChange={(value) => setInputs(prev => ({ ...prev, age: Number(value) }))}
                min={0}
                max={20}
              />

              <AppleStyleInput
                label="ZIP Code"
                type="text"
                value={inputs.zipCode}
                onChange={(value) => setInputs(prev => ({ ...prev, zipCode: value }))}
                maxLength={5}
              />
            </div>
          </AppleStyleCard>

          <AppleStyleCard className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Coverage Options
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Coverage Level</label>
                <select
                  value={inputs.coverageLevel}
                  onChange={(e) => setInputs(prev => ({ ...prev, coverageLevel: e.target.value as any }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="accident">Accident Only</option>
                  <option value="accident-illness">Accident + Illness</option>
                  <option value="comprehensive">Comprehensive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Annual Limit</label>
                <select
                  value={inputs.annualLimit}
                  onChange={(e) => setInputs(prev => ({ ...prev, annualLimit: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={5000}>$5,000</option>
                  <option value={10000}>$10,000</option>
                  <option value={999999}>Unlimited</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Deductible</label>
                <select
                  value={inputs.deductible}
                  onChange={(e) => setInputs(prev => ({ ...prev, deductible: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={100}>$100</option>
                  <option value={250}>$250</option>
                  <option value={500}>$500</option>
                  <option value={1000}>$1,000</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reimbursement %</label>
                <select
                  value={inputs.reimbursement}
                  onChange={(e) => setInputs(prev => ({ ...prev, reimbursement: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value={70}>70%</option>
                  <option value={80}>80%</option>
                  <option value={90}>90%</option>
                </select>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Pre-existing Conditions</span>
                <button
                  onClick={() => setInputs(prev => ({ ...prev, preExisting: !prev.preExisting }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inputs.preExisting ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    inputs.preExisting ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Wellness Add-on</span>
                <button
                  onClick={() => setInputs(prev => ({ ...prev, wellness: !prev.wellness }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inputs.wellness ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    inputs.wellness ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">Dental Coverage</span>
                <button
                  onClick={() => setInputs(prev => ({ ...prev, dental: !prev.dental }))}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    inputs.dental ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    inputs.dental ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
          </AppleStyleCard>
        </div>

        <div className="space-y-6">
          {results && (
            <>
              <AppleStyleCard className="bg-gradient-to-br from-orange-500 to-amber-500 text-white">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-80" />
                  <p className="text-lg opacity-90 mb-2">Estimated Monthly Premium</p>
                  <p className="text-5xl font-bold mb-4">${results.monthlyPremium.toFixed(2)}</p>
                  <p className="text-xl opacity-90">
                    ${results.annualPremium.toFixed(2)} / year
                  </p>
                </div>
              </AppleStyleCard>

              <AppleStyleCard>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Coverage Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Accident Coverage</span>
                    <span className="font-semibold">
                      ${results.coverageBreakdown.accidentCoverage === 999999 ? 'Unlimited' : results.coverageBreakdown.accidentCoverage.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Illness Coverage</span>
                    <span className="font-semibold">
                      {results.coverageBreakdown.illnessCoverage === 0 ? 'Not Covered' :
                       results.coverageBreakdown.illnessCoverage === 999999 ? 'Unlimited' :
                       `$${results.coverageBreakdown.illnessCoverage.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Wellness Coverage</span>
                    <span className="font-semibold">
                      {results.coverageBreakdown.wellnessCoverage === 0 ? 'Not Included' : `$${results.coverageBreakdown.wellnessCoverage}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground">Dental Coverage</span>
                    <span className="font-semibold">
                      {results.coverageBreakdown.dentalCoverage === 0 ? 'Not Included' :
                       results.coverageBreakdown.dentalCoverage === 999999 ? 'Unlimited' :
                       `$${results.coverageBreakdown.dentalCoverage.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </AppleStyleCard>

              <AppleStyleCard>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Estimated Annual Costs
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Annual Premium</span>
                    <span className="font-semibold">${results.annualPremium.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-muted-foreground">Est. Out-of-Pocket</span>
                    <span className="font-semibold">${results.estimatedOOP.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg px-3">
                    <span className="font-medium">Total Annual Cost</span>
                    <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                      ${(results.annualPremium + results.estimatedOOP).toFixed(2)}
                    </span>
                  </div>
                </div>
              </AppleStyleCard>

              <AppleStyleCard className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Recommended for {inputs.breed}
                </h3>
                <div className="space-y-2 text-sm">
                  {breedRiskFactors[inputs.breed] && breedRiskFactors[inputs.breed] > 1.4 ? (
                    <p className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>This breed is prone to certain health conditions. Consider comprehensive coverage with dental.</span>
                    </p>
                  ) : (
                    <p className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 text-green-600 flex-shrink-0" />
                      <span>This breed is generally healthy. Accident + Illness coverage is often sufficient.</span>
                    </p>
                  )}
                  {inputs.age > 8 && (
                    <p className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                      <span>Senior pets benefit from higher coverage limits and wellness add-ons for preventive care.</span>
                    </p>
                  )}
                </div>
              </AppleStyleCard>

              <ExportShareButtons
                calculatorType="pet-insurance"
                inputs={inputs}
                results={results}
                title="Pet Insurance Coverage Estimate"
              />
            </>
          )}
        </div>
      </div>

      <PetInsuranceArticle />
    </CalculatorLayoutWithAds>
  );
}

function PetInsuranceArticle() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "When is the best time to buy pet insurance?",
      a: "The best time to buy pet insurance is when your pet is young and healthy, ideally as a puppy or kitten. This ensures that you lock in lower premiums and avoid exclusions for pre-existing conditions. Most insurers don't cover conditions that existed before the policy start date, so waiting until your pet gets sick could leave you with significant gaps in coverage."
    },
    {
      q: "What's the difference between accident-only and comprehensive coverage?",
      a: "Accident-only coverage protects against injuries from accidents like broken bones, cuts, or poisoning, but doesn't cover illnesses. Comprehensive coverage includes both accidents and illnesses (like cancer, infections, or chronic conditions) plus preventive care. For most pet owners, accident + illness coverage offers the best balance of protection and cost."
    },
    {
      q: "Are pre-existing conditions covered?",
      a: "No, pet insurance does not cover pre-existing conditions - any illness or injury that occurred before coverage began or during the waiting period. However, some conditions may become eligible if they're cured and don't recur for a certain period (typically 6-12 months). This is why getting coverage early is so important."
    },
    {
      q: "How do deductibles and reimbursement rates work?",
      a: "The deductible is what you pay out-of-pocket before insurance kicks in. You can choose annual or per-incident deductibles. The reimbursement rate (typically 70-90%) is the percentage of covered costs the insurer pays after the deductible. For example, with an 80% reimbursement rate and $1,000 vet bill, you'd pay your deductible plus 20% of the remaining amount."
    },
    {
      q: "Is wellness coverage worth it?",
      a: "Wellness add-ons (also called preventive care riders) cover routine care like vaccinations, annual exams, flea prevention, and teeth cleaning. They typically cost $15-25/month and reimburse up to $250-500 annually. Whether it's worth it depends on your pet's needs - if you're diligent about preventive care, it can pay for itself. Otherwise, you might save more by paying out-of-pocket."
    },
    {
      q: "Why do certain breeds cost more to insure?",
      a: "Breed-specific pricing reflects the statistical likelihood of health problems. Brachycephalic breeds (like Bulldogs, Pugs, Persians) often have respiratory issues. Large breeds (Great Danes, Mastiffs) are prone to joint problems and have shorter lifespans. Mixed breeds typically cost less because they have fewer hereditary conditions. Insurers use veterinary data to price these risks."
    },
    {
      q: "What's typically not covered by pet insurance?",
      a: "Most policies exclude: pre-existing conditions, elective procedures (cosmetic surgeries, tail docking), breeding costs, behavioral issues, preventive care (unless you have a wellness add-on), bilateral conditions if one side was pre-existing, and experimental treatments. Some policies also exclude certain breed-specific conditions. Always read the policy exclusions carefully."
    },
    {
      q: "How do I file a claim and how long does reimbursement take?",
      a: "Most insurers use a reimbursement model: you pay the vet bill upfront, then submit a claim with the invoice and medical records. Claims are typically submitted online or via app. Processing time varies from a few days to 2-3 weeks depending on the complexity. Some insurers now offer direct payment to vets, eliminating the need for you to pay upfront."
    }
  ];

  return (
    <div className="prose prose-lg max-w-none mt-16 dark:prose-invert">
      <div>
        <h2 className="text-3xl font-bold mb-6">
          🐾 Complete Guide to Pet Insurance
        </h2>

        <p className="text-lg leading-relaxed mb-6">
          Your furry friend brings unlimited joy to your life - but unexpected vet bills can bring unlimited stress to your wallet! 💰 
          Whether it's a playful puppy who swallowed something they shouldn't or a senior cat developing chronic kidney disease, 
          veterinary care costs are rising faster than ever. Pet insurance helps you say "yes" to the best care without the financial 
          heartbreak. Let's dive into everything you need to know about protecting your four-legged family member!
        </p>

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
                  <AlertCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
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
      </div>
    </div>
  );
}
