import type { AxiosError } from "axios";
import axios from "axios";
import { useEffect, useState } from "react";
import FeaturedCollection from "../components/Home/FeaturedCollection";
import FeaturedSection from "../components/Home/FeaturedSection";
import GenderCollection from "../components/Home/GenderCollection";
import Hero from "../components/Home/Hero";
import NewArrivals from "../components/Home/NewArrivals";
import ProductDetails from "../components/Product/ProductDetails";
import ProductGrid from "../components/Product/ProductGrid";
import { fetchProductsByFilters } from "../redux/productsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

// Product interface (use the same from your Redux slice)
export interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  brand: string;
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

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(
    (state) => state.products
  );
  const [bestSellerProduct, setBestSellerProduct] = useState<Product | null>(
    null
  );
  const [bestSellerLoading, setBestSellerLoading] = useState<boolean>(true);
  const [bestSellerError, setBestSellerError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch products for a specific collection
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: "8", // Convert to string as expected by your Redux slice
      })
    );

    // Fetch best seller product
    const fetchBestSeller = async (): Promise<void> => {
      try {
        setBestSellerLoading(true);
        setBestSellerError(null);
        const response = await axios.get<Product>(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
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

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Sellers */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      {bestSellerLoading ? (
        <p className="text-center">Loading best seller product...</p>
      ) : bestSellerError ? (
        <p className="text-center text-red-500">Error: {bestSellerError}</p>
      ) : bestSellerProduct ? (
        <ProductDetails productId={bestSellerProduct._id} />
      ) : (
        <p className="text-center">No best seller product found</p>
      )}

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wears for Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
      <FeaturedCollection />
      <FeaturedSection />
    </div>
  );
};

export default Home;
