# Malaysian Payment Gateway

A React component library for integrating Malaysian payment methods into your web applications. This library provides a simple and customizable way to add DuitNow Transfer, DuitNow QR, Touch 'n Go eWallet, and Stripe payment options to your React applications.

✅ **NEW**: Full Stripe integration with multiple payment methods:
- **Credit/Debit Cards** (Visa, Mastercard)
- **FPX** (Malaysian bank account holders only)
- **GrabPay** (Available in Malaysia and Singapore)
- **Apple Pay** & **Google Pay** (Express Checkout)

See this in action 👉🏻 [https://mynameisaliff.co.uk/donate](https://mynameisaliff.co.uk/donate)

If you like what you've seen in that component, do consider making a contribution there so I can improvise this component along with other web apps and sites I've built :)

## ⚠️ Important: Backend Requirement

**This library requires a self-hosted backend server to function.** The Stripe payment components need backend endpoints to:
- Provide the Stripe publishable key
- Create payment intents
- Handle webhook events (optional but recommended)

You must create your own backend following the API specifications below.

## Features

- 🇲🇾 **Malaysian-focused**: Optimized for Malaysian payment methods
- 📱 **Mobile-friendly**: Properly handles app opening on both iOS and Android devices
- 🎨 **Customizable**: Easy to style and adapt to your application's design
- 📊 **Analytics-ready**: Includes Google Analytics 4 integration
- 🌏 **International support**: Includes support for Mastercard/Visa card payments and bank/eWallet apps from China, Indonesia, Singapore, Thailand, and many more
- 💳 **Stripe integration**: Full payment processing with Card, FPX (Malaysian Online Banking), GrabPay, Apple Pay, and Google Pay
- 🍎 **Express Checkout**: Apple Pay and Google Pay support for faster payments
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

#### Required Backend Endpoints

Your backend must implement these three endpoints:

**1. GET `/api/stripe-config`** - Returns Stripe publishable key
```javascript
app.get('/api/stripe-config', (req, res) => {
  res.json({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
  });
});
```

**2. POST `/api/create-payment-intent`** - Creates a payment intent
```javascript
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency = 'myr' } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount), // Amount in smallest currency unit (cents/sen)
    currency,
    payment_method_types: ['card', 'fpx', 'grabpay'], // For MYR
    metadata: {
      type: 'donation',
      source: 'website'
    }
  });
  
  res.json({ 
    clientSecret: paymentIntent.client_secret 
  });
});
```

**3. POST `/api/webhook`** - Handles Stripe webhook events (optional)
```javascript
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(
    req.body, 
    sig, 
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  // Handle events like payment_intent.succeeded
  res.json({received: true});
});
```

#### Complete Backend Example

Here's a complete Express.js backend implementation:

```javascript
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const rateLimit = require('express-rate-limit');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['POST', 'GET', 'OPTIONS'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

app.use(express.json());

// Get Stripe publishable key
app.get('/api/stripe-config', (req, res) => {
  res.json({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY 
  });
});

// Create payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  const { amount, currency = 'myr' } = req.body;
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency,
    payment_method_types: ['card', 'fpx', 'grabpay'],
    metadata: {
      type: 'donation',
      source: 'website'
    }
  });
  
  res.json({ clientSecret: paymentIntent.client_secret });
});

// Webhook handler
app.post('/api/webhook', 
  express.raw({type: 'application/json'}), 
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    // Handle events
    if (event.type === 'payment_intent.succeeded') {
      console.log('Payment succeeded:', event.data.object.id);
    }
    
    res.json({received: true});
  }
);

app.listen(3001, () => console.log('Server running on port 3001'));
```

**Recommended Features**:
- Origin verification (CORS protection)
- Rate limiting
- Multiple payment methods (Card, FPX, GrabPay)
- Webhook handling
- Docker deployment support

#### Alternative: Netlify Functions

If you prefer serverless deployment, you can use Netlify Functions:

**netlify/functions/stripe-config.js**:
```javascript
exports.handler = async function() {
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
    })
  };
};
```

