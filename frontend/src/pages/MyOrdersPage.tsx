import { useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchUserOrders } from "../redux/orderSlice.ts";
import { useAppDispatch, useAppSelector } from "../redux/store";
// Import types from your type file
import type {
  Order,
  ShippingAddress
} from "../types/order.ts"; // Adjust path as needed

const MyOrdersPage: React.FC = () => {
   const navigate = useNavigate();
   const {
     orders,
     loading,
     error,
     formatDate,
     formatShippingAddress,
     getStatusBadge,
   } = useMyOrders();

   // Handler for row click (uses navigate, which is component-specific)
   const handleRowClick = (orderId: string) => {
     navigate(`/order/${orderId}`);
   };


  // ✅ Use global error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-900">
          <thead className="bg-gray-100 text-sm uppercase text-gray-700">
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Order ID</th>
              <th className="py-2 px-4 sm:py-3">Created</th>
              <th className="py-2 px-4 sm:py-3">Shipping Address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3">Price</th>
              <th className="py-2 px-4 sm:py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* ✅ Use global loading state */}
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                    Loading orders...
                  </div>
                </td>
              </tr>
            ) : orders.length > 0 ? (
              orders.map((order: Order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={
                        order.orderItems[0]?.image || "/placeholder-image.jpg"
                      }
                      alt={order.orderItems[0]?.name || "Product"}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.jpg";
                      }}
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id.slice(-8)}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {formatShippingAddress(order.shippingAddress)}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span className="font-medium">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""}
                    </span>
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-semibold">
                    ${order.totalPrice.toFixed(2)}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {getStatusBadge(order.isPaid)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="mb-2">📦</div>
                    <p>You have no orders yet</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;





const useMyOrders = () => {
  const dispatch = useAppDispatch();

  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };


  const formatShippingAddress = (address: ShippingAddress): string => {
  
    const fullName = `${address.firstName || ""} ${
      address.lastName || ""
    }`.trim();
    const location = [address.city, address.country].filter(Boolean).join(", ");
    return fullName ? `${fullName}, ${location}` : location;
  };

  
  const getStatusBadge = (isPaid: boolean) => (
    <span
      className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
        isPaid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      }`}
    >
      {isPaid ? "Paid" : "Pending"}
    </span>
  );

  
  return {
    orders,
    loading,
    error,
    formatDate,
    formatShippingAddress,
    getStatusBadge,
  };
};
