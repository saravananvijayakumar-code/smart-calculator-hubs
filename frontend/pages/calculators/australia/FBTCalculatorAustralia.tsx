// @ts-nocheck
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Car, Info, TrendingUp, DollarSign } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import type { AnalysisRequest } from '~backend/ai-analysis/types';

const FBTCalculatorAustralia: React.FC = () => {
  const [benefitType, setBenefitType] = useState<string>('');
  const [carValue, setCarValue] = useState<string>('');
  const [businessUse, setBusinessUse] = useState<string>('');
  const [employeeContribution, setEmployeeContribution] = useState<string>('');
  const [daysAvailable, setDaysAvailable] = useState<string>('365');
  const [annualSalary, setAnnualSalary] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateFBT = () => {
    const value = parseFloat(carValue);
    const business = parseFloat(businessUse) / 100;
    const contribution = parseFloat(employeeContribution) || 0;
    const days = parseFloat(daysAvailable);
    const salary = parseFloat(annualSalary) || 0;

    if (!value || business === undefined || !days) return;

    let fbtValue = 0;
    let fbtRate = 0.47; // Current FBT rate for 2024-25
    let statutoryRate = 0;

    if (benefitType === 'car') {
      // Statutory formula method
      statutoryRate = 0.20; // Base rate for post-2009 cars
      
      // Adjust rate based on business use percentage
      if (business < 0.25) statutoryRate = 0.20;
      else if (business < 0.50) statutoryRate = 0.15;
      else if (business < 0.75) statutoryRate = 0.10;
      else statutoryRate = 0.075;

      // Calculate annual FBT value
      const grossUp = 2.0802; // Type 1 fringe benefit gross-up rate
      const baseTaxableValue = value * statutoryRate * (days / 365);
      const netTaxableValue = Math.max(0, baseTaxableValue - contribution);
      fbtValue = netTaxableValue;
      
    } else if (benefitType === 'expense') {
      // Expense payment fringe benefit
      fbtValue = Math.max(0, value - contribution);
    } else if (benefitType === 'property') {
      // Property fringe benefit
      fbtValue = Math.max(0, value - contribution);
    }

    const grossedUpValue = fbtValue * 2.0802; // Gross up for Type 1 benefits
    const fbtLiability = grossedUpValue * fbtRate;
    const employeeIncomeTaxEquivalent = fbtValue;

    // Calculate total remuneration including FBT
    const totalEmployeeBenefit = fbtValue;
    const totalCostToEmployer = value + fbtLiability;
    const incomeTaxSavings = fbtValue * 0.325; // Approximate savings at average tax rate

    setResults({
      fbtValue,
      grossedUpValue,
      fbtLiability,
      statutoryRate: benefitType === 'car' ? statutoryRate * 100 : 0,
      grossUpRate: 2.0802,
      employeeIncomeTaxEquivalent,
      totalCostToEmployer,
      totalEmployeeBenefit,
      incomeTaxSavings,
      effectiveTaxRate: value > 0 ? (fbtLiability / value) * 100 : 0,
      netBenefitToEmployee: totalEmployeeBenefit - (totalEmployeeBenefit * 0.47),
      fbtYearStart: '1 April 2024',
      fbtYearEnd: '31 March 2025'
    });
  };

  const reset = () => {
    setBenefitType('');
    setCarValue('');
    setBusinessUse('');
    setEmployeeContribution('');
    setDaysAvailable('365');
    setAnnualSalary('');
    setResults(null);
  };

  const tips = [
    "FBT rate is 47% for FY 2024-25 on grossed-up taxable value",
    "Car fringe benefits use statutory formula or operating cost method",
    "Employee contributions reduce the taxable value of benefits",
    "Some benefits like work-related items may be FBT-exempt",
    "Salary packaging can provide tax advantages when structured correctly"
  ];

  return (
    <CalculatorLayoutWithAds
      title="Australia Fringe Benefits Tax Calculator | FBT Calculator 2024-25"
      description="Comprehensive Australian Fringe Benefits Tax calculator for car benefits, expense payments, and salary packaging. Calculate FBT liability, gross-up amounts, and total employment costs."
      keywords="Australia FBT calculator, fringe benefits tax, car fringe benefit, salary packaging, FBT rate 2024, employee benefits tax, novated lease FBT"
      tips={tips}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                FBT Calculator
              </CardTitle>
              <CardDescription>
                Calculate fringe benefits tax liability for various employee benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="benefitType">Benefit Type</Label>
                <Select value={benefitType} onValueChange={setBenefitType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select benefit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="car">Car Fringe Benefit</SelectItem>
                    <SelectItem value="expense">Expense Payment Benefit</SelectItem>
                    <SelectItem value="property">Property Fringe Benefit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carValue">
                  {benefitType === 'car' ? 'Car Value ($)' : 
                   benefitType === 'expense' ? 'Expense Amount ($)' : 
                   'Benefit Value ($)'}
                </Label>
                <Input
                  id="carValue"
                  type="number"
                  placeholder="Enter benefit value"
                  value={carValue}
                  onChange={(e) => setCarValue(e.target.value)}
                />
              </div>

              {benefitType === 'car' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessUse">Business Use (%)</Label>
                    <Input
                      id="businessUse"
                      type="number"
                      placeholder="Percentage business use"
                      value={businessUse}
                      onChange={(e) => setBusinessUse(e.target.value)}
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="daysAvailable">Days Available per Year</Label>
                    <Input
                      id="daysAvailable"
                      type="number"
                      placeholder="Days car available"
                      value={daysAvailable}
                      onChange={(e) => setDaysAvailable(e.target.value)}
                      max="365"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="employeeContribution">Employee Contribution ($)</Label>
                <Input
                  id="employeeContribution"
                  type="number"
                  placeholder="Employee's contribution"
                  value={employeeContribution}
                  onChange={(e) => setEmployeeContribution(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="annualSalary">Annual Salary ($ - Optional)</Label>
                <Input
                  id="annualSalary"
                  type="number"
                  placeholder="For context analysis"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={calculateFBT} className="flex-1">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate FBT
                </Button>
                <Button onClick={reset} variant="outline">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  FBT Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Taxable Value</p>
                    <p className="text-lg font-semibold">{formatCurrency(results.fbtValue, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Grossed-Up Value</p>
                    <p className="text-lg font-semibold text-blue-600">{formatCurrency(results.grossedUpValue, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">FBT Liability</p>
                    <p className="text-lg font-semibold text-red-600">{formatCurrency(results.fbtLiability, 'AUD')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost to Employer</p>
                    <p className="text-lg font-semibold text-orange-600">{formatCurrency(results.totalCostToEmployer, 'AUD')}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">FBT Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">FBT Rate</p>
                      <Badge variant="outline">47%</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Gross-up Rate</p>
                      <Badge variant="secondary">2.0802</Badge>
                    </div>
                    {results.statutoryRate > 0 && (
                      <div>
                        <p className="text-muted-foreground">Statutory Rate</p>
                        <Badge variant="outline">{results.statutoryRate.toFixed(1)}%</Badge>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Effective Tax Rate</p>
                      <Badge variant="destructive">{results.effectiveTaxRate.toFixed(1)}%</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium">FBT Year: {results.fbtYearStart} to {results.fbtYearEnd}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {results && (
          <>
            <AIAnalysis
              analysisRequest={{
                calculatorType: "fbt-calculator-australia",
                data: {
                  benefitValue: parseFloat(carValue) || 0,
                  fbtRate: 0.47,
                  fbtLiability: results.fbtLiability,
                  grossUpValue: results.grossedUpValue,
                  effectiveRate: results.effectiveTaxRate
                }
              }}
              autoRun={true}
              title="AI FBT Analysis & Optimization"
              description="Get personalized strategies to optimize your fringe benefits tax position and employee remuneration packages."
            />

            <ExportShareButtons
              calculatorType="fbt-calculator-australia"
              inputs={{
                carValue: parseFloat(carValue) || 0,
                businessUse: parseFloat(businessUse) || 0,
                daysAvailable: parseFloat(daysAvailable) || 365
              }}
              results={{
                fbtLiability: results.fbtLiability,
                grossedUpValue: results.grossedUpValue,
                effectiveTaxRate: results.effectiveTaxRate,
                employerCost: results.employerCost
              }}
              title="FBT Calculator Australia Report"
              className="mt-6"
            />
          </>
        )}

        {/* Educational Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Complete Guide to Australian Fringe Benefits Tax (FBT)</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <div className="text-sm text-gray-600 space-y-6">
                <p>
                  Fringe Benefits Tax (FBT) is a crucial component of Australia's tax system that affects millions of employees and employers 
                  across the country. Unlike income tax, FBT is paid by employers on certain benefits provided to employees in addition to 
                  their salary or wages. Understanding FBT is essential for businesses designing competitive remuneration packages and 
                  employees evaluating the true value of their total compensation package, including popular arrangements like novated leases 
                  and salary packaging.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">What is Fringe Benefits Tax?</h3>
                <p>
                  FBT is a tax imposed on employers who provide fringe benefits to their employees or their employees' family members. 
                  The tax operates on a different financial year (1 April to 31 March) compared to income tax and is charged at a flat 
                  rate of 47% on the grossed-up taxable value of benefits. This rate includes the Medicare levy and is designed to ensure 
                  that providing benefits in lieu of salary doesn't result in tax advantages that would undermine the income tax system.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Types of Fringe Benefits</h3>
                <p>
                  Fringe benefits encompass a wide range of non-cash benefits including company cars, car parking, expense reimbursements, 
                  low-interest loans, entertainment, property benefits, and residual benefits. The most common fringe benefit in Australia 
                  is the car fringe benefit, which includes company-provided vehicles available for private use. Other significant benefits 
                  include expense payment fringe benefits (where employers pay for employee expenses) and property fringe benefits 
                  (such as providing accommodation or goods).
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Car Fringe Benefits: The Statutory Formula Method</h3>
                <p>
                  Car fringe benefits are calculated using either the statutory formula method or the operating cost method. The statutory 
                  formula method is more common and simpler to administer, calculating the taxable value based on the car's base value 
                  and a statutory percentage that varies with business use. For cars purchased after 10 May 2011, the rates are: 20% 
                  for less than 25% business use, 15% for 25-49% business use, 10% for 50-74% business use, and 7.5% for 75% or more 
                  business use.
                </p>

                <div className="bg-blue-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">Car Fringe Benefit Example:</h4>
                  <ul className="space-y-1">
                    <li>• Car Value: $45,000</li>
                    <li>• Business Use: 60% (statutory rate 10%)</li>
                    <li>• Days Available: 365</li>
                    <li>• Employee Contribution: $2,000</li>
                    <li>• Taxable Value: $45,000 × 10% - $2,000 = $2,500</li>
                    <li>• Grossed-up Value: $2,500 × 2.0802 = $5,201</li>
                    <li>• FBT Liability: $5,201 × 47% = $2,444</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Gross-up Rates and Tax Calculation</h3>
                <p>
                  FBT uses a gross-up mechanism to account for the income tax that would have been paid if cash salary was provided 
                  instead of the benefit. Type 1 fringe benefits (where the employer can claim GST credits) use a gross-up rate of 
                  2.0802, while Type 2 benefits use 1.8868. This ensures the FBT liability represents the true economic cost of 
                  providing the benefit rather than just the benefit's face value.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Employee Contributions and Salary Packaging</h3>
                <p>
                  Employee contributions can significantly reduce FBT liability by reducing the taxable value of benefits. These 
                  contributions can be made through post-tax dollars or, more commonly, through salary sacrifice arrangements. 
                  Salary packaging allows employees to redirect part of their gross salary toward fringe benefits, potentially 
                  providing tax advantages. Popular salary packaging items include motor vehicles through novated leases, 
                  superannuation contributions, and expense payment benefits for work-related items.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mt-6 mb-4">Novated Leases and Motor Vehicle Benefits</h3>
                <p>
                  Novated leases represent one of the most popular salary packaging arrangements in Australia. Under a novated lease, 
                  an employee leases a vehicle through their employer, with lease payments deducted from pre-tax salary. This arrangement 
                  can provide tax benefits through reduced taxable income, though FBT still applies to the benefit. The total tax outcome 
                  depends on the employee's marginal tax rate, the FBT liability, and the specific terms of the arrangement.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>FBT Compliance and Strategic Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4">FBT Registration and Lodgment Requirements</h3>
                <p>
                  Employers must register for FBT if they provide fringe benefits and their notional taxable value exceeds $300 in an FBT year. 
                  FBT returns must be lodged by 21 May following the end of the FBT year (or later if using a tax agent). The FBT liability 
                  is payable in quarterly installments for larger employers or annually for smaller employers. Proper registration and 
                  compliance are essential to avoid penalties and interest charges.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Record Keeping Requirements</h3>
                <p>
                  FBT compliance requires meticulous record keeping, particularly for car benefits where business use must be substantiated. 
                  Employers must maintain logbooks for car benefits, receipts for expense payments, and documentation supporting benefit 
                  valuations. Records must be kept for five years after the relevant FBT return is lodged. Electronic record keeping is 
                  acceptable and often more practical for ongoing compliance.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">FBT Exemptions and Concessions</h3>
                <p>
                  Several benefits are exempt from FBT or qualify for reduced rates. Work-related items such as laptops, mobile phones, 
                  and protective clothing may be exempt if they're primarily for work use. Car parking benefits under $8.77 per day (2024 rates) 
                  are exempt. Public hospitals and charitable institutions may qualify for FBT concessions, significantly reducing their 
                  FBT liability on certain benefits.
                </p>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Common FBT-Exempt Benefits:</h4>
                  <ul className="space-y-1">
                    <li>• Work-related items (computers, mobile phones, tools)</li>
                    <li>• Minor benefits under $300 (occasional gifts, functions)</li>
                    <li>• Car parking under the daily threshold</li>
                    <li>• Taxi travel for work purposes</li>
                    <li>• Protective clothing and uniforms</li>
                    <li>• Training and education directly related to work</li>
                    <li>• Relocation benefits in certain circumstances</li>
                  </ul>
                </div>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Strategic FBT Planning</h3>
                <p>
                  Effective FBT planning involves structuring remuneration packages to minimize total tax costs while maximizing employee 
                  benefits. This might include timing benefit provision to optimize FBT years, maximizing exempt benefits, structuring 
                  employee contributions effectively, and considering alternative remuneration structures. Professional advice is often 
                  valuable given the complexity of FBT rules and their interaction with income tax provisions.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">FBT and Superannuation</h3>
                <p>
                  Superannuation contributions made by employers generally don't attract FBT, making them a tax-effective form of remuneration. 
                  However, contributions above the concessional cap may trigger additional tax obligations. Salary sacrifice superannuation 
                  arrangements allow employees to boost their retirement savings while potentially reducing their overall tax burden.
                </p>

                <h3 className="font-semibold text-gray-800 text-lg mb-4">Impact on Employees</h3>
                <p>
                  While FBT is paid by employers, it affects employees through the total cost of their employment package. High FBT costs 
                  may limit an employer's ability to provide certain benefits or increase base salaries. Employees should understand how 
                  FBT affects their total remuneration package value and consider whether salary packaging arrangements provide genuine 
                  after-tax benefits.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What is the current FBT rate for 2024-25?</h4>
                    <p>The FBT rate for 2024-25 is 47%, which includes the Medicare levy. This rate applies to the grossed-up taxable value of fringe benefits after employee contributions are deducted.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How do I know if my benefit is Type 1 or Type 2?</h4>
                    <p>Type 1 benefits are those where the employer can claim GST credits (like car benefits and most expense payments). Type 2 benefits are those where GST credits aren't available (like loan benefits). Type 1 benefits use a gross-up rate of 2.0802, while Type 2 use 1.8868.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Can I reduce FBT by making employee contributions?</h4>
                    <p>Yes, employee contributions directly reduce the taxable value of fringe benefits. These can be made through post-tax cash payments or salary sacrifice arrangements. The contribution amount is deducted from the benefit value before calculating FBT.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">What records do I need to keep for car benefits?</h4>
                    <p>For car benefits, maintain a logbook showing business vs private use, records of all expenses if using the operating cost method, and documentation of employee contributions. Records must be kept for five years after lodging the relevant FBT return.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Are all company cars subject to FBT?</h4>
                    <p>FBT only applies to cars available for private use by employees. Work-only vehicles (like utility trucks restricted to business use) generally don't attract FBT. The key test is whether the vehicle is available for private use, not whether it's actually used privately.</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">How does FBT interact with salary sacrifice arrangements?</h4>
                    <p>Salary sacrifice can provide tax benefits by reducing taxable income, but FBT still applies to the benefits provided. The total tax outcome depends on the employee's marginal tax rate versus the effective FBT cost. Professional advice is recommended for complex arrangements.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="h-5 w-5" />
              <span>Important Information & Disclaimer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-muted-foreground space-y-2">
              <p>• This calculator provides estimates only and should not be relied upon for final FBT compliance decisions.</p>
              <p>• FBT laws are complex and subject to change - current rates apply to FBT year 1 April 2024 to 31 March 2025.</p>
              <p>• Individual circumstances may significantly affect FBT calculations and eligibility for exemptions.</p>
              <p>• Car benefit calculations use simplified statutory formula - operating cost method may provide different results.</p>
              <p>• Actual FBT liability depends on proper record keeping and compliance with ATO requirements.</p>
              <p>• This calculator doesn't cover all benefit types or exemptions available under FBT legislation.</p>
              <p>• Professional tax and legal advice is recommended for significant FBT arrangements or compliance issues.</p>
              <p>• The Australian Taxation Office is the authoritative source for current FBT law and interpretations.</p>
              <p>• Results are estimates only and actual FBT outcomes may vary significantly from calculations shown.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default FBTCalculatorAustralia;