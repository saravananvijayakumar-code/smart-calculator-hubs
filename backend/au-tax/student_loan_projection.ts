import { api } from 'encore.dev/api';
import type {
  StudentLoanProjectionRequest,
  StudentLoanProjectionResponse,
  YearProjection,
} from './types';
import { calcHELP } from './engine';

export const studentLoanProjection = api(
  { method: 'POST', path: '/au/student-loan/projection', expose: true },
  async (req: StudentLoanProjectionRequest): Promise<StudentLoanProjectionResponse> => {
    const {
      year,
      currentBalance,
      annualIncome,
      incomeGrowthRate,
      indexationRate,
      voluntaryRepayment = 0,
    } = req;

    const projections: YearProjection[] = [];
    let balance = currentBalance;
    let income = annualIncome;
    let yearNum = 1;
    let totalPaid = 0;

    const maxYears = 50;

    while (balance > 0 && yearNum <= maxYears) {
      const startingBalance = balance;
      
      const compulsoryRepayment = calcHELP(year, income);
      const totalRepayment = compulsoryRepayment + voluntaryRepayment;
      
      balance -= totalRepayment;
      totalPaid += totalRepayment;
      
      if (balance > 0) {
        const indexation = balance * indexationRate;
        balance += indexation;
        
        projections.push({
          year: yearNum,
          startingBalance,
          compulsoryRepayment,
          voluntaryRepayment,
          indexation,
          endingBalance: balance,
          income,
        });
      } else {
        const actualRepayment = startingBalance;
        totalPaid -= (totalRepayment - actualRepayment);
        
        projections.push({
          year: yearNum,
          startingBalance,
          compulsoryRepayment: Math.min(compulsoryRepayment, actualRepayment),
          voluntaryRepayment: Math.max(0, actualRepayment - compulsoryRepayment),
          indexation: 0,
          endingBalance: 0,
          income,
        });
        
        break;
      }
      
      income *= (1 + incomeGrowthRate);
      yearNum++;
    }

    const payoffYear = balance <= 0 ? yearNum : null;
    const totalInterest = projections.reduce((sum, p) => sum + p.indexation, 0);

    return {
      projections,
      payoffYear,
      totalPaid,
      totalInterest,
    };
  }
);