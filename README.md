# Malaysian Payment Gateway

A React component library for integrating Malaysian payment methods into your web applications. This library provides a simple and customizable way to add DuitNow Transfer, DuitNow QR, Touch 'n Go eWallet, and Stripe payment options to your React applications.

✅ **NEW**: Credit/debit card payment with Visa/Mastercard support via Stripe is now available!

See this in action 👉🏻 [https://mynameisaliff.co.uk](https://mynameisaliff.co.uk) <--- (Scroll to the bottom to "Let's Connect", and click "❤️ Support My Work")

If you like what you've seen in that component, do consider making a contribution there so I can improvise this component along with other web apps and sites I've built :)

## Features

- 🇲🇾 **Malaysian-focused**: Optimized for Malaysian payment methods
- 📱 **Mobile-friendly**: Properly handles app opening on both iOS and Android devices
- 🎨 **Customizable**: Easy to style and adapt to your application's design
- 📊 **Analytics-ready**: Includes Google Analytics 4 integration
- 🌏 **International support**: Includes support for Mastercard/Visa card payments and bank/eWallet apps from China, Indonesia, Singapore, Thailand, and many more
- 💳 **Stripe integration**: Process credit/debit card payments with Visa and Mastercard
- 🚩 **Feature flags**: Enable/disable features like Stripe payments and international apps

## Installation

```bash
# Clone the repository
git clone https://github.com/hithereiamaliff/malaysianpaymentgateway.git

# Navigate to the project directory
cd malaysianpaymentgateway

# Install TypeScript and type definitions
npm install typescript @types/react @types/react-dom @types/react-helmet

# Install dependencies
npm install
# or
yarn install

# Build the package
npm run build
# or
yarn build
```

## Usage

### Basic Usage

```jsx
import React from 'react';
import { PaymentButton, PaymentModal } from 'malaysian-payment-gateway';

function App() {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <div>
      <PaymentButton onClick={() => setShowModal(true)} />
      
      {showModal && (
        <PaymentModal 
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
```

### Standalone Payment Page

You can also create a standalone payment page using the components:

```jsx
import React from 'react';
import { DuitNowTransfer, DuitNowQR, TNGEWallet } from 'malaysian-payment-gateway';

function PaymentPage() {
  const [selectedMethod, setSelectedMethod] = React.useState(null);

  return (
    <div>
      <h1>Payment Methods</h1>
      
      {selectedMethod === null ? (
        <div>
          <button onClick={() => setSelectedMethod('duitnow-transfer')}>
            DuitNow Transfer
          </button>
          <button onClick={() => setSelectedMethod('duitnow-qr')}>
            DuitNow QR
          </button>
          <button onClick={() => setSelectedMethod('tng-ewallet')}>
            Touch 'n Go eWallet
          </button>
        </div>
      ) : (
        <div>
          {selectedMethod === 'duitnow-transfer' && <DuitNowTransfer />}
          {selectedMethod === 'duitnow-qr' && <DuitNowQR />}
          {selectedMethod === 'tng-ewallet' && <TNGEWallet />}
          
          <button onClick={() => setSelectedMethod(null)}>
            Back to payment methods
          </button>
        </div>
      )}
    </div>
  );
}
```

## Customization

You can customize the appearance of the components by providing your own styling:

```jsx
<PaymentButton 
  className="custom-button-class"
  buttonText="Support My Work"
/>

<PaymentModal
  className="custom-modal-class"
  title="Custom Title"
  subtitle="Custom subtitle text here"
/>
```

## Analytics Integration

The components are pre-configured to work with Google Analytics 4. You need to initialize GA4 in your application:

```jsx
import ReactGA from 'react-ga4';

// Initialize GA4 with your tracking ID
ReactGA.initialize('G-XXXXXXXXXX');

// The components will automatically track events
```

Note: The library does not initialize Google Analytics internally. You must initialize it in your application with your own tracking ID.

## Available Components

- `PaymentButton`: Button to trigger the payment modal
- `PaymentModal`: Modal with payment method selection
- `DuitNowTransfer`: Component for DuitNow Transfer payment method
- `DuitNowQR`: Component for DuitNow QR payment method
- `TNGEWallet`: Component for Touch 'n Go eWallet payment method
- `StripePayment`: Component for credit/debit card payments via Stripe

## Feature Flags

You can enable or disable certain features using the feature flags system:

```jsx
// Enable Stripe payments in your app
localStorage.setItem('featureFlags', JSON.stringify({
  STRIPE_PAYMENT: true,
  CAMBODIAN_PAYMENT_APPS: true
}));

// Check if a feature is enabled
import { hasFeatureFlag } from 'malaysian-payment-gateway';

if (hasFeatureFlag('STRIPE_PAYMENT')) {
  // Stripe payment is enabled
}
```

## International Payment Options

The library supports payment apps from multiple countries. Here's how to use the international payment options:

