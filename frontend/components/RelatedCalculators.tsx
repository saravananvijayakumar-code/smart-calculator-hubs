import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { AppleStyleCard } from './AppleStyleCard';
import { CALCULATOR_DATA, CalculatorItem } from './CalculatorCategory';

interface RelatedCalculatorsProps {
  currentCalculatorId: string;
  limit?: number;
  showPopular?: boolean;
}

export function RelatedCalculators({ currentCalculatorId, limit = 4, showPopular = false }: RelatedCalculatorsProps) {
  const currentCalculator = CALCULATOR_DATA.find(calc => calc.id === currentCalculatorId);
  
  if (!currentCalculator) return null;

  // Find related calculators based on category, region, and popularity
  const getRelatedCalculators = (): CalculatorItem[] => {
    let related = CALCULATOR_DATA.filter(calc => 
      calc.id !== currentCalculatorId
    );

    if (showPopular) {
      // Show most popular calculators overall
      related = related
        .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
        .slice(0, limit);
    } else {
      // Prioritize same category and region
      const sameCategory = related.filter(calc => 
        calc.category === currentCalculator.category || 
        calc.region === currentCalculator.region
      );
      
      const otherCalculators = related.filter(calc => 
        calc.category !== currentCalculator.category && 
        calc.region !== currentCalculator.region
      );

      // Combine and sort by popularity
      related = [
        ...sameCategory.sort((a, b) => (b.popularity || 0) - (a.popularity || 0)),
        ...otherCalculators.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      ].slice(0, limit);
    }

    return related;
  };

  const relatedCalculators = getRelatedCalculators();

  if (relatedCalculators.length === 0) return null;

  return (
    <AppleStyleCard className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        {showPopular ? (
          <>
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Popular Calculators</h3>
          </>
        ) : (
          <>
            <ArrowRight className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-semibold">Related Calculators</h3>
          </>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {relatedCalculators.map((calculator) => (
          <Link
            key={calculator.id}
            to={calculator.path}
            className="group"
          >
            <div className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent/50 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                    {calculator.name}
                  </h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {calculator.description}
                  </p>
                  {calculator.featured && (
                    <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md">
                      Featured
                    </span>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 flex-shrink-0 ml-2" />
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-border">
        <Link 
          to="/calculators" 
          className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
        >
          View all calculators
          <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>
    </AppleStyleCard>
  );
}