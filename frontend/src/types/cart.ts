// types/cart.ts

// ============================================================================
// CORE CART INTERFACES
// ============================================================================

// Cart Product interface (matches your MongoDB cartItemSchema)
export interface CartProduct {
  productId: string; // ObjectId as string in frontend
  name: string;
  image: string;
  price: number; // Changed from string to number for frontend calculations
  quantity: number;
  size?: string;
  color?: string;
}

// Cart interface (matches your MongoDB cartSchema)
export interface Cart {
  _id?: string; // MongoDB document ID
  user?: string; // ObjectId as string (optional)
  guestId?: string; // Optional for guest users
  products: CartProduct[];
  totalPrice: number; // Required field with default 0
  totalItems?: number; // Calculated field
  createdAt?: string; // From timestamps
  updatedAt?: string; // From timestamps
}

// Redux Cart State interface
export interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
}

// ============================================================================
// API PARAMETER INTERFACES
// ============================================================================

// Fetch Cart Parameters
export interface FetchCartParams {
  userId?: string;
  guestId?: string;
}

// Add to Cart Parameters
export interface AddToCartParams {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  guestId?: string;
  userId?: string;
}

// Update Cart Item Parameters
export interface UpdateCartItemParams {
  productId: string;
  quantity: number;
  guestId?: string;
  userId?: string;
  size?: string;
  color?: string;
}

// Remove from Cart Parameters
export interface RemoveFromCartParams {
  productId: string;
  guestId?: string;
  userId?: string;
  size?: string;
  color?: string;
}

// Merge Cart Parameters (guest to user)
export interface MergeCartParams {
  guestId: string;
  userId: string;
}

// ============================================================================
// COMPONENT PROPS INTERFACES
// ============================================================================

// Cart Contents Component Props
export interface CartContentsProps {
  cart: Cart;
  userId?: string;
  guestId?: string;
}

// ============================================================================
// API RESPONSE INTERFACES
// ============================================================================

// Add to Cart Response
export interface AddToCartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

// Update Cart Response
export interface UpdateCartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

// Remove from Cart Response
export interface RemoveFromCartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

// Fetch Cart Response
export interface FetchCartResponse {
  success: boolean;
  cart: Cart;
  message?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Cart Item Handler function types
export type CartItemHandler = (
  productId: string,
  delta: number,
  quantity: number,
  size?: string,
  color?: string
) => void;

export type RemoveItemHandler = (
  productId: string,
  size?: string,
  color?: string
) => void;
