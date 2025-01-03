import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Products = () => {
  return (
    <>
      {/* Navigation */}
      <Navbar />
      <div className="min-h-screen bg-white pt-12">
        {" "}
        {/* Adjust pt-12 for more space between navbar and body */}
        {/* Coming Soon Section */}
        <div className="min-h-[50vh] flex flex-col items-center justify-center pt-20">
          <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <Loader className="w-16 h-16 animate-spin text-gray-400 mx-auto" />
            <h1 className="text-6xl font-bold text-gray-900">Coming Soon</h1>
            <p className="text-xl text-gray-600 max-w-md mx-auto">
              We're working on something amazing. Stay tuned!
            </p>
            <Button
              className="mt-8 mb-12"
              onClick={() => window.history.back()}
            >
              Go Back
            </Button>
          </div>
        </div>
        {/* Additional Spacer */}
        <div className="min-h-[20vh]" /> {/* Adjust the height as needed */}
        <Footer />
      </div>
    </>
  );
};

export default Products;
