import { useEffect } from "react";
import { useNavigate } from "react-router";
import { fetchUserOrders } from "../redux/orderSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";


interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size?: string;
  color?: string;
  quantity: number;
}

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

// Types
interface Order {
  _id: string;
  user: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  isDelivered: boolean;
  deliveredAt?: Date;
  paymentStatus: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const MyOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ✅ Only use global Redux state
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatShippingAddress = (address: ShippingAddress): string => {
    return `${address.city}, ${address.country}`;
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

  const handleRowClick = (orderId: number) => {
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
            ) : /* ✅ Use global orders state */ orders.length > 0 ? (
              orders.map((order:Order) => (
                <tr
                  key={order._id}
                  onClick={() => handleRowClick(order._id)}
                  className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order.orderItems[0]?.image}
                      alt={order.orderItems[0]?.name || "Product"}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                      loading="lazy"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-900 whitespace-nowrap">
                    #{order._id}
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
