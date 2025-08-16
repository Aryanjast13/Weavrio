import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import type { Product } from "../types/product";
import { fetchCart } from "../redux/cartSlice";
import { fetchProductsByFilters } from "../redux/productsSlice";
import type { AxiosError } from "axios";
import api from "../api/api";

export function useHomeData() {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  const { user } = useAppSelector((state) => state.auth);
  const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(
    null
  );
  const [bestSellerLoading, setBestSellerLoading] = useState<boolean>(true);
  const [bestSellerError, setBestSellerError] = useState<string | null>(null);
  const userId = user ? user?._id : undefined;

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
    if (userId) {
      dispatch(fetchCart({ userId }));
    }

    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: "8", // Convert to string as expected by your Redux slice
      })
    );

    fetchBestSeller();
  }, [dispatch, userId]);
    
    
    return {
      products,
      loading,
      error,
      bestSellerProduct,
      bestSellerLoading,
      bestSellerError,
    };
}