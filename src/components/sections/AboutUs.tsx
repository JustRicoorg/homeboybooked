
import React from 'react';

const AboutUs = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">About Us</h2>
        <p className="text-gray-600 text-center mb-12">Excellence in grooming since 2010</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-gray-900">Your Premier Grooming Destination</h3>
            <p className="text-gray-600">At Homeboy Barbing Saloon, we believe that every haircut tells a story. Our skilled barbers combine traditional techniques with modern styles to create looks that are uniquely yours.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-bold text-xl text-gray-900">10+</h4>
                <p className="text-gray-600">Years Experience</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <h4 className="font-bold text-xl text-gray-900">5000+</h4>
                <p className="text-gray-600">Happy Clients</p>
              </div>
            </div>
          </div>
          <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">About Image</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
