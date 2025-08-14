// redux/cartSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axios from "axios";

// ✅ Import all types from unified file
import type {
  AddToCartParams,
  AddToCartResponse,
  Cart,
  CartState,
  FetchCartParams,
  FetchCartResponse,
  MergeCartParams,
  RemoveFromCartParams,
  RemoveFromCartResponse,
  UpdateCartItemParams,
  UpdateCartResponse
} from "../types/cart";

// Helper functions
const loadCartFromStorage = (): Cart => {
  try {
    const storedCart = localStorage.getItem("cart");
    return storedCart
      ? (JSON.parse(storedCart) as Cart)
      : {
          products: [],
          totalPrice: 0,
        };
  } catch {
    return {
      products: [],
      totalPrice: 0,
    };
  }
};

const saveCartToStorage = (cart: Cart): void => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Async Thunks
export const fetchCart = createAsyncThunk<
  Cart,
  FetchCartParams,
  { rejectValue: string }
>("cart/fetchCart", async (params, { rejectWithValue }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.userId) queryParams.append("userId", params.userId);
    if (params.guestId) queryParams.append("guestId", params.guestId);

    const response = await axios.get<FetchCartResponse>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart?${queryParams}`,
      { withCredentials: true }
    );

    return response.data.cart;
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch cart"
    );
  }
});

export const addToCart = createAsyncThunk<
  Cart,
  AddToCartParams,
  { rejectValue: string }
>("cart/addToCart", async (params, { rejectWithValue }) => {
  try {
    const response = await axios.post<AddToCartResponse>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
      params,
      { withCredentials: true }
    );

    return response.data.cart;
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to add to cart"
    );
  }
});

export const updateCartItemQuantity = createAsyncThunk<
  Cart,
  UpdateCartItemParams,
  { rejectValue: string }
>("cart/updateCartItemQuantity", async (params, { rejectWithValue }) => {
  try {
    const response = await axios.put<UpdateCartResponse>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
      params,
      { withCredentials: true }
    );

    return response.data.cart;
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update cart"
    );
  }
});

export const removeFromCart = createAsyncThunk<
  Cart,
  RemoveFromCartParams,
  { rejectValue: string }
>("cart/removeFromCart", async (params, { rejectWithValue }) => {
  try {
    const response = await axios.delete<RemoveFromCartResponse>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/`,
      {
        data: params,
        withCredentials: true,
      }
    );

    return response.data.cart;
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to remove from cart"
    );
  }
});

export const mergeCart = createAsyncThunk<
  Cart,
  MergeCartParams,
  { rejectValue: string }
>("cart/mergeCart", async (params, { rejectWithValue }) => {
  try {
    const response = await axios.post<AddToCartResponse>(
      `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
      params,
      { withCredentials: true }
    );

    return response.data.cart;
  } catch (err) {
    const error = err as AxiosError<any>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to merge cart"
    );
  }
});

// Initial state
const initialState: CartState = {
  cart: loadCartFromStorage(),
  loading: false,
  error: null,
};

// Cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [], totalPrice: 0 };
      saveCartToStorage(state.cart);
    },
    resetCartError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch cart";
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to add to cart";
      })

      // Update Cart Item
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update cart";
      })

      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to remove from cart";
      })

      // Merge Cart
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to merge cart";
      });
  },
});

export const { clearCart, resetCartError } = cartSlice.actions;
export default cartSlice.reducer;
