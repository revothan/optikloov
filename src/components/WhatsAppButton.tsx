import { MessageCircle } from "lucide-react";
import { Button } from "./ui/button";

export const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // Format phone number
    const phoneNumber = "6281283335568"; // Remove any non-digit characters
    const whatsappUrl = `https://wa.me/${phoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50"
      size="icon"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" />
    </Button>
  );
};