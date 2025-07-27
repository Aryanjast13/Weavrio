import hero from "../../assets/hero.webp";
const Hero = () => {
  return (
      <section className="relative">
          <img src={hero} alt="hero" className="w-full h-[400px] md:h-[600px] lg:h-[750] object-cover" />
      <div className=" absolute inset-0 bg-black/5  flex-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-">Vacation <br />Ready</h1>
          <p className="text-sm tracking-tighter mg:text-lg mb-6">Explore our vacation-ready outfits with fast worldwide shipping.</p>
        </div>
          </div>
    </section>
  )
}

export default Hero;

 