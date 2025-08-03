import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "../Product/ProductGrid";

 const selectedProduct = {
   name: "Stylish Jacket",
   price: 120,
   originalPrice: 150,
   description: "This is a stylish jacket perfect for any occasion",
   brand: "FashionBrand",
   material: "Leather",
   sizes: ["S", "M", "L", "XL"],
   colors: ["Red", "Black"],
   images: [
     {
       url: "https://picsum.photos/1000/1000?random=1",
       altText: "Stylish Jacket 1",
     },
     {
       url: "https://picsum.photos/1000/1000?random=2",
       altText: "Stylish Jacket 2",
     },
     {
       url: "https://picsum.photos/1000/1000?random=3",
       altText: "Stylish Jacket 1",
     },
     {
       url: "https://picsum.photos/1000/1000?random=4",
       altText: "Stylish Jacket 2",
     },
   ],
 };

const similarProducts = [
  {
    _id: 1,
    name: "Product 1",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=3",
        altText: "image2",
      },
    ],
  },
  {
    _id: 2,
    name: "Product 2",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=4",
        altText: "image3",
      },
    ],
  },
  {
    _id: 3,
    name: "Product 3",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=5",
        altText: "image4",
      },
    ],
  },
  {
    _id: 4,
    name: "Product 4",
    price: 100,
    images: [
      {
        url: "https://picsum.photos/500/500?random=6",
        altText: "image2",
      },
    ],
  },
];

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled,setIsButtonDisabled] = useState(false)

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    } else {
      setMainImage(null);
    }
  }, [selectedProduct]);


  const handleQuantityChange = (action:string) =>{
    if (action === "plus") setQuantity((prev) => prev + 1);
    if(action === "minus" && quantity >1) setQuantity((prev)=>prev-1)
  }
 
  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select a size and color before adding to cart.", {
        duration:1000,
      });
      return;
    }
    setIsButtonDisabled(true)
    setTimeout(() => {
      toast.success("Product added to cart!", {
        duration: 1000,
      });
      setIsButtonDisabled(false);
    }, 500);
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
                alt={image.altText || `Thumbnail ${index}`}
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
          <div className="md:hidden flex overscroll-x-auto space-x-4 mb-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === image.url ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMainImage(image.url)}
              />
            ))}
          </div>

          {/* Right Side */}
          <div className="md:w-1/2 md:ml-10 text-start ">
            <h1 className="text-2xl md:text-3xl font-medium mb-2">
              {selectedProduct.name}
            </h1>
            <p className=" text-lg  text-gray-600 mb-1 line-through">
              {selectedProduct.originalPrice &&
                `${selectedProduct.originalPrice}`}
            </p>
            <p className="text-xl text-gray-500  mb-2">
              $ {selectedProduct.price}
            </p>
            <p className=" text-gray-600 mb-4">{selectedProduct.description}</p>

            <div className="mb-4">
              <p className=" text-gray-700">Color:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`w-7 h-7 rounded-full border ${
                      selectedColor === color
                        ? "border-4 border-black"
                        : "border-gray-300"
                    }`}
                    style={{
                      backgroundColor: color.toLocaleLowerCase(),
                      filter: "brightness(0.5)",
                    }}
                  ></button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className=" text-gray-700">Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 font-medium rounded border ${
                      selectedSize === size ? "bg-black text-white" : ""
                    } `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className=" text-gray-700">Quantity:</p>
              <div className="flex items-center space-x-4 mt-2">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  -
                </button>
                <span className="text-lg"> {quantity}</span>
                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-2 py-1 bg-gray-200 rounded text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              disabled={isButtonDisabled}
              onClick={handleAddToCart}
              className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                isButtonDisabled
                  ? "cursor-cell bg-black/50"
                  : "hover:bg-gray-900"
              }`}
            >
              {isButtonDisabled ? "Adding..." : "ADD TO CART "}
            </button>

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
                    <td className="py-1">{selectedProduct.brand}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl text-center font-medium mb-4">
            You May Also Like
          </h2>
          <ProductGrid products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
