import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import OpenAI from "openai";

const openaiKey = secret("OpenAIKey");

export interface Partner {
  name: string;
  birthday: string;
  starSign: string;
}

export interface CompatibilityRequest {
  partner1: Partner;
  partner2: Partner;
}

export interface TraitMatch {
  trait: string;
  score: number;
  description: string;
}

export interface CompatibilityResponse {
  compatibilityPercentage: number;
  overallMatch: string;
  traitBreakdown: TraitMatch[];
  funFact: string;
  strengths: string[];
  challenges: string[];
  zodiacCompatibility: number;
  numerologyScore: number;
  birthdayHarmony: number;
}

const zodiacSigns = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const zodiacElements: Record<string, string> = {
  "Aries": "Fire", "Leo": "Fire", "Sagittarius": "Fire",
  "Taurus": "Earth", "Virgo": "Earth", "Capricorn": "Earth",
  "Gemini": "Air", "Libra": "Air", "Aquarius": "Air",
  "Cancer": "Water", "Scorpio": "Water", "Pisces": "Water"
};

const zodiacCompatibilityMatrix: Record<string, Record<string, number>> = {
  "Fire": { "Fire": 85, "Earth": 60, "Air": 90, "Water": 50 },
  "Earth": { "Fire": 60, "Earth": 80, "Air": 65, "Water": 85 },
  "Air": { "Fire": 90, "Earth": 65, "Air": 85, "Water": 60 },
  "Water": { "Fire": 50, "Earth": 85, "Air": 60, "Water": 90 }
};

function getZodiacElement(sign: string): string {
  return zodiacElements[sign] || "Unknown";
}

function calculateZodiacCompatibility(sign1: string, sign2: string): number {
  const element1 = getZodiacElement(sign1);
  const element2 = getZodiacElement(sign2);
  
  if (element1 === "Unknown" || element2 === "Unknown") {
    return 70;
  }
  
  return zodiacCompatibilityMatrix[element1]?.[element2] || 70;
}

function calculateNumerologyScore(name1: string, name2: string): number {
  const nameValue = (name: string): number => {
    return name.toLowerCase().split('').reduce((sum, char) => {
      const code = char.charCodeAt(0);
      if (code >= 97 && code <= 122) {
        return sum + (code - 96);
      }
      return sum;
    }, 0) % 9 || 9;
  };
  
  const value1 = nameValue(name1);
  const value2 = nameValue(name2);
  
  const diff = Math.abs(value1 - value2);
  return Math.max(50, 100 - (diff * 8));
}

function calculateBirthdayHarmony(date1: string, date2: string): number {
  try {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    const day1 = d1.getDate();
    const day2 = d2.getDate();
    const month1 = d1.getMonth();
    const month2 = d2.getMonth();
    
    let harmony = 70;
    
    if (month1 === month2) {
      harmony += 15;
    }
    
    const dayDiff = Math.abs(day1 - day2);
    if (dayDiff <= 3) {
      harmony += 10;
    } else if (dayDiff <= 7) {
      harmony += 5;
    }
    
    const monthDiff = Math.abs(month1 - month2);
    if (monthDiff === 6) {
      harmony += 10;
    } else if (monthDiff === 3 || monthDiff === 9) {
      harmony += 5;
    }
    
    return Math.min(100, harmony);
  } catch {
    return 70;
  }
}

