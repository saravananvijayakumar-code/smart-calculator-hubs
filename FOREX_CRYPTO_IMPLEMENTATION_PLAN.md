# Forex + Crypto Calculator Implementation Plan
**Project**: Smart Calculator Hubs  
**Date**: 2025-10-05  
**Total Calculators**: 14 (5 Forex + 5 Crypto + 4 Advanced)

---

## 📋 IMPLEMENTATION STRATEGY

### Delivery Method
**One calculator at a time, fully complete before moving to the next.**

Each calculator will be delivered as a **complete, production-ready feature** including:
- ✅ Frontend calculator component with full UI
- ✅ Backend API integration (if needed)
- ✅ TypeScript types and validation
- ✅ AI Analysis integration
- ✅ 2000+ word SEO blog post
- ✅ Route registration in App.tsx
- ✅ Hub page listing
- ✅ HomePage search integration
- ✅ Share + Download functionality
- ✅ AdSense placeholders
- ✅ SEO meta tags and schema
- ✅ Unit tests
- ✅ Build verification

### Progress Tracking
Current Status: **0/14 Complete** (0%)

---

## 🚀 PHASE 1: FOREX CALCULATORS (Priority Order)

### Calculator 1: Live Currency Converter (/forex/converter)
**Status**: ❌ Not Started  
**Priority**: HIGH (foundational, uses existing exchange service)

**Acceptance Checklist**:
- [ ] **Backend**: Verify `backend/exchange/convert.ts` works for forex pairs
- [ ] **Frontend Component**: `frontend/pages/calculators/forex/ForexConverter.tsx`
  - [ ] Currency selector (150+ forex pairs)
  - [ ] Amount input with validation
  - [ ] Real-time conversion display
  - [ ] Last updated timestamp
  - [ ] "Swap currencies" button
  - [ ] Responsive design (mobile-first)
- [ ] **Types**: `ForexConversionInput` & `ForexConversionResult` interfaces
- [ ] **AI Analysis**: 
  - [ ] Component renders with conversion data
  - [ ] Explains exchange rate context
  - [ ] Shows 24h rate change
  - [ ] Suggests best time to convert
- [ ] **Blog Post**: `frontend/pages/blog/forex-currency-converter.tsx`
  - [ ] 2000+ words on forex rates, spreads, timing
  - [ ] Internal links to other forex calculators
  - [ ] FAQ section (10+ questions)
  - [ ] SEO optimized (meta, H1-H6 structure)
- [ ] **Route**: Added to `App.tsx` as `/forex/converter`
- [ ] **Hub Page**: Created `frontend/pages/hub/ForexToolsPage.tsx`
  - [ ] Lists all 5 forex calculators
  - [ ] Category descriptions
  - [ ] Breadcrumbs navigation
- [ ] **Search**: Added to `HomePage.tsx` search index
- [ ] **Share/Download**:
  - [ ] Share modal with OG preview
  - [ ] Download as PNG (chart visualization)
  - [ ] Download as CSV (conversion history)
- [ ] **AdSense**: 3 placements (top banner, mid-content, sticky mobile)
- [ ] **SEO**:
  - [ ] `<SEOHead>` with title, description, keywords
  - [ ] WebApplication schema
  - [ ] Article schema for blog
  - [ ] FAQPage schema
- [ ] **Tests**: `ForexConverter.test.tsx` (Vitest)
- [ ] **Build**: Passes `npm run build` with no errors
- [ ] **Lighthouse**: Score ≥ 90 (Performance, SEO, Accessibility)

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 2: Pip Value Calculator (/forex/pip-value)
**Status**: ❌ Not Started  
**Priority**: MEDIUM

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/forex/PipValueCalculator.tsx`
  - [ ] Currency pair selector (e.g., EUR/USD)
  - [ ] Lot size input (standard, mini, micro)
  - [ ] Current price input
  - [ ] Account currency selector
  - [ ] Pip value calculation display
  - [ ] Profit impact per pip visualization
- [ ] **Types**: `PipValueInput` & `PipValueResult` interfaces
- [ ] **Calculation Logic**: Accurate pip value formula
  - [ ] Standard lots: 100,000 units
  - [ ] Mini lots: 10,000 units
  - [ ] Micro lots: 1,000 units
- [ ] **AI Analysis**: 
  - [ ] Risk per trade explanation
  - [ ] Position sizing recommendations
  - [ ] Comparison with industry standards
- [ ] **Blog Post**: "How to Calculate Pip Value in Forex (2025 Guide)"
  - [ ] 2000+ words
  - [ ] Examples with major pairs
  - [ ] Pip value tables
- [ ] **Route**: `/forex/pip-value` in App.tsx
- [ ] **Hub**: Listed on ForexToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG + CSV export
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: Unit tests for calculations
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 3: Margin Calculator (/forex/margin)
**Status**: ❌ Not Started  
**Priority**: MEDIUM

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/forex/MarginCalculator.tsx`
  - [ ] Trade size input
  - [ ] Leverage selector (1:10 to 1:500)
  - [ ] Currency pair selector
  - [ ] Margin required display
  - [ ] Margin % of equity
  - [ ] Visual leverage indicator
