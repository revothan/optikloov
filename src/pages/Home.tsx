import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { ShoppingBag, Tag } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

const Home = () => {
  const products = [
    {
      id: 1,
      name: "Classic Aviator",
      category: "Sunglasses",
      price: "2.499.000",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 2,
      name: "Modern Round",
      category: "Optical",
      price: "1.999.000",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
    },
    {
      id: 3,
      name: "Retro Square",
      category: "Sunglasses",
      price: "2.299.000",
      image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
    },
    {
      id: 4,
      name: "Minimalist Frame",
      category: "Optical",
      price: "1.799.000",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-16">
        <div className="absolute inset-0 grid grid-cols-2 -z-10 opacity-30">
          <div className="bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')] bg-cover bg-center"></div>
          <div className="bg-[url('https://images.unsplash.com/photo-1581092795360-fd1ca04f0952')] bg-cover bg-center"></div>
        </div>

        <div className="container mx-auto px-4 md:px-6 pt-24 pb-24">
          {/* Logo */}
          <div className="w-24 h-24 mx-auto flex items-center justify-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2 mb-16">
            <img 
              src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/" 
              alt="Optik LOOV Logo" 
              className="w-full h-full object-contain"
            />
          </div>

          {/* Hero Content */}
          <div className="text-center mb-16 relative z-10">
            <h1 className="text-6xl md:text-8xl font-thin tracking-wider mb-8 animate-fade-in">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
                Oh, this is LOOV
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto mb-8">
              Discover our curated collection of premium eyewear
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light mb-12">Featured Collections</h2>
          
          <Carousel className="w-full max-w-6xl mx-auto">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 overflow-hidden">
                    <div className="aspect-square relative overflow-hidden">
                      <img 
                        src={product.image}
                        alt={product.name}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Tag className="w-5 h-5 text-white/80" />
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-light">{product.name}</h3>
                          <p className="text-sm text-gray-400">{product.category}</p>
                        </div>
                        <p className="text-lg">Rp {product.price}</p>
                      </div>
                      <Button 
                        className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="bg-white/10 text-white border-white/20 hover:bg-white/20" />
            <CarouselNext className="bg-white/10 text-white border-white/20 hover:bg-white/20" />
          </Carousel>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl">
              <div className="aspect-square relative overflow-hidden rounded-xl mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                  alt="LOOV Collection" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-light mb-4">Sunglasses Collection</h3>
              <p className="text-gray-400 mb-6">Discover our curated selection of contemporary sunglasses</p>
              <Button 
                className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
              >
                Explore Collection
              </Button>
            </Card>

            <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl">
              <div className="aspect-square relative overflow-hidden rounded-xl mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                  alt="Visit Us" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-light mb-4">Optical Collection</h3>
              <p className="text-gray-400 mb-6">Explore our premium selection of optical frames</p>
              <Button 
                className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
              >
                Explore Collection
              </Button>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;