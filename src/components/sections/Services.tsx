import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
};
type ServicesProps = {
  services: Service[];
  onBookService: (service: Service) => void;
};
const Services = ({
  services,
  onBookService
}: ServicesProps) => {
  const {
    toast
  } = useToast();
  return <section id="services" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-2 text-center">Our Services</h2>
        <p className="text-gray-600 text-center mb-12">Quality haircuts and styling services</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map(service => <div key={service.id} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-2 text-center">{service.name}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">${service.price}</span>
                <Button onClick={() => onBookService(service)} variant="outline" className="border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                  Book Now
                </Button>
              </div>
            </div>)}
        </div>
      </div>
    </section>;
};
export default Services;