import React, { useCallback, useEffect, useRef, useState } from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { removeFromCart, updateCartItemQuantity } from "../../redux/cartSlice";
import { useAppDispatch } from "../../redux/store";

// ✅ Import all types from unified file
import type {
  CartContentsProps,
  CartItemHandler,
  CartProduct,
  RemoveItemHandler,
} from "../../types/cart";

const CartContents: React.FC<CartContentsProps> = ({ cart, userId }) => {
  const dispatch = useAppDispatch();

  // Local state for optimistic quantity updates (map keyed by unique item identifier)
  const [localQuantities, setLocalQuantities] = useState<
    Record<string, number>
  >({});

  // Refs to hold timers for each product to debounce quantity updates
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Sync local quantities with cart prop whenever it changes (e.g., after API success)
  useEffect(() => {
    const updatedQuantities: Record<string, number> = {};
    cart.products.forEach((product) => {
      const key = `${product.productId}-${product.size}-${product.color}`;
      updatedQuantities[key] = product.quantity;
    });
    setLocalQuantities(updatedQuantities);
  }, [cart]);

  // Debounced dispatch helper
  const debouncedUpdateQuantity = useCallback(
    (productId: string, quantity: number, size: string, color: string) => {
      const key = `${productId}-${size}-${color}`;

      // Clear previous timer for this product if exists
      if (timersRef.current[key]) {
        clearTimeout(timersRef.current[key]);
      }

      // Set new timer to delay dispatch by 500ms
      timersRef.current[key] = setTimeout(() => {
        dispatch(
          updateCartItemQuantity({
            productId,
            quantity,
            userId,
            size,
            color,
          })
        );
        // Clear timer after dispatch
        delete timersRef.current[key];
      }, 500); // debounce 500ms
    },
    [dispatch, userId]
  );

  // ✅ Using proper type
  const handleAddToCart: CartItemHandler = (
    productId,
    delta,
    currentQuantity,
    size,
    color
  ) => {
    const key = `${productId}-${size}-${color}`;
    const newQuantity = Math.max(
      1,
      (localQuantities[key] ?? currentQuantity) + delta
    ); // Prevent below 1

    // Optimistic update: Immediately update local state for UI responsiveness
    setLocalQuantities((prev) => ({
      ...prev,
      [key]: newQuantity,
    }));

    // Debounce the actual API dispatch
    debouncedUpdateQuantity(productId, newQuantity, size, color);
  };

  // ✅ Using proper type
  const handleRemoveFromCart: RemoveItemHandler = (productId, size, color) => {
    const key = `${productId}-${size}-${color}`;

    // Clear debounce timer if any for this product
    if (timersRef.current[key]) {
      clearTimeout(timersRef.current[key]);
      delete timersRef.current[key];
    }

    // Dispatch removal (no local quantity update needed, as item will be removed from Redux)
    dispatch(
      removeFromCart({
        productId,
        userId,
        size,
        color,
      })
    );
  };

  return (
    <div>
      {cart.products.map((product: CartProduct, index: number) => {
        const key = `${product.productId}-${product.size}-${product.color}`;
        const displayQuantity = localQuantities[key] ?? product.quantity; // Use local if available, else Redux

        return (
          <div
            key={index}
            className="flex items-start justify-between py-4 border-b"
          >
            <div className="flex items-start">
              <img
                src={product?.productId?.images?.[0]?.url ?? null}
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
                        product.productId._id,
                        -1,
                        product.quantity, // Pass current Redux quantity as fallback
                        product.size,
                        product.color
                      )
                    }
                  >
                    -
                  </button>
                  <span className="mx-4">{displayQuantity}</span>
                  <button
                    className="border border-gray-200 rounded px-2 py-1 text-xl font-medium"
                    onClick={() =>
                      handleAddToCart(
                        product.productId._id,
                        1,
                        product.quantity, // Pass current Redux quantity as fallback
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
              <p className="font-medium">
                ₹ {Number(product.price).toFixed(2)}
              </p>
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId._id,
                    product.size,
                    product.color
                  )
                }
              >
                <RiDeleteBin3Line className="w-6 h-6 mt-2 text-red-600" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContents;
