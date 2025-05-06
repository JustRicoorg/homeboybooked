import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@/data/services";
import BookingFormFields from "../booking/BookingFormFields";
import { submitBooking, BookingData } from "@/services/bookingService";
type BookingFormProps = {
  services: Service[];
  selectedService?: string;
};
const BookingForm = ({
  services,
  selectedService
}: BookingFormProps) => {
  const {
    toast
  } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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
    const bookingData: BookingData = {
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      service: serviceInput.value,
      booking_date: dateInput.value,
      booking_time: timeInput.value,
      notes: notesInput.value
    };
    try {
      const data = await submitBooking(bookingData);
      console.log('Booking response:', data);

      // Show success toast
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully booked. We will contact you shortly for confirmation.",
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
  return <section id="booking" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4 bg-gray-200">
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-950 py-[7px]">Book an Appointment</h2>
        <p className="text-center mb-12 text-black">Schedule your next haircut with us</p>
        
        <div className="max-w-2xl mx-auto">
          <div className="p-6 md:p-8 rounded-lg bg-gray-100">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              <BookingFormFields services={services} selectedService={selectedService} selectedDate={selectedDate} setSelectedDate={setSelectedDate} isSubmitting={isSubmitting} />
              
              <Button type="submit" disabled={isSubmitting || !selectedDate} className="w-full bg-[#1A1F2C] text-white hover:bg-[#151a24]">
                {isSubmitting ? "Processing..." : "Book Appointment"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>;
};
export default BookingForm;