import { AnalysisResponse, Recommendation } from "../types";

export function generateGSTRecommendations(
  data: any,
  userContext?: any
): AnalysisResponse {
  const recommendations: Recommendation[] = [];
  const keyInsights: string[] = [];
  const riskFactors: string[] = [];
  const nextSteps: string[] = [];

  const gstRate = data.gstRate || 0;
  const transactionType = data.transactionType || 'intrastate';
  const gstAmount = data.gstAmount || 0;
  const baseAmount = data.baseAmount || 0;
  const totalAmount = data.totalAmount || 0;

  if (transactionType === 'intrastate') {
    keyInsights.push(`CGST (${gstRate / 2}%): ₹${(data.cgst || 0).toLocaleString()} | SGST (${gstRate / 2}%): ₹${(data.sgst || 0).toLocaleString()}`);
    keyInsights.push("Intra-state transaction: Tax split equally between Central and State governments");
  } else {
    keyInsights.push(`IGST (${gstRate}%): ₹${(data.igst || 0).toLocaleString()} - collected by Central Government`);
    keyInsights.push("Inter-state transaction: Tax goes to Central Government, later distributed to destination state");
  }

  if (gstRate === 18) {
    keyInsights.push("Standard GST rate of 18% applies to most goods and services in India");
  } else if (gstRate === 28) {
    keyInsights.push("Luxury/sin goods category - highest GST slab applicable");
  } else if (gstRate <= 5) {
    keyInsights.push("Essential goods category - lower GST rate for affordable pricing");
  }

  if (baseAmount > 50000 && transactionType === 'interstate') {
    recommendations.push({
      type: "strategy",
      priority: "high",
      title: "E-Way Bill Requirement",
      description: "Inter-state goods movement above ₹50,000 requires mandatory E-Way Bill generation.",
      actionItems: [
        "Generate E-Way Bill on GST portal before goods dispatch",
        "Ensure E-Way Bill validity based on distance (1 day per 200km)",
        "Carry physical/digital copy during transport",
        "Update E-Way Bill if vehicle changes during transit"
      ]
    });
  }

  if (gstRate > 0) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "Input Tax Credit (ITC) - Use GSTR-2B (Not GSTR-2A)",
      description: "CRITICAL: Claim ITC based on GSTR-2B (static, official statement), not GSTR-2A (dynamic view).",
      actionItems: [
        "Wait for GSTR-2B generation after 14th of each month",
        "Use GSTR-2B as the official basis for ITC claims in GSTR-3B",
        "Reconcile GSTR-2B with your purchase records before filing",
        "Use GSTR-2A only for early tracking/reference (not for official claims)",
        "Verify supplier has filed GSTR-1 - invoice must appear in GSTR-2B",
        "Obtain valid GST invoice with correct GSTIN and HSN/SAC code",
        "Maintain documentation for 6 years (digital preferred)"
      ]
    });
  }

  const turnover = userContext?.annualTurnover || 0;
  
  if (totalAmount > 200000 || turnover > 50000000) {
    const requiresEinvoicing = turnover > 50000000;
    
    recommendations.push({
      type: "strategy",
      priority: requiresEinvoicing ? "high" : "medium",
      title: requiresEinvoicing ? "e-Invoicing Mandatory (Turnover > ₹5 Cr)" : "GST Compliance & Documentation",
      description: requiresEinvoicing 
        ? "Your turnover exceeds ₹5 crore - e-Invoicing is MANDATORY for all B2B invoices."
        : "High-value transaction requires careful compliance management.",
      actionItems: requiresEinvoicing ? [
        "Generate e-Invoice through Invoice Registration Portal (IRP)",
        "Obtain unique IRN (Invoice Reference Number) before dispatch",
        "Print IRN and QR code on invoice (mandatory)",
        "e-Invoice auto-populates GSTR-1 and buyer's GSTR-2B",
        "Generate E-Way Bill directly from e-Invoice if needed",
        "Verify buyer's GSTIN on GST portal before e-invoicing",
        "Ensure timely GST payment to avoid 18% p.a. interest"
      ] : [
        "Issue tax invoice with all mandatory fields (GSTIN, HSN/SAC code, etc.)",
        "Verify buyer's GSTIN on GST portal before billing",
        "Upload invoice details in GSTR-1 within due date",
        "Ensure timely GST payment to avoid 18% p.a. interest",
        "Keep digital and physical copies of all documents"
      ]
    });
  }

  const annualRevenue = userContext?.annualRevenue || turnover;
  
  if (annualRevenue > 0 && annualRevenue <= 50000000) {
    recommendations.push({
      type: "opportunity",
      priority: "high",
      title: "QRMP Scheme - Quarterly Returns (Turnover ≤ ₹5 Crore)",
      description: "You're eligible for the Quarterly Return Monthly Payment (QRMP) scheme - file returns quarterly, pay tax monthly.",
      actionItems: [
        "Opt for QRMP to file GSTR-1 and GSTR-3B quarterly (4 returns/year vs 12)",
        "Still pay tax monthly via PMT-06 (25th of next month)",
        "Use Invoice Furnishing Facility (IFF) if you have large B2B customers",
        "IFF allows monthly invoice upload for faster ITC to customers",
        "Quarterly return due: GSTR-1 by 13th, GSTR-3B by 22nd/24th",
        "Reduces compliance burden by 75% compared to monthly filing"
      ]
    });
  }
  
  if (annualRevenue > 0 && annualRevenue < 2000000) {
    recommendations.push({
      type: "opportunity",
      priority: "medium",
      title: "Composition Scheme Eligibility (Turnover < ₹20 Lakhs)",
      description: "With turnover below ₹20 lakhs, you may be eligible for GST Composition Scheme.",
      actionItems: [
        "Evaluate Composition Scheme benefits (1-5% flat tax rate)",
        "Consider simplified compliance requirements",
        "Note: Cannot claim Input Tax Credit under Composition",
        "Cannot make inter-state supplies under Composition",
        "Quarterly filing instead of monthly (GSTR-4)"
      ]
    });
  }

  recommendations.push({
    type: "strategy",
    priority: "medium",
    title: "GST Return Filing Schedule (2025)",
    description: "Stay compliant with GST return deadlines to avoid penalties.",
    actionItems: [
      "Monthly (turnover > ₹5 cr): GSTR-1 by 11th, GSTR-3B by 20th",
      "Quarterly QRMP (≤ ₹5 cr): GSTR-1 by 13th, GSTR-3B by 22nd/24th after quarter",
      "Check GSTR-2B (after 14th) for accurate ITC before filing GSTR-3B",
      "Use GSTR-2A only for early reference, not for official ITC claims",
      "Annual return GSTR-9 by 31st December (if turnover > ₹2 crore)",
      "Set calendar reminders to avoid late fees (₹50-200/day)"
    ]
  });

  if (gstRate === 0) {
    recommendations.push({
      type: "opportunity",
      priority: "low",
      title: "Zero-Rated Supplies",
      description: "Nil-rated or exempt supplies still require GST compliance.",
      actionItems: [
        "Report nil-rated supplies in GSTR-1",
        "Cannot claim ITC on inputs for exempt supplies",
        "Maintain separate records for exempt vs taxable supplies",
        "Consider impact on common input credit distribution"
      ]
    });
  }

  nextSteps.push("Verify correct GST rate using HSN/SAC code on GST portal");
  nextSteps.push("Ensure supplier/buyer GSTIN is valid and active");
  nextSteps.push("Wait for GSTR-2B (after 14th) - use it for ITC claims, not GSTR-2A");
  nextSteps.push("If turnover > ₹5 cr: Implement e-Invoicing system immediately");
  nextSteps.push("If turnover ≤ ₹5 cr: Consider QRMP scheme for quarterly filing");
  nextSteps.push("File GST returns on time to maintain compliance");

  const summary = `GST of ₹${gstAmount.toLocaleString()} at ${gstRate}% on base amount ₹${baseAmount.toLocaleString()} brings total to ₹${totalAmount.toLocaleString()}. ${transactionType === 'intrastate' ? 'Split equally as CGST and SGST.' : 'Charged as IGST for inter-state supply.'}`;

  return { summary, recommendations, keyInsights, riskFactors, nextSteps };
}
