import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, UserPlus, Menu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrandSection from "@/components/BrandSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const ProductCard = ({ name, price, image }: { name: string; price: string; image: string }) => (
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            ) : (
              <div className="hidden md:flex gap-8">
                <Link to="/" className="text-black hover:text-gray-600 transition-colors">
                  Home
                </Link>
                <Link to="/products" className="text-black hover:text-gray-600 transition-colors">
                  Produk
                </Link>
                <Link to="/contact" className="text-black hover:text-gray-600 transition-colors">
                  Contact Us
                </Link>
              </div>
            )}
          </div>
          <Button 
            variant="outline"
            className="hidden md:flex items-center gap-2"
            onClick={() => navigate('/login')}
          >
            <UserPlus className="w-4 h-4" />
            Member
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden bg-white border-b animate-in slide-in-from-top">
            <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-black hover:text-gray-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className="text-black hover:text-gray-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Produk
              </Link>
              <Link 
                to="/contact" 
                className="text-black hover:text-gray-600 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>
              <Button 
                variant="outline"
                className="flex items-center gap-2 w-full justify-center"
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
              >
                <UserPlus className="w-4 h-4" />
                Member
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center pt-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_0),linear-gradient(180deg,rgba(0,0,0,.03)_1px,transparent_0)] bg-[size:4rem_4rem]" />
        <div className="absolute right-0 top-20 w-72 h-72 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute left-20 bottom-20 w-96 h-96 bg-black/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-6 leading-tight">
              <span className="block animate-in fade-in slide-in-from-left duration-700">LOOV</span>
              <span className="block animate-in fade-in slide-in-from-right duration-700 delay-300">your eyes</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl animate-in fade-in slide-in-from-bottom duration-700 delay-500">
              Experience precision crafted eyewear that combines style with comfort. 
              Visit our new store in Gading Serpong.
            </p>
            <div className="animate-in fade-in slide-in-from-bottom duration-700 delay-700">
              <Button 
                className="bg-black text-white hover:bg-black/90 text-lg px-8 py-6 rounded-full"
                onClick={() => window.open("https://maps.app.goo.gl/hcD6zrygFpeKo2Nn6", "_blank")}
              >
                Visit Store <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Section */}
      <BrandSection />

      {/* Product Collection - Only show if there are products */}
      {products && products.length > 0 && (
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Featured Collection</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard 
                  key={product.id}
                  name={product.name}
                  price={`Rp ${formatPrice(product.store_price)}`}
                  image={product.image_url || "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-2">Optik LOOV</h3>
              <p className="text-gray-400 mb-1">PT. Loovindo Optima Vision</p>
              <p className="text-gray-400 mb-4 max-w-md">
                Ruko Downtown Drive Blok DDBLV No 016, Banten, Tangerang, Indonesia, 15334
              </p>
              <p className="text-gray-400 mb-1">
                <a href="mailto:optik.loov@gmail.com" className="hover:text-white transition-colors">
                  optik.loov@gmail.com
                </a>
              </p>
              <p className="text-gray-400">
                <a href="tel:+6281283335568" className="hover:text-white transition-colors">
                  +62 81283335568
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-3">
                <p>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </p>
                <p>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                    Produk
                  </Link>
                </p>
                <p>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </p>
                <p>
                  <Link to="/countdown" className="text-gray-400 hover:text-white transition-colors">
                    Store Opening
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
