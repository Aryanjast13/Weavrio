import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../redux/store";
import CartContents from "../../Cart/CartContents";

interface Props{
  drawerOpen: boolean;
  handleDrawerToggle: () => void;
}


const CartDrawer = ({ drawerOpen, handleDrawerToggle }: Props) => {
  const navigate = useNavigate()
  const {user,guestId } = useAppSelector(state => state.auth);
  const { cart} = useAppSelector(state => state.cart);
  const userId = user ? user?._id : null;

  const handleCheckout = () => {
    handleDrawerToggle();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
    
  }
  

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      } `}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={handleDrawerToggle}>
          <IoMdClose className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      {/* Cart Content with scrollable area */}
      <div className="flex-grow p-4  overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>
        {/* Component for Cart content */}
        {cart && cart?.products?.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your cart is empty</p>
        )}
      </div>

      {/* checkout button fixed at the bottom */}

      <div className="p-4 bg-white sticky bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>

            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, taxes and discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer