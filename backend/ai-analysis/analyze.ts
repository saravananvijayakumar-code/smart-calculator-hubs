import { api } from "encore.dev/api";
import { AnalysisRequest, AnalysisResponse } from "./types";
import { generateMortgageRecommendations } from "./recommendations/mortgage";
import { generateLoanRecommendations } from "./recommendations/loan";
import { generateInvestmentRecommendations } from "./recommendations/investment";
import { generateRetirementRecommendations } from "./recommendations/retirement";
import { generateEmergencyFundRecommendations } from "./recommendations/emergency-fund";
import { generateCreditCardRecommendations } from "./recommendations/credit-card";
import { 
  generateBTLMortgageRecommendations,
  generateISARecommendations,
  generateNationalInsuranceRecommendations,
  generatePensionRecommendations,
  generateStampDutyRecommendations
} from "./recommendations/uk";
import {
  generateEPFRecommendations,
  generateHomeLoanRecommendations,
  generateIncomeTaxRecommendations,
  generatePPFRecommendations,
  generateSIPRecommendations
} from "./recommendations/india";
import { generateEMIRecommendations } from "./recommendations/emi";
import { generateGSTRecommendations } from "./recommendations/gst";
import {
  generateCGTRecommendations,
  generateFBTRecommendations,
  generateNegativeGearingRecommendations,
  generatePropertyTaxRecommendations,
  generateSuperannuationRecommendations,
  generateFirstHomeBuyerNSWRecommendations
} from "./recommendations/australia";
import { generateIncomeTaxAustraliaRecommendations } from "./recommendations/income-tax-australia";
import { generateAUPayRecommendations } from "./recommendations/au-pay";
import {
  generateBMIRecommendations,
  generatePercentageRecommendations,
  generateAgeRecommendations,
  generateUnitConverterRecommendations,
  generateCurrencyConverterRecommendations,
  generateTipRecommendations
} from "./recommendations/health-math-utility";
import { generateWeightLossStepsRecommendations } from "./recommendations/weight-loss-steps";
import { generateCalorieRecommendations } from "./recommendations/calorie";
import { generateWaistToHipRatioRecommendations } from "./recommendations/waist-hip-ratio";
import { generateStateTaxAnalysis } from "./recommendations/state-tax";
import { generateLoveCompatibilityRecommendations } from "./recommendations/love-compatibility";
import { analyzeFriendCompatibility } from "./recommendations/friend-compatibility";
import { generateProfileAnalysisRecommendations } from "./recommendations/profile-analyzer";
import { generateInstagramBioRecommendations } from "./recommendations/instagram-bio";
import { generateTikTokProfileRecommendations } from "./recommendations/tiktok-profile";
import { generateAudiencePrompt } from "./recommendations/audience-analyzer";
import { generateIPLookupRecommendations } from "./recommendations/ip-lookup";
import { generateCarInsuranceRecommendations } from "./recommendations/car-insurance";
import { generateLegalSettlementRecommendations } from "./recommendations/legal-settlement";
import { generateSolarSavingsRecommendations } from "./recommendations/solar-savings";
import type { AudienceAnalysisData } from "./types";

function getElementNeeds(element: string): string {
  const needs: Record<string, string> = {
    'Fire': 'passion, independence, excitement, and recognition',
    'Earth': 'stability, practicality, security, and tangible results',
    'Air': 'communication, mental stimulation, freedom, and social connection',
    'Water': 'emotional depth, intuition, security, and deep connection'
  };
  return needs[element] || 'understanding and respect';
}

