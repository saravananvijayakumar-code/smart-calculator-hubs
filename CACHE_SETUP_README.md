# CDN Cache Configuration for Smart Calculator Hubs

This document outlines the caching setup for www.smartcalculatorhubs.com to ensure proper cache invalidation and performance.

## ✅ Implemented Solutions

### 1. Automatic CDN Cache Invalidation
- **GitHub Actions Workflow**: `.github/workflows/deploy.yml`
- **Trigger**: Automatically runs after each production deployment
- **Scope**: Invalidates entire CDN cache (`/*`)
- **Provider**: Configured for Cloudflare (requires secrets setup)

### 2. Cache-Control Headers
Implemented differentiated caching strategy:

| File Type | Cache Duration | Headers |
|-----------|---------------|---------|
| HTML files | No cache | `no-cache, no-store, must-revalidate` |
| Hashed assets (JS/CSS) | 1 year | `public, max-age=31536000, immutable` |
| Non-hashed assets | 1 day | `public, max-age=86400` |
| Images | 1 week | `public, max-age=604800` |
| API responses | No cache | `no-cache` |

### 3. File Hashing for Cache Busting
- **Vite Configuration**: `vite.config.ts`
- **Pattern**: `[name]-[hash].[ext]` for all assets
- **Location**: All built files include content-based hashes
- **Benefit**: Automatic cache invalidation when content changes

### 4. Domain Configuration
- **Primary Domain**: www.smartcalculatorhubs.com
- **Redirect**: smartcalculatorhubs.com → www.smartcalculatorhubs.com (301)
- **SSL**: Force HTTPS enabled
- **CORS**: Configured for both www and non-www domains

## 🔧 Configuration Files

### Core Files
- `vite.config.ts` - Build configuration with hashing
- `encore.app` - Encore.ts app configuration
- `cache-config.json` - Comprehensive cache rules
- `backend/web/static.ts` - Static file serving with headers

### Deployment
- `.github/workflows/deploy.yml` - Automated deployment + cache invalidation
- `scripts/verify-domain.sh` - Domain verification script

## 🚀 Quick Commands

```bash
# Verify domain configuration
npm run verify-domain

# Check current cache headers
npm run check-cache

# Build for production
npm run build:prod

# Test locally
npm run preview
```

## 🔍 Verification Steps

### 1. Check File Hashing
```bash
# Build the project
npm run build:prod

# Verify hashed filenames exist
ls dist/assets/
# Should see files like: main-abc123.js, style-def456.css
```

### 2. Test Cache Headers
```bash
# HTML (should be no-cache)
curl -I https://www.smartcalculatorhubs.com/

# Static assets (should be long cache)
curl -I https://www.smartcalculatorhubs.com/assets/js/main-[hash].js
```

### 3. Verify CDN Invalidation
```bash
# Deploy to production
git push origin main

# Check GitHub Actions for successful cache invalidation
# Check both URLs show updated content:
curl https://www.smartcalculatorhubs.com
curl https://smart-calculator-hub-d3409cs82vjl9890lfm0.lp.dev
```

## 🔑 Required Secrets

Add these to GitHub Secrets for automatic CDN invalidation:

```
CLOUDFLARE_ZONE_ID=your-zone-id
CLOUDFLARE_API_TOKEN=your-api-token
```

Or replace the Cloudflare section in `.github/workflows/deploy.yml` with your CDN provider's API.

## 🐛 Troubleshooting

### Stale Content on Custom Domain
1. Check if CDN invalidation ran successfully in GitHub Actions
2. Verify cache headers using `curl -I`
3. Test with cache-busting: `?v=timestamp`
4. Run manual cache purge if needed

### Domain Resolution Issues
```bash
# Check DNS
dig www.smartcalculatorhubs.com
dig smartcalculatorhubs.com

# Verify SSL
openssl s_client -connect www.smartcalculatorhubs.com:443 -servername www.smartcalculatorhubs.com
```

### Build Issues
```bash
# Clear caches
rm -rf node_modules/.vite
rm -rf dist

# Rebuild
npm run build:prod
```

## 📊 Performance Benefits

- **HTML**: Always fresh (no stale content)
- **Static Assets**: Aggressive caching with automatic invalidation
- **CDN**: Full cache purge after each deployment
- **SEO**: Proper canonical URLs and redirects
- **Security**: HTTPS enforcement and security headers

## 🔄 Next Steps

1. Deploy these changes to production
2. Set up GitHub Secrets for CDN API access
3. Test the full deployment pipeline
4. Monitor cache hit rates and performance
5. Set up alerts for failed cache invalidation

This setup ensures your users always see the latest content while maximizing performance through aggressive caching of static assets.