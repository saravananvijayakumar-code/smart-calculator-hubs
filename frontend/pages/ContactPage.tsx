import { Mail, Send, Instagram } from 'lucide-react';
import { FaXTwitter } from 'react-icons/fa6';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayoutWithAds from '../components/CalculatorLayoutWithAds';

export function ContactPage() {
  const contactEmail = 'saravananvijayakumar@quantumleapventures.com.au';

  return (
    <CalculatorLayoutWithAds
      title="Contact Us - Smart Calculator Hubs"
      description="Get in touch with Smart Calculator Hub. We're here to help with your questions about our calculators and tools."
      keywords="contact, support, smart calculator hub, customer service, help"
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our calculators? Need help with a calculation? 
            We're here to assist you. Reach out to us anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get help with calculations, report issues, or ask questions
                </p>
                <a 
                  href={`mailto:${contactEmail}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-lg"
                >
                  {contactEmail}
                </a>
                <div className="mt-4">
                  <Button asChild>
                    <a href={`mailto:${contactEmail}`}>
                      <Send className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5 text-blue-600" />
                  Response Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We typically respond to all inquiries within 24 hours during business days.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* What We Can Help With */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>What We Can Help With</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Calculator usage and tips
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Technical support
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Feature requests
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Business partnerships
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    Bug reports
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    General inquiries
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect With Us</h2>
            <p className="text-gray-600">
              Follow us on social media for updates, tips, and more
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-2xl mx-auto mb-16">
            <a
              href="https://www.instagram.com/quan.tumleapventures/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <Instagram className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">Instagram</div>
                <div className="text-sm opacity-90">@quan.tumleapventures</div>
              </div>
            </a>

            <a
              href="https://x.com/QUANTUMLEAP_V"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-8 py-4 bg-black text-white rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto justify-center"
            >
              <FaXTwitter className="h-6 w-6" />
              <div className="text-left">
                <div className="font-semibold">X (Twitter)</div>
                <div className="text-sm opacity-90">@QUANTUMLEAP_V</div>
              </div>
            </a>
          </div>
        </div>

        {/* Important Disclaimer */}
        <div className="mt-16 mb-8">
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                ⚠️ Important Legal Disclaimer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-yellow-900">
                <p>
                  <strong>Not Professional Advice:</strong> Smart Calculator Hub provides calculators and tools for informational 
                  and educational purposes only. Our calculators, AI analysis, and content do NOT constitute professional financial, 
                  tax, legal, investment, or medical advice.
                </p>
                <p>
                  <strong>No Warranties:</strong> Results are estimates based on the inputs you provide and standard formulas. 
                  We make no warranties or guarantees about the accuracy, completeness, reliability, or suitability of any 
                  calculator results or information provided.
                </p>
                <p>
                  <strong>Consult Professionals:</strong> Always consult with qualified professionals (financial advisors, 
                  tax accountants, lawyers, medical professionals, etc.) before making any important decisions based on 
                  calculator results or information from this website.
                </p>
                <p>
                  <strong>Use at Your Own Risk:</strong> You acknowledge that you use our calculators and information at your 
                  own risk and are solely responsible for any decisions you make.
                </p>
                <p className="pt-2 border-t border-yellow-300">
                  By using this website, you agree to our <Link to="/terms" className="underline font-semibold">Terms of Service</Link> and <Link to="/privacy" className="underline font-semibold">Privacy Policy</Link>.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Are your calculators accurate?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our calculators use industry-standard formulas and are designed to provide helpful estimates. 
                  However, results are estimates only and should not be considered professional advice. 
                  Always consult with qualified professionals for important financial, health, or legal decisions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Is the service free to use?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, all our calculators are completely free to use. We're supported by 
                  non-intrusive advertising that helps keep the service free for everyone.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you store my calculation data?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We do not store your personal calculation inputs or financial data. All calculations are 
                  performed in your browser or processed temporarily on our servers without retention. 
                  See our Privacy Policy for complete details.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I suggest a new calculator?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely! We love hearing from users. Send us your suggestions via email, 
                  and we'll consider adding new calculators based on user demand.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CalculatorLayoutWithAds>
  );
}