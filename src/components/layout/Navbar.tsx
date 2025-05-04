
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

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/#about' },
    { label: 'Services', href: '/#services' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Products', href: '/products' },
    { label: 'Contact', href: '/#contact' },
    { label: 'Book', href: '/#booking' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    if (href.includes('#')) {
      const hash = href.substring(href.indexOf('#'));
      return location.hash === hash;
    }
    return location.pathname === href;
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
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-3 py-2 text-sm hover:text-black transition-colors ${
                    isActive(item.href) ? 'text-black font-medium' : 'text-gray-600'
                  }`}
                >
                  {item.label}
                </Link>
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
              <Link
                key={item.label}
                to={item.href}
                className={`px-3 py-4 text-lg border-b border-gray-100 ${
                  isActive(item.href) ? 'text-black font-medium' : 'text-gray-600'
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
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
