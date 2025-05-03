
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

type NavbarProps = {
  onBookNow: () => void;
}

const Navbar = ({ onBookNow }: NavbarProps) => {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/1146c6dd-75d5-441d-94e3-2b25ee10bdd5.png" 
            alt="HOMEBOY Barbing Saloon Logo" 
            className="h-20 w-auto"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#home" className="text-gray-900 hover:text-black">Home</a>
          <a href="#about" className="text-gray-900 hover:text-black">About</a>
          <a href="#services" className="text-gray-900 hover:text-black">Services</a>
          <a href="#gallery" className="text-gray-900 hover:text-black">Gallery</a>
          <a href="#contact" className="text-gray-900 hover:text-black">Contact</a>
        </nav>
        <Button onClick={onBookNow} className="bg-gray-900 text-white hover:bg-gray-800">
          Book Appointment
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
