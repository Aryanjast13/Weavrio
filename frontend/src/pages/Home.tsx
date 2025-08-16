import FeaturedCollection from "../components/Home/FeaturedCollection";
import FeaturedSection from "../components/Home/FeaturedSection";
import GenderCollection from "../components/Home/GenderCollection";
import Hero from "../components/Home/Hero";
import NewArrivals from "../components/Home/NewArrivals";
import ProductDetails from "../components/Product/ProductDetails";
import ProductGrid from "../components/Product/ProductGrid";
import { useHomeData } from "../hooks/useHomeData";

const Home: React.FC = () => {
  const {
    products,
    loading,
    error,
    bestSellerError,
    bestSellerProduct,
    bestSellerLoading,
  } = useHomeData();

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
