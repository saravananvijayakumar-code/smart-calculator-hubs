import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE_URL = "https://smartcalculatorhubs.com";
const FRONTEND_DIR = path.join(__dirname, "..");
const APP_TSX = path.join(FRONTEND_DIR, "App.tsx");
const OUTPUT_SITEMAP = path.join(FRONTEND_DIR, "public", "sitemap.xml");
const OUTPUT_ROBOTS = path.join(FRONTEND_DIR, "public", "robots.txt");

const PRIORITY_MAP = {
  "/": "1.0",
  "/finance/tools": "0.9",
  "/health/tools": "0.9",
  "/math/tools": "0.9",
  "/au": "0.9",
  "/calculator/": "0.8",
  "/ai/": "0.8",
  "/blog": "0.7",
  "/tools/": "0.7",
  default: "0.6"
};

function getPriority(url) {
  for (const [pattern, priority] of Object.entries(PRIORITY_MAP)) {
    if (url === pattern || (pattern.endsWith("/") && url.startsWith(pattern))) {
      return priority;
    }
  }
  return PRIORITY_MAP.default;
}

function extractRoutesFromAppTsx() {
  console.log("📖 Reading App.tsx routes...");
  const content = fs.readFileSync(APP_TSX, "utf-8");
  
  const routeRegex = /<Route\s+path=["']([^"']+)["']/g;
  const routes = new Set();
  
  let match;
  while ((match = routeRegex.exec(content)) !== null) {
    const route = match[1];
    if (!route.includes(":") && !route.includes("*") && !route.includes("[")) {
      routes.add(route);
    }
  }
  
  return Array.from(routes).sort();
}

function buildSitemap(urls) {
  const now = new Date().toISOString().split("T")[0];
  
  const urlEntries = urls.map(url => {
    const priority = getPriority(url);
    let changefreq = "monthly";
    
    if (url === "/") {
      changefreq = "daily";
    } else if (url.startsWith("/blog") || url.includes("/tools")) {
      changefreq = "weekly";
    } else if (url === "/privacy" || url === "/terms") {
      changefreq = "yearly";
    }
    
    return `  <url>
    <loc>${SITE_URL}${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

function generateRobotsTxt() {
  return `# SmartCalculatorHubs Robots Configuration
# Optimized for Google AdSense and SEO

# Allow all bots by default
User-agent: *
Disallow: /admin
Disallow: /test-blog
Disallow: /test-logs

# Explicitly allow Google AdSense bot
User-agent: Mediapartners-Google
Allow: /

# Allow Google AdSense verification bot
User-agent: Adsbot-Google
Allow: /

User-agent: Adsbot-Google-Mobile
Allow: /

# Allow Google Analytics verification bot
User-agent: Google-Site-Verification
Allow: /

# Ensure critical files are crawlable
Allow: /ads.txt
Allow: /ads-ca-pub-7271075626732183.txt
Allow: /adsense-verification.html

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

function main() {
  console.log("🚀 Generating SEO files for SmartCalculatorHubs...\n");
  
  const routes = extractRoutesFromAppTsx();
  
  const allUrls = [...new Set(routes)]
    .filter(url => !url.includes("/admin") && !url.includes("/test") && !url.includes(":") && !url.includes("*") && !url.includes("/share"))
    .sort();
  
  console.log(`✅ Found ${allUrls.length} unique routes\n`);
  
  console.log("📊 Route categories:");
  const categories = {
    calculator: allUrls.filter(u => u.includes("/calculator")).length,
    ai: allUrls.filter(u => u.startsWith("/ai")).length,
    blog: allUrls.filter(u => u.startsWith("/blog")).length,
    tools: allUrls.filter(u => u.includes("/tools")).length,
    australia: allUrls.filter(u => u.startsWith("/au")).length,
    finance: allUrls.filter(u => u.includes("/finance")).length,
    health: allUrls.filter(u => u.includes("/health")).length,
    viral: allUrls.filter(u => u.includes("/viral")).length,
    smarttimer: allUrls.filter(u => u.startsWith("/smarttimer")).length,
    other: allUrls.filter(u => 
      !u.includes("/calculator") && 
      !u.startsWith("/ai") && 
      !u.startsWith("/blog") && 
      !u.includes("/tools") &&
      !u.startsWith("/au") &&
      !u.includes("/finance") &&
      !u.includes("/health") &&
      !u.includes("/viral") &&
      !u.startsWith("/smarttimer")
    ).length
  };
  
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  - ${cat}: ${count}`);
  });
  
  const sitemap = buildSitemap(allUrls);
  fs.writeFileSync(OUTPUT_SITEMAP, sitemap);
  console.log(`\n✅ sitemap.xml generated (${allUrls.length} URLs)`);
  
  const robotsTxt = generateRobotsTxt();
  fs.writeFileSync(OUTPUT_ROBOTS, robotsTxt);
  console.log(`✅ robots.txt generated`);
  
  console.log(`\n🎉 SEO files generated successfully!`);
  console.log(`   Sitemap: ${OUTPUT_SITEMAP}`);
  console.log(`   Robots: ${OUTPUT_ROBOTS}`);
}

main();
