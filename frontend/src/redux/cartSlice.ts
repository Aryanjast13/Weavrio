import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axios from "axios";

// Types
export interface CartProduct {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  imageUrl?: string;
  // add other product fields as per your API
}

export interface Cart {
  products: CartProduct[];
  totalItems?: number;
  totalPrice?: number;
  userId?: string;
  guestId?: string;
}

export interface CartState {
  cart: Cart;
  loading: boolean;
  error: string | null;
}

// Helper functions
const loadCartFromStorage = (): Cart => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? (JSON.parse(storedCart) as Cart) : { products: [] };
  } catch {
    return { products: [] };
  }
};

const saveCartToStorage = (cart: Cart): void => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Thunk parameter types
interface FetchCartParams {
  userId?: string;
  guestId?: string;
}

interface AddToCartParams {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  guestId?: string;
  userId?: string;
}

interface UpdateCartItemParams {
  productId: string;
  quantity: number;
  guestId?: string;
  userId?: string;
  size?: string;
  color?: string;
}

interface RemoveFromCartParams {
  productId: string;
  guestId?: string;
  userId?: string;
  size?: string;
  color?: string;
}

interface MergeCartParams {
  guestId: string;
  user: string;
}

// Thunks
export const fetchCart = createAsyncThunk<
  Cart,
  FetchCartParams,
  { rejectValue: string }
>("cart/fetchCart", async ({ userId, guestId }, { rejectWithValue }) => {
  try {
    const response = await axios.get<Cart>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
      {
        params: { userId, guestId },
      }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to fetch cart";
    return rejectWithValue(String(message));
  }
});

export const addToCart = createAsyncThunk<
  Cart,
  AddToCartParams,
  { rejectValue: string }
>(
  "cart/addToCart",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<Cart>(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, size, color, guestId, userId }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add to cart";
      return rejectWithValue(String(message));
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk<
  Cart,
  UpdateCartItemParams,
  { rejectValue: string }
>(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, guestId, userId, size, color },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put<Cart>(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, quantity, guestId, userId, size, color }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update cart";
      return rejectWithValue(String(message));
    }
  }
);

export const removeFromCart = createAsyncThunk<
  Cart,
  RemoveFromCartParams,
  { rejectValue: string }
>(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, { rejectWithValue }) => {
    try {
      const response = await axios.delete<Cart>(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          data: { productId, guestId, userId, size, color },
        }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to remove item";
      return rejectWithValue(String(message));
    }
  }
);

export const mergeCart = createAsyncThunk<
  Cart,
  MergeCartParams,
  { rejectValue: string }
>("cart/mergeCart", async ({ guestId, user }, { rejectWithValue }) => {
  try {
    const response = await axios.post<Cart>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
      { guestId, user }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message || error.message || "Failed to merge cart";
    return rejectWithValue(String(message));
  }
});

// Initial state
const initialState: CartState = {
  cart: loadCartFromStorage(),
  loading: false,
  error: null,
};

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState, // Fixed typo
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart"); // Fixed extra parentheses
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch cart";
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add to cart";
      })
      // Update cart item quantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCartItemQuantity.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        }
      )
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update cart";
      })
      // Remove from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFromCart.fulfilled,
        (state, action: PayloadAction<Cart>) => {
          state.loading = false;
          state.cart = action.payload;
          saveCartToStorage(action.payload);
        }
      )
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to remove item";
      })
      // Merge cart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
