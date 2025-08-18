import { Link } from "react-router";
import menCollection from "../../assets/men1.jpg";
import womenCollection from "../../assets/women1.jpg";

 
const GenderCollection = () => {
  return (
    <section className="py-10 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women collection */}
        <div className="relative flex-1 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <img
            src={womenCollection}
            alt="menCollectionImage"
            className="w-full h-[800px] object-cover"
          />
          <div className="absolute left-8 bottom-8 bg-white/80 rounded-full px-10 py-6">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
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
        <div className="relative flex-1 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <img
            src={menCollection}
            alt="menCollectionImage"
            className="w-full h-[800px] object-cover"
          />
          <div className="absolute left-8 bottom-8 bg-white/80 px-10 py-6 rounded-full">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
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