import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosError } from "axios";

// Types
export interface CheckoutData {
  userId?: string;
  guestId?: string;
  items: CheckoutItem[];
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  totalAmount: number;
  // add other checkout fields as per your API
}

export interface CheckoutItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface CheckoutSession {
  sessionId: string;
  paymentUrl?: string;
  orderId?: string;
  status: string;
  totalAmount: number;
  // add other response fields as per your API
}

export interface CheckoutState {
  checkout: CheckoutSession | null;
  loading: boolean;
  error: string | null;
}

// Thunk
export const createCheckout = createAsyncThunk<
  CheckoutSession,
  CheckoutData,
  { rejectValue: string }
>("checkout/createCheckout", async (checkoutData, { rejectWithValue }) => {
  try {
    const response = await axios.post<CheckoutSession>(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
      checkoutData
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create checkout";
    return rejectWithValue(String(message));
  }
});

// Initial state
const initialState: CheckoutState = {
  checkout: null,
  loading: false,
  error: null,
};

// Slice
const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    clearCheckout: (state) => {
      state.checkout = null;
      state.error = null;
    },
    resetCheckoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCheckout.fulfilled,
        (state, action: PayloadAction<CheckoutSession>) => {
          state.loading = false;
          state.checkout = action.payload; // Fixed: was setting error instead of checkout
          state.error = null;
        }
      )
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create checkout";
      });
  },
});

export const { clearCheckout, resetCheckoutError } = checkoutSlice.actions;
export default checkoutSlice.reducer;
