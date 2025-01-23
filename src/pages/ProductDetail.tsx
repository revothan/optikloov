import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { metaPixelEvents } from "@/lib/meta-pixel";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<{ [key: string]: boolean }>({});

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, brand, image_url, online_price, category, description, photo_1, photo_2, photo_3")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleImageLoad = (imageUrl: string) => {
    setImagesLoaded((prev) => ({ ...prev, [imageUrl]: true }));
  };

  const handleWhatsAppClick = (brand: string, name: string) => {
    const message = encodeURIComponent(`Halo, saya mau order ${brand} ${name}`);
    window.open(`https://wa.me/6281283335568?text=${message}`, "_blank");
  };

  useEffect(() => {
    if (product) {
      metaPixelEvents.viewProduct({
        content_name: `${product.brand} ${product.name}`,
        content_type: 'product',
        content_ids: [product.id]
      });
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center flex-grow mt-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center flex-grow mt-16">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate("/products")}>Back to Products</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const images = [
    product.image_url,
    product.photo_1,
    product.photo_2,
    product.photo_3,
  ].filter(Boolean);

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow mt-16">
        <div className="container mx-auto px-4 pb-16">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/products")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-50">
                {!imagesLoaded[images[currentImageIndex]] && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                    imagesLoaded[images[currentImageIndex]]
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                  onLoad={() => handleImageLoad(images[currentImageIndex])}
                  loading="lazy"
                />

                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-black"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      {!imagesLoaded[image] && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                      )}
                      <img
                        src={image}
                        alt={`Product view ${index + 1}`}
                        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
                          imagesLoaded[image] ? "opacity-100" : "opacity-0"
                        }`}
                        onLoad={() => handleImageLoad(image)}
                        loading="lazy"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {product.brand} {product.name}
                </h1>
                <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                  {product.category}
                </span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.online_price)}
                </h2>
              </div>

              {product.description && (
                <div className="prose prose-sm">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              )}

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">
                  Interested in this product?
                </h3>
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleWhatsAppClick(product.brand, product.name)
                    }
                  >
                    Contact via WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open("tel:+6281283335568")}
                  >
                    Call Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
