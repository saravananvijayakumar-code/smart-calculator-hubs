import { Link } from 'react-router-dom';
import { Calculator, DollarSign, TrendingUp, Wallet, FileText, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';

export default function AUPayTaxHub() {
  const tools = [
    {
      title: 'Pay Calculator',
      description: 'ATO-accurate take-home pay calculator with PAYG withholding, HELP, Medicare levy & MLS',
      icon: Calculator,
      path: '/au/pay-calculator',
      color: 'bg-blue-500',
    },
    {
      title: 'Bonus Tax Calculator',
      description: 'Calculate withholding on bonus, commission & back-pay (ATO Schedule 5)',
      icon: DollarSign,
      path: '/au/bonus-tax',
      color: 'bg-green-500',
    },
    {
      title: 'Unused Leave Tax',
      description: 'Termination payment & unused leave withholding (ATO Schedule 7)',
      icon: FileText,
      path: '/au/unused-leave',
      color: 'bg-purple-500',
    },
    {
      title: 'HELP Loan Projection',
      description: 'Student loan payoff calculator with compulsory & voluntary repayments',
      icon: TrendingUp,
      path: '/au/student-loan',
      color: 'bg-orange-500',
    },
    {
      title: 'Tax Distribution',
      description: 'See where your tax dollars go - visualise federal budget allocation',
      icon: Wallet,
      path: '/au/tax-distribution',
      color: 'bg-teal-500',
    },
    {
      title: 'Tax Information',
      description: 'Guide to Australian tax system with ATO references & citations',
      icon: Info,
      path: '/au/tax-info',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <>
      <SEOHead
        title="Australia Pay & Tax Hub | ATO-Accurate Calculators"
        description="Comprehensive suite of ATO-accurate Australian pay and tax calculators for FY 2024-25 and 2025-26. Calculate take-home pay, PAYG withholding, HELP repayments, bonus tax, and more."
        keywords="Australian tax calculator, PAYG calculator, HELP calculator, take home pay Australia, ATO calculator, bonus tax calculator, student loan calculator"
      />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Australia Pay & Tax Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            ATO-accurate calculators for FY 2024-25 & 2025-26. All calculations use official tax brackets from the Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024 and PAYG Schedule 1 withholding formulas.
          </p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>✓ Stage 3 tax cuts implemented | ✓ PAYG Schedule 1 formulas | ✓ HELP marginal method (2025-26)</p>
            <p>✓ Medicare levy reduction | ✓ MLS tiers | ✓ Super Guarantee 11.5% (24-25) / 12% (25-26)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.path} to={tool.path} className="group">
              <Card className="p-6 h-full hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground flex-grow">
                    {tool.description}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 bg-muted/50 rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Why Trust These Calculators?</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Official ATO Formulas</h3>
              <p className="text-muted-foreground">
                Uses PAYG Schedule 1 coefficients from NAT 1004, not simplified approximations. Matches ATO withholding tables within $1 rounding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Current Legislation</h3>
              <p className="text-muted-foreground">
                Implements Stage 3 tax cuts (16%, 30%, 37%, 45% rates) from the Cost of Living Tax Cuts Act 2024, effective 1 July 2024.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Complete Coverage</h3>
              <p className="text-muted-foreground">
                Handles LITO, Medicare levy reduction, MLS tiers, HELP thresholds, and all residency types (Resident, Non-resident, WHM).
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Year-Versioned</h3>
              <p className="text-muted-foreground">
                Separate configurations for FY 2024-25 and 2025-26, accounting for Super Guarantee increase (11.5% → 12%) and HELP changes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            <strong>Disclaimer:</strong> These calculators provide general information only and should not be relied upon as tax advice. 
            Always consult a registered tax agent or the ATO for your specific circumstances.
          </p>
        </div>
      </div>
    </>
  );
}