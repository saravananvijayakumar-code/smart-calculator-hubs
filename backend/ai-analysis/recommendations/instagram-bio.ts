import type { AnalysisResponse } from "../types";

interface InstagramBioData {
  bio: string;
  username: string;
  bioLength: number;
  hasEmojis: boolean;
  hasHashtags: boolean;
  hasCTA: boolean;
  hasLink: boolean;
  hasLineBreaks: boolean;
}

export function generateInstagramBioRecommendations(
  data: InstagramBioData
): AnalysisResponse {
  const score = calculateBioScore(data);
  const clarity = assessClarity(data);
  const engagement = calculateEngagementPotential(data);

  const recommendations = [];

  if (data.bioLength < 50) {
    recommendations.push({
      type: "optimization" as const,
      priority: "high" as const,
      title: "Bio Too Short",
      description: "Your bio is too brief. Use the full 150 characters to showcase your value.",
      actionItems: [
        "Add what you do and who you help",
        "Include a unique value proposition",
        "Add personality with emojis or humor",
        `Current length: ${data.bioLength}/150 characters`
      ]
    });
  }

  if (!data.hasEmojis) {
    recommendations.push({
      type: "engagement" as const,
      priority: "high" as const,
      title: "Add Emojis for Visual Appeal",
      description: "Emojis make your bio scannable and visually engaging.",
      actionItems: [
        "Use 2-4 relevant emojis to break up text",
        "Place emojis at the start of key phrases",
        "Choose emojis that align with your brand",
        "Avoid overusing emojis (keep it professional)"
      ]
    });
  }

  if (!data.hasCTA) {
    recommendations.push({
      type: "opportunity" as const,
      priority: "high" as const,
      title: "Missing Call-to-Action",
      description: "A clear CTA drives profile visitors to take action.",
      actionItems: [
        "Add a clear action: 'DM for collabs', 'Shop below 👇', 'Join my course'",
        "Use action verbs: Click, Shop, Join, Subscribe, Learn",
        "Point to your link with an arrow emoji",
        "Keep it short and direct"
      ]
    });
  }

  if (!data.hasLink) {
    recommendations.push({
      type: "warning" as const,
      priority: "high" as const,
      title: "No Link Detected",
      description: "You're missing out on traffic! Add a link to drive conversions.",
      actionItems: [
        "Add your website, landing page, or Linktree",
        "Reference the link in your bio ('Link below 👇')",
        "Update your link regularly for campaigns",
        "Track link clicks to measure bio effectiveness"
      ]
    });
  }

  if (!data.hasLineBreaks) {
    recommendations.push({
      type: "optimization" as const,
      priority: "medium" as const,
      title: "Improve Readability with Line Breaks",
      description: "Line breaks make your bio easier to scan and more visually appealing.",
      actionItems: [
        "Break your bio into 2-3 short lines",
        "Use emojis or symbols as bullet points",
        "Add spaces between key phrases",
        "Test readability on mobile (where most users view profiles)"
      ]
    });
  }

  if (!data.hasHashtags) {
    recommendations.push({
      type: "growth" as const,
      priority: "medium" as const,
      title: "Consider Adding a Branded Hashtag",
      description: "A branded hashtag helps build community and track user-generated content.",
      actionItems: [
        "Create a unique, memorable hashtag",
        "Place it at the end of your bio",
        "Encourage followers to use it",
        "Monitor the hashtag for engagement opportunities"
      ]
    });
  }

  recommendations.push({
    type: "strategy" as const,
    priority: "medium" as const,
    title: "Bio Optimization Strategy",
    description: "Follow the 3-part bio formula for maximum impact.",
    actionItems: [
      "Part 1: Who you are / What you do",
      "Part 2: Who you help / What value you provide",
      "Part 3: Call-to-action (what to do next)",
      "Test different versions and track profile visit conversion"
    ]
  });

  return {
    summary: `Your Instagram bio scored ${score}/100. ${clarity} It has ${engagement}% engagement potential. ${getScoreMessage(score)}`,
    recommendations,
    keyInsights: [
      `Bio character count: ${data.bioLength}/150`,
      `Visual elements: ${data.hasEmojis ? '✅ Emojis used' : '❌ No emojis'}`,
      `Action driver: ${data.hasCTA ? '✅ Has CTA' : '❌ Missing CTA'}`,
      `Link presence: ${data.hasLink ? '✅ Link included' : '❌ No link'}`,
      `Readability: ${data.hasLineBreaks ? '✅ Well-formatted' : '❌ Needs line breaks'}`,
      "First impressions matter—your bio is your elevator pitch"
    ],
    riskFactors: [
      ...(!data.hasCTA ? ["No CTA means missed conversion opportunities"] : []),
      ...(!data.hasLink ? ["No link = no traffic to your website or offers"] : []),
      ...(data.bioLength < 50 ? ["Short bio doesn't showcase your full value"] : []),
      ...(data.bioLength > 150 ? ["Bio will be truncated—stay under 150 characters"] : []),
      "Bio updates take effect immediately—test different versions"
    ],
    nextSteps: [
      "Rewrite your bio using the 3-part formula (who, what, CTA)",
      "Add 2-4 relevant emojis for visual appeal",
      "Include a clear call-to-action",
      "Add line breaks for readability",
      "Test your link and update it regularly",
      "Review top accounts in your niche for bio inspiration"
    ]
  };
}

function calculateBioScore(data: InstagramBioData): number {
  let score = 40;

  if (data.bioLength >= 80 && data.bioLength <= 150) score += 15;
  else if (data.bioLength >= 50) score += 10;

  if (data.hasEmojis) score += 15;
  if (data.hasCTA) score += 15;
  if (data.hasLink) score += 10;
  if (data.hasLineBreaks) score += 10;

  return Math.min(100, score);
}

function assessClarity(data: InstagramBioData): string {
  if (data.bioLength < 30) return "Your bio is very brief and may lack clarity.";
  if (data.bioLength > 150) return "Your bio exceeds Instagram's 150-character limit.";
  if (!data.hasLineBreaks && data.bioLength > 80) return "Your bio could be more scannable.";
  if (data.hasCTA && data.hasEmojis) return "Your bio is clear and actionable.";
  return "Your bio has room for improvement.";
}

function calculateEngagementPotential(data: InstagramBioData): number {
  let potential = 40;

  if (data.hasEmojis) potential += 15;
  if (data.hasCTA) potential += 20;
  if (data.hasLink) potential += 10;
  if (data.hasLineBreaks) potential += 10;
  if (data.bioLength >= 80) potential += 5;

  return Math.min(100, potential);
}

function getScoreMessage(score: number): string {
  if (score >= 85) return "Excellent bio! Minor tweaks could make it perfect.";
  if (score >= 70) return "Good bio, but there's room for optimization.";
  if (score >= 55) return "Your bio needs improvement to maximize conversions.";
  return "Your bio needs a complete rewrite for better results.";
}
