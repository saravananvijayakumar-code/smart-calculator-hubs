import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export const CookieConsent = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setShow(true), 1000);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShow(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500">
      <Card className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-2xl border-2">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Cookie Notice</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                We use cookies to enhance your browsing experience, serve personalized ads or content, 
                and analyze our traffic. We also use Google AdSense to display advertisements, which may 
                use cookies to serve ads based on your prior visits to our site. By clicking "Accept All", 
                you consent to our use of cookies.{' '}
                <a 
                  href="/privacy" 
                  className="text-blue-600 hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn more in our Privacy Policy
                </a>
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={acceptCookies}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Accept All Cookies
                </Button>
                <Button 
                  onClick={declineCookies}
                  variant="outline"
                >
                  Decline Optional Cookies
                </Button>
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline self-center"
                >
                  Manage Ad Settings
                </a>
              </div>
            </div>
            <button
              onClick={declineCookies}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              aria-label="Close cookie notice"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};
