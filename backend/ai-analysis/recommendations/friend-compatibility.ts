import { FriendCompatibilityAnalysisData, AnalysisResponse } from "../types";

export async function analyzeFriendCompatibility(
  data: FriendCompatibilityAnalysisData
): Promise<AnalysisResponse> {
  const { friend1, friend2, results } = data;
  const { totalScore, categoryScores, friendshipType, strengths, potentialConflicts } = results;

  const summary = generateSummary(friend1.name, friend2.name, totalScore, friendshipType, categoryScores);
  const recommendations = generateRecommendations(categoryScores, friendshipType, totalScore);
  const keyInsights = generateKeyInsights(categoryScores, strengths, friend1, friend2);
  const riskFactors = generateRiskFactors(categoryScores, potentialConflicts);
  const nextSteps = generateNextSteps(friendshipType, categoryScores, totalScore);

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps,
  };
}

function generateSummary(
  name1: string,
  name2: string,
  totalScore: number,
  friendshipType: string,
  categoryScores: any
): string {
  const level = totalScore >= 80 ? "exceptional" : totalScore >= 70 ? "strong" : totalScore >= 60 ? "good" : "developing";
  const topCategory = Object.entries(categoryScores)
    .sort(([, a]: any, [, b]: any) => b - a)[0][0];

  return `${name1} and ${name2} show a ${level} friendship compatibility at ${totalScore}%. As ${friendshipType}, your strongest connection is in ${topCategory} (${categoryScores[topCategory]}%). This friendship has great potential for ${totalScore >= 70 ? 'deep, lasting bonds' : 'growth and meaningful connection'} with ${totalScore >= 80 ? 'minimal' : 'some'} areas to develop.`;
}

function generateRecommendations(
  categoryScores: any,
  friendshipType: string,
  totalScore: number
): any[] {
  const recommendations = [];

  const lowestCategory = Object.entries(categoryScores)
    .sort(([, a]: any, [, b]: any) => a - b)[0];
  const [weakestArea, weakestScore] = lowestCategory as [string, number];

  if (weakestScore < 60) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: `Strengthen Your ${weakestArea.charAt(0).toUpperCase() + weakestArea.slice(1)}`,
      description: `Your ${weakestArea} score of ${weakestScore}% indicates room for growth. This is a key area that could significantly enhance your friendship quality.`,
      actionItems: getImprovementActions(weakestArea as string),
      estimatedImpact: `Could improve overall compatibility by 10-15%`,
    });
  }

  if (categoryScores.communication >= 80) {
    recommendations.push({
      type: "optimization",
      priority: "medium",
      title: "Leverage Your Strong Communication",
      description: `With a ${categoryScores.communication}% communication score, you have an excellent foundation. Use this strength to address any challenges openly.`,
      actionItems: [
        "Schedule regular catch-up sessions to maintain connection",
        "Use your communication skills to discuss expectations",
        "Share feelings honestly when something bothers you",
        "Practice active listening during conversations",
      ],
      estimatedImpact: "Maintains and deepens friendship quality",
    });
  }

  if (categoryScores.humor >= 75) {
    recommendations.push({
      type: "strategy",
      priority: "low",
      title: "Nurture Your Shared Humor",
      description: `Your ${categoryScores.humor}% humor compatibility is a treasure. Laughter is one of the strongest friendship bonds - keep cultivating it!`,
      actionItems: [
        "Share funny memes or videos regularly",
        "Watch comedy shows or stand-up together",
        "Create inside jokes and reference them",
        "Don't take yourselves too seriously during disagreements",
      ],
      estimatedImpact: "Strengthens emotional resilience in friendship",
    });
  }

  if (categoryScores.interests < 65) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Discover Shared Interests",
      description: `At ${categoryScores.interests}%, you could benefit from finding more common ground in hobbies and activities.`,
      actionItems: [
        "Try each other's favorite hobbies with an open mind",
        "Find a new activity neither has tried before",
        "Join a club or class together",
        "Create a shared hobby bucket list",
        "Attend events related to each other's interests",
      ],
      estimatedImpact: "Could boost overall compatibility by 15-20%",
    });
  }

  const activityRec = getFriendshipTypeRecommendation(friendshipType, categoryScores);
  if (activityRec) {
    recommendations.push(activityRec);
  }

  return recommendations;
}

