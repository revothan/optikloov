const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="container mx-auto px-8 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-xl font-bold mb-2">Optik LOOV</h3>
            <p className="text-gray-400 mb-1">PT. Loovindo Optima Vision</p>
            <p className="text-gray-400 mb-4 max-w-md">
              Ruko Downtown Drive Blok DDBLV No 016, Banten, Tangerang,
              Indonesia, 15334
            </p>
            <p className="text-gray-400 mb-1">
              <a
                href="mailto:optik.loov@gmail.com"
                className="hover:text-white transition-colors"
              >
                optik.loov@gmail.com
              </a>
            </p>
            <p className="text-gray-400">
              <a
                href="tel:+6281283335568"
                className="hover:text-white transition-colors"
              >
                +62 81283335568
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <div className="space-y-3">
              <p>
                <a
                  href="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
              </p>
              <p>
                <a
                  href="/products"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Produk
                </a>
              </p>
              <p>
                <a
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </p>
              <p>
                <a
                  href="/membership"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  LOOVERS Memberships
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
