import { api } from "encore.dev/api";
import { secret } from "encore.dev/config";

const openaiKey = secret("OpenAIKey");

export interface PetBreedRequest {
  imageBase64: string;
}

export interface PetBreedResponse {
  breedName: string;
  scientificName?: string;
  confidence: number;
  description: string;
  funFacts: string[];
  similarBreeds: string[];
  petType: "dog" | "cat" | "unknown";
}

export const analyzePetBreed = api(
  { method: "POST", path: "/vision/pet-breed", expose: true },
  async (req: PetBreedRequest): Promise<PetBreedResponse> => {
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
                  text: `Identify the dog or cat breed in this image. Return ONLY a JSON object with this exact format:
{
  "breedName": "breed name (e.g., Labrador Retriever, Siamese)",
  "scientificName": "scientific name if applicable (e.g., Canis lupus familiaris)",
  "confidence": 0.95,
  "description": "brief 1-2 sentence description of the breed",
  "funFacts": ["fact 1", "fact 2", "fact 3"],
  "similarBreeds": ["breed 1", "breed 2", "breed 3"],
  "petType": "dog or cat"
}

Be specific with breed identification. If unsure, provide the closest match and lower the confidence score accordingly. Include interesting, accurate fun facts about the breed.`
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
          max_tokens: 500,
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
        breedName: parsed.breedName || "Unknown Breed",
        scientificName: parsed.scientificName,
        confidence: parsed.confidence || 0.5,
        description: parsed.description || "Unable to determine breed description.",
        funFacts: parsed.funFacts || [],
        similarBreeds: parsed.similarBreeds || [],
        petType: parsed.petType || "unknown",
      };
    } catch (error: any) {
      console.error("Pet breed analysis error:", error);
      throw new Error(`Failed to analyze pet breed: ${error.message}`);
    }
  }
);
