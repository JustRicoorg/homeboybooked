import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
type HeroProps = {
  onViewServices: () => void;
  onBookNow: () => void;
};
const Hero = ({
  onViewServices,
  onBookNow
}: HeroProps) => {
  return <section id="home" className="bg-gray-900 text-white py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 pt-24 md:pt-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Haircuts & Styling</h1>
          <p className="text-xl mb-8">Experience the best haircut and styling at Homeboy Barbing Saloon. We pride ourselves on quality service.</p>
          <div className="flex gap-4">
            <Button onClick={onViewServices} variant="outline" className="border-grey hover:bg-white text-black">
              View Services
            </Button>
            <Button onClick={onBookNow} className="bg-white text-[#1A1F2C] hover:bg-gray-200">
              Book Now <ArrowRight className="ml-2" size={16} />
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          {/* The image has been removed as requested */}
        </div>
      </div>
    </section>;
};
export default Hero;