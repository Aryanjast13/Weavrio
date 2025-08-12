import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axios from "axios";

// Types
// CheckoutItem interface (subdocument)
export interface CheckoutItem {
  productId: string; // ObjectId as string in frontend
  name: string;
  image?: string |undefined;
  price: number;
  quantity: number;
  size?: string; // Optional
  color?: string; // Optional
} 

// Shipping Address interface
interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Main Checkout interface
export interface CheckoutData {
  _id?: string; // MongoDB ObjectId as string
  user?: string; // ObjectId as string in frontend
  checkoutItems: CheckoutItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number | undefined;
  isPaid?: boolean;
  paidAt?: Date; // Optional
  paymentStatus?: string;
  paymentDetails?: any; // Mixed type from schema
  isFinalized?: boolean;
  finalizedAt?: Date; // Optional
  createdAt?: Date; // From timestamps: true
  updatedAt?: Date; // From timestamps: true
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
//create a checkout for user
export const createCheckout = createAsyncThunk<
  CheckoutSession,
  CheckoutData,
  { rejectValue: string }
>("checkout/createCheckout", async (checkoutData, { rejectWithValue }) => {
  try {
    const response = await axios.post<CheckoutSession>(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
      checkoutData,{withCredentials:true}
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
