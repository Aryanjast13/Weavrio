// Cart Product interface (matches your MongoDB cartItemSchema)
export interface CartProduct {
  productId: string; 
  name: string;
  image: string;
  price: number; 
  quantity: number;
  size?: string;
  color?: string;
}

// Cart interface (matches your MongoDB cartSchema)
export interface Cart {
  _id?: string; 
  user?: string; 
  products:CartProduct[],
  totalPrice: number; 
  totalItems?: number; 
  createdAt?: string; 
  updatedAt?: string; 
}

// Redux Cart State interface
export interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null | undefined;
}


// Fetch Cart Parameters
export interface FetchCartParams {
  userId?: string;
}

// Add to Cart Parameters
export interface AddToCartParams {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  userId?: string;
}

// Update Cart Item Parameters
export interface UpdateCartItemParams {
  productId: string;
  quantity: number;
  userId?: string;
  size?: string;
  color?: string;
}

// Remove from Cart Parameters
export interface RemoveFromCartParams {
  productId: string;
  userId?: string;
  size?: string;
  color?: string;
}

// Merge Cart Parameters (guest to user)
export interface MergeCartParams {
  user: string;
}


// Cart Contents Component Props
export interface CartContentsProps {
  cart: Cart;
  userId?: string;
}


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
