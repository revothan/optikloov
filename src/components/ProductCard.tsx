import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    image_url: string;
    online_price: number;
    category: string;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300"
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Category Badge */}
        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mb-2">
          {product.category}
        </span>

        {/* Price */}
        <p className="text-lg font-semibold text-gray-900">
          {formatPrice(product.online_price)}
        </p>
      </div>
    </Link>
  );
}
