-- Extract all calculator and tool pages from sitemap for blog generation
-- Excluding: about, privacy, terms, contact, blog, history, hub pages
-- Using INSERT ... ON CONFLICT instead of DELETE + INSERT for better performance

INSERT INTO source_catalog (source_url, title, kind, eligible) VALUES
-- Health Calculators
('/calculator/bmi', 'BMI Calculator', 'calculator', true),
('/calculator/calorie', 'Calorie Burn Calculator', 'calculator', true),
('/calculator/weight-loss-steps', 'Weight Loss Step Calculator', 'calculator', true),
('/calculator/waist-to-hip-ratio', 'Waist to Hip Ratio Calculator', 'calculator', true),
('/calculators/health/body-fat', 'Body Fat Calculator', 'calculator', true),
('/calculators/health/bmr', 'BMR Calculator', 'calculator', true),
('/calculators/health/ideal-weight', 'Ideal Weight Calculator', 'calculator', true),
('/calculators/health/water-intake', 'Water Intake Calculator', 'calculator', true),
('/calculators/health/sleep', 'Sleep Calculator', 'calculator', true),
('/calculators/health/heart-rate-zone', 'Heart Rate Zone Calculator', 'calculator', true),
('/calculators/health/pregnancy-due-date', 'Pregnancy Due Date Calculator', 'calculator', true),
('/calculators/health/ovulation', 'Ovulation Calculator', 'calculator', true),

-- Financial Calculators
('/calculator/mortgage', 'Mortgage Calculator', 'calculator', true),
('/calculator/loan', 'Loan Calculator', 'calculator', true),
('/calculator/investment', 'Investment Calculator', 'calculator', true),
('/calculator/retirement', 'Retirement Calculator', 'calculator', true),
('/calculator/emergency-fund', 'Emergency Fund Calculator', 'calculator', true),
('/calculator/simple-interest', 'Simple Interest Calculator', 'calculator', true),
('/calculator/compound-interest', 'Compound Interest Calculator', 'calculator', true),
('/calculator/roi', 'ROI Calculator', 'calculator', true),
('/calculator/credit-card-payoff', 'Credit Card Payoff Calculator', 'calculator', true),
('/calculator/profit-margin', 'Profit Margin Calculator', 'calculator', true),
('/calculator/paycheck', 'Paycheck Calculator', 'calculator', true),

-- Math Calculators
('/calculator/percentage', 'Percentage Calculator', 'calculator', true),
('/calculator/scientific', 'Scientific Calculator', 'calculator', true),
('/calculator/fraction', 'Fraction Calculator', 'calculator', true),
('/calculator/statistics', 'Statistics Calculator', 'calculator', true),
('/calculator/age', 'Age Calculator', 'calculator', true),
('/calculator/unit-converter', 'Unit Converter', 'calculator', true),

-- Utility Tools
('/calculator/tip', 'Tip Calculator', 'calculator', true),
('/calculator/currency-converter', 'Currency Converter', 'calculator', true),
('/calculator/discount', 'Discount Calculator', 'calculator', true),
('/calculator/date', 'Date Calculator', 'calculator', true),
('/calculator/password-generator', 'Password Generator', 'tool', true),

-- US Calculators
('/calculator/salary', 'Salary Calculator US', 'calculator', true),
('/calculator/federal-tax', 'Federal Tax Calculator US', 'calculator', true),
('/calculator/loan-affordability', 'Loan Affordability Calculator US', 'calculator', true),
('/calculator/401k-retirement', '401k Retirement Calculator', 'calculator', true),
('/calculator/state-tax', 'State Tax Calculator US', 'calculator', true),
('/calculator/student-loan', 'Student Loan Calculator US', 'calculator', true),
('/calculator/auto-loan', 'Auto Loan Calculator US', 'calculator', true),
('/calculator/heloc', 'HELOC Calculator US', 'calculator', true),
('/calculator/business-loan', 'Business Loan Calculator US', 'calculator', true),
('/calculator/debt-consolidation', 'Debt Consolidation Calculator US', 'calculator', true),

-- UK Calculators
('/calculators/uk/stamp-duty', 'Stamp Duty Calculator UK', 'calculator', true),
('/calculators/uk/isa', 'ISA Calculator UK', 'calculator', true),
('/calculators/uk/national-insurance', 'National Insurance Calculator UK', 'calculator', true),
('/calculators/uk/pension', 'Pension Calculator UK', 'calculator', true),
('/calculators/uk/btl-mortgage', 'Buy-to-Let Mortgage Calculator UK', 'calculator', true),

-- India Calculators
('/calculators/india/emi', 'EMI Calculator India', 'calculator', true),
('/calculators/india/epf', 'EPF Calculator India', 'calculator', true),
('/calculators/india/sip', 'SIP Calculator India', 'calculator', true),
('/calculators/india/income-tax', 'Income Tax Calculator India', 'calculator', true),
('/calculators/india/ppf', 'PPF Calculator India', 'calculator', true),
('/calculators/india/home-loan', 'Home Loan Calculator India', 'calculator', true),
('/calculators/india/gst', 'GST Calculator India', 'calculator', true),

