
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import AboutUs from "@/components/sections/AboutUs";
import Gallery from "@/components/sections/Gallery";
import Contact from "@/components/sections/Contact";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import BookingForm from "@/components/sections/BookingForm";
import Footer from "@/components/layout/Footer";
import { fetchServices } from "@/services/serviceApi";
import { Service } from "@/types/service";

const Index = () => {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const servicesData = await fetchServices();
        setServices(servicesData);
      } catch (error: any) {
        toast({
          title: "Error fetching services",
          description: error.message || "Could not load services",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [toast]);

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
      {loading ? (
        <div className="py-20 text-center">
          <p>Loading services...</p>
        </div>
      ) : (
        <Services services={services} onBookService={handleBookService} />
      )}
      <Gallery />
      <Contact />
      <BookingForm services={services} selectedService={selectedService} />
      <Footer />
    </div>
  );
};

export default Index;
