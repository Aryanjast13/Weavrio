// types/product.ts - Updated to match your API response

export interface Product {
  _id: string;
  name: string;
  price: number;
  dicountPrice?: number;
  description: string;
  brand: string;
  countInStock: number;
  sku: string;
  material: string;
  sizes: string[];
  colors: string[];
  images: Array<{
    url: string;
    altText?: string;
  }>;
  category: string;
  gender: string;
  collections: string; // ✅ Singular, matches your API
  // New fields from your API response
  isFeatured: boolean;
  isPublished: boolean;
  numReviews: number;
  rating: number;
  tags: string[];
  user: string; // User ID who created the product
  __v: number; // MongoDB version field
  createdAt: string;
  updatedAt: string;
}

// Keep the other interfaces as they are
export interface ProductFilters {
  collections?: string; // ✅ Updated to match API
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
  collections: string; // ✅ Updated to match API
}

export interface ProductUpdateData {
  name: string;
  price: number;
  images: Array<{
    url: string;
    altText?: string;
  }>;
  description: string;
  sku: string;
  category: string;
  brand: string;
  material: string;
  sizes: string[];
  colors: string[];
  countInStock: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  gender: string;
  collections: string;
  tags?: string[];
}

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  similarProducts: Product[];
  loading: boolean;
  error: string | null;
  filters: FilterState;
}
