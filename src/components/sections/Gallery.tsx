
import React from 'react';
import { GalleryHorizontal } from 'lucide-react';

const Gallery = () => {
  return (
    <section id="gallery" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <GalleryHorizontal className="w-6 h-6" />
          <h2 className="text-3xl font-bold text-center">Our Gallery</h2>
        </div>
        <p className="text-gray-600 text-center mb-12">Check out our latest work</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity cursor-pointer">
              <p className="text-gray-500">Gallery Image {item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
