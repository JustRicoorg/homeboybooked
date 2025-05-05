
import React, { useState, useEffect } from 'react';
import { GalleryHorizontal } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import SocialLinks from './SocialLinks';
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: number;
  image_url: string;
}

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*')
          .order('id');
        
        if (error) {
          console.error('Error fetching gallery images:', error);
          return;
        }
        
        setImages(data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryImages();
  }, []);

  return (
    <section id="gallery" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-2 mb-2 fade-in">
          <GalleryHorizontal className="w-6 h-6" />
          <h2 className="text-3xl font-bold text-center">Our Gallery</h2>
        </div>
        <p className="text-gray-600 text-center mb-12 fade-in">Check out our latest work</p>
        
        {loading ? (
          <div className="text-center py-12">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">No images in the gallery</div>
        ) : (
          <div className="max-w-5xl mx-auto mb-12">
            <Carousel className="w-full">
              <CarouselContent>
                {images.map((image) => (
                  <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="relative aspect-square p-1">
                      <img 
                        src={image.image_url} 
                        alt={`Gallery image ${image.id}`} 
                        className="w-full h-full object-cover rounded-lg shadow-md hover:opacity-90 transition-opacity hover:scale-105 transform duration-200 fade-in" 
                        loading="lazy"
                        onError={(e) => {
                          console.error(`Failed to load image: ${image.image_url}`);
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
        )}

        <div className="text-center mb-4">
          <h3 className="text-lg font-medium text-gray-800">See more on our social media</h3>
        </div>
        <SocialLinks />
      </div>
    </section>
  );
};

export default Gallery;
