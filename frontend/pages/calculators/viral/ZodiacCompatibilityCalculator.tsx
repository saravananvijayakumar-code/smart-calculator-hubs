import { useState } from "react";
import { Heart, Sparkles, Users, Star, TrendingUp } from "lucide-react";
import { AppleStyleCard } from "../../../components/AppleStyleCard";
import { AppleStyleButton } from "@/components/AppleStyleButton";
import { SEOHead } from "@/components/SEOHead";
import EnhancedAIAnalysis from "@/components/EnhancedAIAnalysis";
import ExportShareButtons from "@/components/ExportShareButtons";
import { InFeedAd } from "@/components/ads/InFeedAd";
import { SidebarAd } from "@/components/ads/SidebarAd";
import { AutoAdSlot } from "@/components/ads/AutoAdSlot";


const zodiacSigns = [
  { name: "Aries", emoji: "♈", element: "Fire", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", emoji: "♉", element: "Earth", dates: "Apr 20 - May 20" },
  { name: "Gemini", emoji: "♊", element: "Air", dates: "May 21 - Jun 20" },
  { name: "Cancer", emoji: "♋", element: "Water", dates: "Jun 21 - Jul 22" },
  { name: "Leo", emoji: "♌", element: "Fire", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", emoji: "♍", element: "Earth", dates: "Aug 23 - Sep 22" },
  { name: "Libra", emoji: "♎", element: "Air", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", emoji: "♏", element: "Water", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", emoji: "♐", element: "Fire", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", emoji: "♑", element: "Earth", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", emoji: "♒", element: "Air", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", emoji: "♓", element: "Water", dates: "Feb 19 - Mar 20" }
];

const compatibilityData: { [key: string]: { [key: string]: number } } = {
  "Aries": { "Aries": 75, "Taurus": 60, "Gemini": 85, "Cancer": 55, "Leo": 90, "Virgo": 50, "Libra": 80, "Scorpio": 65, "Sagittarius": 95, "Capricorn": 55, "Aquarius": 88, "Pisces": 60 },
  "Taurus": { "Aries": 60, "Taurus": 70, "Gemini": 50, "Cancer": 90, "Leo": 65, "Virgo": 95, "Libra": 75, "Scorpio": 85, "Sagittarius": 55, "Capricorn": 92, "Aquarius": 60, "Pisces": 88 },
  "Gemini": { "Aries": 85, "Taurus": 50, "Gemini": 75, "Cancer": 60, "Leo": 88, "Virgo": 65, "Libra": 95, "Scorpio": 55, "Sagittarius": 90, "Capricorn": 50, "Aquarius": 93, "Pisces": 70 },
  "Cancer": { "Aries": 55, "Taurus": 90, "Gemini": 60, "Cancer": 80, "Leo": 70, "Virgo": 85, "Libra": 65, "Scorpio": 95, "Sagittarius": 50, "Capricorn": 88, "Aquarius": 55, "Pisces": 92 },
  "Leo": { "Aries": 90, "Taurus": 65, "Gemini": 88, "Cancer": 70, "Leo": 75, "Virgo": 60, "Libra": 85, "Scorpio": 70, "Sagittarius": 95, "Capricorn": 60, "Aquarius": 90, "Pisces": 65 },
  "Virgo": { "Aries": 50, "Taurus": 95, "Gemini": 65, "Cancer": 85, "Leo": 60, "Virgo": 70, "Libra": 75, "Scorpio": 88, "Sagittarius": 55, "Capricorn": 93, "Aquarius": 65, "Pisces": 80 },
  "Libra": { "Aries": 80, "Taurus": 75, "Gemini": 95, "Cancer": 65, "Leo": 85, "Virgo": 75, "Libra": 70, "Scorpio": 60, "Sagittarius": 88, "Capricorn": 65, "Aquarius": 95, "Pisces": 75 },
  "Scorpio": { "Aries": 65, "Taurus": 85, "Gemini": 55, "Cancer": 95, "Leo": 70, "Virgo": 88, "Libra": 60, "Scorpio": 80, "Sagittarius": 60, "Capricorn": 90, "Aquarius": 60, "Pisces": 93 },
  "Sagittarius": { "Aries": 95, "Taurus": 55, "Gemini": 90, "Cancer": 50, "Leo": 95, "Virgo": 55, "Libra": 88, "Scorpio": 60, "Sagittarius": 85, "Capricorn": 55, "Aquarius": 92, "Pisces": 65 },
  "Capricorn": { "Aries": 55, "Taurus": 92, "Gemini": 50, "Cancer": 88, "Leo": 60, "Virgo": 93, "Libra": 65, "Scorpio": 90, "Sagittarius": 55, "Capricorn": 75, "Aquarius": 60, "Pisces": 85 },
  "Aquarius": { "Aries": 88, "Taurus": 60, "Gemini": 93, "Cancer": 55, "Leo": 90, "Virgo": 65, "Libra": 95, "Scorpio": 60, "Sagittarius": 92, "Capricorn": 60, "Aquarius": 80, "Pisces": 70 },
  "Pisces": { "Aries": 60, "Taurus": 88, "Gemini": 70, "Cancer": 92, "Leo": 65, "Virgo": 80, "Libra": 75, "Scorpio": 93, "Sagittarius": 65, "Capricorn": 85, "Aquarius": 70, "Pisces": 75 }
};

export default function ZodiacCompatibilityCalculator() {
  const [yourSign, setYourSign] = useState("");
  const [partnerSign, setPartnerSign] = useState("");
  const [result, setResult] = useState<any>(null);
  const [showAI, setShowAI] = useState(false);

  const calculateCompatibility = () => {
    if (!yourSign || !partnerSign) return;

    const score = compatibilityData[yourSign][partnerSign];
    const yourSignData = zodiacSigns.find(z => z.name === yourSign)!;
    const partnerSignData = zodiacSigns.find(z => z.name === partnerSign)!;

    let compatibilityLevel = "";
    let description = "";
    let color = "";

    if (score >= 90) {
      compatibilityLevel = "Soulmate Material ✨";
      description = "This is a match made in the stars! Your connection is electric, deep, and transformative. You complement each other perfectly.";
      color = "text-pink-600 dark:text-pink-400";
    } else if (score >= 80) {
      compatibilityLevel = "Highly Compatible 💕";
      description = "You two have amazing chemistry! With mutual effort and understanding, this relationship has incredible potential.";
      color = "text-purple-600 dark:text-purple-400";
    } else if (score >= 70) {
      compatibilityLevel = "Great Potential 💖";
      description = "There's definitely a spark here! You share common ground and with communication, you can build something beautiful.";
      color = "text-blue-600 dark:text-blue-400";
    } else if (score >= 60) {
      compatibilityLevel = "Worth Exploring 💫";
      description = "You have some differences, but opposites can attract! Understanding each other's needs is key to making this work.";
      color = "text-indigo-600 dark:text-indigo-400";
    } else {
      compatibilityLevel = "Challenging Connection ⚡";
      description = "This pairing requires extra work and patience. Growth happens outside comfort zones - you'll learn a lot from each other!";
      color = "text-orange-600 dark:text-orange-400";
    }

    const elementMatch = yourSignData.element === partnerSignData.element;

    setResult({
      score,
      compatibilityLevel,
      description,
      color,
      yourSign: yourSignData,
      partnerSign: partnerSignData,
      elementMatch,
      strengths: getStrengths(yourSign, partnerSign),
      challenges: getChallenges(yourSign, partnerSign)
    });

    setShowAI(true);
  };

  const getStrengths = (sign1: string, sign2: string): string[] => {
    const key = `${sign1}-${sign2}`;
    const reverseKey = `${sign2}-${sign1}`;
    
    const strengthsMap: { [key: string]: string[] } = {
      // Fire + Fire
      "Aries-Aries": ["Shared passion and drive", "High energy relationship", "Mutual understanding of independence needs"],
      "Aries-Leo": ["Dynamic power couple", "Shared love of adventure", "Mutual confidence boosting"],
      "Aries-Sagittarius": ["Ultimate adventure partners", "Freedom-loving duo", "Endless enthusiasm"],
      "Leo-Leo": ["Double the glamour and fun", "Generous and warm", "Shared creative vision"],
      "Leo-Sagittarius": ["Optimistic outlook", "Social and outgoing", "Philosophical connection"],
      "Sagittarius-Sagittarius": ["Freedom and exploration", "Intellectual stimulation", "Honest communication"],
      
      // Earth + Earth
      "Taurus-Taurus": ["Ultimate stability", "Shared love of comfort", "Sensual connection"],
      "Taurus-Virgo": ["Practical partnership", "Mutual appreciation for quality", "Reliable and loyal"],
      "Taurus-Capricorn": ["Power couple potential", "Shared financial goals", "Building empire together"],
      "Virgo-Virgo": ["Perfectionist harmony", "Intellectual match", "Organized life together"],
      "Virgo-Capricorn": ["Ambitious partnership", "Complementary work ethics", "Practical problem-solving"],
      "Capricorn-Capricorn": ["Double ambition", "Shared long-term vision", "Mutual respect"],
      
      // Air + Air
      "Gemini-Gemini": ["Never-ending conversation", "Intellectual excitement", "Social butterfly duo"],
      "Gemini-Libra": ["Mental connection", "Social harmony", "Balanced communication"],
      "Gemini-Aquarius": ["Innovative thinking", "Freedom and independence", "Unique perspectives"],
      "Libra-Libra": ["Romantic and harmonious", "Aesthetic appreciation", "Diplomatic balance"],
      "Libra-Aquarius": ["Idealistic vision", "Social justice alignment", "Intellectual equals"],
      "Aquarius-Aquarius": ["Revolutionary mindset", "Humanitarian goals", "Unconventional love"],
      
      // Water + Water
      "Cancer-Cancer": ["Deep emotional bond", "Nurturing partnership", "Home and family focus"],
      "Cancer-Scorpio": ["Intuitive understanding", "Loyal and protective", "Emotional depth"],
      "Cancer-Pisces": ["Compassionate connection", "Creative and dreamy", "Emotional support"],
      "Scorpio-Scorpio": ["Intense passion", "Transformative love", "Unwavering loyalty"],
      "Scorpio-Pisces": ["Spiritual connection", "Psychic bond", "Artistic creativity"],
      "Pisces-Pisces": ["Romantic dreamers", "Empathetic understanding", "Creative partnership"],
      
      // Fire + Air
      "Aries-Gemini": ["Exciting adventures", "Fast-paced energy", "Fun and spontaneous"],
      "Aries-Libra": ["Attraction of opposites", "Balance of self and partnership", "Passionate debates"],
      "Aries-Aquarius": ["Independent yet connected", "Revolutionary ideas", "Exciting future"],
      "Leo-Gemini": ["Entertaining duo", "Creative collaboration", "Social success"],
      "Leo-Libra": ["Glamorous couple", "Romantic connection", "Aesthetic harmony"],
      "Leo-Aquarius": ["Unique pairing", "Mutual respect for individuality", "Creative projects"],
      "Sagittarius-Gemini": ["Adventurous minds", "Philosophical discussions", "Travel companions"],
      "Sagittarius-Libra": ["Optimistic partnership", "Social and fun-loving", "Cultural appreciation"],
      "Sagittarius-Aquarius": ["Visionary couple", "Freedom and growth", "Humanitarian goals"],
      
      // Earth + Water
      "Taurus-Cancer": ["Nurturing love", "Home building", "Emotional and financial security"],
      "Taurus-Scorpio": ["Intense attraction", "Loyal devotion", "Sensual connection"],
      "Taurus-Pisces": ["Romantic and practical", "Artistic appreciation", "Gentle support"],
      "Virgo-Cancer": ["Caring partnership", "Practical nurturing", "Healing connection"],
      "Virgo-Scorpio": ["Deep understanding", "Transformative growth", "Problem-solving team"],
      "Virgo-Pisces": ["Complementary strengths", "Service-oriented", "Healing each other"],
      "Capricorn-Cancer": ["Family-focused", "Traditional values", "Emotional-practical balance"],
      "Capricorn-Scorpio": ["Power couple", "Ambitious and intense", "Unbreakable bond"],
      "Capricorn-Pisces": ["Dreams and discipline", "Creative business", "Supportive partnership"],
      
      // Challenging but workable
      "Aries-Taurus": ["Complementary pace", "Growth through differences", "Passionate stability"],
      "Aries-Cancer": ["Protective instincts", "Home and adventure balance", "Emotional courage"],
      "Aries-Virgo": ["Detail meets action", "Improving each other", "Honest feedback"],
      "Aries-Capricorn": ["Ambitious drive", "Leadership qualities", "Achieving goals"],
      "Aries-Pisces": ["Courage meets compassion", "Creative adventures", "Spiritual growth"],
      "Taurus-Gemini": ["Stable yet exciting", "Learning from differences", "Grounding flighty energy"],
      "Taurus-Leo": ["Luxury lovers", "Stubborn loyalty", "Appreciation of beauty"],
      "Taurus-Libra": ["Venus-ruled romance", "Aesthetic harmony", "Love of pleasure"],
      "Taurus-Sagittarius": ["Adventure meets comfort", "Expanding horizons", "Honest communication"],
      "Taurus-Aquarius": ["Stability meets innovation", "Learning patience", "Unique perspectives"],
      "Gemini-Cancer": ["Nurturing communication", "Emotional intelligence growth", "Home and social balance"],
      "Gemini-Leo": ["Fun and games", "Social success", "Creative expression"],
      "Gemini-Virgo": ["Mercury minds", "Intellectual stimulation", "Analytical conversations"],
      "Gemini-Scorpio": ["Mystery and curiosity", "Deep conversations", "Transformative learning"],
      "Gemini-Capricorn": ["Learning structure", "Balanced perspectives", "Growth through discipline"],
      "Gemini-Pisces": ["Creative minds", "Mutable adaptability", "Imaginative connection"],
      "Cancer-Leo": ["Nurturing royalty", "Family warmth", "Generous love"],
      "Cancer-Virgo": ["Caring partnership", "Practical support", "Healing connection"],
      "Cancer-Libra": ["Harmonious home", "Emotional balance", "Relationship focus"],
      "Cancer-Sagittarius": ["Adventure and security", "Emotional growth", "Cultural exploration"],
      "Cancer-Aquarius": ["Emotion meets logic", "Unique family", "Progressive nurturing"],
      "Leo-Virgo": ["Perfecting greatness", "Practical creativity", "Service and glory"],
      "Leo-Scorpio": ["Powerful intensity", "Loyalty and devotion", "Transformative passion"],
      "Leo-Capricorn": ["Ambitious leaders", "Power and prestige", "Building legacy"],
      "Leo-Pisces": ["Creative romance", "Dreamy love", "Artistic partnership"],
      "Virgo-Libra": ["Refined partnership", "Balanced perfection", "Analytical harmony"],
      "Virgo-Sagittarius": ["Learning and growth", "Detailed adventures", "Philosophical health"],
      "Virgo-Aquarius": ["Innovative service", "Intellectual analysis", "Humanitarian work"],
      "Libra-Scorpio": ["Intense romance", "Depth and beauty", "Transformative love"],
      "Libra-Sagittarius": ["Social adventures", "Optimistic partnership", "Cultural appreciation"],
      "Libra-Capricorn": ["Structured harmony", "Social ambition", "Elegant success"],
      "Libra-Pisces": ["Romantic dreamers", "Artistic souls", "Compassionate love"],
      "Scorpio-Sagittarius": ["Intense adventures", "Transformative truth", "Deep exploration"],
      "Scorpio-Aquarius": ["Fixed determination", "Deep innovation", "Powerful vision"],
      "Sagittarius-Capricorn": ["Adventurous ambition", "Philosophical success", "Expanding empire"],
      "Sagittarius-Pisces": ["Spiritual journey", "Mutable flexibility", "Compassionate adventure"],
      "Aquarius-Capricorn": ["Traditional innovation", "Structured freedom", "Visionary building"],
      "Aquarius-Pisces": ["Humanitarian dreams", "Innovative compassion", "Spiritual evolution"]
    };
    
    return strengthsMap[key] || strengthsMap[reverseKey] || [
      "Learning from differences",
      "Growth through challenges",
      "Unique perspectives"
    ];
  };

  const getChallenges = (sign1: string, sign2: string): string[] => {
    const key = `${sign1}-${sign2}`;
    const reverseKey = `${sign2}-${sign1}`;
    
    const challengesMap: { [key: string]: string[] } = {
      // Fire + Fire
      "Aries-Aries": ["Competing egos", "Too much impulsivity", "Lack of patience"],
      "Aries-Leo": ["Both want to lead", "Stubborn conflicts", "Need for attention"],
      "Aries-Sagittarius": ["Commitment issues", "Reckless decisions", "Too much independence"],
      "Leo-Leo": ["Drama overload", "Competing for spotlight", "Pride standoffs"],
      "Leo-Sagittarius": ["Bluntness vs sensitivity", "Commitment timing", "Overconfidence"],
      "Sagittarius-Sagittarius": ["Avoiding emotional depth", "Too much freedom", "Lack of grounding"],
      
      // Earth + Earth
      "Taurus-Taurus": ["Double stubbornness", "Too slow to change", "Possessiveness"],
      "Taurus-Virgo": ["Overthinking issues", "Critical tendencies", "Routine monotony"],
      "Taurus-Capricorn": ["Emotional coldness", "Workaholic tendencies", "Inflexibility"],
      "Virgo-Virgo": ["Over-criticism", "Anxiety amplification", "Perfectionism paralysis"],
      "Virgo-Capricorn": ["Emotional distance", "All work no play", "Rigidity"],
      "Capricorn-Capricorn": ["Workaholism", "Emotional unavailability", "Too serious"],
      
      // Air + Air
      "Gemini-Gemini": ["Lack of depth", "Inconsistency", "Too scattered"],
      "Gemini-Libra": ["Indecisiveness", "Avoiding conflict", "Superficiality"],
      "Gemini-Aquarius": ["Emotional detachment", "Too much logic", "Unpredictability"],
      "Libra-Libra": ["Decision paralysis", "Avoiding hard truths", "People-pleasing"],
      "Libra-Aquarius": ["Emotional distance", "Overthinking vs over-idealizing", "Social exhaustion"],
      "Aquarius-Aquarius": ["Extreme detachment", "Stubbornness", "Lack of intimacy"],
      
      // Water + Water
      "Cancer-Cancer": ["Emotional overwhelm", "Moodiness", "Clingy behavior"],
      "Cancer-Scorpio": ["Jealousy issues", "Emotional manipulation", "Too intense"],
      "Cancer-Pisces": ["Victim mentality", "Boundary issues", "Reality avoidance"],
      "Scorpio-Scorpio": ["Power struggles", "Excessive jealousy", "Holding grudges"],
      "Scorpio-Pisces": ["Emotional chaos", "Escapism", "Boundary confusion"],
      "Pisces-Pisces": ["Reality avoidance", "Codependency", "Lack of grounding"],
      
      // Fire + Air
      "Aries-Gemini": ["Impulsive arguments", "Scattered focus", "Commitment phobia"],
      "Aries-Libra": ["Selfishness vs people-pleasing", "Directness vs diplomacy", "Independence vs partnership"],
      "Aries-Aquarius": ["Emotional vs logical clashes", "Stubbornness", "Detachment issues"],
      "Leo-Gemini": ["Need for attention vs independence", "Flirtation jealousy", "Superficial vs deep"],
      "Leo-Libra": ["Indecisiveness frustration", "Expensive tastes", "Social prioritization"],
      "Leo-Aquarius": ["Authority vs rebellion", "Attention needs vs aloofness", "Fixed stubbornness"],
      "Sagittarius-Gemini": ["Commitment avoidance", "Too many ideas", "Restlessness"],
      "Sagittarius-Libra": ["Bluntness vs tact", "Over-socializing", "Decision fatigue"],
      "Sagittarius-Aquarius": ["Emotional unavailability", "Too idealistic", "Lack of tradition"],
      
      // Earth + Water
      "Taurus-Cancer": ["Stubbornness vs moodiness", "Possessiveness", "Communication gaps"],
      "Taurus-Scorpio": ["Power struggles", "Jealousy vs possessiveness", "Intensity clashes"],
      "Taurus-Pisces": ["Reality vs fantasy", "Boundary issues", "Codependency risk"],
      "Virgo-Cancer": ["Over-criticism hurting feelings", "Worry amplification", "Nitpicking"],
      "Virgo-Scorpio": ["Trust issues", "Control battles", "Over-analysis"],
      "Virgo-Pisces": ["Order vs chaos", "Criticism vs sensitivity", "Practical vs dreamy"],
      "Capricorn-Cancer": ["Career vs family", "Coldness vs neediness", "Traditional clashes"],
      "Capricorn-Scorpio": ["Control issues", "Emotional walls", "Intensity vs reserve"],
      "Capricorn-Pisces": ["Practicality vs dreaminess", "Emotional availability", "Structure vs flow"],
      
      // Challenging combinations
      "Aries-Taurus": ["Fast vs slow pace", "Impulsive vs cautious", "Stubbornness clashes"],
      "Aries-Cancer": ["Insensitivity vs sensitivity", "Independence vs neediness", "Emotional disconnect"],
      "Aries-Virgo": ["Impulsive vs analytical", "Criticism conflicts", "Different priorities"],
      "Aries-Capricorn": ["Impatience vs caution", "Reckless vs responsible", "Leadership battles"],
      "Aries-Pisces": ["Aggression vs passivity", "Reality vs fantasy", "Insensitivity"],
      "Taurus-Gemini": ["Stability vs change", "Routine vs variety", "Speed differences"],
      "Taurus-Leo": ["Double stubbornness", "Possessiveness vs freedom", "Luxury overspending"],
      "Taurus-Libra": ["Indecisiveness irritation", "Overspending", "Social vs home"],
      "Taurus-Sagittarius": ["Homebody vs adventurer", "Security vs freedom", "Bluntness hurts"],
      "Taurus-Aquarius": ["Tradition vs innovation", "Stubbornness squared", "Emotional distance"],
      "Gemini-Cancer": ["Logic vs emotion", "Inconsistency hurts", "Surface vs depth"],
      "Gemini-Leo": ["Attention competition", "Flirtation jealousy", "Commitment levels"],
      "Gemini-Virgo": ["Scattered vs organized", "Over-analysis", "Communication styles"],
      "Gemini-Scorpio": ["Surface vs deep", "Trust issues", "Freedom vs control"],
      "Gemini-Capricorn": ["Playful vs serious", "Irresponsible vs rigid", "Different values"],
      "Gemini-Pisces": ["Logic vs intuition", "Flighty behavior", "Communication confusion"],
      "Cancer-Leo": ["Neediness vs independence", "Sensitivity vs pride", "Attention allocation"],
      "Cancer-Virgo": ["Criticism sensitivity", "Emotional vs practical", "Worry amplification"],
      "Cancer-Libra": ["Moodiness vs harmony", "Neediness vs social", "Indirect communication"],
      "Cancer-Sagittarius": ["Homebody vs wanderer", "Sensitivity vs bluntness", "Security vs freedom"],
      "Cancer-Aquarius": ["Emotional vs detached", "Tradition vs innovation", "Neediness vs independence"],
      "Leo-Virgo": ["Drama vs reserve", "Pride vs criticism", "Attention needs"],
      "Leo-Scorpio": ["Power struggles", "Pride vs intensity", "Control battles"],
      "Leo-Capricorn": ["Fun vs work", "Pride vs practicality", "Public vs private"],
      "Leo-Pisces": ["Reality checks", "Attention needs vs giving", "Drama vs peace"],
      "Virgo-Libra": ["Critical vs diplomatic", "Perfectionism vs harmony", "Different approaches"],
      "Virgo-Sagittarius": ["Detail vs big picture", "Careful vs reckless", "Routine vs adventure"],
      "Virgo-Aquarius": ["Traditional vs unconventional", "Critical vs detached", "Service vs innovation"],
      "Libra-Scorpio": ["Surface vs depth", "Harmony vs intensity", "Social vs private"],
      "Libra-Sagittarius": ["Commitment levels", "Tact vs bluntness", "Indecisiveness frustration"],
      "Libra-Capricorn": ["Social vs work", "Indecisive vs decisive", "Pleasure vs discipline"],
      "Libra-Pisces": ["Double indecision", "Boundary issues", "Reality avoidance"],
      "Scorpio-Sagittarius": ["Intensity vs lightness", "Trust vs freedom", "Deep vs surface"],
      "Scorpio-Aquarius": ["Emotional vs logical", "Control vs freedom", "Stubbornness"],
      "Sagittarius-Capricorn": ["Fun vs responsibility", "Freedom vs commitment", "Reckless vs careful"],
      "Sagittarius-Pisces": ["Bluntness vs sensitivity", "Commitment issues", "Reality vs fantasy"],
      "Aquarius-Capricorn": ["Innovation vs tradition", "Rebellious vs conservative", "Emotional distance"],
      "Aquarius-Pisces": ["Logic vs emotion", "Detached vs sensitive", "Boundaries"]
    };
    
    return challengesMap[key] || challengesMap[reverseKey] || [
      "Different communication styles may require patience",
      "Balancing individual needs with relationship goals",
      "Learning to appreciate different perspectives"
    ];
  };

  const shareText = result 
    ? `💕 ${yourSign} ${result.yourSign.emoji} + ${partnerSign} ${result.partnerSign.emoji} = ${result.score}% Compatible! ${result.compatibilityLevel} Check your zodiac compatibility at`
    : "";

  return (
    <>
      <SEOHead
        title="Zodiac Compatibility Calculator 💕 - Love & Relationship Astrology | Smart Calculator Hubs"
        description="Discover your cosmic love connection! Free zodiac compatibility calculator reveals your relationship potential based on astrology. Check compatibility with your crush, partner, or friend instantly!"
        keywords="zodiac compatibility, astrology compatibility, love calculator, zodiac signs, horoscope compatibility, relationship compatibility, star signs, astrological match"
      />

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
                <Heart className="w-10 h-10 text-pink-600" />
                Zodiac Compatibility Calculator 💕
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Discover your cosmic connection! Find out how compatible you are based on zodiac signs and get AI-powered relationship insights.
              </p>
            </div>

        <AutoAdSlot placement="top-banner" className="mb-8" />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
          <div>
            <AppleStyleCard>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Users className="w-6 h-6 text-pink-600" />
                  Check Your Compatibility
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Your Zodiac Sign
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.name}
                          onClick={() => setYourSign(sign.name)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            yourSign === sign.name
                              ? "border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-lg scale-105"
                              : "border-gray-200 dark:border-gray-700 hover:border-pink-300 dark:hover:border-pink-700"
                          }`}
                          title={`${sign.name} (${sign.dates})`}
                        >
                          <div className="text-2xl mb-1">{sign.emoji}</div>
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {sign.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      Partner's Zodiac Sign
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {zodiacSigns.map((sign) => (
                        <button
                          key={sign.name}
                          onClick={() => setPartnerSign(sign.name)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            partnerSign === sign.name
                              ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105"
                              : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                          }`}
                          title={`${sign.name} (${sign.dates})`}
                        >
                          <div className="text-2xl mb-1">{sign.emoji}</div>
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {sign.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <AppleStyleButton
                    onClick={calculateCompatibility}
                    disabled={!yourSign || !partnerSign}
                    className="w-full"
                  >
                    <Heart className="w-5 h-5 mr-2" />
                    Calculate Compatibility
                  </AppleStyleButton>
                </div>
              </div>
            </AppleStyleCard>

            {result && (
              <AppleStyleCard className="mt-6">
                <div className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">
                      {result.yourSign.emoji} + {result.partnerSign.emoji}
                    </div>
                    <div className="text-5xl font-bold text-pink-600 dark:text-pink-400 mb-2">
                      {result.score}%
                    </div>
                    <div className={`text-2xl font-bold ${result.color} mb-2`}>
                      {result.compatibilityLevel}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {result.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                      <h3 className="font-bold text-green-800 dark:text-green-300 mb-2 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        Strengths
                      </h3>
                      <ul className="space-y-1">
                        {result.strengths.map((strength: string, i: number) => (
                          <li key={i} className="text-sm text-green-700 dark:text-green-300">
                            ✓ {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4">
                      <h3 className="font-bold text-orange-800 dark:text-orange-300 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Growth Areas
                      </h3>
                      <ul className="space-y-1">
                        {result.challenges.map((challenge: string, i: number) => (
                          <li key={i} className="text-sm text-orange-700 dark:text-orange-300">
                            • {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {result.elementMatch && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                        <p className="text-sm text-blue-800 dark:text-blue-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          You both share the {result.yourSign.element} element - this creates natural understanding!
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <ExportShareButtons
                      calculatorType="zodiac-compatibility"
                      inputs={{ yourSign, partnerSign }}
                      results={result}
                    />
                  </div>
                </div>
              </AppleStyleCard>
            )}
          </div>

          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <SidebarAd />
              <AutoAdSlot placement="sidebar" />
            </div>
          </div>
        </div>

        {showAI && result && (
          <div className="mt-12">
            <EnhancedAIAnalysis
              calculatorType="zodiac-compatibility"
              data={{
                yourSign,
                partnerSign,
                compatibilityScore: result.score,
                compatibilityLevel: result.compatibilityLevel,
                elementMatch: result.elementMatch,
                yourElement: result.yourSign.element,
                partnerElement: result.partnerSign.element
              }}
            />
          </div>
        )}

        <div className="my-12">
          <InFeedAd />
        </div>

        <div className="mt-12 prose prose-lg max-w-none dark:prose-invert">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Understanding Zodiac Compatibility: Your Complete Guide to Astrological Love
          </h2>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Have you ever wondered why you instantly click with some people while others feel like oil and water? The answer might be written in the stars! Our <strong>Zodiac Compatibility Calculator</strong> uses ancient astrological wisdom combined with modern AI insights to reveal the cosmic chemistry between you and your partner, crush, or potential match.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            What Is Zodiac Compatibility? 🌟
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Zodiac compatibility, also known as synastry in astrology, is the ancient practice of analyzing how two people's astrological signs interact with each other. Since the dawn of civilization, humans have looked to the stars for guidance in love and relationships. The zodiac compatibility system examines the fundamental characteristics, elements, and planetary rulers of each sign to determine relationship potential.
          </p>

          <p className="text-gray-600 dark:text-gray-300">
            Your sun sign (the zodiac sign you were born under) represents your core personality, ego, and fundamental approach to life. When two sun signs come together, they create a unique energetic dynamic that can range from harmonious and supportive to challenging and transformative. Understanding this cosmic connection helps you navigate relationships with greater awareness and compassion.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            The Four Elements: Foundation of Compatibility 🔥💨💧🌍
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            The twelve zodiac signs are divided into four elements, each representing different energy types and approaches to life. Understanding these elemental dynamics is crucial to decoding compatibility:
          </p>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-2xl p-6 my-6">
            <h4 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">🔥 Fire Signs: Aries, Leo, Sagittarius</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Fire signs are passionate, energetic, and spontaneous. They bring warmth, enthusiasm, and inspiration to relationships. Fire signs are most compatible with other Fire signs (sharing the same intense energy) and Air signs (Air fuels Fire). They thrive on excitement, adventure, and constant growth. In relationships, Fire signs are bold initiators who aren't afraid to chase what they want.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              <strong>Best Matches:</strong> Fellow Fire signs for passionate romance; Air signs for intellectual stimulation and freedom.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 my-6">
            <h4 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">🌍 Earth Signs: Taurus, Virgo, Capricorn</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Earth signs are grounded, practical, and dependable. They value stability, security, and tangible results. Earth signs are most compatible with other Earth signs (sharing the same values) and Water signs (Water nourishes Earth). They build relationships slowly and steadily, creating lasting foundations. Earth signs show love through practical support, loyalty, and creating comfortable environments.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              <strong>Best Matches:</strong> Fellow Earth signs for stable partnerships; Water signs for emotional depth and nurturing.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 my-6">
            <h4 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">💨 Air Signs: Gemini, Libra, Aquarius</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Air signs are intellectual, communicative, and social. They value mental connection, freedom, and ideas. Air signs are most compatible with other Air signs (sharing mental wavelength) and Fire signs (Fire is energized by Air). They need relationships that stimulate their minds and allow independence. Air signs express love through engaging conversation, sharing ideas, and maintaining social connections.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              <strong>Best Matches:</strong> Fellow Air signs for mental stimulation; Fire signs for excitement and shared adventures.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 my-6">
            <h4 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">💧 Water Signs: Cancer, Scorpio, Pisces</h4>
            <p className="text-gray-700 dark:text-gray-300">
              Water signs are emotional, intuitive, and sensitive. They value deep connections, emotional intimacy, and spiritual bonds. Water signs are most compatible with other Water signs (sharing emotional depth) and Earth signs (Earth contains and shapes Water). They seek soul-level connections and aren't satisfied with surface-level interactions. Water signs love through emotional availability, empathy, and creating safe spaces.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mt-2">
              <strong>Best Matches:</strong> Fellow Water signs for profound emotional bonds; Earth signs for security and grounding.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            How to Use the Zodiac Compatibility Calculator 💕
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Using our calculator is simple and fun! Just follow these steps to discover your cosmic connection:
          </p>

          <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
            <li><strong>Select Your Zodiac Sign:</strong> Click on your sun sign from the grid. Not sure of your sign? Check the dates displayed when you hover over each sign.</li>
            <li><strong>Select Your Partner's Sign:</strong> Choose the zodiac sign of your partner, crush, friend, or anyone you want to check compatibility with.</li>
            <li><strong>Calculate:</strong> Click the "Calculate Compatibility" button to reveal your cosmic connection score.</li>
            <li><strong>Read Your Results:</strong> Explore your compatibility percentage, strengths, challenges, and detailed insights.</li>
            <li><strong>Get AI Insights:</strong> Our advanced AI analyzes your pairing and provides personalized relationship advice and predictions.</li>
            <li><strong>Share Your Results:</strong> Share your compatibility score on social media or send it to your partner!</li>
          </ol>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Understanding Your Compatibility Score 📊
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Our calculator provides a compatibility score from 0-100%, but what do these numbers really mean?
          </p>

          <div className="space-y-4 my-6">
            <div className="bg-pink-50 dark:bg-pink-900/20 rounded-xl p-5 border-l-4 border-pink-500">
              <h4 className="font-bold text-pink-700 dark:text-pink-300 mb-2">90-100% - Soulmate Material ✨</h4>
              <p className="text-gray-700 dark:text-gray-300">
                This is as good as it gets! You share natural harmony, understanding, and chemistry. Your energies complement each other beautifully, creating a relationship that feels effortless and destined. These pairings often involve same-element signs or classically compatible combinations like Taurus-Cancer or Leo-Sagittarius.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-5 border-l-4 border-purple-500">
              <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2">80-89% - Highly Compatible 💕</h4>
              <p className="text-gray-700 dark:text-gray-300">
                You have excellent potential for a loving, lasting relationship. While there may be occasional friction, your fundamental compatibility is strong. You "get" each other on a deep level and can build something beautiful together with mutual effort and respect.
              </p>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border-l-4 border-blue-500">
              <h4 className="font-bold text-blue-700 dark:text-blue-300 mb-2">70-79% - Great Potential 💖</h4>
              <p className="text-gray-700 dark:text-gray-300">
                There's definitely a spark here! You share enough common ground to build a solid relationship, though you'll need to navigate some differences. These pairings often grow stronger over time as you learn to appreciate each other's unique qualities.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border-l-4 border-indigo-500">
              <h4 className="font-bold text-indigo-700 dark:text-indigo-300 mb-2">60-69% - Worth Exploring 💫</h4>
              <p className="text-gray-700 dark:text-gray-300">
                You have some natural differences, but that doesn't mean it won't work! Many successful relationships fall in this range. The key is communication, patience, and willingness to understand each other's perspectives. Opposites can attract and complement each other beautifully.
              </p>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-5 border-l-4 border-orange-500">
              <h4 className="font-bold text-orange-700 dark:text-orange-300 mb-2">Below 60% - Challenging Connection ⚡</h4>
              <p className="text-gray-700 dark:text-gray-300">
                This pairing requires extra work, understanding, and compromise. However, challenging doesn't mean impossible! Many couples with lower compatibility scores create thriving relationships through dedication and growth. These pairings often teach valuable life lessons and promote personal development.
              </p>
            </div>
          </div>

          <div className="my-12">
            <AutoAdSlot placement="mid-content" />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            The Most Compatible Zodiac Sign Pairings 💑
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            While any zodiac pairing can work with effort and love, certain combinations are cosmically blessed with natural harmony:
          </p>

          <div className="grid md:grid-cols-2 gap-6 my-6">
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-5">
              <div className="text-3xl mb-3">♈ + ♐</div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Aries + Sagittarius</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Both fire signs, this duo shares incredible energy, passion, and love for adventure. They inspire each other and never get bored!
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5">
              <div className="text-3xl mb-3">♉ + ♍</div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Taurus + Virgo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Two earth signs creating the ultimate stable partnership. They share values, work ethics, and build lasting security together.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-5">
              <div className="text-3xl mb-3">♊ + ♒</div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Gemini + Aquarius</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Air sign intellectual connection at its finest. Endless conversations, shared ideals, and mutual respect for independence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-5">
              <div className="text-3xl mb-3">♋ + ♏</div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Cancer + Scorpio</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Water signs creating the deepest emotional bond. Intuitive understanding, loyalty, and transformative love characterize this pairing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-5">
              <div className="text-3xl mb-3">♌ + ♎</div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Leo + Libra</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Fire meets air in a glamorous pairing. They bring out the best in each other and create a social, romantic relationship.
              </p>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-5">
              <div className="text-3xl mb-3">♑ + ♉</div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Capricorn + Taurus</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                The power couple of the zodiac. Ambitious, loyal, and committed to building empire together. Material and emotional success combined.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Beyond Sun Signs: The Complete Compatibility Picture 🎨
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            While our calculator focuses on sun sign compatibility (which represents about 30-40% of your astrological makeup), a complete compatibility analysis considers several factors:
          </p>

          <ul className="space-y-3 my-6">
            <li className="flex gap-3">
              <span className="text-pink-600 dark:text-pink-400 font-bold">🌙</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Moon Signs:</strong>
                <span className="text-gray-600 dark:text-gray-300"> Your emotional nature and how you process feelings. Moon sign compatibility is crucial for long-term emotional connection.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-purple-600 dark:text-purple-400 font-bold">💫</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Venus Signs:</strong>
                <span className="text-gray-600 dark:text-gray-300"> How you love and what you value in relationships. Venus compatibility determines romantic chemistry and affection styles.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-red-600 dark:text-red-400 font-bold">⚡</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Mars Signs:</strong>
                <span className="text-gray-600 dark:text-gray-300"> Your passion, drive, and how you handle conflict. Mars compatibility affects physical attraction and how you fight.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-bold">🗣️</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Mercury Signs:</strong>
                <span className="text-gray-600 dark:text-gray-300"> Communication style and mental processes. Mercury compatibility determines how well you understand each other.</span>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">📍</span>
              <div>
                <strong className="text-gray-900 dark:text-white">Rising Signs:</strong>
                <span className="text-gray-600 dark:text-gray-300"> Your outward personality and first impression. Rising sign compatibility affects initial attraction and social dynamics.</span>
              </div>
            </li>
          </ul>

          <div className="my-12">
            <InFeedAd index={1} />
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Common Zodiac Compatibility Questions Answered ❓
          </h3>

          <div className="space-y-6 my-6">
            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Can incompatible signs make a relationship work?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Absolutely! Zodiac compatibility provides insights into natural tendencies and challenges, but it doesn't determine destiny. Many "incompatible" couples create beautiful, lasting relationships through communication, effort, and genuine love. Sometimes the most growth comes from challenging pairings.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Should I only date compatible signs?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                No! While compatibility can make relationships easier, limiting yourself to only "compatible" signs means missing out on potentially amazing connections. Use astrology as a tool for understanding, not as a rigid rulebook. Every sign combination can work with the right people and circumstances.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">How accurate is zodiac compatibility?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Zodiac compatibility based on sun signs provides a general framework that many find surprisingly accurate. However, it's most effective when combined with understanding complete birth charts (including moon, Venus, Mars signs) and real-world relationship dynamics. Think of it as one tool in your relationship toolkit, not the only tool.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">What if my partner and I have low compatibility?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Low sun sign compatibility simply means you'll need to work harder to understand each other's perspectives and communication styles. It doesn't mean your relationship is doomed! Focus on the strengths you do share, practice active communication, and appreciate what your differences teach you. Many successful couples have "challenging" compatibility scores.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Can same sign couples work?</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Same sign relationships can be either wonderfully harmonious or frustratingly mirror-like. You'll understand each other deeply but might also amplify each other's weaknesses. Success depends on individual maturity levels and whether you've developed your sign's positive traits. Same sign couples often need to ensure they have enough differences in other areas (like moon or rising signs) to maintain balance.
              </p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Tips for Making Any Zodiac Pairing Work 💪
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Regardless of your compatibility score, these tips will strengthen any relationship:
          </p>

          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-6 my-6">
            <ol className="space-y-4 list-decimal list-inside text-gray-700 dark:text-gray-300">
              <li><strong>Understand Each Other's Love Language:</strong> Beyond zodiac signs, learn how your partner gives and receives love. Do they prefer words of affirmation, quality time, gifts, acts of service, or physical touch?</li>
              <li><strong>Communicate Openly:</strong> Don't assume your partner thinks like you do. Air signs need verbal expression, water signs need emotional validation, fire signs need enthusiasm, and earth signs need practical demonstrations.</li>
              <li><strong>Respect Differences:</strong> What makes you different can make your relationship stronger. Your partner's opposite traits might be exactly what you need for balance and growth.</li>
              <li><strong>Work on Yourself:</strong> The best thing you can do for your relationship is become the highest expression of your own sign. Evolved Aries is confident but not selfish, evolved Scorpio is deep but not controlling.</li>
              <li><strong>Create Shared Goals:</strong> Find common ground in what you want to build together, whether that's a home, family, business, or adventure-filled life.</li>
              <li><strong>Give Space When Needed:</strong> Fire and air signs especially need independence. Water and earth signs need emotional or physical security. Honor these needs without taking them personally.</li>
            </ol>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Why Use Our Zodiac Compatibility Calculator? 🌟
          </h3>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg my-6">
            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-pink-600 dark:text-pink-400 text-xl">✓</span>
                <div><strong>AI-Powered Insights:</strong> Get personalized relationship advice based on your specific pairing</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-600 dark:text-purple-400 text-xl">✓</span>
                <div><strong>Instant Results:</strong> No waiting - get your compatibility score in seconds</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                <div><strong>Comprehensive Analysis:</strong> See strengths, challenges, and element compatibility</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                <div><strong>Easy Sharing:</strong> Share results on social media with beautiful graphics</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-orange-600 dark:text-orange-400 text-xl">✓</span>
                <div><strong>100% Free:</strong> No hidden costs, subscriptions, or email requirements</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-600 dark:text-red-400 text-xl">✓</span>
                <div><strong>Mobile Friendly:</strong> Works perfectly on any device, anywhere</div>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            The Science and History Behind Zodiac Compatibility 📚
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Astrology dates back over 2,000 years, with roots in Babylonian, Egyptian, and Greek civilizations. The zodiac system we use today evolved from ancient observations of celestial patterns and their correlation with earthly events and human behavior. While modern science doesn't validate astrology as predictive, millions of people worldwide find value in its psychological insights and relationship frameworks.
          </p>

          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Carl Jung, the famous psychologist, extensively studied astrology and found archetypal patterns that aligned with his psychological theories. Many modern relationship therapists incorporate astrological awareness as one tool among many for understanding personality differences and communication styles. Whether you view astrology as cosmic truth or psychological symbolism, it provides a rich language for discussing relationship dynamics.
          </p>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
            Start Your Cosmic Love Journey Today! 💫
          </h3>

          <p className="text-gray-600 dark:text-gray-300">
            Ready to discover your cosmic connection? Use our free Zodiac Compatibility Calculator now to reveal the astrological chemistry between you and your partner, crush, or potential match. Get instant results, AI-powered insights, and shareable graphics perfect for social media!
          </p>

          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Remember: while the stars can guide us, love is ultimately created through choice, effort, and genuine connection. Use this calculator as a fun tool for understanding, not as a definitive verdict on your relationship's potential. Every pairing can work with the right people and commitment! ✨💕
          </p>
        </div>
          </div>
        </div>
      </div>
    </>
  );
}