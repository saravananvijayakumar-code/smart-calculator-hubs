// @ts-nocheck
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { SEOHead } from '@/components/SEOHead';
import { Wallet } from 'lucide-react';

const TAX_DISTRIBUTION_2024 = [
  { name: 'Social Security & Welfare', value: 36.5, color: '#3b82f6' },
  { name: 'Health', value: 16.8, color: '#10b981' },
  { name: 'Education', value: 7.9, color: '#f59e0b' },
  { name: 'Defence', value: 6.2, color: '#ef4444' },
  { name: 'Public Order & Safety', value: 3.8, color: '#8b5cf6' },
  { name: 'General Public Services', value: 8.4, color: '#ec4899' },
  { name: 'Transport & Communications', value: 4.3, color: '#14b8a6' },
  { name: 'Recreation & Culture', value: 1.6, color: '#f97316' },
  { name: 'Economic Affairs', value: 9.7, color: '#06b6d4' },
  { name: 'Environment Protection', value: 2.1, color: '#84cc16' },
  { name: 'Other', value: 2.7, color: '#64748b' },
];

export default function TaxDistributionAustralia() {
  const [annualIncome, setAnnualIncome] = useState('75000');
  const [totalTax, setTotalTax] = useState(0);
  const [distribution, setDistribution] = useState<any[]>([]);

  const calculateDistribution = () => {
    const income = parseFloat(annualIncome) || 75000;
    
    let taxAmount = 0;
    if (income <= 18200) {
      taxAmount = 0;
    } else if (income <= 45000) {
      taxAmount = (income - 18200) * 0.16;
    } else if (income <= 135000) {
      taxAmount = 4288 + (income - 45000) * 0.30;
    } else if (income <= 190000) {
      taxAmount = 31288 + (income - 135000) * 0.37;
    } else {
      taxAmount = 51638 + (income - 190000) * 0.45;
    }

    const lito = income <= 37500 ? 700 : income <= 66667 ? Math.max(0, 700 - (income - 37500) * 0.05) : 0;
    taxAmount = Math.max(0, taxAmount - lito);

    const medicareLevy = income > 26000 ? income * 0.02 : 0;
    const totalTaxPaid = taxAmount + medicareLevy;

    setTotalTax(totalTaxPaid);

    const dist = TAX_DISTRIBUTION_2024.map(item => ({
      ...item,
      amount: (totalTaxPaid * item.value) / 100,
    }));

    setDistribution(dist);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <>
      <SEOHead
        title="Where Your Tax Goes Australia | Federal Budget Breakdown"
        description="Visualize how your Australian tax dollars are spent across government services. See the breakdown of federal budget allocation by income level."
        keywords="tax distribution Australia, where tax goes, federal budget breakdown, government spending Australia"
      />

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Where Your Tax Goes</h1>
          <p className="text-muted-foreground">
            See how your tax dollars are distributed across Australian government services
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Your Income</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="annualIncome">Annual Taxable Income</Label>
                  <Input
                    id="annualIncome"
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    placeholder="75000"
                  />
                </div>

                <Button onClick={calculateDistribution} className="w-full" size="lg">
                  Calculate Tax Distribution
                </Button>
              </div>
            </Card>

            {totalTax > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Your Tax Contribution</h3>
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatCurrency(totalTax)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimated annual tax paid (income tax + Medicare levy)
                </p>
              </Card>
            )}
          </div>

          <div>
            {distribution.length > 0 ? (
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Federal Budget Allocation</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={distribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {distribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => [
                          `${formatCurrency(props.payload.amount)} (${value}%)`,
                          name
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Breakdown by Category</h3>
                  <div className="space-y-3 text-sm">
                    {distribution.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{formatCurrency(item.amount)}</div>
                          <div className="text-xs text-muted-foreground">{item.value}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            ) : (
              <Card className="p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <Wallet className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Ready to Visualize</h3>
                <p className="text-muted-foreground">
                  Enter your income and click Calculate to see where your tax goes
                </p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 prose prose-sm max-w-none dark:prose-invert">
          <h2>Understanding Where Your Tax Goes</h2>
          
          <h3>How This Works</h3>
          <p>
            This calculator shows an estimated breakdown of how the Australian federal government allocates tax revenue across major spending categories. The percentages are based on the 2023-24 federal budget allocation and are used to illustrate how your individual tax contribution is distributed.
          </p>

          <h3>Major Spending Categories</h3>
          
          <h4>Social Security & Welfare (36.5%)</h4>
          <p>
            The largest category of government spending, including:
          </p>
          <ul>
            <li>Age Pension and other pension payments</li>
            <li>Family Tax Benefits and parenting payments</li>
            <li>Disability Support Pension (DSP)</li>
            <li>Unemployment benefits (JobSeeker)</li>
            <li>Carer payments and allowances</li>
            <li>Veterans' pensions and support services</li>
          </ul>

          <h4>Health (16.8%)</h4>
          <p>
            Healthcare services and programs:
          </p>
          <ul>
            <li>Medicare and the Pharmaceutical Benefits Scheme (PBS)</li>
            <li>Public hospital funding</li>
            <li>Mental health services</li>
            <li>Medical research</li>
            <li>Indigenous health programs</li>
            <li>Preventive health initiatives</li>
          </ul>

          <h4>Education (7.9%)</h4>
          <p>
            Education funding across all levels:
          </p>
          <ul>
            <li>Higher education (universities and HELP loans)</li>
            <li>Schools funding (through states and territories)</li>
            <li>Vocational education and training (VET)</li>
            <li>Student assistance programs</li>
            <li>Early childhood education</li>
          </ul>

          <h4>Defence (6.2%)</h4>
          <p>
            National defense and security:
          </p>
          <ul>
            <li>Australian Defence Force operations</li>
            <li>Defence equipment and capability</li>
            <li>Veterans' affairs</li>
            <li>Intelligence and national security</li>
          </ul>

          <h4>Economic Affairs (9.7%)</h4>
          <p>
            Economic development and infrastructure:
          </p>
          <ul>
            <li>Industry assistance and innovation</li>
            <li>Agriculture and natural resources</li>
            <li>Energy programs</li>
            <li>Tourism and trade promotion</li>
            <li>Employment programs</li>
          </ul>

          <h4>General Public Services (8.4%)</h4>
          <p>
            Core government functions:
          </p>
          <ul>
            <li>Parliament and executive government</li>
            <li>Tax collection (ATO)</li>
            <li>Public debt interest payments</li>
            <li>Foreign affairs and aid</li>
            <li>General administration</li>
          </ul>

          <h4>Transport & Communications (4.3%)</h4>
          <p>
            Infrastructure and connectivity:
          </p>
          <ul>
            <li>Roads and highways</li>
            <li>Railways</li>
            <li>Aviation and airports</li>
            <li>Broadband (NBN)</li>
            <li>Postal services</li>
          </ul>

          <h4>Public Order & Safety (3.8%)</h4>
          <p>
            Law enforcement and justice:
          </p>
          <ul>
            <li>Federal police (AFP)</li>
            <li>Border protection</li>
            <li>Courts and legal services</li>
            <li>Prisons and corrections</li>
            <li>Emergency management</li>
          </ul>

          <h4>Environment Protection (2.1%)</h4>
          <p>
            Environmental programs:
          </p>
          <ul>
            <li>Climate change initiatives</li>
            <li>Biodiversity and conservation</li>
            <li>Water management</li>
            <li>Renewable energy programs</li>
            <li>Pollution control</li>
          </ul>

          <h4>Recreation & Culture (1.6%)</h4>
          <p>
            Arts, sports, and cultural services:
          </p>
          <ul>
            <li>ABC and SBS funding</li>
            <li>Arts grants and cultural institutions</li>
            <li>Sports programs</li>
            <li>National parks and heritage</li>
          </ul>

          <h3>Important Notes</h3>
          
          <h4>This is a Simplification</h4>
          <p>
            The actual flow of tax revenue is more complex than shown here. This calculator:
          </p>
          <ul>
            <li>Uses federal budget allocation percentages as a proxy for tax distribution</li>
            <li>Doesn't distinguish between income tax, GST, corporate tax, and other revenue sources</li>
            <li>Represents a snapshot of one budget year (allocations change annually)</li>
            <li>Doesn't account for state/territory spending funded by federal grants</li>
          </ul>

          <h4>Federal vs State/Territory Responsibilities</h4>
          <p>
            Australia has three levels of government with different responsibilities:
          </p>
          <ul>
            <li><strong>Federal:</strong> Social security, Medicare, defence, immigration, taxation</li>
            <li><strong>State/Territory:</strong> Schools, hospitals, police, roads, public transport</li>
            <li><strong>Local:</strong> Waste collection, libraries, local roads, parks</li>
          </ul>
          <p>
            Your federal income tax primarily funds federal services, though significant grants go to states for health, education, and infrastructure.
          </p>

          <h3>How Tax Revenue is Collected</h3>
          <p>
            The federal government collects revenue from multiple sources:
          </p>
          <ul>
            <li><strong>Income tax (individuals):</strong> ~45% of total revenue</li>
            <li><strong>Company tax:</strong> ~20%</li>
            <li><strong>GST (distributed to states):</strong> ~13%</li>
            <li><strong>Superannuation taxes:</strong> ~5%</li>
            <li><strong>Excise and customs duties:</strong> ~8%</li>
            <li><strong>Other taxes and fees:</strong> ~9%</li>
          </ul>

          <h3>Budget Transparency</h3>
          <p>
            The Australian government publishes detailed budget documents annually, including:
          </p>
          <ul>
            <li><strong>Budget Papers:</strong> Comprehensive spending and revenue forecasts</li>
            <li><strong>Portfolio Budget Statements:</strong> Detailed program-level spending</li>
            <li><strong>Final Budget Outcome:</strong> Actual spending vs. estimates</li>
          </ul>
          <p>
            All documents are available on the Treasury and Department of Finance websites.
          </p>

          <h3>References</h3>
          <ul>
            <li><a href="https://budget.gov.au/" target="_blank" rel="noopener">Australian Government Budget Portal</a></li>
            <li><a href="https://treasury.gov.au/" target="_blank" rel="noopener">Department of Treasury</a></li>
            <li><a href="https://www.finance.gov.au/" target="_blank" rel="noopener">Department of Finance</a></li>
          </ul>

          <h3>Disclaimer</h3>
          <p>
            This visualization is for educational purposes only and provides a simplified representation of budget allocation. Actual government spending is subject to annual budget processes, mid-year updates, and supplementary appropriations. The percentages shown are indicative and based on recent federal budget data.
          </p>
        </div>
      </div>
    </>
  );
}