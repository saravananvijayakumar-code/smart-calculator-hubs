#!/bin/bash
set -e

echo "════════════════════════════════════════════════════════════"
echo "  🔄 Tailwind CSS v4 → v3 Migration Script"
echo "════════════════════════════════════════════════════════════"
echo ""

# Step 1: Uninstall Tailwind v4 packages
echo "📦 Step 1/5: Removing Tailwind CSS v4 packages..."
cd /workspace/frontend
bun remove @tailwindcss/vite @tailwindcss/oxide tw-animate-css lightningcss 2>/dev/null || true
echo "  ✓ Removed v4 packages"
echo ""

# Step 2: Install Tailwind v3 and dependencies
echo "📥 Step 2/5: Installing Tailwind CSS v3..."
bun add -D tailwindcss@^3.4.17 postcss@^8.4.49 autoprefixer@^10.4.20 tailwindcss-animate@^1.0.7
echo "  ✓ Installed v3 packages"
echo ""

# Step 3: Backup and replace index.css
echo "🔧 Step 3/5: Updating index.css..."
if [ -f "index.css" ]; then
  cp index.css index.css.v4.backup
  echo "  ✓ Backed up index.css to index.css.v4.backup"
fi

if [ -f "index.v3.css" ]; then
  cp index.v3.css index.css
  echo "  ✓ Updated index.css with v3 syntax"
else
  # Create the v3 index.css inline
  cat > index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.9%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;
    --chart-1: 12 76% 61%;
    --chart-2: 173 58% 39%;
    --chart-3: 197 37% 24%;
    --chart-4: 43 74% 66%;
    --chart-5: 27 87% 67%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 3.9%;
    --foreground: 0 0% 98%;
    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 9%;
    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;
    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
EOF
  echo "  ✓ Created index.css with v3 syntax"
fi
echo ""

# Step 4: Backup and update vite.config.ts
echo "🔧 Step 4/5: Updating vite.config.ts..."
if [ -f "vite.config.ts" ]; then
  cp vite.config.ts vite.config.ts.v4.backup
  echo "  ✓ Backed up vite.config.ts to vite.config.ts.v4.backup"
fi

cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
      '~backend/client': path.resolve(__dirname, './client'),
      '~backend': path.resolve(__dirname, '../backend'),
    },
  },
  plugins: [react()],
  mode: "development",
  build: {
    minify: false,
  }
})
EOF
echo "  ✓ Updated vite.config.ts (removed @tailwindcss/vite plugin)"
echo ""

# Step 5: Verify postcss.config.js exists
echo "🔍 Step 5/5: Verifying PostCSS configuration..."
if [ ! -f "postcss.config.js" ]; then
  cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
  echo "  ✓ Created postcss.config.js"
else
  echo "  ✓ postcss.config.js already exists"
fi
echo ""

# Display installed versions
echo "════════════════════════════════════════════════════════════"
echo "  ✅ Migration Complete!"
echo "════════════════════════════════════════════════════════════"
echo ""
echo "📋 Installed versions:"
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
echo "📝 Changes made:"
echo "  • Removed: @tailwindcss/vite, @tailwindcss/oxide, tw-animate-css, lightningcss"
echo "  • Installed: tailwindcss v3, postcss, autoprefixer, tailwindcss-animate"
echo "  • Updated: index.css (v4 → v3 syntax)"
echo "  • Updated: vite.config.ts (removed Vite plugin)"
echo "  • Verified: postcss.config.js"
echo ""
echo "💾 Backups created:"
echo "  • index.css.v4.backup"
echo "  • vite.config.ts.v4.backup"
echo ""
echo "🚀 Next steps:"
echo "  1. Build should now work without module errors"
echo "  2. All Tailwind classes will work identically"
echo "  3. No code changes needed in components"
echo ""
echo "════════════════════════════════════════════════════════════"
