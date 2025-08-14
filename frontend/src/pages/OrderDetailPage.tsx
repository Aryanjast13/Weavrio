import React, { useEffect } from "react";
import { Link, useParams } from "react-router";
import { fetchOrderDetails } from "../redux/orderSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

import type { OrderState, OrderItem} from "../types/order";

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // ✅ Properly typed selector
  const { orderDetails, loading, error } = useAppSelector(
    (state: { orders: OrderState }) => state.orders
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  // Helper functions
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toFixed(2)}`;
  };

  const formatDate = (date: string | Date): string => {
    try {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading)
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <Link
            to="/my-orders"
            className="text-red-600 hover:underline mt-2 inline-block"
          >
            ← Back to My Orders
          </Link>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Order Details</h2>

      {!orderDetails ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No Order details found</p>
          <Link
            to="/my-orders"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to My Orders
          </Link>
        </div>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {formatDate(orderDetails.createdAt)}
              </p>
              <p className="text-gray-600 mt-1">
                Customer: {orderDetails.user.name} ({orderDetails.user.email})
              </p>
            </div>

            <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  orderDetails.isPaid
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isPaid ? "Paid" : "Pending"}
              </span>
              <span
                className={`${
                  orderDetails.isDelivered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                } px-3 py-1 rounded-full text-sm font-medium mb-2`}
              >
                {orderDetails.isDelivered ? "Delivered" : "Processing"}
              </span>
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Status: {orderDetails.status}
              </span>
              {orderDetails.trackingNumber && (
                <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mt-2">
                  Tracking: {orderDetails.trackingNumber}
                </span>
              )}
            </div>
          </div>

          {/* Customer, Payment, Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Payment Info</h4>
              <p>Payment Method: {orderDetails.paymentMethod}</p>
              <p>Status: {orderDetails.paymentStatus}</p>
              {orderDetails.paidAt && (
                <p>Paid At: {formatDate(orderDetails.paidAt)}</p>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Shipping Info</h4>
              <p>
                Name: {orderDetails.shippingAddress.firstName}{" "}
                {orderDetails.shippingAddress.lastName}
              </p>
              <p>Address: {orderDetails.shippingAddress.address}</p>
              <p>
                City: {orderDetails.shippingAddress.city},{" "}
              </p>
              <p>Country: {orderDetails.shippingAddress.country}</p>
              <p>Postal Code: {orderDetails.shippingAddress.postalCode}</p>
              {orderDetails.shippingAddress.phone && (
                <p>Phone: {orderDetails.shippingAddress.phone}</p>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Order Summary</h4>
              <p>Items: {orderDetails.orderItems.length}</p>
              <p>
                Total Quantity:{" "}
                {orderDetails.orderItems.reduce(
                  (sum, item) => sum + item.quantity,
                  0
                )}
              </p>
              {orderDetails.shippingCost && (
                <p>Shipping: {formatCurrency(orderDetails.shippingCost)}</p>
              )}
              {orderDetails.tax && (
                <p>Tax: {formatCurrency(orderDetails.tax)}</p>
              )}
              <p className="font-bold">
                Total: {formatCurrency(orderDetails.totalPrice)}
              </p>
            </div>
          </div>

          {/* Product list */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <table className="min-w-full text-gray-600 mb-4">
              <thead className="bg-gray-200">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Unit Price</th>
                  <th className="py-2 px-4">Quantity</th>
                  <th className="py-2 px-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map(
                  (item: OrderItem, index: number) => (
                    <tr
                      key={item._id || index}
                      className="border-b border-gray-200"
                    >
                      <td className="py-2 px-4 flex items-center">
                        <img
                          src={
                            item.image ||
                            ""
                          }
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded-lg mr-4"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            e.currentTarget.src =
                              "";
                          }}
                        />
                        <div>
                          <Link
                            to={`/product/${item.productId}`}
                            className="text-blue-500 hover:underline font-medium"
                          >
                            {item.name}
                          </Link>
                          {(item.size || item.color) && (
                            <p className="text-sm text-gray-500">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && " | "}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-2 px-4">{item.quantity}</td>
                      <td className="py-2 px-4 font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Order Notes */}
          {orderDetails.notes && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">
                Order Notes
              </h4>
              <p className="text-yellow-700">{orderDetails.notes}</p>
            </div>
          )}

          {/* Back to Orders list */}
          <div className="mt-6 pt-4 border-t">
            <Link to="/my-orders" className="text-blue-500 hover:underline">
              ← Back to My Orders
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetailPage;
