import { Link } from "react-router";
import type { Product } from "../../types/product";



const ProductGrid = ({ products, loading, error }: { products:Product[], loading: boolean, error: string |null }) => {
    
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>Error: {error}</p>
    }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${product._id}`}
          className="block"
        >
          <div className="bg-white p-4 rounded-lg">
            <div className="w-full h-96  mb-4">
              <img
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
                className="w-full h-full object-cover object-top rounded-lg"
              />
            </div>
            <h3 className="text-sm mb-2">{product.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tight">
              ₹ {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ProductGrid