import { AnalysisResponse } from "../types";

export function generateProfileAnalysisRecommendations(data: any): AnalysisResponse {
  const { platform, username, profileUrl } = data;
  
  const profileScore = calculateProfileScore(data);
  const bioClarity = generateBioClarity(data);
  const engagementHacks = generateEngagementHacks(platform, profileScore);
  const growthSuggestions = generateGrowthSuggestions(platform, profileScore);

  return {
    summary: `Your ${platform} profile scored ${profileScore}/100. ${getScoreMessage(profileScore)}`,
    recommendations: [
      {
        type: "optimization",
        priority: "high",
        title: "Profile Score Breakdown",
        description: `Your ${platform} profile analysis reveals key areas for improvement and growth opportunities.`,
        actionItems: [
          `Overall Profile Score: ${profileScore}/100`,
          `Bio Clarity: ${bioClarity.score}/100 - ${bioClarity.feedback}`,
          "Focus on high-impact improvements first",
          "Track progress weekly using analytics"
        ]
      },
      {
        type: "engagement",
        priority: "high",
        title: "Engagement Hacks",
        description: "Proven tactics to boost your engagement and reach on " + platform,
        actionItems: engagementHacks
      },
      {
        type: "growth",
        priority: "medium",
        title: "Growth Strategy",
        description: "Strategic suggestions to accelerate your follower growth and influence",
        actionItems: growthSuggestions
      }
    ],
    keyInsights: [
      `Your ${platform} profile score: ${profileScore}/100`,
      `Bio clarity rating: ${bioClarity.score}/100`,
      engagementHacks[0],
      "Consistency beats perfection - post regularly",
      "Engagement rate matters more than follower count"
    ],
    riskFactors: [
      ...(profileScore < 60 ? ["Profile needs significant improvement to compete effectively"] : []),
      ...(bioClarity.score < 70 ? ["Bio clarity issues may confuse potential followers"] : []),
      "Inconsistent posting reduces algorithm favorability",
      "Low engagement rates signal content quality issues",
      "Not adapting to platform trends limits growth potential"
    ],
    nextSteps: [
      "Optimize your bio with clear call-to-action",
      "Audit your content quality and consistency",
      "Engage authentically with your target audience",
      "Track analytics weekly to identify what works",
      "Test different content formats and posting times"
    ]
  };
}

function calculateProfileScore(data: any): number {
  let score = 50;
  
  if (data.hasClearBio) score += 10;
  if (data.hasProfilePhoto) score += 10;
  if (data.hasLink) score += 5;
  if (data.postFrequency === 'daily') score += 10;
  else if (data.postFrequency === 'weekly') score += 5;
  if (data.engagementRate > 5) score += 15;
  else if (data.engagementRate > 2) score += 10;
  else if (data.engagementRate > 1) score += 5;
  
  return Math.min(100, Math.max(0, score));
}

function getScoreMessage(score: number): string {
  if (score >= 85) return "Excellent! Your profile is optimized for growth.";
  if (score >= 70) return "Good foundation, but room for improvement.";
  if (score >= 55) return "Average profile with significant growth potential.";
  return "Needs attention - prioritize profile optimization.";
}

function generateBioClarity(data: any): { score: number; feedback: string } {
  const bioLength = data.bioLength || 0;
  const hasKeywords = data.hasKeywords || false;
  const hasEmojis = data.hasEmojis || false;
  const hasCTA = data.hasCTA || false;
  
  let score = 40;
  
  if (bioLength > 50 && bioLength < 150) score += 20;
  if (hasKeywords) score += 20;
  if (hasEmojis) score += 10;
  if (hasCTA) score += 10;
  
  let feedback = "";
  if (score >= 80) feedback = "Crystal clear, engaging, and action-oriented";
  else if (score >= 65) feedback = "Good clarity, minor improvements possible";
  else if (score >= 50) feedback = "Somewhat clear but lacks punch";
  else feedback = "Vague or confusing - needs rewrite";
  
  return { score, feedback };
}

function generateEngagementHacks(platform: string, profileScore: number): string[] {
  const baseHacks = [
    "Post during peak engagement hours (6-9am, 5-9pm local time)",
    "Use platform-specific features (Stories, Reels, Lives) for algorithm boost",
    "Respond to comments within 60 minutes for maximum visibility",
    "Ask questions in captions to encourage comments and saves",
    "Create shareable content that provides genuine value"
  ];
  
  const platformHacks: Record<string, string[]> = {
    Instagram: [
      "Use all 30 hashtags strategically (mix of popular and niche)",
      "Post Reels consistently - they get 3x more reach than static posts",
      "Add captions to Reels to boost watch time",
      "Use carousel posts for 1.4x higher engagement",
      "Collaborate with micro-influencers in your niche"
    ],
    TikTok: [
      "Hook viewers in first 3 seconds or lose them",
      "Use trending sounds within 24-48 hours of emergence",
      "Post 1-3 times daily for algorithm favorability",
      "Engage with trending hashtag challenges",
      "Create duets and stitches with popular content"
    ],
    LinkedIn: [
      "Post thought leadership content on Tuesday-Thursday mornings",
      "Use polls to boost engagement by 3-5x",
      "Share personal stories with professional insights",
      "Comment meaningfully on industry leaders' posts",
      "Write long-form articles to establish authority"
    ]
  };
  
  const hacks = platformHacks[platform] || baseHacks;
  
  return hacks.slice(0, 5);
}

function generateGrowthSuggestions(platform: string, profileScore: number): string[] {
  const baseSuggestions = [
    "Define your niche clearly and own it consistently",
    "Cross-promote on other platforms to diversify audience",
    "Collaborate with accounts in your follower range",
    "Repurpose top-performing content in different formats",
    "Build an email list to own your audience"
  ];
  
  const platformSuggestions: Record<string, string[]> = {
    Instagram: [
      "Add a clear call-to-action in your bio (link, DM, follow)",
      "Create a content pillar strategy (3-5 core topics)",
      "Use Instagram Insights to double down on what works",
      "Run strategic giveaways with micro-influencer partners",
      "Optimize highlight covers to showcase your brand"
    ],
    TikTok: [
      "Add keyword-rich captions and on-screen text for SEO",
      "Create a hook library and test variations",
      "Analyze your top 10 videos and replicate patterns",
      "Post at least once daily for consistent algorithm boost",
      "Use TikTok Creator Marketplace for brand partnerships"
    ],
    LinkedIn: [
      "Add a professional headshot and compelling headline",
      "Optimize your About section with keywords and achievements",
      "Publish articles showcasing your expertise",
      "Engage in relevant LinkedIn Groups",
      "Send personalized connection requests with value"
    ]
  };
  
  const suggestions = platformSuggestions[platform] || baseSuggestions;
  
  if (profileScore < 60) {
    suggestions.unshift("URGENT: Complete your profile - add bio, photo, and contact info");
  }
  
  return suggestions.slice(0, 3);
}