**netlify/functions/create-payment-intent.js**:
```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async function(event) {
  const { amount, currency = 'myr' } = JSON.parse(event.body);
  
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency,
    payment_method_types: ['card', 'fpx', 'grabpay']
  });
  
  return {
    statusCode: 200,
    body: JSON.stringify({ clientSecret: paymentIntent.client_secret })
  };
};
```

**Note**: Netlify Functions have cold start delays. For better performance, consider using a dedicated backend server.

### Frontend Implementation

The StripePayment component will automatically handle:

1. Fetching the Stripe publishable key from your backend
2. Creating a payment intent when an amount is selected
3. Rendering Express Checkout (Apple Pay/Google Pay) when available
4. Rendering PaymentElement with Card, FPX, and GrabPay tabs
5. Processing the payment and handling redirects (for FPX/GrabPay)
6. Animated success confirmation with checkmark animation
7. Responsive design for mobile and desktop devices

### Test Payment Methods

Use these test credentials for development:

#### Test Cards
- **Success**: 4242 4242 4242 4242
- **Requires Authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 0002

For all test cards, use:
- Any future expiration date
- Any 3-digit CVC
- Any postal code

#### Test FPX
In test mode, select any bank from the FPX dropdown. You'll be redirected to a test page where you can simulate success or failure.

#### Test GrabPay
In test mode, GrabPay will redirect to a test page where you can simulate the payment result.

### Environment Variables

#### Backend Environment Variables

Your backend server needs:

```bash
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_PUBLISHABLE_KEY=pk_test_51...  # Safe to expose to frontend
STRIPE_SECRET_KEY=sk_test_51...       # NEVER expose to frontend
STRIPE_WEBHOOK_SECRET=whsec_...       # For webhook signature verification

# CORS Configuration
CLIENT_URL=http://localhost:5173      # Your frontend URL

# Server Configuration
PORT=3001                              # Backend server port
```

#### Frontend Environment Variables

Your frontend needs:

```bash
# Backend API URL
VITE_BACKEND_URL=http://localhost:3001  # Development
# VITE_BACKEND_URL=https://api.yourdomain.com  # Production
```

**Security Notes**:
- ✅ `STRIPE_PUBLISHABLE_KEY` - Safe to expose (starts with `pk_`)
- ❌ `STRIPE_SECRET_KEY` - NEVER expose to frontend (starts with `sk_`)
- ❌ `STRIPE_WEBHOOK_SECRET` - Keep on backend only

For production, replace test keys (`pk_test_`, `sk_test_`) with live keys (`pk_live_`, `sk_live_`).

### Backend Deployment Options

You can deploy your backend using various platforms:

#### Option 1: VPS with Docker (Recommended)

Create a `Dockerfile` for your backend:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["node", "index.js"]
```

Build and run:
```bash
docker build -t payment-backend .
docker run -p 3001:3001 --env-file .env payment-backend
```

**Deployment platforms**:
- DigitalOcean Droplets
- AWS EC2
- Linode
- EasyPanel (Docker orchestration)

#### Option 2: Platform-as-a-Service

**Railway**:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway up
```

**Render**:
- Connect your GitHub repo
- Set environment variables in dashboard
- Auto-deploys on push

**Heroku**:
```bash
heroku create your-payment-backend
git push heroku main
```

#### Option 3: Serverless (Netlify/Vercel)

See the Netlify Functions example above. Note: Serverless has cold start delays.

### API Endpoint Fallback Strategy

The StripePayment component tries multiple endpoints automatically:

```javascript
const apiEndpoints = [
  `${import.meta.env.VITE_BACKEND_URL}/api/stripe-config`,  // Primary
  '/.netlify/functions/stripe-config',                      // Netlify
  '/api/stripe-config',                                     // Proxied
  'http://localhost:3001/api/stripe-config'                 // Local dev
];
```

This ensures the component works across different deployment scenarios.

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

The implementation includes support for Express Checkout methods (Apple Pay/Google Pay) using Stripe's `ExpressCheckoutElement`:

```jsx
import { ExpressCheckoutElement } from '@stripe/react-stripe-js';

// Inside your payment form component
<ExpressCheckoutElement
  onConfirm={async () => {
    // Handle express checkout confirmation
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate?payment_status=success`,
      },
      redirect: 'if_required',
    });
    
    if (error) {
      // Handle error
    } else {
      // Payment successful
    }
  }}
  options={{
    buttonType: {
      applePay: 'donate',
      googlePay: 'donate',
    },
  }}
