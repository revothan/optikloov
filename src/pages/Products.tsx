import { Link } from "react-router-dom";

const Products = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-sm border-b z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <img 
              src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/" 
              alt="Optik LOOV Logo" 
              className="w-12 h-12 object-contain"
            />
            <div className="flex gap-8">
              <Link to="/" className="text-black hover:text-gray-600 transition-colors">
                Home
              </Link>
              <Link to="/products" className="text-black hover:text-gray-600 transition-colors">
                Produk
              </Link>
              <Link to="/contact" className="text-black hover:text-gray-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content with Coming Soon Animation */}
      <div className="min-h-screen flex items-center justify-center pt-20">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.03)_1px,transparent_0),linear-gradient(180deg,rgba(0,0,0,.03)_1px,transparent_0)] bg-[size:4rem_4rem]" />
        <div className="absolute right-0 top-20 w-72 h-72 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute left-20 bottom-20 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        
        <h1 className="text-6xl md:text-8xl font-bold text-black relative z-10">
          <span className="block animate-in fade-in slide-in-from-bottom duration-700">
            Coming Soon
          </span>
        </h1>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-2">Optik LOOV</h3>
              <p className="text-gray-400 mb-1">PT. Loovindo Optima Vision</p>
              <p className="text-gray-400 mb-4 max-w-md">
                Ruko Downtown Drive Blok DDBLV No 016, Banten, Tangerang, Indonesia, 15334
              </p>
              <p className="text-gray-400 mb-1">
                <a href="mailto:optik.loov@gmail.com" className="hover:text-white transition-colors">
                  optik.loov@gmail.com
                </a>
              </p>
              <p className="text-gray-400">
                <a href="tel:+6281283335568" className="hover:text-white transition-colors">
                  +62 81283335568
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-6">Quick Links</h3>
              <div className="space-y-3">
                <p>
                  <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </p>
                <p>
                  <Link to="/products" className="text-gray-400 hover:text-white transition-colors">
                    Produk
                  </Link>
                </p>
                <p>
                  <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </p>
                <p>
                  <Link to="/countdown" className="text-gray-400 hover:text-white transition-colors">
                    Store Opening
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Products;