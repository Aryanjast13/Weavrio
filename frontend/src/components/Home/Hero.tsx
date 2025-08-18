import { Link } from "react-router";
import hero from "../../assets/hero1.jpg";
const Hero = () => {
  return (
    <section className="relative container mx-auto rounded-lg overflow-hidden">
      <img
        src={hero}
        alt="hero"
        className="w-full h-[400px] md:h-[600px] lg:h-[750px] object-cover"
      />
      <div className=" absolute inset-0 bg-black/20  flex items-center  ">
        <div className="text-left w-2xl p-6 pl-14 ">
          <h1 className="flex flex-col mb-6  ">
            <span className="text-7xl font-light text-white/80">
              Timeless Fashion
            </span>
            <span className="text-7xl font-extralight text-white/60 italic ">
              Conscious Choices
            </span>
          </h1>
          <p className="text-sm tracking-tighter md:text-xl mb-16 text-white/90">
            Sustainably designed, effortlessly worn. Our pieces are made with
            premium materials, and wardrobe that stands the test of time.
          </p>
          <Link
            className="bg-white/80 text-gray-950/70 font-normal px-10 py-4 rounded-full  text-xl"
            to={`/collections/all`}
          >
            Explore the Collections
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;

 