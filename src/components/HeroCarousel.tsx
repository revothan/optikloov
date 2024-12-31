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
    cta: "Become a LOOVers",
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
              <div className="relative w-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] overflow-hidden group">
                <img
                  src={slide.image}
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

        {/* Desktop Navigation */}
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

        {/* Mobile Navigation */}
        <div className="sm:hidden absolute bottom-8 left-0 right-0 px-4 flex justify-between items-center z-10">
          <div className="flex gap-3">
            <button
              onClick={() => api?.scrollPrev()}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/90 transition-all duration-150"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 text-white hover:text-black" />
            </button>
            <button
              onClick={() => api?.scrollNext()}
              className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/90 transition-all duration-150"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 text-white hover:text-black" />
            </button>
          </div>

          {/* Pagination dots */}
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className="group relative"
                aria-label={`Go to slide ${index + 1}`}
              >
                <div
                  className={cn(
                    "h-1 rounded-full transition-all duration-150",
                    currentSlide === index
                      ? "w-8 bg-white"
                      : "w-4 bg-white/40 group-hover:bg-white/60",
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Pagination */}
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
