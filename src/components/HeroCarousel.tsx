import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    image:
      "https://vdnbihrqujhmmgnshhhn.supabase.co/storage/v1/object/public/products/Lucky%20Angpao%20(Website).png",
    title: "Lucky Angpao",
    subtitle: "Buy minimum Rp 1 million & receive 1 Angpao",
    cta: "Learn More",
    ctaLink: "/luckyangpau",
    tag: "01-31 JANUARY 2025",
  },

  {
    image:
      "https://vdnbihrqujhmmgnshhhn.supabase.co/storage/v1/object/public/products/Membership.png",
    title: "Join the LOOVers Club",
    subtitle:
      "Elevate your eyewear experience with exclusive perks, early access to new collections, and special member pricing.",
    cta: "Become a LOOVer",
    ctaLink: "/membership",
    tag: "Member Perks",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [api, setApi] = useState(null);

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
              <div className="relative w-full aspect-video overflow-hidden group">
                <img
                  src={slide.image}
                  alt={`Slide ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24">
                  <div className="max-w-2xl space-y-4">
                    <span className="inline-block px-3 py-1 sm:px-4 sm:py-1.5 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs sm:text-sm font-medium">
                      {slide.tag}
                    </span>
                    <h1
                      className={cn(
                        "text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white",
                        "opacity-0 translate-y-4 transition-all duration-150",
                        currentSlide === index && "opacity-100 translate-y-0",
                      )}
                    >
                      {slide.title}
                    </h1>
                    <p
                      className={cn(
                        "text-base sm:text-lg md:text-xl text-white/90 max-w-xl",
                        "opacity-0 translate-y-4 transition-all duration-150",
                        currentSlide === index && "opacity-100 translate-y-0",
                      )}
                    >
                      {slide.subtitle}
                    </p>
                    <a
                      href={slide.ctaLink}
                      className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4",
                        "bg-white text-black rounded-full font-medium text-sm sm:text-base",
                        "hover:bg-white/90 hover:gap-4 hover:px-8 sm:hover:px-10",
                        "transition-all duration-200 ease-out",
                        "opacity-0 translate-y-4",
                        currentSlide === index && "opacity-100 translate-y-0",
                      )}
                    >
                      {slide.cta}
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <button
          onClick={() => api?.scrollPrev()}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Previous slide"
        >
          <div className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/90 transition-all duration-150">
            <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:text-black" />
          </div>
        </button>
        <button
          onClick={() => api?.scrollNext()}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10"
          aria-label="Next slide"
        >
          <div className="p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/90 transition-all duration-150">
            <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:text-black" />
          </div>
        </button>
        <div className="absolute bottom-4 sm:bottom-8 left-0 right-0 flex justify-center gap-2 sm:gap-3 z-10">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="group relative"
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className={cn(
                  "h-1 sm:h-1.5 rounded-full transition-all duration-150",
                  currentSlide === index
                    ? "w-8 sm:w-12 bg-white"
                    : "w-4 sm:w-6 bg-white/40 group-hover:bg-white/60",
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
