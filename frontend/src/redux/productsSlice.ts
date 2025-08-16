// redux/productSlice.ts
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";

// ✅ Import all types from unified file
import api from "../api/api";
import type {
  FilterState,
  Product,
  ProductFilters,
  ProductUpdateData,
  ProductsState,
} from "../types/product";

// Thunks
export const fetchProductsByFilters = createAsyncThunk<
  Product[],
  ProductFilters,
  { rejectValue: string }
>("products/fetchByFilters", async (filters, { rejectWithValue }) => {
  try {
    const {
      collections,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = filters;

    const query = new URLSearchParams();
    if (collections) query.append("collection", collections);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    const response = await api.get<Product[]>(
      `/api/products?${query.toString()}`,
     
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

export const fetchProductDetails = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchProductDetails", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get<Product>(
      `/api/products/${id}`,
      
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch product details";
    return rejectWithValue(String(message));
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { id: string; productData: ProductUpdateData },
  { rejectValue: string }
>(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await api.put<Product>(
        `/api/products/${id}`,
        productData,
      
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

export const fetchSimilarProducts = createAsyncThunk<
  Product[],
  { id: string },
  { rejectValue: string }
>("products/fetchSimilarProducts", async ({ id }, { rejectWithValue }) => {
  try {
    const response = await api.get<Product[]>(
      `/api/products/similar/${id}`,
      
    );
    return response.data;
  } catch (err) {
    const error = err as AxiosError<any>;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to fetch similar products";
    return rejectWithValue(String(message));
  }
});

// Initial state
const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  similarProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    size: "",
    color: "",
    gender: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    search: "",
    material: "",
    collections: "",
  },
};

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FilterState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collections: "",
      };
    },
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching products by filters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductsByFilters.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.products = Array.isArray(action.payload) ? action.payload : [];
        }
      )
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch products";
      })
      // Handle fetching single product details
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchProductDetails.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch product details";
      })
      // Handle updating products
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          const updatedProduct = action.payload;
          const index = state.products.findIndex(
            (product) => product._id === updatedProduct._id
          );
          if (index !== -1) {
            state.products[index] = updatedProduct;
          }
          // Also update selectedProduct if it's the same product
          if (
            state.selectedProduct &&
            state.selectedProduct._id === updatedProduct._id
          ) {
            state.selectedProduct = updatedProduct;
          }
        }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update product";
      })
      // Handle fetch similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSimilarProducts.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.loading = false;
          state.similarProducts = action.payload;
        }
      )
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch similar products";
      });
  },
});

export const { setFilters, clearFilters, clearSelectedProduct } =
  productsSlice.actions;
export default productsSlice.reducer;
