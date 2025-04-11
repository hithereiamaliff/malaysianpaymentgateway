# Malaysian Payment Gateway

A React component library for integrating Malaysian payment methods into your web applications. This library provides a simple and customizable way to add DuitNow Transfer, DuitNow QR, and Touch 'n Go eWallet payment options to your React applications.

*Note: Credit/debit card payment with Visa/Mastercard support is coming soon.*

See this in action 👉🏻 [https://mynameisaliff.co.uk](https://mynameisaliff.co.uk) <--- (Scroll to the bottom to "Let's Connect", and click "❤️ Support My Work")

If you like what you've seen in that component, do consider making a contribution there so I can improvise this component along with other web apps and sites I've built :)

## Features

- 🇲🇾 **Malaysian-focused**: Optimized for Malaysian payment methods
- 📱 **Mobile-friendly**: Properly handles app opening on both iOS and Android devices
- 🎨 **Customizable**: Easy to style and adapt to your application's design
- 📊 **Analytics-ready**: Includes Google Analytics 4 integration
- 🌏 **International support**: Includes support for international payment apps

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

## License

MIT © [Your Name]
