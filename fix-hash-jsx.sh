#!/bin/bash

# Replace all <Hash with <Calculator in JSX
find frontend -name "*.tsx" -type f -exec sed -i 's/<Hash /<Calculator /g' {} +

echo "Replaced all Hash JSX with Calculator"
