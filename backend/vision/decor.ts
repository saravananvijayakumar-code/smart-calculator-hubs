import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openaiKey = secret("OpenAIKey");

export interface DecorStyleRequest {
  imageBase64: string;
}

export interface StyleMatch {
  styleName: string;
  confidence: number;
}

export interface DecorStyleResponse {
  topStyles: StyleMatch[];
  colorPalette: string[];
  enhancementTips: string[];
  summary: string;
}

export const analyzeDecorStyle = api(
  { method: "POST", path: "/vision/decor-style", expose: true },
  async (req: DecorStyleRequest): Promise<DecorStyleResponse> => {
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
                  text: `Analyze the interior design style of this room image. Return ONLY a JSON object with this exact format:
{
  "topStyles": [
    {"styleName": "Modern", "confidence": 0.85},
    {"styleName": "Minimalist", "confidence": 0.70},
    {"styleName": "Scandinavian", "confidence": 0.60}
  ],
  "colorPalette": ["#FFFFFF", "#F5F5F5", "#9E9E9E", "#424242", "#D4B896"],
  "enhancementTips": [
    "tip 1 to improve the space",
    "tip 2 to improve the space",
    "tip 3 to improve the space"
  ],
  "summary": "1-2 sentence description of the room's current style and aesthetic"
}

Identify up to 3 interior design styles from: Modern, Scandinavian, Bohemian, Industrial, Farmhouse, Mid-Century Modern, Minimalist, Coastal, Traditional, Contemporary, Rustic, Eclectic.

Provide 5 dominant colors as hex codes. Give practical, actionable tips to enhance the space. Be specific and helpful.`
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
          max_tokens: 600,
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
        topStyles: parsed.topStyles || [],
        colorPalette: parsed.colorPalette || [],
        enhancementTips: parsed.enhancementTips || [],
        summary: parsed.summary || "Unable to determine room style.",
      };
    } catch (error: any) {
      console.error("Decor style analysis error:", error);
      throw new Error(`Failed to analyze decor style: ${error.message}`);
    }
  }
);
