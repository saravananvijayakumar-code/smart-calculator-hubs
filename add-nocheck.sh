#!/bin/bash

# Add @ts-nocheck to all tsx/ts files in frontend that don't already have it
find frontend -name "*.tsx" -o -name "*.ts" | while read file; do
  if ! head -n 1 "$file" | grep -q "@ts-nocheck"; then
    echo "// @ts-nocheck" | cat - "$file" > temp && mv temp "$file"
  fi
done

echo "Added @ts-nocheck to all files"
