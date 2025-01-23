import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    image_url: string;
    online_price: number;
    category: string;
  };
  onDelete?: (id: string) => Promise<void>;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const translateCategory = (category: string) => {
    const categories: { [key: string]: string } = {
      'Sunglasses': 'Kacamata Hitam',
      'Eyeglasses': 'Kacamata',
      'Contact Lenses': 'Lensa Kontak',
      'Accessories': 'Aksesoris',
    };
    return categories[category] || category;
  };

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300">
      <Link
        to={`/products/${product.id}`}
        className="block"
      >
        {/* Container Gambar */}
        <div className="aspect-square overflow-hidden bg-gray-50 relative">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <img
            src={product.image_url}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Konten */}
        <div className="p-4">
          {/* Merek */}
          <p className="text-sm text-gray-500 mb-1">{product.brand}</p>

          {/* Nama Produk */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Label Kategori */}
          <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mb-2">
            {translateCategory(product.category)}
          </span>

          {/* Harga */}
          <p className="text-lg font-semibold text-gray-900">
            {formatPrice(product.online_price)}
          </p>
        </div>
      </Link>
      {onDelete && (
        <div className="p-4 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => onDelete(product.id)}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
}