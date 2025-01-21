import React from "react";

const Map = () => {
  return (
    <div className="max-w-1xl mx-auto p-8">
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Map Image */}
        <div
          className="w-full md:w-1/2 h-64 rounded-lg overflow-hidden shrink-0"
          style={{
            backgroundImage: `url('https://ucarecdn.com/b9b31f9c-3e1d-43f4-b140-774afbc6c593/-/preview/1000x1000/')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        {/* Address Content */}
        <div className="w-full md:w-1/2">
          <h3 className="text-2xl font-bold mb-4">Lokasi Kami</h3>
          <p className="text-gray-600 mb-6">
            Ruko Downtown Drive, Kecamatan No.016 Blok DDBLV, Medang, Kec.
            Pagedangan, Kabupaten Tangerang, Banten 15334, Indonesia
          </p>

          {/* Google Maps Link */}
          <a
            href="https://maps.app.goo.gl/jgbQwrMdHgVCV5G5A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="bg-black hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300">
              Temukan Kami di Google Maps
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Map;