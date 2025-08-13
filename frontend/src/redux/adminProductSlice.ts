// redux/adminProductSlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axios from "axios";

// ✅ Use the unified Product interface
import type { Product, ProductUpdateData } from "../types/product";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Admin Product State using unified Product interface
export interface AdminProductState {
  products: Product[]; // ✅ Now matches your API response
  loading: boolean;
  error: string | null;
}

// For creating products - only include required fields
export interface CreateProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  material: string;
  sizes: string[];
  colors: string[];
  countInStock: number;
  sku: string;
  gender: string;
  collections: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  tags?: string[];
}

// Thunks remain the same, but now properly typed
export const fetchAdminProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("adminProducts/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Product[]>(
      `${API_URL}/api/admin/products`,
      { withCredentials: true }
    );
    return response.data; // ✅ Now properly typed
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch products";
    return rejectWithValue(String(message));
  }
});

export const createProduct = createAsyncThunk<
  Product,
  CreateProductData,
  { rejectValue: string }
>("adminProducts/createProducts", async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post<Product>(
      `${API_URL}/api/admin/products`,
      productData,
      { withCredentials: true }
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to create product";
    return rejectWithValue(String(message));
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; productData: Partial<ProductUpdateData> },
  { rejectValue: string }
>(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Product>(
        `${API_URL}/api/products/${id}`,
        productData,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError<any>;
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update product";
      return rejectWithValue(String(message));
    }
  }
);

export const deleteProduct = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("adminProducts/deleteProduct", async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/api/products/${id}`, {
      withCredentials: true,
    });
    return id;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to delete product";
    return rejectWithValue(String(message));
  }
});

// Initial state
const initialState: AdminProductState = {
  products: [],
  loading: false,
  error: null,
};

// Slice remains the same
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload; // ✅ Now properly typed
        }
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products";
      });
    // ... rest of your cases remain the same
  },
});

export default adminProductSlice.reducer;