function getImprovementActions(category: string): string[] {
  const actionMap: Record<string, string[]> = {
    communication: [
      "Set up regular video or phone calls",
      "Practice sharing both good news and struggles",
      "Ask open-ended questions about each other's lives",
      "Be vulnerable and share deeper thoughts",
      "Respond thoughtfully to messages, not just with emojis",
    ],
    humor: [
      "Share what makes you laugh - memes, shows, jokes",
      "Don't be afraid to be silly together",
      "Learn each other's humor style preferences",
      "Use humor to diffuse tension during disagreements",
      "Laugh at yourselves and create inside jokes",
    ],
    loyalty: [
      "Show up when your friend needs you",
      "Keep confidences and private information sacred",
      "Defend your friend when they're not present",
      "Be consistent and reliable with commitments",
      "Support each other's decisions even when you disagree",
    ],
    adventure: [
      "Plan spontaneous outings or trips together",
      "Try new restaurants, activities, or experiences",
      "Push each other out of comfort zones gently",
      "Create a shared bucket list of adventures",
      "Say yes to invitations more often",
    ],
    emotional: [
      "Check in during tough times, not just celebrations",
      "Share your feelings more openly",
      "Validate each other's emotions without judgment",
      "Be present during difficult conversations",
      "Celebrate wins and mourn losses together",
    ],
    interests: [
      "Try each other's favorite hobbies",
      "Find a new shared interest to explore together",
      "Attend events related to each other's passions",
      "Share articles or content about your interests",
      "Join a club or group together",
    ],
  };

  return actionMap[category] || [
    "Spend more quality time together",
    "Be open and honest in communication",
    "Show appreciation for each other",
  ];
}

function getFriendshipTypeRecommendation(
  friendshipType: string,
  categoryScores: any
): any | null {
  const typeMap: Record<string, any> = {
    "Adventure Buddies": {
      type: "strategy",
      priority: "medium",
      title: "Plan Your Next Adventure",
      description: "As Adventure Buddies, your friendship thrives on new experiences. Keep the momentum going with planned adventures.",
      actionItems: [
        "Create a shared adventure bucket list",
        "Plan a weekend trip to somewhere new",
        "Try an activity neither of you has done",
        "Document your adventures with photos/videos",
        "Challenge each other to try something scary",
      ],
      estimatedImpact: "Maintains high friendship satisfaction",
    },
    "Comedy Partners": {
      type: "strategy",
      priority: "medium",
      title: "Keep the Laughter Rolling",
      description: "Your friendship is built on shared humor. Continue nurturing this special connection through laughter.",
      actionItems: [
        "Have regular comedy show marathons",
        "Share funny content throughout the week",
        "Create a collection of inside jokes",
        "Play games that encourage silliness",
        "Attend comedy shows or improv together",
      ],
      estimatedImpact: "Strengthens emotional bond",
    },
    "Soul Friends": {
      type: "optimization",
      priority: "high",
      title: "Deepen Your Soul Connection",
      description: "Soul friendships are rare and precious. Invest in maintaining this profound connection.",
      actionItems: [
        "Schedule deep conversation sessions regularly",
        "Share your dreams, fears, and life philosophy",
        "Support each other through major life decisions",
        "Create rituals or traditions unique to your friendship",
        "Be each other's accountability partner",
      ],
      estimatedImpact: "Transforms friendship into lifelong bond",
    },
    "Hobby Partners": {
      type: "strategy",
      priority: "medium",
      title: "Level Up Your Shared Hobby",
      description: "Your friendship centers on shared interests. Deepen your connection by advancing together.",
      actionItems: [
        "Set shared goals in your hobby",
        "Attend workshops or classes together",
        "Join a club or community around your interest",
        "Challenge each other to improve",
        "Collaborate on a project together",
      ],
      estimatedImpact: "Increases time spent together",
    },
    "Chat Champions": {
      type: "optimization",
      priority: "medium",
      title: "Enhance Your Communication",
      description: "You excel at staying connected. Use this strength to maintain and deepen your friendship.",
      actionItems: [
        "Mix up communication methods - calls, video, texts",
        "Share daily moments, not just big events",
        "Have virtual hangouts doing activities together",
        "Send voice notes for more personal touch",
        "Plan in-person meetups when possible",
      ],
      estimatedImpact: "Prevents friendship from becoming superficial",
    },
    "Ride or Die": {
      type: "optimization",
      priority: "high",
      title: "Maintain Your Unwavering Bond",
      description: "Ride or Die friendships are built on loyalty. Continue showing up for each other.",
      actionItems: [
        "Be there for the unglamorous moments, not just celebrations",
        "Tell hard truths when needed with compassion",
        "Defend each other when not present",
        "Remember important dates and milestones",
        "Check in during tough times without being asked",
      ],
      estimatedImpact: "Solidifies lifelong friendship",
    },
  };

  return typeMap[friendshipType] || null;
}

