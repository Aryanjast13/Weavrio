// Checkout Item interface
export interface CheckoutItem {
  _id?: string;
  productId: string;
  name: string;
  image: string; // Required field - every product should have an image
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  // Optional: Add these for better tracking
  sku?: string;
  category?: string;
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

// Guest User interface
export interface GuestUser {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Order Status enum for consistency
export type CheckoutStatus =
  | "Pending"
  | "Processing"
  | "Completed"
  | "Failed"
  | "Cancelled";

// Main Checkout Data interface
export interface CheckoutData {
  _id?: string;
  user?: string; 
  checkoutItems: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string; 
  paymentStatus: string;
  paymentDetails?: PaymentDetails;
  isFinalized: boolean;
  finalizedAt?: string; 
  status?: CheckoutStatus; 
  createdAt: string;
  updatedAt: string;
}


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


// Checkout Error interface for better error handling
export interface CheckoutError {
  code: string;
  message: string;
  field?: string;
}

// Form Validation interface
export interface FormValidation {
  isValid: boolean;
  errors: Record<string, string>;
}



// Redux state interface
export interface CheckoutState {
  checkout: CheckoutData | null;
  loading: boolean;
  error: string | CheckoutError | null; // More flexible error handling
}



// Create Checkout Request interface
export interface CreateCheckoutRequest {
  checkoutItems: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  user?: string;
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

// Checkout Form Data interface
export interface CheckoutFormData
  extends Omit<CheckoutData, "_id" | "createdAt" | "updatedAt"> {
  validation?: FormValidation;
}


// Address Change Handler type
export type AddressChangeHandler = (
  field: keyof ShippingAddress,
  value: string
) => void;

// Payment Handler type
export type PaymentHandler = (paymentData: PaymentDetails) => Promise<void>;

// Checkout Step type
export type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";