- [ ] **Types**: `MarginInput` & `MarginResult` interfaces
- [ ] **Calculation**: Margin = (position size ÷ leverage)
- [ ] **AI Analysis**: 
  - [ ] Risk explanation based on leverage
  - [ ] Margin call warnings
  - [ ] Safe leverage recommendations
- [ ] **Blog Post**: "The Ultimate Forex Margin Calculator Guide"
  - [ ] 2000+ words
  - [ ] Margin vs leverage explanation
  - [ ] Risk management strategies
- [ ] **Route**: `/forex/margin` in App.tsx
- [ ] **Hub**: Listed on ForexToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG + CSV export
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: Margin calculation tests
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 4: Position Size Calculator (/forex/position-size)
**Status**: ❌ Not Started  
**Priority**: HIGH (risk management essential)

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/forex/PositionSizeCalculator.tsx`
  - [ ] Account balance input
  - [ ] Risk percentage slider (0.5% - 5%)
  - [ ] Stop-loss in pips
  - [ ] Currency pair selector
  - [ ] Optimal lot size display
  - [ ] Potential loss calculation
  - [ ] Risk reward visualization
- [ ] **Types**: `PositionSizeInput` & `PositionSizeResult` interfaces
- [ ] **Calculation**: Position size = (Account × Risk%) ÷ (Stop Loss × Pip Value)
- [ ] **AI Analysis**: 
  - [ ] Risk assessment
  - [ ] "What if" scenarios (increase risk by 1%)
  - [ ] Portfolio diversification tips
- [ ] **Blog Post**: "Position Sizing for Forex Traders"
  - [ ] 2000+ words
  - [ ] Risk management frameworks
  - [ ] Common mistakes
- [ ] **Route**: `/forex/position-size` in App.tsx
- [ ] **Hub**: Listed on ForexToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG + CSV export
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: Position size calculation tests
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 5: Profit/Loss Calculator (/forex/profit-loss)
**Status**: ❌ Not Started  
**Priority**: MEDIUM

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/forex/ProfitLossCalculator.tsx`
  - [ ] Currency pair selector
  - [ ] Lot size input
  - [ ] Entry price input
  - [ ] Exit price input
  - [ ] Direction selector (Long/Short)
  - [ ] P/L in pips display
  - [ ] P/L in account currency
  - [ ] Return % calculation
- [ ] **Types**: `ForexPLInput` & `ForexPLResult` interfaces
- [ ] **Calculation**: Accurate P/L for long and short positions
- [ ] **AI Analysis**: 
  - [ ] Trade performance summary
  - [ ] Return % vs benchmarks
  - [ ] Risk/reward ratio analysis
- [ ] **Blog Post**: "How to Calculate Forex Profit and Loss"
  - [ ] 2000+ words
  - [ ] Long vs short examples
  - [ ] Tax implications
- [ ] **Route**: `/forex/profit-loss` in App.tsx
- [ ] **Hub**: Listed on ForexToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG + CSV export
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: P/L calculation tests (long/short)
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

## 💹 PHASE 2: CRYPTO CALCULATORS (Priority Order)

### Calculator 6: Crypto Converter (/crypto/converter)
**Status**: ❌ Not Started  
**Priority**: HIGH (foundational)

**Acceptance Checklist**:
- [ ] **Backend Integration**: 
  - [ ] CoinGecko API integration (or alternative)
  - [ ] Backend service: `backend/crypto/convert.ts`
  - [ ] Caching layer (5-minute cache)
  - [ ] Rate limiting
