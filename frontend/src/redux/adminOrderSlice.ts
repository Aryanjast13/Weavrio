import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axios from "axios";


interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Types
interface Order {
  _id: string;
  user: {
    id: string,
    name: string,
    email?:string,
  };
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  paymentStatus: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}
export interface AdminOrderState {
  orders: Order[];
  totalOrders: number;
  totalSales: number;
  loading: boolean;
  error: string | null;
}

// API response types - Fixed to be more specific
interface FetchOrdersResponse {
  orders: Order[]; // Made required since we expect this field
  // adjust based on your actual API response structure
}

// Alternative if your API sometimes returns direct array
type OrdersApiResponse = FetchOrdersResponse | Order[];

// Thunks
export const fetchAllOrders = createAsyncThunk<
  Order[],
  void,
  { rejectValue: string }
>("adminOrders/fetchAllOrders", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<OrdersApiResponse>(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`, {withCredentials:true}
    );

    // Better type-safe handling
    if (Array.isArray(response.data)) {
      return response.data; // Direct array response
    } else {
      return response.data.orders || []; // Object with orders property
    }
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch orders";
    return rejectWithValue(String(message));
  }
});

export const updateOrderStatus = createAsyncThunk<
  Order,
  { id: string; status: string },
  { rejectValue: string }
>(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Order>(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },{withCredentials:true}
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update order";
      return rejectWithValue(String(message));
    }
  }
);

export const deleteOrder = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminOrders/deleteOrder", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,{withCredentials:true}
    );
    return id;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete order";
    return rejectWithValue(String(message));
  }
});

// Initial state
const initialState: AdminOrderState = {
  orders: [],
  totalOrders: 0,
  totalSales: 0,
  loading: false,
  error: null,
};

// Slice
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {
    // Added utility reducers for better state management
    clearOrders: (state) => {
      state.orders = [];
      state.totalOrders = 0;
      state.totalSales = 0;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.loading = false;
          state.orders = action.payload;
          state.totalOrders = action.payload.length;
          // Calculate total sales
          state.totalSales = action.payload.reduce((acc, order) => {
            return acc + order.totalPrice;
          }, 0);
          state.error = null; // Clear any previous errors
        }
      )
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch orders";
      })
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateOrderStatus.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          const updatedOrder = action.payload;
          const orderIndex = state.orders.findIndex(
            (order) => order._id === updatedOrder._id
          );
          if (orderIndex !== -1) {
            state.orders[orderIndex] = updatedOrder;
            // Recalculate totals after update
            state.totalSales = state.orders.reduce(
              (acc, order) => acc + order.totalPrice,
              0
            );
          }
          state.error = null;
        }
      )
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update order";
      })
      // Delete Order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteOrder.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.orders = state.orders.filter(
            (order) => order._id !== action.payload
          );
          state.totalOrders = state.orders.length;
          // Recalculate total sales after deletion
          state.totalSales = state.orders.reduce(
            (acc, order) => acc + order.totalPrice,
            0
          );
          state.error = null;
        }
      )
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete order";
      });
  },
});

export const { clearOrders, clearError } = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
