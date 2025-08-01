import { useEffect, useState } from "react";

// Define interfaces for type safety
interface ShippingAddress {
  city: string;
  country: string;
}

interface OrderItem {
  name: string;
  image: string;
}

interface Order {
  _id: string;
  createdAt: Date;
  shippingAddress: ShippingAddress;
  orderItems: OrderItem[];
  totalPrice: number;
  isPaid: boolean;
}

interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const MyOrdersPage: React.FC = () => {
  const [state, setState] = useState<OrdersState>({
    orders: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const fetchOrders = async (): Promise<void> => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Simulate API call
        timeoutId = setTimeout(() => {
          const mockOrders: Order[] = [
            {
              _id: "12345",
              createdAt: new Date(),
              shippingAddress: { city: "New York", country: "USA" },
              orderItems: [
                {
                  name: "Product 1",
                  image: "https://picsum.photos/500/500?random=1",
                },
              ],
              totalPrice: 100,
              isPaid: true,
            },
            {
              _id: "67890",
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
              shippingAddress: { city: "Los Angeles", country: "USA" },
              orderItems: [
                {
                  name: "Product 2",
                  image: "https://picsum.photos/500/500?random=2",
                },
                {
                  name: "Product 3",
                  image: "https://picsum.photos/500/500?random=3",
                },
              ],
              totalPrice: 200,
              isPaid: false,
            },
          ];

          setState({
            orders: mockOrders,
            loading: false,
            error: null,
          });
        }, 1000);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            error instanceof Error ? error.message : "Failed to load orders",
        }));
      }
    };

    fetchOrders();

    // Cleanup function
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

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

  if (state.error) {
    return (
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{state.error}</p>
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
            {state.loading ? (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                    Loading orders...
                  </div>
                </td>
              </tr>
            ) : state.orders.length > 0 ? (
              state.orders.map((order: Order) => (
                <tr
                  key={order._id}
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
