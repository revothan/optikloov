import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Facebook,
  Instagram,
  MessageSquare,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      {/* Contact Content */}
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-2xl mx-auto">
          {/* Back to Home link removed */}

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
              <MessageSquare className="w-8 h-8 text-green-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold group-hover:text-green-500 transition-colors">
                  WhatsApp
                </h3>
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
                <h3 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                  Email
                </h3>
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
                <h3 className="text-lg font-semibold group-hover:text-[#1877F2] transition-colors">
                  Facebook
                </h3>
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
                <h3 className="text-lg font-semibold group-hover:text-[#E4405F] transition-colors">
                  Instagram
                </h3>
                <p className="text-gray-600">@optik.loov</p>
              </div>
            </a>
          </div>

          {/* Store Address */}
          <div className="mt-12 p-6 bg-gray-50 rounded-xl animate-in fade-in slide-in-from-bottom duration-700 delay-300">
            <h2 className="text-xl font-semibold mb-4">Visit Our Store</h2>
            <p className="text-gray-600 mb-4">
              Ruko Downtown Drive Blok DDBLV No 016
              <br />
              Banten, Tangerang, Indonesia, 15334
            </p>
            <Button
              className="bg-black text-white hover:bg-black/90"
              onClick={() =>
                window.open(
                  "https://maps.app.goo.gl/hcD6zrygFpeKo2Nn6",
                  "_blank"
                )
              }
            >
              Get Directions
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
