import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { useParams, useSearchParams } from "react-router";
import FilterSidebar from "../components/Product/FilterSidebar";
import ProductGrid from "../components/Product/ProductGrid";
import SortOptions from "../components/Product/SortOptions";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchProductsByFilters } from "../redux/productsSlice";





export const CollectionPage = () => {
  const { collection } = useParams();
  const[SearchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const { products, loading, error } = useAppSelector(state => state.products);
  const queryParams = Object.fromEntries([...SearchParams]);
    const sidebarRef = useRef<HTMLDivElement>(null!);   
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }))
    
  }, [dispatch, collection, SearchParams]);

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
        } fixed inset-y-0 z-50 left-0 w-72 px-4 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0`}
          >
          <FilterSidebar/>
      </div>


          <div className="flex-grow p-4">
              <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* Sort Options */}
        <SortOptions />
        
        {/* Product Grid  */}
        <ProductGrid products={products} loading={ loading} error={error} />
      </div>
    </div>
  ); 
}
