import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { removeFromCart, updateCartItemQuantity } from "../../redux/cartSlice";
import { useAppDispatch } from "../../redux/store";

// Interface for cart product item
interface CartProduct {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

// Interface for cart object
interface Cart {
  products: CartProduct[];
}

// Props interface
interface CartContentsProps {
  cart: Cart;
  userId?: string; // Optional - might be undefined for guest users
  guestId?: string; // Optional - might be undefined for logged-in users
}

const CartContents: React.FC<CartContentsProps> = ({
  cart,
  userId,
  guestId,
}) => {
  const dispatch = useAppDispatch();

  // Handle adding or subtracting from cart
  const handleAddToCart = (
    productId: string,
    delta: number,
    quantity: number,
    size: string,
    color: string
  ): void => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (
    productId: string,
    size: string,
    color: string
  ): void => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products.map((product: CartProduct, index: number) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                size: {product.size} | color: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  className="border border-gray-200 rounded px-2 py-1 text-xl font-medium"
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  className="border border-gray-200 rounded px-2 py-1 text-xl font-medium"
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                >
                  +
                </button>
            </div>
              </div>
          </div>
          <div>
            <p className="font-medium">$ {Number(product.price).toFixed(2)}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
            >
              <RiDeleteBin3Line className="w-6 h-6 mt-2 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
