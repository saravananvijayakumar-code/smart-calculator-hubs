#!/bin/bash

# Replace all invalid Lucide React icons with valid alternatives

echo "Fixing Percent → Hash..."
find frontend -name "*.tsx" -type f -exec sed -i 's/<Percent /<Hash /g' {} +

echo "Fixing PiggyBank → Wallet..."
find frontend -name "*.tsx" -type f -exec sed -i 's/<PiggyBank /<Wallet /g' {} +

echo "Fixing Receipt → FileText..."
find frontend -name "*.tsx" -type f -exec sed -i 's/<Receipt /<FileText /g' {} +

echo "Fixing imports in calculator files..."
# Fix imports - add Hash and Wallet where Percent and PiggyBank were imported
find frontend/pages/calculators -name "*.tsx" -type f -exec sed -i 's/Percent,/Hash,/g' {} +
find frontend/pages/calculators -name "*.tsx" -type f -exec sed -i 's/PiggyBank,/Wallet,/g' {} +
find frontend/pages/calculators -name "*.tsx" -type f -exec sed -i 's/Receipt,/FileText,/g' {} +

# Fix hub pages
find frontend/pages/hub -name "*.tsx" -type f -exec sed -i 's/Percent,/Hash,/g' {} +
find frontend/pages/hub -name "*.tsx" -type f -exec sed -i 's/PiggyBank,/Wallet,/g' {} +
find frontend/pages/hub -name "*.tsx" -type f -exec sed -i 's/Receipt,/FileText,/g' {} +

# Fix financial pages
find frontend/pages/calculators/financial -name "*.tsx" -type f -exec sed -i 's/PiggyBank,/Wallet,/g' {} +

echo "Icon fixes complete!"
