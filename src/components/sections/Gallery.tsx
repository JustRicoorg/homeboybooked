
import React from 'react';
import { GalleryHorizontal } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import SocialLinks from './SocialLinks';

const Gallery = () => {
  const images = [
    '/lovable-uploads/4d036331-626b-4aaa-a83e-38ba6e9e9299.png',
    '/lovable-uploads/0a5af72d-c152-4a91-a06b-06e19608f699.png',
    '/lovable-uploads/f78f7a7d-771a-4206-bd67-6c80860c2b84.png',
    '/lovable-uploads/1ea2e1e6-3e25-4c59-8d4b-b12f9c09eb08.png',
    '/lovable-uploads/ad7bbf1d-e4be-4b08-9209-3f6f2bd06c48.png',
    '/lovable-uploads/619e41c6-e0d6-4cc2-b7dd-69d9fa23ed2e.png'
  ];

  return (
    <section id="gallery" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2 fade-in">
          <GalleryHorizontal className="w-6 h-6" />
          <h2 className="text-3xl font-bold text-center">Our Gallery</h2>
        </div>
        <p className="text-gray-600 text-center mb-12 fade-in">Check out our latest work</p>
        
        <div className="max-w-5xl mx-auto mb-12">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative aspect-square p-1">
                    <img 
                      src={image} 
                      alt={`Gallery image ${index + 1}`} 
                      className="w-full h-full object-cover rounded-lg shadow-md hover:opacity-90 transition-opacity hover:scale-105 transform duration-200 fade-in" 
                      loading="lazy"
                      onError={(e) => {
                        console.error(`Failed to load image: ${image}`);
                        e.currentTarget.src = '/placeholder.svg'; // Fallback to placeholder
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <div className="text-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">See more on our social media</h3>
        </div>
        <SocialLinks />
      </div>
    </section>
  );
};

export default Gallery;
