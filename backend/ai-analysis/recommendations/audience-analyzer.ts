import type { AudienceAnalysisData } from "../types";

export function generateAudiencePrompt(data: AudienceAnalysisData): string {
  return `You are an elite social media strategist and audience intelligence expert. Conduct a comprehensive, advanced analysis of this account.

Account Metrics:
- Platform: ${data.platform || 'Not specified'}
- Followers: ${data.followers.toLocaleString()}
- Average Likes: ${data.avgLikes.toLocaleString()}
- Average Comments: ${data.avgComments.toLocaleString()}
- Average Shares: ${data.avgShares.toLocaleString()}
- Niche: ${data.niche}
- Primary Content Type: ${data.contentType || 'Not specified'}
- Posting Frequency: ${data.postingFrequency || 'Not specified'}
- Calculated Engagement Rate: ${data.engagementRate.toFixed(2)}%
- Top Competitors: ${data.topCompetitors || 'Not provided'}
- Audience Goals: ${data.audienceGoals || 'Not provided'}

Provide an ADVANCED, comprehensive analysis with:

## 1. 🎯 Audience Health Score (1-10)
- Overall quality rating with detailed justification
- Comparison to platform and niche benchmarks
- Key factors elevating or lowering the score

## 2. 📊 Deep Engagement Intelligence
- Engagement rate analysis for ${data.platform || 'this platform'} in ${data.niche}
- Likes-to-comments ratio (quality indicator)
- Shares analysis (viral potential)
- Algorithm favorability prediction
- Audience authenticity assessment

## 3. 👥 Psychographic Audience Profile
- Predicted demographics (age, gender, location)
- Psychographic traits (values, interests, lifestyle)
- Pain points and desires
- Buying behavior and decision-making patterns
- Community engagement style
- Emotional triggers that resonate

## 4. 📈 Growth Trajectory Analysis
- Current growth stage assessment
- 3-month and 12-month growth predictions
- Bottlenecks limiting growth
- Untapped growth opportunities
- Viral potential assessment

## 5. 🎬 Content Format Strategy
- Best-performing content types for this audience
- Video vs. image vs. carousel recommendations
- Content length preferences
- Visual aesthetic recommendations (colors, style, tone)
- Trending formats to leverage

## 6. ⏰ Optimal Posting Schedule
- Best days to post (based on niche and audience)
- Ideal posting times (with timezone considerations)
- Recommended posting frequency
- Content calendar structure

## 7. 🔥 Competitor Intelligence
${data.topCompetitors ? `- Analysis of competitors: ${data.topCompetitors}
- Competitive advantages to leverage
- Gaps in competitor content you can fill
- Collaboration vs. competition strategy` : '- General competitive landscape in ' + data.niche + ' niche\n- How to differentiate from competitors'}

## 8. 💰 Monetization Roadmap
- Current monetization readiness (1-10)
- Estimated earnings per sponsored post: $X-$Y range
- Revenue stream recommendations (ranked by potential)
- Brand partnership opportunities
- Product/service launch viability
- Audience's willingness to pay assessment

## 9. 🎨 Content Strategy Blueprint
- Content pillar recommendations (3-5 themes)
- Hook strategies for this audience
- Call-to-action effectiveness tips
- Hashtag strategy (number and type)
- Trending topics to leverage
- Content gaps to fill

## 10. 🚨 Red Flags & Warnings
- Engagement quality concerns
- Fake follower indicators (if any)
- Algorithm penalty risks
- Sustainability concerns

## 11. 💡 Advanced Growth Hacks
- Platform-specific algorithm tips for ${data.platform || 'growth'}
- Collaboration opportunities
- Cross-promotion strategies
- Community building tactics
- Viral content formulas for this niche

## 12. ✅ 30-Day Action Plan
**Week 1:**
- [Specific immediate action items]

**Week 2:**
- [Content strategy adjustments]

**Week 3:**
- [Engagement and community focus]

**Week 4:**
- [Growth and experimentation]

**Quick Wins (Do Today):**
- [3-5 actions they can take right now]

**Stop Doing:**
- [Things that are hurting growth]

**Double Down On:**
- [What's working that needs more focus]

Format using markdown with clear sections (##). Be extremely specific, data-driven, and actionable. Include specific numbers, percentages, and realistic projections. Make this analysis feel personalized and highly valuable.`;
}