- [ ] **Frontend Component**: `frontend/pages/calculators/crypto/CryptoConverter.tsx`
  - [ ] Crypto token selector (top 100 tokens)
  - [ ] Fiat currency selector
  - [ ] Amount input
  - [ ] Real-time conversion
  - [ ] 24h price change indicator
  - [ ] Market cap display
  - [ ] "Swap" button
- [ ] **Types**: `CryptoConversionInput` & `CryptoConversionResult`
- [ ] **AI Analysis**: 
  - [ ] Market trend summary ("BTC up 3% today")
  - [ ] Volatility warning
  - [ ] Best practices for timing
- [ ] **Blog Post**: "Live Crypto Converter 2025 (With Real-Time Rates)"
  - [ ] 2000+ words
  - [ ] How crypto pricing works
  - [ ] Exchanges vs converters
- [ ] **Route**: `/crypto/converter` in App.tsx
- [ ] **Hub Page**: Created `frontend/pages/hub/CryptoToolsPage.tsx`
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG + CSV export
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: Conversion logic + API mocking
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 7: Crypto Portfolio Calculator (/crypto/portfolio)
**Status**: ❌ Not Started  
**Priority**: HIGH (popular feature)

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/crypto/CryptoPortfolio.tsx`
  - [ ] Dynamic token list (add/remove rows)
  - [ ] Token selector per row
  - [ ] Quantity input per token
  - [ ] Total portfolio value (USD)
  - [ ] 24h change ($ and %)
  - [ ] Individual token breakdowns
  - [ ] Pie chart visualization
  - [ ] Allocation percentages
- [ ] **Types**: `PortfolioToken`, `PortfolioInput`, `PortfolioResult`
- [ ] **Backend**: Batch price fetching for multiple tokens
- [ ] **AI Analysis**: 
  - [ ] Diversification score
  - [ ] Over-concentration warnings
  - [ ] Rebalancing suggestions
- [ ] **Blog Post**: "How to Track Your Crypto Portfolio Value Accurately"
  - [ ] 2000+ words
  - [ ] Portfolio strategies
  - [ ] Rebalancing guides
- [ ] **Route**: `/crypto/portfolio` in App.tsx
- [ ] **Hub**: Listed on CryptoToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG (chart) + CSV (holdings)
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: Portfolio calculations
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 8: Crypto Profit/Loss Calculator (/crypto/profit-loss)
**Status**: ❌ Not Started  
**Priority**: MEDIUM

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/crypto/CryptoProfitLoss.tsx`
  - [ ] Token selector
  - [ ] Buy price input
  - [ ] Sell price input
  - [ ] Amount/quantity input
  - [ ] Trading fees input
  - [ ] Profit/loss in USD
  - [ ] ROI percentage
  - [ ] Annualized return
  - [ ] Tax estimate toggle
- [ ] **Types**: `CryptoPLInput` & `CryptoPLResult`
- [ ] **Calculations**: 
  - [ ] P/L = (sell - buy) × amount - fees
  - [ ] ROI% = P/L ÷ investment × 100
  - [ ] Annualized return (if holding period provided)
- [ ] **AI Analysis**: 
  - [ ] Performance vs BTC/ETH benchmarks
  - [ ] Holding period insights
  - [ ] Tax optimization tips
- [ ] **Blog Post**: "Crypto Profit Calculator – See Your ROI Instantly"
  - [ ] 2000+ words
  - [ ] Examples with popular tokens
  - [ ] Tax implications
