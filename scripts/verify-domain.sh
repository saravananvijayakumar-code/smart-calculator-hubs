#!/bin/bash

# Domain verification script for smartcalculatorhubs.com

echo "🔍 Verifying domain configuration for smartcalculatorhubs.com"

# Check SSL certificates
echo "📋 Checking SSL certificates..."
echo "✅ www.smartcalculatorhubs.com:"
curl -I -s --connect-timeout 10 https://www.smartcalculatorhubs.com | head -1

echo "✅ smartcalculatorhubs.com:"
curl -I -s --connect-timeout 10 https://smartcalculatorhubs.com | head -1

# Check redirects
echo "📋 Checking redirects..."
echo "🔄 Non-www to www redirect:"
REDIRECT=$(curl -I -s --connect-timeout 10 https://smartcalculatorhubs.com | grep -i location)
if [[ $REDIRECT == *"www.smartcalculatorhubs.com"* ]]; then
    echo "✅ Redirect working: $REDIRECT"
else
    echo "❌ Redirect not working: $REDIRECT"
fi

# Check cache headers
echo "📋 Checking cache headers..."
echo "🏠 Homepage cache headers:"
curl -I -s --connect-timeout 10 https://www.smartcalculatorhubs.com | grep -i cache-control

echo "🎨 Static asset cache headers (CSS/JS):"
curl -I -s --connect-timeout 10 "https://www.smartcalculatorhubs.com/assets/css/" | grep -i cache-control

# Check DNS resolution
echo "📋 Checking DNS resolution..."
echo "🌐 www.smartcalculatorhubs.com:"
dig +short www.smartcalculatorhubs.com

echo "🌐 smartcalculatorhubs.com:"
dig +short smartcalculatorhubs.com

# Test cache busting
echo "📋 Testing cache busting..."
TIMESTAMP=$(date +%s)
echo "🔄 Testing with cache buster: /?v=$TIMESTAMP"
curl -I -s --connect-timeout 10 "https://www.smartcalculatorhubs.com/?v=$TIMESTAMP" | head -1

echo "✅ Domain verification complete!"