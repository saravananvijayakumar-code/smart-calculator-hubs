import { 
  BMIAnalysisData, 
  PercentageAnalysisData, 
  AgeAnalysisData, 
  UnitConverterAnalysisData, 
  CurrencyConverterAnalysisData, 
  TipAnalysisData, 
  AnalysisResponse, 
  Recommendation 
} from "../types";

export function generateBMIRecommendations(
  data: BMIAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // BMI category recommendations
  switch (data.category.toLowerCase()) {
    case 'underweight':
      recommendations.push({
        type: "warning",
        priority: "high",
        title: "Underweight Health Concerns",
        description: `BMI of ${data.bmi.toFixed(1)} indicates you are underweight.`,
        actionItems: [
          "Consult healthcare provider for personalized weight gain plan",
          "Focus on nutrient-dense, calorie-rich foods",
          "Include strength training to build muscle mass",
          "Monitor for underlying health conditions"
        ]
      });
      riskFactors.push("Being underweight may increase risk of nutritional deficiencies and bone loss");
      break;

    case 'normal':
      keyInsights.push(`Healthy BMI of ${data.bmi.toFixed(1)} - maintain current lifestyle`);
      recommendations.push({
        type: "strategy",
        priority: "low",
        title: "Maintain Healthy Weight",
        description: "Continue current healthy habits to maintain optimal BMI.",
        actionItems: [
          "Maintain balanced diet with variety of nutrients",
          "Continue regular physical activity (150 min/week moderate exercise)",
          "Monitor weight regularly but don't obsess",
          "Focus on overall health, not just weight"
        ]
      });
      break;

    case 'overweight':
      recommendations.push({
        type: "warning",
        priority: "medium",
        title: "Overweight Health Risks",
        description: `BMI of ${data.bmi.toFixed(1)} indicates you are overweight.`,
        actionItems: [
          "Aim to lose 5-10% of body weight gradually",
          "Increase physical activity to 250+ minutes per week",
          "Focus on portion control and nutrient-dense foods",
          "Consider consulting a dietitian for personalized plan"
        ]
      });
      riskFactors.push("Being overweight increases risk of diabetes, heart disease, and other health conditions");
      break;

    case 'obese':
      recommendations.push({
        type: "warning",
        priority: "high",
        title: "Obesity Health Risks",
        description: `BMI of ${data.bmi.toFixed(1)} indicates obesity, which poses significant health risks.`,
        actionItems: [
          "Consult healthcare provider immediately for comprehensive evaluation",
          "Consider medically supervised weight loss program",
          "Focus on sustainable lifestyle changes, not quick fixes",
          "Address any underlying medical conditions"
        ]
      });
      riskFactors.push("Obesity significantly increases risk of diabetes, heart disease, stroke, and certain cancers");
      break;
  }

  // Ideal weight range recommendation
  if (data.category.toLowerCase() !== 'normal') {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Target Weight Range",
      description: `Ideal weight range for your height: ${data.idealWeightRange.min}-${data.idealWeightRange.max} ${data.unit === 'metric' ? 'kg' : 'lbs'}`,
      actionItems: [
        "Set realistic weekly weight loss/gain goals (1-2 lbs/week)",
        "Track progress with measurements, not just weight",
        "Focus on building healthy habits rather than quick results",
        "Consider body composition, not just BMI"
      ]
    });
  }

  // Lifestyle recommendations
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Holistic Health Approach",
    description: "BMI is just one indicator - focus on overall health and fitness.",
    actionItems: [
      "Include both cardio and strength training in routine",
      "Prioritize sleep quality (7-9 hours per night)",
      "Manage stress through meditation or relaxation techniques",
      "Stay hydrated and limit processed foods"
    ]
  });

  keyInsights.push(`Current BMI: ${data.bmi.toFixed(1)} (${data.category})`);
  keyInsights.push(`Height: ${data.height} ${data.unit === 'metric' ? 'cm' : 'inches'}, Weight: ${data.weight} ${data.unit === 'metric' ? 'kg' : 'lbs'}`);
  
  nextSteps.push("Consult healthcare provider for personalized health assessment");
  nextSteps.push("Set realistic and sustainable health goals");
  nextSteps.push("Track progress through multiple health indicators");

  const summary = `Your BMI of ${data.bmi.toFixed(1)} falls in the ${data.category} category with ${data.riskLevel} health risk level.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generatePercentageRecommendations(
  data: PercentageAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Different recommendations based on calculation type
  switch (data.type) {
    case 'discount':
      recommendations.push({
        type: "opportunity",
        priority: "low",
        title: "Smart Shopping Strategy",
        description: "Use percentage calculations for better financial decisions.",
        actionItems: [
          "Compare percentage discounts across different retailers",
          "Calculate actual dollar savings, not just percentages",
          "Consider price per unit for bulk purchases",
          "Factor in total cost including taxes and fees"
        ]
      });
      keyInsights.push("Understanding percentages helps make informed purchasing decisions");
      break;

    case 'tip':
      recommendations.push({
        type: "strategy",
        priority: "low",
        title: "Tipping Guidelines",
        description: "Use consistent percentage-based tipping for budgeting.",
        actionItems: [
          "Standard restaurant tip: 18-22% for good service",
          "Adjust tip percentage based on service quality",
          "Factor tips into dining budget calculations",
          "Consider cultural norms when traveling"
        ]
      });
      break;

    case 'tax':
      recommendations.push({
        type: "strategy",
        priority: "medium",
        title: "Tax Planning Strategy",
        description: "Understanding tax percentages helps with financial planning.",
        actionItems: [
          "Calculate effective vs marginal tax rates",
          "Plan for quarterly estimated tax payments",
          "Factor tax percentages into investment decisions",
          "Consider tax-advantaged accounts and strategies"
        ]
      });
      break;

    case 'investment':
      recommendations.push({
        type: "strategy",
        priority: "high",
        title: "Investment Return Analysis",
        description: "Use percentage returns for investment decision making.",
        actionItems: [
          "Calculate annualized returns for proper comparison",
          "Factor in fees and expenses to get net returns",
          "Consider risk-adjusted returns, not just percentages",
          "Compare returns to relevant benchmarks"
        ]
      });
      break;

    default:
      recommendations.push({
        type: "strategy",
        priority: "low",
        title: "Mathematical Literacy",
        description: "Strong percentage skills support better financial decisions.",
        actionItems: [
          "Practice percentage calculations for daily financial decisions",
          "Use percentages to compare options and evaluate deals",
          "Apply percentage concepts to budgeting and saving goals",
          "Understand compound percentage effects over time"
        ]
      });
  }

  // General financial literacy recommendation
  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Financial Literacy Development",
    description: "Strong math skills support better financial decision-making.",
    actionItems: [
      "Practice calculating percentages for budgeting and investing",
      "Use percentage-based goals for savings and debt reduction",
      "Understand how percentages apply to interest rates and returns",
      "Learn about compound interest and percentage growth over time"
    ]
  });

  keyInsights.push("Percentage calculations are fundamental to financial literacy");
  keyInsights.push("Understanding percentages helps evaluate deals, investments, and financial products");
  
  nextSteps.push("Apply percentage calculations to real-world financial decisions");
  nextSteps.push("Practice mental math for quick percentage estimates");

  const summary = `Percentage calculations are essential tools for making informed financial and everyday decisions.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateAgeRecommendations(
  data: AgeAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const age = data.currentAge.years;

  // Age-specific financial recommendations
  if (age < 25) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Early Career Financial Foundation",
      description: "Your young age is a huge advantage for long-term wealth building.",
      actionItems: [
        "Start investing early to maximize compound interest",
        "Build emergency fund of 3-6 months expenses",
        "Establish good credit history responsibly",
        "Invest in skills and education for career growth"
      ]
    });
  } else if (age < 35) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Wealth Building Phase",
      description: "Optimize your prime earning and investing years.",
      actionItems: [
        "Maximize retirement account contributions",
        "Consider aggressive growth investments",
        "Build substantial emergency fund",
        "Plan for major life goals (home, family)"
      ]
    });
  } else if (age < 50) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Peak Earning Years Strategy",
      description: "Focus on maximizing income and accelerating savings.",
      actionItems: [
        "Maximize retirement contributions and catch-up contributions",
        "Diversify investment portfolio appropriately",
        "Plan for children's education costs",
        "Consider estate planning and life insurance"
      ]
    });
  } else if (age < 65) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Pre-Retirement Planning",
      description: "Prepare for retirement transition and optimize final working years.",
      actionItems: [
        "Take advantage of catch-up contributions (age 50+)",
        "Gradually shift to more conservative investments",
        "Plan retirement income sources and withdrawal strategies",
        "Consider healthcare and long-term care planning"
      ]
    });
  } else {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Retirement and Legacy Planning",
      description: "Focus on income preservation and estate planning.",
      actionItems: [
        "Optimize retirement withdrawal strategies",
        "Plan for healthcare and long-term care costs",
        "Consider legacy planning and estate optimization",
        "Review insurance needs and beneficiaries"
      ]
    });
  }

  // Health and milestone planning
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Age-Appropriate Health Planning",
    description: "Plan for health and wellness based on your current age.",
    actionItems: [
      "Schedule regular health check-ups and screenings",
      "Consider health savings account (HSA) contributions",
      "Plan for potential long-term care needs",
      "Maintain active lifestyle and preventive care"
    ]
  });

  keyInsights.push(`Current age: ${age} years, ${data.currentAge.months} months, ${data.currentAge.days} days`);
  keyInsights.push(`Days until next birthday: ${data.daysUntilBirthday}`);
  
  if (data.lifeMilestones.length > 0) {
    keyInsights.push("Upcoming life milestones to plan for:");
    data.lifeMilestones.forEach(milestone => keyInsights.push(`• ${milestone}`));
  }
  
  nextSteps.push("Create age-appropriate financial goals and timelines");
  nextSteps.push("Review and adjust financial strategy based on life stage");
  nextSteps.push("Plan for upcoming life milestones and transitions");

  const summary = `At ${age} years old, you're in a prime position to optimize your financial strategy for your current life stage.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateUnitConverterRecommendations(
  data: UnitConverterAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Practical application recommendations
  recommendations.push({
    type: "strategy",
    priority: "low",
    title: "Practical Unit Conversion Applications",
    description: "Use unit conversions for better decision-making and planning.",
    actionItems: [
      "Convert units when comparing prices (price per unit weight/volume)",
      "Use conversions for international travel planning",
      "Apply conversions for home improvement and cooking projects",
      "Understand metric vs imperial systems for global communication"
    ]
  });

  // Category-specific recommendations
  switch (data.category.toLowerCase()) {
    case 'distance':
    case 'length':
      recommendations.push({
        type: "opportunity",
        priority: "low",
        title: "Distance/Length Conversion Benefits",
        description: "Understanding distance conversions helps with travel and planning.",
        actionItems: [
          "Use for international travel planning and navigation",
          "Apply to fitness goals (running distances, heights)",
          "Helpful for home improvement and construction projects",
          "Essential for understanding global measurements"
        ]
      });
      break;

    case 'weight':
    case 'mass':
      recommendations.push({
        type: "opportunity",
        priority: "low",
        title: "Weight/Mass Conversion Applications",
        description: "Weight conversions are useful for health and commerce.",
        actionItems: [
          "Track fitness and health goals across different systems",
          "Compare product weights when shopping internationally",
          "Useful for cooking and recipe conversions",
          "Important for shipping and logistics calculations"
        ]
      });
      break;

    case 'temperature':
      recommendations.push({
        type: "opportunity",
        priority: "low",
        title: "Temperature Conversion Uses",
        description: "Temperature conversions are essential for travel and science.",
        actionItems: [
          "Essential for international travel weather planning",
          "Important for cooking and food safety",
          "Useful for understanding global weather reports",
          "Necessary for scientific and medical applications"
        ]
      });
      break;
  }

  keyInsights.push(`Converted ${data.fromValue} ${data.fromUnit} to ${data.toValue} ${data.toUnit}`);
  keyInsights.push(`Conversion factor: 1 ${data.fromUnit} = ${data.conversionFactor} ${data.toUnit}`);
  keyInsights.push("Unit conversions are valuable for international communication and commerce");
  
  nextSteps.push("Practice mental estimation for common conversions");
  nextSteps.push("Use conversions for practical decision-making");
  nextSteps.push("Learn key conversion factors for frequently used units");

  const summary = `Successfully converted ${data.fromValue} ${data.fromUnit} to ${data.toValue} ${data.toUnit} in the ${data.category} category.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateCurrencyConverterRecommendations(
  data: CurrencyConverterAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Exchange rate awareness
  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Currency Exchange Strategy",
    description: "Understand exchange rates for better financial decisions.",
    actionItems: [
      "Monitor exchange rates for significant transactions",
      "Consider timing for large currency exchanges",
      "Factor in exchange fees and spreads when converting",
      "Use multi-currency accounts for frequent international transactions"
    ]
  });

  // Travel and international business
  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "International Financial Planning",
    description: "Plan for currency fluctuations in international activities.",
    actionItems: [
      "Budget for currency fluctuation when traveling",
      "Consider hedging strategies for international investments",
      "Use currency exchange apps for real-time rates",
      "Understand impact of exchange rates on international purchases"
    ]
  });

  // Investment considerations
  if (data.amount > 10000) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Large Currency Exchange Planning",
      description: "For large amounts, consider exchange rate optimization.",
      actionItems: [
        "Compare rates across different exchange providers",
        "Consider forward contracts for future exchanges",
        "Monitor economic factors affecting exchange rates",
        "Factor in tax implications of currency gains/losses"
      ]
    });
  }

  keyInsights.push(`Exchange rate: 1 ${data.fromCurrency} = ${data.exchangeRate} ${data.toCurrency}`);
  keyInsights.push(`Converted amount: ${data.convertedAmount.toLocaleString()} ${data.toCurrency}`);
  keyInsights.push(`Rate date: ${data.rateDate.toLocaleDateString()}`);
  
  if (Math.abs(data.exchangeRate - 1) > 0.1) {
    riskFactors.push("Exchange rates fluctuate and can impact the value of international transactions");
  }
  
  nextSteps.push("Monitor exchange rates for optimal conversion timing");
  nextSteps.push("Compare exchange providers for best rates and lowest fees");
  nextSteps.push("Consider currency risk in international financial planning");

  const summary = `Converted ${data.amount.toLocaleString()} ${data.fromCurrency} to ${data.convertedAmount.toLocaleString()} ${data.toCurrency} at rate ${data.exchangeRate}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}

export function generateTipRecommendations(
  data: TipAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  // Tipping strategy
  recommendations.push({
    type: "strategy",
    priority: "low",
    title: "Smart Tipping Strategy",
    description: "Develop consistent and fair tipping practices.",
    actionItems: [
      "Base tips on pre-tax amount for restaurant bills",
      "Adjust tip percentage based on service quality (15-25%)",
      "Factor tips into dining and service budgets",
      "Learn local tipping customs when traveling"
    ]
  });

  // Budget planning
  if (data.tipAmount > data.billAmount * 0.25) {
    recommendations.push({
      type: "warning",
      priority: "low",
      title: "High Tip Percentage",
      description: `Tip of ${data.tipPercentage}% is higher than typical range (15-25%).`,
      actionItems: [
        "Verify tip calculation is intentional",
        "Consider if exceptional service warrants high tip",
        "Budget appropriately for generous tipping habits",
        "Ensure tip aligns with your financial goals"
      ]
    });
  }

  // Group dining efficiency
  if (data.peopleCount > 1) {
    recommendations.push({
      type: "opportunity",
      priority: "low",
      title: "Group Dining Efficiency",
      description: "Simplify group payments and tip calculations.",
      actionItems: [
        "Use payment apps for easy bill splitting",
        "Calculate tip on total bill before splitting",
        "Designate one person to handle payment and collect shares",
        "Round up individual amounts for simplicity"
      ]
    });
  }

  // Financial awareness
  recommendations.push({
    type: "strategy",
    priority: "low",
    title: "Service Industry Financial Awareness",
    description: "Understanding tipping supports service workers and budgeting.",
    actionItems: [
      "Recognize that service workers often depend on tips",
      "Budget for tips when planning dining and service expenses",
      "Use tipping as opportunity to practice percentage calculations",
      "Consider impact of tips on total cost of services"
    ]
  });

  keyInsights.push(`Bill amount: $${data.billAmount.toFixed(2)}`);
  keyInsights.push(`Tip: $${data.tipAmount.toFixed(2)} (${data.tipPercentage}%)`);
  keyInsights.push(`Total: $${data.totalAmount.toFixed(2)}`);
  
  if (data.peopleCount > 1) {
    keyInsights.push(`Per person: $${data.amountPerPerson.toFixed(2)} (including tip)`);
  }
  
  nextSteps.push("Factor tips into service and dining budgets");
  nextSteps.push("Practice quick tip calculations for convenience");
  nextSteps.push("Learn tipping customs for different service types");

  const summary = `For a $${data.billAmount.toFixed(2)} bill, a ${data.tipPercentage}% tip of $${data.tipAmount.toFixed(2)} brings the total to $${data.totalAmount.toFixed(2)}${data.peopleCount > 1 ? ` ($${data.amountPerPerson.toFixed(2)} per person)` : ''}.`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}