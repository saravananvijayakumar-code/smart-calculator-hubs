export interface VisionRequest {
  imageBase64: string;
}

export interface FoodLabel {
  name: string;
  confidence: number;
}

export interface VisionResponse {
  labels: FoodLabel[];
  topFood: string;
  confidence: number;
}

export interface NutritionRequest {
  foodName: string;
}

export interface NutritionResponse {
  name: string;
  calories: number;
  servingSize?: string;
  protein?: number;
  carbs?: number;
  fat?: number;
}

export interface PlantAnalysisRequest {
  imageBase64: string;
  userLocation?: string;
}

export interface PlantCareTips {
  wateringFrequency: string;
  sunlightPreference: string;
  temperatureRange: string;
  commonProblems: string[];
  remedies: string[];
}

export interface PlantAnalysisResponse {
  plantName: string;
  scientificName?: string;
  healthStatus: "Healthy" | "Underwatered" | "Overwatered" | "Diseased" | "Unknown";
  confidence: number;
  summary: string;
  careTips: PlantCareTips;
  regionSpecificAdvice?: string;
}
