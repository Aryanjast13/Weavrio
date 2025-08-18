import { useState } from "react";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { Link } from "react-router";
import { useAppSelector } from "../../../../redux/store";
import CartDrawer from "../CartDrawer";
import SearchBar from "./SearchBar";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false)
  const { cart } = useAppSelector(state => state.cart);
  const { user } = useAppSelector(state => state.auth);

  const cartItemCount = cart?.products?.reduce((total, product) => total + product.quantity, 0) || 0;

   const handleDrawerToggle = () => {
     setDrawerOpen(!drawerOpen);
   };
  
  const toggleNavBar = () => {
  
    setNavDrawerOpen(!navDrawerOpen);
  }


  return (
    <>
      <nav className="container mx-auto flex-between  py-4  ">
        {/* Left Logo */}
        <div>
          <Link className="text-2xl font-medium" to="/">
            Weavrio
          </Link>
        </div>
        {/* Center - Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>
        {/* Right iconse */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black/90 px-2 rounded-md text-sm text-white py-1"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-red-800">
            <HiOutlineUser className="w-6 h-6 text-gray-700 " />
          </Link>
          <button
            onClick={handleDrawerToggle}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="w-6 h-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 bg-primary text-white  text-xs rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          {/* Search Button */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          <button onClick={toggleNavBar} className="md:hidden">
            <HiBars3BottomRight className="w-6 h-6" />
          </button>
        </div>
      </nav>
      <CartDrawer
        drawerOpen={drawerOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      {/* Mobile Navigation  */}
      <div
        className={`fixed top-0 left-0 bg-white w-3/4 sm:w-1/2 md:w-1/3 h-full shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavBar}>
            <IoMdClose className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-4" onClick={toggleNavBar}>
            <Link
              to="/collections/all?gender=Men"
              className="block text-gray-600 "
            >
              Men
            </Link>
            <Link
              to="/collections/all?gender=Women"
              className="block text-gray-600 "
            >
              Women
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              className="block text-gray-600 "
            >
              Top Wear
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              className="block text-gray-600"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default NavBar