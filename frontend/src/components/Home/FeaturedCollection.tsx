import { Link } from "react-router";
import featured from "../../assets/feature1.jpg";

const FeaturedCollection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
          <div className=" relative container mx-auto items-center bg-green-50 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
        {/* Left Content */}
        <div className="absolute top-52 p-8 text-center lg:text-left text-white ">
          <h2 className="text-8xl font-normal mb-6">
            Effortless <span className="font-extralight italic">Elegance</span>
          </h2>
          <p className="text-xl  w-3xl mb-10">
            Thoughtfully curated collections designed for modern living,
            blending timeless aesthetics with a commitment to sustainability and
            quality.
          </p>
          <Link
            to="collections/all"
            className="bg-white text-gray-950 px-10 py-5 rounded-full text-lg hover:bg-gray-800"
          >
            Explore the Collections
          </Link>
        </div>

        <div className="w-full">
          <img
            src={featured}
            alt="Featured Collection"
            className="w-full h-[750px] object-cover rounded-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
}

export default FeaturedCollection