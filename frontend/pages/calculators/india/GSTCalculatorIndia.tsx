import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calculator, DollarSign, Info, TrendingUp, Building2, FileText } from 'lucide-react';
import { CalculatorLayoutWithAds } from '../../../components/CalculatorLayoutWithAds';
import { AIAnalysis } from '../../../components/AIAnalysis';
import ExportShareButtons from '../../../components/ExportShareButtons';
import { AutoAdSlot } from '../../../components/ads/AutoAdSlot';
import { formatCurrency } from '../../../utils/formatting';

interface GSTResult {
  transactionType: string;
  baseAmount: number;
  gstRate: number;
  gstAmount: number;
  cgst?: number;
  sgst?: number;
  igst?: number;
  totalAmount: number;
}

const GSTCalculatorIndia: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [calculationType, setCalculationType] = useState<string>('exclusive');
  const [transactionType, setTransactionType] = useState<string>('intrastate');
  const [gstRate, setGstRate] = useState<string>('18');
  const [result, setResult] = useState<GSTResult | null>(null);

  const calculateGST = () => {
    const amt = parseFloat(amount);
    const rate = parseFloat(gstRate);

    if (!amt || amt <= 0) {
      return;
    }

    let baseAmount: number;
    let gstAmount: number;
    let totalAmount: number;

    if (calculationType === 'exclusive') {
      baseAmount = amt;
      gstAmount = (amt * rate) / 100;
      totalAmount = amt + gstAmount;
    } else {
      totalAmount = amt;
      baseAmount = (amt * 100) / (100 + rate);
      gstAmount = amt - baseAmount;
    }

    const gstResult: GSTResult = {
      transactionType,
      baseAmount,
      gstRate: rate,
      gstAmount,
      totalAmount,
    };

    if (transactionType === 'intrastate') {
      gstResult.cgst = gstAmount / 2;
      gstResult.sgst = gstAmount / 2;
    } else {
      gstResult.igst = gstAmount;
    }

    setResult(gstResult);
  };

  return (
    <CalculatorLayoutWithAds
      title="GST Calculator India 2025 - Calculate CGST, SGST, IGST Online | Free & Accurate"
      description="Free GST calculator for India 2025. Calculate GST, CGST, SGST, and IGST instantly with accurate tax amounts. Supports all GST slabs (0%, 5%, 12%, 18%, 28%). Online GST calculator with reverse calculation, intra-state and inter-state GST computation. Updated for FY 2025-26."
      keywords="gst calculator, gst calculator india 2025, cgst sgst calculator, igst calculator, goods and services tax, gst amount calculator, gst inclusive exclusive calculator, online gst calculator, reverse gst calculator, gst calculation formula, intra state gst, inter state gst, india gst rates 2025, gst tax calculator, free gst calculator india"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 bg-orange-100 rounded-xl">
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">GST Calculator</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate GST, CGST, SGST, and IGST for your transactions in India (FY 2025-26). Supports all tax slabs from 0% to 28% with both inclusive & exclusive calculations.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  GST Calculation
                </CardTitle>
                <CardDescription>Enter your transaction details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="calculationType">Calculation Type</Label>
                  <Select value={calculationType} onValueChange={setCalculationType}>
                    <SelectTrigger id="calculationType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="exclusive">GST Exclusive (Add GST to base amount)</SelectItem>
                      <SelectItem value="inclusive">GST Inclusive (Extract GST from total)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    {calculationType === 'exclusive' ? 'Base Amount (₹)' : 'Total Amount (₹)'}
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="10000"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type</Label>
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger id="transactionType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="intrastate">Intra-State (CGST + SGST)</SelectItem>
                      <SelectItem value="interstate">Inter-State (IGST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstRate">GST Rate (%)</Label>
                  <Select value={gstRate} onValueChange={setGstRate}>
                    <SelectTrigger id="gstRate">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">0% - Essential items (grains, milk, books)</SelectItem>
                      <SelectItem value="0.25">0.25% - Precious stones</SelectItem>
                      <SelectItem value="3">3% - Gold, silver</SelectItem>
                      <SelectItem value="5">5% - Essential goods (sugar, tea, coal)</SelectItem>
                      <SelectItem value="12">12% - Processed foods, computers</SelectItem>
                      <SelectItem value="18">18% - Most goods & services</SelectItem>
                      <SelectItem value="28">28% - Luxury items (cars, tobacco)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculateGST} className="w-full" size="lg">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate GST
                </Button>
              </CardContent>
            </Card>

            {transactionType === 'intrastate' && (
              <Alert>
                <Building2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Intra-State Transaction:</strong> GST will be split equally into CGST (Central GST) and SGST (State GST).
                </AlertDescription>
              </Alert>
            )}

            {transactionType === 'interstate' && (
              <Alert>
                <Building2 className="h-4 w-4" />
                <AlertDescription>
                  <strong>Inter-State Transaction:</strong> GST will be charged as IGST (Integrated GST) - collected by the central government.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="space-y-6">
            {result && (
              <>
                <Card className="border-orange-200 bg-orange-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <FileText className="h-5 w-5" />
                      GST Calculation Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Base Amount</p>
                        <p className="text-2xl font-bold text-gray-900">{formatCurrency(result.baseAmount, 'INR')}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Total GST</p>
                        <p className="text-2xl font-bold text-orange-600">{formatCurrency(result.gstAmount, 'INR')}</p>
                      </div>
                    </div>

                    <Separator />

                    {transactionType === 'intrastate' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-900">CGST ({result.gstRate / 2}%)</p>
                          <p className="text-xl font-bold text-blue-700">{formatCurrency(result.cgst!, 'INR')}</p>
                          <p className="text-xs text-blue-600">Central GST</p>
                        </div>
                        <div className="space-y-1 p-3 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-900">SGST ({result.gstRate / 2}%)</p>
                          <p className="text-xl font-bold text-green-700">{formatCurrency(result.sgst!, 'INR')}</p>
                          <p className="text-xs text-green-600">State GST</p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-900">IGST ({result.gstRate}%)</p>
                        <p className="text-2xl font-bold text-purple-700">{formatCurrency(result.igst!, 'INR')}</p>
                        <p className="text-xs text-purple-600">Integrated GST</p>
                      </div>
                    )}

                    <Separator />

                    <div className="p-4 bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Amount (Inc. GST)</p>
                      <p className="text-3xl font-bold text-orange-900">{formatCurrency(result.totalAmount, 'INR')}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">GST Rate:</span>
                        <span className="font-semibold">{result.gstRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction Type:</span>
                        <Badge variant="outline">{transactionType === 'intrastate' ? 'Intra-State' : 'Inter-State'}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <AIAnalysis
                  analysisRequest={{
                    calculatorType: 'gst_india',
                    data: {
                      transactionType: result.transactionType,
                      baseAmount: result.baseAmount,
                      gstRate: result.gstRate,
                      gstAmount: result.gstAmount,
                      cgst: result.cgst,
                      sgst: result.sgst,
                      igst: result.igst,
                      totalAmount: result.totalAmount,
                    },
                  }}
                  autoRun={true}
                  title="AI GST Analysis"
                  description="Get insights on GST calculations, compliance tips, and tax optimization strategies for your business in India."
                />

                <ExportShareButtons
                  calculatorType="gst-india"
                  inputs={{
                    amount: parseFloat(amount) || 0,
                    gstRate: parseFloat(gstRate) || 18,
                    calculationType,
                    transactionType
                  }}
                  results={{
                    baseAmount: result.baseAmount,
                    gstAmount: result.gstAmount,
                    totalAmount: result.totalAmount,
                    cgst: result.cgst,
                    sgst: result.sgst,
                    igst: result.igst
                  }}
                  title="GST Calculator India Report"
                  className="mt-6"
                />
              </>
            )}
          </div>
        </div>

        <div className="prose max-w-none">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Complete Guide to GST in India
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GST?</h2>
                <p className="text-gray-700 leading-relaxed">
                  Goods and Services Tax (GST) is a comprehensive, multi-stage, destination-based tax that is levied on every value addition. 
                  Implemented on July 1, 2017, GST replaced multiple indirect taxes including excise duty, VAT, service tax, and others, 
                  creating a unified tax system across India. As of 2025, GST continues to be the primary indirect tax framework, simplifying 
                  the Indian tax structure, reducing tax cascading, and improving ease of doing business.
                </p>
                <p className="text-gray-700 leading-relaxed mt-3">
                  GST is levied at every point in the supply chain, from manufacturer to consumer, with credit for tax paid at previous stages 
                  available as a set-off (Input Tax Credit - ITC). This eliminates the tax-on-tax problem and ensures that the final consumer 
                  bears only the GST charged by the last dealer in the supply chain, making it a transparent and efficient tax system.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of GST</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                    <h3 className="text-xl font-semibold text-blue-900">CGST - Central Goods and Services Tax</h3>
                    <p className="text-gray-700 mt-2">
                      CGST is levied by the Central Government on intra-state supplies of goods and services. For example, if a business in 
                      Maharashtra sells to another business in Maharashtra, CGST applies. The revenue collected goes to the Central Government.
                    </p>
                    <div className="mt-3 p-3 bg-white rounded border border-blue-200">
                      <p className="font-semibold text-sm">Example:</p>
                      <p className="text-sm mt-1">Product price: ₹10,000 | GST Rate: 18%</p>
                      <p className="text-sm">CGST (9%): ₹900 → Goes to Central Government</p>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50">
                    <h3 className="text-xl font-semibold text-green-900">SGST - State Goods and Services Tax</h3>
                    <p className="text-gray-700 mt-2">
                      SGST is levied by the State Government on intra-state supplies, collected along with CGST. The SGST rate is always equal 
                      to the CGST rate. Revenue goes to the respective State Government where the transaction occurs.
                    </p>
                    <div className="mt-3 p-3 bg-white rounded border border-green-200">
                      <p className="font-semibold text-sm">Example (same transaction):</p>
                      <p className="text-sm mt-1">Product price: ₹10,000 | GST Rate: 18%</p>
                      <p className="text-sm">SGST (9%): ₹900 → Goes to State Government</p>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50">
                    <h3 className="text-xl font-semibold text-purple-900">IGST - Integrated Goods and Services Tax</h3>
                    <p className="text-gray-700 mt-2">
                      IGST is levied by the Central Government on inter-state supplies (transactions between two different states) and on imports. 
                      The IGST rate equals the sum of CGST and SGST rates. The Central Government collects IGST and later distributes the SGST 
                      portion to the destination state.
                    </p>
                    <div className="mt-3 p-3 bg-white rounded border border-purple-200">
                      <p className="font-semibold text-sm">Example:</p>
                      <p className="text-sm mt-1">Seller in Delhi → Buyer in Kerala | Product: ₹10,000 | GST: 18%</p>
                      <p className="text-sm">IGST (18%): ₹1,800 → Collected by Central Govt, later split with Kerala</p>
                    </div>
                  </div>
                </div>
              </section>

              <div className="my-8">
                <AutoAdSlot placement="mid-content" />
              </div>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">GST Tax Slabs in India (2025)</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">GST Rate</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Category</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Examples</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">0%</td>
                        <td className="border border-gray-300 px-4 py-3">Essential Items</td>
                        <td className="border border-gray-300 px-4 py-3">Fresh vegetables, fruits, grains, milk, bread, eggs, newspapers, books, educational services</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-semibold">0.25%</td>
                        <td className="border border-gray-300 px-4 py-3">Precious Stones</td>
                        <td className="border border-gray-300 px-4 py-3">Cut and polished precious stones, semi-precious stones</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">3%</td>
                        <td className="border border-gray-300 px-4 py-3">Precious Metals</td>
                        <td className="border border-gray-300 px-4 py-3">Gold, silver jewelry, gold coins</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-semibold">5%</td>
                        <td className="border border-gray-300 px-4 py-3">Essential Goods</td>
                        <td className="border border-gray-300 px-4 py-3">Sugar, tea, coffee, edible oils, coal, medicines, transport services, small restaurants (turnover &lt; ₹20L)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">12%</td>
                        <td className="border border-gray-300 px-4 py-3">Standard Goods</td>
                        <td className="border border-gray-300 px-4 py-3">Computers, processed foods, butter, cheese, frozen meat, umbrellas, business class air tickets</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-semibold">18%</td>
                        <td className="border border-gray-300 px-4 py-3">Most Goods & Services</td>
                        <td className="border border-gray-300 px-4 py-3">Most manufactured products, IT services, telecom services, financial services, restaurants (AC), branded garments</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">28%</td>
                        <td className="border border-gray-300 px-4 py-3">Luxury & Sin Goods</td>
                        <td className="border border-gray-300 px-4 py-3">Automobiles, motorcycles, aircraft, luxury items, aerated drinks, tobacco products, pan masala, 5-star hotels</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600 mt-3 italic">
                  Note: GST rates are periodically reviewed by the GST Council. The above slabs are current as of 2025. Always verify the latest rates for specific items on the official GST portal or consult a tax professional.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">GST Registration Requirements</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  GST registration is mandatory for businesses exceeding specific turnover thresholds or engaged in certain activities:
                </p>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Mandatory Registration Thresholds (2025):</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Businesses with annual turnover exceeding <strong>₹40 lakhs</strong> (goods suppliers in most states)</li>
                    <li>Service providers with turnover exceeding <strong>₹20 lakhs</strong> (most states)</li>
                    <li>For special category states (NE states, J&K, Himachal Pradesh, Uttarakhand): ₹20 lakhs for goods, ₹10 lakhs for services</li>
                    <li>Inter-state suppliers (mandatory regardless of turnover)</li>
                    <li>E-commerce operators and sellers on e-commerce platforms</li>
                    <li>Casual taxable persons and non-resident taxable persons</li>
                    <li>Agents, input service distributors, and persons liable to pay tax under RCM</li>
                  </ul>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Documents Required for GST Registration:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">For Individuals/Proprietors:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                      <li>PAN card</li>
                      <li>Aadhaar card</li>
                      <li>Proof of business registration</li>
                      <li>Bank account statement/canceled cheque</li>
                      <li>Digital signature (for companies)</li>
                      <li>Business address proof</li>
                      <li>Photographs</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">For Companies/LLPs:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                      <li>Certificate of Incorporation</li>
                      <li>PAN of the company</li>
                      <li>MOA and AOA</li>
                      <li>Board resolution for authorized signatory</li>
                      <li>Identity and address proof of directors</li>
                      <li>Address proof of business premises</li>
                      <li>Bank account details</li>
                    </ul>
                  </div>
                </div>
              </section>

              <div className="my-8">
                <AutoAdSlot placement="mid-content" />
              </div>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Input Tax Credit (ITC)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Input Tax Credit is the cornerstone of GST and a major benefit for businesses. ITC allows businesses to reduce their GST 
                  liability by claiming credit for the GST paid on purchases (inputs).
                </p>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">How ITC Works - Example:</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Step 1:</strong> Manufacturer buys raw materials for ₹10,000 + GST@18% (₹1,800) = ₹11,800 total</p>
                    <p><strong>Step 2:</strong> Manufacturer sells finished goods for ₹20,000 + GST@18% (₹3,600)</p>
                    <p><strong>Step 3:</strong> ITC Calculation:</p>
                    <div className="ml-4 space-y-1">
                      <p>• GST collected on sales: ₹3,600</p>
                      <p>• GST paid on purchases (ITC): ₹1,800</p>
                      <p>• <strong className="text-blue-700">Net GST payable: ₹3,600 - ₹1,800 = ₹1,800</strong></p>
                    </div>
                    <p className="text-blue-700 font-semibold mt-2">Result: Instead of paying ₹3,600, you only pay ₹1,800 to the government!</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">ITC is Available On:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Goods and services used for business purposes</li>
                  <li>Capital goods (machinery, equipment) used in the business</li>
                  <li>Input services (legal, accounting, consulting services)</li>
                  <li>Goods sent on approval basis (if returned within 6 months)</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">ITC is NOT Available On:</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Motor vehicles for personal use (except specific business use)</li>
                  <li>Food, beverages, and outdoor catering (except as stock-in-trade)</li>
                  <li>Personal and employee welfare expenses (club memberships, health services)</li>
                  <li>Goods/services for personal consumption</li>
                  <li>Works contract for construction of immovable property (except plant & machinery)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">GST Returns Filing (2025)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Businesses registered under GST must file periodic returns. The frequency and type depend on the business type and turnover.
                  As of 2025, the GST return filing system continues with the following structure:
                </p>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Return Type</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Who Files</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Frequency</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">GSTR-1</td>
                        <td className="border border-gray-300 px-4 py-3">All registered dealers</td>
                        <td className="border border-gray-300 px-4 py-3">Monthly (turnover &gt; ₹5 cr) or Quarterly (QRMP, ≤ ₹5 cr)</td>
                        <td className="border border-gray-300 px-4 py-3">11th of next month (monthly)<br/>13th of month after quarter (quarterly)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-semibold">GSTR-3B</td>
                        <td className="border border-gray-300 px-4 py-3">All registered dealers</td>
                        <td className="border border-gray-300 px-4 py-3">Monthly (turnover &gt; ₹5 cr) or Quarterly (QRMP, ≤ ₹5 cr)</td>
                        <td className="border border-gray-300 px-4 py-3">20th of next month (monthly)<br/>22nd/24th after quarter (quarterly)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">GSTR-2B</td>
                        <td className="border border-gray-300 px-4 py-3">Auto-generated (official ITC statement)</td>
                        <td className="border border-gray-300 px-4 py-3">Monthly</td>
                        <td className="border border-gray-300 px-4 py-3">After 14th (static, use this for ITC claims)</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3 font-semibold">GSTR-2A</td>
                        <td className="border border-gray-300 px-4 py-3">Auto-populated (reference only)</td>
                        <td className="border border-gray-300 px-4 py-3">Real-time</td>
                        <td className="border border-gray-300 px-4 py-3">Dynamic view (not for official ITC claims)</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3 font-semibold">GSTR-9</td>
                        <td className="border border-gray-300 px-4 py-3">Annual return (turnover &gt; ₹2 crore)</td>
                        <td className="border border-gray-300 px-4 py-3">Annually</td>
                        <td className="border border-gray-300 px-4 py-3">31st December of next financial year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500">
                  <h3 className="font-semibold text-red-900 mb-2">Late Filing Penalties (2025):</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>GSTR-1:</strong> ₹200 per day (₹100 CGST + ₹100 SGST), maximum ₹10,000</li>
                    <li><strong>GSTR-3B:</strong> ₹50 per day if no tax liability, ₹200 per day if tax liability exists</li>
                    <li><strong>Late payment interest:</strong> 18% per annum on outstanding tax amount</li>
                    <li className="text-sm italic mt-2">Note: Verify current penalty rates on the GST portal as rates may be revised</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">e-Invoicing System (2025)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>e-Invoicing is mandatory for all businesses with annual turnover exceeding ₹5 crore.</strong> This is one of the most 
                  significant procedural changes in GST compliance, aimed at digitizing B2B invoices and reducing tax evasion.
                </p>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 mb-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">How e-Invoicing Works:</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Step 1:</strong> Generate invoice in your billing software with mandatory fields</p>
                    <p><strong>Step 2:</strong> Upload invoice to Invoice Registration Portal (IRP) for authentication</p>
                    <p><strong>Step 3:</strong> IRP validates invoice and returns a unique Invoice Reference Number (IRN)</p>
                    <p><strong>Step 4:</strong> IRP generates a signed QR code containing invoice details</p>
                    <p><strong>Step 5:</strong> Print/email invoice with IRN and QR code to customer</p>
                    <p className="text-purple-700 font-semibold mt-2">Result: Invoice is auto-reported to GST system and reflected in buyer's GSTR-2B!</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">e-Invoicing Applicability:</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="border border-purple-200 rounded p-4 bg-purple-50">
                    <h4 className="font-semibold text-purple-900 mb-2">Mandatory For:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                      <li>All B2B invoices (business to business)</li>
                      <li>Businesses with turnover &gt; ₹5 crore</li>
                      <li>Export invoices</li>
                      <li>Debit notes and credit notes</li>
                    </ul>
                  </div>
                  <div className="border border-gray-200 rounded p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">NOT Required For:</h4>
                    <ul className="list-disc list-inside text-sm space-y-1 text-gray-700">
                      <li>B2C invoices (to individual consumers)</li>
                      <li>Businesses under ₹5 crore turnover</li>
                      <li>SEZ supplies (separate system)</li>
                      <li>Certain banking and financial services</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded p-4">
                  <h3 className="font-semibold text-orange-900 mb-2">Key Benefits of e-Invoicing:</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li><strong>Real-time ITC availability:</strong> Buyer sees your invoice in their GSTR-2B immediately</li>
                    <li><strong>Reduced return filing errors:</strong> Auto-population of GSTR-1 data</li>
                    <li><strong>Faster payments:</strong> Buyers can quickly verify and process authentic invoices</li>
                    <li><strong>E-Way Bill integration:</strong> Generate E-Way Bill directly from e-Invoice</li>
                    <li><strong>Digital invoice archival:</strong> 6-year compliance made easier</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">QRMP Scheme - Simplified Compliance for Small Businesses</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The <strong>Quarterly Return Monthly Payment (QRMP)</strong> scheme is a major simplification for small taxpayers with 
                  turnover up to ₹5 crore. It reduces compliance burden while ensuring regular tax payments.
                </p>

                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">How QRMP Works:</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p><strong>Returns:</strong> File GSTR-1 and GSTR-3B quarterly instead of monthly</p>
                    <p><strong>Tax Payment:</strong> Pay tax liability monthly (even though returns are quarterly)</p>
                    <p><strong>Example:</strong> For Q1 (Apr-May-Jun), file returns by July 13/20, but pay tax by May 25, Jun 25, Jul 20</p>
                    <p className="text-green-700 font-semibold mt-2">Benefit: 75% reduction in compliance effort - 4 returns/year instead of 12!</p>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-3">Invoice Furnishing Facility (IFF):</h3>
                <p className="text-gray-700 mb-3">
                  For businesses under QRMP, the IFF allows optional uploading of B2B invoices in the first two months of a quarter. 
                  This ensures your large customers don't have to wait until quarter-end to claim ITC.
                </p>

                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full border-collapse border border-gray-300 text-sm">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Month</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold">QRMP Action</th>
                        <th className="border border-gray-300 px-3 py-2 text-left font-semibold">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">Month 1 (e.g., April)</td>
                        <td className="border border-gray-300 px-3 py-2">Pay tax via PMT-06 + Optional IFF</td>
                        <td className="border border-gray-300 px-3 py-2">25th of next month</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-3 py-2">Month 2 (e.g., May)</td>
                        <td className="border border-gray-300 px-3 py-2">Pay tax via PMT-06 + Optional IFF</td>
                        <td className="border border-gray-300 px-3 py-2">25th of next month</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-3 py-2">Month 3 (e.g., June)</td>
                        <td className="border border-gray-300 px-3 py-2">File GSTR-1 + GSTR-3B (quarterly)</td>
                        <td className="border border-gray-300 px-3 py-2">13th & 22nd/24th</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Pro Tip:</strong> If you have large B2B customers who need ITC quickly, use IFF to upload invoices monthly. 
                    If most sales are B2C or to small businesses, skip IFF and just file quarterly returns.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">E-Way Bill Requirements (2025)</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  An E-Way Bill is an electronic document generated on the GST portal for movement of goods worth more than ₹50,000. 
                  It's mandatory for both inter-state and intra-state movement of goods (intra-state applicability depends on state rules).
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">When is E-Way Bill Mandatory?</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4 mb-4">
                  <li>Movement of goods worth more than <strong>₹50,000</strong> (single invoice/bill)</li>
                  <li>Inter-state movement is mandatory; intra-state requirements vary by state</li>
                  <li>Generated by the consignor or recipient (whoever initiates movement)</li>
                  <li>Required even for goods transport by own vehicle or hired vehicle</li>
                  <li>Check state-specific E-Way Bill rules on the GST portal</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">E-Way Bill Validity Periods:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Distance</th>
                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Validity Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Less than 200 km</td>
                        <td className="border border-gray-300 px-4 py-3">1 day</td>
                      </tr>
                      <tr className="bg-gray-50">
                        <td className="border border-gray-300 px-4 py-3">For every additional 200 km</td>
                        <td className="border border-gray-300 px-4 py-3">Additional 1 day</td>
                      </tr>
                      <tr>
                        <td className="border border-gray-300 px-4 py-3">Example: 500 km</td>
                        <td className="border border-gray-300 px-4 py-3">3 days</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Common GST Mistakes to Avoid</h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-900">1. Incorrect GSTIN on Invoices</h3>
                    <p className="text-gray-700 mt-1">
                      Always verify the buyer's GSTIN before issuing invoices. An incorrect GSTIN prevents the buyer from claiming ITC and can lead to disputes.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-900">2. Using GSTR-2A Instead of GSTR-2B for ITC Claims</h3>
                    <p className="text-gray-700 mt-1">
                      <strong>Critical Update:</strong> Always use GSTR-2B (static, official statement) for claiming ITC, not GSTR-2A (dynamic view). 
                      GSTR-2B is generated after the 14th of each month and is the tax authority-mandated basis for ITC claims. Regularly reconcile 
                      GSTR-2B with your purchase records to ensure accuracy.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-900">3. Late Filing of Returns</h3>
                    <p className="text-gray-700 mt-1">
                      Late filing attracts penalties and interest. Set reminders for due dates (GSTR-1: 11th, GSTR-3B: 20th of next month).
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-900">4. Claiming ITC on Ineligible Expenses</h3>
                    <p className="text-gray-700 mt-1">
                      ITC cannot be claimed on personal expenses, employee welfare, motor vehicles for personal use, or food and beverages. 
                      Claiming ineligible ITC can result in penalties during audits.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-900">5. Wrong GST Rate Application</h3>
                    <p className="text-gray-700 mt-1">
                      Each product/service has a specific GST rate (0%, 5%, 12%, 18%, 28%). Applying the wrong rate leads to tax 
                      discrepancies. Always verify the HSN/SAC code and applicable rate.
                    </p>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4 py-2 bg-red-50">
                    <h3 className="text-lg font-semibold text-red-900">6. Not Maintaining Proper Documentation</h3>
                    <p className="text-gray-700 mt-1">
                      Keep all invoices, bills, e-way bills, and transport documents organized for at least 6 years. Poor documentation 
                      can cause issues during GST audits.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Frequently Asked Questions (FAQ)</h2>
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q1: When should I use CGST+SGST vs IGST?</h3>
                    <p className="text-gray-700 mt-2">
                      <strong>CGST + SGST:</strong> Use for intra-state transactions (buyer and seller in the same state). The GST is split 
                      equally between central and state governments.
                      <br/><br/>
                      <strong>IGST:</strong> Use for inter-state transactions (buyer and seller in different states) or for imports. 
                      The entire GST goes to the central government initially, which then distributes the SGST portion to the destination state.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q2: GSTR-2A vs GSTR-2B - Which should I use for claiming ITC?</h3>
                    <p className="text-gray-700 mt-2">
                      <strong>Always use GSTR-2B</strong> as the official basis for claiming ITC in your GSTR-3B return. Here's the difference:
                      <br/><br/>
                      <strong>GSTR-2B:</strong> Static, auto-generated statement available after the 14th of each month. This is the official, 
                      tax authority-mandated document for ITC claims. Once generated, it doesn't change.
                      <br/><br/>
                      <strong>GSTR-2A:</strong> Dynamic, real-time view of data uploaded by your suppliers. Use this for reference and early tracking, 
                      but not for official ITC claims. It changes continuously as suppliers upload invoices.
                      <br/><br/>
                      <strong>Important:</strong> If your supplier hasn't filed GSTR-1 by the due date, their invoice won't appear in your GSTR-2B, 
                      and you cannot claim ITC until it does.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q3: What is the penalty for not registering under GST when required?</h3>
                    <p className="text-gray-700 mt-2">
                      If you fail to register despite crossing the threshold limit, you can face:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Penalty of 10% of tax due or ₹10,000 (whichever is higher)</li>
                        <li>Interest at 18% per annum on unpaid tax</li>
                        <li>Recovery of tax for the period you operated without registration</li>
                      </ul>
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q4: Can I revise a GST return after filing?</h3>
                    <p className="text-gray-700 mt-2">
                      GSTR-1 can be amended in the next month's GSTR-1 using amendment tables. However, GSTR-3B cannot be revised after filing. 
                      You can only make corrections in subsequent months. Annual return (GSTR-9) allows for reconciliation of differences.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q5: What is Reverse Charge Mechanism (RCM)?</h3>
                    <p className="text-gray-700 mt-2">
                      Under RCM, the recipient of goods/services pays GST instead of the supplier. This applies in specific cases:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>When purchasing from unregistered suppliers</li>
                        <li>Specific services like legal services, security services (from individuals)</li>
                        <li>Import of services</li>
                        <li>Goods transport agency services (if transporter doesn't have GST registration)</li>
                      </ul>
                      The recipient must pay GST to the government and can claim ITC if eligible.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q6: How is GST calculated on discounts?</h3>
                    <p className="text-gray-700 mt-2">
                      <strong>Discount before supply:</strong> GST is calculated on the discounted price (invoice value after discount).
                      <br/><br/>
                      <strong>Discount after supply:</strong> If mentioned on the original invoice, ITC reversal is required. If not mentioned, 
                      issue a credit note and adjust in the same financial year or September of next year.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q7: Do I need e-Invoicing for my business?</h3>
                    <p className="text-gray-700 mt-2">
                      e-Invoicing is <strong>mandatory if your annual turnover exceeds ₹5 crore</strong>. It applies to:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All B2B invoices (business to business transactions)</li>
                        <li>Export invoices</li>
                        <li>Debit notes and credit notes</li>
                      </ul>
                      <br/>
                      e-Invoicing is NOT required for B2C invoices (sales to individual consumers) or if your turnover is below ₹5 crore. 
                      The system generates a unique IRN and QR code that must be printed on the invoice.
                    </p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900">Q8: What is the QRMP scheme and should I opt for it?</h3>
                    <p className="text-gray-700 mt-2">
                      The Quarterly Return Monthly Payment (QRMP) scheme is available for businesses with turnover up to ₹5 crore. 
                      <br/><br/>
                      <strong>Benefits:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>File GSTR-1 and GSTR-3B quarterly instead of monthly (4 returns/year vs 12)</li>
                        <li>Reduced compliance burden and filing costs</li>
                        <li>Optional Invoice Furnishing Facility (IFF) for large B2B customers</li>
                      </ul>
                      <br/>
                      <strong>Note:</strong> You still need to pay tax monthly (via PMT-06), but return filing is only quarterly. 
                      This scheme is ideal for small businesses with primarily B2C sales or small B2B transactions.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <div className="bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">Summary</h2>
                  <p className="text-gray-700 leading-relaxed">
                    GST has revolutionized India's tax system by creating a unified, transparent framework. Understanding the difference between 
                    CGST, SGST, and IGST, knowing when to apply each, properly claiming Input Tax Credit, filing returns on time, and maintaining 
                    accurate records are crucial for GST compliance. Use this calculator to quickly compute GST amounts for your transactions.
                  </p>
                  <p className="text-sm text-gray-600 mt-3 italic">
                    <strong>Disclaimer:</strong> This guide is current as of 2025 but GST laws and rates may change. Always verify the latest rules on 
                    <a href="https://www.gst.gov.in" target="_blank" rel="noopener noreferrer" className="underline text-orange-600 hover:text-orange-700"> www.gst.gov.in</a> or 
                    consult a tax professional for complex scenarios, audits, and personalized advice.
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
};

export default GSTCalculatorIndia;
