import { useQuery } from "@tanstack/react-query";
import { Star, Quote } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

interface Review {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url: string;
  time: number;
  original_language: string;
}

const TestimonialSection = () => {
  const autoplayRef = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  const { data: reviews, isLoading, error } = useQuery({
    queryKey: ["googleReviews"],
    queryFn: async () => {
      console.log("Fetching Google reviews...");
      const { data, error } = await supabase.functions.invoke("getgooglereviews");
      if (error) {
        console.error("Error fetching reviews:", error);
        throw error;
      }
      console.log("Reviews data:", data);
      return data.result.reviews as Review[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error in TestimonialSection:", error);
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-red-500">Failed to load reviews</div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-gray-500">No reviews yet</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base leading-relaxed">
            Real experiences shared by our valued customers who have trusted LOOV Optik for their eyewear needs
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[autoplayRef.current]}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews?.map((review, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div
                  className={cn(
                    "bg-white rounded-xl p-6 h-full",
                    "transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                    "border border-gray-100",
                    "flex flex-col gap-4",
                    "animate-fade-in"
                  )}
                  style={{
                    animationDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-200"
                        )}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed flex-grow">
                    "{review.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{review.author_name}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(review.time * 1000).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden md:block">
            <CarouselPrevious className="absolute -left-4 top-1/2 transition-transform duration-300 hover:scale-110" />
            <CarouselNext className="absolute -right-4 top-1/2 transition-transform duration-300 hover:scale-110" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;