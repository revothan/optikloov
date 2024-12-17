import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrandSection from "@/components/BrandSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const ProductCard = ({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: string;
}) => (
  <div className="group cursor-pointer">
    <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <h3 className="font-medium text-lg">{name}</h3>
    <p className="text-gray-600">{price}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(3)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <img
              src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/"
              alt="Optik LOOV Logo"
              className="w-12 h-12 object-contain"
            />
            {isMobile ? (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
                aria-label="Toggle Menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            ) : (
              <div className="hidden md:flex gap-8">
                <Link
                  to="/"
                  className="text-black hover:text-gray-600 transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className="text-black hover:text-gray-600 transition-colors"
                >
                  Produk
                </Link>
                <Link
                  to="/contact"
                  className="text-black hover:text-gray-600 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Minimal Hero Section */}
      <div className="relative flex flex-col items-center justify-center min-h-screen text-center bg-gray-50">
        <div className="container px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-black mb-4 leading-snug">
            LOOV <span className="text-gray-500">Your Eyes</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Precision-crafted eyewear. Minimal, stylish, and comfortable.
          </p>
          <a
            href="https://maps.app.goo.gl/osfSzvUxA8taRMKW8"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Visit Us on Google Maps
          </a>
        </div>
      </div>

      {/* Brand Section */}
      <BrandSection />

      {/* Product Collection */}
      {products && products.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={`Rp ${formatPrice(product.store_price)}`}
                  image={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            &copy; 2024 Optik LOOV. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
