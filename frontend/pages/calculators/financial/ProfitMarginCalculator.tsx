import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { SEOHead } from '../../../components/SEOHead';
import { AppleStyleInput } from '../../../components/AppleStyleInput';
import { AIAnalysis } from '../../../components/AIAnalysis';
import { formatCurrency } from '../../../utils/formatting';

export function ProfitMarginCalculator() {
  const [revenue, setRevenue] = useState('100000');
  const [cogs, setCogs] = useState('40000');
  const [operatingExpenses, setOperatingExpenses] = useState('30000');
  const [otherExpenses, setOtherExpenses] = useState('5000');
  const [calculated, setCalculated] = useState(false);

  const revenueNum = parseFloat(revenue) || 0;
  const cogsNum = parseFloat(cogs) || 0;
  const opExNum = parseFloat(operatingExpenses) || 0;
  const otherExNum = parseFloat(otherExpenses) || 0;

  const grossProfit = revenueNum - cogsNum;
  const grossMargin = revenueNum > 0 ? (grossProfit / revenueNum) * 100 : 0;
  
  const operatingProfit = grossProfit - opExNum;
  const operatingMargin = revenueNum > 0 ? (operatingProfit / revenueNum) * 100 : 0;
  
  const netProfit = operatingProfit - otherExNum;
  const netMargin = revenueNum > 0 ? (netProfit / revenueNum) * 100 : 0;

  const handleCalculate = () => {
    setCalculated(true);
  };

  return (
    <>
      <SEOHead
        title="Profit Margin Calculator - Calculate Gross, Operating & Net Margins"
        description="Free profit margin calculator. Calculate gross margin, operating margin, and net profit margin for your business. Compare industry benchmarks and improve profitability."
        keywords="profit margin calculator, gross margin calculator, net margin calculator, operating margin, profit calculator, business profitability, margin analysis"
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-blue-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Profit Margin Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Analyze your business profitability with gross, operating, and net profit margins
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-6 w-6" />
                  Business Financials
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <AppleStyleInput
                  label="Total Revenue"
                  type="number"
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  placeholder="100000"
                  prefix="$"
                />
                
                <AppleStyleInput
                  label="Cost of Goods Sold (COGS)"
                  type="number"
                  value={cogs}
                  onChange={(e) => setCogs(e.target.value)}
                  placeholder="40000"
                  prefix="$"
                />
                
                <AppleStyleInput
                  label="Operating Expenses"
                  type="number"
                  value={operatingExpenses}
                  onChange={(e) => setOperatingExpenses(e.target.value)}
                  placeholder="30000"
                  prefix="$"
                />
                
                <AppleStyleInput
                  label="Other Expenses (Interest, Taxes)"
                  type="number"
                  value={otherExpenses}
                  onChange={(e) => setOtherExpenses(e.target.value)}
                  placeholder="5000"
                  prefix="$"
                />

                <Button 
                  onClick={handleCalculate}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-6 text-lg"
                >
                  Calculate Profit Margins
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Gross Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                      {grossMargin.toFixed(2)}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mb-4">
                      Gross Profit: {formatCurrency(grossProfit, 'USD')}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(grossMargin, 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-purple-200 dark:border-purple-800">
                <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6" />
                    Operating Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {operatingMargin.toFixed(2)}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mb-4">
                      Operating Profit: {formatCurrency(operatingProfit, 'USD')}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(Math.max(operatingMargin, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2 border-blue-200 dark:border-blue-800">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    {netProfit >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                    Net Profit Margin
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${netProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                      {netMargin.toFixed(2)}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 mb-4">
                      Net Profit: {formatCurrency(netProfit, 'USD')}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`${netProfit >= 0 ? 'bg-gradient-to-r from-blue-500 to-cyan-600' : 'bg-gradient-to-r from-red-500 to-pink-600'} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${Math.min(Math.max(netMargin, 0), 100)}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Card className="shadow-lg mb-12">
            <CardHeader>
              <CardTitle>Revenue Breakdown Waterfall</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <span className="font-semibold">Revenue</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(revenueNum, 'USD')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg border-l-4 border-red-500">
                  <span className="font-semibold">- COGS</span>
                  <span className="text-xl font-bold text-red-600">-{formatCurrency(cogsNum, 'USD')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950 rounded-lg border-l-4 border-green-500">
                  <span className="font-semibold">= Gross Profit ({grossMargin.toFixed(1)}%)</span>
                  <span className="text-xl font-bold text-green-600">{formatCurrency(grossProfit, 'USD')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg border-l-4 border-red-500">
                  <span className="font-semibold">- Operating Expenses</span>
                  <span className="text-xl font-bold text-red-600">-{formatCurrency(opExNum, 'USD')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border-l-4 border-purple-500">
                  <span className="font-semibold">= Operating Profit ({operatingMargin.toFixed(1)}%)</span>
                  <span className="text-xl font-bold text-purple-600">{formatCurrency(operatingProfit, 'USD')}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-950 rounded-lg border-l-4 border-red-500">
                  <span className="font-semibold">- Other Expenses</span>
                  <span className="text-xl font-bold text-red-600">-{formatCurrency(otherExNum, 'USD')}</span>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${netProfit >= 0 ? 'bg-blue-50 dark:bg-blue-950 border-blue-500' : 'bg-red-50 dark:bg-red-950 border-red-500'}`}>
                  <span className="font-semibold">= Net Profit ({netMargin.toFixed(1)}%)</span>
                  <span className={`text-xl font-bold ${netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>{formatCurrency(netProfit, 'USD')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {calculated && (
            <AIAnalysis
              analysisRequest={{
                calculatorType: "profit_margin",
                data: {
                  revenue: revenueNum,
                  cogs: cogsNum,
                  operatingExpenses: opExNum,
                  otherExpenses: otherExNum,
                  grossMargin: grossMargin,
                  operatingMargin: operatingMargin,
                  netMargin: netMargin,
                  grossProfit: grossProfit,
                  operatingProfit: operatingProfit,
                  netProfit: netProfit
                }
              }}
            />
          )}

          <div className="prose prose-lg max-w-none dark:prose-invert mt-12 space-y-8">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Understanding Profit Margins</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Profit margins are critical financial metrics that measure how much profit a business generates from its revenue. They are expressed as percentages and provide insights into operational efficiency, pricing strategy, and overall financial health. Understanding your profit margins helps you make informed decisions about cost control, pricing adjustments, and business strategy.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                There are three primary types of profit margins: <strong>Gross Profit Margin</strong>, <strong>Operating Profit Margin</strong>, and <strong>Net Profit Margin</strong>. Each margin reveals different aspects of your business performance, from production efficiency to overall profitability after all expenses.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Types of Profit Margins</h2>
              
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Gross Profit Margin</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Definition:</strong> Gross profit margin measures the percentage of revenue remaining after deducting the Cost of Goods Sold (COGS). It reflects how efficiently a company produces or sources its products.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Formula:</strong> Gross Profit Margin = ((Revenue - COGS) / Revenue) × 100
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>What it Measures:</strong> This margin indicates how well you control production costs and pricing. A higher gross margin means you're retaining more money from each sale to cover operating expenses and generate profit.
              </p>
              <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                <h4 className="font-bold text-lg mb-2">Industry Benchmarks for Gross Margin:</h4>
                <ul className="space-y-2">
                  <li><strong>Software/SaaS:</strong> 70-90% (low COGS, high scalability)</li>
                  <li><strong>Consulting:</strong> 50-70% (mainly labor costs)</li>
                  <li><strong>Retail:</strong> 25-50% (varies by product category)</li>
                  <li><strong>Restaurant:</strong> 60-70% (food costs are primary COGS)</li>
                  <li><strong>Manufacturing:</strong> 20-40% (high material and labor costs)</li>
                  <li><strong>Construction:</strong> 15-25% (materials and labor intensive)</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Operating Profit Margin</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Definition:</strong> Operating profit margin (also called EBIT margin) measures the percentage of revenue left after deducting both COGS and operating expenses like salaries, rent, utilities, and marketing.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Formula:</strong> Operating Profit Margin = ((Revenue - COGS - Operating Expenses) / Revenue) × 100
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>What it Measures:</strong> This margin reveals how efficiently your business operates day-to-day, excluding financing and tax considerations. It shows your core business profitability.
              </p>
              <div className="bg-purple-50 dark:bg-purple-950 border-l-4 border-purple-500 p-6 rounded-lg mb-6">
                <h4 className="font-bold text-lg mb-2">Industry Benchmarks for Operating Margin:</h4>
                <ul className="space-y-2">
                  <li><strong>Software/SaaS:</strong> 10-25% (high margins after R&D)</li>
                  <li><strong>Consulting:</strong> 15-25% (moderate overhead)</li>
                  <li><strong>Retail:</strong> 5-10% (thin margins, high competition)</li>
                  <li><strong>Restaurant:</strong> 5-10% (high labor and rent costs)</li>
                  <li><strong>Manufacturing:</strong> 8-15% (moderate overhead)</li>
                  <li><strong>Construction:</strong> 3-8% (competitive industry)</li>
                </ul>
              </div>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Net Profit Margin</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Definition:</strong> Net profit margin is the ultimate measure of profitability, showing what percentage of revenue remains as actual profit after all expenses, including interest and taxes.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Formula:</strong> Net Profit Margin = ((Revenue - All Expenses) / Revenue) × 100
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>What it Measures:</strong> This is the bottom line - how much profit you actually keep from each dollar of revenue. It accounts for everything: production costs, operations, interest payments, and taxes.
              </p>
              <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                <h4 className="font-bold text-lg mb-2">Industry Benchmarks for Net Margin:</h4>
                <ul className="space-y-2">
                  <li><strong>Software/SaaS:</strong> 15-25% (high profitability)</li>
                  <li><strong>Consulting:</strong> 10-20% (good margins)</li>
                  <li><strong>Retail:</strong> 2-6% (competitive, thin margins)</li>
                  <li><strong>Restaurant:</strong> 3-6% (challenging industry)</li>
                  <li><strong>Manufacturing:</strong> 5-10% (moderate profitability)</li>
                  <li><strong>Construction:</strong> 2-5% (project-based, risky)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Strategies to Improve Profit Margins</h2>
              
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Increase Revenue Per Transaction</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li><strong>Upselling:</strong> Encourage customers to purchase higher-tier products or services with better margins</li>
                <li><strong>Bundling:</strong> Combine products/services to increase average transaction value and perceived value</li>
                <li><strong>Premium Tiers:</strong> Introduce premium offerings that justify higher prices and margins</li>
                <li><strong>Value-Based Pricing:</strong> Price based on customer value received rather than cost-plus pricing</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Reduce Cost of Goods Sold (COGS)</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li><strong>Supplier Negotiation:</strong> Negotiate better rates with suppliers, especially for bulk purchases or long-term contracts</li>
                <li><strong>Bulk Buying:</strong> Purchase materials in larger quantities to reduce per-unit costs</li>
                <li><strong>Waste Reduction:</strong> Implement lean manufacturing or inventory management to minimize waste and spoilage</li>
                <li><strong>Automation:</strong> Invest in technology to reduce labor costs and improve production efficiency</li>
                <li><strong>Alternative Suppliers:</strong> Research and test alternative suppliers who offer better pricing without sacrificing quality</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Cut Operating Expenses</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li><strong>Process Automation:</strong> Use software and technology to automate repetitive tasks and reduce labor costs</li>
                <li><strong>Renegotiate Contracts:</strong> Review and renegotiate contracts for rent, insurance, utilities, and services annually</li>
                <li><strong>Optimize Staffing:</strong> Right-size your workforce and consider outsourcing non-core functions</li>
                <li><strong>Energy Efficiency:</strong> Invest in energy-efficient equipment and practices to reduce utility costs</li>
                <li><strong>Remote Work:</strong> Consider remote or hybrid work models to reduce office space costs</li>
              </ul>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Optimize Pricing Strategy</h3>
              <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
                <li><strong>Competitor Analysis:</strong> Regularly analyze competitor pricing to ensure you're competitive yet profitable</li>
                <li><strong>Psychological Pricing:</strong> Use pricing tactics like $9.99 instead of $10.00 to increase perceived value</li>
                <li><strong>Tiered Pricing:</strong> Offer multiple pricing tiers to capture different customer segments and maximize revenue</li>
                <li><strong>Dynamic Pricing:</strong> Adjust prices based on demand, seasonality, or inventory levels to optimize margins</li>
                <li><strong>Regular Price Reviews:</strong> Review and adjust prices annually to account for cost increases and market changes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Common Profit Margin Mistakes to Avoid</h2>
              <div className="space-y-6">
                <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">1. Competing on Price Alone</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Racing to the bottom on price erodes margins and creates a race you can't win. Instead, focus on value differentiation, superior customer service, unique features, or brand positioning. Customers will pay premium prices for perceived value and quality.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">2. Ignoring Hidden Costs</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Many businesses fail to account for indirect costs like credit card processing fees, shipping, returns, warranty claims, customer support, and administrative overhead. These "hidden" costs can significantly impact net margins if not properly tracked and priced into your offerings.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">3. Not Tracking Margins by Product/Service</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Looking only at overall margins masks the truth: some products/services are highly profitable while others lose money. Track margins by individual SKU, service line, or product category to identify winners and losers. Discontinue or re-price unprofitable offerings.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">4. Underpricing New Products</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    It's much harder to raise prices later than to start high and offer strategic discounts. New products should be priced at perceived value, not just cost-plus. You can always discount or run promotions, but raising prices after launch often alienates early customers.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">5. Focusing Only on Gross Margin</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    A high gross margin is useless if operating expenses consume it all. Always analyze all three margins together. A business with 70% gross margin but 15% net margin has significant operating inefficiencies to address.
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-950 border-l-4 border-red-500 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">6. Not Reviewing Margins Regularly</h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Costs change, competition evolves, and customer preferences shift. Review profit margins monthly or quarterly. Set margin targets and create alerts when margins fall below thresholds. Regular reviews enable proactive adjustments before margins deteriorate significantly.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Margin vs Markup: Understanding the Difference</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Many business owners confuse <strong>margin</strong> and <strong>markup</strong>, but they are fundamentally different concepts:
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-3">Markup</h3>
                <p className="mb-2"><strong>Definition:</strong> Markup is the percentage added to the cost to determine the selling price.</p>
                <p className="mb-2"><strong>Formula:</strong> Markup % = ((Selling Price - Cost) / Cost) × 100</p>
                <p className="mb-4"><strong>Example:</strong> If an item costs $50 and you sell it for $75, the markup is ($75 - $50) / $50 = 50%</p>
              </div>

              <div className="bg-green-50 dark:bg-green-950 border-l-4 border-green-500 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-3">Margin</h3>
                <p className="mb-2"><strong>Definition:</strong> Margin is the percentage of the selling price that is profit.</p>
                <p className="mb-2"><strong>Formula:</strong> Margin % = ((Selling Price - Cost) / Selling Price) × 100</p>
                <p className="mb-4"><strong>Example:</strong> If an item costs $50 and you sell it for $75, the margin is ($75 - $50) / $75 = 33.3%</p>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                <strong>Key Difference:</strong> Markup is based on cost, while margin is based on selling price. A 50% markup equals a 33.3% margin. Understanding this difference is crucial for pricing strategy and profitability analysis.
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 border-b text-left">Cost</th>
                      <th className="px-4 py-3 border-b text-left">Selling Price</th>
                      <th className="px-4 py-3 border-b text-left">Markup %</th>
                      <th className="px-4 py-3 border-b text-left">Margin %</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-3">$50</td>
                      <td className="px-4 py-3">$75</td>
                      <td className="px-4 py-3 font-semibold">50%</td>
                      <td className="px-4 py-3 font-semibold">33.3%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">$50</td>
                      <td className="px-4 py-3">$100</td>
                      <td className="px-4 py-3 font-semibold">100%</td>
                      <td className="px-4 py-3 font-semibold">50%</td>
                    </tr>
                    <tr className="border-b">
                      <td className="px-4 py-3">$50</td>
                      <td className="px-4 py-3">$150</td>
                      <td className="px-4 py-3 font-semibold">200%</td>
                      <td className="px-4 py-3 font-semibold">66.7%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Using Margins for Business Decisions</h2>
              
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Product Profitability Analysis</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Calculate margins for each product or service to identify your most and least profitable offerings. Focus marketing and sales efforts on high-margin products. Consider discontinuing or re-pricing low-margin items unless they serve a strategic purpose (loss leaders, customer acquisition).
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Pricing Decisions</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Use margin analysis to set minimum acceptable prices and evaluate discount strategies. For example, if your net margin is 10%, a 20% discount eliminates all profit. Understand your margin structure before offering promotions or volume discounts.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Cost Control Priorities</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If gross margin is strong but net margin is weak, focus on reducing operating expenses. If gross margin is weak, prioritize reducing COGS or increasing prices. Margin breakdowns reveal exactly where to focus cost-cutting efforts for maximum impact.
              </p>

              <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">Growth vs Profitability Trade-offs</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Many businesses sacrifice margins for growth, especially startups. This can be strategic (market share grab, economies of scale), but set clear milestones for margin improvement. Understand when to prioritize growth and when to optimize for profitability based on business lifecycle and market conditions.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    What is a good profit margin?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    A "good" profit margin varies significantly by industry. Software companies might achieve 20%+ net margins, while grocery stores operate on 2-3% net margins. Compare your margins to industry benchmarks rather than absolute numbers. Generally, net margins above 10% are considered healthy for most businesses, 5-10% is average, and below 5% indicates potential profitability challenges.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    How often should I calculate profit margins?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Calculate and review profit margins monthly at minimum, weekly for fast-moving businesses. Real-time margin tracking through accounting software is ideal. Regular monitoring allows you to identify trends, respond to cost increases quickly, and make informed pricing decisions. Set up automated dashboards to track margins continuously without manual calculation.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    Why is my gross margin high but net margin low?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    This indicates high operating expenses relative to gross profit. Common causes include excessive overhead (rent, salaries, marketing), inefficient operations, or high interest/tax burdens. Focus on reducing operating expenses through automation, process improvement, or renegotiating contracts. Alternatively, increase revenue without proportionally increasing expenses to improve net margin.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    What's the difference between markup and margin?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Markup is the percentage added to cost to determine selling price (based on cost). Margin is the percentage of selling price that is profit (based on revenue). A 50% markup results in a 33.3% margin. For example, a $50 item sold for $75 has a 50% markup ($25/$50) but a 33.3% margin ($25/$75). Margin is generally more useful for financial analysis since it relates profit to sales revenue.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    Can profit margins be negative?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Yes, negative profit margins occur when expenses exceed revenue, resulting in a net loss. This is common for startups investing heavily in growth, seasonal businesses during off-seasons, or struggling companies. While temporarily acceptable in strategic situations (market entry, rapid expansion), sustained negative margins are unsustainable and require immediate corrective action through cost reduction or revenue growth.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    How do I improve low profit margins?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Four primary strategies: (1) Increase prices through value-based pricing and better positioning, (2) Reduce COGS through supplier negotiation and waste reduction, (3) Cut operating expenses via automation and efficiency improvements, (4) Increase volume to spread fixed costs across more units. Start with the easiest wins: often pricing adjustments and supplier renegotiation yield quick improvements. Then tackle operational efficiency for sustainable long-term margin growth.
                  </p>
                </details>

                <details className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <summary className="font-semibold text-lg cursor-pointer text-gray-900 dark:text-white">
                    Should I focus on increasing revenue or cutting costs?
                  </summary>
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    Both matter, but the right focus depends on your situation. If margins are healthy (10%+), focus on revenue growth for faster business expansion. If margins are thin (5% or less), prioritize cost reduction to ensure profitability before scaling. The ideal approach combines both: grow revenue while continuously optimizing costs. Many businesses find the fastest path to better margins is strategic price increases (3-5% annually) combined with targeted cost control in high-expense categories.
                  </p>
                </details>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfitMarginCalculator;
