import React, { useState, useEffect } from 'react';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';
import { DuitNowTransfer, DuitNowQR, TNGEWallet, StripePayment } from './components';
import ReactGA from 'react-ga4';

// Feature flags interface
export interface FeatureFlags {
  STRIPE_PAYMENT: boolean;
  CAMBODIAN_PAYMENT_APPS: boolean;
}

// Default feature flags
const DEFAULT_FEATURE_FLAGS: FeatureFlags = {
  STRIPE_PAYMENT: false,
  CAMBODIAN_PAYMENT_APPS: false
};

// Helper function to check if a feature flag is enabled
export const hasFeatureFlag = (flag: keyof FeatureFlags): boolean => {
  // Check if window exists (for SSR compatibility)
  if (typeof window === 'undefined') return false;
  
  try {
    const flags = JSON.parse(localStorage.getItem('featureFlags') || JSON.stringify(DEFAULT_FEATURE_FLAGS));
    return flags[flag] === true;
  } catch (e) {
    console.error('Error parsing feature flags:', e);
    return false;
  }
};

export type DonationMethod = 'duitnow-transfer' | 'duitnow-qr' | 'tng-ewallet' | 'stripe';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<DonationMethod | null>(null);
  const [showStripe, setShowStripe] = useState<boolean>(false);
  
  // Check if Stripe feature flag is enabled
  useEffect(() => {
    setShowStripe(hasFeatureFlag('STRIPE_PAYMENT'));
  }, []);

  // Track modal open event
  React.useEffect(() => {
    if (isOpen) {
      ReactGA.event({
        action: 'donation_modal_open',
        category: 'engagement',
      });
    }
  }, [isOpen]);

  const handleMethodSelect = (method: DonationMethod) => {
    setSelectedMethod(method);
    ReactGA.event({
      action: 'donation_method_select',
      category: 'engagement',
      label: method,
    });
  };

  const handleBack = () => {
    setSelectedMethod(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900/90 rounded-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-full transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6 overflow-y-auto">
          {selectedMethod === null ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">
                Support My Work
              </h2>
              
              <p className="text-gray-300 mb-6">
                Thank you for considering supporting my work! Your contribution helps me to continue creating better digital experiences for people like you and me.
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={() => handleMethodSelect('duitnow-transfer')}
                  className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-left transition-colors flex items-center"
                >
                  <div className="w-12 h-12 mr-4 flex-shrink-0 bg-white rounded-lg p-1 flex items-center justify-center">
                    <img 
                      src="/images/DuitNow Logos/DuitNow1.jpg" 
                      alt="DuitNow Transfer" 
                      className="max-w-full max-h-full object-contain"
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
                      src="/images/DuitNow Logos/DuitNowQR.png" 
                      alt="DuitNow QR" 
                      className="max-w-full max-h-full object-contain"
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
                      src="/images/Touch_'n_Go_eWallet.png" 
                      alt="Touch 'n Go eWallet" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">Touch 'n Go eWallet</h3>
                    <p className="text-gray-400 text-sm">Pay via Touch 'n Go eWallet</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-yellow-500" />
                </button>
                
                {showStripe && (
                  <button
                    onClick={() => handleMethodSelect('stripe')}
                    className="w-full p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-left transition-colors flex items-center"
                  >
                    <div className="w-12 h-12 mr-4 flex-shrink-0 bg-white rounded-lg p-1 flex items-center justify-center">
                      <img 
                        src="/images/Credit Debit Payment Logo/VisaMastercard logo.png" 
                        alt="Visa/Mastercard" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-medium">Credit/Debit Card</h3>
                      <p className="text-gray-400 text-sm">Pay with Visa or Mastercard</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-yellow-500" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div>
              {selectedMethod === 'duitnow-transfer' && <DuitNowTransfer />}
              {selectedMethod === 'duitnow-qr' && <DuitNowQR />}
              {selectedMethod === 'tng-ewallet' && <TNGEWallet />}
              {selectedMethod === 'stripe' && showStripe && <StripePayment />}
              
              <div className="mt-6 pt-4 border-t border-gray-800">
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
    </div>
  );
}

export default DonationModal;
