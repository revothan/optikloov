import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left Logo */}
          <div className="flex items-center">
            <img
              src="https://ucarecdn.com/426a9458-b640-40fd-99d5-c1ac742b5ffd/"
              alt="Optik LOOV Logo"
              className="w-24 h-30 object-contain"
            />
          </div>

          {/* Hamburger Icon (Right-Aligned) */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
              aria-label="Toggle Menu"
            >
              <Menu className="h-6 w-6 text-black" />
            </button>
          )}

          {/* Desktop Menu */}
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
            <Link
              to="/membership"
              className="text-black hover:text-gray-600 transition-colors"
            >
              Memberships
            </Link>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobile && isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="flex flex-col items-start gap-4 p-4">
              <Link
                to="/"
                className="text-black hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products"
                className="text-black hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Produk
              </Link>
              <Link
                to="/contact"
                className="text-black hover:text-gray-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              <Link
                to="/membership"
                className="text-black hover:text-gray-600 transition-colors"
              >
                Memberships
              </Link>
            </div>
          </div>
        )}
      </nav>
      {/* Add space below the navbar */}
      <div className="h-16 md:h-20"></div>
    </>
  );
};

export default NavigationBar;
