
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";

interface ProductCardProps {
  product: Pick<Tables<"products">, "id" | "name" | "brand" | "image_url" | "online_price" | "category">;
  onDelete?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 mb-4">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-gray-500">{product.brand}</p>
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">
              {formatPrice(product.online_price)}
            </p>
            {onDelete && (
              <button
                onClick={() => onDelete(product.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
