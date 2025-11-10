#!/bin/bash

# Replace placement="top-banner" with position="top"
find frontend -name "*.tsx" -type f -exec sed -i 's/placement="top-banner"/position="top"/g' {} +

# Replace placement="mid-content" with position="middle"
find frontend -name "*.tsx" -type f -exec sed -i 's/placement="mid-content"/position="middle"/g' {} +

# Replace placement="in-feed" with position="middle"
find frontend -name "*.tsx" -type f -exec sed -i 's/placement="in-feed"/position="middle"/g' {} +

# Replace placement="in-article" with position="middle"
find frontend -name "*.tsx" -type f -exec sed -i 's/placement="in-article"/position="middle"/g' {} +

# Replace placement="content" with position="middle"
find frontend -name "*.tsx" -type f -exec sed -i 's/placement="content"/position="middle"/g' {} +

echo "All placement props replaced with position props"
