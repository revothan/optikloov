import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col items-center justify-center p-4 md:p-8">
      {/* Logo Placeholder - We'll add the actual logo once you upload it */}
      <div className="w-48 h-48 mb-12 flex items-center justify-center">
        <div className="text-2xl font-light text-black dark:text-white">
          [Your Logo Here]
        </div>
      </div>

      {/* Countdown Section */}
      <Card className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 p-8 rounded-2xl mb-12 w-full max-w-2xl">
        <h2 className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-2 text-center">
          Soft Opening
        </h2>
        <div className="grid grid-cols-4 gap-4 mb-8">
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="text-center">
              <div className="text-4xl md:text-5xl font-light mb-2">
                {String(value).padStart(2, '0')}
              </div>
              <div className="text-xs uppercase tracking-wider text-gray-600 dark:text-gray-400">
                {unit}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Location Section */}
      <Card className="bg-white/80 dark:bg-black/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 p-8 rounded-2xl w-full max-w-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-sm uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-4">
              Location
            </h2>
            <p className="text-black dark:text-white text-lg leading-relaxed">
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
            className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-100 transition-all duration-300"
            onClick={() => window.open("https://maps.app.goo.gl/hcD6zrygFpeKo2Nn6", "_blank")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Open in Google Maps
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Index;