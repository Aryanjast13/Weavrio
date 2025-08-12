import axios, { type AxiosResponse } from "axios";
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { updateProduct } from "../../redux/adminProductSlice"; // Fixed import
import { fetchProductDetails } from "../../redux/productsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

// Product Image interface
interface ProductImage {
  url: string;
  altText?: string;
}

// Product Data interface
interface ProductData {
  _id?: string;
  name: string;
  description: string;
  price: number;
  countInStock: number;
  sku: string;
  category?: string;
  brand: string;
  sizes: string[];
  colors: string[];
  collections?: string;
  material: string;
  gender?: string;
  images: ProductImage[];
}

// API Response interface for image upload
interface ImageUploadResponse {
  imageUrl: string;
  message?: string;
}



const EditProduct: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Properly typed Redux selector
  const { selectedProduct, loading, error } = useAppSelector(
    (state) => state.products
  );

  // Typed state for product data
  const [productData, setProductData] = useState<ProductData>({
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
    images: [
      { url: "https://picsum.photos/150?random=1" },
      { url: "https://picsum.photos/150?random=2" },
    ],
  });

  const [uploading, setUploading] = useState<boolean>(false);

  // Fetch product details when component mounts
  useEffect(() => {
    if (id) {
      // Fixed: Should fetch product, not order details
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  // Update form data when product is loaded
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


  const handleSelect = (e:ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]:value,
    }))
  }
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
      const response: AxiosResponse<ImageUploadResponse> = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`, // Fixed: Complete URL
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

  // Loading state
  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2">Loading product...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        {/* Count in Stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            min="0"
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* SKU */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Category */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Brand */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Brand</label>
          <input
            type="text"
            name="brand"
            value={productData.brand}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProductData({
                ...productData,
                sizes: e.target.value
                  .split(",")
                  .map((size) => size.trim())
                  .filter(Boolean),
              })
            }
            placeholder="S, M, L, XL"
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setProductData({
                ...productData,
                colors: e.target.value
                  .split(",")
                  .map((color) => color.trim())
                  .filter(Boolean), // Fixed: color.trim()
              })
            }
            placeholder="Red, Blue, Green"
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Collections */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Collections</label>
          <input
            type="text"
            name="collections"
            value={productData.collections}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Material */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Material</label>
          <input
            type="text"
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Gender */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Gender</label>
          <select
            name="gender"
            value={productData.gender}
            onChange={handleSelect}
            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:outline-none"
          >
            <option value="">Select Gender</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Unisex">Unisex</option>
          </select>
        </div>

        {/* Image Upload */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="mb-4"
            disabled={uploading}
          />
          {uploading && (
            <p className="text-blue-500 mb-4">Uploading image...</p>
          )}
          <div className="grid grid-cols-4 gap-4">
            {productData.images.map((image: ProductImage, index: number) => (
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={image.altText || `Product Image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
