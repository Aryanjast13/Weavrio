import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { AxiosError } from "axios";

const API_URL = `${import.meta.env.VITE_BACKEND_URL}`;

// Types
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl?: string;
  // add other product fields as per your API
}

export interface ProductData {
  name: string;
  price: number;
  description: string;
  category: string;
  stock: number;
  imageUrl?: string;
  // add other fields needed for create/update
}

export interface AdminProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// Thunks
export const fetchAdminProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("adminProducts/fetchProducts", async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get<Product[]>(
      `${API_URL}/api/admin/products`
    );
    return response.data;
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
  ProductData,
  { rejectValue: string }
>("adminProducts/createProducts", async (productData, { rejectWithValue }) => {
  try {
    const response = await axios.post<Product>(
      `${API_URL}/api/admin/products`,
      productData
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
  { id: string; productData: Partial<ProductData> },
  { rejectValue: string }
>(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put<Product>(
        `${API_URL}/api/admin/products/${id}`,
        productData
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
    await axios.delete(`${API_URL}/api/admin/products/${id}`);
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

// Slice
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState, // Fixed typo
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAdminProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = action.payload;
        }
      )
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products";
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.push(action.payload);
        }
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create product";
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const index = state.products.findIndex(
            (product) => product._id === action.payload._id
          );
          if (index !== -1) {
            state.products[index] = action.payload;
          }
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update product";
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.products = state.products.filter(
            (product) => product._id !== action.payload
          );
        }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete product";
      });
  },
});

export default adminProductSlice.reducer;
