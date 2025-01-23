import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { metaPixelEvents } from "@/lib/meta-pixel";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    metaPixelEvents.contactClick();

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_key: "4c1e4c6d-c17c-41c0-9c12-37a0ef5a4ee8",
          ...formData,
        }),
      });

      if (response.ok) {
        toast({
          title: "Message sent successfully!",
          description: "We'll get back to you as soon as possible.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again later.",
      });
    }
  };

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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Contact Information */}
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
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Sunday</span>
                      <span className="font-medium">10:00 - 21:00</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium mb-2"
                    >
                      Name
                    </label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Message
                    </label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}