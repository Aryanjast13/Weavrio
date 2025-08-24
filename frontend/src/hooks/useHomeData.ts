import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import api from "../api/api";
import { fetchProductsByFilters } from "../redux/productsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import type { Product } from "../types/product";

export function useHomeData() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
 
  const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(
    null
  );
  const [bestSellerLoading, setBestSellerLoading] = useState<boolean>(true);
  const [bestSellerError, setBestSellerError] = useState<string | null>(null);

  // Fetch best seller product
  const fetchBestSeller = async (): Promise<void> => {
    try {
      setBestSellerLoading(true);
      setBestSellerError(null);
      const response = await api.get<Product>(
        `/api/products/best-seller`
      );
      setBestSellerProduct(response.data);
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch best seller";
      setBestSellerError(errorMessage);
      console.error("Error fetching best seller:", errorMessage);
    } finally {
      setBestSellerLoading(false);
    }
  };

    
    
  useEffect(() => {
    

    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: "8", // Convert to string as expected by your Redux slice
      })
    );

    fetchBestSeller();
  }, [dispatch, ]);
    
    
    return {
      products,
      loading,
      error,
      bestSellerProduct,
      bestSellerLoading,
      bestSellerError,
    };
}