import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import FilterSidebar from "../components/Product/FilterSidebar";
import ProductGrid from "../components/Product/ProductGrid";
import SortOptions from "../components/Product/SortOptions";

interface images{
    url: string;
    altText: string;
}

interface productState{
    _id: number,
    name: string,
    price: number,
    images:images[]
}

export const CollectionPage = () => {
    const [products, setProducts] = useState<productState[]>([]);
    const sidebarRef = useRef<HTMLDivElement>(null!);   
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    }
    const handleClickOutside = (e:MouseEvent) => {
        //Close sidebar if clicked outside
        if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
            setIsSidebarOpen(false);
        }
    }

    useEffect(() => {
        //add Event listner for clciks
      document.addEventListener("mousedown", handleClickOutside);
      

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    })
 
    useEffect(() => {
        setTimeout(() => {
            const fetchedProducts = [
              {
                _id: 1,
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
                _id: 2,
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
                _id: 3,
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
                _id: 4,
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
                _id: 5,
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
                _id: 6,
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
                _id: 7,
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
                _id: 8,
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
              
                setProducts(fetchedProducts);
        }, 1000)
    }, []);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter button */}
      <button onClick={toggleSidebar} className="lg:hidden border p-2 flex-center">
        <FaFilter className="mr-2" />
        Filters
      </button>

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
          >
          <FilterSidebar/>
      </div>


          <div className="flex-grow p-4">
              <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* Sort Options */}
        <SortOptions />
        
        {/* Product Grid  */}
        <ProductGrid  products={products}/>
      </div>
    </div>
  ); 
}
