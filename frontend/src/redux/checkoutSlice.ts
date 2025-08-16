// redux/checkoutSlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

// ✅ Import all types from single file
import api from "../api/api";
import type {
  CheckoutData,
  CheckoutState,
  CreateCheckoutRequest
} from "../types/checkout";

// Thunk - Create a checkout for user
export const createCheckout = createAsyncThunk<
  CheckoutData,
  CreateCheckoutRequest,
  { rejectValue: string }
>("checkout/createCheckout", async (checkoutData, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/api/checkout`,
      checkoutData,
      
    );


    console.log(response.data);
    // Return the checkout data with _id included
    return {
      ...response.data,
      _id: response.data._id,
    } as CheckoutData;
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
        (state, action: PayloadAction<CheckoutData>) => {
          state.loading = false;
          state.checkout = action.payload;
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
