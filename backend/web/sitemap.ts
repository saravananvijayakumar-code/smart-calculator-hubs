import { api } from "encore.dev/api";

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

function getBaseURL(requestHost?: string): string {
  if (requestHost) {
    if (requestHost.includes('smartcalculatorhubs.com')) {
      return 'https://smartcalculatorhubs.com';
    }
    if (requestHost.includes('encr.app')) {
      return 'https://prod-smart-calculator-hub-v9pi.frontend.encr.app';
    }
  }
  
  return "https://smartcalculatorhubs.com";
}

const STATIC_PAGES: SitemapUrl[] = [
  { loc: "/", changefreq: "daily", priority: 1.0 },
  { loc: "/about", changefreq: "monthly", priority: 0.7 },
  { loc: "/contact", changefreq: "monthly", priority: 0.7 },
  { loc: "/privacy", changefreq: "yearly", priority: 0.5 },
  { loc: "/terms", changefreq: "yearly", priority: 0.5 },
  { loc: "/blog", changefreq: "daily", priority: 0.9 },
  { loc: "/knowmyip", changefreq: "weekly", priority: 0.8 },
  { loc: "/know-my-ip", changefreq: "weekly", priority: 0.7 },
  { loc: "/history", changefreq: "monthly", priority: 0.5 },
];

const HUB_PAGES: SitemapUrl[] = [
  { loc: "/finance/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/health/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/math/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/utility/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/us/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/uk/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/india/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/australia/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/insurance/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/viral/tools", changefreq: "weekly", priority: 0.8 },
  { loc: "/finder/tools", changefreq: "weekly", priority: 0.9 },
  { loc: "/ai/relationships", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/wellness", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/parenting", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/shopping", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/social", changefreq: "weekly", priority: 0.8 },
  { loc: "/smarttimer", changefreq: "weekly", priority: 0.9 },
  { loc: "/smarttimer/stopwatch", changefreq: "weekly", priority: 0.9 },
  { loc: "/smarttimer/countdown", changefreq: "weekly", priority: 0.9 },
  { loc: "/smarttimer/pomodoro", changefreq: "weekly", priority: 0.9 },
  { loc: "/smarttimer/multi-timer", changefreq: "weekly", priority: 0.9 },
  { loc: "/smarttimer/event", changefreq: "weekly", priority: 0.9 },
  { loc: "/tools", changefreq: "weekly", priority: 0.9 },
];

