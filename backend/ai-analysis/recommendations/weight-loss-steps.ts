import { WeightLossStepsAnalysisData, Recommendation } from "../types";

export function generateWeightLossStepsRecommendations(data: WeightLossStepsAnalysisData): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // BMI-based recommendations
  if (data.currentBMI > 30) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Consult Healthcare Professional",
      description: "With a BMI over 30, it's important to work with a healthcare provider to create a safe weight loss plan.",
      actionItems: [
        "Schedule an appointment with your doctor before starting",
        "Consider working with a registered dietitian",
        "Monitor your progress with regular check-ins"
      ],
      estimatedImpact: "Reduces health risks and ensures safe weight loss"
    });
  }

  // Weekly weight loss rate recommendations
  if (data.weeklyWeightLoss > 1) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Weight Loss Rate Too Aggressive",
      description: "Losing more than 1-2 pounds per week may not be sustainable and could lead to muscle loss.",
      actionItems: [
        "Consider extending your timeframe for safer weight loss",
        "Aim for 0.5-1 kg (1-2 lbs) per week maximum",
        "Focus on sustainable lifestyle changes"
      ],
      estimatedImpact: "Improves long-term success and health outcomes"
    });
  }

  // Steps per day recommendations
  if (data.stepsPerDay > 15000) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "High Daily Step Goal",
      description: "Your target requires over 15,000 steps daily. Consider breaking this into manageable sessions.",
      actionItems: [
        "Split walking into 3-4 sessions throughout the day",
        "Start with 8,000-10,000 steps and gradually increase",
        "Include activities like taking stairs, parking farther away",
        "Consider low-impact alternatives on rest days"
      ],
      estimatedImpact: "Improves adherence and reduces injury risk"
    });
  } else if (data.stepsPerDay < 5000) {
    recommendations.push({
      type: "opportunity",
      priority: "low",
      title: "Achievable Daily Goal",
      description: "Your step goal is very achievable. Consider adding strength training for better results.",
      actionItems: [
        "Add 2-3 strength training sessions per week",
        "Include bodyweight exercises like push-ups and squats",
        "Consider increasing intensity with brisk walking or intervals"
      ],
      estimatedImpact: "Enhances muscle retention and metabolism"
    });
  }

  // Distance and practical recommendations
  if (data.distancePerDay > 10) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Long Daily Distance",
      description: `Walking ${data.distancePerDay.toFixed(1)} km daily requires significant time commitment.`,
      actionItems: [
        "Plan 1.5-2 hours for walking time",
        "Choose safe, well-lit routes for longer walks",
        "Invest in proper walking shoes and clothing",
        "Consider treadmill or indoor alternatives for bad weather"
      ],
      estimatedImpact: "Improves consistency and safety"
    });
  }

  // Nutrition and hydration
  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Combine with Proper Nutrition",
    description: "Walking alone may not be sufficient. Combine with a balanced diet for optimal results.",
    actionItems: [
      "Create a moderate caloric deficit through diet",
      "Focus on protein intake to preserve muscle mass",
      "Stay hydrated, especially during longer walks",
      "Track your food intake alongside your steps"
    ],
    estimatedImpact: "Significantly improves weight loss results"
  });

  // Progressive approach
  if (data.timeframeDays > 90) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Long-term Commitment Strategy",
      description: "Your goal requires sustained effort over several months. Plan for plateaus and motivation challenges.",
      actionItems: [
        "Set monthly mini-goals to track progress",
        "Vary your walking routes to maintain interest",
        "Find a walking buddy or join a walking group",
        "Prepare for weight loss plateaus and adjust as needed"
      ],
      estimatedImpact: "Improves long-term adherence and success"
    });
  }

  // Recovery and injury prevention
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Injury Prevention",
    description: "Prevent overuse injuries from increased daily walking.",
    actionItems: [
      "Start gradually and increase steps by 10% weekly",
      "Include rest days or light activity days",
      "Stretch after walks, focusing on calves and hamstrings",
      "Listen to your body and reduce intensity if needed"
    ],
    estimatedImpact: "Prevents setbacks and maintains consistency"
  });

  return recommendations;
}