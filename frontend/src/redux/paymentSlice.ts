// redux/paymentSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface PaymentState {
  loading: boolean;
  order: any;
  error: string | null;
}

// Create Razorpay Order
export const createRazorpayOrder = createAsyncThunk(
  "payment/createOrder",
  async (
    orderData: { amount: number; receipt: string; notes?: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
        orderData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to create order"
      );
    }
  }
);

// Verify Payment
export const verifyRazorpayPayment = createAsyncThunk(
  "payment/verifyPayment",
  async (paymentData: any, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
        paymentData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Payment verification failed"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    order: null,
    error: null,
  } as PaymentState,
  reducers: {
    clearPaymentState: (state) => {
      state.loading = false;
      state.order = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRazorpayOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRazorpayOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createRazorpayOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
