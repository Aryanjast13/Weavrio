import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { updateProduct } from "../../redux/adminProductSlice";
import { fetchOrderDetails } from "../../redux/orderSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const EditProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useAppSelector(state => state.products);
  
  
  const [productData, setProductData] = useState({
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
  
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() =>{
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  },[selectedProduct])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData((prevData) => ({ ...prevData, [name]: value }));
    }

    const handleImageUpload =  async (e) => {
        const file = e.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      try {
        setUploading(true);
        const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}`, formData);
        setProductData((prevData) => ({
          ...prevData, images: [...prevData.images, { url: data.imageUrl, altText: "" }],
        }));
        setUploading(false);
      } catch (error) {
        console.log(error);
        setUploading(false);
      }
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(updateProduct({ id, productData }));
      navigate("/admin/products");
    }
  
  if (loading) return <p>Loading ...</p>
  if (error) return <p>Error :{error}</p>

  

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md py-2 "
            required
          />
        </div>

        {/* Description */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
                      value={productData.description}
                      onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        {/* CountInStock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Count in Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sku */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Sku</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Sizes (coma-separated){" "}
          </label>
          <input
            type="text"
            name="sizes"
            value={productData.sizes.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* color */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">
            Colors (coma-separated){" "}
          </label>
          <input
            type="text"
            name="colors"
            value={productData.colors.join(",")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
          />
              </div>
              
              {/* Image upload */}
              <div className="mb-6">
                  <label className="block font-semibold mb-2">
                      Upload Image
                  </label>
          <input type="file" onChange={handleImageUpload} />
          {uploading && <p>Uploading image...</p>}
                  <div className="flex gap-4 mt-4">
                      {productData.images.map((image, index) => (
                          <div key={index}>
                              <img src={image.url} alt={image.altText || "ProductImage"} className="w-20 h-20 object-cover rounded-md shadow-md"/>
                          </div>
                      ))}
                  </div>
              </div>
              <button type="submit" className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors">
                  Update Product
              </button>
      </form>
    </div>
  );
}

export default EditProduct