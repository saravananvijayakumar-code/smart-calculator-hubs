import { SolarSavingsAnalysisData, AnalysisResponse, Recommendation } from "../types";

export function generateSolarSavingsRecommendations(
  data: SolarSavingsAnalysisData,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const paybackYears = data.paybackYears;
  const annualSavings = data.annualSavings;
  const systemSize = data.systemSize;
  const installationCost = data.installationCost;
  const totalSavings25Years = data.totalSavings25Years;
  const electricityRate = data.electricityRate;

  if (paybackYears <= 4) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Excellent Investment - Quick Payback Period",
      description: `With a ${paybackYears.toFixed(1)}-year payback period, solar is an outstanding investment for your situation.`,
      actionItems: [
        "Proceed with installation - this is significantly better than average 5-7 year payback",
        "Lock in current electricity rates before they increase further",
        "Get multiple quotes to ensure competitive pricing",
        "Consider slightly larger system to maximize roof space and ROI"
      ],
      potentialSavings: Math.round(totalSavings25Years),
      estimatedImpact: `$${totalSavings25Years.toLocaleString()} total savings over 25 years`
    });
  } else if (paybackYears <= 6) {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "Solid Investment with Good Returns",
      description: `Your ${paybackYears.toFixed(1)}-year payback is slightly above average but still represents strong financial returns.`,
      actionItems: [
        "Solar remains a sound investment at this payback period",
        "Compare quotes from multiple installers to potentially reduce payback time",
        "Consider if higher electricity usage or rates would improve ROI",
        "Explore all available state and federal rebates to reduce upfront cost"
      ],
      potentialSavings: Math.round(totalSavings25Years),
      estimatedImpact: `$${totalSavings25Years.toLocaleString()} over system lifetime`
    });
  } else if (paybackYears > 8) {
    recommendations.push({
      type: "warning",
      priority: "high",
      title: "Extended Payback Period - Optimization Needed",
      description: `At ${paybackYears.toFixed(1)} years, payback is longer than ideal. Consider ways to improve the investment case.`,
      actionItems: [
        "Shop around aggressively - installation costs may be too high",
        "Consider slightly smaller system to reduce upfront cost",
        "Verify all available rebates and incentives are applied",
        "Evaluate if your electricity usage justifies the investment",
        "Consider waiting 6-12 months if you can't improve payback period"
      ]
    });
    riskFactors.push("Long payback period increases exposure to technology changes and policy shifts");
  }

  if (electricityRate > 0.30) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "High Electricity Rates Maximize Solar Value",
      description: `Your $${electricityRate.toFixed(2)}/kWh rate is above average, making solar particularly valuable for you.`,
      actionItems: [
        "Act soon - high rates mean every delay costs money",
        "Consider maxing out available roof space for solar panels",
        "Rates likely to increase further, improving your solar ROI over time",
        "Calculate potential savings with planned future electricity price increases"
      ],
      estimatedImpact: "Each 5% electricity rate increase improves ROI by approximately 10%"
    });
  } else if (electricityRate < 0.25) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Lower Electricity Rates Reduce Solar Benefits",
      description: `At $${electricityRate.toFixed(2)}/kWh, your rates are below average, reducing solar savings potential.`,
      actionItems: [
        "Focus on minimizing installation costs to improve payback period",
        "Consider if rates are likely to increase significantly in coming years",
        "Battery storage may not be economically viable at your electricity rates",
        "Ensure system size matches your usage - oversizing reduces ROI at low rates"
      ]
    });
  }

  if (systemSize >= 10) {
    recommendations.push({
      type: "strategy",
      priority: "medium",
      title: "Large System - Maximize Self-Consumption",
      description: `Your ${systemSize}kW system is larger than average. Maximizing self-consumption is critical for best returns.`,
      actionItems: [
        "Install energy monitoring to track self-consumption rates",
        "Shift high-energy usage to daytime when solar is generating (dishwasher, washing, pool pump)",
        "Consider battery storage to store excess generation for evening use",
        "Set timers on appliances to run during peak solar generation hours",
        "Consider electric vehicle charging during the day if applicable"
      ],
      estimatedImpact: "Increasing self-consumption from 30% to 50% can improve ROI by 20-30%"
    });
    keyInsights.push(`Large ${systemSize}kW system generates significant excess - maximizing self-use is crucial`);
  } else if (systemSize < 6) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Room for System Expansion",
      description: `Your ${systemSize}kW system is on the smaller side. Consider if you have roof space for expansion.`,
      actionItems: [
        "Evaluate available roof space for potential system expansion",
        "Larger systems often have better economies of scale (lower $/kW cost)",
        "Consider future electricity needs (electric vehicle, home additions, etc.)",
        "If planning expansion later, ensure inverter can handle additional panels"
      ]
    });
  }

  if (data.state) {
    const stateTips: Record<string, { rebate: string; fit: string; priority: "high" | "medium" }> = {
      VIC: { 
        rebate: "Victoria's Solar Homes rebate ($1,400) and interest-free loans available",
        fit: "Feed-in tariffs vary widely (3-12¢/kWh) - shop around for best rate",
        priority: "high"
      },
      NSW: { 
        rebate: "Check eligibility for NSW solar rebates and low-interest loans",
        fit: "NSW feed-in tariffs typically 6-10¢/kWh - compare retailers annually",
        priority: "medium"
      },
      QLD: { 
        rebate: "Queensland offers interest-free loans for solar and batteries",
        fit: "High sunshine hours in QLD maximize solar generation year-round",
        priority: "high"
      },
      SA: { 
        rebate: "SA Home Battery Scheme provides subsidies for battery installations",
        fit: "SA has highest electricity rates - solar provides maximum value here",
        priority: "high"
      }
    };

    const stateCode = data.state.toUpperCase();
    if (stateTips[stateCode]) {
      recommendations.push({
        type: "opportunity",
        priority: stateTips[stateCode].priority,
        title: `${stateCode} State-Specific Opportunities`,
        description: stateTips[stateCode].rebate,
        actionItems: [
          stateTips[stateCode].fit,
          "Verify eligibility for all state and federal incentives",
          "State incentive programs often have waitlists - apply early",
          "Check if your postcode qualifies for additional regional incentives"
        ]
      });
    }
  }

  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Feed-in Tariff Optimization",
    description: "Your feed-in tariff significantly impacts returns. Shopping around can increase annual savings by $100-$400.",
    actionItems: [
      "Compare feed-in tariff rates across all retailers in your area",
      "Rates vary from 3-12¢/kWh - higher rates dramatically improve ROI",
      "Switch retailers if current FiT is below 8¢/kWh",
      "Review FiT rates annually as they change frequently",
      "Consider time-of-use tariffs if you have battery storage"
    ],
    potentialSavings: 400,
    estimatedImpact: "4¢/kWh FiT improvement = $150-$300 extra annual savings"
  });

  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "Battery Storage Consideration",
    description: "Evaluate if battery storage makes financial sense for your situation.",
    actionItems: [
      "Current battery payback periods: 10-15 years (longer than solar alone)",
      "Batteries make most sense with high time-of-use rate differentials",
      "Consider if blackout protection is worth premium over financial returns",
      "Battery costs falling 10-15% annually - waiting may improve economics",
      "If installing solar now, ensure inverter is battery-compatible for future expansion"
    ]
  });

  recommendations.push({
    type: "strategy",
    priority: "high",
    title: "Quality Components = Long-term Value",
    description: "Panel and inverter quality significantly impact 25-year returns. Don't choose solely on price.",
    actionItems: [
      "Select Tier 1 panels from established manufacturers (LG, SunPower, REC, Canadian Solar)",
      "Quality inverters (Fronius, SMA, SolarEdge, Enphase) last longer and perform better",
      "Verify minimum 25-year panel warranty and 10-year inverter warranty",
      "Cheap components may fail early, eliminating ROI benefits",
      "Check installer is CEC-accredited and has strong warranty backing"
    ],
    estimatedImpact: "Premium components add 10-15% to cost but improve lifetime output by 20-30%"
  });

  recommendations.push({
    type: "opportunity",
    priority: "medium",
    title: "Property Value Increase",
    description: "Solar panels typically increase property value by $10,000-$20,000+, adding to your ROI.",
    actionItems: [
      "Real estate data shows solar homes sell faster and for premium prices",
      "Even if selling soon, solar installation often pays for itself in sale price",
      "Document system specifications and warranties for future buyers",
      "Solar is increasingly expected by buyers in sunny states"
    ]
  });

  keyInsights.push(`Annual savings: $${annualSavings.toLocaleString()} (increasing as electricity rates rise)`);
  keyInsights.push(`System pays for itself in ${paybackYears.toFixed(1)} years, then generates pure profit for 15-20+ more years`);
  keyInsights.push(`After rebates: $${installationCost.toLocaleString()} net investment`);
  keyInsights.push(`25-year total savings: $${totalSavings25Years.toLocaleString()} (includes panel degradation)`);
  keyInsights.push(`CO₂ reduction: ${data.co2ReductionTons.toFixed(1)} tons annually = ${Math.round(data.co2ReductionTons / 21.77)} trees equivalent`);

  if (electricityRate > 0.28) {
    keyInsights.push("Above-average electricity rates mean solar provides premium value for your household");
  }

  riskFactors.push("Electricity policy changes could affect feed-in tariff rates");
  riskFactors.push("Panel efficiency degrades ~0.5% annually (factored into calculations)");
  riskFactors.push("Inverter replacement likely needed after 10-15 years (~$2,000-$3,000)");
  riskFactors.push("Roof condition matters - may need replacement before 25-year panel lifespan");
  
  if (systemSize > 10) {
    riskFactors.push("Large system export may exceed feed-in tariff caps in some plans");
  }

  nextSteps.push("Get quotes from 3-5 CEC-accredited installers for comparison");
  nextSteps.push("Verify all available rebates are included in quotes (STCs, state rebates)");
  nextSteps.push("Check installer reviews, licensing, and insurance coverage");
  nextSteps.push("Compare feed-in tariff rates across retailers before installation");
  nextSteps.push("Ensure quotes include warranties, system monitoring, and grid connection fees");
  
  if (paybackYears <= 5) {
    nextSteps.push("Strong economics - proceed with installation within 3-6 months");
  } else if (paybackYears > 7) {
    nextSteps.push("Negotiate harder on price or consider smaller system to improve payback");
  }

  const summary = `Your ${systemSize}kW solar system will save $${annualSavings.toLocaleString()} annually, paying for itself in ${paybackYears.toFixed(1)} years. Over 25 years, you'll save approximately $${totalSavings25Years.toLocaleString()} while reducing CO₂ emissions by ${data.co2ReductionTons.toFixed(1)} tons per year. ${
    paybackYears <= 4
      ? "This is an exceptional investment with quick payback - proceed with confidence."
      : paybackYears <= 6
      ? "Solid investment with good long-term returns."
      : "Consider optimizing system size or installation costs to improve payback period."
  }`;

  return {
    summary,
    recommendations,
    keyInsights,
    riskFactors,
    nextSteps
  };
}
