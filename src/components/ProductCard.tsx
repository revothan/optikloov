import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";
import { ProductDialog } from "./ProductDialog";
import { Tables } from "@/integrations/supabase/types";

type MinimalProduct = Pick<Tables<"products">, "id" | "name" | "brand" | "image_url" | "online_price" | "category">;

interface ProductCardProps {
  product: MinimalProduct;
  onDelete?: (id: string) => Promise<void>;
}

export function ProductCard({ product, onDelete }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const translateCategory = (category: string) => {
    const categories: { [key: string]: string } = {
      'Frame': 'Frame',
      'Lensa': 'Lensa',
      'Soft Lens': 'Soft Lens',
      'Sunglasses': 'Kacamata Hitam',
      'Others': 'Lainnya',
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
            src={product.image_url || ''}
            alt={product.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {/* Konten */}
        <div className="p-3">
          {/* Merek */}
          <p className="text-xs text-gray-500 mb-0.5">{product.brand}</p>

          {/* Nama Produk */}
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
            {product.name}
          </h3>

          {/* Label Kategori */}
          <span className="inline-block px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded-full mb-1">
            {translateCategory(product.category)}
          </span>

          {/* Harga */}
          <p className="text-base font-semibold text-gray-900">
            {formatPrice(product.online_price || 0)}
          </p>
        </div>
      </Link>
      {(onDelete || product.id) && (
        <div className="p-3 border-t flex gap-2">
          <ProductDialog 
            mode="edit" 
            product={product as Tables<"products">}
            trigger={
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            }
          />
          {onDelete && (
            <Button
              variant="destructive"
              size="sm"
              className="flex-1 text-xs"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}