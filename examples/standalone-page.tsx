import React from 'react';
import { SEO } from '../src/components/SEO';
import ReactGA from 'react-ga4';
import { PageTransition } from '../src/components/PageTransition';
import { ArrowLeft, ArrowRight, Home } from 'lucide-react';
import { DuitNowTransfer, DuitNowQR, TNGEWallet } from '../src/components/components';

// Define the DonationMethod type locally
type DonationMethod = 'duitnow-transfer' | 'duitnow-qr' | 'tng-ewallet';
import { Link } from 'react-router-dom';

export const DonatePage: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = React.useState<DonationMethod | null>(null);

  React.useEffect(() => {
    // Track page view
    ReactGA.event({
      action: 'donate_page_view',
      category: 'page_view',
    });
    
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  // Add schema.org structured data for SEO
  React.useEffect(() => {
    // Add structured data script for SEO
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Support My Work | Donate',
      'description': 'Support my work through various payment methods including DuitNow Transfer, DuitNow QR, and Touch \'n Go eWallet.',
      'url': 'https://example.com/donate',
      'mainEntity': {
        '@type': 'DonateAction',
        'name': 'Donate to Support My Work',
        'description': 'Your contribution helps me to continue creating better digital experiences for people like you and me.',
        'potentialAction': {
          '@type': 'DonateAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://example.com/donate'
          }
        }
      }
    });
    document.head.appendChild(script);

    return () => {
      // Clean up
      document.head.removeChild(script);
    };
  }, []);

  const handleMethodSelect = (method: DonationMethod) => {
    setSelectedMethod(method);
    ReactGA.event({
      action: 'donation_method_select',
      category: 'engagement',
      label: method,
    });
    
    // Scroll to top when changing methods
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedMethod(null);
    
    // Track the back button click
    ReactGA.event({
      action: 'donation_back_click',
      category: 'navigation',
    });
    
    // Scroll to top when going back to method selection
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <SEO
        title="Support My Work | Donate"
        description="Support my work through various payment methods including DuitNow Transfer, DuitNow QR, and Touch 'n Go eWallet. Your contribution helps me to continue creating better digital experiences for people like you and me."
        keywords="donate, support, DuitNow, Touch n Go, eWallet, Malaysian payment, contribution"
        path="/donate"
        type="website"
      />
      
      <PageTransition>
        <div className="min-h-screen bg-gray-900 text-white py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
              <Link 
                to="/"
                className="flex items-center text-yellow-500 hover:text-yellow-400 transition-colors"
                onClick={() => {
                  ReactGA.event({
                    action: 'donate_page_home_click',
                    category: 'navigation',
                  });
                }}
              >
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-3xl font-bold mb-2">Support My Work</h1>
            <p className="text-gray-300 mb-8">
              Thank you for considering supporting my work! Your contribution helps me to continue creating better digital experiences for people like you and me. All payment methods are secure and support Malaysian banking apps.
            </p>

            {selectedMethod === null ? (
              <div className="space-y-4">
                <button
                  onClick={() => handleMethodSelect('duitnow-transfer')}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-left transition-colors flex items-center"
                >
                  <div className="w-12 h-12 mr-4 flex-shrink-0 bg-white rounded-lg p-1 flex items-center justify-center">
                    <img 
                      src="../assets/logos/DuitNow1.jpg" 
                      alt="DuitNow Transfer" 
                      className="max-w-full max-h-full object-contain"
                      loading="eager"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">DuitNow Transfer</h3>
                    <p className="text-gray-400 text-sm">Transfer directly to my bank account</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-yellow-500" />
                </button>
                
                <button
                  onClick={() => handleMethodSelect('duitnow-qr')}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-left transition-colors flex items-center"
                >
                  <div className="w-12 h-12 mr-4 flex-shrink-0 bg-white rounded-lg p-1 flex items-center justify-center">
                    <img 
                      src="../assets/logos/DuitNowQR.png" 
                      alt="DuitNow QR" 
                      className="max-w-full max-h-full object-contain"
                      loading="eager"
                      onError={(e) => {
                        // Fallback if the image fails to load
                        const target = e.target as HTMLImageElement;
                        console.error('Image failed to load:', target.src);
                        // Try an alternative path if the first one fails
                        target.src = '/images/DuitNowQR.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">DuitNow QR</h3>
                    <p className="text-gray-400 text-sm">Scan QR code with your banking app</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-yellow-500" />
                </button>
                
                <button
                  onClick={() => handleMethodSelect('tng-ewallet')}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-left transition-colors flex items-center"
                >
                  <div className="w-12 h-12 mr-4 flex-shrink-0 bg-white rounded-lg p-1 flex items-center justify-center">
                    <img 
                      src="../assets/logos/malaysian-apps/3 tng ewallet.png" 
                      alt="Touch 'n Go eWallet" 
                      className="max-w-full max-h-full object-contain"
                      loading="eager"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">Touch 'n Go eWallet</h3>
                    <p className="text-gray-400 text-sm">Pay via Touch 'n Go eWallet</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-yellow-500" />
                </button>
              </div>
            ) : (
              <div>
                {selectedMethod === 'duitnow-transfer' && <DuitNowTransfer />}
                {selectedMethod === 'duitnow-qr' && <DuitNowQR />}
                {selectedMethod === 'tng-ewallet' && <TNGEWallet />}
                
                <div className="mt-8">
                  <button
                    onClick={handleBack}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to payment methods
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </>
  );
};

export default DonatePage;
