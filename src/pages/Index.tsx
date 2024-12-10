import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

const Index = () => {
  const handleAddToCalendar = () => {
    const event = {
      text: 'Optik LOOV Soft Opening',
      dates: '20241212T000000/20241212T235959',
      location: 'Ruko Downtown Drive Gading Serpong Blok DDBLV No. 016, Kel. Medang, Kec. Pagedangan, Kabupaten Tangerang, Banten 15334, Indonesia',
      details: 'Join us for the soft opening of Optik LOOV in Gading Serpong!'
    };

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.text)}&dates=${event.dates}&location=${encodeURIComponent(event.location)}&details=${encodeURIComponent(event.details)}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <div className="space-y-8 relative z-10">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-xl">
                <img
                  src="https://ucarecdn.com/f1e8a0de-f654-46bd-83f6-771d47116b66/-/preview/1000x1000/"
                  alt="Optik LOOV Logo"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight">
              <span className="block">Vision Meets Style at</span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-600 to-gray-900">
                Optik LOOV
              </span>
            </h1>

            {/* Description */}
            <p className="max-w-2xl mx-auto text-xl text-gray-600">
              Coming soon to Gading Serpong. Experience eyewear that combines 
              precision craftsmanship with contemporary design.
            </p>

            {/* CTA Button */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleAddToCalendar}
                className="bg-black text-white hover:bg-gray-800 transition-all duration-300 px-8 py-6 rounded-full text-lg group"
              >
                <Calendar className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Save the Date
              </Button>
            </div>

            {/* Location */}
            <div className="mt-16 p-6 bg-gray-50 rounded-2xl max-w-2xl mx-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                Visit Us Soon
              </h2>
              <p className="text-gray-600">
                Ruko Downtown Drive Gading Serpong Blok DDBLV No. 016,
                <br />
                Kel. Medang, Kec. Pagedangan,
                <br />
                Kabupaten Tangerang, Banten 15334
              </p>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-gray-100 to-gray-50 rounded-full blur-3xl opacity-50 -z-10" />
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-gray-100 to-gray-50 rounded-full blur-2xl opacity-30 -z-10" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-full blur-2xl opacity-30 -z-10" />
        </div>
      </div>
    </div>
  );
};

export default Index;