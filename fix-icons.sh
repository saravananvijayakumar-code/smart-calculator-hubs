#!/bin/bash

# Fix all invalid lucide-react icon references across the codebase

# Replace Percent with Hash
find frontend -name "*.tsx" -type f -exec sed -i 's/<Percent /<Hash /g' {} +

# Replace PiggyBank with Wallet
find frontend -name "*.tsx" -type f -exec sed -i 's/<PiggyBank /<Wallet /g' {} +

# Replace Receipt with FileText  
find frontend -name "*.tsx" -type f -exec sed -i 's/<Receipt /<FileText /g' {} +

# Add imports where needed
find frontend/pages/calculators -name "*.tsx" -type f -exec sed -i "s/'lucide-react';/, Hash, Wallet } from 'lucide-react';/g" {} +

echo "Icons fixed"