function generateKeyInsights(
  categoryScores: any,
  strengths: string[],
  friend1: any,
  friend2: any
): string[] {
  const insights = [];

  const avgScore = (Object.values(categoryScores) as number[]).reduce((a, b) => a + b, 0) / 6;
  const highScores = Object.entries(categoryScores).filter(([, score]) => (score as number) >= 75);
  const lowScores = Object.entries(categoryScores).filter(([, score]) => (score as number) < 60);

  insights.push(
    `Your friendship shows ${highScores.length >= 4 ? 'exceptional balance' : highScores.length >= 2 ? 'good balance' : 'room for growth'} across compatibility dimensions`
  );

  if (categoryScores.communication >= 75 && categoryScores.emotional >= 75) {
    insights.push(
      "Strong emotional intelligence and communication create a foundation for deep, lasting friendship"
    );
  }

  if (categoryScores.loyalty >= 80) {
    insights.push(
      "Your high loyalty score indicates a trustworthy foundation - the hallmark of true friendship"
    );
  }

  if (categoryScores.interests >= 80) {
    insights.push(
      "Shared interests provide natural bonding opportunities and quality time together"
    );
  }

  const ageDiff = Math.abs(parseInt(friend1.age) - parseInt(friend2.age));
  if (ageDiff <= 3) {
    insights.push(
      "Similar life stages can make it easier to relate to each other's experiences and challenges"
    );
  } else if (ageDiff >= 10) {
    insights.push(
      "Your age difference brings diverse perspectives - embrace learning from each other's experiences"
    );
  }

  if (highScores.length >= 4) {
    insights.push(
      "Multiple high compatibility areas indicate a well-rounded friendship with strong potential for longevity"
    );
  }

  return insights.slice(0, 5);
}

function generateRiskFactors(
  categoryScores: any,
  potentialConflicts: string[]
): string[] {
  const risks = [];

  const criticallyLow = Object.entries(categoryScores).filter(
    ([, score]: any) => score < 50
  );

  if (criticallyLow.length >= 2) {
    risks.push(
      `Multiple areas scoring below 50% may create friction - focus on improving ${criticallyLow.map(([cat]) => cat).join(' and ')}`
    );
  }

  if (categoryScores.communication < 60) {
    risks.push(
      "Low communication scores can lead to misunderstandings - prioritize open, honest dialogue"
    );
  }

  if (categoryScores.loyalty < 55) {
    risks.push(
      "Building trust takes time - be consistent, reliable, and keep confidences to strengthen loyalty"
    );
  }

  if (categoryScores.emotional < 55) {
    risks.push(
      "Limited emotional connection may prevent deep bonding - try being more vulnerable with each other"
    );
  }

  if (
    categoryScores.interests < 55 &&
    categoryScores.adventure < 55 &&
    categoryScores.humor < 55
  ) {
    risks.push(
      "Limited shared enjoyment activities - actively seek common ground to prevent drifting apart"
    );
  }

  const avgScore = (Object.values(categoryScores) as number[]).reduce((a, b) => a + b, 0) / 6;
  if (avgScore < 60) {
    risks.push(
      "Overall compatibility below 60% suggests the friendship may require extra effort to maintain"
    );
  }

  return risks.length > 0 ? risks : ["No significant risk factors identified - maintain open communication"];
}

function generateNextSteps(
  friendshipType: string,
  categoryScores: any,
  totalScore: number
): string[] {
  const steps = [];

  steps.push("Schedule a fun activity together within the next week to strengthen your bond");

  const lowestCategory = Object.entries(categoryScores)
    .sort(([, a]: any, [, b]: any) => a - b)[0][0];

  steps.push(
    `Focus on improving ${lowestCategory} by implementing one suggestion from the recommendations above`
  );

  if (totalScore >= 80) {
    steps.push(
      "Your compatibility is excellent - maintain it by staying in regular contact and showing appreciation"
    );
  } else if (totalScore >= 70) {
    steps.push(
      "Build on your strong foundation by trying new experiences together and deepening conversations"
    );
  } else {
    steps.push(
      "Invest time in getting to know each other better through shared activities and open dialogue"
    );
  }

  if (categoryScores.communication >= 75) {
    steps.push(
      "Use your strong communication to discuss what you both want from the friendship"
    );
  } else {
    steps.push(
      "Practice more open and honest communication - share both the good and the challenging"
    );
  }

  steps.push(
    "Create a tradition unique to your friendship - it could be weekly calls, monthly adventures, or annual trips"
  );

  return steps.slice(0, 5);
}
