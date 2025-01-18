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

interface Review {
  author_name: string;
  rating: number;
  text: string;
  profile_photo_url: string;
  time: number;
}

const TestimonialSection = () => {
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
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Memuat ulasan...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error in TestimonialSection:", error);
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-red-500">Gagal memuat ulasan</div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">Belum ada ulasan</div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Apa Kata Mereka?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Pengalaman pelanggan kami yang telah mempercayakan kesehatan mata mereka kepada Optik LOOV
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto relative"
        >
          <CarouselContent>
            {reviews?.map((review, index) => (
              <CarouselItem
                key={index}
                className="md:basis-1/2 lg:basis-1/3"
              >
                <div
                  className={cn(
                    "bg-white p-6 rounded-xl shadow-lg h-full",
                    "transform transition-all duration-300 hover:scale-105",
                    "border border-gray-100"
                  )}
                >
                  <Quote className="w-8 h-8 text-primary mb-4 opacity-20" />
                  
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-4">{review.text}</p>

                  <div className="flex items-center mt-auto">
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <p className="font-semibold">{review.author_name}</p>
                      <p className="text-sm text-gray-500">
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
          <CarouselPrevious className="absolute -left-12 top-1/2" />
          <CarouselNext className="absolute -right-12 top-1/2" />
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;