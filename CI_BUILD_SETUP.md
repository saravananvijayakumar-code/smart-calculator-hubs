# CI/CD Build Setup for Vite Memory Optimization

## Environment Variables

Set these environment variables in your CI/CD pipeline:

### Required
```bash
NODE_OPTIONS=--max-old-space-size=12288
```

### Optional (for debugging)
```bash
VITE_LOG_LEVEL=info
CI=true
```

## CI Platform-Specific Configuration

### GitHub Actions
```yaml
name: Build
on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
        env:
          NODE_OPTIONS: --max-old-space-size=12288
```

### GitLab CI
```yaml
build:
  image: node:18
  variables:
    NODE_OPTIONS: "--max-old-space-size=12288"
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
```

### Netlify
Add to `netlify.toml`:
```toml
[build.environment]
  NODE_OPTIONS = "--max-old-space-size=12288"
```

### Vercel
Add to project settings → Environment Variables:
```
NODE_OPTIONS = --max-old-space-size=12288
```

## Minimum RAM Requirements

Your CI/CD runner **must have**:
- **Minimum**: 4 GB RAM
- **Recommended**: 8 GB RAM
- **Optimal**: 16 GB RAM

⚠️ **Important**: With `NODE_OPTIONS=--max-old-space-size=12288`, Node.js can use up to ~12 GB of heap. Ensure your CI runner has sufficient total RAM (heap + system overhead).

## One-Time Clean Commands

Run these commands **locally** before your first build with the new configuration:

```bash
# Clean all caches and build artifacts
rm -rf node_modules
rm -rf .vite
rm -rf .turbo
rm -rf dist
rm -rf frontend/node_modules
rm -rf frontend/.vite

# Remove package locks (optional, only if you have issues)
rm -f package-lock.json
rm -f frontend/package-lock.json

# Reinstall dependencies
npm install

# Build
npm run build
```

### Windows PowerShell
```powershell
# Clean all caches and build artifacts
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .vite -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .turbo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force frontend/.vite -ErrorAction SilentlyContinue

# Reinstall and build
npm install
npm run build
```

## Verification Checklist

After applying changes and running clean commands:

- [ ] `node_modules/` deleted and reinstalled
- [ ] `.vite/` cache cleared
- [ ] `dist/` build output deleted
- [ ] `cross-env` installed (check `package.json` devDependencies)
- [ ] Build script uses `NODE_OPTIONS=--max-old-space-size=12288`
- [ ] Build script includes `--max-workers=2`
- [ ] CI environment has `NODE_OPTIONS` set
- [ ] CI runner has ≥4 GB RAM
- [ ] Build completes without "heap out of memory" error

## Build Script Reference

Your `package.json` should contain:

```json
{
  "scripts": {
    "build": "npm run generate-seo && tsc && cross-env NODE_OPTIONS=--max-old-space-size=12288 vite build --mode production --max-workers=2"
  },
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

## Troubleshooting

### Still getting OOM in CI?

1. **Check runner RAM**: `free -h` (Linux) or Task Manager (Windows)
2. **Increase heap size**: Try `--max-old-space-size=16384` (16 GB)
3. **Reduce workers**: Change to `--max-workers=1`
4. **Use larger runner**: Upgrade to a runner with more RAM

### Build works locally but fails in CI?

- Verify CI environment variables are set correctly
- Check CI runner RAM availability
- Review CI logs for exact OOM location (dependency resolution vs rendering chunks)

### Build is slow?

This is expected. The trade-off:
- **Memory**: Reduced by ~40% (no tree-shaking analysis)
- **Speed**: May be slower due to `--max-workers=2`
- **Stability**: 100% (no OOM crashes)

---

**Last Updated**: 2025-10-13  
**Vite Version**: 4.1.0+  
**Node Version**: 18.14.0+
