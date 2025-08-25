
import { useProductDetails } from "../../hooks/useProductDeatils";
import ProductGrid from "../Product/ProductGrid";





// Props interface
interface ProductDetailsProps {
  productId?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ productId }) => {
 const {
   selectedProduct,
   loading,
   error,
   similarProducts,
   mainImage,
   setMainImage,
   selectedSize,
   setSelectedSize,
   quantity,
   handleQuantityChange,
   isButtonDisabled,
   handleAddToCart,
 } = useProductDetails(productId);

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <p className="text-center">Loading...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <p className="text-center text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  // No product found
  if (!selectedProduct) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
          <p className="text-center">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="mb-4 h-full">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt="Main Product"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Thumbnails */}
          <div className="md:hidden flex overflow-x-auto space-x-4 mb-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText || `Thumbnail ${index + 1}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 md:ml-10 text-start">
            <h1 className="text-2xl md:text-3xl font-medium mb-2">
              {selectedProduct.name}
            </h1>

            <p className="text-xl text-gray-500 mb-2 relative">
              ₹{selectedProduct.price}
              <span className="absolute -top-1 left-15 line-through">
                ₹{selectedProduct.originalPrice}
              </span>
            </p>
            <p className="text-gray-600 mb-4">{selectedProduct.description}</p>

            {/* Color Selection */}
            <div className="mb-4">
              <p className="text-gray-700">Color: {selectedProduct.color}</p>
            </div>

            {/* Size Selection */}
            <div className="mb-4">
              <p className="text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.size.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 font-medium rounded border ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selection */}
            <div className="mb-6">
              <p className="text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg hover:bg-gray-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              disabled={isButtonDisabled}
              onClick={handleAddToCart}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                isButtonDisabled
                  ? "cursor-not-allowed bg-black/50"
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART"}
            </button>

            {/* Product Characteristics */}
            <div className="mt-10 text-gray-700">
              <h3 className="text-xl font-bold mb-4">Characteristics:</h3>
              <table className="w-full text-left text-sm text-gray-600">
                <tbody>
                  <tr>
                    <td className="py-1">Brand</td>
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>
                  <tr>
                    <td className="py-1">Material</td>
                    <td className="py-1">{selectedProduct.material}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">
            You May Also Like
          </h2>
          <ProductGrid
            products={similarProducts}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
