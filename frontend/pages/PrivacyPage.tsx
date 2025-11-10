import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { SEOHead } from '../components/SEOHead';

export function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Privacy Policy - Smart Calculator Hubs | How We Protect Your Data"
        description="Smart Calculator Hub's privacy policy explains how we collect, use, and protect your personal information when using our financial calculators."
        keywords="privacy policy, data protection, Smart Calculator Hub, financial calculators, user privacy"
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
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-3">
                Privacy
              </Link>
              <span className="text-gray-300 dark:text-gray-700">|</span>
              <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pb-3">
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
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none space-y-8">
          <div>
            <p className="text-muted-foreground mb-6">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            <p>
              Smart Calculator Hub, operated by Quantum Leap Ventures Pvt Ltd ("we," "our," or "us"), is committed to protecting your privacy. This Privacy Policy 
              explains how we collect, use, disclose, and safeguard your information when you visit our 
              website and use our calculators and tools.
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">
              <strong>Important:</strong> We do NOT collect, store, or save any of your calculator inputs or financial data. 
              All calculations are performed locally in your browser or temporarily on our servers and are not retained.
            </p>
            
            <h3 className="text-xl font-medium mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Contact information when you reach out to us</li>
              <li>Feedback and survey responses (optional)</li>
            </ul>

            <h3 className="text-xl font-medium mb-3 mt-6">Information Automatically Collected</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Usage data and analytics (page views, feature usage)</li>
              <li>Device information and browser type</li>
              <li>IP address and general location data</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our calculator services</li>
              <li>To improve our website and user experience</li>
              <li>To analyze usage patterns and optimize performance</li>
              <li>To respond to your inquiries and provide customer support</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="mb-4">
              We implement reasonable technical and organizational security measures to protect your 
              personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Security Disclaimer</p>
              <p className="text-sm text-yellow-800">
                While we take reasonable steps to protect your information, no method of transmission over the Internet 
                or electronic storage is 100% secure. We cannot guarantee absolute security of your data. You use our 
                services at your own risk.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Retention</h2>
            <p>
              <strong>Calculator Inputs:</strong> We do not store any calculator inputs or financial data you enter. 
              All calculations are processed in real-time and not saved to our servers.
            </p>
            <p className="mt-4">
              <strong>Analytics Data:</strong> We retain anonymous usage analytics and technical data only as long 
              as necessary for the purposes outlined in this policy, typically no longer than 24 months.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
            <p className="mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic. 
              Cookies are small text files stored on your device that help us improve our services.
            </p>
            <h3 className="text-xl font-medium mb-3">Types of Cookies We Use:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
              <li><strong>Advertising Cookies:</strong> Used to display relevant advertisements</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
            </ul>
            <p className="mt-4">
              You can control cookies through your browser settings. However, disabling cookies may affect 
              the functionality of our website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Google AdSense and Advertising</h2>
            <p className="mb-4">
              We use Google AdSense to display advertisements on our website. Google AdSense uses cookies 
              to serve ads based on your prior visits to our website or other websites on the Internet.
            </p>
            <h3 className="text-xl font-medium mb-3">DoubleClick DART Cookie:</h3>
            <p className="mb-4">
              Google uses the DoubleClick DART cookie to serve ads to our site visitors based upon their visit 
              to our website and other sites on the Internet. Users may opt out of the use of the DART cookie 
              by visiting the Google Ad and Content Network privacy policy.
            </p>
            <h3 className="text-xl font-medium mb-3">How to Opt-Out of Personalized Advertising:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Visit <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Google Ads Settings</a> to customize your ad preferences</li>
              <li>Visit <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">AboutAds.info</a> to opt out of personalized advertising from participating companies</li>
              <li>Use your browser settings to block third-party cookies</li>
            </ul>
            <p className="mt-4">
              Please note that opting out of personalized advertising does not mean you will stop seeing ads. 
              You will still see advertisements, but they may be less relevant to your interests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Amazon Associates Program</h2>
            <p>
              Smart Calculator Hub is a participant in the Amazon Services LLC Associates Program, an affiliate 
              advertising program designed to provide a means for sites to earn advertising fees by advertising 
              and linking to Amazon.com. We may earn a commission when you click on Amazon links on our website 
              and make a purchase. This comes at no additional cost to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
            <p>
              Our website may contain links to third-party websites or services. We are not responsible 
              for the privacy practices of these external sites. We may also use third-party analytics 
              and advertising services that may collect information about your use of our website.
            </p>
            <h3 className="text-xl font-medium mb-3 mt-4">Third-Party Ad Servers:</h3>
            <p>
              Third-party ad servers or ad networks may use cookies, JavaScript, or Web Beacons that are 
              used in their respective advertisements and links that appear on our website. They automatically 
              receive your IP address when this occurs. These technologies are used to measure the effectiveness 
              of their advertising campaigns and/or to personalize the advertising content that you see on 
              websites that you visit. We have no access to or control over these cookies used by third-party advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p>
              You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>Access the personal information we hold about you</li>
              <li>Correct inaccurate or incomplete information</li>
              <li>Request deletion of your personal information</li>
              <li>Opt out of certain data processing activities</li>
              <li>File a complaint with relevant data protection authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p>
              Our services are not intended for children under 13 years of age. We do not knowingly 
              collect personal information from children under 13. If you believe we have collected 
              information from a child under 13, please contact us immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Jurisdictional Compliance</h2>
            <p className="mb-4">
              Smart Calculator Hub operates internationally and complies with applicable privacy laws in the jurisdictions 
              we serve, including GDPR (European Union), CCPA (California), and other regional privacy regulations where applicable.
            </p>
            <p>
              Depending on your location, you may have additional rights under local privacy laws. Please contact us 
              to exercise any rights available to you under applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: saravananvijayakumar@quantumleapventures.com.au</li>
              <li>Company: Quantum Leap Ventures Pvt Ltd</li>
              <li>Through our contact page at <Link to="/contact" className="text-blue-600 hover:underline">/contact</Link></li>
            </ul>
          </section>
        </div>
      </div>
      </div>
    </div>
  );
}
