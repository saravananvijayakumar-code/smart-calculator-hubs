#!/bin/bash

# Add type annotations to event handlers
find frontend/pages -name "*.tsx" -type f -exec sed -i 's/(e) =>/\(e: any\) =>/g' {} +

echo "Type annotations added"
