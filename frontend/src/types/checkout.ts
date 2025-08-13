// types/checkout.ts

// ============================================================================
// CORE INTERFACES
// ============================================================================

// Checkout Item interface
export interface CheckoutItem {
  _id?: string;
  productId: string;
  name: string;
  image: string | undefined; // Required field
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

// Shipping Address interface
export interface ShippingAddress {
  firstName: string; // Required for checkout form
  lastName: string; // Required for checkout form
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string; // Required for checkout form
}

// Payment Details interface
export interface PaymentDetails {
  razorpay_payment_id?: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
  method?: string;
  verified?: boolean;
  amount?: number;
  currency?: string;
  status?: string;
}

// Main Checkout Data interface
export interface CheckoutData {
  _id?: string;
  user?: string; // Optional for guest checkout
  guestId?: string; // For guest users
  checkoutItems: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string; // ISO string from API
  paymentStatus: string;
  paymentDetails?: PaymentDetails;
  isFinalized: boolean;
  finalizedAt?: string; // ISO string from API
  createdAt?: string; // ISO string from API
  updatedAt?: string; // ISO string from API
}

// ============================================================================
// RAZORPAY INTERFACES
// ============================================================================

// Razorpay Response interface
export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

// Razorpay Order Data interface
export interface RazorpayOrderData {
  amount: number;
  currency: string;
  receipt: string;
  notes: {
    checkoutId?: string | null;
    userId?: string;
    customerName?: string;
    customerEmail?: string;
    fullReceiptInfo?: string;
  };
}

// Razorpay Options interface
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

// Global Window interface for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

// ============================================================================
// REDUX STATE INTERFACES
// ============================================================================

// Redux state interface
export interface CheckoutState {
  checkout: CheckoutData | null;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// API REQUEST/RESPONSE INTERFACES
// ============================================================================

// Create Checkout Request interface
export interface CreateCheckoutRequest {
  checkoutItems: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  user?: string;
  guestId?: string;
}

// Create Checkout Response interface
export interface CreateCheckoutResponse {
  success: boolean;
  _id: string; // For setting checkoutId
  checkout?: CheckoutData;
  message?: string;
}

// Update Payment Request interface
export interface UpdatePaymentRequest {
  paymentStatus: string;
  paymentMethod: string;
  paymentDetails: PaymentDetails;
}



// Address Change Handler type
export type AddressChangeHandler = (
  field: keyof ShippingAddress,
  value: string
) => void;