// Analyzes calculator results and provides personalized recommendations across all calculator types
// Supports financial, regional (US/UK/India/Australia), health, math, and utility calculators
export const analyze = api<AnalysisRequest, AnalysisResponse>(
  { method: "POST", path: "/analyze", expose: true },
  async (req): Promise<AnalysisResponse> => {
    const { calculatorType, data, userContext } = req;

    switch (calculatorType) {
      // Financial & US Calculators
      case "mortgage":
      case "mortgage-us":
        return generateMortgageRecommendations(data as any, userContext);
      
      case "loan":
      case "loan-us":
      case "loan-affordability":
      case "student-loan":
      case "auto-loan":
      case "heloc":
      case "business-loan":
      case "debt-consolidation":
        return generateLoanRecommendations(data as any, userContext);
      
      case "investment":
      case "compound-interest":
      case "simple-interest":
      case "roi":
        return generateInvestmentRecommendations(data as any, userContext);
      
      case "retirement":
      case "401k-retirement":
        return generateRetirementRecommendations(data as any, userContext);
      
      case "emergency-fund":
        return generateEmergencyFundRecommendations(data as any, userContext);
      
      case "credit-card-payoff":
        return generateCreditCardRecommendations(data as any, userContext);
      
      // UK Calculators
      case "btl-mortgage-uk":
        return generateBTLMortgageRecommendations(data as any, userContext);
      
      case "isa-calculator-uk":
        return generateISARecommendations(data as any, userContext);
      
      case "national-insurance-uk":
        return generateNationalInsuranceRecommendations(data as any, userContext);
      
      case "pension-calculator-uk":
        return generatePensionRecommendations(data as any, userContext);
      
      case "stamp-duty-uk":
        return generateStampDutyRecommendations(data as any, userContext);
      
      // India Calculators
      case "epf-calculator-india":
        return generateEPFRecommendations(data as any, userContext);
      
      case "home-loan-calculator-india":
        return generateHomeLoanRecommendations(data as any, userContext);
      
      case "income-tax-calculator-india":
        return generateIncomeTaxRecommendations(data as any, userContext);
      
      case "ppf-calculator-india":
        return generatePPFRecommendations(data as any, userContext);
      
      case "sip-calculator-india":
        return generateSIPRecommendations(data as any, userContext);
      
      case "emi_india":
        return generateEMIRecommendations(data as any, userContext);
      
      case "gst_india":
        return generateGSTRecommendations(data as any, userContext);
      
      // Australia Calculators
      case "cgt-calculator-australia":
        return generateCGTRecommendations(data as any, userContext);
      
      case "fbt-calculator-australia":
        return generateFBTRecommendations(data as any, userContext);
      
      case "negative-gearing-australia":
        return generateNegativeGearingRecommendations(data as any, userContext);
      
      case "property-tax-australia":
        return generatePropertyTaxRecommendations(data as any, userContext);
      
      case "superannuation-australia":
        return generateSuperannuationRecommendations(data as any, userContext);
      
      case "first-home-buyer-nsw":
        return generateFirstHomeBuyerNSWRecommendations(data as any, userContext);
      
      case "income-tax-australia":
        return generateIncomeTaxAustraliaRecommendations(data as any, userContext);
      
      case "au-pay":
        return generateAUPayRecommendations(data as any, userContext);
      
      // Health Calculators
      case "bmi":
        return generateBMIRecommendations(data as any, userContext);
      
      case "weight-loss-steps":
        return {
          summary: `To lose ${(data as any).targetWeightLoss} ${(data as any).weightUnit} in ${(data as any).timeframeDays} days, you need ${(data as any).stepsPerDay.toLocaleString()} steps daily (${(data as any).distancePerDay.toFixed(1)} km, ${(data as any).caloriesPerDay} calories burned).`,
          recommendations: generateWeightLossStepsRecommendations(data as any),
          keyInsights: [
            `Walking ${(data as any).stepsPerDay.toLocaleString()} steps burns approximately ${(data as any).caloriesPerDay} calories daily`,
            `Your target weight loss rate is ${(data as any).weeklyWeightLoss.toFixed(1)} ${(data as any).weightUnit} per week`,
            `You'll need to walk approximately ${(data as any).distancePerDay.toFixed(1)} km per day`,
            "Consistency is key - missing days will require making up extra steps later"
          ],
          riskFactors: [
            ...(data as any).weeklyWeightLoss > 1 ? ["Weight loss rate may be too aggressive for sustainable results"] : [],
            ...(data as any).stepsPerDay > 15000 ? ["High daily step count may increase injury risk"] : [],
            ...(data as any).currentBMI > 30 ? ["Higher BMI requires medical supervision for weight loss"] : [],
            "Weather, illness, or schedule changes may affect daily walking goals"
          ],
          nextSteps: [
            "Start gradually and build up to your target step count over 2-3 weeks",
            "Track your steps with a smartphone app or fitness tracker",
            "Plan your walking routes and backup indoor options",
            "Combine walking with a balanced diet for optimal results",
            "Monitor your progress weekly and adjust as needed"
          ]
        };

      case "calorie":
        return {
          summary: `Your daily calorie needs: ${(data as any).bmr} BMR, ${(data as any).tdee} TDEE, ${(data as any).targetCalories} target calories for your ${(data as any).goal.replace('_', ' ')} goal. BMI: ${(data as any).currentBMI.toFixed(1)} (${(data as any).bmiCategory}).`,
          recommendations: generateCalorieRecommendations(data as any),
          keyInsights: [
            `Your BMR (${(data as any).bmr} calories) represents your basic metabolic needs at rest`,
            `TDEE (${(data as any).tdee} calories) includes all daily activities and exercise`,
            `Daily macronutrient targets: ${(data as any).proteinNeeds}g protein, ${(data as any).carbNeeds}g carbs, ${(data as any).fatNeeds}g fat`,
            `Optimal daily water intake: ${((data as any).waterNeeds / 1000).toFixed(1)} liters`,
            "Consistency in calorie intake is more important than perfection"
          ],
          riskFactors: [
            ...(data as any).targetCalories < (data as any).bmr ? ["Target calories below BMR may slow metabolism"] : [],
            ...(data as any).currentBMI > 30 ? ["Higher BMI requires medical supervision for weight management"] : [],
            ...(data as any).currentBMI < 18.5 ? ["Underweight BMI requires careful weight gain approach"] : [],
            ...(data as any).activityLevel === 'sedentary' ? ["Sedentary lifestyle limits calorie burn and health benefits"] : [],
            "Extreme calorie restrictions can lead to nutrient deficiencies and metabolic slowdown"
          ],
          nextSteps: [
            "Track your food intake using a calorie tracking app",
            "Plan balanced meals that meet your macro targets",
            "Monitor progress weekly and adjust calories as needed",
            "Include regular physical activity to support your goals",
            "Consider consulting a registered dietitian for personalized guidance"
          ]
        };
      
      case "waist-to-hip-ratio":
        return generateWaistToHipRatioRecommendations(data as any, userContext);
      
      // Math Calculators
      case "percentage":
        return generatePercentageRecommendations(data as any, userContext);
      
      case "age-calculator":
        return generateAgeRecommendations(data as any, userContext);
      
      case "unit-converter":
        return generateUnitConverterRecommendations(data as any, userContext);
      
      // Utility Calculators
      case "currency-converter":
        return generateCurrencyConverterRecommendations(data as any, userContext);
      
      case "tip-calculator":
        return generateTipRecommendations(data as any, userContext);
      
      // Tax Calculators
      case "state-tax":
        return generateStateTaxAnalysis(data as any, userContext);
      
      case "federal-tax":
        return {
          summary: "Tax calculation completed. Consider tax optimization strategies.",
          recommendations: [
            {
              type: "strategy",
              priority: "high",
              title: "Tax Optimization Strategy",
              description: "Explore tax planning opportunities to minimize your liability.",
              actionItems: [
                "Maximize contributions to tax-advantaged accounts",
                "Consider timing of income and deductions",
                "Review available tax credits and deductions",
                "Consult with a tax professional for complex situations"
              ]
            }
          ],
          keyInsights: ["Effective tax planning can significantly impact your financial situation"],
          riskFactors: ["Tax laws change frequently - stay informed about updates"],
          nextSteps: ["Review your tax strategy annually", "Keep detailed records for tax purposes"]
        };
      
      // Viral Calculators
      case "love-compatibility":
        return {
          summary: `${(data as any).partner1Name} & ${(data as any).partner2Name} are ${(data as any).compatibilityPercentage}% compatible! ${(data as any).overallMatch}`,
          recommendations: generateLoveCompatibilityRecommendations(data as any),
          keyInsights: [
            `Zodiac compatibility (${(data as any).partner1StarSign} & ${(data as any).partner2StarSign}): ${(data as any).zodiacCompatibility}%`,
            `Numerology alignment: ${(data as any).numerologyScore}%`,
            `Birthday harmony: ${(data as any).birthdayHarmony}%`,
            `Emotional connection score: ${(data as any).emotionalScore}%`,
            "Remember: compatibility is just one factor in a successful relationship!"
          ],
          riskFactors: [
            ...(data as any).compatibilityPercentage < 60 ? ["Lower compatibility score suggests more work needed"] : [],
            ...(data as any).communicationScore < 65 ? ["Communication challenges may arise - address early"] : [],
            ...(data as any).lifeGoalsScore < 60 ? ["Different life goals require compromise and alignment"] : [],
            "Astrology and numerology are for fun—real relationships require effort, trust, and communication"
          ],
          nextSteps: [
            "Have open conversations about expectations and goals",
            "Focus on building trust and understanding",
            "Appreciate each other's unique qualities",
            "Work on areas of difference with patience",
            "Remember: every relationship is unique—these are just insights!"
          ]
        };
      
      case "friend-compatibility":
        return analyzeFriendCompatibility(data as any);
      
      case "life-path-number": {
        const lifePathNumber = (data as any).lifePathNumber || 1;
        const name = (data as any).name || '';
        const personalityTraits = (data as any).personalityTraits || [];
        const strengths = (data as any).strengths || [];
        const challenges = (data as any).challenges || [];
        const careerPaths = (data as any).careerPaths || [];
        
        const isMasterNumber = [11, 22, 33].includes(lifePathNumber);
        
        return {
          summary: `${name}'s Life Path Number is ${lifePathNumber}${isMasterNumber ? ' (Master Number)' : ''}, revealing ${personalityTraits.slice(0, 3).join(', ').toLowerCase()} qualities. This number indicates a life path focused on ${lifePathNumber === 1 ? 'leadership and independence' : lifePathNumber === 2 ? 'cooperation and harmony' : lifePathNumber === 3 ? 'creativity and self-expression' : lifePathNumber === 4 ? 'building and stability' : lifePathNumber === 5 ? 'freedom and adventure' : lifePathNumber === 6 ? 'nurturing and service' : lifePathNumber === 7 ? 'wisdom and spirituality' : lifePathNumber === 8 ? 'power and material success' : lifePathNumber === 9 ? 'humanitarianism and compassion' : isMasterNumber ? 'spiritual enlightenment and service to humanity' : 'personal growth'}.`,
          recommendations: [
            {
              type: "strategy",
              priority: "high",
              title: `Embrace Your Life Path ${lifePathNumber} Energy`,
              description: isMasterNumber 
                ? `As a Master Number ${lifePathNumber}, you carry tremendous spiritual potential and a higher calling. Your path is more intense but offers opportunities for profound impact.`
                : `Your Life Path ${lifePathNumber} represents your core purpose and natural gifts. Understanding this energy helps you align with your true calling.`,
              actionItems: isMasterNumber
                ? [
                    "Recognize the spiritual significance of your Master Number",
                    "Balance high ideals with practical action",
                    "Develop strong self-care practices to manage intensity",
                    "Seek mentors who understand Master Number energies",
                    "Don't pressure yourself to live up to unrealistic expectations"
                  ]
                : [
                    `Focus on developing your natural ${strengths[0]?.toLowerCase() || 'talents'}`,
                    "Align your daily actions with your life path purpose",
                    `Pursue career paths in ${careerPaths[0] || 'fields that resonate with you'}`,
                    "Trust your innate abilities and natural inclinations",
                    "Study your life path number to understand yourself better"
                  ]
            },
            {
              type: "opportunity",
              priority: "high",
              title: "Career Alignment",
              description: `Your Life Path ${lifePathNumber} naturally aligns with careers in ${careerPaths.slice(0, 3).join(', ').toLowerCase()}. These fields allow you to express your authentic self.`,
              actionItems: [
                `Consider careers in: ${careerPaths.join(', ')}`,
                "Look for roles that utilize your core strengths",
                "Network with others in your ideal career fields",
                "Develop skills that complement your natural talents",
                "Don't force yourself into careers that contradict your nature"
              ],
              estimatedImpact: "Career satisfaction and natural success"
            },
            {
              type: "warning",
              priority: "medium",
              title: "Navigate Life Challenges",
              description: `Every Life Path has shadow aspects. For ${lifePathNumber}, watch for: ${challenges.join(', ').toLowerCase()}.`,
              actionItems: [
                "Self-awareness is key - recognize when you're in shadow mode",
                `Address tendencies toward ${challenges[0]?.toLowerCase() || 'negative patterns'}`,
                "Practice mindfulness and self-reflection regularly",
                "Seek constructive feedback from trusted friends",
                "Remember that challenges are opportunities for growth"
              ]
            }
          ],
          keyInsights: [
            `Life Path ${lifePathNumber}${isMasterNumber ? ' (Master Number)' : ''} represents ${personalityTraits[0]?.toLowerCase() || 'your core nature'}`,
            `Core strengths: ${strengths.slice(0, 3).join(', ')}`,
            `Ideal careers: ${careerPaths.slice(0, 3).join(', ')}`,
            isMasterNumber ? "Master Numbers carry higher spiritual potential and greater intensity" : "Understanding your life path helps you make aligned decisions",
            "Numerology is a tool for self-discovery, not a limitation"
          ],
          riskFactors: [
            ...challenges.map((c: string) => `Watch for: ${c}`),
            isMasterNumber ? "Master Number intensity can lead to burnout if not managed" : "Ignoring your life path can lead to feeling unfulfilled",
            "Don't use numerology as an excuse - you still have free will",
            "Balance numerological insights with practical real-world action"
          ],
          nextSteps: [
            "Explore careers and activities aligned with your Life Path",
            "Study your other numerology numbers (Expression, Soul Urge)",
            "Connect with others who share your Life Path Number",
            "Set goals that align with your natural talents and purpose",
            "Practice self-acceptance and embrace your unique path"
          ]
        };
      }
      
      case "zodiac-compatibility": {
        const score = (data as any).compatibilityScore || 0;
        const yourSign = (data as any).yourSign || '';
        const partnerSign = (data as any).partnerSign || '';
        const elementMatch = (data as any).elementMatch || false;
        const yourElement = (data as any).yourElement || '';
        const partnerElement = (data as any).partnerElement || '';
        
        return {
          summary: `${yourSign} and ${partnerSign} are ${score}% compatible! ${elementMatch ? `You share the ${yourElement} element, creating natural understanding.` : `Your ${yourElement} and ${partnerElement} energies create an interesting dynamic.`}`,
          recommendations: [
            {
              type: "engagement",
              priority: "high",
              title: score >= 80 ? "Nurture Your Cosmic Connection" : "Build Your Relationship Foundation",
              description: score >= 80 
                ? `With ${score}% compatibility, you have excellent astrological alignment. Focus on maintaining this natural harmony while growing together.`
                : `At ${score}% compatibility, you'll need to work on understanding each other's differences, but every relationship can thrive with effort!`,
              actionItems: score >= 80 
                ? [
                    "Appreciate your natural understanding of each other",
                    "Use your compatibility as a foundation for deeper connection",
                    "Don't take the ease of your relationship for granted",
                    "Continue learning about each other's needs and desires"
                  ]
                : [
                    "Practice active listening to understand different perspectives",
                    "Learn about each other's zodiac traits and needs",
                    "Focus on what you have in common rather than differences",
                    "Be patient and give each other space to be yourselves"
                  ]
            },
            {
              type: "strategy",
              priority: "medium",
              title: "Element-Based Communication",
              description: elementMatch
                ? `Both being ${yourElement} signs means you naturally "get" each other, but watch out for amplifying each other's weaknesses.`
                : `${yourElement} and ${partnerElement} elements communicate differently. Understanding these differences is key to harmony.`,
              actionItems: elementMatch
                ? [
                    `Both ${yourElement} signs: ensure you balance out shared tendencies`,
                    "Seek outside perspectives to avoid echo chamber effects",
                    "Develop traits from other elements for balance",
                    "Use your shared understanding as a strength, not a crutch"
                  ]
                : [
                    `${yourElement} needs: ${getElementNeeds(yourElement)}`,
                    `${partnerElement} needs: ${getElementNeeds(partnerElement)}`,
                    "Respect and honor these different approaches",
                    "Find the complementary aspects of your different energies"
                  ]
            }
          ],
          keyInsights: [
            `${yourSign} and ${partnerSign} compatibility score: ${score}%`,
            elementMatch ? `Shared ${yourElement} element creates natural understanding` : `${yourElement} and ${partnerElement} elements offer complementary perspectives`,
            score >= 90 ? "Exceptional cosmic alignment - soulmate potential!" : score >= 70 ? "Strong foundation with great relationship potential" : "Growth-oriented pairing that teaches valuable lessons",
            "Sun sign compatibility is just one piece of the astrological puzzle",
            "Any pairing can work with communication, respect, and genuine love"
          ],
          riskFactors: [
            ...(score < 60 ? ["Lower compatibility suggests more effort needed to understand each other"] : []),
            ...(elementMatch ? ["Same element can amplify both strengths and weaknesses"] : []),
            ...(!elementMatch ? ["Different elemental needs require patience and understanding"] : []),
            "Astrology provides insights, not destiny - relationships require real-world effort",
            "Don't use compatibility scores to limit your relationship potential"
          ],
          nextSteps: [
            "Explore your complete birth charts (Moon, Venus, Mars signs) for deeper insights",
            "Communicate openly about your needs and expectations",
            "Learn about each other's zodiac traits to understand behaviors better",
            "Focus on building real connection beyond astrological compatibility",
            "Use astrology as a tool for understanding, not as a relationship rulebook"
          ]
        };
      }
      
      // AI Tools
      case "profile-analyzer":
        return generateProfileAnalysisRecommendations(data as any);
      
      case "instagram-bio-analyzer":
        return generateInstagramBioRecommendations(data as any);
      
      case "tiktok-profile-score":
        return generateTikTokProfileRecommendations(data as any);
      
      case "audience-analyzer":
        return {
          summary: generateAudiencePrompt(data as AudienceAnalysisData),
          recommendations: [],
          keyInsights: [],
          riskFactors: [],
          nextSteps: []
        };
      
      // Utility Tools
      case "ip-lookup":
        return generateIPLookupRecommendations(data as any);
      
      // High-CPM Suite
      case "car-insurance": {
        const premium = (data as any).estimatedPremium || (data as any).estimatedAnnualCost || 0;
        const coverageType = (data as any).coverageType || 'comprehensive';
        const vehicleType = (data as any).vehicleType || 'sedan';
        const state = (data as any).state || 'nsw';
        const age = (data as any).age || 35;
        const ncdYears = (data as any).ncdYears || 0;
        const claimsHistory = (data as any).claimsHistory || 0;
        const parkingLocation = (data as any).parkingLocation || 'garage';
        
        return {
          summary: `Estimated ${coverageType} insurance premium: $${premium.toLocaleString()}/year for your ${vehicleType} in ${state.toUpperCase()}.`,
          recommendations: generateCarInsuranceRecommendations(data as any),
          keyInsights: [
            `Your age (${age}) ${age < 25 ? 'significantly impacts' : age > 65 ? 'slightly increases' : 'is optimal for'} premium costs`,
            `${ncdYears} years no claim discount ${ncdYears >= 5 ? 'provides maximum savings' : 'can be improved further'}`,
            `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} vehicles attract ${['sports', 'luxury', 'electric'].includes(vehicleType) ? 'higher' : 'moderate'} premiums`,
            `Shopping around annually could save $${Math.round(premium * 0.25).toLocaleString()}`,
            "Comprehensive coverage provides maximum protection but costs more than third party options"
          ],
          riskFactors: [
            ...(age < 25 ? ["Young drivers face 50-100% premium surcharges due to higher accident risk"] : []),
            ...(claimsHistory > 0 ? [`${claimsHistory} recent claim(s) will increase premiums for 3-5 years`] : []),
            ...(ncdYears < 3 ? ["Limited no claim discount means higher premiums - avoid claims to build discount"] : []),
            ...(parkingLocation === 'street' ? ["Street parking increases theft and damage risk, raising premiums"] : []),
            "Auto-renewal often costs 20-40% more than switching insurers"
          ],
          nextSteps: [
            "Get quotes from at least 4-5 insurers before your renewal date",
            "Consider increasing excess to reduce premiums if financially viable",
            "Install security devices (alarm, tracker, immobilizer) for discounts",
            "Review coverage type annually - older vehicles may not need comprehensive",
            "Build your no claim discount by avoiding small claims"
          ]
        };
      }
      
      case "legal-settlement":
        return generateLegalSettlementRecommendations(data as any, userContext);
      
      case "solar-savings":
        return generateSolarSavingsRecommendations(data as any, userContext);
      
      default:
        return {
          summary: "Analysis completed for your calculation.",
          recommendations: [
            {
              type: "strategy",
              priority: "medium",
              title: "Financial Planning Opportunity",
              description: "Use this calculation as part of your broader financial planning.",
              actionItems: [
                "Consider how this calculation fits into your overall financial goals",
                "Explore related financial planning tools and calculators",
                "Consult with a financial advisor for personalized guidance"
              ]
            }
          ],
          keyInsights: ["Regular financial calculations help you make informed decisions"],
          riskFactors: [],
          nextSteps: ["Consider exploring other financial planning tools", "Review your calculations periodically"]
        };
    }
  }
);