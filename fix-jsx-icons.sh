#!/bin/bash

# Replace all PiggyBank JSX with Wallet JSX
echo "Replacing PiggyBank with Wallet in JSX..."
find frontend -type f -name "*.tsx" -exec sed -i 's/<PiggyBank /<Wallet /g' {} +

# Replace all Percent JSX with Hash JSX  
echo "Replacing Percent with Hash in JSX..."
find frontend -type f -name "*.tsx" -exec sed -i 's/<Percent /<Hash /g' {} +

# Replace all Receipt JSX with FileText JSX
echo "Replacing Receipt with FileText in JSX..."
find frontend -type f -name "*.tsx" -exec sed -i 's/<Receipt /<FileText /g' {} +

echo "All JSX icon replacements complete!"
