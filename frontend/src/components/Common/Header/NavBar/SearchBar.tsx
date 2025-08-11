import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router";
import { fetchProductsByFilters, setFilters } from "../../../../redux/productsSlice";
import { useAppDispatch } from "../../../../redux/store";

const SearchBar = () => {
   const [searchData,setSearchData] = useState("")
    const [isCartOpen, setIsCartOpen] = useState(false);
  const dispatch = useAppDispatch()
  const navigate = useNavigate();

    const handleSearchToggle = () => {
        setIsCartOpen(!isCartOpen);
    }
    
    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(setFilters({search:searchData}))
      dispatch(fetchProductsByFilters({ search: searchData }))
      navigate(`/collections/all?seacrh=${searchData}`)
      setIsCartOpen(false);
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchData(e.target.value);
   }

  return (
      <div className={`flex-center  w-full  transition-all duration-300  ${isCartOpen ?"absolute top-0 left-0 bg-white h-24 z-50":"w-auto" }`}>
          {isCartOpen ? <form onSubmit={handleSearch} className="relative  flex-center w-full">
              <div className="relative w-1/2">
                  <input type="text" value={searchData} onChange={onChange } placeholder="
                 Search"  className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700" />
                   {/* Search icon */}
                  <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                      <HiMagnifyingGlass className="w-6 h-6"/>
                 </button>
              </div>
                {/* close Button */}
              <button type="button" onClick={handleSearchToggle} className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                  <HiMiniXMark className="w-6 h-6"/>
              </button>
          </form> : (<button>
          <HiMagnifyingGlass className="w-6 h-6"  onClick={handleSearchToggle}/>
      </button>) }</div>
  )
}

export default SearchBar