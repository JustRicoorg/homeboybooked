
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onBookNow?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onBookNow }) => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    closeMenu();
    if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems = [
    { label: 'Home', action: () => {
      closeMenu();
      if (location.pathname !== '/') {
        window.location.href = '/';
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }},
    { label: 'About', action: () => scrollToSection('about') },
    { label: 'Services', action: () => scrollToSection('services') },
    { label: 'Gallery', action: () => scrollToSection('gallery') },
    { label: 'Products', action: () => {
      closeMenu();
      window.location.href = '/products';
    }},
    { label: 'Contact', action: () => scrollToSection('contact') },
  ];

  const isActive = (label: string) => {
    if (label === 'Home') return location.pathname === '/' && !location.hash;
    if (label === 'Products') return location.pathname === '/products';
    if (location.hash) {
      const hash = location.hash.substring(1);
      return label.toLowerCase() === hash;
    }
    return false;
  };

  return (
    <nav className={`py-3 px-4 lg:px-8 fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/3cbbe2f3-abf0-417b-80f1-069a5e6fe457.png" 
            alt="Homeboy Barbing Shop Logo" 
            className="h-16 w-auto"
          />
        </Link>

        {/* Mobile menu button */}
        {isMobile && (
          <button onClick={toggleMenu} className="text-[#1A1F2C] focus:outline-none">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        )}

        {/* Desktop menu */}
        {!isMobile && (
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 mr-4">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className={`px-3 py-2 text-sm hover:text-black transition-colors ${
                    isActive(item.label) ? 'text-black font-medium' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {onBookNow && (
              <Button className="bg-[#1A1F2C] text-white hover:bg-black" onClick={onBookNow}>
                Book Appointment
              </Button>
            )}
          </div>
        )}

        {/* Mobile menu */}
        {isMobile && isMenuOpen && (
          <div className="fixed inset-0 top-[61px] bg-white z-40 flex flex-col p-4">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className={`px-3 py-4 text-lg border-b border-gray-100 text-left ${
                  isActive(item.label) ? 'text-black font-medium' : 'text-gray-600'
                }`}
              >
                {item.label}
              </button>
            ))}
            {onBookNow && (
              <div className="mt-4 px-3">
                <Button className="bg-[#1A1F2C] text-white hover:bg-black w-full" onClick={() => {
                  closeMenu();
                  onBookNow();
                }}>
                  Book Appointment
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