- [ ] **Route**: `/crypto/profit-loss` in App.tsx
- [ ] **Hub**: Listed on CryptoToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG + CSV export
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: ROI calculation tests
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 9: Dollar-Cost Average (DCA) Calculator (/crypto/dca)
**Status**: ❌ Not Started  
**Priority**: HIGH (popular strategy)

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/crypto/DCACalculator.tsx`
  - [ ] Regular buy amount input
  - [ ] Frequency selector (daily, weekly, monthly)
  - [ ] Duration input (months)
  - [ ] Token selector
  - [ ] Historical price data integration
  - [ ] Total invested display
  - [ ] Average cost per token
  - [ ] Current value
  - [ ] P/L vs lump sum comparison
  - [ ] Chart: DCA vs Lump Sum over time
- [ ] **Types**: `DCAInput` & `DCAResult`
- [ ] **Backend**: Historical price data (CoinGecko historical API)
- [ ] **Calculations**: 
  - [ ] Simulate purchases over time
  - [ ] Calculate average entry price
  - [ ] Compare to lump sum strategy
- [ ] **AI Analysis**: 
  - [ ] "Your average entry is lower than X% of buyers"
  - [ ] DCA effectiveness analysis
  - [ ] Market timing insights
- [ ] **Blog Post**: "DCA Strategy Explained with Calculator"
  - [ ] 2000+ words
  - [ ] DCA vs lump sum debate
  - [ ] Historical backtests
- [ ] **Route**: `/crypto/dca` in App.tsx
- [ ] **Hub**: Listed on CryptoToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG (chart) + CSV (purchase history)
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: DCA simulation tests
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 10: Crypto Tax Calculator (/crypto/tax)
**Status**: ❌ Not Started  
**Priority**: MEDIUM

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/crypto/CryptoTaxCalculator.tsx`
  - [ ] Multiple trade inputs (buy/sell pairs)
  - [ ] Date range selector
  - [ ] Country selector (US, UK, Canada, Australia, India)
  - [ ] FIFO/LIFO method selector
  - [ ] Short-term gains display
  - [ ] Long-term gains display
  - [ ] Estimated tax owed
  - [ ] Tax rate breakdown
  - [ ] Deductions support
- [ ] **Types**: `CryptoTrade`, `TaxInput`, `TaxResult`
- [ ] **Calculations**: 
  - [ ] Capital gains (short/long term)
  - [ ] Tax brackets per country
  - [ ] FIFO/LIFO cost basis
- [ ] **AI Analysis**: 
  - [ ] Tax impact summary
  - [ ] Tax loss harvesting suggestions
  - [ ] Holding period optimization
- [ ] **Blog Post**: "Crypto Tax Calculator 2025 – Guide for Canada/US/UK"
  - [ ] 2000+ words
  - [ ] Country-specific guides
  - [ ] Tax reporting requirements
- [ ] **Route**: `/crypto/tax` in App.tsx
- [ ] **Hub**: Listed on CryptoToolsPage
- [ ] **Search**: Indexed in HomePage
- [ ] **Share/Download**: PNG + CSV (tax report)
- [ ] **AdSense**: 3 ad placements
- [ ] **SEO**: Full meta tags + schemas
- [ ] **Tests**: Tax calculation tests (multiple countries)
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

## 🪙 PHASE 3: ADVANCED CALCULATORS (Priority Order)

### Calculator 11: Staking APY Calculator (/crypto/staking)
**Status**: ❌ Not Started  
**Priority**: MEDIUM

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/crypto/StakingCalculator.tsx`
  - [ ] Token selector (stakeable tokens)
  - [ ] Staking amount input
  - [ ] APY/APR input
  - [ ] Duration input
  - [ ] Compounding frequency selector
  - [ ] Rewards over time chart
  - [ ] Total rewards display
  - [ ] Final balance
- [ ] **Types**: `StakingInput` & `StakingResult`
- [ ] **Calculations**: Compound interest with staking rewards
- [ ] **AI Analysis**: 
  - [ ] Compounding effect explanation
  - [ ] Risk warnings (lock-up periods)
  - [ ] APY comparison across platforms
- [ ] **Blog Post**: "Crypto Staking Calculator – Maximize Your Rewards"
- [ ] **Route**: `/crypto/staking` in App.tsx
- [ ] **Hub**: Listed on CryptoToolsPage
- [ ] **Search**: Indexed
- [ ] **Share/Download**: PNG + CSV
- [ ] **AdSense**: 3 placements
- [ ] **SEO**: Full tags + schemas
- [ ] **Tests**: Compound interest tests
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 12: NFT Profit Calculator (/crypto/nft-profit)
**Status**: ❌ Not Started  
**Priority**: LOW (niche audience)

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/crypto/NFTProfitCalculator.tsx`
  - [ ] Mint cost input
  - [ ] Sale price input
  - [ ] Gas fees input
  - [ ] Marketplace fees input (%, e.g., OpenSea 2.5%)
  - [ ] ROI calculation
  - [ ] Profit/loss display
  - [ ] Break-even price
- [ ] **Types**: `NFTProfitInput` & `NFTProfitResult`
- [ ] **Calculations**: Profit = sale price - (mint + gas + fees)
- [ ] **AI Analysis**: 
  - [ ] ROI vs trending collections
  - [ ] Market insights
  - [ ] Rarity considerations
