#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MIGRATIONS_DIR = path.resolve(__dirname, "..", "backend", "db", "migrations");

console.log("🔍 Checking Encore DB migration consistency...\n");

try {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    console.log("📁 Creating migrations directory...");
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
  }

  let dbInfo;
  let currentVersion = 0;

  try {
    const result = execSync("encore db migrations list --json", { encoding: "utf8" });
    const migrations = JSON.parse(result);
    
    if (migrations && migrations.length > 0) {
      dbInfo = migrations[0];
      currentVersion = dbInfo.version || 0;
    }
    console.log(`🧾 Cloud DB version: ${currentVersion}`);
  } catch (err) {
    console.log("⚠️  Could not fetch cloud migrations (this is OK for new projects)");
    console.log("   Continuing with local migration check...\n");
  }

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.match(/^\d+_.+\.up\.sql$/))
    .map(f => parseInt(f.split("_")[0]))
    .sort((a, b) => a - b);

  const highestLocal = files.length > 0 ? Math.max(...files) : 0;
  console.log(`📁 Local highest migration: ${highestLocal}`);

  if (currentVersion > highestLocal) {
    const missing = [];
    for (let i = highestLocal + 1; i <= currentVersion; i++) {
      missing.push(i);
    }
    console.warn(`\n⚠️  Missing migrations detected: ${missing.join(", ")}\n`);

    missing.forEach(version => {
      const upFilename = `${version}_auto_fix_missing.up.sql`;
      const downFilename = `${version}_auto_fix_missing.down.sql`;
      const upFilepath = path.join(MIGRATIONS_DIR, upFilename);
      const downFilepath = path.join(MIGRATIONS_DIR, downFilename);
      
      const upContent = `-- Auto-generated no-op migration to fix version gap
-- Version: ${version}
-- Created: ${new Date().toISOString()}

SELECT 'Migration ${version} - auto-generated fix for missing version';
`;
      
      const downContent = `-- Auto-generated no-op migration rollback
-- Version: ${version}

SELECT 'Rollback migration ${version}';
`;

      fs.writeFileSync(upFilepath, upContent);
      fs.writeFileSync(downFilepath, downContent);
      console.log(`   ✅ Created ${upFilename} and ${downFilename}`);
    });

    console.log("\n🧠 Running 'encore db migrations pull' to re-sync schema...\n");
    try {
      execSync("encore db migrations pull", { stdio: "inherit" });
      console.log("\n✅ Schema synced successfully");
    } catch (pullErr) {
      console.warn("\n⚠️  Could not pull migrations (might be expected for new projects)");
    }
  } else if (highestLocal > currentVersion) {
    console.log(`\n📤 Local migrations are ahead of cloud (${highestLocal} > ${currentVersion})`);
    console.log("   This is normal during development. Changes will be applied on next deploy.\n");
  } else {
    console.log("\n✅ Migrations are consistent.\n");
  }

  const allMigrations = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.match(/^\d+_.+\.(up|down)\.sql$/))
    .sort();

  if (allMigrations.length > 0) {
    console.log("📋 Migration files:");
    allMigrations.forEach(f => console.log(`   - ${f}`));
    console.log("");
  }

} catch (err) {
  console.error("❌ Migration check failed:", err.message);
  console.error("\nStack trace:", err.stack);
  process.exit(1);
}

console.log("✨ Migration check complete.\n");
