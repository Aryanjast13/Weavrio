import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AxiosError } from "axios";
import axios from "axios";

// Types
export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  brand: string;
  countInStock: number;
  sku: string;
  material: string;
  sizes: string[];
  colors: string[];
  images: Array<{
    url: string;
    altText: string;
  }>;
  category?: string;
  gender?: string;
  collection?: string;
  stock?: number;
  createdAt?: string;
  updatedAt?: string;
  // add other fields as per your API
}

export interface ProductFilters {
  collection?: string;
  size?: string;
  color?: string;
  gender?: string;
  minPrice?: string;
  maxPrice?: string;
  sortBy?: string;
  search?: string;
  category?: string;
  material?: string;
  brand?: string;
  limit?: string;
}

export interface FilterState {
  category: string;
  size: string;
  color: string;
  gender: string;
  brand: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  search: string;
  material: string;
  collection: string;
}

export interface ProductUpdateData {
  name?: string;
  price?: number;
  description?: string;
  category?: string;
  size?: string[];
  color?: string[];
  stock?: number;
  // add other updatable fields
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  similarProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
}

// Thunks
export const fetchProductsByFilters = createAsyncThunk<
  Product[],
  ProductFilters,
  { rejectValue: string }
>("products/fetchByFilters", async (filters, { rejectWithValue }) => {
  try {
    const {
      collection,
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
    if (collection) query.append("collection", collection);
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

    const response = await axios.get<Product[]>(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`,{withCredentials:true} // Fixed typo
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
    const response = await axios.get<Product>(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,{withCredentials:true}
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
      const response = await axios.put<Product>(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`, // Fixed URL template
        productData,{withCredentials:true}
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
    const response = await axios.get<Product[]>(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`,{withCredentials:true}
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
    maxPrice: "", // Added missing maxPrice
    sortBy: "",
    search: "",
    material: "",
    collection: "",
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
        collection: "",
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
          state.products = Array.isArray(action.payload) ? action.payload : []; // Fixed property name
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
          // Fixed action case
          state.loading = false;
          state.selectedProduct = action.payload;
        }
      )
      .addCase(fetchProductDetails.rejected, (state, action) => {
        // Fixed action case
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
          const updatedProduct = action.payload; // Fixed variable name
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
          state.similarProducts = action.payload; // Fixed: should set similarProducts, not products
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
