import type { Recommendation } from '../types';

export function generateCarInsuranceRecommendations(data: any): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const age = data.age || 35;
  const state = data.state || 'nsw';
  const vehicleType = data.vehicleType || 'sedan';
  const estimatedPremium = data.estimatedPremium || data.estimatedAnnualCost || 0;
  const coverageType = data.coverageType || 'comprehensive';
  const ncdYears = data.ncdYears || 0;
  const claimsHistory = data.claimsHistory || 0;
  const vehicleValue = data.vehicleValue || 30000;

  if (age < 25) {
    recommendations.push({
      type: 'optimization',
      priority: 'high',
      title: 'Young Driver Premium Reduction Strategies',
      description: `At age ${age}, you're in a high-premium age bracket. However, there are several proven strategies to reduce your insurance costs.`,
      actionItems: [
        'Consider adding an experienced driver as a named driver on your policy',
        'Complete an approved driver training course to qualify for discounts',
        'Choose a vehicle in insurance group 1-10 for significantly lower premiums',
        'Increase your excess amount to reduce premiums (if financially viable)',
        'Install a telematics device to prove safe driving habits'
      ],
      estimatedImpact: 'Could save 10-30% on annual premiums'
    });
  }

  if (ncdYears < 5) {
    recommendations.push({
      type: 'opportunity',
      priority: 'high',
      title: 'Build Your No Claim Discount',
      description: `You currently have ${ncdYears} years of no claim discount. Each claim-free year reduces your premium by approximately 10%, maxing out at 60-65%.`,
      actionItems: [
        'Avoid making small claims - pay for minor repairs yourself when viable',
        'Consider protecting your NCD with an add-on if you have 3+ years built up',
        `Continue driving safely to reach maximum discount in ${Math.max(0, 6 - ncdYears)} more years`,
        'When you reach 5+ years NCD, consider if NCD protection is worthwhile'
      ],
      potentialSavings: Math.round(estimatedPremium * 0.1 * Math.max(0, 5 - ncdYears)),
      estimatedImpact: `Build to maximum ${(6 - ncdYears) * 10}% additional discount`
    });
  }

  if (claimsHistory > 0) {
    recommendations.push({
      type: 'warning',
      priority: 'high',
      title: 'Claims History Impact on Premiums',
      description: `You have ${claimsHistory} claim(s) in the last 5 years. Each claim can increase premiums by 20-40% for 3-5 years.`,
      actionItems: [
        'Avoid making further claims unless absolutely necessary',
        'Consider paying for small repairs out of pocket to preserve premium levels',
        'Shop around aggressively - different insurers penalize claims differently',
        'Wait for claims to age beyond 3 years for premium reductions',
        'Install dashcam for evidence in future incidents to avoid fault claims'
      ],
      estimatedImpact: 'Claims will drop off after 3-5 years, reducing premiums'
    });
  }

  const highValueVehicles = ['sports', 'luxury', 'electric'];
  if (highValueVehicles.includes(vehicleType)) {
    recommendations.push({
      type: 'optimization',
      priority: 'medium',
      title: `${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)} Vehicle Insurance Optimization`,
      description: 'High-value and specialty vehicles attract premium surcharges. Optimize your coverage and security measures.',
      actionItems: [
        'Compare quotes from specialist insurers who focus on your vehicle type',
        'Install advanced security systems (tracker, alarm) for discounts',
        'Consider agreed value coverage instead of market value',
        'Park in secure locations (locked garage) to reduce theft risk',
        'Join relevant car clubs - some offer group insurance discounts'
      ],
      potentialSavings: Math.round(estimatedPremium * 0.15),
      estimatedImpact: 'Specialist insurers may offer 10-25% savings'
    });
  }

  if (coverageType === 'comprehensive') {
    const thirdPartyEstimate = estimatedPremium * 0.35;
    const savings = estimatedPremium - thirdPartyEstimate;
    
    if (vehicleValue < 5000) {
      recommendations.push({
        type: 'opportunity',
        priority: 'medium',
        title: 'Consider Downgrading Coverage for Older Vehicle',
        description: 'For vehicles worth less than $5,000, comprehensive coverage may not be cost-effective.',
        actionItems: [
          'Calculate if comprehensive premiums exceed vehicle value over 2-3 years',
          'Consider switching to third party fire & theft for middle ground',
          'Move to third party only if vehicle value is very low',
          'Ensure you have emergency savings to replace vehicle if needed',
          'Review this decision annually as vehicle depreciates further'
        ],
        potentialSavings: Math.round(savings),
        estimatedImpact: `Save approximately $${savings.toLocaleString()}/year`
      });
    }
  }

  recommendations.push({
    type: 'optimization',
    priority: 'high',
    title: 'Annual Insurance Shopping Strategy',
    description: 'Insurance premiums vary significantly between providers. Shopping around annually can save hundreds of dollars.',
    actionItems: [
      'Get quotes from at least 4-5 different insurers every renewal',
      'Use comparison websites but also check direct insurer quotes',
      'Don\'t just auto-renew - loyalty doesn\'t reduce premiums',
      'Negotiate with your current insurer using competitor quotes',
      'Time your shopping 2-3 weeks before renewal for best rates'
    ],
    potentialSavings: Math.round(estimatedPremium * 0.25),
    estimatedImpact: 'Average savings of 20-40% when switching insurers'
  });

  const highRiskStates = ['nsw', 'qld', 'nt'];
  if (highRiskStates.includes(state)) {
    recommendations.push({
      type: 'strategy',
      priority: 'medium',
      title: 'Location-Based Premium Optimization',
      description: `${state.toUpperCase()} has higher insurance costs due to claims frequency. Maximize security measures to offset location risk.`,
      actionItems: [
        'Invest in comprehensive security systems',
        'Use secure parking facilities when available',
        'Consider vehicles less likely to be stolen in your area',
        'Install dashcam for evidence in claims',
        'Research lower-risk suburbs if relocating'
      ],
      estimatedImpact: '5-15% premium reduction through enhanced security'
    });
  }

  recommendations.push({
    type: 'strategy',
    priority: 'medium',
    title: 'Multi-Policy Bundling Opportunity',
    description: 'Bundling car insurance with home, contents, or additional vehicle insurance can provide significant discounts.',
    actionItems: [
      'Get quotes for bundled policies with a single insurer',
      'Compare bundled price vs separate policies from different providers',
      'Look for multi-vehicle discounts if insuring multiple cars',
      'Ask about partner/family member vehicle bundling options',
      'Calculate total insurance costs across all policies'
    ],
    potentialSavings: Math.round(estimatedPremium * 0.15),
    estimatedImpact: '10-25% discount on bundled policies'
  });

  return recommendations;
}
