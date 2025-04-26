
import React from 'react';
import { GalleryHorizontal } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SocialLinks from './SocialLinks';

const Gallery = () => {
  const images = [
    '/lovable-uploads/c4cefe4e-ad73-4201-a550-1602b9ac7b3a.png',
    '/lovable-uploads/a7d8c85b-08a2-4c0a-824d-332d75bb2876.png',
    '/lovable-uploads/15a88730-ce0a-44b4-a8a2-b4bf54406173.png',
    '/lovable-uploads/04bb4c83-fc58-4981-ad7d-a3f00db47c4b.png',
    '/lovable-uploads/b5edb523-4e3d-4f50-9231-55689eb0d56f.png',
    '/lovable-uploads/f48963f4-31c1-459c-b820-76e6e9646648.png'
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
                  <div className="relative aspect-square">
                    <img 
                      src={image} 
                      alt={`Gallery image ${index + 1}`}
                      className="object-cover w-full h-full rounded-lg hover:opacity-90 transition-opacity cursor-pointer hover:scale-105 transform duration-200 fade-in"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        <SocialLinks />
      </div>
    </section>
  );
};

export default Gallery;
