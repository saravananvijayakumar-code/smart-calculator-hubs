import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import type { PlantAnalysisRequest, PlantAnalysisResponse } from "./types";

const openaiKey = secret("OpenAIKey");

export const analyzePlant = api(
  { method: "POST", path: "/vision/plant", expose: true },
  async (req: PlantAnalysisRequest): Promise<PlantAnalysisResponse> => {
    const apiKey = openaiKey();
    
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
    }

    const locationContext = req.userLocation 
      ? `The user is located in ${req.userLocation}. Provide region-specific care advice considering this climate.` 
      : "";

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
              content: [
                {
                  type: "text",
                  text: `Analyze this plant image and provide comprehensive information. ${locationContext}

Return ONLY a JSON object with this exact format:
{
  "plantName": "Common name of the plant",
  "scientificName": "Scientific name (optional)",
  "healthStatus": "Healthy|Underwatered|Overwatered|Diseased|Unknown",
  "confidence": 0.95,
  "summary": "A friendly 100-word summary about the plant and its current condition",
  "careTips": {
    "wateringFrequency": "e.g., Water once a week or when soil is dry",
    "sunlightPreference": "e.g., Bright indirect light or Full sun",
    "temperatureRange": "e.g., 18-24°C (65-75°F)",
    "commonProblems": ["Problem 1", "Problem 2"],
    "remedies": ["Solution 1", "Solution 2"]
  },
  "regionSpecificAdvice": "Climate-specific advice if location provided"
}

Be specific and helpful. If unsure about the plant, set confidence below 0.6 and indicate this in the summary.`
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${req.imageBase64}`
                  }
                }
              ]
            }
          ],
          max_tokens: 800,
          temperature: 0.4,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI Vision API error: ${response.status} - ${errorText}`);
      }

      const data: any = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      const cleanedContent = content.trim().replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const parsed = JSON.parse(cleanedContent);

      return {
        plantName: parsed.plantName || "Unknown Plant",
        scientificName: parsed.scientificName,
        healthStatus: parsed.healthStatus || "Unknown",
        confidence: parsed.confidence || 0.5,
        summary: parsed.summary || "Unable to analyze plant clearly. Please retake with better lighting.",
        careTips: parsed.careTips || {
          wateringFrequency: "N/A",
          sunlightPreference: "N/A",
          temperatureRange: "N/A",
          commonProblems: [],
          remedies: []
        },
        regionSpecificAdvice: parsed.regionSpecificAdvice,
      };
    } catch (error: any) {
      console.error("Plant Vision API error:", error);
      throw new Error(`Failed to analyze plant image: ${error.message}`);
    }
  }
);
