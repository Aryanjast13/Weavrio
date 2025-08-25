import { type AxiosResponse } from "axios";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { useNavigate, } from "react-router";
import { createProduct } from "../redux/adminProductSlice";

import api from "../api/api";
import { useAppDispatch, useAppSelector } from "../redux/store";
import type { ProductAddData } from "../types/product";

interface ImageUploadResponse {
  imageUrl: string;
  message?: string;
}

export function useAddProduct() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();


  // Properly typed Redux selector
  const { loading, error } = useAppSelector(
    (state) => state.adminProducts
  );

  // Typed state for product data
  const [productData, setProductData] = useState<ProductAddData>({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    category: "",
    brand: "",
    size: [],
    color: "",
    collections: "",
    material: "",
    metaTitle: "",
    metaDescription: "",
    gender: "",
    images: [],
  });

    const [uploading, setUploading] = useState<boolean>(false);

 

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
          { url: response.data.imageUrl, altText: productData.name },
        ],
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
      e.preventDefault();
   
    if (
      !productData.name ||
      !productData.description ||
      productData.price <= 0
    ) {
      alert("Please fill in all required fields with valid values");
      return;
    }

      dispatch(createProduct(productData));
       setProductData({
         name: "",
         description: "",
         price: 0,
         countInStock: 0,
         category: "",
         brand: "",
         size: [],
         color: "",
         collections: "",
         material: "",
         metaTitle: "",
         metaDescription: "",
         gender: "",
         images: [],
       });
    
  };

  // Handle image removal
  const handleImageRemove = (indexToRemove: number): void => {
    setProductData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  return {
    handleChange,
    handleImageRemove,
    handleImageUpload,
    handleSelect,
    handleSubmit,
    loading,
    error,
    productData,
    uploading,
    setProductData,
  };
}
