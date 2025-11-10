// @ts-nocheck
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SEOHead } from './components/SEOHead';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAUpdateNotification } from './components/PWAUpdateNotification';
import { CookieConsent } from './components/CookieConsent';
import { LocaleProvider } from './contexts/LocaleContext';
import { AdminAuthProvider } from './contexts/AdminAuthContext';
import { UserContextProvider } from './contexts/UserContextProvider';
import { AdminRoute } from './components/AdminRoute';
import { ScrollToTop } from './components/ScrollToTop';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { setupGlobalMessageHandler } from './utils/messageHandler';
import { usePageTracking } from './hooks/usePageTracking';
import Loading from './components/system/Loading';

const queryClient = new QueryClient();

import './i18n';
import './styles/responsive.css';
import './styles/pwa.css';
import './styles/animations.css';

const DISABLE_LAZY = import.meta.env.VITE_DISABLE_LAZY === 'true';

const HomePage = DISABLE_LAZY ? require('./pages/HomePage').HomePage : lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const AboutPage = DISABLE_LAZY ? require('./pages/AboutPage').AboutPage : lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = DISABLE_LAZY ? require('./pages/ContactPage').ContactPage : lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPage = DISABLE_LAZY ? require('./pages/PrivacyPage').PrivacyPage : lazy(() => import('./pages/PrivacyPage').then(m => ({ default: m.PrivacyPage })));
const TermsPage = DISABLE_LAZY ? require('./pages/TermsPage').TermsPage : lazy(() => import('./pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ShareResultPage = DISABLE_LAZY ? require('./pages/ShareResultPage').default : lazy(() => import('./pages/ShareResultPage'));
const HistoryPage = DISABLE_LAZY ? require('./pages/HistoryPage').default : lazy(() => import('./pages/HistoryPage'));

const FinanceToolsPage = DISABLE_LAZY ? require('./pages/hub/FinanceToolsPage').FinanceToolsPage : lazy(() => import('./pages/hub/FinanceToolsPage').then(m => ({ default: m.FinanceToolsPage })));
const HealthToolsPage = DISABLE_LAZY ? require('./pages/hub/HealthToolsPage').HealthToolsPage : lazy(() => import('./pages/hub/HealthToolsPage').then(m => ({ default: m.HealthToolsPage })));
const MathToolsPage = DISABLE_LAZY ? require('./pages/hub/MathToolsPage').MathToolsPage : lazy(() => import('./pages/hub/MathToolsPage').then(m => ({ default: m.MathToolsPage })));
const UtilityToolsPage = DISABLE_LAZY ? require('./pages/hub/UtilityToolsPage').UtilityToolsPage : lazy(() => import('./pages/hub/UtilityToolsPage').then(m => ({ default: m.UtilityToolsPage })));
const USToolsPage = DISABLE_LAZY ? require('./pages/hub/USToolsPage').USToolsPage : lazy(() => import('./pages/hub/USToolsPage').then(m => ({ default: m.USToolsPage })));
const UKToolsPage = DISABLE_LAZY ? require('./pages/hub/UKToolsPage').default : lazy(() => import('./pages/hub/UKToolsPage'));
const IndiaToolsPage = DISABLE_LAZY ? require('./pages/hub/IndiaToolsPage').default : lazy(() => import('./pages/hub/IndiaToolsPage'));
const AustraliaToolsPage = DISABLE_LAZY ? require('./pages/hub/AustraliaToolsPage').default : lazy(() => import('./pages/hub/AustraliaToolsPage'));
const InsuranceToolsPage = DISABLE_LAZY ? require('./pages/hub/InsuranceToolsPage').default : lazy(() => import('./pages/hub/InsuranceToolsPage'));

const BMICalculator = DISABLE_LAZY ? require('./pages/calculators/health/BMICalculator').BMICalculator : lazy(() => import('./pages/calculators/health/BMICalculator').then(m => ({ default: m.BMICalculator })));
const WeightLossStepCalculator = DISABLE_LAZY ? require('./pages/calculators/health/WeightLossStepCalculator').default : lazy(() => import('./pages/calculators/health/WeightLossStepCalculator'));
const WaistToHipRatioCalculator = DISABLE_LAZY ? require('./pages/calculators/health/WaistToHipRatioCalculator').default : lazy(() => import('./pages/calculators/health/WaistToHipRatioCalculator'));
const BodyFatCalculator = DISABLE_LAZY ? require('./pages/calculators/health/BodyFatCalculator').default : lazy(() => import('./pages/calculators/health/BodyFatCalculator'));
const BMRCalculator = DISABLE_LAZY ? require('./pages/calculators/health/BMRCalculator').default : lazy(() => import('./pages/calculators/health/BMRCalculator'));
const IdealWeightCalculator = DISABLE_LAZY ? require('./pages/calculators/health/IdealWeightCalculator').default : lazy(() => import('./pages/calculators/health/IdealWeightCalculator'));
const WaterIntakeCalculator = DISABLE_LAZY ? require('./pages/calculators/health/WaterIntakeCalculator').default : lazy(() => import('./pages/calculators/health/WaterIntakeCalculator'));
const SleepCalculator = DISABLE_LAZY ? require('./pages/calculators/health/SleepCalculator').default : lazy(() => import('./pages/calculators/health/SleepCalculator'));
const HeartRateZoneCalculator = DISABLE_LAZY ? require('./pages/calculators/health/HeartRateZoneCalculator').default : lazy(() => import('./pages/calculators/health/HeartRateZoneCalculator'));
const PregnancyDueDateCalculator = DISABLE_LAZY ? require('./pages/calculators/health/PregnancyDueDateCalculator').default : lazy(() => import('./pages/calculators/health/PregnancyDueDateCalculator'));
const OvulationCalculator = DISABLE_LAZY ? require('./pages/calculators/health/OvulationCalculator').default : lazy(() => import('./pages/calculators/health/OvulationCalculator'));
const MortgageCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/MortgageCalculatorUS').MortgageCalculatorUS : lazy(() => import('./pages/calculators/us/MortgageCalculatorUS').then(m => ({ default: m.MortgageCalculatorUS })));
const LoanCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/LoanCalculatorUS').LoanCalculatorUS : lazy(() => import('./pages/calculators/us/LoanCalculatorUS').then(m => ({ default: m.LoanCalculatorUS })));
const InvestmentCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/InvestmentCalculator').InvestmentCalculator : lazy(() => import('./pages/calculators/financial/InvestmentCalculator').then(m => ({ default: m.InvestmentCalculator })));
const PercentageCalculator = DISABLE_LAZY ? require('./pages/calculators/math/PercentageCalculator').PercentageCalculator : lazy(() => import('./pages/calculators/math/PercentageCalculator').then(m => ({ default: m.PercentageCalculator })));
const TipCalculator = DISABLE_LAZY ? require('./pages/calculators/utility/TipCalculator').TipCalculator : lazy(() => import('./pages/calculators/utility/TipCalculator').then(m => ({ default: m.TipCalculator })));
const CurrencyConverter = DISABLE_LAZY ? require('./pages/calculators/utility/CurrencyConverter').CurrencyConverter : lazy(() => import('./pages/calculators/utility/CurrencyConverter').then(m => ({ default: m.CurrencyConverter })));
const DiscountCalculator = DISABLE_LAZY ? require('./pages/calculators/utility/DiscountCalculator').DiscountCalculator : lazy(() => import('./pages/calculators/utility/DiscountCalculator').then(m => ({ default: m.DiscountCalculator })));
const DateCalculator = DISABLE_LAZY ? require('./pages/calculators/utility/DateCalculator').DateCalculator : lazy(() => import('./pages/calculators/utility/DateCalculator').then(m => ({ default: m.DateCalculator })));
const PasswordGenerator = DISABLE_LAZY ? require('./pages/calculators/utility/PasswordGenerator').PasswordGenerator : lazy(() => import('./pages/calculators/utility/PasswordGenerator').then(m => ({ default: m.PasswordGenerator })));
const SimpleInterestCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/SimpleInterestCalculator').default : lazy(() => import('./pages/calculators/financial/SimpleInterestCalculator'));
const CompoundInterestCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/CompoundInterestCalculator').default : lazy(() => import('./pages/calculators/financial/CompoundInterestCalculator'));
const AgeCalculator = DISABLE_LAZY ? require('./pages/calculators/math/AgeCalculator').AgeCalculator : lazy(() => import('./pages/calculators/math/AgeCalculator').then(m => ({ default: m.AgeCalculator })));
const UnitConverter = DISABLE_LAZY ? require('./pages/calculators/math/UnitConverter').UnitConverter : lazy(() => import('./pages/calculators/math/UnitConverter').then(m => ({ default: m.UnitConverter })));
const ScientificCalculator = DISABLE_LAZY ? require('./pages/calculators/math/ScientificCalculator').default : lazy(() => import('./pages/calculators/math/ScientificCalculator'));
const FractionCalculator = DISABLE_LAZY ? require('./pages/calculators/math/FractionCalculator').default : lazy(() => import('./pages/calculators/math/FractionCalculator'));
const StatisticsCalculator = DISABLE_LAZY ? require('./pages/calculators/math/StatisticsCalculator').default : lazy(() => import('./pages/calculators/math/StatisticsCalculator'));
const ROICalculator = DISABLE_LAZY ? require('./pages/calculators/financial/ROICalculator').ROICalculator : lazy(() => import('./pages/calculators/financial/ROICalculator').then(m => ({ default: m.ROICalculator })));
const RetirementCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/RetirementCalculator').default : lazy(() => import('./pages/calculators/financial/RetirementCalculator'));
const CreditCardPayoffCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/CreditCardPayoffCalculator').default : lazy(() => import('./pages/calculators/financial/CreditCardPayoffCalculator'));
const EmergencyFundCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/EmergencyFundCalculator').default : lazy(() => import('./pages/calculators/financial/EmergencyFundCalculator'));
const ProfitMarginCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/ProfitMarginCalculator').ProfitMarginCalculator : lazy(() => import('./pages/calculators/financial/ProfitMarginCalculator').then(m => ({ default: m.ProfitMarginCalculator })));
const PaycheckCalculator = DISABLE_LAZY ? require('./pages/calculators/financial/PaycheckCalculator').PaycheckCalculator : lazy(() => import('./pages/calculators/financial/PaycheckCalculator').then(m => ({ default: m.PaycheckCalculator })));
const SalaryCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/SalaryCalculatorUS').SalaryCalculatorUS : lazy(() => import('./pages/calculators/us/SalaryCalculatorUS').then(m => ({ default: m.SalaryCalculatorUS })));

const FederalTaxCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/FederalTaxCalculatorUS').FederalTaxCalculatorUS : lazy(() => import('./pages/calculators/us/FederalTaxCalculatorUS').then(m => ({ default: m.FederalTaxCalculatorUS })));
const LoanAffordabilityCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/LoanAffordabilityCalculatorUS').LoanAffordabilityCalculatorUS : lazy(() => import('./pages/calculators/us/LoanAffordabilityCalculatorUS').then(m => ({ default: m.LoanAffordabilityCalculatorUS })));
const RetirementCalculator401k = DISABLE_LAZY ? require('./pages/calculators/us/RetirementCalculator401k').RetirementCalculator401k : lazy(() => import('./pages/calculators/us/RetirementCalculator401k').then(m => ({ default: m.RetirementCalculator401k })));
const StateTaxCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/StateTaxCalculatorUS').StateTaxCalculatorUS : lazy(() => import('./pages/calculators/us/StateTaxCalculatorUS').then(m => ({ default: m.StateTaxCalculatorUS })));
const StudentLoanCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/StudentLoanCalculatorUS').StudentLoanCalculatorUS : lazy(() => import('./pages/calculators/us/StudentLoanCalculatorUS').then(m => ({ default: m.StudentLoanCalculatorUS })));
const AutoLoanCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/AutoLoanCalculatorUS').AutoLoanCalculatorUS : lazy(() => import('./pages/calculators/us/AutoLoanCalculatorUS').then(m => ({ default: m.AutoLoanCalculatorUS })));
const HELOCCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/HELOCCalculatorUS').HELOCCalculatorUS : lazy(() => import('./pages/calculators/us/HELOCCalculatorUS').then(m => ({ default: m.HELOCCalculatorUS })));
const BusinessLoanCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/BusinessLoanCalculatorUS').BusinessLoanCalculatorUS : lazy(() => import('./pages/calculators/us/BusinessLoanCalculatorUS').then(m => ({ default: m.BusinessLoanCalculatorUS })));
const DebtConsolidationCalculatorUS = DISABLE_LAZY ? require('./pages/calculators/us/DebtConsolidationCalculatorUS').DebtConsolidationCalculatorUS : lazy(() => import('./pages/calculators/us/DebtConsolidationCalculatorUS').then(m => ({ default: m.DebtConsolidationCalculatorUS })));

const StampDutyCalculatorUK = DISABLE_LAZY ? require('./pages/calculators/uk/StampDutyCalculatorUK').default : lazy(() => import('./pages/calculators/uk/StampDutyCalculatorUK'));
const ISACalculatorUK = DISABLE_LAZY ? require('./pages/calculators/uk/ISACalculatorUK').default : lazy(() => import('./pages/calculators/uk/ISACalculatorUK'));
const NationalInsuranceCalculatorUK = DISABLE_LAZY ? require('./pages/calculators/uk/NationalInsuranceCalculatorUK').default : lazy(() => import('./pages/calculators/uk/NationalInsuranceCalculatorUK'));
const PensionCalculatorUK = DISABLE_LAZY ? require('./pages/calculators/uk/PensionCalculatorUK').default : lazy(() => import('./pages/calculators/uk/PensionCalculatorUK'));
const BTLMortgageCalculatorUK = DISABLE_LAZY ? require('./pages/calculators/uk/BTLMortgageCalculatorUK').default : lazy(() => import('./pages/calculators/uk/BTLMortgageCalculatorUK'));

const EMICalculatorIndia = DISABLE_LAZY ? require('./pages/calculators/india/EMICalculatorIndia').default : lazy(() => import('./pages/calculators/india/EMICalculatorIndia'));
const EPFCalculatorIndia = DISABLE_LAZY ? require('./pages/calculators/india/EPFCalculatorIndia').default : lazy(() => import('./pages/calculators/india/EPFCalculatorIndia'));
const SIPCalculatorIndia = DISABLE_LAZY ? require('./pages/calculators/india/SIPCalculatorIndia').default : lazy(() => import('./pages/calculators/india/SIPCalculatorIndia'));
const IncomeTaxCalculatorIndia = DISABLE_LAZY ? require('./pages/calculators/india/IncomeTaxCalculatorIndia').default : lazy(() => import('./pages/calculators/india/IncomeTaxCalculatorIndia'));
const PPFCalculatorIndia = DISABLE_LAZY ? require('./pages/calculators/india/PPFCalculatorIndia').default : lazy(() => import('./pages/calculators/india/PPFCalculatorIndia'));
const HomeLoanCalculatorIndia = DISABLE_LAZY ? require('./pages/calculators/india/HomeLoanCalculatorIndia').default : lazy(() => import('./pages/calculators/india/HomeLoanCalculatorIndia'));
const GSTCalculatorIndia = DISABLE_LAZY ? require('./pages/calculators/india/GSTCalculatorIndia').default : lazy(() => import('./pages/calculators/india/GSTCalculatorIndia'));

const SuperannuationCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/SuperannuationCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/SuperannuationCalculatorAustralia'));
const PropertyTaxCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/PropertyTaxCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/PropertyTaxCalculatorAustralia'));
const CGTCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/CGTCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/CGTCalculatorAustralia'));
const FBTCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/FBTCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/FBTCalculatorAustralia'));
const NegativeGearingCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/NegativeGearingCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/NegativeGearingCalculatorAustralia'));
const FirstHomeBuyerCalculatorNSW = DISABLE_LAZY ? require('./pages/calculators/australia/FirstHomeBuyerCalculatorNSW').default : lazy(() => import('./pages/calculators/australia/FirstHomeBuyerCalculatorNSW'));
const ComprehensiveTaxCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/ComprehensiveTaxCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/ComprehensiveTaxCalculatorAustralia'));
const PayCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/PayCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/PayCalculatorAustralia'));
const BonusTaxCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/BonusTaxCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/BonusTaxCalculatorAustralia'));
const UnusedLeaveCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/UnusedLeaveCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/UnusedLeaveCalculatorAustralia'));
const StudentLoanCalculatorAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/StudentLoanCalculatorAustralia').default : lazy(() => import('./pages/calculators/australia/StudentLoanCalculatorAustralia'));
const TaxDistributionAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/TaxDistributionAustralia').default : lazy(() => import('./pages/calculators/australia/TaxDistributionAustralia'));
const TaxInfoAustralia = DISABLE_LAZY ? require('./pages/calculators/australia/TaxInfoAustralia').default : lazy(() => import('./pages/calculators/australia/TaxInfoAustralia'));
const AUPayTaxHub = DISABLE_LAZY ? require('./pages/hub/AUPayTaxHub').default : lazy(() => import('./pages/hub/AUPayTaxHub'));

const LifeInsuranceCalculator = DISABLE_LAZY ? require('./pages/calculators/insurance/LifeInsuranceCalculator').default : lazy(() => import('./pages/calculators/insurance/LifeInsuranceCalculator'));
const HealthInsuranceCalculator = DISABLE_LAZY ? require('./pages/calculators/insurance/HealthInsuranceCalculator').default : lazy(() => import('./pages/calculators/insurance/HealthInsuranceCalculator'));
const TravelInsuranceCalculator = DISABLE_LAZY ? require('./pages/calculators/insurance/TravelInsuranceCalculator').default : lazy(() => import('./pages/calculators/insurance/TravelInsuranceCalculator'));
const PetInsuranceCalculator = DISABLE_LAZY ? require('./pages/calculators/insurance/PetInsuranceCalculator').default : lazy(() => import('./pages/calculators/insurance/PetInsuranceCalculator'));
const BusinessLiabilityCalculator = DISABLE_LAZY ? require('./pages/calculators/insurance/BusinessLiabilityCalculator').default : lazy(() => import('./pages/calculators/insurance/BusinessLiabilityCalculator'));
const LegalSettlementEstimator = DISABLE_LAZY ? require('./pages/calculators/insurance/LegalSettlementEstimator').default : lazy(() => import('./pages/calculators/insurance/LegalSettlementEstimator'));
const SolarSavingsCalculator = DISABLE_LAZY ? require('./pages/calculators/insurance/SolarSavingsCalculator').default : lazy(() => import('./pages/calculators/insurance/SolarSavingsCalculator'));
const CarInsurancePremiumEstimator = DISABLE_LAZY ? require('./pages/calculators/insurance/CarInsurancePremiumEstimator').default : lazy(() => import('./pages/calculators/insurance/CarInsurancePremiumEstimator'));

const LoveCompatibilityCalculator = DISABLE_LAZY ? require('./pages/calculators/viral/LoveCompatibilityCalculator').default : lazy(() => import('./pages/calculators/viral/LoveCompatibilityCalculator'));
const ZodiacCompatibilityCalculator = DISABLE_LAZY ? require('./pages/calculators/viral/ZodiacCompatibilityCalculator').default : lazy(() => import('./pages/calculators/viral/ZodiacCompatibilityCalculator'));
const HowLongToWatchCalculator = DISABLE_LAZY ? require('./pages/calculators/viral/HowLongToWatchCalculator').default : lazy(() => import('./pages/calculators/viral/HowLongToWatchCalculator'));
const LifePathNumberCalculator = DISABLE_LAZY ? require('./pages/calculators/viral/LifePathNumberCalculator').default : lazy(() => import('./pages/calculators/viral/LifePathNumberCalculator'));
const FriendCompatibilityCalculator = DISABLE_LAZY ? require('./pages/calculators/viral/FriendCompatibilityCalculator').default : lazy(() => import('./pages/calculators/viral/FriendCompatibilityCalculator'));
const CalorieBurnCalculator = DISABLE_LAZY ? require('./pages/calculators/viral/CalorieBurnCalculator').default : lazy(() => import('./pages/calculators/viral/CalorieBurnCalculator'));
const LifeExpectancyCalculator = DISABLE_LAZY ? require('./pages/calculators/viral/LifeExpectancyCalculator').default : lazy(() => import('./pages/calculators/viral/LifeExpectancyCalculator'));
const ViralToolsPage = DISABLE_LAZY ? require('./pages/hub/ViralToolsPage').default : lazy(() => import('./pages/hub/ViralToolsPage'));
const FinderPage = DISABLE_LAZY ? require('./pages/hub/FinderPage').default : lazy(() => import('./pages/hub/FinderPage'));

const RelationshipsPage = DISABLE_LAZY ? require('./pages/ai/RelationshipsPage').default : lazy(() => import('./pages/ai/RelationshipsPage'));
const WellnessPage = DISABLE_LAZY ? require('./pages/ai/WellnessPage').default : lazy(() => import('./pages/ai/WellnessPage'));
const ParentingPage = DISABLE_LAZY ? require('./pages/ai/ParentingPage').default : lazy(() => import('./pages/ai/ParentingPage'));
const ShoppingPage = DISABLE_LAZY ? require('./pages/ai/ShoppingPage').default : lazy(() => import('./pages/ai/ShoppingPage'));
const SocialPage = DISABLE_LAZY ? require('./pages/ai/SocialPage').default : lazy(() => import('./pages/ai/SocialPage'));

const AICompatibilityCalculator = DISABLE_LAZY ? require('./pages/ai/tools/AICompatibilityCalculator').default : lazy(() => import('./pages/ai/tools/AICompatibilityCalculator'));
const PickupLineGenerator = DISABLE_LAZY ? require('./pages/ai/tools/PickupLineGenerator').default : lazy(() => import('./pages/ai/tools/PickupLineGenerator'));
const HashtagGenerator = DISABLE_LAZY ? require('./pages/ai/tools/HashtagGenerator').default : lazy(() => import('./pages/ai/tools/HashtagGenerator'));
const ProfileAnalyzer = DISABLE_LAZY ? require('./pages/ai/tools/ProfileAnalyzer').default : lazy(() => import('./pages/ai/tools/ProfileAnalyzer'));
const InstagramBioAnalyzer = DISABLE_LAZY ? require('./pages/ai/tools/InstagramBioAnalyzer').default : lazy(() => import('./pages/ai/tools/InstagramBioAnalyzer'));
const TikTokProfileScore = DISABLE_LAZY ? require('./pages/ai/tools/TikTokProfileScore').default : lazy(() => import('./pages/ai/tools/TikTokProfileScore'));
const CaptionGenerator = DISABLE_LAZY ? require('./pages/ai/tools/CaptionGenerator').default : lazy(() => import('./pages/ai/tools/CaptionGenerator'));
const AudienceAnalyzer = DISABLE_LAZY ? require('./pages/ai/tools/AudienceAnalyzer').default : lazy(() => import('./pages/ai/tools/AudienceAnalyzer'));
const AITextDetector = DISABLE_LAZY ? require('./pages/ai/tools/AITextDetector').default : lazy(() => import('./pages/ai/tools/AITextDetector'));

const MoodJournal = DISABLE_LAZY ? require('./pages/ai/tools/MoodJournal').default : lazy(() => import('./pages/ai/tools/MoodJournal'));
const BabyNameGenerator = DISABLE_LAZY ? require('./pages/ai/tools/BabyNameGenerator').default : lazy(() => import('./pages/ai/tools/BabyNameGenerator'));
const GiftRecommender = DISABLE_LAZY ? require('./pages/ai/tools/GiftRecommender').default : lazy(() => import('./pages/ai/tools/GiftRecommender'));

const BlogListPage = DISABLE_LAZY ? require('./pages/blog/BlogListPage').BlogListPage : lazy(() => import('./pages/blog/BlogListPage').then(m => ({ default: m.BlogListPage })));
const BlogPostPage = DISABLE_LAZY ? require('./pages/blog/BlogPostPage').default : lazy(() => import('./pages/blog/BlogPostPage'));
const BlogListPageV2 = DISABLE_LAZY ? require('./pages/blog/BlogListPageV2').default : lazy(() => import('./pages/blog/BlogListPageV2'));
const BlogPostPageV2 = DISABLE_LAZY ? require('./pages/blog/BlogPostPageV2').default : lazy(() => import('./pages/blog/BlogPostPageV2'));
const AdminDashboard = DISABLE_LAZY ? require('./pages/admin/AdminDashboard').default : lazy(() => import('./pages/admin/AdminDashboard'));
const BlogEditor = DISABLE_LAZY ? require('./pages/admin/BlogEditor').default : lazy(() => import('./pages/admin/BlogEditor'));
const BlogManagement = DISABLE_LAZY ? require('./pages/admin/BlogManagement').default : lazy(() => import('./pages/admin/BlogManagement'));
const BlogManagementV2 = DISABLE_LAZY ? require('./pages/admin/BlogManagementV2').default : lazy(() => import('./pages/admin/BlogManagementV2'));
const LogsViewer = DISABLE_LAZY ? require('./pages/admin/LogsViewer').LogsViewer : lazy(() => import('./pages/admin/LogsViewer').then(m => ({ default: m.LogsViewer })));
const IndexingTest = DISABLE_LAZY ? require('./pages/admin/IndexingTest').default : lazy(() => import('./pages/admin/IndexingTest'));
const EzoicAdsManager = DISABLE_LAZY ? require('./pages/admin/EzoicAdsManager').default : lazy(() => import('./pages/admin/EzoicAdsManager'));
const PWAAnalytics = DISABLE_LAZY ? require('./pages/admin/PWAAnalytics').default : lazy(() => import('./pages/admin/PWAAnalytics'));
const TestLogsPage = DISABLE_LAZY ? require('./pages/TestLogsPage').TestLogsPage : lazy(() => import('./pages/TestLogsPage').then(m => ({ default: m.TestLogsPage })));

const I18nDemoPage = DISABLE_LAZY ? require('./pages/I18nDemoPage').I18nDemoPage : lazy(() => import('./pages/I18nDemoPage').then(m => ({ default: m.I18nDemoPage })));
const KnowMyIPPage = DISABLE_LAZY ? require('./pages/KnowMyIPPage').default : lazy(() => import('./pages/KnowMyIPPage'));

const ToolsHubPage = DISABLE_LAZY ? require('./pages/ToolsHubPage').default : lazy(() => import('./pages/ToolsHubPage'));
const InternetSpeedTest = DISABLE_LAZY ? require('./pages/tools/InternetSpeedTest').default : lazy(() => import('./pages/tools/InternetSpeedTest'));
const IPReputationCheck = DISABLE_LAZY ? require('./pages/tools/IPReputationCheck').default : lazy(() => import('./pages/tools/IPReputationCheck'));
const SSLDomainChecker = DISABLE_LAZY ? require('./pages/tools/SSLDomainChecker').default : lazy(() => import('./pages/tools/SSLDomainChecker'));
const DNSPingTest = DISABLE_LAZY ? require('./pages/tools/DNSPingTest').default : lazy(() => import('./pages/tools/DNSPingTest'));
const BrowserDeviceInfo = DISABLE_LAZY ? require('./pages/tools/BrowserDeviceInfo').default : lazy(() => import('./pages/tools/BrowserDeviceInfo'));
const ImageCompressor = DISABLE_LAZY ? require('./pages/tools/ImageCompressor').default : lazy(() => import('./pages/tools/ImageCompressor'));
const PlantFinder = DISABLE_LAZY ? require('./pages/tools/PlantFinder').default : lazy(() => import('./pages/tools/PlantFinder'));
const PetBreedFinder = DISABLE_LAZY ? require('./pages/finder/tools/PetBreedFinder').default : lazy(() => import('./pages/finder/tools/PetBreedFinder'));
const HomeDecorStyleFinder = DISABLE_LAZY ? require('./pages/finder/tools/HomeDecorStyleFinder').default : lazy(() => import('./pages/finder/tools/HomeDecorStyleFinder'));
const SmartShortener = DISABLE_LAZY ? require('./pages/tools/SmartShortener').default : lazy(() => import('./pages/tools/SmartShortener'));
const ShortUrlRedirect = DISABLE_LAZY ? require('./pages/ShortUrlRedirect').default : lazy(() => import('./pages/ShortUrlRedirect'));

const SmartTimerHub = DISABLE_LAZY ? require('./pages/smarttimer/SmartTimerHub').default : lazy(() => import('./pages/smarttimer/SmartTimerHub'));
const StopwatchPage = DISABLE_LAZY ? require('./pages/smarttimer/StopwatchPage').default : lazy(() => import('./pages/smarttimer/StopwatchPage'));
const CountdownPage = DISABLE_LAZY ? require('./pages/smarttimer/CountdownPage').default : lazy(() => import('./pages/smarttimer/CountdownPage'));
const PomodoroPage = DISABLE_LAZY ? require('./pages/smarttimer/PomodoroPage').default : lazy(() => import('./pages/smarttimer/PomodoroPage'));
const MultiTimerPage = DISABLE_LAZY ? require('./pages/smarttimer/MultiTimerPage').default : lazy(() => import('./pages/smarttimer/MultiTimerPage'));
const EventCountdownPage = DISABLE_LAZY ? require('./pages/smarttimer/EventCountdownPage').default : lazy(() => import('./pages/smarttimer/EventCountdownPage'));

const AppContent = () => {
  usePageTracking();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnalyticsTracker />
      <SEOHead />
      <OfflineIndicator />
      <ErrorBoundary>
        <Navigation />
      </ErrorBoundary>
      <main className="flex-1 bg-background relative">
        <ErrorBoundary fallback={<div style={{padding: '20px', textAlign: 'center'}}>Failed to load page. <a href="/">Go home</a></div>}>
          <ScrollToTop>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/history" element={<HistoryPage />} />

                <Route path="/finance/tools" element={<FinanceToolsPage />} />
                <Route path="/health/tools" element={<HealthToolsPage />} />
                <Route path="/math/tools" element={<MathToolsPage />} />
                <Route path="/utility/tools" element={<UtilityToolsPage />} />
                <Route path="/us/tools" element={<USToolsPage />} />
                <Route path="/uk/tools" element={<UKToolsPage />} />
                <Route path="/india/tools" element={<IndiaToolsPage />} />
                <Route path="/australia/tools" element={<AustraliaToolsPage />} />
                <Route path="/insurance/tools" element={<InsuranceToolsPage />} />
                <Route path="/viral/tools" element={<ViralToolsPage />} />
                <Route path="/finder/tools" element={<FinderPage />} />

                <Route path="/calculator/bmi" element={<BMICalculator />} />
                <Route path="/calculator/weight-loss-steps" element={<WeightLossStepCalculator />} />
                <Route path="/calculator/waist-to-hip-ratio" element={<WaistToHipRatioCalculator />} />
                
                <Route path="/calculators/health/body-fat" element={<BodyFatCalculator />} />
                <Route path="/calculators/health/bmr" element={<BMRCalculator />} />
                <Route path="/calculators/health/ideal-weight" element={<IdealWeightCalculator />} />
                <Route path="/calculators/health/water-intake" element={<WaterIntakeCalculator />} />
                <Route path="/calculators/health/sleep" element={<SleepCalculator />} />
                <Route path="/calculators/health/heart-rate-zone" element={<HeartRateZoneCalculator />} />
                <Route path="/calculators/health/pregnancy-due-date" element={<PregnancyDueDateCalculator />} />
                <Route path="/calculators/health/ovulation" element={<OvulationCalculator />} />
                
                <Route path="/calculator/mortgage" element={<MortgageCalculatorUS />} />
                <Route path="/calculator/loan" element={<LoanCalculatorUS />} />
                <Route path="/calculator/investment" element={<InvestmentCalculator />} />
                <Route path="/calculator/percentage" element={<PercentageCalculator />} />
                <Route path="/calculator/scientific" element={<ScientificCalculator />} />
                <Route path="/calculator/fraction" element={<FractionCalculator />} />
                <Route path="/calculator/statistics" element={<StatisticsCalculator />} />
                <Route path="/calculator/tip" element={<TipCalculator />} />
                <Route path="/calculator/currency-converter" element={<CurrencyConverter />} />
                <Route path="/calculator/discount" element={<DiscountCalculator />} />
                <Route path="/calculator/date" element={<DateCalculator />} />
                <Route path="/calculator/password-generator" element={<PasswordGenerator />} />
                <Route path="/calculator/simple-interest" element={<SimpleInterestCalculator />} />
                <Route path="/calculator/compound-interest" element={<CompoundInterestCalculator />} />
                <Route path="/calculator/age" element={<AgeCalculator />} />
                <Route path="/calculator/unit-converter" element={<UnitConverter />} />
                <Route path="/calculator/roi" element={<ROICalculator />} />
                <Route path="/calculator/retirement" element={<RetirementCalculator />} />
                <Route path="/calculator/credit-card-payoff" element={<CreditCardPayoffCalculator />} />
                <Route path="/calculator/emergency-fund" element={<EmergencyFundCalculator />} />
                <Route path="/calculator/profit-margin" element={<ProfitMarginCalculator />} />
                <Route path="/calculator/paycheck" element={<PaycheckCalculator />} />
                <Route path="/calculator/salary" element={<SalaryCalculatorUS />} />
                
                <Route path="/calculator/federal-tax" element={<FederalTaxCalculatorUS />} />
                <Route path="/calculator/loan-affordability" element={<LoanAffordabilityCalculatorUS />} />
                <Route path="/calculator/401k-retirement" element={<RetirementCalculator401k />} />
                <Route path="/calculator/state-tax" element={<StateTaxCalculatorUS />} />
                <Route path="/calculator/student-loan" element={<StudentLoanCalculatorUS />} />
                <Route path="/calculator/auto-loan" element={<AutoLoanCalculatorUS />} />
                <Route path="/calculator/heloc" element={<HELOCCalculatorUS />} />
                <Route path="/calculator/business-loan" element={<BusinessLoanCalculatorUS />} />
                <Route path="/calculator/debt-consolidation" element={<DebtConsolidationCalculatorUS />} />

                <Route path="/calculators/uk/stamp-duty" element={<StampDutyCalculatorUK />} />
                <Route path="/calculators/uk/isa" element={<ISACalculatorUK />} />
                <Route path="/calculators/uk/national-insurance" element={<NationalInsuranceCalculatorUK />} />
                <Route path="/calculators/uk/pension" element={<PensionCalculatorUK />} />
                <Route path="/calculators/uk/btl-mortgage" element={<BTLMortgageCalculatorUK />} />

                <Route path="/calculators/india/emi" element={<EMICalculatorIndia />} />
                <Route path="/calculators/india/epf" element={<EPFCalculatorIndia />} />
                <Route path="/calculators/india/sip" element={<SIPCalculatorIndia />} />
                <Route path="/calculators/india/income-tax" element={<IncomeTaxCalculatorIndia />} />
                <Route path="/calculators/india/ppf" element={<PPFCalculatorIndia />} />
                <Route path="/calculators/india/home-loan" element={<HomeLoanCalculatorIndia />} />
                <Route path="/calculators/india/gst" element={<GSTCalculatorIndia />} />

                <Route path="/au" element={<AUPayTaxHub />} />
                <Route path="/au/pay-calculator" element={<PayCalculatorAustralia />} />
                <Route path="/au/bonus-tax" element={<BonusTaxCalculatorAustralia />} />
                <Route path="/au/unused-leave" element={<UnusedLeaveCalculatorAustralia />} />
                <Route path="/au/student-loan" element={<StudentLoanCalculatorAustralia />} />
                <Route path="/au/tax-distribution" element={<TaxDistributionAustralia />} />
                <Route path="/au/tax-info" element={<TaxInfoAustralia />} />
                <Route path="/calculators/australia/income-tax" element={<ComprehensiveTaxCalculatorAustralia />} />
                <Route path="/calculators/australia/first-home-buyer-nsw" element={<FirstHomeBuyerCalculatorNSW />} />
                <Route path="/calculators/australia/superannuation" element={<SuperannuationCalculatorAustralia />} />
                <Route path="/calculators/australia/property-tax" element={<PropertyTaxCalculatorAustralia />} />
                <Route path="/calculators/australia/cgt" element={<CGTCalculatorAustralia />} />
                <Route path="/calculators/australia/fbt" element={<FBTCalculatorAustralia />} />
                <Route path="/calculators/australia/negative-gearing" element={<NegativeGearingCalculatorAustralia />} />

                <Route path="/calculators/insurance/life-insurance" element={<LifeInsuranceCalculator />} />
                <Route path="/calculators/insurance/health-insurance" element={<HealthInsuranceCalculator />} />

                <Route path="/calculators/viral/love-compatibility" element={<LoveCompatibilityCalculator />} />
                <Route path="/calculators/viral/zodiac-compatibility" element={<ZodiacCompatibilityCalculator />} />
                <Route path="/calculators/viral/life-path-number" element={<LifePathNumberCalculator />} />
                <Route path="/calculators/viral/friend-compatibility" element={<FriendCompatibilityCalculator />} />
                <Route path="/calculators/viral/calorie-burn" element={<CalorieBurnCalculator />} />
                <Route path="/calculator/calorie" element={<CalorieBurnCalculator />} />
                <Route path="/calculators/viral/life-expectancy" element={<LifeExpectancyCalculator />} />
                <Route path="/calculators/viral/how-long-to-watch" element={<HowLongToWatchCalculator />} />

                <Route path="/ai/relationships" element={<RelationshipsPage />} />
                <Route path="/ai/wellness" element={<WellnessPage />} />
                <Route path="/ai/parenting" element={<ParentingPage />} />
                <Route path="/ai/shopping" element={<ShoppingPage />} />
                <Route path="/ai/social" element={<SocialPage />} />

                <Route path="/ai/relationships/compatibility" element={<AICompatibilityCalculator />} />
                <Route path="/ai/relationships/pickup-lines" element={<PickupLineGenerator />} />
                <Route path="/ai/social/hashtag-generator" element={<HashtagGenerator />} />
                <Route path="/ai/social/profile-analyzer" element={<ProfileAnalyzer />} />
                <Route path="/ai/social/instagram-bio-analyzer" element={<InstagramBioAnalyzer />} />
                <Route path="/ai/social/tiktok-profile-score" element={<TikTokProfileScore />} />
                <Route path="/ai/social/caption-generator" element={<CaptionGenerator />} />
                <Route path="/ai/social/audience-analyzer" element={<AudienceAnalyzer />} />
                <Route path="/ai/ai-text-detector" element={<AITextDetector />} />

                <Route path="/ai/wellness/mood-journal" element={<MoodJournal />} />
                <Route path="/ai/parenting/baby-name-generator" element={<BabyNameGenerator />} />
                <Route path="/ai/shopping/gift-recommender" element={<GiftRecommender />} />

                <Route path="/blog" element={<BlogListPageV2 />} />
                <Route path="/blog/:slug" element={<BlogPostPageV2 />} />

                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/blogs" element={<AdminRoute><BlogManagementV2 /></AdminRoute>} />
                <Route path="/admin/blog" element={<AdminRoute><BlogManagement /></AdminRoute>} />
                <Route path="/admin/blog/edit/:id" element={<AdminRoute><BlogEditor /></AdminRoute>} />
                <Route path="/admin/blog/new" element={<AdminRoute><BlogEditor /></AdminRoute>} />
                <Route path="/admin/logs" element={<AdminRoute><LogsViewer /></AdminRoute>} />
                <Route path="/admin/indexing-test" element={<AdminRoute><IndexingTest /></AdminRoute>} />
                <Route path="/admin/ads" element={<AdminRoute><EzoicAdsManager /></AdminRoute>} />
                <Route path="/admin/pwa-analytics" element={<AdminRoute><PWAAnalytics /></AdminRoute>} />
                <Route path="/test-logs" element={<TestLogsPage />} />

                <Route path="/share/:shareId" element={<ShareResultPage />} />

                <Route path="/i18n-demo" element={<I18nDemoPage />} />

                <Route path="/tools" element={<ToolsHubPage />} />
                <Route path="/tools/knowmyip" element={<KnowMyIPPage />} />
                <Route path="/tools/know-my-ip" element={<KnowMyIPPage />} />
                <Route path="/tools/internet-speed-test" element={<InternetSpeedTest />} />
                <Route path="/tools/speed-test" element={<InternetSpeedTest />} />
                <Route path="/tools/ip-reputation-check" element={<IPReputationCheck />} />
                <Route path="/tools/ip-reputation" element={<IPReputationCheck />} />
                <Route path="/tools/ssl-domain-checker" element={<SSLDomainChecker />} />
                <Route path="/tools/ssl-checker" element={<SSLDomainChecker />} />
                <Route path="/tools/dns-ping-test" element={<DNSPingTest />} />
                <Route path="/tools/dns-ping" element={<DNSPingTest />} />
                <Route path="/tools/browser-device-info" element={<BrowserDeviceInfo />} />
                <Route path="/tools/browser-info" element={<BrowserDeviceInfo />} />
                <Route path="/tools/image-compressor" element={<ImageCompressor />} />
                <Route path="/tools/shortener" element={<SmartShortener />} />
                <Route path="/s/:shortCode" element={<ShortUrlRedirect />} />
                
                <Route path="/knowmyip" element={<Navigate to="/tools/knowmyip" replace />} />
                <Route path="/know-my-ip" element={<Navigate to="/tools/know-my-ip" replace />} />
                <Route path="/shortener" element={<Navigate to="/tools/shortener" replace />} />
                <Route path="/finder/tools/plantfinder" element={<PlantFinder />} />
                <Route path="/finder/tools/pet-breed-finder" element={<PetBreedFinder />} />
                <Route path="/finder/tools/home-decor-style-finder" element={<HomeDecorStyleFinder />} />

                <Route path="/smarttimer" element={<SmartTimerHub />} />
                <Route path="/smarttimer/stopwatch" element={<StopwatchPage />} />
                <Route path="/smarttimer/countdown" element={<CountdownPage />} />
                <Route path="/smarttimer/pomodoro" element={<PomodoroPage />} />
                <Route path="/smarttimer/multi-timer" element={<MultiTimerPage />} />
                <Route path="/smarttimer/event" element={<EventCountdownPage />} />

                <Route path="/calculators/insurance/travel" element={<TravelInsuranceCalculator />} />
                <Route path="/calculators/insurance/pet" element={<PetInsuranceCalculator />} />
                <Route path="/calculators/insurance/business-liability" element={<BusinessLiabilityCalculator />} />
                <Route path="/calculator/legal-settlement" element={<LegalSettlementEstimator />} />
                <Route path="/calculator/solar-savings" element={<SolarSavingsCalculator />} />
                <Route path="/calculator/car-insurance-premium" element={<CarInsurancePremiumEstimator />} />

                <Route path="/calculators/*" element={<Navigate to="/" replace />} />
                <Route path="/us/*" element={<Navigate to="/us/tools" replace />} />
                <Route path="/uk/*" element={<Navigate to="/uk/tools" replace />} />
                <Route path="/in/*" element={<Navigate to="/india/tools" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ScrollToTop>
        </ErrorBoundary>
      </main>
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>
      <PWAInstallBanner />
      <PWAUpdateNotification />
      <CookieConsent />
      <Toaster />
    </div>
  );
};

const App = () => {
  useEffect(() => {
    const cleanupMessageHandler = setupGlobalMessageHandler({
      debug: process.env.NODE_ENV === 'development'
    });

    const handleGlobalError = (event: ErrorEvent) => {
      const errorMessage = event.error?.message || event.message || '';
      
      const suppressedErrors = [
        'TagError',
        'removeChild',
        'The node to be removed is not a child',
      ];
      
      if (suppressedErrors.some(pattern => errorMessage.includes(pattern))) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
    };
    
    window.addEventListener('error', handleGlobalError, true);

    return () => {
      cleanupMessageHandler();
      window.removeEventListener('error', handleGlobalError, true);
    };
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <AdminAuthProvider>
            <UserContextProvider>
              <Router>
                <AppContent />
              </Router>
            </UserContextProvider>
          </AdminAuthProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
