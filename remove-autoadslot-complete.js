const fs = require('fs');

const files = [
  'frontend/pages/calculators/viral/LoveCompatibilityCalculator.tsx',
  'frontend/pages/calculators/india/PPFCalculatorIndia.tsx',
  'frontend/pages/smarttimer/SmartTimerHub.tsx',
  'frontend/pages/calculators/india/IncomeTaxCalculatorIndia.tsx',
  'frontend/pages/ToolsHubPage.tsx',
  'frontend/pages/finder/tools/PetBreedFinder.tsx',
  'frontend/pages/finder/tools/HomeDecorStyleFinder.tsx',
  'frontend/pages/tools/IPReputationCheck.tsx',
  'frontend/pages/calculators/insurance/SolarSavingsCalculator.tsx',
  'frontend/pages/calculators/utility/DiscountCalculator.tsx',
  'frontend/pages/smarttimer/CountdownPage.tsx',
  'frontend/pages/calculators/india/GSTCalculatorIndia.tsx',
  'frontend/pages/ai/WellnessPage.tsx',
  'frontend/pages/ai/RelationshipsPage.tsx',
  'frontend/pages/tools/BrowserDeviceInfo.tsx',
  'frontend/pages/calculators/health/BodyFatCalculator.tsx',
  'frontend/pages/calculators/insurance/CarInsurancePremiumEstimator.tsx',
  'frontend/pages/smarttimer/MultiTimerPage.tsx',
  'frontend/pages/ai/ShoppingPage.tsx',
  'frontend/pages/tools/ImageCompressor.tsx',
  'frontend/pages/tools/PlantFinder.tsx',
  'frontend/pages/calculators/viral/CalorieBurnCalculator.tsx',
  'frontend/pages/calculators/utility/DateCalculator.tsx',
  'frontend/pages/smarttimer/PomodoroPage.tsx',
  'frontend/pages/calculators/insurance/LegalSettlementEstimator.tsx',
  'frontend/pages/KnowMyIPPage.tsx',
  'frontend/pages/calculators/health/BMRCalculator.tsx',
  'frontend/pages/calculators/utility/TipCalculator.tsx',
  'frontend/pages/tools/SSLDomainChecker.tsx',
  'frontend/pages/tools/InternetSpeedTest.tsx',
  'frontend/pages/calculators/viral/ZodiacCompatibilityCalculator.tsx',
  'frontend/pages/calculators/viral/LifePathNumberCalculator.tsx',
  'frontend/pages/ai/ParentingPage.tsx',
  'frontend/pages/smarttimer/EventCountdownPage.tsx',
  'frontend/pages/ai/tools/AITextDetector.tsx',
  'frontend/pages/tools/DNSPingTest.tsx',
  'frontend/pages/calculators/health/WaistToHipRatioCalculator.tsx',
  'frontend/pages/calculators/financial/CreditCardPayoffCalculator.tsx',
  'frontend/pages/tools/SmartShortener.tsx',
  'frontend/pages/ai/SocialPage.tsx',
  'frontend/pages/calculators/viral/FriendCompatibilityCalculator.tsx',
  'frontend/pages/smarttimer/StopwatchPage.tsx'
];

files.forEach(file => {
  const filePath = `/${file}`;
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove import statement
    content = content.replace(/import.*AutoAdSlot.*from.*;\n?/g, '');
    content = content.replace(/import.*MultiAutoAdSlots.*from.*;\n?/g, '');
    
    // Remove AutoAdSlot JSX elements - various patterns
    // Single line without children
    content = content.replace(/<AutoAdSlot[^>]*\/>/g, '');
    
    // Multi-line AutoAdSlot
    content = content.replace(/<AutoAdSlot[^>]*>\s*<\/AutoAdSlot>/gs, '');
    
    // Clean up empty lines (more than 2 consecutive)
    content = content.replace(/\n{3,}/g, '\n\n');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✓ Processed: ${file}`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

console.log('\\nDone! All AutoAdSlot imports and elements removed.');
