import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <img 
          src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/" 
          alt="Optik LOOV Logo" 
          className="w-12 h-12 object-contain"
        />
        <Link 
          to="/countdown" 
          className="text-black hover:text-gray-600 transition-colors flex items-center gap-2"
        >
          View Countdown <ChevronRight className="w-4 h-4" />
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_0),linear-gradient(180deg,rgba(0,0,0,.03)_1px,transparent_0)] bg-[size:4rem_4rem]" />
        <div className="absolute right-0 top-20 w-72 h-72 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute left-20 bottom-20 w-96 h-96 bg-black/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl">
            <h1 className="text-6xl md:text-8xl font-bold text-black mb-6 leading-tight">
              See the world 
              <span className="block">through LOOV</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-xl">
              Experience precision crafted eyewear that combines style with comfort. 
              Visit our new store in Gading Serpong.
            </p>
            <div className="flex gap-4 items-center">
              <Button 
                className="bg-black text-white hover:bg-black/90 text-lg px-8 py-6 rounded-full"
                onClick={() => window.open("https://maps.app.goo.gl/hcD6zrygFpeKo2Nn6", "_blank")}
              >
                Visit Store <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Link 
                to="/countdown" 
                className="text-black hover:text-gray-600 transition-colors underline underline-offset-4"
              >
                View Opening Details
              </Link>
            </div>
          </div>

          {/* Location pill */}
          <div className="absolute bottom-8 right-8 bg-black/5 backdrop-blur-sm px-6 py-3 rounded-full">
            <p className="text-sm text-gray-600">
              Ruko Downtown Drive Gading Serpong
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;