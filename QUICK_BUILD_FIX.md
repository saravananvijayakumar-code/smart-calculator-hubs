# ⚡ QUICK BUILD FIX

## Error
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@tailwindcss/vite'
```

## Fix (Run This Now)
```bash
chmod +x /workspace/fix-build.sh && /workspace/fix-build.sh
```

## What It Does
1. Cleans old dependencies
2. Reinstalls with devDependencies included
3. Verifies @tailwindcss/vite is installed
4. Shows success confirmation

## After Running
The build should work. If not, see `/BUILD_FIX_README.md` for detailed troubleshooting.

## Why This Happens
- Tailwind v4 needs `@tailwindcss/vite` plugin
- Build process doesn't always install devDependencies
- Missing package → build fails

## Permanent Fix
Requires Leap admin to update templates - see `/TAILWIND_VITE_PERMANENT_FIX.md`

---
**One-liner:** Run `/workspace/fix-build.sh` before building
