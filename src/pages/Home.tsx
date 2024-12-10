import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="p-4 md:p-6">
        <div className="w-24 h-24 mx-auto flex items-center justify-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-2">
          <img 
            src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/" 
            alt="Optik LOOV Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 md:px-6 pt-12 pb-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-thin tracking-wider mb-8 animate-fade-in">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-300 to-white">
              Oh, this is LOOV
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
            Experience eyewear differently at Gading Serpong's newest optical destination
          </p>
        </div>

        {/* Featured Content */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-2xl">
            <div className="aspect-square relative overflow-hidden rounded-xl mb-6">
              <img 
                src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/"
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
                src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/"
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
      </main>
    </div>
  );
};

export default Home;