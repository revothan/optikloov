import { Star, Award, Crown, Percent, Coins, Clock, Gift, Sparkles, Tool, Glasses } from "lucide-react";

const MembershipTier = ({ 
  name, 
  icon: Icon, 
  discount, 
  points, 
  requirement 
}: { 
  name: string;
  icon: React.ComponentType<any>;
  discount: string;
  points: string;
  requirement?: string;
}) => (
  <div className="relative p-8 rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
    <div className="mb-6 inline-block rounded-lg bg-black/5 p-3">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="mb-2 text-xl font-semibold">{name}</h3>
    <div className="space-y-4 text-gray-600">
      <div className="flex items-start gap-2">
        <Percent className="mt-1 h-4 w-4 shrink-0" />
        <span>{discount}</span>
      </div>
      <div className="flex items-start gap-2">
        <Coins className="mt-1 h-4 w-4 shrink-0" />
        <span>{points}</span>
      </div>
      {requirement && (
        <div className="flex items-start gap-2">
          <Clock className="mt-1 h-4 w-4 shrink-0" />
          <span className="text-sm">{requirement}</span>
        </div>
      )}
    </div>
  </div>
);

const BenefitItem = ({ icon: Icon, title }: { icon: React.ComponentType<any>; title: string }) => (
  <div className="flex items-center gap-3">
    <div className="rounded-lg bg-black/5 p-2">
      <Icon className="h-5 w-5" />
    </div>
    <span>{title}</span>
  </div>
);

const Membership = () => {
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
              <a href="/" className="text-black hover:text-gray-600 transition-colors">
                Home
              </a>
              <a href="/products" className="text-black hover:text-gray-600 transition-colors">
                Produk
              </a>
              <a href="/membership" className="text-black hover:text-gray-600 transition-colors">
                Membership
              </a>
              <a href="/contact" className="text-black hover:text-gray-600 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 text-center">
        <h1 className="text-4xl font-bold mb-4">LOOVERS MEMBERSHIP</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our exclusive membership program and enjoy premium benefits, special discounts, and unique privileges.
        </p>
      </div>

      {/* Membership Tiers */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <MembershipTier
            name="Classic"
            icon={Star}
            discount="5% discount on frames and lenses"
            points="Earn loyalty points on every purchase (1 point = Rp1)"
          />
          <MembershipTier
            name="Premium"
            icon={Award}
            discount="10% discount on frames and lenses"
            points="Earn 5% loyalty points from total spending"
            requirement="Minimum spending of Rp 5,000,000 within 3 years"
          />
          <MembershipTier
            name="Elite"
            icon={Crown}
            discount="15% discount on frames and lenses"
            points="Earn 5% loyalty points from total spending"
            requirement="Minimum spending of Rp 25,000,000 within 3 years"
          />
        </div>
      </div>

      {/* All Member Benefits */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">All Members Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BenefitItem
              icon={Gift}
              title="Priority Promo: Early access to special promotions"
            />
            <BenefitItem
              icon={Sparkles}
              title="Priority Products: Access to new releases and special products"
            />
            <BenefitItem
              icon={Glasses}
              title="Free Eyewear Cleaning: Complimentary eyewear cleaning service"
            />
            <BenefitItem
              icon={Tool}
              title="Free Minor Repairs: Complimentary minor eyewear repairs"
            />
          </div>
        </div>
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
                  <a href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </p>
                <p>
                  <a href="/products" className="text-gray-400 hover:text-white transition-colors">
                    Produk
                  </a>
                </p>
                <p>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </p>
                <p>
                  <a href="/countdown" className="text-gray-400 hover:text-white transition-colors">
                    Store Opening
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Membership;