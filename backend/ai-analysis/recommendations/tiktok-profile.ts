import type { AnalysisResponse } from "../types";

interface TikTokProfileData {
  username: string;
  bio: string;
  videoCount: number;
  followerCount: number;
  followingCount: number;
  likeCount: number;
  hasProfilePhoto: boolean;
  hasLink: boolean;
  bioLength: number;
  postingFrequency: string;
}

export function generateTikTokProfileRecommendations(
  data: TikTokProfileData
): AnalysisResponse {
  const score = calculateProfileScore(data);
  const engagementRate = calculateEngagementRate(data);
  const contentConsistency = assessContentConsistency(data);

  const recommendations = [];

  if (data.videoCount < 10) {
    recommendations.push({
      type: "warning" as const,
      priority: "high" as const,
      title: "Low Video Count",
      description: "TikTok's algorithm favors consistent creators. You need more content.",
      actionItems: [
        `Current videos: ${data.videoCount}. Aim for at least 30 videos`,
        "Post 1-3 times per day for 2 weeks to test what works",
        "Focus on quality, but quantity helps you find your niche",
        "Batch-create content to maintain consistency"
      ]
    });
  }

  if (data.postingFrequency === "rarely" || data.postingFrequency === "monthly") {
    recommendations.push({
      type: "strategy" as const,
      priority: "high" as const,
      title: "Posting Frequency Too Low",
      description: "TikTok rewards frequent, consistent posting. Daily posts are ideal.",
      actionItems: [
        "Post at least 1 video per day (3-5 is optimal for growth)",
        "Find your best posting times using TikTok analytics",
        "Use trending sounds to boost discoverability",
        "Reply to comments with video responses"
      ]
    });
  }

  if (!data.hasProfilePhoto) {
    recommendations.push({
      type: "optimization" as const,
      priority: "high" as const,
      title: "Missing Profile Photo",
      description: "A profile photo builds trust and makes your account look professional.",
      actionItems: [
        "Upload a clear, high-quality profile photo",
        "Use a photo that aligns with your niche (your face works best)",
        "Ensure it's recognizable even at small sizes",
        "Avoid logos unless you're a brand account"
      ]
    });
  }

  if (!data.hasLink) {
    recommendations.push({
      type: "opportunity" as const,
      priority: "medium" as const,
      title: "No Link Added",
      description: "You're missing traffic opportunities. Add a link to drive conversions.",
      actionItems: [
        "Add your Instagram, YouTube, or website link",
        "Use a Linktree or similar tool for multiple links",
        "Mention your link in videos: 'Link in bio'",
        "Update your link for specific campaigns or launches"
      ]
    });
  }

  if (data.bioLength < 30) {
    recommendations.push({
      type: "optimization" as const,
      priority: "medium" as const,
      title: "Bio Too Short",
      description: "Use your bio to tell visitors what you're about and why they should follow.",
      actionItems: [
        "Explain your niche in 5-10 words",
        "Add personality or humor",
        "Include a CTA: 'New videos daily 🎥'",
        "Use emojis to break up text and add visual interest"
      ]
    });
  }

  if (engagementRate < 5) {
    recommendations.push({
      type: "engagement" as const,
      priority: "high" as const,
      title: "Low Engagement Rate",
      description: "Your content isn't resonating. Focus on hooks, trends, and audience interaction.",
      actionItems: [
        "Improve your first 3 seconds (the hook is everything)",
        "Use trending sounds and effects",
        "Post at optimal times when your audience is active",
        "Engage with comments to boost algorithmic favorability",
        "Study your top-performing videos and replicate what worked"
      ],
      estimatedImpact: "Better engagement can 10x your reach"
    });
  }

  if (data.followerCount > 0 && data.followingCount / data.followerCount > 2) {
    recommendations.push({
      type: "warning" as const,
      priority: "low" as const,
      title: "High Following-to-Follower Ratio",
      description: "You're following more people than are following you back.",
      actionItems: [
        "Focus on creating great content instead of follow-for-follow",
        "Unfollow accounts that don't follow back",
        "Build genuine connections in your niche",
        "TikTok growth comes from viral content, not follows"
      ]
    });
  }

  recommendations.push({
    type: "growth" as const,
    priority: "high" as const,
    title: "Viral Growth Strategy",
    description: "TikTok's algorithm is the most creator-friendly. Here's how to leverage it.",
    actionItems: [
      "Hook viewers in the first 1-3 seconds",
      "Use trending sounds (check TikTok's Discover page)",
      "Post when your audience is active (check analytics)",
      "Keep videos 7-15 seconds for higher watch time %",
      "Reply to comments with videos to boost engagement",
      "Study your For You Page to understand what's working"
    ],
    estimatedImpact: "Consistent execution can lead to viral videos"
  });

  return {
    summary: `Your TikTok profile scored ${score}/100. ${contentConsistency} Engagement rate: ${engagementRate.toFixed(1)}%. ${getScoreMessage(score)}`,
    recommendations,
    keyInsights: [
      `Video count: ${data.videoCount} videos`,
      `Engagement rate: ${engagementRate.toFixed(1)}% ${getEngagementLabel(engagementRate)}`,
      `Posting frequency: ${data.postingFrequency}`,
      `Profile completeness: ${data.hasProfilePhoto ? '✅' : '❌'} Photo, ${data.hasLink ? '✅' : '❌'} Link`,
      `Bio length: ${data.bioLength}/80 characters`,
      "TikTok rewards consistency—post daily for best results"
    ],
    riskFactors: [
      ...(data.videoCount < 10 ? ["Not enough content to establish a presence"] : []),
      ...(data.postingFrequency === "rarely" ? ["Inconsistent posting hurts algorithmic reach"] : []),
      ...(engagementRate < 3 ? ["Very low engagement—content may not be resonating"] : []),
      ...(!data.hasProfilePhoto ? ["No profile photo reduces trust and professionalism"] : []),
      "Algorithm changes frequently—stay updated on trends"
    ],
    nextSteps: [
      "Post 1-3 videos per day for the next 2 weeks",
      "Use trending sounds and hashtags",
      "Optimize your first 3 seconds (hook)",
      "Engage with every comment in the first hour",
      "Analyze your top videos and replicate what works",
      "Complete your profile (photo, bio, link)"
    ]
  };
}

