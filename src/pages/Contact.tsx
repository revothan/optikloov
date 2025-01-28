import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import { metaPixelEvents } from "@/lib/meta-pixel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  const handleLocationClick = () => {
    metaPixelEvents.storeLocationView();
    window.open("https://maps.app.goo.gl/hcD6zrygFpeKo2Nn6", "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>

            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Have questions about our products or services? We're here to
                  help!
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-black/5 p-3 rounded-lg">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <a
                        href="tel:+6281283335568"
                        className="text-gray-600 hover:text-black"
                      >
                        +62 812-8333-5568
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-black/5 p-3 rounded-lg">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <a
                        href="mailto:optikloov@gmail.com"
                        className="text-gray-600 hover:text-black"
                      >
                        optikloov@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-black/5 p-3 rounded-lg">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Location</p>
                      <button
                        onClick={handleLocationClick}
                        className="text-left text-gray-600 hover:text-black"
                      >
                        Ruko Downtown Drive Gading Serpong
                        <br />
                        Blok DDBLV No. 016
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-black/5 p-3 rounded-lg">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Instagram</p>
                      <a
                        href="https://instagram.com/optikloov"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black"
                      >
                        @optikloov
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-black/5 p-3 rounded-lg">
                      <Facebook className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">Facebook</p>
                      <a
                        href="https://facebook.com/optikloov"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-black"
                      >
                        Optik Loov
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Sunday</span>
                    <span className="font-medium">09:00 am - 9:00 pm</span>
                  </div>
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
