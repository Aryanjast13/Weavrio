import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";

const NewArrivals = () => {
  const scrollRef = useRef<HTMLDivElement>(null!);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false); 
  const [canScrollRight,setCanScrollRight] = useState(true); 


  const newArrivals = [
    {
      id: "1",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=1",
          altText: "Stylish Jacket",
        },
      ],
    },
    {
      id: "2",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=2",
          altText: "Stylish Jacket",
        },
      ],
    },
    {
      id: "3",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=3",
          altText: "Stylish Jacket",
        },
      ],
    },
    {
      id: "4",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=4",
          altText: "Stylish Jacket",
        },
      ],
    },
    {
      id: "5",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=5",
          altText: "Stylish Jacket",
        },
      ],
    },
    {
      id: "6",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=6",
          altText: "Stylish Jacket",
        },
      ],
    },
    {
      id: "7",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=7",
          altText: "Stylish Jacket",
        },
      ],
    },
    {
      id: "8",
      name: "Stylsih Jacket",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/300/?random=8",
          altText: "Stylish Jacket",
        },
      ],
    },
  ];

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

    console.log({
      scrollLeft: container.scrollLeft,
      clientWidth: container.clientWidth,
      containerScrollWidth: container.scrollWidth,
      offsetLeft:container.offsetLeft,
    })
  }

   useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);


      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
     
    
  },[])

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
            key={product.id}
            className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
              src={product.images[0].url}
              alt={product.images[0].altText}
              className="w-full h-[31rem] object-cover rounded-md  "
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 right-0   backdrop-blur-md text-white p-4 rounded-b-lg">
              <Link to={`/product/${product.id}`} className="block text-start">
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