function calculateProfileScore(data: TikTokProfileData): number {
  let score = 20;

  if (data.videoCount >= 50) score += 20;
  else if (data.videoCount >= 30) score += 15;
  else if (data.videoCount >= 10) score += 10;

  if (data.hasProfilePhoto) score += 15;
  if (data.hasLink) score += 10;

  if (data.bioLength >= 30) score += 10;

  if (data.postingFrequency === "daily") score += 15;
  else if (data.postingFrequency === "weekly") score += 10;
  else if (data.postingFrequency === "monthly") score += 5;

  const engagementRate = calculateEngagementRate(data);
  if (engagementRate >= 10) score += 10;
  else if (engagementRate >= 5) score += 5;

  return Math.min(100, score);
}

function calculateEngagementRate(data: TikTokProfileData): number {
  if (data.followerCount === 0 || data.videoCount === 0) return 0;

  const avgLikesPerVideo = data.likeCount / data.videoCount;
  const engagementRate = (avgLikesPerVideo / data.followerCount) * 100;

  return Math.min(100, engagementRate);
}

function assessContentConsistency(data: TikTokProfileData): string {
  if (data.postingFrequency === "daily") return "You post consistently—great for growth!";
  if (data.postingFrequency === "weekly") return "Weekly posting is good, but daily is better.";
  if (data.postingFrequency === "monthly") return "Monthly posting is too infrequent for TikTok growth.";
  return "Inconsistent posting hurts your reach.";
}

function getEngagementLabel(rate: number): string {
  if (rate >= 10) return "(Excellent)";
  if (rate >= 5) return "(Good)";
  if (rate >= 3) return "(Average)";
  return "(Needs improvement)";
}

function getScoreMessage(score: number): string {
  if (score >= 85) return "Excellent profile! Keep creating and engaging.";
  if (score >= 70) return "Good profile, but there's room for growth.";
  if (score >= 55) return "Your profile needs optimization to maximize reach.";
  return "Your profile needs significant improvement.";
}
