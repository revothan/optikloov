import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, Facebook, Instagram, WhatsApp, ArrowLeft } from "lucide-react";

const Contact = () => {
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
            <div className="flex gap-8">
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
          </div>
        </div>
      </nav>

      {/* Contact Content */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-black mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <h1 className="text-4xl font-bold mb-8 animate-in fade-in slide-in-from-bottom duration-700">
            Contact Us
          </h1>
          
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
            {/* WhatsApp */}
            <a 
              href="https://wa.me/6281283335568" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center p-6 bg-white rounded-xl border hover:border-green-500 transition-colors group"
            >
              <WhatsApp className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold group-hover:text-green-500 transition-colors">WhatsApp</h3>
                <p className="text-gray-600">+62 812-8333-5568</p>
              </div>
            </a>

            {/* Email */}
            <a 
              href="mailto:optik.loov@gmail.com"
              className="flex items-center p-6 bg-white rounded-xl border hover:border-blue-500 transition-colors group"
            >
              <Mail className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">Email</h3>
                <p className="text-gray-600">optik.loov@gmail.com</p>
              </div>
            </a>

            {/* Facebook */}
            <a 
              href="https://facebook.com/optikloov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-6 bg-white rounded-xl border hover:border-[#1877F2] transition-colors group"
            >
              <Facebook className="w-8 h-8 text-[#1877F2] mr-4" />
              <div>
                <h3 className="text-lg font-semibold group-hover:text-[#1877F2] transition-colors">Facebook</h3>
                <p className="text-gray-600">@optikloov</p>
              </div>
            </a>

            {/* Instagram */}
            <a 
              href="https://instagram.com/optik.loov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-6 bg-white rounded-xl border hover:border-[#E4405F] transition-colors group"
            >
              <Instagram className="w-8 h-8 text-[#E4405F] mr-4" />
              <div>
                <h3 className="text-lg font-semibold group-hover:text-[#E4405F] transition-colors">Instagram</h3>
                <p className="text-gray-600">@optik.loov</p>
              </div>
            </a>
          </div>

          {/* Store Address */}
          <div className="mt-12 p-6 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <h2 className="text-xl font-semibold mb-4">Visit Our Store</h2>
            <p className="text-gray-600 mb-4">
              Ruko Downtown Drive Blok DDBLV No 016<br />
              Banten, Tangerang, Indonesia, 15334
            </p>
            <Button 
              className="bg-black text-white hover:bg-black/90"
              onClick={() => window.open("https://maps.app.goo.gl/hcD6zrygFpeKo2Nn6", "_blank")}
            >
              Get Directions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;