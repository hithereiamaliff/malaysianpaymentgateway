import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';

// This is a placeholder component for the Stripe payment integration
// In a real implementation, you would import the Stripe components and implement the full payment flow
// This component is designed to be replaced with your actual Stripe implementation

interface StripePaymentProps {
  // You can add props as needed
}

export const StripePayment: React.FC<StripePaymentProps> = () => {
  const [amount, setAmount] = useState<number>(10);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [amountSelected, setAmountSelected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Donation amounts in MYR
  const DONATION_AMOUNTS: number[] = [10, 25, 50, 100];
  
  // Handle amount selection
  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount);
    setIsCustom(false);
    setCustomAmount('');
    setAmountSelected(true);
    
    ReactGA.event({
      action: 'stripe_amount_select',
      category: 'donation',
      value: selectedAmount,
    });
  };
  
  // Handle custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setCustomAmount(value);
    }
  };
  
  // Handle custom amount submission
  const handleCustomAmountSubmit = () => {
    const parsedAmount = parseFloat(customAmount);
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      setIsCustom(true);
      setAmountSelected(true);
      
      ReactGA.event({
        action: 'stripe_custom_amount',
        category: 'donation',
        value: parsedAmount,
      });
    }
  };
  
  // Handle change amount button
  const handleChangeAmount = () => {
    setAmountSelected(false);
    setError(null);
    
    ReactGA.event({
      action: 'stripe_change_amount',
      category: 'donation',
    });
  };
  
  if (!amountSelected) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white">Select Donation Amount</h3>
        
        <div className="grid grid-cols-2 gap-3">
          {DONATION_AMOUNTS.map((amt) => (
            <button
              key={amt}
              onClick={() => handleAmountSelect(amt)}
              className={`p-3 rounded-lg font-medium text-center transition-colors
                bg-gray-800/50 hover:bg-gray-700/50 text-white border border-gray-700/50`}
            >
              RM{amt}
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
  
  return (
    <div className="p-6 bg-gray-900 border border-yellow-700/30 rounded-lg max-w-md mx-auto">
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
      
      <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 mb-4">
        <p className="text-white mb-2">
          This is a placeholder for the Stripe payment form. In a real implementation, this would be replaced with the actual Stripe Elements components.
        </p>
        <p className="text-gray-400 text-sm">
          The actual implementation would include:
        </p>
        <ul className="text-gray-400 text-sm list-disc pl-5 mt-2">
          <li>Card number input</li>
          <li>Expiration date and CVC</li>
          <li>Billing address (optional)</li>
          <li>Payment processing with 3D Secure if required</li>
        </ul>
      </div>
      
      <button
        className="w-full py-3 px-4 rounded-lg font-bold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 bg-gray-600 text-gray-400 cursor-not-allowed"
      >
        Donate RM{isCustom ? parseFloat(customAmount).toFixed(2) : amount}
      </button>
      
      <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
        <p className="text-yellow-500 text-xs font-medium mb-1">Secure Payment</p>
        <p className="text-gray-400 text-xs">
          All payments are processed securely through Stripe. Your card details are never stored on our servers.
        </p>
      </div>
    </div>
  );
};

export default StripePayment;