const CALCULATOR_PAGES: SitemapUrl[] = [
  { loc: "/calculator/bmi", changefreq: "monthly", priority: 0.9 },

  { loc: "/calculator/weight-loss-steps", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/waist-to-hip-ratio", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/body-fat", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/bmr", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/ideal-weight", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/water-intake", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/sleep", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/heart-rate-zone", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/pregnancy-due-date", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/health/ovulation", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/mortgage", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/loan", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/investment", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/percentage", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/scientific", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/fraction", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/statistics", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/tip", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/currency-converter", changefreq: "daily", priority: 0.9 },
  { loc: "/calculator/discount", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/date", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/password-generator", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/simple-interest", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/compound-interest", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/age", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/unit-converter", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/roi", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/retirement", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/credit-card-payoff", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/emergency-fund", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/profit-margin", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/paycheck", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/salary", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/federal-tax", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/loan-affordability", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/401k-retirement", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/state-tax", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/student-loan", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/auto-loan", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/heloc", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/business-loan", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/debt-consolidation", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/uk/stamp-duty", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/uk/isa", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/uk/national-insurance", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/uk/pension", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/uk/btl-mortgage", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/india/emi", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/india/epf", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/india/sip", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/india/income-tax", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/india/ppf", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/india/home-loan", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/india/gst", changefreq: "monthly", priority: 0.9 },
  { loc: "/au", changefreq: "weekly", priority: 0.9 },
  { loc: "/au/pay-calculator", changefreq: "monthly", priority: 0.9 },
  { loc: "/au/bonus-tax", changefreq: "monthly", priority: 0.9 },
  { loc: "/au/unused-leave", changefreq: "monthly", priority: 0.9 },
  { loc: "/au/student-loan", changefreq: "monthly", priority: 0.9 },
  { loc: "/au/tax-distribution", changefreq: "monthly", priority: 0.9 },
  { loc: "/au/tax-info", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/australia/income-tax", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/australia/first-home-buyer-nsw", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/australia/superannuation", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/australia/property-tax", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/australia/cgt", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/australia/fbt", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/australia/negative-gearing", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/insurance/life-insurance", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/insurance/health-insurance", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/love-compatibility", changefreq: "monthly", priority: 0.8 },
  { loc: "/calculators/viral/zodiac-compatibility", changefreq: "monthly", priority: 0.8 },
  { loc: "/calculators/viral/life-path-number", changefreq: "monthly", priority: 0.8 },
  { loc: "/calculators/viral/friend-compatibility", changefreq: "monthly", priority: 0.8 },
  { loc: "/calculators/viral/calorie-burn", changefreq: "monthly", priority: 0.8 },
  { loc: "/calculators/viral/life-expectancy", changefreq: "monthly", priority: 0.8 },
  { loc: "/calculators/viral/how-long-to-watch", changefreq: "monthly", priority: 0.8 },
  { loc: "/ai/relationships/compatibility", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/relationships/pickup-lines", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/social/hashtag-generator", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/social/profile-analyzer", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/social/instagram-bio-analyzer", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/social/tiktok-profile-score", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/social/caption-generator", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/social/audience-analyzer", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/ai-text-detector", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/wellness/mood-journal", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/parenting/baby-name-generator", changefreq: "weekly", priority: 0.8 },
  { loc: "/ai/shopping/gift-recommender", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/internet-speed-test", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/speed-test", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/ip-reputation-check", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/ip-reputation", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/ssl-domain-checker", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/ssl-checker", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/dns-ping-test", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/dns-ping", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/browser-device-info", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/browser-info", changefreq: "weekly", priority: 0.8 },
  { loc: "/tools/image-compressor", changefreq: "weekly", priority: 0.8 },
  { loc: "/finder/tools/plantfinder", changefreq: "weekly", priority: 0.9 },
  { loc: "/finder/tools/pet-breed-finder", changefreq: "weekly", priority: 0.9 },
  { loc: "/finder/tools/home-decor-style-finder", changefreq: "weekly", priority: 0.9 },
  { loc: "/calculators/insurance/travel", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/insurance/pet", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculators/insurance/business-liability", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/legal-settlement", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/solar-savings", changefreq: "monthly", priority: 0.9 },
  { loc: "/calculator/car-insurance-premium", changefreq: "monthly", priority: 0.9 },
];

async function getBlogPostUrls(): Promise<SitemapUrl[]> {
  return [];
}

function generateSitemapXML(urls: SitemapUrl[], requestHost?: string): string {
  const baseURL = getBaseURL(requestHost);
  const urlElements = urls.map(url => {
    let urlElement = `  <url>\n    <loc>${baseURL}${url.loc}</loc>`;
    
    if (url.lastmod) {
      urlElement += `\n    <lastmod>${url.lastmod}</lastmod>`;
    }
    
    if (url.changefreq) {
      urlElement += `\n    <changefreq>${url.changefreq}</changefreq>`;
    }
    
    if (url.priority !== undefined) {
      urlElement += `\n    <priority>${url.priority}</priority>`;
    }
    
    urlElement += '\n  </url>';
    return urlElement;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

export const sitemap = api.raw(
  { 
    method: "GET", 
    path: "/sitemap.xml",
    expose: true 
  },
  async (req, resp) => {
    try {
      const requestHost = req.headers.host;
      
      const blogUrls = await getBlogPostUrls();
      
      const allUrls = [
        ...STATIC_PAGES,
        ...HUB_PAGES,
        ...CALCULATOR_PAGES,
        ...blogUrls
      ];

      const xmlContent = generateSitemapXML(allUrls, requestHost);

      resp.setHeader('Content-Type', 'application/xml; charset=utf-8');
      resp.setHeader('Cache-Control', 'public, max-age=3600');
      
      resp.setHeader('X-Content-Type-Options', 'nosniff');
      
      resp.statusCode = 200;
      resp.end(xmlContent);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      resp.statusCode = 500;
      resp.setHeader('Content-Type', 'text/plain');
      resp.end('Internal Server Error');
    }
  }
);
