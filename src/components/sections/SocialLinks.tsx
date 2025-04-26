
import React from 'react';
import { Facebook, Instagram } from 'lucide-react';

const SocialLinks = () => {
  return (
    <div className="flex justify-center gap-6 py-12 fade-in">
      <a 
        href="https://www.facebook.com/share/1GK3MJ1WQw/?mibextid=wwXlfr" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-110 transform duration-200"
      >
        <Facebook size={32} />
      </a>
      <a 
        href="https://www.instagram.com/homeboy_barbershop?igsh=MTRmbHZyeGx0NTFxa==" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-gray-600 hover:text-gray-900 transition-colors hover:scale-110 transform duration-200"
      >
        <Instagram size={32} />
      </a>
    </div>
  );
};

export default SocialLinks;
