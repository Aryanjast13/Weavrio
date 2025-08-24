import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";
import { addToCart } from "../redux/cartSlice";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../redux/productsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

export function useProductDetails(productId?:string) {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedProduct, loading, error, similarProducts } = useAppSelector(
    (state) => state.products
  );
  const { user } = useAppSelector((state) => state.auth);

  // State with proper TypeScript typing
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const productFetchId: string | undefined = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length && selectedProduct.images.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    } else {
      setMainImage(null);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action: "plus" | "minus"): void => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async (): Promise<void> => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration: 1000,
      });
      return;
    }

    if (!productFetchId) {
      toast.error("Product ID is missing", {
        duration: 1000,
      });
      return;
    }

    setIsButtonDisabled(true);

    try {
      await dispatch(
        addToCart({
          productId: productFetchId,
          quantity,
          size: selectedSize,
          color: selectedColor,
          userId: user?._id,
        })
      ).unwrap(); // unwrap to handle rejections

      toast.success("Product added to cart!", {
        duration: 1000,
      });
    } catch (error) {
      toast.error("Failed to add product to cart", {
        duration: 1000,
      });
      console.error("Add to cart error:", error);
    } finally {
      setIsButtonDisabled(false);
    }
  };
    
    
     return {
       selectedProduct,
       loading,
       error,
       similarProducts,
       mainImage,
       setMainImage,
       selectedSize,
       setSelectedSize,
       selectedColor,
       setSelectedColor,
       quantity,
       handleQuantityChange,
       isButtonDisabled,
       handleAddToCart,
     };
}
