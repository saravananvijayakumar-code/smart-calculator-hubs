#!/bin/bash

# Script to remove all AutoAdSlot and MultiAutoAdSlots imports and usages

FILES=(
"frontend/pages/calculators/viral/LoveCompatibilityCalculator.tsx"
"frontend/pages/smarttimer/SmartTimerHub.tsx"
"frontend/pages/calculators/india/PPFCalculatorIndia.tsx"
"frontend/pages/calculators/india/IncomeTaxCalculatorIndia.tsx"
"frontend/pages/ToolsHubPage.tsx"
"frontend/pages/finder/tools/HomeDecorStyleFinder.tsx"
"frontend/pages/finder/tools/PetBreedFinder.tsx"
"frontend/pages/hub/UKToolsPage.tsx"
"frontend/pages/tools/IPReputationCheck.tsx"
"frontend/pages/hub/USToolsPage.tsx"
"frontend/pages/calculators/insurance/SolarSavingsCalculator.tsx"
"frontend/pages/calculators/utility/DiscountCalculator.tsx"
"frontend/pages/smarttimer/CountdownPage.tsx"
"frontend/pages/calculators/india/GSTCalculatorIndia.tsx"
"frontend/pages/ai/WellnessPage.tsx"
"frontend/pages/ai/RelationshipsPage.tsx"
"frontend/pages/tools/BrowserDeviceInfo.tsx"
"frontend/pages/calculators/health/BodyFatCalculator.tsx"
"frontend/pages/calculators/insurance/CarInsurancePremiumEstimator.tsx"
"frontend/pages/hub/IndiaToolsPage.tsx"
"frontend/pages/smarttimer/MultiTimerPage.tsx"
"frontend/pages/tools/ImageCompressor.tsx"
"frontend/pages/ai/ShoppingPage.tsx"
"frontend/pages/calculators/utility/DateCalculator.tsx"
"frontend/pages/calculators/viral/CalorieBurnCalculator.tsx"
"frontend/pages/smarttimer/PomodoroPage.tsx"
"frontend/pages/tools/PlantFinder.tsx"
"frontend/pages/calculators/insurance/LegalSettlementEstimator.tsx"
"frontend/pages/KnowMyIPPage.tsx"
"frontend/pages/hub/AustraliaToolsPage.tsx"
"frontend/pages/calculators/health/BMRCalculator.tsx"
"frontend/pages/calculators/utility/TipCalculator.tsx"
"frontend/pages/tools/SSLDomainChecker.tsx"
"frontend/pages/tools/InternetSpeedTest.tsx"
"frontend/pages/calculators/viral/ZodiacCompatibilityCalculator.tsx"
"frontend/pages/calculators/viral/LifePathNumberCalculator.tsx"
"frontend/pages/smarttimer/EventCountdownPage.tsx"
"frontend/pages/ai/tools/AITextDetector.tsx"
"frontend/pages/ai/ParentingPage.tsx"
"frontend/pages/calculators/health/WaistToHipRatioCalculator.tsx"
"frontend/pages/tools/DNSPingTest.tsx"
"frontend/pages/calculators/financial/CreditCardPayoffCalculator.tsx"
"frontend/pages/tools/SmartShortener.tsx"
"frontend/pages/ai/SocialPage.tsx"
"frontend/pages/calculators/viral/FriendCompatibilityCalculator.tsx"
"frontend/pages/smarttimer/StopwatchPage.tsx"
)

echo "Removing AutoAdSlot and MultiAutoAdSlots imports from ${#FILES[@]} files..."

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # Remove import lines
    sed -i '/import.*AutoAdSlot/d' "$file"
    sed -i '/import.*MultiAutoAdSlots/d' "$file"
  fi
done

echo "Done! Import statements removed."
echo "Note: You may need to manually remove <AutoAdSlot /> and <MultiAutoAdSlots /> JSX elements from the files."
