// Payment app type definitions
export type PaymentApp = {
  name: string;
  appUrl: string;
  iosAppUrl?: string;
  androidAppUrl?: string;
  icon: string;
  iosAppStoreUrl: string;
  androidPlayStoreUrl: string;
  webUrl: string;
};

// Country names for international apps
export type CountryName = 
  | 'Malaysia' 
  | 'Singapore' 
  | 'Indonesia' 
  | 'Thailand' 
  | 'Philippines' 
  | 'Hong Kong' 
  | 'South Korea' 
  | 'China';

// Country apps mapping
export type CountryApps = {
  [country in CountryName]: PaymentApp[];
};

// Payment method types
export type PaymentMethod = 'duitnow-transfer' | 'duitnow-qr' | 'tng-ewallet';

// Props for the PaymentButton component
export interface PaymentButtonProps {
  className?: string;
  buttonText?: string;
  onClick?: () => void;
}

// Props for the PaymentModal component
export interface PaymentModalProps {
  className?: string;
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

// Props for the payment method components
export interface PaymentMethodComponentProps {
  className?: string;
  onBack?: () => void;
}

// Device detection type
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

// Analytics event type
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}
