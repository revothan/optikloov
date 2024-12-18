import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import BrandSection from "@/components/BrandSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import AutoPlay from "embla-carousel-autoplay";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID").format(price);
};

const ProductCard = ({
  name,
  price,
  image,
}: {
  name: string;
  price: string;
  image: string;
}) => (
  <div className="group cursor-pointer">
    <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <h3 className="font-medium text-lg">{name}</h3>
    <p className="text-gray-600">{price}</p>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: products } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .limit(3)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const plugin = AutoPlay({ delay: 3500 });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Carousel Section */}
      <div className="w-full max-w-[1920px] mx-auto pt-16">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[plugin]}
          className="w-full"
        >
          <CarouselContent>
            <CarouselItem>
              <div className="relative">
                <img
                  src="https://ucarecdn.com/1555baca-5e35-4376-9354-a6fad135de06/-/preview/1000x562/"
                  alt="Carousel Image 1"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-8 left-8">
                  <Button variant="secondary" size="lg">
                    Shop Now
                  </Button>
                </div>
              </div>
            </CarouselItem>
            <CarouselItem>
              <div className="relative">
                <img
                  src="https://ucarecdn.com/1f1db06f-fe1e-4bb3-8fce-fae4482c0beb/-/preview/1000x562/"
                  alt="Carousel Image 2"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-8 left-8">
                  <Button variant="secondary" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>

      {/* Brand Section */}
      <BrandSection />

      {/* Product Collection */}
      {products && products.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Featured Collection
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  price={`Rp ${formatPrice(product.store_price)}`}
                  image={
                    product.image_url ||
                    "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80"
                  }
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default Home;