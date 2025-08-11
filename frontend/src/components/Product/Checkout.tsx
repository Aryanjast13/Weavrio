import axios from "axios"; // Added missing import
import { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // Fixed import
import { createCheckout } from "../../redux/checkoutSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import PayPalButton from "./PayPalButton";

// Types
interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  image: string;
  // add other product fields as needed
}

interface Cart {
  products: CartProduct[];
  totalPrice: number;
  totalItems?: number;
}

interface CheckoutData {
  checkoutItems: CartProduct[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
}

interface CheckoutResponse {
  _id: string;
  // add other response fields as needed
}

interface PaymentDetails {
  id: string;
  status: string;
  payer: {
    email_address: string;
    name: {
      given_name: string;
      surname: string;
    };
  };
  // add other PayPal response fields as needed
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState<boolean>(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Ensure cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // Fixed: Should proceed if cart HAS items, not if it's empty
    if (cart && cart.products && cart.products.length > 0) {
      setIsCreatingCheckout(true);

      try {
        const checkoutData: CheckoutData = {
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: cart.totalPrice,
        };

        const res = await dispatch(createCheckout(checkoutData)).unwrap();

        if (res && res.sessionId) {
          // Adjust based on your actual response structure
          setCheckoutId(res.sessionId);
        }
      } catch (error) {
        console.error("Failed to create checkout:", error);
        // Could add toast notification here
      } finally {
        setIsCreatingCheckout(false);
      }
    }
  };

  const handlePaymentSuccess = async (
    details: PaymentDetails
  ): Promise<void> => {
    console.log("Payment Successful", details);

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
          checkoutId,
        }
      );

      if (response.status === 200) {
        // Fixed: response.status instead of Response.status
        await handleFinalizeCheckout(checkoutId);
      } else {
        console.error("Payment update failed");
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  const handleFinalizeCheckout = async (
    checkoutId: string | null
  ): Promise<void> => {
    if (!checkoutId) {
      console.error("No checkout ID provided");
      return;
    }

    try {
      const response = await axios.post(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutId}/finalize`,
        {}
      );

      if (response.status === 200) {
        navigate("/order-confirmation");
      } else {
        console.error("Checkout finalization failed");
      }
    } catch (error) {
      console.error("Finalization error:", error);
    }
  };

  const handleAddressChange = (
    field: keyof ShippingAddress,
    value: string
  ): void => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Loading state
  if (loading) return <p>Loading cart...</p>; // Fixed typo

  // Error state
  if (error) return <p>Error: {error}</p>;

  // Empty cart
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded bg-gray-100"
              disabled
            />
          </div>

          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                value={shippingAddress.firstName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleAddressChange("firstName", e.target.value)
                }
                className="w-full p-2 border rounded focus:outline-none focus:border-black"
                required
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                value={shippingAddress.lastName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleAddressChange("lastName", e.target.value)
                }
                className="w-full p-2 border rounded focus:outline-none focus:border-black"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={shippingAddress.address}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAddressChange("address", e.target.value)
              }
              className="w-full p-2 border rounded focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-gray-700">
                City
              </label>
              <input
                id="city"
                type="text"
                value={shippingAddress.city}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleAddressChange("city", e.target.value)
                }
                className="w-full p-2 border rounded focus:outline-none focus:border-black"
                required
              />
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-gray-700">
                Postal Code
              </label>
              <input
                id="postalCode"
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleAddressChange("postalCode", e.target.value)
                }
                className="w-full p-2 border rounded focus:outline-none focus:border-black"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="country" className="block text-gray-700">
              Country
            </label>
            <input
              id="country"
              type="text"
              value={shippingAddress.country}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAddressChange("country", e.target.value)
              }
              className="w-full p-2 border rounded focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              value={shippingAddress.phone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleAddressChange("phone", e.target.value)
              }
              className="w-full p-2 border rounded focus:outline-none focus:border-black"
              required
            />
          </div>

          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={isCreatingCheckout}
                className={`w-full py-3 rounded transition ${
                  isCreatingCheckout
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {isCreatingCheckout
                  ? "Creating Checkout..."
                  : "Continue to Payment"}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with PayPal</h3>
                <PayPalButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                  onError={(err: any) => {
                    console.error("PayPal error:", err);
                    alert("Payment failed. Please try again.");
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t border-gray-200 py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={product._id || index} // Use product ID if available
              className="flex items-start justify-between py-2 border-b border-gray-200"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                  <p className="text-gray-500">Qty: {product.quantity}</p>
                </div>
              </div>
              <p className="text-xl">
                ${(product.price * product.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>${cart.totalPrice?.toLocaleString()}</p>
        </div>

        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 text-lg mt-4 pt-4">
          <p className="font-semibold">Total</p>
          <p className="font-semibold">${cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