function generateTraitBreakdown(
  zodiacScore: number,
  numerologyScore: number,
  birthdayScore: number
): TraitMatch[] {
  return [
    {
      trait: "Emotional Connection",
      score: Math.round((zodiacScore + numerologyScore) / 2),
      description: zodiacScore >= 80 
        ? "Strong emotional match! Your feelings align beautifully."
        : zodiacScore >= 60 
        ? "Moderate emotional connection. Communication is key."
        : "Different emotional wavelengths. Understanding required."
    },
    {
      trait: "Communication",
      score: Math.round((numerologyScore + 10 + Math.random() * 20)),
      description: numerologyScore >= 75
        ? "Excellent communication flow! You understand each other intuitively."
        : numerologyScore >= 60
        ? "Good communication with occasional misunderstandings."
        : "Different communication styles. Practice active listening."
    },
    {
      trait: "Life Goals Alignment",
      score: Math.round((birthdayScore + zodiacScore) / 2),
      description: birthdayScore >= 80
        ? "Your life paths are beautifully aligned!"
        : birthdayScore >= 65
        ? "Compatible goals with room for individual pursuits."
        : "Different life directions. Compromise is essential."
    },
    {
      trait: "Energy & Vibe",
      score: Math.round(zodiacScore * 0.9 + Math.random() * 10),
      description: zodiacScore >= 85
        ? "Amazing energy match! You energize each other."
        : zodiacScore >= 65
        ? "Good energy balance with complementary vibes."
        : "Different energy levels. Find your rhythm together."
    },
    {
      trait: "Long-term Potential",
      score: Math.round((zodiacScore + numerologyScore + birthdayScore) / 3),
      description: ((zodiacScore + numerologyScore + birthdayScore) / 3) >= 75
        ? "Strong foundation for lasting relationship!"
        : ((zodiacScore + numerologyScore + birthdayScore) / 3) >= 60
        ? "Solid potential with effort and commitment."
        : "Challenging but not impossible. Growth required."
    }
  ];
}

function generateFunFact(sign1: string, sign2: string, percentage: number): string {
  const facts = [
    `${sign1} and ${sign2} make a ${percentage >= 75 ? 'dynamic' : 'interesting'} duo!`,
    `You're ${percentage}% compatible! ${percentage >= 80 ? 'The stars are smiling!' : percentage >= 60 ? 'Not bad at all!' : 'Room for growth!'}`,
    `Legend says ${sign1}-${sign2} pairs ${percentage >= 70 ? 'create magic together' : 'bring out each other\'s hidden sides'}.`,
    `Your compatibility score suggests ${percentage >= 75 ? 'this could be the one!' : percentage >= 60 ? 'a promising connection!' : 'an adventure ahead!'}`,
    `Statistical analysis shows ${percentage}% alignment—${percentage >= 80 ? 'rare and beautiful!' : 'authentically unique!'}`
  ];
  
  return facts[Math.floor(Math.random() * facts.length)];
}

function generateStrengthsAndChallenges(
  percentage: number,
  sign1: string,
  sign2: string,
  traitBreakdown: TraitMatch[]
): { strengths: string[]; challenges: string[] } {
  const strengths: string[] = [];
  const challenges: string[] = [];
  
  traitBreakdown.forEach(trait => {
    if (trait.score >= 75) {
      strengths.push(`${trait.trait}: ${trait.description.split('.')[0]}`);
    } else if (trait.score < 60) {
      challenges.push(`${trait.trait}: Work on ${trait.trait.toLowerCase()}`);
    }
  });
  
  if (percentage >= 80) {
    strengths.push("Natural chemistry and understanding");
    strengths.push("Shared values and vision for the future");
  } else if (percentage < 60) {
    challenges.push("Different approaches to life and love");
    challenges.push("Requires patience and compromise");
  }
  
  if (strengths.length === 0) {
    strengths.push("Unique perspectives bring fresh insights");
    strengths.push("Opportunity for personal growth together");
  }
  
  if (challenges.length === 0) {
    challenges.push("Don't take the good times for granted");
    challenges.push("Keep communication open and honest");
  }
  
  return { strengths, challenges };
}

