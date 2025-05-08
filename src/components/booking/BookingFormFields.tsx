
import React from "react";
import { Service } from "@/types/service";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import ServiceSelector from "./ServiceSelector";
import DateSelector from "./DateSelector";
import TimeSlotSelector from "./TimeSlotSelector";

interface BookingFormFieldsProps {
  services: Service[];
  selectedService?: string;
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  isSubmitting: boolean;
  onServiceChange?: (service: string) => void;
}

const BookingFormFields: React.FC<BookingFormFieldsProps> = ({
  services,
  selectedService,
  selectedDate,
  setSelectedDate,
  isSubmitting,
  onServiceChange
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <Input
            id="name"
            placeholder="Your name"
            required
            className="w-full"
            disabled={isSubmitting}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <Input
              id="phone"
              type="tel"
              placeholder="Your phone number"
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <ServiceSelector 
            services={services} 
            selectedService={selectedService} 
            disabled={isSubmitting}
            onChange={onServiceChange}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <DateSelector
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              disabled={isSubmitting}
            />
          </div>
          
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
              Time
            </label>
            <TimeSlotSelector
              selectedDate={selectedDate}
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes (Optional)
          </label>
          <Textarea
            id="notes"
            placeholder="Any special requests or information we should know"
            className="w-full min-h-[100px]"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </>
  );
};

export default BookingFormFields;
