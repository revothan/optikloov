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
  original_language: string;
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
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-400">Memuat ulasan...</div>
      </div>
    );
  }

  if (error) {
    console.error("Error in TestimonialSection:", error);
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50">
        <div className="text-red-500">Gagal memuat ulasan</div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Belum ada ulasan</div>
      </div>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
            Apa Kata Mereka?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Ulasan langsung dari pelanggan kami yang telah merasakan pengalaman berbelanja di Optik LOOV
          </p>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {reviews?.map((review, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <div
                  className={cn(
                    "bg-white p-8 rounded-2xl shadow-lg h-full",
                    "transform transition-all duration-300 hover:scale-102 hover:shadow-xl",
                    "border border-gray-100",
                    "flex flex-col"
                  )}
                >
                  <Quote className="w-10 h-10 text-primary mb-6 opacity-20" />
                  
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5",
                          i < review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>

                  <p className="text-gray-700 mb-6 flex-grow text-lg leading-relaxed">
                    {review.text}
                  </p>

                  <div className="flex items-center mt-auto pt-6 border-t border-gray-100">
                    <img
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      className="w-12 h-12 rounded-full mr-4 border-2 border-primary/10"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{review.author_name}</p>
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
          <div className="hidden md:block">
            <CarouselPrevious className="absolute -left-12 top-1/2" />
            <CarouselNext className="absolute -right-12 top-1/2" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default TestimonialSection;