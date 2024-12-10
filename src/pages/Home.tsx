import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <main className="pt-16">
        {/* Background Image Grid */}
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
              Experience eyewear differently at Gading Serpong's newest optical destination
            </p>
            <Button 
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300 px-8 py-6 text-lg"
            >
              Explore Collections
            </Button>
          </div>

          {/* Featured Content */}
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl">
              <div className="aspect-square relative overflow-hidden rounded-xl mb-6">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                  alt="LOOV Collection" 
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-2xl font-light mb-4">The LOOV Collection</h3>
              <p className="text-gray-400 mb-6">Discover our curated selection of contemporary eyewear</p>
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
              <h3 className="text-2xl font-light mb-4">Visit Our Store</h3>
              <p className="text-gray-400 mb-6">Find us at Gading Serpong's Downtown Drive</p>
              <Button 
                className="w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 transition-all duration-300"
                onClick={() => window.location.href = '/'}
              >
                Get Directions
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;