import { useEffect, useRef, useState } from "react";
import type { Product } from "../types/product";
import api from "../api/api";
import type { AxiosError } from "axios";

export function useNewArrivals(){
     const scrollRef = useRef<HTMLDivElement>(null!);
     const [isDragging, setIsDragging] = useState(false);
     const [startX, setStartX] = useState(0);
     const [scrollLeft, setScrollLeft] = useState(0);
     const [canScrollLeft, setCanScrollLeft] = useState(false);
     const [canScrollRight, setCanScrollRight] = useState(true);

    const [newArrivals, setNewArrivals] = useState<Product[]>([]);
    


   useEffect(() => {
     const fetchNewArrivals = async (): Promise<void> => {
       try {
         const response = await api.get<Product[]>(
           `/api/products/new-arrivals`
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
    
    
   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
     setIsDragging(true);
     setStartX(e.pageX - scrollRef.current.offsetLeft);
     setScrollLeft(scrollRef.current.scrollLeft);
   };

   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
     if (!isDragging) return;
     const x = e.pageX - scrollRef.current.offsetLeft;
     const walk = x - startX;
     scrollRef.current.scrollLeft = scrollLeft - walk;
   };
    
   const handleMouseUpOrLeave = () => {
     setIsDragging(false);
   };

   const scroll = (direction: string) => {
     const scrollAmount = direction === "left" ? -390 : 390;
     scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
   };

   const updateScrollButtons = () => {
     const container = scrollRef.current;

     if (container) {
       const leftScroll = container.scrollLeft;
       const rightScrollable =
         container.scrollWidth > leftScroll + container.clientWidth;

       setCanScrollLeft(leftScroll > 0);
       setCanScrollRight(rightScrollable);
     }
   };

   useEffect(() => {
     const container = scrollRef.current;
     if (container) {
       container.addEventListener("scroll", updateScrollButtons);

       return () =>
         container.removeEventListener("scroll", updateScrollButtons);
     }
   }, [newArrivals]);
    
    
    return {
      scrollRef,
      newArrivals,
      isDragging,
      canScrollLeft,
      canScrollRight,
      handleMouseDown,
      handleMouseMove,
      handleMouseUpOrLeave,
      scroll,
    };
}