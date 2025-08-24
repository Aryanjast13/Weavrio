// redux/orderSlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

// ✅ Import all types from unified file
import api from "../api/api";
import type { Order, OrderDetails, OrderState } from "../types/order";

// Thunks
export const fetchUserOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("order/fetchUserOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<Order[]>(
      `/api/orders/my-orders`,
      
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch orders";
    return rejectWithValue(String(message));
  }
});

export const fetchOrderDetails = createAsyncThunk<
  OrderDetails,
  string,
  { rejectValue: string }
>("order/fetchOrderDetails", async (orderId, { rejectWithValue }) => {
  try {
    const response = await api.get<OrderDetails>(
      `/api/orders/${orderId}`,
      
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch order details";
    return rejectWithValue(String(message));
  }
});

// Initial state
const initialState: OrderState = {
  orders: [],
  totalOrders: 0,
  orderDetails: null,
  loading: false,
  error: null,
};

// Slice
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderDetails: (state) => {
      state.orderDetails = null;
      state.error = null;
    },
    resetOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
          state.totalOrders = action.payload.length;
          state.error = null;
        }
      )
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch orders";
      })
      // Fetch Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderDetails.fulfilled,
        (state, action: PayloadAction<OrderDetails>) => {
          state.loading = false;
          state.orderDetails = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch order details";
      });
  },
});

export const { clearOrderDetails, resetOrderError } = orderSlice.actions;
export default orderSlice.reducer;
