import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
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
  );
};

export default NavigationBar;
