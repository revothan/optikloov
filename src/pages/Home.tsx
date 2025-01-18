import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrandSection from "@/components/BrandSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import Maps from "@/components/Maps";
import TestimonialSection from "@/components/TestimonialSection";

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      <main className="flex-grow">
        <div className="mt-[64px]">
          <HeroCarousel />
        </div>

        <TestimonialSection />
        
        <Maps />
        
        <BrandSection />
      </main>

      <Footer />
    </div>
  );
};

export default Home;