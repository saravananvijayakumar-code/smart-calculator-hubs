import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://smart-calculator-hub-d3409cs82vjl9890lfm0.lp.dev';
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const PAGES_DIR = path.join(__dirname, '../pages');

const ROUTE_CONFIG = {
  '/tools': { priority: '0.8', changefreq: 'weekly' },
  '/ai': { priority: '0.8', changefreq: 'weekly' },
  '/calculators': { priority: '0.9', changefreq: 'weekly' },
  '/blog': { priority: '0.7', changefreq: 'daily' },
  '/admin': { priority: '0.1', changefreq: 'monthly' },
  '/hub': { priority: '0.8', changefreq: 'weekly' },
  '/smarttimer': { priority: '0.6', changefreq: 'monthly' },
};

function getRouteConfig(url) {
  for (const [prefix, config] of Object.entries(ROUTE_CONFIG)) {
    if (url.startsWith(prefix)) {
      return config;
    }
  }
  return { priority: '0.5', changefreq: 'monthly' };
}

function filePathToRoute(filePath) {
  const relativePath = path.relative(PAGES_DIR, filePath);
  const parsed = path.parse(relativePath);
  
  let route = parsed.dir ? `/${parsed.dir}` : '';
  
  if (parsed.name !== 'index' && !parsed.name.endsWith('Page')) {
    route += route ? `/${parsed.name}` : `/${parsed.name}`;
  }
  
  if (parsed.name.endsWith('Page')) {
    const pageName = parsed.name.replace(/Page$/, '');
    if (pageName.toLowerCase() !== 'index' && pageName.toLowerCase() !== parsed.dir.split('/').pop()?.toLowerCase()) {
      route += route ? `/${pageName.toLowerCase()}` : `/${pageName.toLowerCase()}`;
    }
  }
  
  return route.replace(/\\/g, '/') || '/';
}

function scanPages(dir, routes = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanPages(fullPath, routes);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (file.includes('.test.') || file.includes('.spec.')) continue;
      
      const route = filePathToRoute(fullPath);
      if (route && !routes.includes(route)) {
        routes.push(route);
      }
    }
  }
  
  return routes;
}

function parseExistingSitemap() {
  if (!fs.existsSync(SITEMAP_PATH)) {
    return { urls: new Map(), header: '', footer: '' };
  }
  
  const content = fs.readFileSync(SITEMAP_PATH, 'utf-8');
  const urls = new Map();
  
  const urlRegex = /<url>\s*<loc>([^<]+)<\/loc>\s*<changefreq>([^<]+)<\/changefreq>\s*<priority>([^<]+)<\/priority>\s*<\/url>/g;
  let match;
  
  while ((match = urlRegex.exec(content)) !== null) {
    const [, loc, changefreq, priority] = match;
    const path = loc.replace(BASE_URL, '');
    urls.set(path, { changefreq, priority });
  }
  
  const headerMatch = content.match(/([\s\S]*?)<url>/);
  const footerMatch = content.match(/<\/url>\s*<\/urlset>\s*$/);
  
  return {
    urls,
    header: headerMatch ? headerMatch[1] : '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n',
    footer: '</urlset>\n'
  };
}

function generateSitemap() {
  console.log('Scanning pages...');
  const routes = scanPages(PAGES_DIR);
  
  console.log('Parsing existing sitemap...');
  const { urls: existingUrls, header, footer } = parseExistingSitemap();
  
  console.log('Merging routes...');
  const allRoutes = new Set([...existingUrls.keys(), ...routes]);
  
  let sitemapContent = header;
  
  for (const route of Array.from(allRoutes).sort()) {
    const url = `${BASE_URL}${route}`;
    const existing = existingUrls.get(route);
    const config = existing || getRouteConfig(route);
    
    sitemapContent += `  <url>\n`;
    sitemapContent += `    <loc>${url}</loc>\n`;
    sitemapContent += `    <changefreq>${config.changefreq}</changefreq>\n`;
    sitemapContent += `    <priority>${config.priority}</priority>\n`;
    sitemapContent += `  </url>\n`;
  }
  
  sitemapContent += footer;
  
  console.log('Writing sitemap...');
  fs.writeFileSync(SITEMAP_PATH, sitemapContent);
  
  console.log(`✓ Sitemap updated with ${allRoutes.size} URLs`);
  console.log(`  - ${existingUrls.size} existing URLs preserved`);
  console.log(`  - ${allRoutes.size - existingUrls.size} new URLs added`);
}

generateSitemap();