- [ ] **Blog Post**: "NFT Profit Calculator – Calculate Your ROI"
- [ ] **Route**: `/crypto/nft-profit` in App.tsx
- [ ] **Hub**: Listed on CryptoToolsPage
- [ ] **Search**: Indexed
- [ ] **Share/Download**: PNG + CSV
- [ ] **AdSense**: 3 placements
- [ ] **SEO**: Full tags + schemas
- [ ] **Tests**: ROI calculations
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 13: Forex Risk/Reward Calculator (/forex/risk-reward)
**Status**: ❌ Not Started  
**Priority**: MEDIUM

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/forex/RiskRewardCalculator.tsx`
  - [ ] Entry price input
  - [ ] Stop-loss price input
  - [ ] Take-profit price input
  - [ ] Position size input
  - [ ] Risk/reward ratio display
  - [ ] Visual chart (entry, SL, TP)
  - [ ] Win rate needed to break even
- [ ] **Types**: `RiskRewardInput` & `RiskRewardResult`
- [ ] **Calculations**: 
  - [ ] Risk = entry - stop loss
  - [ ] Reward = take profit - entry
  - [ ] Ratio = reward ÷ risk
- [ ] **AI Analysis**: 
  - [ ] Trade quality assessment
  - [ ] Recommended minimum R:R ratio
  - [ ] Probability of success insights
- [ ] **Blog Post**: "Forex Risk/Reward Calculator Guide"
- [ ] **Route**: `/forex/risk-reward` in App.tsx
- [ ] **Hub**: Listed on ForexToolsPage
- [ ] **Search**: Indexed
- [ ] **Share/Download**: PNG + CSV
- [ ] **AdSense**: 3 placements
- [ ] **SEO**: Full tags + schemas
- [ ] **Tests**: Ratio calculations
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

### Calculator 14: Break-Even Calculator (/forex/break-even)
**Status**: ❌ Not Started  
**Priority**: LOW

**Acceptance Checklist**:
- [ ] **Frontend Component**: `frontend/pages/calculators/forex/BreakEvenCalculator.tsx`
  - [ ] Entry price input
  - [ ] Trading fees/spread input
  - [ ] Currency pair selector
  - [ ] Break-even price display
  - [ ] Pips to break-even
  - [ ] Visual price chart
- [ ] **Types**: `BreakEvenInput` & `BreakEvenResult`
- [ ] **Calculations**: Break-even = entry + (spread/fees in pips)
- [ ] **AI Analysis**: 
  - [ ] "Your break-even is X pips away"
  - [ ] Spread impact explanation
  - [ ] Broker comparison
- [ ] **Blog Post**: "Forex Break-Even Calculator"
- [ ] **Route**: `/forex/break-even` in App.tsx
- [ ] **Hub**: Listed on ForexToolsPage
- [ ] **Search**: Indexed
- [ ] **Share/Download**: PNG + CSV
- [ ] **AdSense**: 3 placements
- [ ] **SEO**: Full tags + schemas
- [ ] **Tests**: Break-even calculations
- [ ] **Build**: Verified

**Estimated Delivery**: 1 complete calculator when requested

---

## 🎯 IMPLEMENTATION ORDER (Recommended)

When you ask to resume, calculators will be delivered in this priority order:

### Highest Priority (Complete First)
1. **Forex Converter** (#1) - Uses existing exchange service
2. **Crypto Converter** (#6) - Foundational crypto tool
3. **Position Size Calculator** (#4) - Critical for traders
4. **Crypto Portfolio** (#7) - Popular feature

### High Priority
5. **DCA Calculator** (#9) - Trending strategy
6. **Pip Value Calculator** (#2) - Essential forex tool
7. **Crypto Profit/Loss** (#8) - Common use case

### Medium Priority
8. **Margin Calculator** (#3) - Important for leverage trading
9. **Forex P/L Calculator** (#5) - Trade analysis
10. **Crypto Tax Calculator** (#10) - Tax season demand
11. **Staking Calculator** (#11) - Growing interest
12. **Risk/Reward Calculator** (#13) - Risk management

### Lower Priority
13. **NFT Profit Calculator** (#12) - Niche audience
14. **Break-Even Calculator** (#14) - Nice to have

---

## 📦 DELIVERABLES PER CALCULATOR

When you request a calculator, you will receive:

### 1. Frontend Files
```
frontend/pages/calculators/forex/[CalculatorName].tsx (or /crypto/)
```

### 2. Backend Files (if needed)
```
backend/crypto/encore.service.ts
backend/crypto/[endpoint].ts
backend/crypto/types.ts
```

### 3. Blog Files
```
frontend/pages/blog/[calculator-slug].tsx
```

### 4. Hub Page Updates
```
frontend/pages/hub/ForexToolsPage.tsx (or CryptoToolsPage.tsx)
```

### 5. Route Updates
```
frontend/App.tsx (new route added)
```

### 6. Search Index Updates
```
frontend/pages/HomePage.tsx (calculator added to search)
```

### 7. Type Definitions
```
frontend/types/calculator.ts (new interfaces)
```

### 8. Test Files
```
frontend/pages/calculators/[category]/[CalculatorName].test.tsx
```

### 9. Documentation Updates
```
PROJECT_STATUS_SUMMARY.md (progress updated)
FOREX_CRYPTO_IMPLEMENTATION_PLAN.md (checklist marked)
```

---

## ✅ QUALITY GATES (Every Calculator Must Pass)

Before marking a calculator as complete:

1. **Build Check**: `npm run build` passes with 0 errors
2. **Type Safety**: All TypeScript types defined, no `any` types
3. **Validation**: Input validation with proper error messages
4. **AI Analysis**: `<AIAnalysis />` component renders correctly
5. **SEO**: Lighthouse SEO score ≥ 90
6. **Performance**: Lighthouse Performance ≥ 90 (mobile)
7. **Accessibility**: Lighthouse Accessibility ≥ 90
8. **Mobile**: Fully responsive on 320px - 1920px screens
9. **Blog**: 2000+ words, SEO optimized, FAQ included
10. **AdSense**: All 3 ad placements visible and non-intrusive
11. **Share/Download**: Both features functional
12. **Tests**: Unit tests pass for calculation logic
13. **Search**: Calculator appears in HomePage search results
14. **Hub**: Calculator listed on appropriate hub page

---

## 🔄 HOW TO REQUEST A CALCULATOR

### Simple Command
Just say: **"Resume and build calculator #1"** (or any number 1-14)

### What Happens Next
1. I'll create all files for that calculator
2. Update all routes and indexes
3. Write the 2000+ word blog post
4. Add AI analysis integration
5. Implement share/download features
6. Add AdSense placements
7. Write unit tests
8. Run build verification
9. Update this plan with ✅ checkmarks
10. Update PROJECT_STATUS_SUMMARY.md

### After Completion
- You can test the calculator at `/forex/[name]` or `/crypto/[name]`
- Blog accessible at `/blog/[slug]`
- Hub page shows the new calculator
- Search finds it on HomePage

---

## 📊 PROGRESS TRACKER

### Phase 1: Forex (0/5 Complete)
- [ ] #1 Forex Converter
- [ ] #2 Pip Value Calculator
- [ ] #3 Margin Calculator
- [ ] #4 Position Size Calculator
- [ ] #5 Forex P/L Calculator

### Phase 2: Crypto (0/5 Complete)
- [ ] #6 Crypto Converter
- [ ] #7 Crypto Portfolio
- [ ] #8 Crypto P/L Calculator
- [ ] #9 DCA Calculator
- [ ] #10 Crypto Tax Calculator

### Phase 3: Advanced (0/4 Complete)
- [ ] #11 Staking Calculator
- [ ] #12 NFT Profit Calculator
- [ ] #13 Risk/Reward Calculator
- [ ] #14 Break-Even Calculator

### Overall Progress
**0 / 14 Calculators Complete (0%)**

---

## 📝 NOTES

### API Requirements
- **CoinGecko API**: Free tier allows 10-50 calls/min (sufficient with caching)
- **Exchange Rates**: Already integrated via `backend/exchange/`
- **Caching**: 5-minute cache for crypto prices, 1-hour for forex

### Performance Targets
- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Bundle Size**: < 500KB per calculator page

### SEO Targets
- **Title**: 50-60 characters
- **Meta Description**: 150-160 characters
- **H1**: Single, keyword-rich
- **Internal Links**: Minimum 5 per blog post
- **Alt Tags**: All images must have descriptive alt text

---

**Ready to start? Just say:** "Resume and build calculator #1" (or your preferred number)
