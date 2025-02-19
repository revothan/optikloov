import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const NavigationBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <nav className="w-full bg-white/80 backdrop-blur-sm border-b">
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
            Beranda
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
            Hubungi Kami
          </Link>
          <Link
            to="/membership"
            className="text-black hover:text-gray-600 transition-colors"
          >
            Membership
          </Link>
          <Link
            to="/visiontest"
            className="text-black hover:text-gray-600 transition-colors"
          >
            Tes Penglihatan
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobile && isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="flex flex-col w-full">
            <Link
              to="/"
              className="w-full p-4 text-black hover:bg-gray-50 transition-colors flex justify-center items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link
              to="/products"
              className="w-full p-4 text-black hover:bg-gray-50 transition-colors flex justify-center items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Produk
            </Link>
            <Link
              to="/contact"
              className="w-full p-4 text-black hover:bg-gray-50 transition-colors flex justify-center items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Hubungi Kami
            </Link>
            <Link
              to="/membership"
              className="w-full p-4 text-black hover:bg-gray-50 transition-colors flex justify-center items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Membership
            </Link>
            <Link
              to="/visiontest"
              className="w-full p-4 text-black hover:bg-gray-50 transition-colors flex justify-center items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Tes Penglihatan
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavigationBar;