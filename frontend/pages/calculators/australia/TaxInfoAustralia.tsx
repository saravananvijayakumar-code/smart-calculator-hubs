import { Card } from '@/components/ui/card';
import { SEOHead } from '@/components/SEOHead';
import { Info, ExternalLink, BookOpen, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TaxInfoAustralia() {
  return (
    <>
      <SEOHead
        title="Australian Tax System Guide | ATO Rules & References"
        description="Comprehensive guide to the Australian tax system with official ATO references, Stage 3 tax cuts, PAYG withholding, Medicare levy, and HELP repayments."
        keywords="Australian tax system, ATO guide, tax rules Australia, PAYG withholding, Stage 3 tax cuts, Medicare levy"
      />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Australian Tax System Guide</h1>
          <p className="text-muted-foreground">
            Official ATO rules, references, and explanations for the Australian tax system
          </p>
        </div>

        <div className="space-y-8">
          <Card className="p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold mb-2">Important Disclaimer</h2>
                <p className="text-sm text-muted-foreground">
                  This guide provides general information about the Australian tax system based on ATO legislation and regulations. 
                  It is not professional tax advice. Always consult a registered tax agent or the ATO directly for advice specific to your circumstances.
                </p>
              </div>
            </div>
          </Card>

          <div className="prose prose-sm max-w-none dark:prose-invert">
            <h2>Quick Navigation</h2>
            <div className="grid md:grid-cols-2 gap-4 not-prose mb-8">
              <Link to="/au/pay-calculator" className="block">
                <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Pay Calculator</h3>
                      <p className="text-sm text-muted-foreground">Calculate take-home pay</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to="/au/bonus-tax" className="block">
                <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Bonus Tax</h3>
                      <p className="text-sm text-muted-foreground">Schedule 5 withholding</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to="/au/unused-leave" className="block">
                <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Unused Leave</h3>
                      <p className="text-sm text-muted-foreground">Termination payments</p>
                    </div>
                  </div>
                </Card>
              </Link>
              <Link to="/au/student-loan" className="block">
                <Card className="p-4 hover:shadow-lg transition-all hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">HELP Loan</h3>
                      <p className="text-sm text-muted-foreground">Payoff projection</p>
                    </div>
                  </div>
                </Card>
              </Link>
            </div>

            <h2>Table of Contents</h2>
            <ul>
              <li><a href="#stage3">Stage 3 Tax Cuts (2024-25)</a></li>
              <li><a href="#residency">Residency Status & Tax Rates</a></li>
              <li><a href="#payg">PAYG Withholding</a></li>
              <li><a href="#lito">Low Income Tax Offset (LITO)</a></li>
              <li><a href="#medicare">Medicare Levy & Surcharge</a></li>
              <li><a href="#help">HELP/HECS Repayments</a></li>
              <li><a href="#super">Superannuation Guarantee</a></li>
              <li><a href="#important-dates">Important Tax Dates</a></li>
              <li><a href="#resources">Official Resources</a></li>
            </ul>

            <h2 id="stage3">Stage 3 Tax Cuts (Effective 1 July 2024)</h2>
            <p>
              The Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024 introduced revised tax brackets from 1 July 2024:
            </p>
            <table>
              <thead>
                <tr>
                  <th>Taxable Income</th>
                  <th>Tax Rate</th>
                  <th>Tax on Income</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$0 – $18,200</td>
                  <td>0%</td>
                  <td>Nil</td>
                </tr>
                <tr>
                  <td>$18,201 – $45,000</td>
                  <td>16%</td>
                  <td>16c for each $1 over $18,200</td>
                </tr>
                <tr>
                  <td>$45,001 – $135,000</td>
                  <td>30%</td>
                  <td>$4,288 + 30c for each $1 over $45,000</td>
                </tr>
                <tr>
                  <td>$135,001 – $190,000</td>
                  <td>37%</td>
                  <td>$31,288 + 37c for each $1 over $135,000</td>
                </tr>
                <tr>
                  <td>$190,001+</td>
                  <td>45%</td>
                  <td>$51,638 + 45c for each $1 over $190,000</td>
                </tr>
              </tbody>
            </table>

            <p><strong>Key Changes:</strong></p>
            <ul>
              <li>19% rate reduced to 16% ($18,201–$45,000)</li>
              <li>32.5% rate reduced to 30% with expanded threshold ($45,001–$135,000, previously $45,001–$120,000)</li>
              <li>37% threshold increased from $120,000 to $135,000</li>
            </ul>

            <p>
              <strong>Reference:</strong> <a href="https://www.legislation.gov.au/C2024A00003/latest/text" target="_blank" rel="noopener">
                Treasury Laws Amendment (Cost of Living Tax Cuts) Act 2024 <ExternalLink className="inline w-3 h-3" />
              </a>
            </p>

            <h2 id="residency">Residency Status & Tax Rates</h2>

            <h3>Australian Residents for Tax Purposes</h3>
            <p>
              You're generally an Australian resident for tax purposes if you:
            </p>
            <ul>
              <li>Reside in Australia (the "resides test")</li>
              <li>Have your domicile in Australia unless the Commissioner is satisfied your permanent place of abode is outside Australia</li>
              <li>Have been in Australia for more than half the income year (183 days), unless you can establish your usual place of abode is outside Australia</li>
              <li>Are a member of certain Commonwealth superannuation schemes</li>
            </ul>

            <p><strong>Benefits:</strong></p>
            <ul>
              <li>Access to the tax-free threshold ($18,200)</li>
              <li>Eligible for Low Income Tax Offset (LITO)</li>
              <li>Lower tax rates on Australian-sourced income</li>
            </ul>

            <h3>Non-Residents</h3>
            <p>Non-residents pay tax on Australian-sourced income only, with no tax-free threshold:</p>
            <table>
              <thead>
                <tr>
                  <th>Taxable Income</th>
                  <th>Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$0 – $135,000</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td>$135,001 – $190,000</td>
                  <td>37%</td>
                </tr>
                <tr>
                  <td>$190,001+</td>
                  <td>45%</td>
                </tr>
              </tbody>
            </table>

            <h3>Working Holiday Makers (WHM)</h3>
            <p>Special rates apply to visa holders under subclasses 417 and 462:</p>
            <table>
              <thead>
                <tr>
                  <th>Taxable Income</th>
                  <th>Tax Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$0 – $45,000</td>
                  <td>15%</td>
                </tr>
                <tr>
                  <td>$45,001 – $135,000</td>
                  <td>30%</td>
                </tr>
                <tr>
                  <td>$135,001 – $190,000</td>
                  <td>37%</td>
                </tr>
                <tr>
                  <td>$190,001+</td>
                  <td>45%</td>
                </tr>
              </tbody>
            </table>

            <p>
              <strong>Reference:</strong> <a href="https://www.ato.gov.au/rates-and-codes/tax-rates-australian-residents" target="_blank" rel="noopener">
                ATO Tax Rates <ExternalLink className="inline w-3 h-3" />
              </a>
            </p>

            <h2 id="payg">PAYG Withholding</h2>
            <p>
              Pay As You Go (PAYG) withholding is the system where employers deduct tax from employee wages before payment. 
              The ATO publishes detailed formulas in <strong>Schedule 1</strong> (Statement of Formulas) within the NAT 1004 tax tables.
            </p>

            <h3>Key Concepts</h3>
            <ul>
              <li><strong>Scale 2:</strong> For employees claiming the tax-free threshold (typically your primary job)</li>
              <li><strong>Scale 6:</strong> For employees not claiming the tax-free threshold (second jobs, some non-residents)</li>
              <li><strong>HELP/TSL adjustment:</strong> Additional withholding for those with student loans</li>
              <li><strong>Medicare levy exemption:</strong> Certain visa holders may be exempt</li>
            </ul>

            <h3>Withholding Formula Structure</h3>
            <p>For each pay period and scale, the ATO provides coefficients <em>a</em> and <em>b</em> for income bands:</p>
            <p className="bg-muted p-3 rounded font-mono text-sm">
              Tax Withheld = (a × gross earnings) - b
            </p>
            <p>
              These coefficients ensure withholding approximates your annual tax liability, adjusted for pay frequency.
            </p>

            <p>
              <strong>References:</strong>
            </p>
            <ul>
              <li><a href="https://www.ato.gov.au/businesses-and-organisations/hiring-and-paying-your-workers/paying-your-workers/withholding-from-payments-to-employees/payg-withholding" target="_blank" rel="noopener">
                ATO PAYG Withholding Guide <ExternalLink className="inline w-3 h-3" />
              </a></li>
              <li><a href="https://www.ato.gov.au/rates-and-codes/tax-tables" target="_blank" rel="noopener">
                ATO Tax Tables (NAT 1004) <ExternalLink className="inline w-3 h-3" />
              </a></li>
            </ul>

            <h2 id="lito">Low Income Tax Offset (LITO)</h2>
            <p>
              LITO is a tax offset (rebate) that reduces the tax payable by low- to middle-income earners. It's automatically applied when you lodge your tax return.
            </p>

            <h3>LITO Amounts</h3>
            <table>
              <thead>
                <tr>
                  <th>Taxable Income</th>
                  <th>LITO Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>$0 – $37,500</td>
                  <td>$700</td>
                </tr>
                <tr>
                  <td>$37,501 – $45,000</td>
                  <td>$700 - 5% of excess over $37,500</td>
                </tr>
                <tr>
                  <td>$45,001 – $66,667</td>
                  <td>Remaining offset - 1.5% of excess over $45,000</td>
                </tr>
                <tr>
                  <td>$66,668+</td>
                  <td>$0</td>
                </tr>
              </tbody>
            </table>

            <p>
              <strong>Reference:</strong> <a href="https://www.ato.gov.au/tax-rates-and-codes/tax-offset-rates" target="_blank" rel="noopener">
                ATO Tax Offset Rates <ExternalLink className="inline w-3 h-3" />
              </a>
            </p>

            <h2 id="medicare">Medicare Levy & Surcharge</h2>

            <h3>Medicare Levy (2%)</h3>
            <p>
              Most Australian residents pay a 2% Medicare levy on taxable income to help fund Medicare. Low-income earners may qualify for a reduction or exemption.
            </p>

            <h4>Reduction Thresholds (2024-25)</h4>
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Full Exemption Below</th>
                  <th>Full Levy Above</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Single</td>
                  <td>$23,226</td>
                  <td>$26,000</td>
                </tr>
                <tr>
                  <td>Family (no children)</td>
                  <td>$39,167</td>
                  <td>$43,846</td>
                </tr>
                <tr>
                  <td>Single senior</td>
                  <td>$36,676</td>
                  <td>$41,089</td>
                </tr>
                <tr>
                  <td>Senior couple</td>
                  <td>$51,094</td>
                  <td>$57,198</td>
                </tr>
              </tbody>
            </table>
            <p><em>Family thresholds increase by $4,027 per dependent child.</em></p>

            <p>
              <strong>Reference:</strong> <a href="https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy" target="_blank" rel="noopener">
                ATO Medicare Levy <ExternalLink className="inline w-3 h-3" />
              </a>
            </p>

            <h3>Medicare Levy Surcharge (MLS)</h3>
            <p>
              Higher-income earners without appropriate private hospital cover may pay an additional 1.0–1.5% surcharge.
            </p>

            <h4>MLS Tiers (2024-25)</h4>
            <table>
              <thead>
                <tr>
                  <th>Income (Single)</th>
                  <th>Income (Family)</th>
                  <th>MLS Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>≤ $97,000</td>
                  <td>≤ $194,000</td>
                  <td>0%</td>
                </tr>
                <tr>
                  <td>$97,001 – $113,000</td>
                  <td>$194,001 – $226,000</td>
                  <td>1.0%</td>
                </tr>
                <tr>
                  <td>$113,001 – $151,000</td>
                  <td>$226,001 – $302,000</td>
                  <td>1.25%</td>
                </tr>
                <tr>
                  <td>$151,001+</td>
                  <td>$302,001+</td>
                  <td>1.5%</td>
                </tr>
              </tbody>
            </table>
            <p><em>Family thresholds increase by $1,500 per dependent child after the first.</em></p>

            <p>
              <strong>Reference:</strong> <a href="https://www.ato.gov.au/individuals-and-families/medicare-and-private-health-insurance/medicare-levy-surcharge" target="_blank" rel="noopener">
                ATO Medicare Levy Surcharge <ExternalLink className="inline w-3 h-3" />
              </a>
            </p>

            <h2 id="help">HELP/HECS Repayments</h2>
            <p>
              Higher Education Loan Program (HELP) repayments are compulsory once your repayment income exceeds the minimum threshold.
            </p>

            <h3>Repayment Thresholds (2024-25)</h3>
            <table>
              <thead>
                <tr>
                  <th>Repayment Income</th>
                  <th>Repayment Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Below $54,435</td>
                  <td>Nil</td>
                </tr>
                <tr>
                  <td>$54,435 – $62,850</td>
                  <td>1.0%</td>
                </tr>
                <tr>
                  <td>$62,851 – $66,620</td>
                  <td>2.0%</td>
                </tr>
                <tr>
                  <td>$66,621 – $70,618</td>
                  <td>2.5%</td>
                </tr>
                <tr>
                  <td>$70,619 – $74,855</td>
                  <td>3.0%</td>
                </tr>
                <tr>
                  <td>...</td>
                  <td>...</td>
                </tr>
                <tr>
                  <td>$159,664+</td>
                  <td>10.0%</td>
                </tr>
              </tbody>
            </table>

            <h3>Changes from 2025-26</h3>
            <p>
              The government announced a shift to a <strong>marginal repayment method</strong> from 2025-26, where repayments are calculated progressively within each income band rather than applying a single rate to total income. This eliminates the "cliff effect" where crossing a threshold sharply increases repayments.
            </p>

            <h3>Indexation</h3>
            <p>
              HELP debts are indexed annually on 1 June to maintain real value, using the Consumer Price Index (CPI) for the 12 months to the previous March. Recent indexation rates:
            </p>
            <ul>
              <li><strong>2024:</strong> 4.8% (later adjusted to 3.2% retroactively)</li>
              <li><strong>2023:</strong> 7.1% (highest on record, subsequently reduced)</li>
              <li><strong>Historical average:</strong> 2–3%</li>
            </ul>

            <p>
              <strong>References:</strong>
            </p>
            <ul>
              <li><a href="https://www.ato.gov.au/individuals-and-families/education-and-training/help-hecs-and-other-study-loans/help-repayment" target="_blank" rel="noopener">
                ATO HELP Repayment <ExternalLink className="inline w-3 h-3" />
              </a></li>
              <li><a href="https://www.studyassist.gov.au/" target="_blank" rel="noopener">
                StudyAssist (Department of Education) <ExternalLink className="inline w-3 h-3" />
              </a></li>
            </ul>

            <h2 id="super">Superannuation Guarantee</h2>
            <p>
              Employers must contribute a minimum percentage of ordinary time earnings to employees' superannuation funds under the Superannuation Guarantee (SG).
            </p>

            <h3>SG Rates</h3>
            <table>
              <thead>
                <tr>
                  <th>Financial Year</th>
                  <th>SG Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-25</td>
                  <td>11.5%</td>
                </tr>
                <tr>
                  <td>2025-26 onwards</td>
                  <td>12.0%</td>
                </tr>
              </tbody>
            </table>

            <p>
              The rate will remain at 12% indefinitely under current legislation.
            </p>

            <p>
              <strong>Reference:</strong> <a href="https://www.ato.gov.au/businesses-and-organisations/super-for-employers/paying-super-contributions/super-guarantee-contribution-rates" target="_blank" rel="noopener">
                ATO Super Guarantee Rates <ExternalLink className="inline w-3 h-3" />
              </a>
            </p>

            <h2 id="important-dates">Important Tax Dates</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1 July</td>
                  <td>Start of financial year; new tax rates effective; HELP indexation applied</td>
                </tr>
                <tr>
                  <td>31 July</td>
                  <td>Tax return lodgment deadline (if lodging yourself without tax agent)</td>
                </tr>
                <tr>
                  <td>31 October</td>
                  <td>Deadline for PAYG payment summaries to be issued by employers</td>
                </tr>
                <tr>
                  <td>Quarterly</td>
                  <td>BAS/IAS lodgment for businesses (dates vary by reporting cycle)</td>
                </tr>
                <tr>
                  <td>28th of month</td>
                  <td>Quarterly super guarantee payment deadline (after end of quarter)</td>
                </tr>
                <tr>
                  <td>30 June</td>
                  <td>End of financial year</td>
                </tr>
              </tbody>
            </table>

            <p>
              <strong>Note:</strong> Lodgment dates may differ if using a registered tax agent.
            </p>

            <h2 id="resources">Official Resources</h2>
            <div className="not-prose space-y-4">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Australian Taxation Office (ATO)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Primary source for all tax information, rates, and lodgment services.
                    </p>
                    <a 
                      href="https://www.ato.gov.au/" 
                      target="_blank" 
                      rel="noopener"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Visit ATO Website <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">myGov</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Access ATO services, lodge tax returns, view HELP balance, and manage payments.
                    </p>
                    <a 
                      href="https://my.gov.au/" 
                      target="_blank" 
                      rel="noopener"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Visit myGov <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Federal Register of Legislation</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Official repository of Australian legislation, including tax acts and amendments.
                    </p>
                    <a 
                      href="https://www.legislation.gov.au/" 
                      target="_blank" 
                      rel="noopener"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Visit Legislation Portal <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">Department of Treasury</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Budget papers, economic forecasts, and policy documents.
                    </p>
                    <a 
                      href="https://treasury.gov.au/" 
                      target="_blank" 
                      rel="noopener"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Visit Treasury <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-6 h-6 text-primary flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">StudyAssist</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Information on HELP, HECS, and other student loans.
                    </p>
                    <a 
                      href="https://www.studyassist.gov.au/" 
                      target="_blank" 
                      rel="noopener"
                      className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Visit StudyAssist <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </Card>
            </div>

            <h2>Getting Help</h2>
            <p>
              If you need personalized tax advice:
            </p>
            <ul>
              <li><strong>Registered Tax Agents:</strong> Find one via the <a href="https://www.tpb.gov.au/registrations_search" target="_blank" rel="noopener">Tax Practitioners Board <ExternalLink className="inline w-3 h-3" /></a></li>
              <li><strong>ATO Phone Line:</strong> 13 28 61 (individuals), 13 28 66 (businesses)</li>
              <li><strong>ATO Community:</strong> Online forum for general tax questions</li>
              <li><strong>Free Tax Help:</strong> Volunteer service for simple returns (income under $60,000)</li>
            </ul>

            <h2>Updates & Changes</h2>
            <p>
              Tax law changes frequently. Key sources for updates:
            </p>
            <ul>
              <li><strong>Federal Budget (May):</strong> Announces policy changes for next financial year</li>
              <li><strong>ATO website:</strong> Publishes updated rates and thresholds</li>
              <li><strong>Legislation tracker:</strong> Monitor bills at <a href="https://www.aph.gov.au/" target="_blank" rel="noopener">Parliament of Australia <ExternalLink className="inline w-3 h-3" /></a></li>
            </ul>

            <p>
              Always verify information against current ATO publications before making tax decisions.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}