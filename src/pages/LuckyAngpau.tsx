import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LuckyAngpauPage from "@/components/LuckyAngpauPage";

const LuckyAngpau = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow">
        <LuckyAngpauPage />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LuckyAngpau;
