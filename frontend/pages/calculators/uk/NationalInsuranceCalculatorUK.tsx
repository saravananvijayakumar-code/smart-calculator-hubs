import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, Info, TrendingUp, User, FileText } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { formatCurrency } from '../../../utils/formatting';
import ExportShareButtons from '../../../components/ExportShareButtons';

const NationalInsuranceCalculatorUK: React.FC = () => {
  const [salary, setSalary] = useState<string>('');
  const [payFrequency, setPayFrequency] = useState<string>('annual');
  const [employmentType, setEmploymentType] = useState<string>('employed');
  const [age, setAge] = useState<string>('');
  const [results, setResults] = useState<any>(null);

  const calculateNI = () => {
    const grossSalary = parseFloat(salary);
    const workerAge = parseInt(age) || 25;
    
    if (!grossSalary) return;

    // Convert to annual if needed
    let annualSalary = grossSalary;
    if (payFrequency === 'monthly') {
      annualSalary = grossSalary * 12;
    } else if (payFrequency === 'weekly') {
      annualSalary = grossSalary * 52;
    }

    // 2025/26 NI rates and thresholds
    const lowerEarningsLimit = 6396; // LEL (unchanged)
    const primaryThreshold = 12570; // PT - same as personal allowance (unchanged)
    const upperEarningsLimit = 50270; // UEL (unchanged)

    let employeeNI = 0;
    let employerNI = 0;

    if (employmentType === 'employed') {
      // Employee NI (Class 1)
      if (annualSalary > primaryThreshold) {
        const niableEarnings = Math.min(annualSalary - primaryThreshold, upperEarningsLimit - primaryThreshold);
        employeeNI = niableEarnings * 0.12; // 12% rate
        
        // Additional 2% on earnings above UEL
        if (annualSalary > upperEarningsLimit) {
          employeeNI += (annualSalary - upperEarningsLimit) * 0.02;
        }
      }

      // Employer NI (Class 1)
      if (annualSalary > primaryThreshold) {
        employerNI = (annualSalary - primaryThreshold) * 0.138; // 13.8% rate
      }

      // Age-related adjustments
      if (workerAge >= 66) {
        employeeNI = 0; // No employee NI for state pension age
      }
    } else {
      // Self-employed (Class 2 + Class 4)
      const class2Threshold = 6515;
      const class4LowerLimit = 12570;
      const class4UpperLimit = 50270;

      // Class 2 NI (flat rate)
      let class2NI = 0;
      if (annualSalary >= class2Threshold) {
        class2NI = 3.45 * 52; // £3.45 per week
      }

      // Class 4 NI (percentage of profits)
      let class4NI = 0;
      if (annualSalary > class4LowerLimit) {
        const class4Earnings = Math.min(annualSalary - class4LowerLimit, class4UpperLimit - class4LowerLimit);
        class4NI = class4Earnings * 0.09; // 9% rate
        
        // Additional 2% on profits above upper limit
        if (annualSalary > class4UpperLimit) {
          class4NI += (annualSalary - class4UpperLimit) * 0.02;
        }
      }

      employeeNI = class2NI + class4NI;
    }

    const netSalary = annualSalary - employeeNI;
    const totalEmployerCost = annualSalary + employerNI;
    const effectiveEmployeeRate = (employeeNI / annualSalary) * 100;
    const effectiveEmployerRate = (employerNI / annualSalary) * 100;

    // Calculate monthly/weekly equivalents
    const monthlyGross = annualSalary / 12;
    const monthlyNI = employeeNI / 12;
    const monthlyNet = netSalary / 12;

    setResults({
      annualSalary,
      employeeNI,
      employerNI,
      netSalary,
      totalEmployerCost,
      effectiveEmployeeRate,
      effectiveEmployerRate,
      monthlyGross,
      monthlyNI,
      monthlyNet
    });
  };

  const reset = () => {
    setSalary('');
    setPayFrequency('annual');
    setEmploymentType('employed');
    setAge('');
    setResults(null);
  };

  const tips = [
    "Class 1 NI: 12% on earnings between £12,570-£50,270, 2% above",
    "Class 2 NI: £3.45/week for self-employed earning over £6,515",
    "Class 4 NI: 9% on profits between £12,570-£50,270, 2% above",
    "No NI contributions payable after state pension age",
    "Building NI record is important for state pension entitlement"
  ];

  return (
    <CalculatorLayoutWithAds
      title="UK National Insurance Calculator 2025-26"
      description="Calculate National Insurance contributions for employees and self-employed individuals in the UK for 2025-26 tax year"
      keywords="UK National Insurance calculator 2025, NI contributions, Class 1 NI, Class 2 NI, Class 4 NI, 2025-26 tax year"
      tips={tips}
    >
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              National Insurance Calculator
            </CardTitle>
            <CardDescription>
              Calculate your National Insurance contributions for 2025-26
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary/Income (£)</Label>
              <Input
                id="salary"
                type="number"
                placeholder="Enter your salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payFrequency">Pay Frequency</Label>
              <Select value={payFrequency} onValueChange={setPayFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select value={employmentType} onValueChange={setEmploymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={calculateNI} className="flex-1">
                <Calculator className="mr-2 h-4 w-4" />
                Calculate
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
                National Insurance Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Annual Gross</p>
                  <p className="text-lg font-semibold">{formatCurrency(results.annualSalary, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employee NI</p>
                  <p className="text-lg font-semibold text-red-600">{formatCurrency(results.employeeNI, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Annual Net</p>
                  <p className="text-lg font-semibold text-green-600">{formatCurrency(results.netSalary, 'GBP')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Employer NI</p>
                  <p className="text-lg font-semibold text-orange-600">{formatCurrency(results.employerNI, 'GBP')}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h4 className="font-medium">Monthly Breakdown</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Gross</p>
                    <p className="font-medium">{formatCurrency(results.monthlyGross, 'GBP')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">NI</p>
                    <p className="font-medium">{formatCurrency(results.monthlyNI, 'GBP')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net</p>
                    <p className="font-medium">{formatCurrency(results.monthlyNet, 'GBP')}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Badge variant="outline">
                  Employee Rate: {results.effectiveEmployeeRate.toFixed(2)}%
                </Badge>
                {employmentType === 'employed' && (
                  <Badge variant="secondary">
                    Employer Rate: {results.effectiveEmployerRate.toFixed(2)}%
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Understanding UK National Insurance Contributions
          </CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <p>
            National Insurance (NI) represents a fundamental component of the UK's social security system, 
            funding crucial services including the NHS, state pensions, and unemployment benefits. Understanding 
            how National Insurance works is essential for all UK workers, whether employed or self-employed, 
            as these contributions directly impact both current take-home pay and future benefit entitlements.
          </p>

          <h3>The Structure of National Insurance</h3>
          <p>
            National Insurance operates through a class-based system, with different classes applying to various 
            employment situations. Class 1 contributions affect employed earners and their employers, representing 
            the most common form of NI. Class 2 and Class 4 contributions apply to self-employed individuals, 
            with different rates and thresholds reflecting the distinct nature of self-employment income and 
            benefit entitlements.
          </p>

          <h3>Class 1 Contributions: Employed Workers</h3>
          <p>
            For employed workers, National Insurance contributions begin once earnings exceed the Primary Threshold, 
            currently aligned with the personal income tax allowance at £12,570 annually. The standard rate of 12% 
            applies to earnings between the Primary Threshold and Upper Earnings Limit (£50,270), with a reduced 
            rate of 2% on earnings above this level. This progressive structure ensures higher earners contribute 
            proportionally more while maintaining work incentives.
          </p>

          <h3>Employer Contributions: The Hidden Cost</h3>
          <p>
            Employers pay National Insurance contributions at 13.8% on employee earnings above the Primary Threshold, 
            with no upper limit. These employer contributions represent a significant hidden cost of employment, 
            effectively increasing the true cost of each employee by substantial amounts. Understanding employer NI 
            helps explain why salary negotiations often involve complex calculations beyond basic pay figures.
          </p>

          <h3>Self-Employment: Class 2 and Class 4 Contributions</h3>
          <p>
            Self-employed individuals face a dual National Insurance structure through Class 2 and Class 4 contributions. 
            Class 2 provides a flat weekly rate for profits above £6,515 annually, securing basic benefit entitlements 
            including state pension credits. Class 4 operates as a percentage of profits above £12,570, currently at 9% 
            up to £50,270 and 2% thereafter, reflecting the additional business income flexibility self-employed 
            individuals enjoy.
          </p>

          <h3>Age-Related Considerations and State Pension</h3>
          <p>
            National Insurance contributions cease for employees reaching state pension age, currently 66 and gradually 
            rising. This creates immediate take-home pay increases for older workers, though employer contributions 
            continue regardless of employee age. The connection between NI contributions and state pension entitlement 
            makes understanding contribution history crucial for retirement planning and benefit maximization.
          </p>

          <h3>Benefit Entitlements and Contribution Records</h3>
          <p>
            National Insurance contributions directly determine eligibility for various state benefits, including 
            state pension, unemployment benefits, and statutory sick pay. A complete contribution record typically 
            requires 35 years of qualifying contributions for full state pension entitlement, though partial pensions 
            may be available with fewer years. Monitoring your NI record through government services ensures future 
            benefit security.
          </p>

          <h3>Recent Changes and Future Outlook</h3>
          <p>
            National Insurance rates have undergone significant changes in recent years, including temporary increases 
            to fund health and social care, subsequently reversed. The alignment of NI thresholds with income tax 
            personal allowances has simplified the tax system while providing targeted support for lower earners. 
            Understanding these changes helps predict future policy directions and their impact on personal finances.
          </p>

          <h3>Planning Strategies and Optimization</h3>
          <p>
            While National Insurance offers limited optimization opportunities compared to income tax, certain strategies 
            can minimize contributions legally. Salary sacrifice schemes can reduce NI liability for both employees and 
            employers, creating mutual benefits through reduced pension contributions, cycle-to-work schemes, or childcare 
            vouchers. Self-employed individuals might consider incorporation timing to optimize overall tax and NI efficiency.
          </p>

          <h3>International Considerations</h3>
          <p>
            For workers with international connections, National Insurance interactions with foreign social security 
            systems become important. EU citizens may retain certain rights under existing agreements, while workers 
            moving between countries need to understand how contribution records transfer and combine. These considerations 
            affect both current liability and future benefit entitlements across multiple jurisdictions.
          </p>

          <h3>Record Keeping and Administration</h3>
          <p>
            Maintaining accurate National Insurance records protects future benefit entitlements and helps resolve 
            any discrepancies. Employed workers typically have contributions handled automatically through PAYE, 
            while self-employed individuals must ensure accurate reporting and timely payment. Regular monitoring 
            through official channels helps identify and correct any gaps or errors that might affect future benefits.
          </p>
        </CardContent>
      </Card>

      {results && (
        <div className="mt-8">
          <ExportShareButtons
            calculatorType="national-insurance-uk"
            inputs={{
              salary,
              payFrequency,
              employmentType,
              age
            }}
            results={results}
            title="National Insurance Calculation"
          />
        </div>
      )}
    </CalculatorLayoutWithAds>
  );
};

export default NationalInsuranceCalculatorUK;