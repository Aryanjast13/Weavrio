import { type AxiosResponse } from "axios";
import  {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import { useNavigate, useParams } from "react-router";
import { updateProduct } from "../redux/adminProductSlice";
import { fetchProductDetails } from "../redux/productsSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import api from "../api/api";
import type { ProductUpdateData } from "../types/product";


interface ImageUploadResponse {
  imageUrl: string;
  message?: string;
}


export function useEditProduct() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Properly typed Redux selector
  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );

  // Typed state for product data
  const [productData, setProductData] = useState<ProductUpdateData>({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [{ url: "" }, { url: "" }],
  });

  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]:
        name === "price" || name === "countInStock" ? Number(value) : value,
    }));
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  // Handle image upload
  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const response: AxiosResponse<ImageUploadResponse> = await api.post(
        `/api/upload`, // Fixed: Complete URL
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProductData((prevData) => ({
        ...prevData,
        images: [
          ...prevData.images,
          { url: response.data.imageUrl, altText: "" },
        ],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!id) {
      console.error("Product ID is missing");
      return;
    }

    // Basic validation
    if (
      !productData.name ||
      !productData.description ||
      productData.price <= 0
    ) {
      alert("Please fill in all required fields with valid values");
      return;
    }

    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  // Handle image removal
  const handleImageRemove = (indexToRemove: number): void => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
  };
    
    return {
        handleChange,handleImageRemove,handleImageUpload,handleSelect,handleSubmit,loading,error,productData,uploading,setProductData
    }
}
