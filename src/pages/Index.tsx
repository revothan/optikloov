import { useState, useEffect } from "react";
import { MapPin, Facebook, Instagram, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RecentProducts } from "@/components/RecentProducts";
import TestimonialSection from "@/components/TestimonialSection";

const COUNTDOWN_DATE = new Date('2024-12-12T00:00:00');

const Index = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = COUNTDOWN_DATE.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCalendar = () => {
    const event = {
      text: 'Optik LOOV Soft Opening',
      dates: '20241212T000000/20241212T235959',
      location: 'Ruko Downtown Drive Gading Serpong Blok DDBLV No. 016, Kel. Medang, Kec. Pagedangan, Kabupaten Tangerang, Banten 15334, Indonesia',
      details: 'Join us for the soft opening of Optik LOOV in Gading Serpong!'
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.details)}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center">
      {/* Logo Section */}
      <div className="w-24 h-24 mb-8 flex items-center justify-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2 mt-8">
        <img 
          src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/" 
          alt="Optik LOOV Logo" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Animated Welcome Message */}
      <div className="mb-12 text-4xl md:text-6xl font-thin tracking-wider animate-fade-in">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white animate-pulse">
          Hey, Gading Serpong!
        </span>
      </div>

      {/* Countdown Section */}
      <Card className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl mb-12 w-full max-w-2xl animate-fade-in">
        <h2 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">
          Soft Opening
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="text-2xl md:text-6xl font-extralight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400">
                {unit}
              </div>
            </div>
          ))}
        </div>
        <Button
          className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
          onClick={handleAddToCalendar}
        >
          <Calendar className="mr-2 h-4 w-4" />
          Add to Calendar
        </Button>
      </Card>

      {/* Location Section */}
      <Card className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl w-full max-w-2xl mb-12 animate-fade-in">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">
              Location
            </h2>
            <p className="text-lg leading-relaxed text-gray-200">
              Ruko Downtown Drive Gading Serpong Blok DDBLV No. 016,
              <br />
              Kel. Medang, Kec. Pagedangan,
              <br />
              Kabupaten Tangerang, Banten 15334,
              <br />
              Indonesia
            </p>
          </div>

          <Button
            className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
            onClick={() => window.open("https://maps.app.goo.gl/hcD6zrygFpeKo2Nn6", "_blank")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Open in Google Maps
          </Button>
        </div>
      </Card>

      {/* Social Media Links Section */}
      <Card className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl w-full max-w-2xl mb-12 animate-fade-in">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-4">
              Connect With Us
            </h2>
          </div>
          
          <div className="space-y-4">
            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
              onClick={() => window.open("https://api.whatsapp.com/send?phone=6281283335568", "_blank")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat on WhatsApp
            </Button>

            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
              onClick={() => window.open("https://www.instagram.com/optikloov", "_blank")}
            >
              <Instagram className="mr-2 h-4 w-4" />
              Follow on Instagram
            </Button>

            <Button
              className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
              onClick={() => window.open("https://www.facebook.com/people/Optik-Loov/61568572959018/", "_blank")}
            >
              <Facebook className="mr-2 h-4 w-4" />
              Follow on Facebook
            </Button>
          </div>
        </div>
      </Card>

      {/* Recent Products Section */}
      <RecentProducts />

      {/* Testimonials Section */}
      <TestimonialSection />
    </div>
  );
};

export default Index;
