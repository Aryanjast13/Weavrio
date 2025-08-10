import axios, { AxiosError } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";

// Image interface for product images
interface ProductImage {
  url: string;
  altText: string;
}

// Main Product interface
export interface Product {
  _id?: string; // Optional for new products, required for existing ones
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  brand: string;
  material: string;
  sizes: string[];
  colors: string[];
  images: ProductImage[];
  
  // Additional common fields you might need
  category?: string;
  gender?: string;
  collection?: string;
  stock?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  sku?: string; // Stock Keeping Unit
}

const NewArrivals = () => {
  const scrollRef = useRef<HTMLDivElement>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false); 
  const [canScrollRight,setCanScrollRight] = useState(true); 


   const [newArrivals, setNewArrivals] = useState<Product[]>([]);

   useEffect(() => {
     const fetchNewArrivals = async (): Promise<void> => {
       try {
         const response = await axios.get<Product[]>(
           `${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`
         );
         setNewArrivals(response.data);
       } catch (err) {
         const error = err as AxiosError<{ message?: string }>;
         console.log(
           error.response?.data?.message ||
             error.message ||
             "Failed to fetch new arrivals"
         );
       }
     };

     fetchNewArrivals();
     
    }, []);
  const handleMouseDown = (e:React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft)
  }

  const handleMouseMove = (e:React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  }
  const handleMouseUporLeave = () => {
    setIsDragging(false);
  }


  const scroll = (direction:string) => {
    const scrollAmount = direction === "left" ? -390 : 390;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  const updateScrollButtons = () => {
    const container = scrollRef.current;
 
    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable = container.scrollWidth > leftScroll + container.clientWidth

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }

   
  }

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);


      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
     
    
  }, [newArrivals]);

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
        onMouseUp={handleMouseUporLeave}
        onMouseDownCapture={handleMouseUporLeave}
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