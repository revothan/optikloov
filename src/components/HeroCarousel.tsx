import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AutoPlay from "embla-carousel-autoplay";

const HeroCarousel = () => {
  const plugin = AutoPlay({ delay: 6000 });

  return (
    <div className="w-full max-w-[1920px] mx-auto mt-16">
      {" "}
      {/* Removed pt-8/pt-16, added mt-16 for navbar space */}
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[plugin]}
        className="w-full relative"
      >
        <CarouselContent>
          <CarouselItem>
            <div className="relative w-full aspect-[16/9]">
              <img
                src="https://ucarecdn.com/1555baca-5e35-4376-9354-a6fad135de06/-/preview/1000x562/"
                alt="Carousel Image 1"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative w-full aspect-[16/9]">
              <img
                src="https://ucarecdn.com/1f1db06f-fe1e-4bb3-8fce-fae4482c0beb/-/preview/1000x562/"
                alt="Carousel Image 2"
                className="w-full h-full object-contain md:object-cover"
              />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-4" />
        <CarouselNext className="hidden md:flex right-4" />
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
