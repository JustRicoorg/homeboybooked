
import React from 'react';
import { Contact as ContactIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ContactIcon className="w-6 h-6" />
          <h2 className="text-3xl font-bold text-center">Contact Us</h2>
        </div>
        <p className="text-gray-600 text-center mb-12">Get in touch with us</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Visit Our Shop</h3>
              <p className="text-gray-600">123 Barber Street,</p>
              <p className="text-gray-600">Cityville, State 12345</p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
              <div className="space-y-2">
                <p className="text-gray-600">Monday - Friday: 9am - 8pm</p>
                <p className="text-gray-600">Saturday: 9am - 6pm</p>
                <p className="text-gray-600">Sunday: 10am - 4pm</p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Info</h3>
              <p className="text-gray-600">Phone: (123) 456-7890</p>
              <p className="text-gray-600">Email: info@homeboy.com</p>
            </div>
          </div>
          
          <form className="space-y-4 bg-gray-100 p-6 rounded-lg">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="name" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" className="w-full px-4 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea id="message" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-md"></textarea>
            </div>
            <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800">
              Send Message
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
