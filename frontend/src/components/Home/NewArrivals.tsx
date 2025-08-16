import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";
import { useNewArrivals } from "../../hooks/useNewArrivals";


const NewArrivals = () => {
    const {
      scrollRef,
      newArrivals,
      isDragging,
      canScrollLeft,
      canScrollRight,
      handleMouseDown,
      handleMouseMove,
      handleMouseUpOrLeave,
      scroll,
    } = useNewArrivals();


  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-16 relative">
        <h2 className="text-3xl mb-4 font-bold">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-10">
          Discover the latest styles straight off the runway, freshly added to
          keep your wardrobe on the cutting edge of fashion.
        </p>

        {/* Scroll buttons */}
        <div className="absolute right-0 bottom-[-44px] flex space-x-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${
              canScrollLeft
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`p-2 rounded border ${
              canScrollRight
                ? "bg-white text-black"
                : "bg-gray-200 text-gray-400"
            }`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Scrolable content */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseDownCapture={handleMouseUpOrLeave}
        className={`scrollbar-hide   container mx-auto overflow-x-scroll  flex space-x-6 relative ${
          isDragging ? "cursor-grabbing" : "cursor-grab "
        }`}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
              src={product.images[0].url}
              alt={product.images[0].altText}
              className="w-full h-[31rem] object-cover rounded-md  "
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 right-0   backdrop-blur-md text-white p-4 rounded-b-lg">
              <Link to={`/product/${product._id}`} className="block text-start">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">{product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default NewArrivals;