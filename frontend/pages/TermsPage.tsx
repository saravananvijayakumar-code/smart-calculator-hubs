import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEOHead } from '../components/SEOHead';
import { TopBannerAd } from '../components/ads/TopBannerAd';
import { MidContentAd } from '../components/ads/MidContentAd';

export function TermsPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Terms of Service - Smart Calculator Hubs | Usage Terms and Conditions"
        description="Smart Calculator Hub's terms of service outline the rules and regulations for using our financial calculators and website services."
        keywords="terms of service, terms and conditions, Smart Calculator Hub, financial calculators, usage agreement"
      />

      {/* Top Banner Ad */}
      <TopBannerAd className="bg-gray-50 border-b" />

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
              Welcome to Smart Calculator Hub. These Terms of Service ("Terms") govern your use of our website 
              and financial calculator services. By accessing or using our services, you agree to 
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
            <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
            <p>
              The information and calculators on Smart Calculator Hub are provided for informational purposes only. 
              While we strive for accuracy, we make no representations or warranties of any kind, 
              express or implied, about the completeness, accuracy, reliability, suitability, or 
              availability of the information or calculations.
            </p>
            <p className="mt-4">
              <strong>Important:</strong> Our calculators are tools to help you estimate financial 
              scenarios. They should not be considered as professional financial advice. Always 
              consult with qualified financial advisors before making important financial decisions.
            </p>
          </section>

          {/* Mid Content Ad */}
          <div className="my-8">
            <MidContentAd />
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
            <p>
              In no event shall Smart Calculator Hub or its suppliers be liable for any damages (including, 
              without limitation, damages for loss of data or profit, or due to business interruption) 
              arising out of the use or inability to use Smart Calculator Hub, even if Smart Calculator Hub or its authorized 
              representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Accuracy of Materials</h2>
            <p>
              The materials appearing on Smart Calculator Hub could include technical, typographical, or 
              photographic errors. Smart Calculator Hub does not warrant that any of the materials on its 
              website are accurate, complete, or current. Smart Calculator Hub may make changes to the materials 
              contained on its website at any time without notice.
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
              and software, is the property of Smart Calculator Hub and is protected by copyright and other 
              intellectual property laws. You may not reproduce, distribute, or create derivative 
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
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p>
              These Terms and Conditions are governed by and construed in accordance with the laws 
              of the jurisdiction in which Smart Calculator Hub operates, and you irrevocably submit to the 
              exclusive jurisdiction of the courts in that state or location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us through 
              our contact page.
            </p>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
