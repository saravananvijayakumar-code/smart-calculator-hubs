import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import type { NutritionRequest, NutritionResponse } from "./types";

const openaiKey = secret("OpenAIKey");

export const getNutrition = api(
  { method: "POST", path: "/vision/nutrition", expose: true },
  async (req: NutritionRequest): Promise<NutritionResponse> => {
    const apiKey = openaiKey();

    if (!apiKey) {
      return fallbackNutritionEstimate(req.foodName);
    }

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `You are a nutrition expert. Provide calorie information for: "${req.foodName}". Return ONLY a JSON object with this exact format: {"name": "specific food name", "calories": number, "servingSize": "1 serving description", "protein": grams (optional), "carbs": grams (optional), "fat": grams (optional)}. Use standard serving sizes. Be accurate and specific.`
            }
          ],
          max_tokens: 200,
          temperature: 0.1,
        }),
      });

      if (!response.ok) {
        console.error(`OpenAI Nutrition API error: ${response.status}`);
        return fallbackNutritionEstimate(req.foodName);
      }

      const data: any = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        return fallbackNutritionEstimate(req.foodName);
      }

      const cleanedContent = content.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const parsed = JSON.parse(cleanedContent);

      return {
        name: parsed.name || req.foodName,
        calories: Math.round(parsed.calories || 0),
        servingSize: parsed.servingSize || '1 serving',
        protein: parsed.protein ? Math.round(parsed.protein) : undefined,
        carbs: parsed.carbs ? Math.round(parsed.carbs) : undefined,
        fat: parsed.fat ? Math.round(parsed.fat) : undefined,
      };
    } catch (error: any) {
      console.error("Nutrition API error:", error);
      return fallbackNutritionEstimate(req.foodName);
    }
  }
);

function fallbackNutritionEstimate(foodName: string): NutritionResponse {
  const lowerFood = foodName.toLowerCase();
  
  const commonFoods: Record<string, number> = {
    'pizza': 285,
    'burger': 540,
    'hamburger': 540,
    'cheeseburger': 563,
    'big mac': 563,
    'fries': 365,
    'french fries': 365,
    'donut': 250,
    'doughnut': 250,
    'cookie': 150,
    'chocolate': 235,
    'candy': 200,
    'ice cream': 207,
    'cake': 350,
    'soda': 140,
    'cola': 140,
    'coffee': 5,
    'latte': 190,
    'frappuccino': 420,
    'sandwich': 350,
    'burrito': 510,
    'taco': 170,
    'hot dog': 290,
    'chicken': 250,
    'salad': 150,
    'pasta': 400,
    'rice': 200,
    'bread': 80,
    'bagel': 280,
    'muffin': 425,
    'chips': 150,
    'apple': 95,
    'banana': 105,
    'orange': 62,
  };

  for (const [key, calories] of Object.entries(commonFoods)) {
    if (lowerFood.includes(key)) {
      return {
        name: foodName,
        calories,
        servingSize: '1 serving',
      };
    }
  }

  return {
    name: foodName,
    calories: 250,
    servingSize: '1 serving (estimated)',
  };
}
