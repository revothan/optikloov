import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

// Slides data with just filenames
const slides = [
  {
    image: "bogonew.png",
    title: "Buy One Get One Free",
    subtitle: "Exclusively this February",
    cta: "Visit Store",
    ctaLink: "/contact",
    tag: "01-28 FEBRUARY 2025",
  },
  {
    image: "memberships.png",
    title: "Join the LOOVers Club",
    subtitle:
      "Elevate your eyewear experience with exclusive perks, early access to new collections, and special member pricing.",
    cta: "Become a LOOVers",
    ctaLink: "/membership",
    tag: "Member Perks",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [api, setApi] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  // Helper function to get image URL using Supabase client
  const getImageUrl = async (filename) => {
    try {
      const {
        data: { publicUrl },
      } = supabase.storage.from("promotions").getPublicUrl(filename);
      return publicUrl;
    } catch (error) {
      console.error("Error getting image URL:", error);
      return "";
    }
  };

  // Load all image URLs on component mount
  useEffect(() => {
    const loadImageUrls = async () => {
      const urls = {};
      for (const slide of slides) {
        urls[slide.image] = await getImageUrl(slide.image);
      }
      setImageUrls(urls);
    };

    loadImageUrls();
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
    api.on("settle", () => {
      setIsAnimating(false);
    });
  }, [api]);

  const handleSlideChange = (index) => {
    if (isAnimating) return;
    setIsAnimating(true);
    api?.scrollTo(index);
  };

  return (
    <div className="relative w-full max-w-[1920px] mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          duration: 50,
        }}
        className="w-full"
        setApi={setApi}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative">
              <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden group">
                <img
                  src={imageUrls[slide.image]}
                  alt={`Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24">
                  <div className="max-w-2xl space-y-6 sm:space-y-8">
                    <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-medium">
                      {slide.tag}
                    </span>
                    <h1
                      className={cn(
                        "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight",
                        "opacity-0 translate-y-4 transition-all duration-300",
                        currentSlide === index && "opacity-100 translate-y-0",
                      )}
                    >
                      {slide.title}
                    </h1>
                    <p
                      className={cn(
                        "text-lg sm:text-xl md:text-2xl text-white/90 max-w-xl leading-relaxed",
                        "opacity-0 translate-y-4 transition-all duration-300 delay-100",
                        currentSlide === index && "opacity-100 translate-y-0",
                      )}
                    >
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.ctaLink}
                      className={cn(
                        "inline-flex items-center gap-3 px-8 py-4",
                        "bg-white text-black rounded-full font-medium text-base sm:text-lg",
                        "hover:bg-white/90 hover:gap-4 hover:px-10",
                        "transition-all duration-200 ease-out",
                        "opacity-0 translate-y-4 transition-all duration-300 delay-200",
                        currentSlide === index && "opacity-100 translate-y-0",
                      )}
                    >
                      {slide.cta}
                      <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Controls */}
        <div className="hidden sm:block">
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10"
            aria-label="Previous slide"
          >
            <div className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/90 transition-all duration-150">
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8 text-white hover:text-black" />
            </div>
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10"
            aria-label="Next slide"
          >
            <div className="p-3 sm:p-4 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/90 transition-all duration-150">
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 text-white hover:text-black" />
            </div>
          </button>
        </div>

        {/* Pagination */}
        <div className="hidden sm:flex absolute bottom-8 left-0 right-0 justify-center gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={cn(
                  "h-1.5 rounded-full transition-all duration-150",
                  currentSlide === index
                    ? "w-12 bg-white"
                    : "w-6 bg-white/40 group-hover:bg-white/60",
                )}
              />
            </button>
          ))}
        </div>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
