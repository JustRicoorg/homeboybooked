
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@/data/services";
import BookingFormFields from "../booking/BookingFormFields";
import { submitBooking, rescheduleBooking, BookingData } from "@/services/bookingService";
import { format } from "date-fns";
import { Check, ArrowRight } from "lucide-react";

type BookingFormProps = {
  services: Service[];
  selectedService?: string;
};

const BookingForm = ({
  services,
  selectedService
}: BookingFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentService, setCurrentService] = useState<string | undefined>(selectedService);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // Update currentService when selectedService prop changes
  useState(() => {
    if (selectedService !== currentService) {
      setCurrentService(selectedService);
    }
  });

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
    const data: BookingData = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      service: serviceInput.value,
      booking_date: dateInput.value,
      booking_time: timeInput.value,
      notes: notesInput.value
    };

    try {
      const response = await submitBooking(data);
      console.log('Booking response:', response);

      // Save booking data for display in thank-you message
      setBookingData(data);
      setBookingId(response.id || null);
      setBookingConfirmed(true);

      // Show success toast
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully booked. Thank you!",
        variant: "default"
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
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceChange = (service: string) => {
    setCurrentService(service);
  };

  const handleReschedule = () => {
    setBookingConfirmed(false);
    setBookingData(null);
    setBookingId(null);
  };

  return (
    <section id="booking" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 bg-gray-200">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-950 py-[7px]">Book an Appointment</h2>
        <p className="text-center mb-12 text-black">Schedule your next haircut with us</p>
        
        <div className="max-w-2xl mx-auto">
          {bookingConfirmed && bookingData ? (
            <div className="p-8 rounded-lg bg-white shadow">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-center mb-2">Thank You, {bookingData.name}!</h3>
              <p className="text-center text-gray-600 mb-6">
                Your booking has been confirmed for {format(new Date(bookingData.booking_date), "MMMM d, yyyy")} at {bookingData.booking_time}.
                We will send you a confirmation email shortly.
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-semibold mb-2">Booking Details:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-600">Service:</div>
                  <div>{bookingData.service}</div>
                  <div className="text-gray-600">Date:</div>
                  <div>{format(new Date(bookingData.booking_date), "MMMM d, yyyy")}</div>
                  <div className="text-gray-600">Time:</div>
                  <div>{bookingData.booking_time}</div>
                </div>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={handleReschedule} 
                  className="bg-[#1A1F2C] text-white hover:bg-[#151a24]"
                >
                  Reschedule Booking <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8 rounded-lg bg-gray-100">
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <BookingFormFields 
                  services={services} 
                  selectedService={currentService} 
                  selectedDate={selectedDate} 
                  setSelectedDate={setSelectedDate} 
                  isSubmitting={isSubmitting}
                  onServiceChange={handleServiceChange} 
                />
                
                <Button type="submit" disabled={isSubmitting || !selectedDate} className="w-full bg-[#1A1F2C] text-white hover:bg-[#151a24]">
                  {isSubmitting ? "Processing..." : "Book Appointment"}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
