# 🔧 Encore Database Migration Consistency System

## 🎯 Purpose

This system automatically detects and fixes recurring Encore Cloud migration errors like:
```
"failed to migrate database: no migration found for version 17: file does not exist"
```

## ✨ Features

- ✅ Automatically detects missing migration versions
- ✅ Creates safe "no-op" migrations to fill version gaps
- ✅ Enforces best practices (commit, version sync, cloud pull)
- ✅ Works for any future version mismatch
- ✅ Runs automatically before each deploy (preflight hook)
- ✅ Prevents deployment failures due to migration inconsistencies

## 🚀 Usage

### Automatic Check (Recommended)

The migration check runs automatically before every deploy:

```bash
npm run deploy
```

This will:
1. Run `npm run predeploy` (which executes `checkMigrations.mjs`)
2. Detect any missing migration versions
3. Create no-op migrations if needed
4. Sync with Encore Cloud
5. Proceed with deployment

### Manual Check

If you want to manually check migrations without deploying:

```bash
npm run db:check
```

Or directly:

```bash
node scripts/checkMigrations.mjs
```

## 🔍 How It Works

1. **Fetches Cloud Version**: Queries Encore Cloud for the current migration version
2. **Checks Local Versions**: Scans `backend/db/migrations/` for existing migration files
3. **Detects Gaps**: If cloud version > local highest version, identifies missing versions
4. **Creates No-Op Migrations**: Generates safe placeholder migrations for missing versions
5. **Syncs Schema**: Runs `encore db migrations pull` to synchronize with cloud

## 📁 File Structure

```
/scripts/checkMigrations.mjs       # Main migration checker script
/backend/db/migrations/            # Migration files directory
  ├── 1_init.up.sql               # Your existing migrations
  ├── 1_init.down.sql
  ├── 17_auto_fix_missing.up.sql  # Auto-generated if missing
  └── 17_auto_fix_missing.down.sql
```

## 🧩 Migration File Format

Auto-generated migrations follow this format:

**Up Migration** (`{version}_auto_fix_missing.up.sql`):
```sql
-- Auto-generated no-op migration to fix version gap
-- Version: 17
-- Created: 2025-10-16T12:34:56.789Z

SELECT 'Migration 17 - auto-generated fix for missing version';
```

**Down Migration** (`{version}_auto_fix_missing.down.sql`):
```sql
-- Auto-generated no-op migration rollback
-- Version: 17

SELECT 'Rollback migration 17';
```

## 📋 Best Practices

### ✅ DO

1. **Always commit migration files**: Keep all `.up.sql` and `.down.sql` files in version control
2. **Pull before coding**: Run `encore db migrations pull` to sync cloud history
3. **Never delete old migrations**: Maintains historical integrity
4. **Use the auto-checker**: Let the script handle version gaps
5. **Review auto-generated migrations**: Verify they make sense for your use case

### ❌ DON'T

1. **Don't skip migration versions**: Let the tool create placeholders
2. **Don't delete migrations manually**: Can cause version chain breaks
3. **Don't bypass the preflight check**: It prevents deployment failures
4. **Don't ignore warnings**: Address them before proceeding

## 🔧 Troubleshooting

### Issue: "Could not fetch cloud migrations"

**Cause**: First-time setup or network issue

**Solution**: This is expected for new projects. The script will continue with local checks.

### Issue: "Local migrations are ahead of cloud"

**Cause**: You've created new migrations that haven't been deployed yet

**Solution**: Normal during development. They'll be applied on next deploy.

### Issue: Migration version gap detected

**Cause**: Branch merge, deleted migrations, or cloud/local desync

**Solution**: The script automatically creates no-op migrations to fill gaps.

### Issue: Script fails with exit code 1

**Cause**: Critical error in migration detection

**Solution**: 
1. Check the error message in console
2. Verify `backend/db/migrations/` directory exists
3. Ensure Encore CLI is installed and authenticated
4. Check migration file naming convention

## 🎨 Console Output Examples

### ✅ Healthy State
```
🔍 Checking Encore DB migration consistency...

🧾 Cloud DB version: 16
📁 Local highest migration: 16

✅ Migrations are consistent.

📋 Migration files:
   - 1_init.up.sql
   - 1_init.down.sql
   - 2_add_users.up.sql
   - 2_add_users.down.sql
   ...

✨ Migration check complete.
```

### ⚠️ Gap Detected
```
🔍 Checking Encore DB migration consistency...

🧾 Cloud DB version: 17
📁 Local highest migration: 15

⚠️  Missing migrations detected: 16, 17

   ✅ Created 16_auto_fix_missing.up.sql and 16_auto_fix_missing.down.sql
   ✅ Created 17_auto_fix_missing.up.sql and 17_auto_fix_missing.down.sql

🧠 Running 'encore db migrations pull' to re-sync schema...

✅ Schema synced successfully

✨ Migration check complete.
```

## 🔄 Integration with CI/CD

The preflight check integrates seamlessly with your deployment pipeline:

```json
{
  "scripts": {
    "predeploy": "npm run db:check",
    "deploy": "npm run predeploy && encore deploy"
  }
}
```

This ensures migrations are always validated before deployment, preventing runtime failures.

## 🧠 Technical Details

### Migration Naming Convention

Encore expects migrations in this format:
- Up migration: `{version}_{description}.up.sql`
- Down migration: `{version}_{description}.down.sql`

Where `{version}` is an incrementing integer.

### Version Detection Algorithm

1. Parse all local migration files
2. Extract version numbers from filenames
3. Compare with cloud database version
4. Identify any gaps in the sequence
5. Generate placeholder migrations for gaps
6. Sync with cloud schema

### Error Handling

The script includes comprehensive error handling:
- Network failures when fetching cloud state
- Missing migrations directory
- Invalid migration file formats
- Failed schema sync operations

## 📞 Support

If you encounter persistent migration issues:

1. Check this guide's troubleshooting section
2. Review the console output for specific errors
3. Verify your Encore CLI version is up to date
4. Check Encore Cloud dashboard for migration status
5. Consult Encore.ts documentation: https://encore.dev/docs

## 🎓 Migration Best Practices Summary

| Rule | Behavior |
|------|----------|
| 🧾 Always commit migrations | Keeps version chain intact |
| ⚙️ Pull before coding | `encore db migrations pull` auto-syncs cloud history |
| 🧱 Never delete old migrations | Historical integrity maintained |
| 🔀 Handles branch merges | Script auto-fills skipped versions with no-op migrations |
| 🧩 Future-proof | Works for all new migration versions automatically |

## 📝 Version History

- **v1.0.0** - Initial implementation with automatic gap detection and no-op generation

---

**Last Updated**: 2025-10-16  
**Maintained By**: Smart Calculator Hub Team
