
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import AboutUs from "@/components/sections/AboutUs";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import BookingForm from "@/components/sections/BookingForm";
import Footer from "@/components/layout/Footer";
import { services as serviceData } from "@/data/services";
import { Service } from "@/data/services";

const Index = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  const scrollToBooking = () => {
    const bookingSection = document.getElementById('booking');
    bookingSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToServices = () => {
    const servicesSection = document.getElementById('services');
    servicesSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookService = (service: Service) => {
    setSelectedService(service.name);
    
    setTimeout(() => {
      const bookingSection = document.getElementById('booking');
      bookingSection?.scrollIntoView({ behavior: 'smooth' });
      
      toast({
        title: "Service selected",
        description: `${service.name} has been selected for booking.`
      });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onBookNow={scrollToBooking} />
      <Hero onViewServices={scrollToServices} onBookNow={scrollToBooking} />
      <AboutUs />
      <Services services={serviceData} onBookService={handleBookService} />
      <Gallery />
      <Contact />
      <BookingForm services={serviceData} selectedService={selectedService} />
      <Footer />
    </div>
  );
};

export default Index;

