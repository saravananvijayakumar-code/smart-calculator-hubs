#!/bin/bash
set -e

echo "🔧 Fixing Tailwind Vite Build Issue..."
echo ""

# Step 1: Clean any existing node_modules and lockfiles
echo "📦 Cleaning old dependencies..."
rm -rf /workspace/frontend/node_modules
rm -rf /workspace/frontend/bun.lockb
rm -rf /workspace/node_modules/.vite-temp

# Step 2: Install frontend dependencies with all devDependencies
echo "📥 Installing frontend dependencies (including devDependencies)..."
cd /workspace/frontend
bun install --no-save --production=false

# Step 3: Verify @tailwindcss/vite is installed
echo "✅ Verifying @tailwindcss/vite installation..."
if [ -d "node_modules/@tailwindcss/vite" ]; then
  echo "✓ @tailwindcss/vite found in node_modules"
else
  echo "⚠️  @tailwindcss/vite NOT found - attempting manual install..."
  bun add -D @tailwindcss/vite@^4.1.11
fi

# Step 4: Verify tailwindcss is installed  
if [ -d "node_modules/tailwindcss" ]; then
  echo "✓ tailwindcss found in node_modules"
else
  echo "⚠️  tailwindcss NOT found - attempting manual install..."
  bun add tailwindcss@^4.1.11
fi

echo ""
echo "✅ Dependencies installed successfully!"
echo ""
echo "📋 Installed versions:"
cd /workspace/frontend
if [ -f "node_modules/@tailwindcss/vite/package.json" ]; then
  TAILWIND_VITE_VERSION=$(cat node_modules/@tailwindcss/vite/package.json | grep '"version"' | cut -d'"' -f4)
  echo "  @tailwindcss/vite: $TAILWIND_VITE_VERSION"
fi
if [ -f "node_modules/tailwindcss/package.json" ]; then
  TAILWIND_VERSION=$(cat node_modules/tailwindcss/package.json | grep '"version"' | cut -d'"' -f4)
  echo "  tailwindcss: $TAILWIND_VERSION"
fi

echo ""
echo "🎉 Build fix complete! You can now run the build."
echo ""
echo "Next steps:"
echo "  1. The build should now work automatically"
echo "  2. If issues persist, see /TAILWIND_VITE_PERMANENT_FIX.md"
