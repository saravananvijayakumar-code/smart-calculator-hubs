import { api } from 'encore.dev/api';
import type { BonusWithholdingRequest, BonusWithholdingResponse } from './types';
import { calcPAYGWithholding, convertPeriodToAnnual } from './engine';

export const bonusWithholding = api(
  { method: 'POST', path: '/au/bonus/withholding', expose: true },
  async (req: BonusWithholdingRequest): Promise<BonusWithholdingResponse> => {
    const {
      year,
      regularGross,
      payPeriod,
      bonusAmount,
      residency,
      claimTaxFreeThreshold,
      hasHelp,
      method = 'B',
    } = req;

    if (residency !== 'resident') {
      const rate = residency === 'whm' ? 0.15 : 0.30;
      const withholdingAmount = bonusAmount * rate;
      
      return {
        bonusAmount,
        withholdingAmount,
        netBonus: bonusAmount - withholdingAmount,
        withholdingRate: rate * 100,
        method: 'A',
        explanation: `Non-resident and WHM bonus payments use flat withholding rate of ${rate * 100}% as per ATO Schedule 5.`,
      };
    }

    let withholdingAmount = 0;
    let explanation = '';

    if (method === 'A') {
      const flatRate = 0.47;
      withholdingAmount = bonusAmount * flatRate;
      explanation = 'Method A applies the top marginal tax rate (47%) to the bonus amount. This is the simplest method per ATO Schedule 5.';
    } else {
      const annualRegularGross = convertPeriodToAnnual(regularGross, payPeriod);
      const totalGross = annualRegularGross + bonusAmount;
      
      const totalWithholding = calcPAYGWithholding(year, totalGross / 52, 'weekly', claimTaxFreeThreshold, hasHelp) * 52;
      const regularWithholding = calcPAYGWithholding(year, annualRegularGross / 52, 'weekly', claimTaxFreeThreshold, hasHelp) * 52;
      
      withholdingAmount = Math.max(0, totalWithholding - regularWithholding);
      
      explanation = 'Method B calculates withholding based on annualised income with and without the bonus, using PAYG Schedule 1 formulas. This provides a more accurate withholding amount per ATO Schedule 5.';
    }

    return {
      bonusAmount,
      withholdingAmount: Math.round(withholdingAmount),
      netBonus: bonusAmount - Math.round(withholdingAmount),
      withholdingRate: (withholdingAmount / bonusAmount) * 100,
      method,
      explanation,
    };
  }
);