-- Australia Calculators
('/au/pay-calculator', 'Pay Calculator Australia', 'calculator', true),
('/au/bonus-tax', 'Bonus Tax Calculator Australia', 'calculator', true),
('/au/unused-leave', 'Unused Leave Calculator Australia', 'calculator', true),
('/au/student-loan', 'Student Loan Calculator Australia', 'calculator', true),
('/au/tax-distribution', 'Tax Distribution Calculator Australia', 'calculator', true),
('/au/tax-info', 'Tax Information Australia', 'tool', true),
('/calculators/australia/income-tax', 'Income Tax Calculator Australia', 'calculator', true),
('/calculators/australia/first-home-buyer-nsw', 'First Home Buyer Calculator NSW', 'calculator', true),
('/calculators/australia/superannuation', 'Superannuation Calculator Australia', 'calculator', true),
('/calculators/australia/property-tax', 'Property Tax Calculator Australia', 'calculator', true),
('/calculators/australia/cgt', 'CGT Calculator Australia', 'calculator', true),
('/calculators/australia/fbt', 'FBT Calculator Australia', 'calculator', true),
('/calculators/australia/negative-gearing', 'Negative Gearing Calculator Australia', 'calculator', true),

-- Insurance Calculators
('/calculators/insurance/life-insurance', 'Life Insurance Calculator', 'calculator', true),
('/calculators/insurance/health-insurance', 'Health Insurance Calculator', 'calculator', true),
('/calculators/insurance/travel', 'Travel Insurance Calculator', 'calculator', true),
('/calculators/insurance/pet', 'Pet Insurance Calculator', 'calculator', true),
('/calculators/insurance/business-liability', 'Business Liability Calculator', 'calculator', true),
('/calculator/legal-settlement', 'Legal Settlement Estimator', 'calculator', true),
('/calculator/solar-savings', 'Solar Savings Calculator', 'calculator', true),
('/calculator/car-insurance-premium', 'Car Insurance Premium Estimator', 'calculator', true),

-- Viral Calculators
('/calculator/love-compatibility', 'Love Compatibility Calculator', 'calculator', true),
('/calculators/viral/zodiac-compatibility', 'Zodiac Compatibility Calculator', 'calculator', true),
('/calculators/viral/life-path-number', 'Life Path Number Calculator', 'calculator', true),
('/calculators/viral/friend-compatibility', 'Friend Compatibility Calculator', 'calculator', true),
('/calculators/viral/calorie-burn', 'Calorie Burn Calculator', 'calculator', true),
('/calculators/viral/life-expectancy', 'Life Expectancy Calculator', 'calculator', true),
('/calculators/viral/how-long-to-watch', 'How Long to Watch Calculator', 'calculator', true),

-- AI Tools
('/ai/relationships/compatibility', 'AI Compatibility Calculator', 'ai_tool', true),
('/ai/relationships/pickup-lines', 'AI Pickup Line Generator', 'ai_tool', true),
('/ai/social/hashtag-generator', 'Hashtag Generator', 'ai_tool', true),
('/ai/social/profile-analyzer', 'Profile Analyzer', 'ai_tool', true),
('/ai/social/instagram-bio-analyzer', 'Instagram Bio Analyzer', 'ai_tool', true),
('/ai/social/tiktok-profile-score', 'TikTok Profile Score', 'ai_tool', true),
('/ai/social/caption-generator', 'Caption Generator', 'ai_tool', true),
('/ai/social/audience-analyzer', 'Audience Analyzer', 'ai_tool', true),
('/ai/ai-text-detector', 'AI Text Detector', 'ai_tool', true),
('/ai/wellness/mood-journal', 'Mood Journal', 'ai_tool', true),
('/ai/parenting/baby-name-generator', 'Baby Name Generator', 'ai_tool', true),
('/ai/shopping/gift-recommender', 'Gift Recommender', 'ai_tool', true),

-- Tools
('/tools/internet-speed-test', 'Internet Speed Test', 'tool', true),
('/tools/ip-reputation-check', 'IP Reputation Check', 'tool', true),
('/tools/ssl-domain-checker', 'SSL Domain Checker', 'tool', true),
('/tools/dns-ping-test', 'DNS Ping Test', 'tool', true),
('/tools/browser-device-info', 'Browser Device Info', 'tool', true),
('/tools/image-compressor', 'Image Compressor', 'tool', true),
('/knowmyip', 'Know My IP', 'tool', true),

-- Finder Tools
('/finder/tools/plantfinder', 'Plant Finder', 'tool', true),
('/finder/tools/pet-breed-finder', 'Pet Breed Finder', 'tool', true),
('/finder/tools/home-decor-style-finder', 'Home Decor Style Finder', 'tool', true),

-- SmartTimer Tools
('/smarttimer/stopwatch', 'Stopwatch Timer', 'tool', true),
('/smarttimer/countdown', 'Countdown Timer', 'tool', true),
('/smarttimer/pomodoro', 'Pomodoro Timer', 'tool', true),
('/smarttimer/multi-timer', 'Multi Timer', 'tool', true),
('/smarttimer/event', 'Event Countdown Timer', 'tool', true)

ON CONFLICT (source_url) DO UPDATE SET
  title = EXCLUDED.title,
  kind = EXCLUDED.kind,
  eligible = EXCLUDED.eligible,
  updated_at = NOW();
