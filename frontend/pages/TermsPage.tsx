import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEOHead } from '../components/SEOHead';

export function TermsPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Terms of Service - Smart Calculator Hubs | Usage Terms and Conditions"
        description="Smart Calculator Hub's terms of service outline the rules and regulations for using our financial calculators and website services."
        keywords="terms of service, terms and conditions, Smart Calculator Hub, financial calculators, usage agreement"
      />

      <div className="container mx-auto px-4 py-8">
        {/* Page Navigation Tabs - Desktop and Mobile */}
        <div className="mb-8">
          <div className="flex items-center justify-between lg:justify-center gap-4 text-sm font-medium border-b pb-4">
            {/* Mobile Back to Home on left */}
            <Link to="/" className="lg:hidden">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Home</span>
              </Button>
            </Link>
            
            {/* Center tabs */}
            <div className="flex items-center gap-4">
              <Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-3">
                About
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-3">
                Privacy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3">
                Terms
              </Link>
            </div>
            
            {/* Spacer for mobile to balance the layout */}
            <div className="lg:hidden w-10"></div>
          </div>
          
          {/* Mobile Info Banner */}
          <div className="lg:hidden mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <span className="text-lg">☰</span>
              <span>Tap the menu icon (☰) in the top-right corner to access all calculators, tools, and features</span>
            </p>
          </div>
        </div>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none space-y-8">
          <div>
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p>
              Welcome to Smart Calculator Hub, operated by Quantum Leap Ventures Pvt Ltd. These Terms of Service ("Terms") govern your use of our website 
              and calculator services. By accessing or using our services, you agree to 
              be bound by these Terms.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using Smart Calculator Hub, you accept and agree to be bound by the terms and 
              provision of this agreement. If you do not agree to abide by the above, please do 
              not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Use License</h2>
            <p>
              Permission is granted to temporarily use Smart Calculator Hub for personal, non-commercial 
              transitory viewing only. This is the grant of a license, not a transfer of title, 
              and under this license you may not:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Disclaimer and Limitation of Warranties</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-red-900 mb-2">⚠️ IMPORTANT DISCLAIMER</p>
              <p className="text-sm text-red-800 mb-3">
                THE SERVICES, CALCULATORS, AND ALL CONTENT ON THIS WEBSITE ARE PROVIDED "AS IS" AND "AS AVAILABLE" 
                WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES 
                OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </p>
              <p className="text-sm text-red-800">
                WE DO NOT WARRANT THAT:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-red-800">
                <li>The calculators or results will be accurate, complete, reliable, or error-free</li>
                <li>The service will be uninterrupted, secure, or virus-free</li>
                <li>Any errors or defects will be corrected</li>
                <li>The results obtained from our tools will meet your specific requirements</li>
              </ul>
            </div>
            
            <h3 className="text-xl font-medium mb-3 mt-6">Not Professional Advice</h3>
            <p className="mb-4">
              The information and calculators on Smart Calculator Hub are provided for informational and educational purposes only. 
              They are NOT a substitute for professional financial, tax, legal, accounting, or investment advice.
            </p>
            <p className="mb-4">
              Our calculators are estimation tools designed to help you explore different scenarios. The results are based 
              solely on the inputs you provide and general mathematical formulas. They do not take into account your complete 
              financial situation, goals, risk tolerance, or other individual circumstances.
            </p>
            <p className="font-semibold">
              Always consult with qualified professionals (financial advisors, tax accountants, lawyers, etc.) before making 
              any important financial, legal, or investment decisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">LIABILITY LIMITATION</p>
              <p className="text-sm text-yellow-800">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL SMART CALCULATOR HUB, 
                QUANTUM LEAP VENTURES PVT LTD, OR ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY:
              </p>
              <ul className="list-disc pl-6 space-y-1 mt-2 text-sm text-yellow-800">
                <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                <li>LOSS OF PROFITS, REVENUE, DATA, OR USE</li>
                <li>BUSINESS INTERRUPTION OR FINANCIAL LOSSES</li>
                <li>DAMAGES ARISING FROM RELIANCE ON CALCULATOR RESULTS OR INFORMATION PROVIDED</li>
                <li>ERRORS, INACCURACIES, OR OMISSIONS IN CALCULATIONS OR CONTENT</li>
              </ul>
              <p className="text-sm text-yellow-800 mt-3">
                This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, or otherwise), 
                even if we have been advised of the possibility of such damages.
              </p>
            </div>
            <p className="mt-4">
              Some jurisdictions do not allow the exclusion or limitation of certain warranties or liabilities. 
              In such jurisdictions, our liability will be limited to the greatest extent permitted by law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Accuracy of Materials and No Guarantee</h2>
            <p className="mb-4">
              The materials, calculators, and information appearing on Smart Calculator Hub may contain technical, 
              typographical, calculation, or other errors. We do not warrant or guarantee that any of the materials, 
              calculators, or results on our website are accurate, complete, current, or suitable for your specific needs.
            </p>
            <p className="mb-4">
              We reserve the right to make changes, corrections, or updates to any content, calculators, or methodologies 
              at any time without prior notice. We are not obligated to update information or notify users of changes.
            </p>
            <p className="font-semibold">
              You acknowledge and agree that you use our calculators and information at your own risk, and you are solely 
              responsible for verifying the accuracy and suitability of any results or information for your purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Use our services for any unlawful purpose or in violation of these Terms</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt our services or servers</li>
              <li>Use automated systems to access our website in a manner that creates excessive load</li>
              <li>Transmit any harmful, threatening, or offensive content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
            <p>
              All content on Smart Calculator Hub, including but not limited to text, graphics, logos, images, 
              and software, is the property of Quantum Leap Ventures Pvt Ltd and/or its licensors and is protected by copyright, 
              trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative 
              works without our express written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
            <p>
              Your privacy is important to us. Please review our Privacy Policy, which also governs 
              your use of the website, to understand our practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
            <p>
              Smart Calculator Hub may revise these Terms of Service at any time without notice. By using this 
              website, you are agreeing to be bound by the then current version of these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p>
              You agree to indemnify, defend, and hold harmless Smart Calculator Hub, Quantum Leap Ventures Pvt Ltd, 
              and its affiliates, officers, directors, employees, and agents from and against any claims, liabilities, 
              damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Your use or misuse of our services</li>
              <li>Your reliance on any calculator results or information</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any rights of another party</li>
              <li>Any financial decisions made based on our tools or content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law and Jurisdiction</h2>
            <p className="mb-4">
              These Terms of Service are governed by and construed in accordance with the laws of India, 
              without regard to its conflict of law provisions.
            </p>
            <p>
              Any disputes arising out of or relating to these Terms or the use of our services shall be subject 
              to the exclusive jurisdiction of the courts located in India. However, we may seek injunctive or other 
              equitable relief in any court of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Severability</h2>
            <p>
              If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining 
              provisions shall continue in full force and effect. The invalid provision shall be modified to the 
              minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Entire Agreement</h2>
            <p>
              These Terms of Service, together with our Privacy Policy, constitute the entire agreement between 
              you and Smart Calculator Hub regarding the use of our services and supersede any prior agreements 
              or understandings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: saravananvijayakumar@quantumleapventures.com.au</li>
              <li>Company: Quantum Leap Ventures Pvt Ltd</li>
              <li>Contact Page: <Link to="/contact" className="text-blue-600 hover:underline">/contact</Link></li>
            </ul>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
