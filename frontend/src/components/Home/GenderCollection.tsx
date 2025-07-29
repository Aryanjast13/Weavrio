import { Link } from "react-router"
import menCollection from "../../assets/mens-collection.webp"
import womenCollection from "../../assets/womens-collection.webp"

 
const GenderCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women collection */}
        <div className="relative flex-1">
          <img
            src={womenCollection}
            alt="menCollectionImage"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute left-8 bottom-8 bg-white/90 p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        {/* Men collection */}
        <div className="relative flex-1">
          <img
            src={menCollection}
            alt="menCollectionImage"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute left-8 bottom-8 bg-white/90 p-4">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GenderCollection