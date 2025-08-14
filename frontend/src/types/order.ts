// Order Item interface
export interface OrderItem {
  _id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

// Shipping Address interface
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
}

// User interface (for order user field)
export interface OrderUser {
  name: string;
  email: string;
}

// Main Order interface
export interface Order {
  _id: string;
  user: OrderUser;
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
  createdAt: string;
  updatedAt: string;
}

// Extended Order Details interface
export interface OrderDetails extends Order {
  trackingNumber?: string;
  estimatedDelivery?: string;
  shippingCost?: number; // Added - used in component
  tax?: number; // Added - used in component
  notes?: string; // Added - used in component
}

// Orders Redux State interface
export interface OrderState {
  orders: Order[];
  totalOrders: number;
  orderDetails: OrderDetails | null;
  loading: boolean;
  error: string | null;
}
