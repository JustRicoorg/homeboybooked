import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowRight, Calendar, Check, User } from "lucide-react";
import { useState } from "react";
const Index = () => {
  const {
    toast
  } = useToast();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  return <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl text-[#1A1F2C]">HOMEBOY</span>
            <span className="text-sm text-[#8E9196]">Barbing Saloon</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-[#1A1F2C] hover:text-black">Home</a>
            <a href="#services" className="text-[#1A1F2C] hover:text-black">Services</a>
            <a href="#booking" className="text-[#1A1F2C] hover:text-black">Book Now</a>
          </nav>
          <Button onClick={() => {
          setIsBookingOpen(true);
          setTimeout(() => {
            const bookingSection = document.getElementById('booking');
            bookingSection?.scrollIntoView({
              behavior: 'smooth'
            });
          }, 100);
        }} className="bg-[#1A1F2C] text-white hover:bg-[#151a24]">
            Book Appointment
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-r from-[#1a1f2c] to-[#2c3345] text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Professional Haircuts & Styling</h1>
            <p className="text-xl mb-8">Experience the best haircut and styling at Homeboy Barbing Saloon. We pride ourselves on quality service.</p>
            <div className="flex gap-4">
              <Button onClick={() => {
              const servicesSection = document.getElementById('services');
              servicesSection?.scrollIntoView({
                behavior: 'smooth'
              });
            }} variant="outline" className="border-white hover:bg-white text-black">
                View Services
              </Button>
              <Button onClick={() => {
              setIsBookingOpen(true);
              setTimeout(() => {
                const bookingSection = document.getElementById('booking');
                bookingSection?.scrollIntoView({
                  behavior: 'smooth'
                });
              }, 100);
            }} className="bg-white text-[#1A1F2C] hover:bg-gray-200">
                Book Now <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md aspect-square bg-[#F1F1F1] rounded-lg flex items-center justify-center">
              <div className="text-[#8E9196] text-center">
                <p>Barber Image</p>
                <p className="text-sm">(Upload your barber shop image here)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services/Pricing Section */}
      <section id="services" className="py-20 bg-[#F1F1F1]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Our Services</h2>
          <p className="text-[#8E9196] text-center mb-12">Quality haircuts and styling services</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map(service => <div key={service.id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                <p className="text-[#8E9196] mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">${service.price}</span>
                  <Button onClick={() => {
                setIsBookingOpen(true);
                setTimeout(() => {
                  const bookingSection = document.getElementById('booking');
                  bookingSection?.scrollIntoView({
                    behavior: 'smooth'
                  });

                  // Pre-select this service in the booking form
                  const serviceInput = document.getElementById('service') as HTMLSelectElement;
                  if (serviceInput) {
                    serviceInput.value = service.name;
                  }
                  toast({
                    title: "Service selected",
                    description: `${service.name} has been selected for booking.`
                  });
                }, 100);
              }} variant="outline" className="border-[#1A1F2C] text-[#1A1F2C] hover:bg-[#1A1F2C] hover:text-white">
                    Book Now
                  </Button>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2 text-center">Book an Appointment</h2>
          <p className="text-[#8E9196] text-center mb-12">Schedule your next haircut with us</p>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#F1F1F1] p-6 md:p-8 rounded-lg">
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block mb-2 font-medium">Your Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="text-gray-400" size={16} />
                      </div>
                      <input type="text" id="name" className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" placeholder="John Doe" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
                    <input type="email" id="email" className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" placeholder="john@example.com" required />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
                    <input type="tel" id="phone" className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" placeholder="(123) 456-7890" required />
                  </div>
                  <div>
                    <label htmlFor="service" className="block mb-2 font-medium">Service</label>
                    <select id="service" className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" required>
                      <option value="">Select a service</option>
                      {services.map(service => <option key={service.id} value={service.name}>{service.name} - ${service.price}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="date" className="block mb-2 font-medium">Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Calendar className="text-gray-400" size={16} />
                      </div>
                      <input type="date" id="date" className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" required />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="time" className="block mb-2 font-medium">Time</label>
                    <select id="time" className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" required>
                      <option value="">Select a time</option>
                      {timeSlots.map((time, index) => <option key={index} value={time}>{time}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="notes" className="block mb-2 font-medium">Additional Notes</label>
                  <textarea id="notes" className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" placeholder="Any specific requests or notes about your haircut..."></textarea>
                </div>
                <Button type="submit" className="w-full bg-[#1A1F2C] text-white hover:bg-[#151a24]">
                  Book Appointment
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1F2C] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">HOMEBOY</h3>
              <p className="text-[#8E9196]">Professional Barbing Saloon providing quality haircuts and styling services.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact Us</h3>
              <address className="text-[#8E9196] not-italic">
                <p>123 Barber Street,</p>
                <p>Cityville, State 12345</p>
                <p className="mt-2">Phone: (123) 456-7890</p>
                <p>Email: info@homeboy.com</p>
              </address>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Opening Hours</h3>
              <ul className="text-[#8E9196]">
                <li className="flex justify-between mb-1">
                  <span>Monday - Friday:</span>
                  <span>9am - 8pm</span>
                </li>
                <li className="flex justify-between mb-1">
                  <span>Saturday:</span>
                  <span>9am - 6pm</span>
                </li>
                <li className="flex justify-between mb-1">
                  <span>Sunday:</span>
                  <span>10am - 4pm</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#8E9196]/20 mt-8 pt-8 text-center text-[#8E9196]">
            <p>&copy; {new Date().getFullYear()} Homeboy Barbing Saloon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>;
};

// Sample services data
const services = [{
  id: 1,
  name: "Classic Haircut",
  description: "A traditional haircut with clippers and scissors, includes styling.",
  price: 25
}, {
  id: 2,
  name: "Beard Trim",
  description: "Shape and trim your beard to perfection.",
  price: 15
}, {
  id: 3,
  name: "Haircut & Beard Combo",
  description: "Get both a haircut and beard trim at a special price.",
  price: 35
}, {
  id: 4,
  name: "Kids Haircut",
  description: "Haircut for children under 12 years old.",
  price: 20
}, {
  id: 5,
  name: "Premium Styling",
  description: "Haircut with premium styling and hair products.",
  price: 40
}, {
  id: 6,
  name: "Head Shave",
  description: "Clean head shave with razor finish.",
  price: 30
}];

// Sample time slots
const timeSlots = ["9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"];

// Form submission handler
const handleBookingSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Get form elements
  const form = e.target as HTMLFormElement;
  const nameInput = form.querySelector('#name') as HTMLInputElement;
  const emailInput = form.querySelector('#email') as HTMLInputElement;
  const phoneInput = form.querySelector('#phone') as HTMLInputElement;
  const serviceInput = form.querySelector('#service') as HTMLSelectElement;
  const dateInput = form.querySelector('#date') as HTMLInputElement;
  const timeInput = form.querySelector('#time') as HTMLSelectElement;
  const notesInput = form.querySelector('#notes') as HTMLTextAreaElement;

  // Create booking data object
  const bookingData = {
    name: nameInput.value,
    email: emailInput.value,
    phone: phoneInput.value,
    service: serviceInput.value,
    date: dateInput.value,
    time: timeInput.value,
    notes: notesInput.value
  };
  try {
    // We'll need to create a Supabase Edge Function to handle the Notion integration
    // For now, we'll just show a success message

    // In the future, the actual API call would go here
    // const response = await fetch('/api/book', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(bookingData),
    // });

    // if (!response.ok) {
    //   throw new Error('Failed to book appointment');
    // }

    // const data = await response.json();

    // Show success message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded shadow-lg';
    toast.textContent = 'Appointment booked successfully! We will confirm shortly.';
    document.body.appendChild(toast);

    // Remove toast after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);

    // Reset form
    form.reset();
  } catch (error) {
    console.error('Error booking appointment:', error);

    // Show error message
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded shadow-lg';
    toast.textContent = 'Failed to book appointment. Please try again.';
    document.body.appendChild(toast);

    // Remove toast after 5 seconds
    setTimeout(() => {
      toast.remove();
    }, 5000);
  }
};
export default Index;