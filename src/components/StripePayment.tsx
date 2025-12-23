import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

// Create a wrapper component to handle the Stripe initialization and amount selection
const StripeWrapper: React.FC = () => {
  // Donation amounts in MYR
  const DONATION_AMOUNTS: number[] = [10, 25, 50, 100];
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripePromise, setStripePromise] = useState<Promise<any> | null>(null);
  
  // Amount selection states
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [amountSelected, setAmountSelected] = useState<boolean>(false);
  
  // Payment intent states - must be declared before any returns
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentError, setPaymentIntentError] = useState<string | null>(null);

  // Fetch Stripe publishable key from backend
  const fetchPublishableKey = async () => {
    setIsLoading(true);
    try {
      // Define multiple potential API endpoints in order of preference
      // Replace these with your actual backend URLs
      const apiEndpoints = [
        // Primary backend URL from environment variable
        `${import.meta.env.VITE_BACKEND_URL || ''}/api/stripe-config`, 
        // Netlify Functions direct path
        '/.netlify/functions/stripe-config',
        // Netlify redirected path
        '/api/stripe-config',
        // Local development
        'http://localhost:3001/api/stripe-config'
      ];
      
      // Try each endpoint until one works
      let response = null;
      
      for (const endpoint of apiEndpoints) {
        try {
          console.log(`Attempting to fetch Stripe config from: ${endpoint}`);
          response = await fetch(endpoint);
          if (response.ok) {
            console.log(`Successfully connected to: ${endpoint}`);
            break; // Exit the loop if successful
          }
        } catch (err) {
          console.warn(`Failed to connect to ${endpoint}:`, err);
          // Continue to the next endpoint
        }
      }
      
      // If no endpoint worked
      if (!response || !response.ok) {
        throw new Error('Failed to fetch Stripe configuration from all available endpoints.');
      }
      
      const { publishableKey } = await response.json();
      
      if (!publishableKey) {
        throw new Error('Stripe publishable key not available');
      }
      
      console.log('Successfully retrieved Stripe publishable key');
      setStripePromise(loadStripe(publishableKey));
    } catch (err: any) {
      console.error('Error fetching Stripe config:', err);
      setError('Error connecting to payment service. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle amount selection
  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setIsCustom(false);
    setCustomAmount('');
    setAmountSelected(true);
    
    // Only fetch Stripe key after amount is selected
    fetchPublishableKey();

    ReactGA.event({
      action: 'stripe_amount_select',
      category: 'donation',
      value: selectedAmount,
    });
  };

  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
    setIsCustom(true);

    ReactGA.event({
      action: 'stripe_custom_amount',
      category: 'donation',
    });
  };

  // Handle custom amount submission
  const handleCustomAmountSubmit = () => {
    if (customAmount && parseFloat(customAmount) > 0) {
      setAmountSelected(true);
      // Only fetch Stripe key after amount is selected
      fetchPublishableKey();
    }
  };

  // Reset amount selection to choose a different amount
  const handleChangeAmount = () => {
    setAmountSelected(false);
    setStripePromise(null);
    setError(null);
  };

  // Create payment intent when amount is selected and Stripe is loaded
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const chargeAmount = isCustom ? parseFloat(customAmount) : amount;
        
        if (isNaN(chargeAmount) || chargeAmount <= 0) {
          return;
        }

        // Replace these with your actual backend URLs
        const apiEndpoints = [
          `${import.meta.env.VITE_BACKEND_URL || ''}/api/create-payment-intent`,
          '/.netlify/functions/create-payment-intent',
          '/api/create-payment-intent',
          'http://localhost:3001/api/create-payment-intent'
        ];
        
        const payload = {
          amount: Math.round(chargeAmount * 100),
          currency: 'myr',
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            source: 'website_donation',
            amount_original: chargeAmount.toString(),
          }
        };
        
        let response = null;
        let responseText = '';
        
        for (const apiUrl of apiEndpoints) {
          try {
            console.log(`Attempting to create payment intent using: ${apiUrl}`);
            response = await fetch(apiUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
            
            responseText = await response.text();
            
            if (response.ok) {
              console.log(`Successfully created payment intent using: ${apiUrl}`);
              break;
            }
          } catch (error) {
            console.warn(`Failed to connect to ${apiUrl}:`, error);
          }
        }
        
        if (!response || !response.ok) {
          throw new Error('Failed to create payment intent.');
        }
        
        const data = JSON.parse(responseText);
        console.log('Payment intent created:', data);
        setClientSecret(data.clientSecret);
      } catch (error: any) {
        console.error('Error creating payment intent:', error);
        setPaymentIntentError('Unable to initialize payment. Please try again.');
      }
    };

    if (amountSelected && stripePromise) {
      createPaymentIntent();
    }
  }, [amountSelected, stripePromise, amount, customAmount, isCustom]);

  // Early returns after all hooks are declared
  if (!amountSelected) {
    return (
      <div className="p-6 bg-gray-900 border border-yellow-700/30 rounded-lg max-w-md mx-auto my-10">
        <h2 className="text-2xl font-bold text-white mb-4">Select Donation Amount</h2>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          {DONATION_AMOUNTS.map((donationAmount: number) => (
            <button
              key={donationAmount}
              onClick={() => handleAmountSelect(donationAmount)}
              className={`py-2 px-4 rounded-md text-white font-medium
                bg-yellow-700 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500`}
            >
              RM{donationAmount}
            </button>
          ))}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-white mb-3">
            Or enter Custom Amount (MYR) below
          </label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0">
            <input
              type="text"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="Enter amount"
              className="w-full sm:flex-1 p-2 border rounded-md sm:rounded-r-none focus:ring-yellow-500 focus:border-yellow-500 bg-gray-800 text-white border-gray-700"
            />
            <button
              onClick={handleCustomAmountSubmit}
              disabled={!customAmount || parseFloat(customAmount) <= 0}
              className={`w-full sm:w-auto py-2 px-4 rounded-md sm:rounded-l-none text-white font-medium
                ${(!customAmount || parseFloat(customAmount) <= 0)
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-yellow-700 hover:bg-yellow-600'}
              `}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 border border-yellow-700/30 rounded-lg max-w-md mx-auto my-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Donation: RM{isCustom ? customAmount : amount}
          </h2>
          <button
            onClick={handleChangeAmount}
            className="text-sm text-yellow-500 hover:text-yellow-400"
          >
            Change amount
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-4">Loading Payment System</h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-yellow-700 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-yellow-700 rounded-full animate-pulse delay-150"></div>
          <div className="w-4 h-4 bg-yellow-700 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  if (error || !stripePromise) {
    return (
      <div className="p-6 bg-gray-900 border border-red-700/30 rounded-lg max-w-md mx-auto my-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Donation: RM{isCustom ? customAmount : amount}
          </h2>
          <button
            onClick={handleChangeAmount}
            className="text-sm text-yellow-500 hover:text-yellow-400"
          >
            Change amount
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-red-400 mb-4">Payment Error</h3>
        <p className="text-gray-300 mb-4">{error || 'Unable to load payment system. Please try again later.'}</p>
        <button
          onClick={fetchPublishableKey}
          className="w-full py-2 px-4 bg-yellow-700 hover:bg-yellow-600 text-white rounded-md font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (paymentIntentError) {
    return (
      <div className="p-6 bg-gray-900 border border-red-700/30 rounded-lg max-w-md mx-auto my-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Donation: RM{isCustom ? customAmount : amount}
          </h2>
          <button
            onClick={handleChangeAmount}
            className="text-sm text-yellow-500 hover:text-yellow-400"
          >
            Change amount
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-red-400 mb-4">Payment Error</h3>
        <p className="text-gray-300 mb-4">{paymentIntentError}</p>
        <button
          onClick={() => {
            setPaymentIntentError(null);
            fetchPublishableKey();
          }}
          className="w-full py-2 px-4 bg-yellow-700 hover:bg-yellow-600 text-white rounded-md font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="p-6 bg-gray-900 border border-yellow-700/30 rounded-lg max-w-md mx-auto my-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Donation: RM{isCustom ? customAmount : amount}
          </h2>
          <button
            onClick={handleChangeAmount}
            className="text-sm text-yellow-500 hover:text-yellow-400"
          >
            Change amount
          </button>
        </div>
        
        <h3 className="text-lg font-bold text-white mb-4">Preparing Payment...</h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 bg-yellow-700 rounded-full animate-pulse"></div>
          <div className="w-4 h-4 bg-yellow-700 rounded-full animate-pulse delay-150"></div>
          <div className="w-4 h-4 bg-yellow-700 rounded-full animate-pulse delay-300"></div>
        </div>
      </div>
    );
  }

  // Stripe Elements options
  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#ca8a04',
        colorBackground: '#1f2937',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
        borderRadius: '8px',
      },
      rules: {
        '.Input': {
          backgroundColor: '#374151',
          border: '1px solid #4b5563',
        },
        '.Input:focus': {
          border: '1px solid #ca8a04',
          boxShadow: '0 0 0 1px #ca8a04',
        },
      }
    },
  };

  return (
    <div className="p-6 bg-gray-900 border border-yellow-700/30 rounded-lg max-w-md mx-auto my-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">
          Donation: RM{isCustom ? customAmount : amount}
        </h2>
        <button
          onClick={handleChangeAmount}
          className="text-sm text-yellow-500 hover:text-yellow-400"
        >
          Change amount
        </button>
      </div>
      
      <Elements stripe={stripePromise} options={elementsOptions}>
        <StripePaymentForm 
          initialAmount={isCustom ? parseFloat(customAmount) : amount} 
          isCustomAmount={isCustom}
          customAmountValue={customAmount}
        />
      </Elements>
    </div>
  );
};

