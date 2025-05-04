
import React from "react";
import { User } from "lucide-react";
import { Service } from "@/data/services";
import DateSelector from "./DateSelector";
import TimeSlotSelector from "./TimeSlotSelector";
import ServiceSelector from "./ServiceSelector";

interface BookingFormFieldsProps {
  services: Service[];
  selectedService?: string;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isSubmitting: boolean;
}

const BookingFormFields: React.FC<BookingFormFieldsProps> = ({
  services,
  selectedService,
  selectedDate,
  setSelectedDate,
  isSubmitting
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block mb-2 font-medium">Your Name</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <User className="text-gray-400" size={16} />
            </div>
            <input 
              type="text" 
              id="name" 
              className="pl-10 w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" 
              placeholder="John Doe" 
              required
              disabled={isSubmitting} 
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">Email Address</label>
          <input 
            type="email" 
            id="email" 
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" 
            placeholder="john@example.com" 
            required
            disabled={isSubmitting} 
          />
        </div>
        <div>
          <label htmlFor="phone" className="block mb-2 font-medium">Phone Number</label>
          <input 
            type="tel" 
            id="phone" 
            className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" 
            placeholder="(123) 456-7890" 
            required
            disabled={isSubmitting} 
          />
        </div>
        <div>
          <label htmlFor="service" className="block mb-2 font-medium">Service</label>
          <ServiceSelector 
            services={services} 
            selectedService={selectedService} 
            disabled={isSubmitting} 
          />
        </div>
        <div>
          <label htmlFor="date" className="block mb-2 font-medium">Date</label>
          <DateSelector 
            selectedDate={selectedDate} 
            setSelectedDate={setSelectedDate}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="time" className="block mb-2 font-medium">Time</label>
          <TimeSlotSelector 
            selectedDate={selectedDate} 
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <label htmlFor="notes" className="block mb-2 font-medium">Additional Notes</label>
        <textarea 
          id="notes" 
          className="w-full min-h-[100px] rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" 
          placeholder="Any specific requests or notes about your haircut..."
          disabled={isSubmitting}
        ></textarea>
      </div>
    </>
  );
};

export default BookingFormFields;
