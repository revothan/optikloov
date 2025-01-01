import React, { useEffect, useState } from "react";
import { ArrowRight, Gift, Calendar, MapPin, Clock } from "lucide-react";

const LuckyAngpauPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const endDate = new Date("2025-01-31T23:59:59");
      const now = new Date();
      const difference = endDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-800 to-red-950">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent z-20" />

        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://vdnbihrqujhmmgnshhhn.supabase.co/storage/v1/object/public/products/Lucky%20Angpao%20(Website).png"
            alt="Lucky Angpau Background"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-30">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white">
              <span className="text-yellow-400">Lucky Angpao 2025</span>
              <br />
              Temukan Keberuntunganmu di Tahun Baru!
            </h1>

            <p className="text-xl md:text-2xl text-white/90">
              Rayakan Imlek bersama Optik LOOV dan dapatkan hadiah menarik dari
              angpao spesial kami!
            </p>

            <a
              href="https://maps.app.goo.gl/bnVQQDeupPTXvsJo8"
              target="blank"
              className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-all duration-300"
            >
              Belanja Sekarang & Dapatkan Angpao
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* About Program Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <h2 className="text-3xl md:text-5xl font-bold text-red-800">
              Apa Itu Program Lucky Angpao?
            </h2>

            <p className="text-xl text-gray-700">
              Dari 1 hingga 31 Januari 2025, setiap pembelian minimum Rp 1 juta
              di Optik LOOV akan mendapatkan 1 angpao keberuntungan. Dalam
              setiap angpao, ada hadiah menarik yang menanti Anda!
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Gift,
                  title: "Voucher Diskon",
                  items: ["Rp 100.000", "Rp 500.000", "Rp 1.000.000"],
                },
                {
                  icon: Gift,
                  title: "Merchandise",
                  items: ["Mug Optik LOOV Gratis"],
                },
                {
                  icon: Gift,
                  title: "Produk Spesial",
                  items: [
                    "Sepasang Lensa FSV 1.56",
                    "(Photochromic atau Blue Ray)",
                  ],
                },
              ].map((prize, index) => (
                <div
                  key={index}
                  className="bg-red-50 p-6 rounded-2xl hover:shadow-lg transition-all duration-300"
                >
                  <prize.icon className="w-12 h-12 text-red-800 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-red-800 mb-4">
                    {prize.title}
                  </h3>
                  <ul className="space-y-2">
                    {prize.items.map((item, idx) => (
                      <li key={idx} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Join Section */}
      <section className="py-20 bg-red-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold text-center mb-12">
              Cara Ikutan Program{" "}
              <span className="text-yellow-400">Lucky Angpao</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: MapPin,
                  title: "Kunjungi Toko",
                  description:
                    "Kunjungi toko fisik Optik LOOV di Gading Serpong",
                },
                {
                  icon: Calendar,
                  title: "Lakukan Pembelian",
                  description: "Lakukan pembelian minimum Rp 1 juta",
                },
                {
                  icon: Gift,
                  title: "Ambil Angpao",
                  description:
                    "Ambil 1 angpao keberuntungan Anda dan rasakan keberuntungannya!",
                },
              ].map((step, index) => (
                <div key={index} className="text-center space-y-4">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                    <step.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-white/80">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-black/80 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">Program Berakhir Dalam:</h2>

            <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
              {[
                { value: timeLeft.days, label: "Hari" },
                { value: timeLeft.hours, label: "Jam" },
                { value: timeLeft.minutes, label: "Menit" },
                { value: timeLeft.seconds, label: "Detik" },
              ].map((time, index) => (
                <div key={index} className="bg-red-900 p-4 rounded-lg">
                  <div className="text-4xl font-bold text-yellow-400">
                    {String(time.value).padStart(2, "0")}
                  </div>
                  <div className="text-sm text-white/80">{time.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing Section */}
      <section className="py-20 bg-gradient-to-b from-red-900 to-red-950 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Jangan Lewatkan Kesempatan Ini!
            </h2>

            <p className="text-xl text-white/90">
              Tahun Baru, Hadiah Baru. Jadilah bagian dari kebahagiaan ini!
            </p>

            <a
              href="https://maps.app.goo.gl/bnVQQDeupPTXvsJo8"
              target="blank"
              className="inline-flex items-center gap-2 bg-yellow-500 text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-yellow-400 transition-all duration-300"
            >
              Belanja Sekarang & Raih Keberuntunganmu!
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LuckyAngpauPage;
