import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { createCheckout } from "../../redux/checkoutSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { type CartState } from "../../types/cart";
// ✅ Import all types from single file
import api from "../../api/api";
import type {
  AddressChangeHandler,
  CreateCheckoutRequest,
  RazorpayOrderData,
  RazorpayResponse,
  ShippingAddress,
  UpdatePaymentRequest
} from "../../types/checkout";

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { cart, loading, error } = useAppSelector(
    (state: { cart: CartState }) => state.cart
  );
  const { user } = useAppSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isCreatingCheckout, setIsCreatingCheckout] = useState<boolean>(false);
  const [_razorpayOrder, setRazorpayOrder] = useState<any>(null);
  const [isCreatingPaymentOrder, setIsCreatingPaymentOrder] =
    useState<boolean>(false);

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

    if (cart && cart.products && cart.products.length > 0) {
      setIsCreatingCheckout(true);

      try {
        // ✅ Using proper interface
        const checkoutData: CreateCheckoutRequest = {
          checkoutItems: cart.products.map((product) => ({
            productId: product.productId,
            name: product.name,
            image: product.image,
            price: product.price,
            quantity: product.quantity,
            size: product.size,
            color: product.color,
          })),
          shippingAddress,
          paymentMethod: "Razorpay",
          totalPrice: cart.totalPrice ?? 0,
          user: user?._id,
        };

        const res = await dispatch(createCheckout(checkoutData)).unwrap();

        if (res && res._id) {
          setCheckoutId(res._id);
        }
      } catch (error) {
        console.error("Failed to create checkout:", error);
        alert("Failed to create checkout. Please try again.");
      } finally {
        setIsCreatingCheckout(false);
      }
    }
  };

  // Create Razorpay Order
  const handleCreateRazorpayOrder = async (): Promise<void> => {
    setIsCreatingPaymentOrder(true);

    try {
      const timestamp = Date.now().toString().slice(-8);
      const shortReceipt = `ord_${timestamp}`;

      // ✅ Using proper interface
      const orderData: RazorpayOrderData = {
        amount: Math.round((cart?.totalPrice ?? 0) * 100),
        currency: "INR",
        receipt: shortReceipt,
        notes: {
          checkoutId: checkoutId,
          userId: user?._id,
          customerName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          customerEmail: user?.email,
          fullReceiptInfo: `checkout_${checkoutId}_${Date.now()}`,
        },
      };

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/create-order`,
        orderData,
        { withCredentials: true }
      );

      if (response.data.success) {
        setRazorpayOrder(response.data);
        openRazorpayCheckout(response.data);
      }
    } catch (error) {
      console.error("Failed to create Razorpay order:", error);
      alert("Failed to create payment order. Please try again.");
    } finally {
      setIsCreatingPaymentOrder(false);
    }
  };

  // Open Razorpay Checkout
  const openRazorpayCheckout = (orderData: any) => {
    const options = {
      key: orderData.key_id,
      amount: orderData.order.amount,
      currency: orderData.order.currency,
      name: "Your Store Name",
      description: "Purchase from Your Store",
      order_id: orderData.order.id,
      handler: function (response: RazorpayResponse) {
        handleRazorpaySuccess(response);
      },
      prefill: {
        name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
        email: user?.email || "",
        contact: shippingAddress.phone,
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          console.log("Payment cancelled by user");
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", function (response: any) {
      console.error("Payment failed:", response.error);
      alert(`Payment failed: ${response.error.description}`);
    });

    rzp.open();
  };

  // Handle Razorpay Success
  const handleRazorpaySuccess = async (
    response: RazorpayResponse
  ): Promise<void> => {
    console.log("Payment Successful", response);

    try {
      const verificationResponse = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/payment/verify-payment`,
        response,
        { withCredentials: true }
      );

      if (verificationResponse.data.success) {
        await updateCheckoutPayment({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        });
      } else {
        throw new Error("Payment verification failed");
      }
    } catch (error) {
      console.error("Payment verification error:", error);
      alert("Payment verification failed. Please contact support.");
    }
  };

  // Update checkout with payment information
  const updateCheckoutPayment = async (paymentData: any): Promise<void> => {
    try {
      // ✅ Using proper interface
      const updateData: UpdatePaymentRequest = {
        paymentStatus: "paid",
        paymentMethod: "Razorpay",
        paymentDetails: {
          razorpay_payment_id: paymentData.paymentId,
          razorpay_order_id: paymentData.orderId,
          razorpay_signature: paymentData.signature,
          method: "Razorpay",
          verified: true,
        },
      };

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        updateData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
    }
  };

  // Finalize checkout
  const handleFinalizeCheckout = async (
    checkoutId: string | null
  ): Promise<void> => {
    if (!checkoutId) {
      console.error("No checkout ID provided");
      return;
    }

    try {
      const response = await api.post(
        `/api/checkout/${checkoutId}/finalize`,
        {},
        { withCredentials: true }
      );

      if (response.status === 201) {
        navigate("/order-confirmation", {
          state: {
            orderId: response.data.orderId,
            checkoutId: checkoutId,
          },
        });
      } else {
        console.error("Checkout finalization failed");
        alert("Order finalization failed. Please contact support.");
      }
    } catch (error) {
      console.error("Finalization error:", error);
      alert("Failed to finalize order. Please contact support.");
    }
  };

  // ✅ Using proper type
  const handleAddressChange: AddressChangeHandler = (field, value) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Rest of your component remains the same...
  // (Loading, error, and JSX sections stay identical)

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">Loading cart...</span>
      </div>
    );

  if (error)
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <div className="bg-gray-100 p-8 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
          <button
            onClick={() => navigate("/")}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section - Checkout Form */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
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

          <h3 className="text-lg mb-4">Delivery Information</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-gray-700 mb-2">
                First Name *
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
              <label htmlFor="lastName" className="block text-gray-700 mb-2">
                Last Name *
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
            <label htmlFor="address" className="block text-gray-700 mb-2">
              Address *
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
              <label htmlFor="city" className="block text-gray-700 mb-2">
                City *
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
              <label htmlFor="postalCode" className="block text-gray-700 mb-2">
                Postal Code *
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
            <label htmlFor="country" className="block text-gray-700 mb-2">
              Country *
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
            <label htmlFor="phone" className="block text-gray-700 mb-2">
              Phone *
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
                <h3 className="text-lg mb-4">Payment with Razorpay</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Secure payment with Cards, UPI, Net Banking & Wallets
                </p>

                <button
                  type="button"
                  onClick={handleCreateRazorpayOrder}
                  disabled={isCreatingPaymentOrder}
                  className={`w-full py-3 rounded transition ${
                    isCreatingPaymentOrder
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isCreatingPaymentOrder
                    ? "Processing..."
                    : `Pay ₹${cart.totalPrice?.toLocaleString()} with Razorpay`}
                </button>

                <p className="text-xs text-gray-500 mt-2 text-center">
                  Powered by Razorpay - Safe & Secure
                </p>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Right Section - Order Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t border-gray-200 py-4 mb-4">
          {cart.products.map((product, index) => (
            <div
              key={product.productId || index}
              className="flex items-start justify-between py-2 border-b border-gray-200 last:border-b-0"
            >
              <div className="flex items-start">
                <img
                  src={product.productId.images[0].url}
                  alt={product.name}
                  className="w-16 h-20 object-cover mr-4 rounded"
                />
                <div>
                  <h4 className="text-sm font-medium">{product.name}</h4>
                  <p className="text-xs text-gray-500">Size: {product.size}</p>
                  <p className="text-xs text-gray-500">
                    Color: {product.color}
                  </p>
                  <p className="text-xs text-gray-500">
                    Qty: {product.quantity}
                  </p>
                </div>
              </div>
              <p className="text-lg font-semibold">
                ₹{(product.price * product.quantity).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-lg">
            <p>Subtotal</p>
            <p>₹{cart.totalPrice?.toLocaleString()}</p>
          </div>

          <div className="flex justify-between items-center text-lg">
            <p>Shipping</p>
            <p className="text-green-600">Free</p>
          </div>

          <div className="flex justify-between items-center border-t border-gray-200 text-xl font-bold mt-4 pt-4">
            <p>Total</p>
            <p>₹{cart.totalPrice?.toLocaleString()}</p>
          </div>
        </div>

        {/* Security badges */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 SSL Secured</span>
            <span>✅ Safe Payment</span>
            <span>📱 Mobile Friendly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