```jsx
import React, { useState } from 'react';
import { DuitNowQR } from 'malaysian-payment-gateway';

function InternationalPaymentExample() {
  const [selectedCountry, setSelectedCountry] = useState('');
  
  // List of supported countries
  const countries = [
    'Cambodia',
    'China',
    'Hong Kong',
    'Indonesia',
    'Philippines',
    'Mongolia',
    'Macau',
    'Singapore',
    'South Korea',
    'Thailand'
  ];

  return (
    <div className="payment-container">
      <h2>International Payment Options</h2>
      
      {/* Country selector */}
      <div className="country-selector">
        <label htmlFor="country-select">Select a country:</label>
        <select 
          id="country-select"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">-- Select Country --</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>
      
      {/* The DuitNowQR component will display payment apps for the selected country */}
      <DuitNowQR />
      
      {/* You can also implement your own UI to display international payment options */}
      {selectedCountry && (
        <div className="custom-international-payments">
          <h3>{selectedCountry} Payment Options</h3>
          {/* Implement your custom UI here */}
        </div>
      )}
    </div>
  );
}
```

The `DuitNowQR` component includes a country selector dropdown by default, allowing users to choose payment apps from different countries.

## Stripe Integration Guide

This library includes a complete Stripe payment integration with a two-step payment flow:

1. **Amount Selection**: Users first select a donation amount (preset or custom)
2. **Payment Processing**: After amount selection, users enter their payment details

### Backend Requirements

To use the Stripe integration, you'll need to set up a backend with the following endpoints:

#### Option 1: Express.js Backend

```javascript
// Required environment variables:
// - STRIPE_PUBLISHABLE_KEY
// - STRIPE_SECRET_KEY

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

// Endpoint to get Stripe publishable key
app.get('/api/stripe-config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// Endpoint to create a payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'myr' } = req.body;
    
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents/smallest currency unit
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});
```

#### Option 2: Netlify Functions

Create the following files in your Netlify Functions directory:

**stripe-config.js**:
```javascript
exports.handler = async function() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
  };
};
```

**create-payment-intent.js**:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  try {
    const { amount, currency = 'myr' } = JSON.parse(event.body);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Frontend Implementation

The StripePayment component will automatically handle:

1. Fetching the Stripe publishable key from your backend
2. Creating a payment intent when an amount is selected
3. Rendering the payment form with Stripe Elements
4. Processing the payment and showing success/error messages
5. Animated success confirmation with checkmark animation
6. Responsive design for mobile and desktop devices

### Test Cards

Use these test card numbers for development:

- **Success**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 0002

For all test cards, use:
- Any future expiration date
- Any 3-digit CVC
- Any postal code

### Environment Variables

You'll need to set these environment variables:

```
STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

For production, replace the test keys with live keys.

### Multiple API Endpoints Strategy

The implementation includes a fallback strategy for API endpoints to ensure reliability:

```javascript
// Define multiple potential API endpoints in order of preference
const apiEndpoints = [
  // Primary backend URL from environment variable
  `${import.meta.env.VITE_BACKEND_URL || ''}/api/stripe-config`, 
  // Netlify Functions direct path
  '/.netlify/functions/stripe-config',
  // Netlify redirected path
  '/api/stripe-config',
  // Fallback to direct URL (if applicable)
  'https://your-backend-url.com/api/stripe-config',
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
```

### Analytics Integration

The Stripe payment component includes Google Analytics 4 integration for tracking payment events:

```javascript
// Track successful payment
ReactGA.event({
  action: 'stripe_payment_success',
  category: 'donation',
  value: amount, // The payment amount
});

// Track payment errors
ReactGA.event({
  action: 'stripe_payment_error',
  category: 'donation',
});

// Track amount selection
ReactGA.event({
  action: 'stripe_amount_select',
  category: 'donation',
  value: selectedAmount,
});

// Track custom amount entry
ReactGA.event({
  action: 'stripe_custom_amount',
  category: 'donation',
  value: parsedAmount,
});
```

### Express Checkout Support

The implementation includes support for Express Checkout methods (Apple Pay/Google Pay):

```javascript
// Set up Payment Request for Apple Pay / Google Pay
const pr = stripe.paymentRequest({
  country: 'MY',
  currency: 'myr',
  total: {
    label: 'Your Payment Label',
    amount: amount * 100, // in cents
  },
  requestPayerName: true,
  requestPayerEmail: false,
});

// Check if Payment Request is available
pr.canMakePayment().then(result => {
  if (result) {
    setPaymentRequest(pr);
    setCanMakePayment(true);
    
    // Track that Apple Pay / Google Pay is available
    ReactGA.event({
      action: 'express_checkout_available',
      category: 'donation',
    });
  }
});
```

### Handling Webhooks (Optional)

For advanced features like subscription management or payment status updates, you can implement Stripe webhooks:

```javascript
// webhook.js (Netlify Function)
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  const sig = event.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  try {
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      endpointSecret
    );
    
    // Handle different event types
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      case 'payment_intent.payment_failed':
        // Handle failed payment
        break;
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({received: true})
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({error: error.message})
    };
  }
};
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
