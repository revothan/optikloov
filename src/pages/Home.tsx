import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrandSection from "@/components/BrandSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Navbar from "@/components/Navbar"; // Import the Navbar component
import Footer from "@/components/Footer"; // Import the Footer component

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
      <Navbar />

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
      <Footer />
    </div>
  );
};

export default Home;
