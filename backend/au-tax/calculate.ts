import { api } from 'encore.dev/api';
import type {
  PayCalculatorRequest,
  PayCalculatorResponse,
  CalculationTrace,
  TraceReference,
} from './types';
import {
  getTaxYearData,
  calcIncomeTax,
  calcLITO,
  calcMedicareLevy,
  calcMLS,
  calcHELP,
  calcSG,
  getMarginalTaxRate,
  calcPAYGWithholding,
  convertGrossToPeriod,
} from './engine';

export const calculate = api(
  { method: 'POST', path: '/au/paycalc/estimate', expose: true },
  async (req: PayCalculatorRequest): Promise<PayCalculatorResponse> => {
    const {
      year,
      grossAnnual,
      period,
      residency,
      claimTaxFreeThreshold,
      hasHelp,
      privateCover,
      dependants = 0,
      spouseIncome = 0,
      salarySacrifice = 0,
      includeSuper,
      isSenior = false,
    } = req;

    const data = getTaxYearData(year);
    
    let ordinaryTimeEarnings = grossAnnual;
    let superannuation = 0;
    
    if (includeSuper) {
      ordinaryTimeEarnings = grossAnnual / (1 + data.superGuaranteeRate);
      superannuation = ordinaryTimeEarnings * data.superGuaranteeRate;
    } else {
      superannuation = calcSG(year, ordinaryTimeEarnings);
    }
    
    const taxableIncome = ordinaryTimeEarnings - salarySacrifice;
    
    let grossIncomeTax = 0;
    let litoApplied = 0;
    let medicareLevy = 0;
    let medicareLevySurcharge = 0;
    let helpRepayment = 0;
    
    if (residency === 'resident') {
      grossIncomeTax = calcIncomeTax(year, taxableIncome, residency);
      litoApplied = calcLITO(year, taxableIncome);
      
      const isFamily = dependants > 0 || spouseIncome > 0;
      medicareLevy = calcMedicareLevy(year, taxableIncome, {
        isFamily,
        dependants,
        spouseIncome,
        isSenior,
      });
      
      const mlsIncome = taxableIncome + (salarySacrifice || 0);
      medicareLevySurcharge = calcMLS(year, mlsIncome, privateCover, dependants);
    } else {
      grossIncomeTax = calcIncomeTax(year, taxableIncome, residency);
    }
    
    if (hasHelp) {
      const repaymentIncome = taxableIncome + (salarySacrifice || 0);
      helpRepayment = calcHELP(year, repaymentIncome);
    }
    
    const netIncomeTax = Math.max(0, grossIncomeTax - litoApplied);
    const totalTax = netIncomeTax + medicareLevy + medicareLevySurcharge + helpRepayment;
    const netAnnual = taxableIncome - totalTax;
    
    const grossPeriod = convertGrossToPeriod(taxableIncome, period);
    const netPeriod = convertGrossToPeriod(netAnnual, period);
    const incomeTaxPeriod = convertGrossToPeriod(netIncomeTax, period);
    const medicareLevyPeriod = convertGrossToPeriod(medicareLevy, period);
    const medicareLevySurchargePeriod = convertGrossToPeriod(medicareLevySurcharge, period);
    const helpRepaymentPeriod = convertGrossToPeriod(helpRepayment, period);
    const totalTaxPeriod = convertGrossToPeriod(totalTax, period);
    const superannuationPeriod = convertGrossToPeriod(superannuation, period);
    
    const effectiveTaxRate = taxableIncome > 0 ? (totalTax / taxableIncome) * 100 : 0;
    const marginalTaxRate = getMarginalTaxRate(year, taxableIncome, residency) * 100;
    
    const references: TraceReference[] = [
      {
        field: 'incomeTax',
        source: 'Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024',
        url: 'https://www.legislation.gov.au/C2024A00003/latest/text',
      },
      {
        field: 'lito',
        source: 'ATO Low Income Tax Offset',
        url: 'https://www.ato.gov.au/tax-rates-and-codes/tax-offset-rates',
      },
      {
        field: 'medicareLevy',
        source: 'ATO Medicare Levy',
        url: 'https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy',
      },
    ];
    
    if (medicareLevySurcharge > 0) {
      references.push({
        field: 'medicareLevySurcharge',
        source: 'ATO Medicare Levy Surcharge',
        url: 'https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge',
      });
    }
    
    if (hasHelp) {
      references.push({
        field: 'helpRepayment',
        source: 'ATO HELP Repayment',
        url: 'https://www.ato.gov.au/individuals-and-families/education-and-training/help-hecs-and-other-study-loans/help-repayment',
      });
    }
    
    references.push({
      field: 'superannuation',
      source: 'ATO Super Guarantee',
      url: 'https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/super-guarantee-contribution-rates',
    });
    
    const trace: CalculationTrace = {
      taxableIncome,
      grossIncomeTax,
      litoApplied,
      netIncomeTax,
      medicareLevy,
      medicareLevySurcharge,
      helpRepayment,
      totalTax,
      superannuation,
      takeHome: netAnnual,
      references,
    };
    
    return {
      grossAnnual: taxableIncome,
      grossPeriod,
      incomeTax: netIncomeTax,
      incomeTaxPeriod,
      medicareLevy,
      medicareLevyPeriod,
      medicareLevySurcharge,
      medicareLevySurchargePeriod,
      helpRepayment,
      helpRepaymentPeriod,
      lito: litoApplied,
      totalTax,
      totalTaxPeriod,
      superannuation,
      superannuationPeriod,
      netAnnual,
      netPeriod,
      effectiveTaxRate,
      marginalTaxRate,
      trace,
    };
  }
);