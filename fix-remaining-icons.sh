#!/bin/bash

# Replace all Moon with Clock in all files
find frontend/pages/calculators/health -name "*.tsx" -type f -exec sed -i 's/<Moon /<Clock /g' {} \;

# Replace all Sun with Sparkles in all files
find frontend/pages/calculators/health -name "*.tsx" -type f -exec sed -i 's/<Sun /<Sparkles /g' {} \;

# Replace all Ruler with Activity in all files
find frontend/pages/calculators/health -name "*.tsx" -type f -exec sed -i 's/<Ruler /<Activity /g' {} \;

# Replace all remaining Scale with Activity in all files
find frontend/pages/calculators/health -name "*.tsx" -type f -exec sed -i 's/<Scale /<Activity /g' {} \;

# Replace all Apple with Heart in all files
find frontend/pages/calculators/health -name "*.tsx" -type f -exec sed -i 's/<Apple /<Heart /g' {} \;

# Replace all Trophy with Target in all files
find frontend/pages/calculators/health -name "*.tsx" -type f -exec sed -i 's/<Trophy /<Target /g' {} \;

# Replace all Dumbbell with Activity in all files
find frontend/pages/calculators/health -name "*.tsx" -type f -exec sed -i 's/<Dumbbell /<Activity /g' {} \;

echo "Fixed all remaining icon usages"
