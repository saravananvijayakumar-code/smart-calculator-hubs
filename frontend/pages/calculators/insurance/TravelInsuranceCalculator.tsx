import React, { useState, useCallback } from 'react';
import { Plane, Calculator, Shield, DollarSign, TrendingUp, MapPin, Info, BookOpen, AlertCircle, Globe } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AppleStyleCard } from '../../../components/AppleStyleCard';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { SEOHead } from '../../../components/SEOHead';
import ExportShareButtons from '../../../components/ExportShareButtons';

interface TravelInsuranceInputs {
  tripCost: number;
  tripDuration: number;
  destination: string;
  travelerAge: number;
  numTravelers: number;
  tripType: string;
  departureDate: string;
  preExistingConditions: boolean;
  adventureActivities: boolean;
  rentalCar: boolean;
  cancelForAnyReason: boolean;
  medicalCoverage: number;
  evacuationCoverage: number;
  baggageDelay: boolean;
  tripDelay: boolean;
}

interface TravelInsuranceResults {
  totalPremium: number;
  costPerTraveler: number;
  coverageBreakdown: {
    tripCancellation: number;
    medical: number;
    evacuation: number;
    baggageDelay: number;
    tripDelay: number;
    adventureAddon: number;
  };
  recommendedCoverage: {
    tripCancellation: number;
    medicalExpense: number;
    evacuation: number;
    baggage: number;
  };
}

const TravelInsuranceCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<TravelInsuranceInputs>({
    tripCost: 5000,
    tripDuration: 10,
    destination: 'Europe',
    travelerAge: 35,
    numTravelers: 2,
    tripType: 'leisure',
    departureDate: '',
    preExistingConditions: false,
    adventureActivities: false,
    rentalCar: true,
    cancelForAnyReason: false,
    medicalCoverage: 50000,
    evacuationCoverage: 100000,
    baggageDelay: true,
    tripDelay: true,
  });

  const [results, setResults] = useState<TravelInsuranceResults | null>(null);

  const handleInputChange = (field: keyof TravelInsuranceInputs, value: string | boolean) => {
    setInputs(prev => ({
      ...prev,
      [field]: typeof value === 'boolean' ? value : 
               (field === 'destination' || field === 'tripType' || field === 'departureDate') ? value : 
               parseFloat(value as string) || 0
    }));
  };

  const calculateTravelInsurance = useCallback(() => {
    const {
      tripCost, tripDuration, destination, travelerAge, numTravelers,
      tripType, preExistingConditions, adventureActivities, rentalCar,
      cancelForAnyReason, medicalCoverage, evacuationCoverage,
      baggageDelay, tripDelay
    } = inputs;

    let basePremium = tripCost * 0.055;

    const destMultipliers: { [key: string]: number } = {
      'Europe': 1.1,
      'Asia': 1.3,
      'Africa': 1.5,
      'South America': 1.2,
      'Caribbean': 1.0,
      'North America': 0.9,
      'Australia': 1.2,
      'Middle East': 1.6
    };
    basePremium *= (destMultipliers[destination] || 1.0);

    if (tripDuration > 30) basePremium *= 1.4;
    else if (tripDuration > 14) basePremium *= 1.2;
    else if (tripDuration < 7) basePremium *= 0.9;

    let ageMultiplier = 1.0;
    if (travelerAge < 25) ageMultiplier = 1.1;
    else if (travelerAge >= 60) ageMultiplier = 1.5;
    else if (travelerAge >= 70) ageMultiplier = 2.0;
    else if (travelerAge >= 80) ageMultiplier = 3.0;
    basePremium *= ageMultiplier;

    if (preExistingConditions) basePremium *= 1.4;
    if (adventureActivities) basePremium *= 1.6;
    if (cancelForAnyReason) basePremium *= 1.5;
    if (tripType === 'business') basePremium *= 1.2;
    else if (tripType === 'cruise') basePremium *= 1.3;

    const tripCancellationPremium = basePremium * 0.4;
    const medicalPremium = (medicalCoverage / 10000) * 35;
    const evacuationPremium = (evacuationCoverage / 10000) * 25;
    const baggageDelayPremium = baggageDelay ? 15 : 0;
    const tripDelayPremium = tripDelay ? 20 : 0;
    const adventureAddonPremium = adventureActivities ? basePremium * 0.3 : 0;

    const totalPremium = (tripCancellationPremium + medicalPremium + evacuationPremium + 
                         baggageDelayPremium + tripDelayPremium + adventureAddonPremium) * numTravelers;

    setResults({
      totalPremium,
      costPerTraveler: totalPremium / numTravelers,
      coverageBreakdown: {
        tripCancellation: tripCancellationPremium * numTravelers,
        medical: medicalPremium * numTravelers,
        evacuation: evacuationPremium * numTravelers,
        baggageDelay: baggageDelayPremium * numTravelers,
        tripDelay: tripDelayPremium * numTravelers,
        adventureAddon: adventureAddonPremium * numTravelers,
      },
      recommendedCoverage: {
        tripCancellation: tripCost * 1.1,
        medicalExpense: destination === 'Europe' || destination === 'Asia' ? 100000 : 50000,
        evacuation: 150000,
        baggage: 3000,
      }
    });
  }, [inputs]);

  React.useEffect(() => {
    calculateTravelInsurance();
  }, [calculateTravelInsurance]);

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
      title="Travel Insurance Coverage Estimator"
      description="Calculate travel insurance costs based on trip value, destination, duration, and traveler age. Get comprehensive coverage estimates for international and domestic trips."
      keywords="travel insurance calculator, trip insurance cost, travel coverage, international insurance, vacation insurance"
    >
      <div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <AppleStyleCard>
              <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <div className="flex items-center mb-6">
                  <Plane className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">✈️ Trip Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Total Trip Cost"
                    type="number"
                    value={inputs.tripCost.toString()}
                    onChange={(e) => handleInputChange('tripCost', e.target.value)}
                    placeholder="5000"
                  />
                  <AppleStyleInput
                    label="Trip Duration (days)"
                    type="number"
                    value={inputs.tripDuration.toString()}
                    onChange={(e) => handleInputChange('tripDuration', e.target.value)}
                    min="1"
                    max="365"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Destination</label>
                    <select
                      value={inputs.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Africa">Africa</option>
                      <option value="South America">South America</option>
                      <option value="Caribbean">Caribbean</option>
                      <option value="Australia">Australia/Oceania</option>
                      <option value="Middle East">Middle East</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Trip Type</label>
                    <select
                      value={inputs.tripType}
                      onChange={(e) => handleInputChange('tripType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="leisure">Leisure/Vacation</option>
                      <option value="business">Business Travel</option>
                      <option value="cruise">Cruise</option>
                      <option value="adventure">Adventure/Extreme Sports</option>
                    </select>
                  </div>
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard>
              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center mb-6">
                  <Globe className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">👥 Traveler Information</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Primary Traveler Age"
                    type="number"
                    value={inputs.travelerAge.toString()}
                    onChange={(e) => handleInputChange('travelerAge', e.target.value)}
                    min="1"
                    max="100"
                  />
                  <AppleStyleInput
                    label="Number of Travelers"
                    type="number"
                    value={inputs.numTravelers.toString()}
                    onChange={(e) => handleInputChange('numTravelers', e.target.value)}
                    min="1"
                    max="10"
                  />
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="preExisting"
                        checked={inputs.preExistingConditions}
                        onChange={(e) => handleInputChange('preExistingConditions', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="preExisting" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Pre-existing Medical Conditions</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="adventure"
                        checked={inputs.adventureActivities}
                        onChange={(e) => handleInputChange('adventureActivities', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="adventure" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Adventure/Extreme Activities</label>
                    </div>
                  </div>
                </div>
              </div>
            </AppleStyleCard>

            <AppleStyleCard>
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <div className="flex items-center mb-6">
                  <Shield className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">🛡️ Coverage Options</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <AppleStyleInput
                    label="Medical Coverage Limit"
                    type="number"
                    value={inputs.medicalCoverage.toString()}
                    onChange={(e) => handleInputChange('medicalCoverage', e.target.value)}
                    placeholder="50000"
                  />
                  <AppleStyleInput
                    label="Emergency Evacuation Limit"
                    type="number"
                    value={inputs.evacuationCoverage.toString()}
                    onChange={(e) => handleInputChange('evacuationCoverage', e.target.value)}
                    placeholder="100000"
                  />
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="cfar"
                        checked={inputs.cancelForAnyReason}
                        onChange={(e) => handleInputChange('cancelForAnyReason', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="cfar" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Cancel For Any Reason (CFAR)</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="baggageDelay"
                        checked={inputs.baggageDelay}
                        onChange={(e) => handleInputChange('baggageDelay', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="baggageDelay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Baggage Delay Coverage</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="tripDelay"
                        checked={inputs.tripDelay}
                        onChange={(e) => handleInputChange('tripDelay', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="tripDelay" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Trip Delay Coverage</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rentalCar"
                        checked={inputs.rentalCar}
                        onChange={(e) => handleInputChange('rentalCar', e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="rentalCar" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Rental Car Damage</label>
                    </div>
                  </div>
                </div>
              </div>
            </AppleStyleCard>
          </div>

          <div className="space-y-6">
            {results && (
              <div className="space-y-6">
                <AppleStyleCard>
                  <div className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <div className="flex items-center mb-4">
                      <Calculator className="w-6 h-6 mr-3" />
                      <h3 className="text-xl font-semibold">Premium Estimate</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur rounded-lg">
                        <span className="text-sm font-medium">Total Premium</span>
                        <span className="text-2xl font-bold">
                          {formatCurrency(results.totalPremium)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/10 backdrop-blur rounded-lg">
                        <span className="text-sm font-medium">Per Traveler</span>
                        <span className="text-lg font-bold">
                          {formatCurrency(results.costPerTraveler)}
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
                      {Object.entries(results.coverageBreakdown).map(([key, value]) => (
                        value > 0 && (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {formatCurrency(value)}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </AppleStyleCard>

                <AppleStyleCard>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Info className="w-6 h-6 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recommended Limits</h3>
                    </div>
                    <div className="space-y-3">
                      {Object.entries(results.recommendedCoverage).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">
                            {formatCurrency(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AppleStyleCard>
              </div>
            )}
          </div>
        </div>

        {results && (
          <div className="mt-8">
            <ExportShareButtons
              calculatorType="travel-insurance"
              inputs={inputs}
              results={results}
              title="Travel Insurance Coverage Estimate"
            />
          </div>
        )}

        <div className="mt-12 prose prose-lg max-w-none dark:prose-invert">
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-3xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ✈️ Travel Insurance Ultimate Guide: Protect Your Adventure!
            </h2>
            
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              Planning a trip? Don't let unexpected events ruin your vacation! 🌍 Travel insurance provides peace of mind whether you're exploring Europe, 
              relaxing on a Caribbean beach, or trekking through Asia. Let's dive into everything you need to know!
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg">
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">🎯 What Does Travel Insurance Cover?</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">✅ Typically Covered</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><strong>Trip Cancellation:</strong> Get refund if you can't travel</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><strong>Medical Emergencies:</strong> Hospital & doctor visits abroad</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><strong>Emergency Evacuation:</strong> Medical flight home ($50K+!)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><strong>Lost/Delayed Baggage:</strong> Compensation for belongings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span><strong>Trip Delays:</strong> Hotel & meal reimbursement</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-3">❌ Usually NOT Covered</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span><strong>Pre-existing conditions</strong> (unless waiver purchased)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span><strong>Risky activities</strong> (skydiving, scuba without cert)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span><strong>Travel to high-risk</strong> countries with warnings</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span><strong>Change of mind</strong> (need CFAR upgrade!)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">✗</span>
                      <span><strong>Non-refundable costs</strong> you already knew about</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-4">🎫 Types of Travel Insurance Plans</h3>
              
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">🏖️ Single Trip Insurance</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Covers one specific trip from departure to return. Best for occasional travelers! Cost: 4-10% of trip cost.
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs font-semibold">✓ Best for: Once-a-year vacations, honeymoons, expensive cruises</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">🌍 Annual/Multi-Trip Insurance</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Covers unlimited trips within one year (usually max 30-90 days each). Cost: $200-$500/year.
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs font-semibold">✓ Best for: Frequent travelers, business trips, digital nomads</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">⚕️ Medical-Only Travel Insurance</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Focuses on emergency medical care abroad. No cancellation coverage. Cost: $50-$200 for 2-week trip.
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs font-semibold">✓ Best for: Budget travelers, short trips, travelers with non-refundable flights</p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">🚢 Specialty Insurance (Cruise, Adventure, etc.)</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                    Tailored coverage for specific travel types. Includes extreme sports, ski trips, or cruise-specific benefits.
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs font-semibold">✓ Best for: Ski vacations, adventure tours, cruise passengers</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
              <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">💡 When Should You Buy Travel Insurance?</h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-lg text-green-700 dark:text-green-400 mb-3">✅ Definitely Buy If...</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• Your trip costs $3,000+ (big financial loss risk!)</li>
                    <li>• Traveling to remote or developing countries</li>
                    <li>• You have pre-existing health conditions</li>
                    <li>• Traveling during hurricane/typhoon season</li>
                    <li>• Elderly travelers or those with mobility issues</li>
                    <li>• Multi-leg international trip with connections</li>
                    <li>• Renting expensive vacation property</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-lg text-yellow-700 dark:text-yellow-400 mb-3">🤔 Consider Skipping If...</h4>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                    <li>• Road trip within your home country</li>
                    <li>• Trip costs under $500 total</li>
                    <li>• You have excellent existing coverage (check first!)</li>
                    <li>• Flexible/refundable bookings already</li>
                    <li>• Weekend getaway with no flights</li>
                    <li>• Visiting family domestically</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 mb-8">
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">🎯 Pro Tips to Maximize Value</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-3xl mb-2">⏰</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Buy Within 14 Days of Deposit</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Many policies waive pre-existing condition exclusions if you buy within 10-21 days of your first trip payment!
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🔍</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Read the Fine Print</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Check coverage limits, deductibles, and exclusions. Not all plans are equal! Compare 3-5 quotes.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-3xl mb-2">💳</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Check Credit Card Benefits</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Premium credit cards may include travel insurance! But coverage is often limited. Verify what's included.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-3xl mb-2">📸</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Document Everything</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep receipts, take photos, get police reports for theft. Claims need proof!
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🌡️</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Get Medical Coverage = Replacement Cost</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Emergency medical care abroad can cost $50K+! Get $100K minimum for international trips.
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                  <div className="text-3xl mb-2">🚨</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">Emergency Assistance Numbers</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Save 24/7 emergency contact info BEFORE you leave. Add to phone contacts + print paper copy!
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
              <h3 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">❓ Frequently Asked Questions</h3>
              
              <div className="space-y-4">
                <details className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl cursor-pointer">
                  <summary className="font-bold text-gray-900 dark:text-white">Do I need travel insurance for a cruise?</summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    YES! Cruise insurance is highly recommended. It covers medical emergencies at sea (ship medical care is expensive!), trip interruption 
                    if you miss embarkation, and evacuation. Regular travel insurance often excludes some cruise scenarios, so get cruise-specific coverage.
                  </p>
                </details>

                <details className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl cursor-pointer">
                  <summary className="font-bold text-gray-900 dark:text-white">What's "Cancel For Any Reason" (CFAR) coverage?</summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    CFAR lets you cancel your trip for ANY reason and get 50-75% refund of non-refundable costs. Must buy within 10-21 days of initial 
                    deposit. Adds 40-60% to premium cost. Worth it for expensive trips or uncertain plans!
                  </p>
                </details>

                <details className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl cursor-pointer">
                  <summary className="font-bold text-gray-900 dark:text-white">Does my health insurance work abroad?</summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    Usually NO! Medicare doesn't cover foreign care. Many U.S. health plans offer limited/no international coverage. Even if covered, 
                    you'll pay upfront and file claims later. Travel medical insurance pays directly and includes evacuation (which health insurance doesn't).
                  </p>
                </details>

                <details className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl cursor-pointer">
                  <summary className="font-bold text-gray-900 dark:text-white">How much does travel insurance typically cost?</summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    4-10% of total trip cost. $5,000 trip = $200-$500 insurance. Factors: destination, age, trip length, coverage level. 
                    Seniors (70+) pay 2-3x more. Cheaper for short trips, domestic travel, or medical-only plans.
                  </p>
                </details>

                <details className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-4 rounded-xl cursor-pointer">
                  <summary className="font-bold text-gray-900 dark:text-white">Will travel insurance cover pandemic-related cancellations?</summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    It depends! Post-COVID, many policies exclude pandemics or known events. Some cover COVID diagnosis preventing travel. 
                    Cancel For Any Reason (CFAR) provides the most protection. Always read the policy's pandemic/epidemic exclusions carefully!
                  </p>
                </details>

                <details className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-4 rounded-xl cursor-pointer">
                  <summary className="font-bold text-gray-900 dark:text-white">Can I buy travel insurance after booking my trip?</summary>
                  <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                    Yes, but buy ASAP! Certain benefits (like pre-existing condition waivers) require purchase within 10-21 days of initial deposit. 
                    You can buy up until departure day, but early purchase gives better protection and more coverage options.
                  </p>
                </details>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/30 dark:to-yellow-900/30 rounded-2xl p-8 border-4 border-orange-300 dark:border-orange-700">
              <div className="flex items-start">
                <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-xl font-bold text-orange-900 dark:text-orange-200 mb-3">⚠️ Important Disclaimer</h4>
                  <p className="text-orange-800 dark:text-orange-300 leading-relaxed">
                    This calculator provides <strong>estimates only</strong> for educational purposes. Actual travel insurance costs vary by provider, 
                    exact destination, traveler health status, specific coverage options, and policy terms. Prices shown are approximations based on 
                    industry averages.
                  </p>
                  <p className="text-orange-800 dark:text-orange-300 mt-3 leading-relaxed">
                    Always compare multiple quotes from licensed insurers. Read policy documents carefully. This tool does NOT constitute insurance 
                    advice. Consult with licensed travel insurance agents for personalized recommendations. Safe travels! ✈️🌍
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default TravelInsuranceCalculator;
