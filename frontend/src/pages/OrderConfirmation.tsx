import { useEffect } from "react";
import { useNavigate } from "react-router";
import { clearCart } from "../redux/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";


const OrderConfirmation = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { checkout } = useAppSelector(state => state.checkout);

  //clear the cart when the order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);
  
  

  const calculateEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); //add 10 days to the order date
    return orderDate.toLocaleDateString();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank You for Your Order!
      </h1>

      {checkout && (
        <div className="p-6 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-20">
            {/* Order Id and Date */}
            <div>
              <h2 className="font-semibold text-xl">
                Order ID: {checkout._id}
              </h2>
              <p className="text-gray-500">
                Order date: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated delivery */}
            <div className="text-emerald-700 text-sm">
              <p>
                Estimated Delivery:{" "}
                {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div className="mb-20">
            {checkout.checkoutItems.map((item) => (
              <div key={item.prouductid} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">${item.price}</p>
                  <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
                  </div>
                  {/* Payment and Delivery */}
                  <div className="grid grid-cols-2 gap-8">
                      {/* Payment Info */}
                      <div>
                          <h4 className="text-lg font-medium mb-2">Payment</h4>
                          <p className="text-gray-600">PayPal</p>
                      </div>
                      {/* Deliver Info */}
                      <div>
                          <h4 className="text-lg font-semibold mb-2">
                              Delivery
                          </h4>
                          <p className="text-gray-600">{checkout.shippingAddress.address}</p>
                          <p className="text-gray-600">{checkout.shippingAddress.city},{" "}{checkout.shippingAddress.address}</p>
                      </div>
                  </div>
        </div>
          )}
          
    </div>
  );
};

export default OrderConfirmation;
