import { CalorieAnalysisData, Recommendation } from "../types";

export function generateCalorieRecommendations(data: CalorieAnalysisData): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // BMI-based health recommendations
  if (data.currentBMI < 18.5) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Underweight - Healthy Weight Gain Needed",
      description: "Your BMI indicates you're underweight. Focus on healthy weight gain through nutritious, calorie-dense foods.",
      actionItems: [
        "Consult with a healthcare provider or registered dietitian",
        "Focus on nutrient-dense, calorie-rich foods like nuts, avocados, and lean proteins",
        "Add healthy fats and complex carbohydrates to each meal",
        "Consider strength training to build lean muscle mass",
        "Avoid empty calories from processed foods"
      ],
      estimatedImpact: "Improved health markers and reduced risk of nutrient deficiencies"
    });
  } else if (data.currentBMI > 30) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Medical Supervision Recommended",
      description: "With a BMI over 30, consider working with healthcare professionals for a comprehensive weight management plan.",
      actionItems: [
        "Schedule appointment with your primary care physician",
        "Consider consultation with a registered dietitian",
        "Discuss potential underlying health conditions",
        "Monitor blood pressure, blood sugar, and cholesterol levels",
        "Start with gradual lifestyle changes rather than extreme restrictions"
      ],
      estimatedImpact: "Reduced health risks and improved long-term outcomes"
    });
  } else if (data.currentBMI > 25) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Weight Management Opportunity",
      description: "Your BMI is in the overweight range. A moderate calorie deficit can help achieve a healthy weight.",
      actionItems: [
        "Focus on whole, unprocessed foods",
        "Include regular physical activity in your routine",
        "Practice portion control and mindful eating",
        "Track your food intake for better awareness"
      ],
      estimatedImpact: "Improved health markers and reduced disease risk"
    });
  }

  // Calorie deficit/surplus recommendations based on goal
  if (data.goal.includes('lose')) {
    const deficit = data.maintenanceCalories - data.targetCalories;
    
    if (deficit > 750) {
      recommendations.push({
        type: "warning",
        priority: "high",
        title: "Aggressive Calorie Deficit",
        description: "Your calorie deficit is quite aggressive and may not be sustainable long-term.",
        actionItems: [
          "Consider a more moderate deficit of 300-500 calories",
          "Ensure adequate protein intake to preserve muscle mass",
          "Plan diet breaks every 6-8 weeks",
          "Monitor energy levels and workout performance",
          "Focus on nutrient-dense foods to meet vitamin/mineral needs"
        ],
        estimatedImpact: "Better adherence and muscle preservation"
      });
    }

    if (data.targetCalories < data.bmr) {
      recommendations.push({
        type: "warning",
        priority: "high",
        title: "Calories Below BMR",
        description: "Your target calories are below your BMR, which can slow metabolism and cause muscle loss.",
        actionItems: [
          "Increase daily calories to at least match your BMR",
          "Add more physical activity instead of cutting calories further",
          "Focus on strength training to maintain muscle mass",
          "Consider a less aggressive weight loss timeline"
        ],
        estimatedImpact: "Preserved metabolism and muscle mass"
      });
    }
  }

  if (data.goal.includes('gain')) {
    const surplus = data.targetCalories - data.maintenanceCalories;
    
    if (surplus > 750) {
      recommendations.push({
        type: "warning",
        priority: "medium",
        title: "Large Calorie Surplus",
        description: "A very large surplus may lead to excessive fat gain rather than muscle growth.",
        actionItems: [
          "Consider reducing surplus to 300-500 calories above maintenance",
          "Implement a structured resistance training program",
          "Focus on protein timing around workouts",
          "Monitor body composition changes, not just weight"
        ],
        estimatedImpact: "More muscle gain, less fat accumulation"
      });
    }

    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Optimize Muscle Building",
      description: "To maximize muscle growth during weight gain, focus on resistance training and protein intake.",
      actionItems: [
        "Perform resistance training 3-4 times per week",
        "Consume 20-30g protein every 3-4 hours",
        "Time protein intake around workouts",
        "Include progressive overload in your training",
        "Get adequate sleep (7-9 hours) for recovery"
      ],
      estimatedImpact: "Improved muscle-to-fat ratio during weight gain"
    });
  }

  // Protein intake recommendations
  const proteinPerKg = data.proteinNeeds / (data.weightUnit === 'kg' ? data.weight : data.weight * 0.453592);
  
  if (proteinPerKg < 1.2) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Increase Protein Intake",
      description: "Your protein intake may be insufficient for optimal muscle maintenance and satiety.",
      actionItems: [
        "Aim for 1.6-2.2g protein per kg body weight",
        "Include protein at every meal and snack",
        "Choose high-quality protein sources",
        "Consider protein timing around workouts",
        "Track protein intake to ensure adequacy"
      ],
      estimatedImpact: "Better muscle maintenance and increased satiety"
    });
  }

  // Activity level recommendations
  if (data.activityLevel === 'sedentary') {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Increase Physical Activity",
      description: "Your sedentary lifestyle limits calorie burn and overall health benefits.",
      actionItems: [
        "Start with 150 minutes of moderate aerobic activity per week",
        "Include 2-3 resistance training sessions weekly",
        "Take regular walking breaks throughout the day",
        "Use stairs instead of elevators when possible",
        "Consider standing desk or walking meetings"
      ],
      estimatedImpact: "Increased calorie burn and improved health markers"
    });
  }

  // Hydration recommendations
  const waterPerKg = data.waterNeeds / (data.weightUnit === 'kg' ? data.weight : data.weight * 0.453592);
  
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Optimize Hydration",
    description: `You need approximately ${(data.waterNeeds / 1000).toFixed(1)} liters of water daily for optimal health.`,
    actionItems: [
      "Drink water before, during, and after exercise",
      "Start each day with a glass of water",
      "Monitor urine color as a hydration indicator",
      "Increase water intake in hot weather or during illness",
      "Include water-rich foods like fruits and vegetables"
    ],
    estimatedImpact: "Improved metabolism, energy, and appetite regulation"
  });

  // Macronutrient distribution recommendations
  const carbPercent = (data.carbNeeds * 4) / data.maintenanceCalories * 100;
  const fatPercent = (data.fatNeeds * 9) / data.maintenanceCalories * 100;
  
  if (carbPercent < 30) {
    recommendations.push({
      type: "strategy",
      priority: "low",
      title: "Consider Carbohydrate Intake",
      description: "Your carbohydrate intake is quite low, which may affect energy and performance.",
      actionItems: [
        "Include complex carbohydrates around workouts",
        "Focus on nutrient-dense carb sources like vegetables and fruits",
        "Monitor energy levels and workout performance",
        "Adjust carb intake based on activity level"
      ],
      estimatedImpact: "Improved energy and exercise performance"
    });
  }

  // Age-specific recommendations
  if (data.age > 50) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Age-Specific Nutrition Considerations",
      description: "As we age, nutritional needs change and metabolism may slow down.",
      actionItems: [
        "Increase protein intake to 1.2-1.6g per kg to combat muscle loss",
        "Ensure adequate calcium and vitamin D intake",
        "Focus on nutrient-dense foods due to lower calorie needs",
        "Include regular resistance training to maintain muscle mass",
        "Consider regular health screenings and blood work"
      ],
      estimatedImpact: "Better aging, maintained muscle mass, and bone health"
    });
  }

  // Gender-specific recommendations
  if (data.gender === 'female') {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Female-Specific Nutrition Considerations",
      description: "Women have unique nutritional needs, especially regarding iron and hormonal health.",
      actionItems: [
        "Ensure adequate iron intake, especially if menstruating",
        "Include folate-rich foods for reproductive health",
        "Monitor energy availability to support hormonal function",
        "Avoid extremely low calorie intake which can affect menstrual cycle",
        "Consider calcium needs for bone health"
      ],
      estimatedImpact: "Improved hormonal health and reduced nutrient deficiencies"
    });
  }

  // Meal planning and consistency recommendations
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Implement Consistent Meal Planning",
    description: "Consistent meal planning and timing helps achieve calorie and macronutrient targets.",
    actionItems: [
      "Plan and prep meals in advance",
      "Use a food tracking app to monitor intake",
      "Eat at regular intervals to manage hunger",
      "Include a variety of foods to ensure nutrient adequacy",
      "Have backup meal options for busy days"
    ],
    estimatedImpact: "Better adherence to calorie goals and improved nutrition quality"
  });

  // Sustainability and lifestyle recommendations
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Focus on Sustainable Habits",
    description: "Long-term success requires building sustainable habits rather than following restrictive diets.",
    actionItems: [
      "Make gradual changes rather than drastic overhauls",
      "Include foods you enjoy within your calorie budget",
      "Practice mindful eating and hunger awareness",
      "Build a support system of friends and family",
      "Plan for social situations and special occasions",
      "Focus on progress, not perfection"
    ],
    estimatedImpact: "Improved long-term adherence and lifestyle satisfaction"
  });

  // Monitoring and adjustment recommendations
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Regular Monitoring and Adjustments",
    description: "Your calorie needs will change as your weight, activity level, and goals evolve.",
    actionItems: [
      "Weigh yourself weekly at the same time of day",
      "Take body measurements monthly",
      "Monitor energy levels and workout performance",
      "Recalculate calorie needs every 10-15 pounds of weight change",
      "Adjust based on real-world results, not just calculations"
    ],
    estimatedImpact: "Continued progress and goal achievement"
  });

  return recommendations;
}