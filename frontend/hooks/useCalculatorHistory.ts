import { useCallback } from 'react';
import { useCalculatorStore } from '../stores/calculatorStore';
import type { CalculatorType, CalculationInput, CalculationResult } from '../types/calculator';

interface SaveCalculationParams {
  calculatorType: CalculatorType;
  calculatorName: string;
  inputs: CalculationInput;
  results: CalculationResult;
  notes?: string;
  tags?: string[];
}

export function useCalculatorHistory() {
  const addCalculation = useCalculatorStore((state) => state.addCalculation);
  const getCalculationsByType = useCalculatorStore((state) => state.getCalculationsByType);

  const saveCalculation = useCallback(
    (params: SaveCalculationParams) => {
      const id = addCalculation({
        calculatorType: params.calculatorType,
        calculatorName: params.calculatorName,
        inputs: params.inputs,
        results: params.results,
        notes: params.notes,
        tags: params.tags,
      });
      return id;
    },
    [addCalculation]
  );

  const getHistory = useCallback(
    (calculatorType?: CalculatorType) => {
      if (calculatorType) {
        return getCalculationsByType(calculatorType);
      }
      return useCalculatorStore.getState().history;
    },
    [getCalculationsByType]
  );

  return {
    saveCalculation,
    getHistory,
  };
}