export const calculate = api(
  { method: "POST", path: "/compatibility/calculate", expose: true },
  async (req: CompatibilityRequest): Promise<CompatibilityResponse> => {
    const { partner1, partner2 } = req;
    
    const zodiacScore = calculateZodiacCompatibility(partner1.starSign, partner2.starSign);
    const numerologyScore = calculateNumerologyScore(partner1.name, partner2.name);
    const birthdayScore = calculateBirthdayHarmony(partner1.birthday, partner2.birthday);
    
    const openai = new OpenAI({ apiKey: openaiKey() });
    
    const prompt = `You are an expert relationship analyst combining astrology, numerology, and relationship psychology. Analyze the compatibility between these two people and provide accurate, personalized insights.

Partner 1:
- Name: ${partner1.name}
- Birthday: ${partner1.birthday}
- Star Sign: ${partner1.starSign}

Partner 2:
- Name: ${partner2.name}
- Birthday: ${partner2.birthday}
- Star Sign: ${partner2.starSign}

Base Compatibility Scores:
- Zodiac Compatibility: ${zodiacScore}%
- Numerology Score: ${numerologyScore}%
- Birthday Harmony: ${birthdayScore}%

Provide a JSON response with the following structure:
{
  "compatibilityPercentage": number (0-100, weighted analysis of all factors),
  "overallMatch": string (e.g., "Exceptional Match! ✨", "Great Match! 💫", etc.),
  "traitBreakdown": [
    {"trait": "Emotional Connection", "score": number, "description": string},
    {"trait": "Communication", "score": number, "description": string},
    {"trait": "Life Goals Alignment", "score": number, "description": string},
    {"trait": "Energy & Vibe", "score": number, "description": string},
    {"trait": "Long-term Potential", "score": number, "description": string}
  ],
  "funFact": string (interesting, personalized fact about their compatibility),
  "strengths": [array of 3-4 specific relationship strengths],
  "challenges": [array of 3-4 specific areas to work on]
}

Be specific, insightful, and encouraging. Base your analysis on:
1. Zodiac sign elemental compatibility and personality traits
2. Numerological name vibrations and energy alignment
3. Birthday harmony and cosmic timing
4. Real relationship psychology principles

Provide accurate, thoughtful insights that feel personalized to these specific individuals. Return ONLY valid JSON, no markdown formatting.`;

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an expert relationship compatibility analyst. Always respond with valid JSON only, no markdown code blocks or formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      const cleanedResponse = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const aiResponse = JSON.parse(cleanedResponse);
      
      return {
        compatibilityPercentage: aiResponse.compatibilityPercentage,
        overallMatch: aiResponse.overallMatch,
        traitBreakdown: aiResponse.traitBreakdown,
        funFact: aiResponse.funFact,
        strengths: aiResponse.strengths,
        challenges: aiResponse.challenges,
        zodiacCompatibility: zodiacScore,
        numerologyScore,
        birthdayHarmony: birthdayScore
      };
    } catch (error) {
      console.error('AI analysis failed, falling back to algorithmic calculation:', error);
      
      const compatibilityPercentage = Math.round(
        (zodiacScore * 0.4 + numerologyScore * 0.3 + birthdayScore * 0.3)
      );
      
      const overallMatch = 
        compatibilityPercentage >= 85 ? "Exceptional Match! ✨" :
        compatibilityPercentage >= 75 ? "Great Match! 💫" :
        compatibilityPercentage >= 65 ? "Good Match! ⭐" :
        compatibilityPercentage >= 55 ? "Moderate Match 🌟" :
        "Challenging Match 💪";
      
      const traitBreakdown = generateTraitBreakdown(zodiacScore, numerologyScore, birthdayScore);
      const funFact = generateFunFact(partner1.starSign, partner2.starSign, compatibilityPercentage);
      const { strengths, challenges } = generateStrengthsAndChallenges(
        compatibilityPercentage,
        partner1.starSign,
        partner2.starSign,
        traitBreakdown
      );
      
      return {
        compatibilityPercentage,
        overallMatch,
        traitBreakdown,
        funFact,
        strengths,
        challenges,
        zodiacCompatibility: zodiacScore,
        numerologyScore,
        birthdayHarmony: birthdayScore
      };
    }
  }
);