// The checkout form component that handles payment processing
interface StripePaymentFormProps {
  initialAmount: number;
  isCustomAmount: boolean;
  customAmountValue: string;
}

const StripePaymentForm: React.FC<StripePaymentFormProps> = ({ 
  initialAmount, 
  isCustomAmount, 
  customAmountValue 
}) => {
  const [amount] = useState<number>(initialAmount);
  const [customAmount] = useState<string>(customAmountValue);
  const [isCustom] = useState<boolean>(isCustomAmount);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [isPaymentElementReady, setIsPaymentElementReady] = useState<boolean>(false);

  const stripe = useStripe();
  const elements = useElements();

  // Handle form submission with PaymentElement
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    // Get the actual amount to charge
    const chargeAmount = isCustom ? parseFloat(customAmount) : amount;

    // Validate amount
    if (isNaN(chargeAmount) || chargeAmount <= 0) {
      setPaymentError('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setPaymentError(null);

    try {
      console.log('Confirming payment...');
      
      // Use confirmPayment with PaymentElement - handles all payment methods
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate?payment_status=success`,
        },
        redirect: 'if_required', // Only redirect for payment methods that require it (FPX, GrabPay)
      });
      
      console.log('Payment confirmation result:', { error, paymentIntent });

      if (error) {
        // Handle specific error types
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setPaymentError(error.message || 'Payment failed. Please check your details.');
        } else {
          setPaymentError('An unexpected error occurred. Please try again.');
        }
        
        ReactGA.event({
          action: 'stripe_payment_error',
          category: 'donation',
          label: error.type,
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Track successful payment
        ReactGA.event({
          action: 'stripe_payment_success',
          category: 'donation',
          value: chargeAmount,
        });

        setPaymentSuccess(true);
      } else if (paymentIntent && paymentIntent.status === 'processing') {
        // Payment is processing (common for FPX)
        setPaymentSuccess(true);
        ReactGA.event({
          action: 'stripe_payment_processing',
          category: 'donation',
          value: chargeAmount,
        });
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'An error occurred while processing your payment. Please try again.');

      ReactGA.event({
        action: 'stripe_payment_error',
        category: 'donation',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!paymentSuccess ? (
        <>
          {/* Express Checkout - Apple Pay and Google Pay */}
          <ExpressCheckoutElement
            onConfirm={async () => {
              const chargeAmount = isCustom ? parseFloat(customAmount) : amount;
              
              setIsProcessing(true);
              
              const { error: submitError } = await elements!.submit();
              if (submitError) {
                setPaymentError(submitError.message || 'Payment failed');
                setIsProcessing(false);
                return;
              }

              const { error } = await stripe!.confirmPayment({
                elements: elements!,
                confirmParams: {
                  return_url: `${window.location.origin}/donate?payment_status=success`,
                },
                redirect: 'if_required',
              });

              if (error) {
                setPaymentError(error.message || 'Payment failed');
                ReactGA.event({
                  action: 'stripe_express_payment_error',
                  category: 'donation',
                  label: error.type,
                });
              } else {
                setPaymentSuccess(true);
                ReactGA.event({
                  action: 'stripe_express_payment_success',
                  category: 'donation',
                  value: chargeAmount,
                });
              }
              
              setIsProcessing(false);
            }}
            options={{
              buttonType: {
                applePay: 'donate',
                googlePay: 'donate',
              },
            }}
          />

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-900 text-gray-400">Or pay with</span>
            </div>
          </div>

          {/* Payment Element - Shows Card, FPX, GrabPay options */}
          <div className="mt-2">
            <p className="text-white font-medium mb-3">Choose Payment Method</p>
            <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  paymentMethodOrder: ['card', 'fpx', 'grabpay'],
                  defaultValues: {
                    billingDetails: {
                      name: 'Donation',
                    }
                  }
                }}
                onReady={() => setIsPaymentElementReady(true)}
                onChange={(e) => {
                  if (e.complete) {
                    setPaymentError(null);
                  }
                }}
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">
              Card, FPX (Malaysian Online Banking), and GrabPay are available.
            </p>
          </div>
          
          {/* Display payment errors */}
          {paymentError && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {paymentError}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || !elements || isProcessing || !isPaymentElementReady}
            className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${(!stripe || !elements || isProcessing || !isPaymentElementReady) 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-yellow-700 hover:bg-yellow-600 text-white'}`}
          >
            {isProcessing ? 'Processing...' : `Donate RM${isCustom ? parseFloat(customAmount || '0').toFixed(2) : amount}`}
          </button>

          {/* Secure Payment Notice */}
          <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            <p className="text-yellow-500 text-xs font-medium mb-1">Secure Payment</p>
            <p className="text-gray-400 text-xs">
              All payments are processed securely through Stripe. Your payment details are never stored on our servers.
            </p>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4 animate-bounce">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
                style={{
                  strokeDasharray: 100,
                  strokeDashoffset: 0,
                  animation: 'checkmarkDraw 1s ease-in-out',
                }}
              />
            </svg>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes checkmarkDraw {
              0% { stroke-dasharray: 100; stroke-dashoffset: 100; }
              100% { stroke-dasharray: 100; stroke-dashoffset: 0; }
            }
          `}} />
          <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-gray-300">
            Your donation has been processed successfully. Your support means a lot!
          </p>
        </div>
      )}
    </form>
  );
};

// Main component that wraps everything
export const StripePayment: React.FC = () => {
  return <StripeWrapper />;
};

export default StripePayment;
