
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { User, Calendar as CalendarIcon } from "lucide-react";
import { addMonths, format, isBefore, isAfter, startOfToday, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Service = {
  id: number;
  name: string;
  price: number;
  description: string;
}

type BookingFormProps = {
  services: Service[];
  selectedService?: string;
}

const BookingForm = ({ services, selectedService }: BookingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Date range limits
  const today = startOfToday();
  const twoMonthsFromNow = addMonths(today, 2);

  // Generate time slots based on the selected date
  const generateTimeSlots = () => {
    const timeSlots = [];
    const currentDate = new Date();
    const isToday = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
    
    const startHour = isToday ? currentDate.getHours() + 1 : 9; // If today, start from next hour
    const endHour = 19; // End at 7 PM
    
    // Morning slots (9am-12pm)
    for (let hour = Math.max(9, startHour); hour < 12; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      timeSlots.push(`${formattedHour}:00 ${ampm}`);
      timeSlots.push(`${formattedHour}:30 ${ampm}`);
    }
    
    // Afternoon slots (12pm-5pm)
    for (let hour = Math.max(12, startHour); hour < 17; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = 'PM';
      timeSlots.push(`${formattedHour}:00 ${ampm}`);
      timeSlots.push(`${formattedHour}:30 ${ampm}`);
    }
    
    // Evening slots (5pm-7pm)
    for (let hour = Math.max(17, startHour); hour < 20; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = 'PM';
      timeSlots.push(`${formattedHour}:00 ${ampm}`);
      if (hour < 19) {
        timeSlots.push(`${formattedHour}:30 ${ampm}`);
      }
    }
    
    return timeSlots;
  };
  
  const availableTimeSlots = selectedDate ? generateTimeSlots() : [];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      booking_date: dateInput.value,
      booking_time: timeInput.value,
      notes: notesInput.value
    };

    try {
      console.log('Submitting booking data:', bookingData);
      
      // Call the Supabase Edge Function
      const response = await fetch('https://qnasrupzjxawilizwelf.supabase.co/functions/v1/send-booking-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      console.log('Booking response:', data);

      // Show success toast
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully booked. We will contact you shortly for confirmation.",
        variant: "default",
      });

      // Reset form
      form.reset();
      setSelectedDate(undefined);
    } catch (error) {
      console.error('Error booking appointment:', error);
      
      // Show error toast
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : 'Failed to book appointment. Please try again.',
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                  <select 
                    id="service" 
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" 
                    required
                    defaultValue={selectedService || ""}
                  >
                    <option value="">Select a service</option>
                    {services.map(service => <option key={service.id} value={service.name}>{service.name} - ${service.price}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="date" className="block mb-2 font-medium">Date</label>
                  <div className="relative">
                    <input 
                      type="hidden" 
                      id="date" 
                      value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''} 
                      required 
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="flex items-center w-full h-10 rounded-md border border-gray-300 bg-white pl-3 pr-3 py-2 text-left text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                          {selectedDate ? format(selectedDate, 'PPP') : <span className="text-gray-400">Select a date</span>}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => 
                            isBefore(date, today) || isAfter(date, twoMonthsFromNow)
                          }
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div>
                  <label htmlFor="time" className="block mb-2 font-medium">Time</label>
                  <select 
                    id="time" 
                    className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" 
                    required
                    disabled={!selectedDate}
                  >
                    <option value="">{selectedDate ? "Select a time" : "Select a date first"}</option>
                    {availableTimeSlots.map((time, index) => 
                      <option key={index} value={time}>{time}</option>
                    )}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="notes" className="block mb-2 font-medium">Additional Notes</label>
                <textarea id="notes" className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" placeholder="Any specific requests or notes about your haircut..."></textarea>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-[#1A1F2C] text-white hover:bg-[#151a24]"
                disabled={isSubmitting || !selectedDate}
              >
                {isSubmitting ? "Processing..." : "Book Appointment"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
