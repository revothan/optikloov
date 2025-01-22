import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import BrandSection from "@/components/BrandSection";
import { RecentProducts } from "@/components/RecentProducts";
import TestimonialSection from "@/components/TestimonialSection";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main>
        <HeroCarousel />
        <RecentProducts />
        <BrandSection />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  );
};

export default Home;