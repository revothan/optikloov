import React from 'react';

const BrandSection = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-16">
            {/* Frames and Lenses Section */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-8">Frames and Lenses Available</h2>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-8">
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/da2dbe7e-6b65-4e7f-b761-6c5e7f7308d7/-/preview/500x500/" alt="Oakley" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/e6f6d9ed-cf22-416e-b379-27f77929da57/-/preview/500x500/" alt="Rayban" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/942db4ad-4a42-498f-9cca-76ac9ad803a3/-/preview/500x500/" alt="Armani Exchange" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/ddbbc662-70de-4217-b6cf-89d6802ed5d2/-/preview/500x500/" alt="Vogue" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/f5956a68-4c9c-4049-9f1a-300a5fcbd3d3/-/preview/500x500/" alt="Braun Buffel" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/e51159cb-40db-495f-9331-cfa4009dcc94/-/preview/500x500/" alt="Esprit" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/c27e13af-b659-4cde-9dd1-09f5242cc9f7/-/preview/500x500/" alt="Hummer" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/bab53c37-ebf5-4844-ba63-e0695678ede4/-/preview/500x500/" alt="Nike" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/e6ca0367-078c-4547-acf5-405fe90cd944/-/preview/500x500/" alt="New Balance" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 text-gray-500 italic">
                  and many more
                </div>
              </div>
            </div>

            {/* Lens Partners Section */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-8">Supporting Lens Partners</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/c71639f5-d20d-402a-92b5-f8b83258881d/-/preview/500x500/" alt="Essilor" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/04258255-193f-4584-80a3-df9215c4bdb2/-/preview/500x500/" alt="Nikon" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/e7dd5942-e693-4754-a765-c9d508837800/-/preview/500x500/" alt="Kodak Lens" className="h-20 object-contain" />
                </div>
                <div className="flex flex-col items-center justify-center p-4 grayscale hover:grayscale-0 transition-all duration-300">
                  <img src="https://ucarecdn.com/5b2918bc-f590-4413-928e-e38a4e950655/-/preview/500x500/" alt="Polycore" className="h-20 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;