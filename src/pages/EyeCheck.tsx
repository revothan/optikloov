import React from "react";
import HeroCarousel from "@/components/HeroCarousel";
import Map from "@/components/Maps";
import CalendarBooking from "@/components/CalendarBooking";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EyeCheckPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow bg-white">
        {/* Booking Section */}
        <section className="pt-24 md:pt-32 pb-12 md:pb-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Digitalized Vision Screening Test Appointment
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Schedule your comprehensive eye examination with our experienced
                optometrists. Choose a convenient time slot and let us take care
                of your vision needs.
              </p>
            </div>
            <div className="max-w-4xl mx-auto h-[600px] md:h-[700px] border rounded-lg shadow-lg">
              <CalendarBooking />
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Visit Our Store
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find us easily at our convenient location. We're ready to
                welcome you and provide the best eye care services.
              </p>
            </div>
            <Map />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default EyeCheckPage;