import React from 'react';
import { Contact as ContactIcon } from 'lucide-react';
import Map from './Map';
const Contact = () => {
  return <section id="contact" className="py-20 bg-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2 fade-in">
          <ContactIcon className="w-6 h-6" />
          <h2 className="text-3xl font-bold text-center">Contact Us</h2>
        </div>
        <p className="text-gray-600 text-center mb-12 fade-in">Get in touch with us</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 slide-in-from-left, m-20 bg-gray-200 px-0 mx-[33px]">
            <div>
              <h3 className="text-xl font-semibold mb-4">Visit Our Shop</h3>
              <p className="text-gray-600">Serekunda, Near the Newac</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Monday - Saturday: 10am - 9pm</p>
                <p className="text-gray-600">Sunday: 10am - 8pm</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-600">Phone: (220) 3450445/7979780</p>
              <p className="text-gray-600">Email: info@homeboy.com</p>
            </div>
          </div>
          
          <div className="slide-in-from-right">
            <Map />
          </div>
        </div>
      </div>
    </section>;
};
export default Contact;