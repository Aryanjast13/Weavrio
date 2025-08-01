import FeaturedCollection from "../components/Home/FeaturedCollection"
import FeaturedSection from "../components/Home/FeaturedSection"
import GenderCollection from "../components/Home/GenderCollection"
import Hero from "../components/Home/Hero"
import NewArrivals from "../components/Home/NewArrivals"
import ProductDetails from "../components/Home/ProductDetails"
import ProductGrid from "../components/Home/ProductGrid"

 const placeholderProducts = [
   {
     _id: 1,
     name: "Product 1",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=3",
         altText: "image2",
       },
     ],
   },
   {
     _id: 2,
     name: "Product 2",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=4",
         altText: "image3",
       },
     ],
   },
   {
     _id: 3,
     name: "Product 3",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=5",
         altText: "image4",
       },
     ],
   },
   {
     _id: 4,
     name: "Product 4",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=6",
         altText: "image2",
       },
     ],
   },
   {
     _id: 5,
     name: "Product 5",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=3",
         altText: "image2",
       },
     ],
   },
   {
     _id: 6,
     name: "Product 6",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=4",
         altText: "image3",
       },
     ],
   },
   {
     _id: 7,
     name: "Product 7",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=5",
         altText: "image4",
       },
     ],
   },
   {
     _id: 8,
     name: "Product 8",
     price: 100,
     images: [
       {
         url: "https://picsum.photos/500/500?random=6",
         altText: "image2",
       },
     ],
   },
 ];

const Home = () => {
  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Sellers */}
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      <ProductDetails />

      <div className="container mx-auto">
        <h2 className="text-3xl text-center font-bold mb-4">Top Wears for Women
        </h2>
        <ProductGrid products={placeholderProducts} />
      </div>
      <FeaturedCollection />
      <FeaturedSection/>
    </div>
  );
}

export default Home