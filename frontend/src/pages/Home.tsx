import GenderCollection from "../components/Home/GenderCollection"
import Hero from "../components/Home/Hero"
import NewArrivals from "../components/Home/NewArrivals"
import ProductDetails from "../components/Home/ProductDetails"

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Sellers */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      <ProductDetails />
    </div>
  );
}

export default Home