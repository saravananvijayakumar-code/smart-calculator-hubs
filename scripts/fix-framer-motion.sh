#!/bin/bash

# Remove framer-motion imports and replace motion components with regular divs

files=(
  "/frontend/pages/smarttimer/StopwatchPage.tsx"
  "/frontend/pages/smarttimer/SmartTimerHub.tsx"
  "/frontend/pages/smarttimer/PomodoroPage.tsx"
  "/frontend/pages/smarttimer/CountdownPage.tsx"
  "/frontend/pages/smarttimer/MultiTimerPage.tsx"
  "/frontend/pages/smarttimer/EventCountdownPage.tsx"
  "/frontend/pages/calculators/insurance/BusinessLiabilityCalculator.tsx"
  "/frontend/pages/calculators/insurance/PetInsuranceCalculator.tsx"
  "/frontend/pages/calculators/insurance/TravelInsuranceCalculator.tsx"
  "/frontend/pages/ai/tools/AITextDetector.tsx"
  "/frontend/pages/tools/ImageCompressor.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Remove framer-motion imports
    sed -i "/import.*from 'framer-motion'/d" "$file"
    
    # Replace motion.div with div (remove animation props inline)
    sed -i 's/<motion\.div/<div/g' "$file"
    sed -i 's/<\/motion\.div>/<\/div>/g' "$file"
    
    # Remove AnimatePresence wrapper  
    sed -i 's/<AnimatePresence[^>]*>//g' "$file"
    sed -i 's/<\/AnimatePresence>//g' "$file"
    
    # Remove common animation props (multi-line patterns need special handling)
    sed -i '/initial=.*{.*}/d' "$file"
    sed -i '/animate=.*{.*}/d' "$file"
    sed -i '/exit=.*{.*}/d' "$file"
    sed -i '/transition=.*{.*}/d' "$file"
    sed -i '/whileHover=.*{.*}/d' "$file"
    sed -i '/whileTap=.*{.*}/d' "$file"
    
    echo "✓ Fixed $file"
  fi
done

echo "Done! All files processed."
