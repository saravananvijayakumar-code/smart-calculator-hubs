import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";
import type { VisionRequest, VisionResponse } from "./types";

const openaiKey = secret("OpenAIKey");

export const analyze = api(
  { method: "POST", path: "/vision/analyze", expose: true },
  async (req: VisionRequest): Promise<VisionResponse> => {
    const apiKey = openaiKey();
    
    if (!apiKey) {
      throw new Error("OpenAI API key not configured");
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
              content: [
                {
                  type: "text",
                  text: "Identify the food item(s) in this image. Return ONLY a JSON object with this exact format: {\"labels\": [{\"name\": \"food name\", \"confidence\": 0.95}], \"topFood\": \"most likely food name\", \"confidence\": 0.95}. Be specific with food names (e.g., 'pepperoni pizza slice', 'chocolate chip cookie', 'Big Mac burger'). If multiple food items, list up to 3."
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
          max_tokens: 300,
          temperature: 0.3,
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
        labels: parsed.labels || [],
        topFood: parsed.topFood || "Unknown food",
        confidence: parsed.confidence || 0.5,
      };
    } catch (error: any) {
      console.error("Vision API error:", error);
      throw new Error(`Failed to analyze image: ${error.message}`);
    }
  }
);
