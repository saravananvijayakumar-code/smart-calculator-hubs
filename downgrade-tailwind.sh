#!/bin/bash
set -e

echo "🔄 Downgrading to Tailwind CSS v3..."
echo ""

# Navigate to frontend directory
cd /workspace/frontend

# Step 1: Remove Tailwind v4 packages
echo "📦 Removing Tailwind CSS v4 packages..."
bun remove @tailwindcss/vite @tailwindcss/oxide tw-animate-css tailwindcss lightningcss 2>/dev/null || true

# Step 2: Install Tailwind v3 and required PostCSS packages
echo "📥 Installing Tailwind CSS v3 and PostCSS dependencies..."
bun add -D tailwindcss@^3.4.17 postcss@^8.4.49 autoprefixer@^10.4.20 tailwindcss-animate@^1.0.7

echo ""
echo "✅ Package updates complete!"
echo ""

# Step 3: Show installed versions
echo "📋 Installed Tailwind v3 packages:"
if [ -f "node_modules/tailwindcss/package.json" ]; then
  TAILWIND_VERSION=$(cat node_modules/tailwindcss/package.json | grep '"version"' | head -1 | cut -d'"' -f4)
  echo "  ✓ tailwindcss: $TAILWIND_VERSION"
fi
if [ -f "node_modules/postcss/package.json" ]; then
  POSTCSS_VERSION=$(cat node_modules/postcss/package.json | grep '"version"' | head -1 | cut -d'"' -f4)
  echo "  ✓ postcss: $POSTCSS_VERSION"
fi
if [ -f "node_modules/autoprefixer/package.json" ]; then
  AUTOPREFIXER_VERSION=$(cat node_modules/autoprefixer/package.json | grep '"version"' | head -1 | cut -d'"' -f4)
  echo "  ✓ autoprefixer: $AUTOPREFIXER_VERSION"
fi
if [ -f "node_modules/tailwindcss-animate/package.json" ]; then
  ANIMATE_VERSION=$(cat node_modules/tailwindcss-animate/package.json | grep '"version"' | head -1 | cut -d'"' -f4)
  echo "  ✓ tailwindcss-animate: $ANIMATE_VERSION"
fi

echo ""
echo "🎉 Tailwind CSS v3 installed successfully!"
echo ""
echo "Next: Configuration files will be updated automatically by the system."
