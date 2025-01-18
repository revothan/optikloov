import React from "react";
import { MapPin } from "lucide-react";

const Map = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lokasi Kami
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Kunjungi toko kami untuk konsultasi langsung dengan tim profesional kami
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Map Image with hover effect */}
            <div className="w-full md:w-1/2">
              <div
                className="aspect-video rounded-2xl overflow-hidden transform transition-transform duration-300 hover:scale-105 shadow-xl"
                style={{
                  backgroundImage: `url('https://ucarecdn.com/b9b31f9c-3e1d-43f4-b140-774afbc6c593/-/preview/1000x1000/')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
            </div>

            {/* Address Content */}
            <div className="w-full md:w-1/2 space-y-6">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Optik LOOV</h3>
                <p className="text-gray-600 leading-relaxed">
                  Ruko Downtown Drive, Kecamatan No.016 Blok DDBLV, Medang, Kec.
                  Pagedangan, Kabupaten Tangerang, Banten 15334, Indonesia
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-semibold">Jam Operasional:</span>
                  <br />
                  Senin - Minggu: 10:00 - 21:00 WIB
                </p>
              </div>

              {/* Google Maps Link */}
              <a
                href="https://maps.app.goo.gl/jgbQwrMdHgVCV5G5A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                <MapPin className="w-5 h-5" />
                Buka di Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Map;