import type { LoveCompatibilityAnalysisData, Recommendation } from "../types";

export function generateLoveCompatibilityRecommendations(
  data: LoveCompatibilityAnalysisData
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const { compatibilityPercentage, zodiacCompatibility, communicationScore, emotionalScore, lifeGoalsScore } = data;

  if (compatibilityPercentage >= 80) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Exceptional Connection - Nurture It! 💖",
      description: `Your ${compatibilityPercentage}% compatibility is rare and beautiful! This strong foundation suggests natural harmony and understanding.`,
      actionItems: [
        "Celebrate your connection with quality time together",
        "Keep communication open and honest to maintain trust",
        "Don't take the good times for granted—appreciate each other daily",
        "Continue building shared experiences and memories"
      ],
      estimatedImpact: "Strong foundation for long-lasting relationship"
    });
  } else if (compatibilityPercentage >= 65) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Solid Foundation - Keep Building 💫",
      description: `Your ${compatibilityPercentage}% compatibility shows promise! With effort and understanding, this relationship can flourish.`,
      actionItems: [
        "Focus on your strengths as a couple",
        "Work on areas where you differ with patience",
        "Regular date nights to strengthen your bond",
        "Practice active listening and empathy"
      ],
      estimatedImpact: "Good potential for growth and happiness together"
    });
  } else {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Growth Opportunity - Work Together 💪",
      description: `Your ${compatibilityPercentage}% compatibility suggests challenges ahead. However, with commitment and communication, relationships can thrive!`,
      actionItems: [
        "Honest conversation about expectations and goals",
        "Seek to understand each other's perspectives",
        "Find common ground and shared interests",
        "Consider couples counseling for professional guidance",
        "Be patient—good relationships take work"
      ],
      estimatedImpact: "Requires significant effort but growth is possible"
    });
  }

  if (zodiacCompatibility >= 85) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Cosmic Alignment ✨",
      description: `Your star signs (${data.partner1StarSign} and ${data.partner2StarSign}) have exceptional cosmic compatibility at ${zodiacCompatibility}%!`,
      actionItems: [
        "Your natural energies complement each other beautifully",
        "Lean into your shared values and worldview",
        "Trust your instincts about this connection"
      ],
      estimatedImpact: "Natural chemistry and understanding"
    });
  } else if (zodiacCompatibility < 60) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Different Cosmic Energies 🌟",
      description: `${data.partner1StarSign} and ${data.partner2StarSign} have contrasting energies. This can bring balance or friction.`,
      actionItems: [
        "Embrace your differences as opportunities to learn",
        "Find the balance between your contrasting approaches",
        "Appreciate what each person brings to the relationship",
        "Focus on emotional connection over astrological compatibility"
      ],
      estimatedImpact: "Different perspectives can create growth"
    });
  }

  if (communicationScore < 65) {
    recommendations.push({
      type: "optimization",
      priority: "high",
      title: "Improve Communication 💬",
      description: "Communication is the foundation of any relationship. Your scores suggest room for improvement here.",
      actionItems: [
        "Schedule regular check-ins to discuss feelings",
        "Practice active listening without interrupting",
        "Use 'I feel' statements instead of accusations",
        "Validate each other's emotions even when you disagree",
        "Consider communication workshops or exercises"
      ],
      estimatedImpact: "Better communication strengthens all aspects of relationship"
    });
  }

  if (emotionalScore >= 80) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Strong Emotional Bond ❤️",
      description: "Your emotional connection is exceptional! This is a powerful foundation for lasting love.",
      actionItems: [
        "Maintain emotional intimacy through vulnerability",
        "Support each other during challenging times",
        "Celebrate emotional milestones together",
        "Keep the emotional connection alive with small gestures"
      ],
      estimatedImpact: "Deep emotional understanding fuels relationship success"
    });
  }

  if (lifeGoalsScore < 60) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Align Your Life Goals 🎯",
      description: "You may have different visions for the future. Address this early to avoid later conflicts.",
      actionItems: [
        "Discuss your individual life goals openly",
        "Find areas where your visions overlap",
        "Be willing to compromise on non-essentials",
        "Create shared goals you can work toward together",
        "Revisit this conversation regularly as you grow"
      ],
      estimatedImpact: "Aligned goals are crucial for long-term success"
    });
  }

  recommendations.push({
    type: "strategy",
    priority: "low",
    title: "Keep It Fun & Fresh! 🎉",
    description: "Compatibility is just one piece of the puzzle. Keep dating, laughing, and growing together!",
    actionItems: [
      "Try new experiences together regularly",
      "Surprise each other with thoughtful gestures",
      "Maintain individual hobbies and friendships",
      "Never stop dating each other",
      "Laugh together often—humor heals"
    ],
    estimatedImpact: "Fun and spontaneity keep relationships vibrant"
  });

  return recommendations;
}