/>
```

**Apple Pay Domain Verification Required**:

Apple Pay requires your domain to be verified with Apple through Stripe before it will appear as a payment option:

1. Go to [Stripe Dashboard > Settings > Payment Methods](https://dashboard.stripe.com/settings/payment_methods)
2. Click on **Apple Pay** 
3. Click **Add Domain** under "Web Domains"
4. Enter your production domain (e.g., `mynameisaliff.co.uk`)
5. Download the verification file provided by Stripe
6. Host the verification file at: `https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association`
7. Click **Verify** in Stripe Dashboard

**For Netlify/Static Hosting**:
- Place the file in your `public/.well-known/` directory
- Ensure your build process copies it to the output directory
- The file should be accessible without authentication

**Testing Apple Pay**:
- Must use Safari browser on iOS/macOS
- Must have Apple Pay set up in Wallet with at least one card
- Must be on HTTPS (localhost works for testing)
- Domain verification is required for production

**Google Pay**: Works in test mode without additional setup.

### Stripe Webhooks (Recommended for Production)

Webhooks allow Stripe to notify your backend about payment events:

#### 1. Set up webhook endpoint in your backend

```javascript
app.post('/api/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('Payment succeeded:', event.data.object.id);
      // Update database, send confirmation email, etc.
      break;
    case 'payment_intent.payment_failed':
      console.log('Payment failed:', event.data.object.id);
      // Notify user, log for investigation
      break;
  }
  
  res.json({received: true});
});
```

#### 2. Configure webhook in Stripe Dashboard

1. Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.processing`
5. Copy the webhook signing secret to your `.env` file

#### 3. Test webhooks locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3001/api/webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

## Payment Methods Summary

| Payment Method | Type | Redirect Required | Notes | Backend Setup |
|----------------|------|-------------------|-------|---------------|
| Card | Direct | No | Supports 3D Secure | Enabled by default |
| FPX | Bank Transfer | Yes | Malaysian banks only | Enable in Stripe Dashboard |
| GrabPay | E-Wallet | Yes | Available in Malaysia and Singapore | Enable in Stripe Dashboard |
| Apple Pay | Express | No | Requires HTTPS + domain verification | Automatic if available |
| Google Pay | Express | No | Works in test mode | Automatic if available |

### Enabling FPX and GrabPay

1. Go to [Stripe Dashboard > Settings > Payment Methods](https://dashboard.stripe.com/settings/payment_methods)
2. Enable **FPX** and **GrabPay**
3. Complete any required verification steps
4. Update your backend to include these methods in `payment_method_types`:

```javascript
payment_method_types: ['card', 'fpx', 'grabpay']
```

## Backend Security Best Practices

### Origin Verification (CORS)

Implement strict origin verification to protect your backend:

```javascript
const verifyOrigin = (req, res, next) => {
  const origin = req.get('origin') || req.get('referer');
  
  if (origin) {
    const hostname = new URL(origin).hostname;
    
    // Only allow your domain and localhost
    if (
      hostname === 'yourdomain.com' ||
      hostname === 'localhost' ||
      hostname === '127.0.0.1'
    ) {
      return next();
    }
  }
  
  return res.status(403).json({ error: 'Access denied' });
};

// Apply to protected endpoints
app.get('/api/stripe-config', verifyOrigin, (req, res) => { ... });
app.post('/api/create-payment-intent', verifyOrigin, (req, res) => { ... });
```

### Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
```

### Key Security Rules

- ❌ **NEVER** expose `STRIPE_SECRET_KEY` in frontend code
- ❌ **NEVER** commit `.env` files to Git
- ✅ Use environment variables for all sensitive credentials
- ✅ The publishable key (`pk_`) is safe to expose
- ✅ Always verify webhook signatures in production
- ✅ Use HTTPS in production (required for Apple Pay)
- ✅ Implement origin verification to prevent unauthorized API access
- ✅ Add rate limiting to prevent abuse

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
