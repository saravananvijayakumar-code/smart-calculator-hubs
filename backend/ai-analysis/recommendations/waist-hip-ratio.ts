import { WaistToHipRatioAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateWaistToHipRatioRecommendations(
  data: WaistToHipRatioAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const gender = data.gender || 'female';
  const isLowRisk = data.riskLevel === 'low';
  const isModerateRisk = data.riskLevel === 'moderate';
  const isHighRisk = data.riskLevel === 'high';
  const isVeryHighRisk = data.riskLevel === 'very-high';

  // Summary based on risk level
  let summary = '';
  if (isLowRisk) {
    summary = `Your waist-to-hip ratio of ${data.ratio.toFixed(2)} indicates low health risk with a ${data.bodyShape} body shape. Continue maintaining your healthy lifestyle!`;
  } else if (isModerateRisk) {
    summary = `Your waist-to-hip ratio of ${data.ratio.toFixed(2)} indicates moderate health risk. Small lifestyle changes can help improve your body composition and reduce cardiovascular risk.`;
  } else if (isHighRisk) {
    summary = `Your waist-to-hip ratio of ${data.ratio.toFixed(2)} indicates elevated health risk. Taking action now to reduce abdominal fat can significantly improve your long-term health outcomes.`;
  } else {
    summary = `Your waist-to-hip ratio of ${data.ratio.toFixed(2)} indicates very high health risk. We strongly recommend consulting with a healthcare provider for personalized guidance on reducing cardiovascular and metabolic disease risk.`;
  }

  // Risk-specific recommendations
  if (isVeryHighRisk || isHighRisk) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Cardiovascular Risk Reduction",
      description: "Your WHR indicates elevated visceral fat, which significantly increases cardiovascular disease risk.",
      actionItems: [
        "Schedule comprehensive health screening with your doctor",
        "Get blood pressure, cholesterol, and blood sugar checked",
        "Consider working with a registered dietitian",
        "Start moderate-intensity cardio exercise (150+ min/week)",
        "Focus on stress management and quality sleep"
      ]
    });

    riskFactors.push(
      "Elevated risk of heart disease and type 2 diabetes",
      "Higher likelihood of metabolic syndrome",
      "Increased cardiovascular inflammation",
      "Greater risk of hypertension and stroke"
    );

    if (isVeryHighRisk) {
      riskFactors.push(
        "Significantly elevated risk requiring medical supervision",
        "Potential underlying metabolic dysfunction"
      );
    }
  }

  if (isModerateRisk) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Preventive Health Strategy",
      description: "You're in the moderate risk zone - the perfect time to make changes before problems develop.",
      actionItems: [
        "Increase daily physical activity and aim for 10,000 steps",
        "Reduce processed foods and added sugars",
        "Monitor your measurements monthly",
        "Add strength training 2-3 times per week",
        "Manage stress through mindfulness or meditation"
      ]
    });

    keyInsights.push(
      "Small improvements can move you from moderate to low risk",
      "Visceral fat responds well to lifestyle changes"
    );
  }

  if (isLowRisk) {
    recommendations.push({
      type: "strategy",
      priority: "low",
      title: "Maintain Healthy Body Composition",
      description: "Your healthy WHR indicates good fat distribution. Continue your current lifestyle to maintain this.",
      actionItems: [
        "Continue regular physical activity",
        "Maintain balanced, nutritious diet",
        "Monitor measurements every 3-6 months",
        "Focus on overall wellness, not just measurements",
        "Keep stress levels manageable"
      ]
    });

    keyInsights.push(
      "Your body fat distribution is healthy",
      "Lower risk of obesity-related diseases",
      "Good metabolic health indicators"
    );
  }

  // Exercise recommendations for all levels
  const exercisePriority = isVeryHighRisk || isHighRisk ? "high" : isModerateRisk ? "medium" : "low";
  recommendations.push({
    type: "strategy",
    priority: exercisePriority,
    title: "Targeted Exercise Strategy",
    description: "Cardio preferentially targets visceral fat, while strength training improves body composition.",
    actionItems: [
      "Cardiovascular exercise: 150-300 minutes moderate intensity weekly",
      "Strength training: 2-3 sessions per week, all major muscle groups",
      "Core exercises: Planks, side planks, bird dogs for postural support",
      "HIIT training: 1-2 sessions weekly for advanced fat burning",
      "Daily movement: Break up sitting time with frequent activity"
    ],
    estimatedImpact: "5-10% WHR reduction possible in 3-6 months with consistent effort"
  });

  // Nutrition recommendations
  recommendations.push({
    type: "optimization",
    priority: isVeryHighRisk || isHighRisk ? "high" : "medium",
    title: "Nutrition for Fat Distribution",
    description: "Dietary changes can significantly reduce visceral fat and improve WHR.",
    actionItems: [
      "Reduce refined carbohydrates and added sugars",
      "Increase protein intake (25-30% of calories)",
      "Focus on whole foods: vegetables, fruits, lean proteins, whole grains",
      "Increase soluble fiber from oats, beans, apples, citrus",
      "Limit alcohol consumption (especially beer and sugary cocktails)",
      "Stay well-hydrated with water throughout the day"
    ],
    estimatedImpact: "Combined with exercise, dietary changes yield best results"
  });

  // Lifestyle factors
  if (isHighRisk || isVeryHighRisk) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Lifestyle Risk Factors",
      description: "Stress and poor sleep directly contribute to abdominal fat storage.",
      actionItems: [
        "Prioritize 7-9 hours of quality sleep nightly",
        "Practice stress management daily (meditation, yoga, deep breathing)",
        "Reduce cortisol-spiking activities and chronic stress",
        "Consider counseling if stress/anxiety are chronic issues",
        "Build strong social connections for stress buffering"
      ]
    });
  }

  // Key insights
  keyInsights.push(
    `WHR is often a better cardiovascular risk predictor than BMI`,
    `Visceral fat is metabolically active and produces inflammatory substances`,
    gender === 'female' 
      ? "Women's WHR typically increases after menopause due to hormonal changes"
      : "Men naturally store more abdominal fat due to testosterone patterns"
  );

  if (!isLowRisk) {
    keyInsights.push(
      "Even 5-10% body weight reduction can significantly improve WHR",
      "Cardio exercise preferentially targets visceral (abdominal) fat"
    );
  }

  // Next steps
  if (isVeryHighRisk) {
    nextSteps.push(
      "Schedule medical consultation within the next week",
      "Get comprehensive metabolic screening (blood work)",
      "Start tracking daily food intake and activity levels",
      "Begin with gentle exercise (walking 20-30 min daily)",
      "Consider medical weight loss program if BMI is also elevated"
    );
  } else if (isHighRisk) {
    nextSteps.push(
      "Schedule check-up with healthcare provider within the month",
      "Start cardiovascular exercise routine this week",
      "Eliminate sugary drinks and reduce processed foods",
      "Track your measurements monthly to monitor progress",
      "Consider working with a dietitian for personalized guidance"
    );
  } else if (isModerateRisk) {
    nextSteps.push(
      "Increase daily physical activity starting this week",
      "Make one dietary improvement (e.g., reduce added sugars)",
      "Monitor waist and hip measurements monthly",
      "Add strength training to your weekly routine",
      "Focus on stress reduction and sleep quality"
    );
  } else {
    nextSteps.push(
      "Continue current healthy lifestyle habits",
      "Monitor measurements every 3-6 months",
      "Maintain regular physical activity and balanced diet",
      "Stay informed about health and wellness",
      "Adjust habits if lifestyle changes occur"
    );
  }

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}
