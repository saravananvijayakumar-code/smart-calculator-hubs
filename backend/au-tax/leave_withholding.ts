import { api } from 'encore.dev/api';
import type { UnusedLeaveWithholdingRequest, UnusedLeaveWithholdingResponse } from './types';
import { calcPAYGWithholding } from './engine';

export const leaveWithholding = api(
  { method: 'POST', path: '/au/leave/withholding', expose: true },
  async (req: UnusedLeaveWithholdingRequest): Promise<UnusedLeaveWithholdingResponse> => {
    const {
      year,
      unusedLeaveAmount,
      ytdGross,
      residency,
      claimTaxFreeThreshold,
      hasHelp,
    } = req;

    if (residency !== 'resident') {
      const rate = residency === 'whm' ? 0.15 : 0.32;
      const withholdingAmount = unusedLeaveAmount * rate;
      
      return {
        leaveAmount: unusedLeaveAmount,
        withholdingAmount,
        netLeave: unusedLeaveAmount - withholdingAmount,
        withholdingRate: rate * 100,
        explanation: `Non-resident unused leave payments use flat withholding rate of ${rate * 100}% as per ATO Schedule 7.`,
      };
    }

    const totalGross = ytdGross + unusedLeaveAmount;
    
    const totalWithholding = calcPAYGWithholding(year, totalGross / 52, 'weekly', claimTaxFreeThreshold, hasHelp) * 52;
    const ytdWithholding = calcPAYGWithholding(year, ytdGross / 52, 'weekly', claimTaxFreeThreshold, hasHelp) * 52;
    
    const withholdingAmount = Math.max(0, totalWithholding - ytdWithholding);
    
    return {
      leaveAmount: unusedLeaveAmount,
      withholdingAmount: Math.round(withholdingAmount),
      netLeave: unusedLeaveAmount - Math.round(withholdingAmount),
      withholdingRate: (withholdingAmount / unusedLeaveAmount) * 100,
      explanation: 'Unused leave withholding calculated using annualised method per ATO Schedule 7, based on year-to-date earnings plus leave payment.',
    };
  }
);