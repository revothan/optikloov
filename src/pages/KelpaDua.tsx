import { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const COUNTDOWN_DATE = new Date("2025-02-14T00:00:00");
const PROMO_END_DATE = new Date("2025-02-28T23:59:59");

const KelapaDua = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = COUNTDOWN_DATE.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCalendar = () => {
    const event = {
      text: "Optik LOOV Kelapa Dua Grand Opening",
      dates: "20250214T000000/20250214T235959",
      location:
        "Ruko Sentra Niaga Jl. Danau Klp. Dua Raya No.11, Klp. Dua, Kec. Klp. Dua, Kabupaten Tangerang, Banten 15810",
      details:
        "Join us for the grand opening of Optik LOOV in Kelapa Dua! Get Free 200 Frames (T&C Apply)",
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.details)}`;
    window.open(googleCalendarUrl, "_blank");
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
          You Are Invited
        </span>
      </div>

      {/* Countdown Section */}
      <Card className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl mb-12 w-full max-w-2xl animate-fade-in">
        <h2 className="text-sm uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">
          Grand Opening
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="text-2xl md:text-6xl font-extralight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
                {String(value).padStart(2, "0")}
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

      {/* Promo Section */}
      <Card className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl w-full max-w-2xl mb-12 animate-fade-in">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white mb-4">
              Grand Opening Promo
            </h2>
            <p className="text-3xl font-light mb-4 text-white">
              Free 200 Frames
            </p>
            <p className="text-sm text-white">Terms & Conditions Apply</p>
            <div className="mt-4 text-white">Valid until February 28, 2025</div>
          </div>
        </div>
      </Card>

      {/* Location Section */}
      <Card className="bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl w-full max-w-2xl mb-12 animate-fade-in">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-[0.2em] text-white mb-4">
              Location
            </h2>
            <p className="text-lg leading-relaxed text-white">
              Ruko Sentra Niaga
              <br />
              Jl. Danau Klp. Dua Raya No.11,
              <br />
              Klp. Dua, Kec. Klp. Dua,
              <br />
              Kabupaten Tangerang, Banten 15810
            </p>
          </div>

          <Button
            className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
            onClick={() =>
              window.open(
                "https://www.google.com/maps?hl=en&mat=CaGRJfHi6B7bElcBmzl_pedWFseAD1WWj8e37dk3grNkYjO3o5sEjCyKdYbl6hEkMZjeNH14Pbro4hNDWY01RGp-AK_6z2lrzzIM6acS-oORp6KFVnffqqp5YtVyVi_ewJ8&authuser=0&um=1&ie=UTF-8&fb=1&gl=id&sa=X&geocode=Kam34xMA_WkuMWjrf0Yk00vB&daddr=Ruko+Sentra+Niaga,+Jl.+Danau+Klp.+Dua+Raya+No.11,+Klp.+Dua,+Kec.+Klp.+Dua,+Kabupaten+Tangerang,+Banten+15810",
              )
            }
          >
            <MapPin className="mr-2 h-4 w-4" />
            Open in Google Maps
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default KelapaDua;
