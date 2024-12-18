import {
  Star,
  Award,
  Crown,
  Percent,
  Coins,
  Clock,
  Gift,
  Sparkles,
  Wrench,
  Glasses,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const MembershipTier = ({
  name,
  icon: Icon,
  discount,
  points,
  requirement,
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

const BenefitItem = ({
  icon: Icon,
  title,
}: {
  icon: React.ComponentType<any>;
  title: string;
}) => (
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
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 pb-8 text-center">
        <h1 className="text-4xl font-bold mb-4">LOOVERS MEMBERSHIP</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our exclusive membership program and enjoy premium benefits,
          special discounts, and unique privileges.
        </p>
      </div>

      {/* Membership Tiers */}
      <div className="container mx-auto px-4 py-12">
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
        {/* Sign Up Button */}
        <div className="text-center mt-8">
          <a
            href="https://optikloov.myolsera.com/account/sign-in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-800 transition-colors"
          >
            Sign Up Now
          </a>
        </div>
      </div>

      {/* All Member Benefits */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">
            All Members Benefits
          </h2>
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
              icon={Wrench}
              title="Free Minor Repairs: Complimentary minor eyewear repairs"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Membership;
