// @ts-nocheck
import { useMemo } from 'react';
import { useCalculatorStore } from '../stores/calculatorStore';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, X, Calendar, ArrowUpDown } from 'lucide-react';

interface ComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ComparisonModal({ open, onOpenChange }: ComparisonModalProps) {
  const { selectedForComparison, getCalculationById, toggleComparisonSelection } =
    useCalculatorStore();

  const calculations = useMemo(() => {
    return selectedForComparison
      .map((id) => getCalculationById(id))
      .filter(Boolean);
  }, [selectedForComparison, getCalculationById]);

  const allKeys = useMemo(() => {
    const keysSet = new Set<string>();
    calculations.forEach((calc) => {
      if (calc) {
        Object.keys(calc.results).forEach((key) => keysSet.add(key));
        Object.keys(calc.inputs).forEach((key) => keysSet.add(`input_${key}`));
      }
    });
    return Array.from(keysSet);
  }, [calculations]);

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'number') {
      if (Number.isInteger(value)) return value.toLocaleString();
      return value.toLocaleString(undefined, { maximumFractionDigits: 2 });
    }
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  const formatKey = (key: string): string => {
    const cleanKey = key.startsWith('input_') ? key.substring(6) : key;
    return cleanKey
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getComparisonCategory = (key: string): 'input' | 'result' => {
    return key.startsWith('input_') ? 'input' : 'result';
  };

  const inputKeys = allKeys.filter((key) => getComparisonCategory(key) === 'input');
  const resultKeys = allKeys.filter((key) => getComparisonCategory(key) === 'result');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Compare Calculations ({calculations.length})
          </DialogTitle>
          <DialogDescription>
            Side-by-side comparison of your selected calculations
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[calc(90vh-120px)] pr-4">
          <div className="space-y-6">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(calculations.length, 3)}, 1fr)` }}>
              {calculations.slice(0, 3).map((calc) => {
                if (!calc) return null;
                return (
                  <Card key={calc.id} className="p-4 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={() => toggleComparisonSelection(calc.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="space-y-2 mb-4">
                      <h3 className="font-semibold text-lg pr-8">{calc.calculatorName}</h3>
                      <Badge variant="outline">{calc.calculatorType}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(calc.timestamp)}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {calculations.length > 3 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing first 3 of {calculations.length} selected calculations
              </div>
            )}

            <Separator />

            {inputKeys.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ArrowUpDown className="w-4 h-4" />
                  Input Parameters
                </h3>
                <div className="space-y-2">
                  {inputKeys.map((key) => (
                    <div
                      key={key}
                      className="grid gap-4 p-3 bg-muted/50 rounded-lg"
                      style={{ gridTemplateColumns: `200px repeat(${Math.min(calculations.length, 3)}, 1fr)` }}
                    >
                      <div className="font-medium text-sm flex items-center">
                        {formatKey(key)}
                      </div>
                      {calculations.slice(0, 3).map((calc) => {
                        if (!calc) return null;
                        const cleanKey = key.substring(6);
                        const value = calc.inputs[cleanKey];
                        return (
                          <div key={calc.id} className="text-sm">
                            {formatValue(value)}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resultKeys.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Results
                </h3>
                <div className="space-y-2">
                  {resultKeys.map((key) => {
                    const values = calculations.slice(0, 3).map((calc) => calc?.results[key]);
                    const allNumeric = values.every((v) => typeof v === 'number');
                    const hasVariance = allNumeric && new Set(values).size > 1;

                    return (
                      <div
                        key={key}
                        className={`grid gap-4 p-3 rounded-lg ${
                          hasVariance ? 'bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900' : 'bg-muted/50'
                        }`}
                        style={{ gridTemplateColumns: `200px repeat(${Math.min(calculations.length, 3)}, 1fr)` }}
                      >
                        <div className="font-medium text-sm flex items-center">
                          {formatKey(key)}
                        </div>
                        {calculations.slice(0, 3).map((calc) => {
                          if (!calc) return null;
                          const value = calc.results[key];
                          return (
                            <div key={calc.id} className="text-sm font-semibold">
                              {formatValue(value)}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {calculations.some((c) => c?.notes) && (
              <div>
                <h3 className="font-semibold text-lg mb-4">Notes</h3>
                <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.min(calculations.length, 3)}, 1fr)` }}>
                  {calculations.slice(0, 3).map((calc) => {
                    if (!calc) return null;
                    return (
                      <Card key={calc.id} className="p-4">
                        {calc.notes ? (
                          <p className="text-sm text-muted-foreground">{calc.notes}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">No notes</p>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
