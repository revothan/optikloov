import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BrandSection from "@/components/BrandSection";
import HeroCarousel from "@/components/HeroCarousel";
import Map from "@/components/Maps";
import TestimonialSection from "@/components/TestimonialSection";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroCarousel />
        <BrandSection />
        <TestimonialSection />
        <Map />
      </main>
      <Footer />
    </div>
  );
};

export default Home;