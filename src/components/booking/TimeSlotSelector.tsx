
import React, { useEffect, useState } from "react";
import { format, addMinutes, parseISO } from "date-fns";
import { TimeSlot, RecurringSchedule, BookingSlot } from "@/types/service";
import { supabase } from "@/integrations/supabase/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlotSelectorProps {
  selectedDate: Date | undefined;
  disabled?: boolean;
  onChange?: (value: string) => void;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ 
  selectedDate, 
  disabled,
  onChange
}) => {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    const getAvailability = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const dayOfWeek = selectedDate.getDay(); // 0 for Sunday, 1 for Monday, etc.
        
        // Fetch all availability slots for the selected date
        const { data: availabilityData, error } = await supabase
          .from('availability')
          .select('*')
          .eq('date', formattedDate);
        
        if (error) throw error;
        
        // Transform from database schema to TimeSlot interface
        const specificDaySlots = (availabilityData || []).map(slot => ({
          id: slot.id,
          date: slot.date,
          startTime: slot.starttime,
          endTime: slot.endtime,
          available: slot.available,
          slotInterval: slot.slot_interval || 30,
          isSpecialDay: slot.is_special_day || false,
          specialDayName: slot.special_day_name
        }));
        
        setAvailableTimeSlots(specificDaySlots);
        
        // If no specific day availability, fetch recurring schedule for this day of week
        if (specificDaySlots.length === 0) {
          const { data: recurringData, error: recurringError } = await supabase
            .from('recurring_availability')
            .select('*')
            .eq('day_of_week', dayOfWeek)
            .eq('available', true);
            
          if (recurringError) throw recurringError;
          
          const recurringSlots = (recurringData || []).map(slot => ({
            id: slot.id,
            dayOfWeek: slot.day_of_week,
            startTime: slot.start_time,
            endTime: slot.end_time,
            available: slot.available
          }));
          
          setRecurringSchedules(recurringSlots);
        }

        // Also fetch already booked slots for this date to prevent double booking
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('booking_time')
          .eq('booking_date', formattedDate)
          .neq('status', 'cancelled');
        
        if (bookingsError) throw bookingsError;
        
        setBookedSlots((bookingsData || []).map(booking => booking.booking_time));
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoading(false);
      }
    };
    
    getAvailability();
  }, [selectedDate]);
  
  // Generate time slots based on availability data
  useEffect(() => {
    if (!selectedDate) {
      setBookingSlots([]);
      return;
    }
    
    try {
      const slots: BookingSlot[] = [];
      const dayOfWeek = selectedDate.getDay();
      
      // Case 1: Using specific day availability
      if (availableTimeSlots.length > 0) {
        availableTimeSlots.forEach(timeSlot => {
          if (timeSlot.available) {
            const slotInterval = timeSlot.slotInterval || 30;
            const startTime = parseTimeString(timeSlot.startTime);
            const endTime = parseTimeString(timeSlot.endTime);
            
            // Generate time slots at specified intervals
            let currentTime = startTime;
            while (currentTime < endTime) {
              const slotTime = format(currentTime, "h:mm a");
              slots.push({
                time: slotTime,
                available: true
              });
              currentTime = addMinutes(currentTime, slotInterval);
            }
          }
        });
      } 
      // Case 2: Using recurring schedule for this day of week
      else if (recurringSchedules.length > 0) {
        recurringSchedules.forEach(schedule => {
          if (schedule.dayOfWeek === dayOfWeek && schedule.available) {
            const startTime = parseTimeString(schedule.startTime);
            const endTime = parseTimeString(schedule.endTime);
            const slotInterval = 30; // Default interval for recurring schedules
            
            // Generate time slots at specified intervals
            let currentTime = startTime;
            while (currentTime < endTime) {
              const slotTime = format(currentTime, "h:mm a");
              slots.push({
                time: slotTime,
                available: true
              });
              currentTime = addMinutes(currentTime, slotInterval);
            }
          }
        });
      } 
      // Case 3: Default business hours for Mon-Sat (9AM-5PM, if no specific settings)
      else if (dayOfWeek !== 0) { // Not Sunday
        // Default business hours
        const startTime = new Date();
        startTime.setHours(9, 0, 0);
        
        const endTime = new Date();
        endTime.setHours(17, 0, 0);
        
        // Generate time slots
        let currentTime = startTime;
        while (currentTime < endTime) {
          const slotTime = format(currentTime, "h:mm a");
          slots.push({
            time: slotTime,
            available: true
          });
          currentTime = addMinutes(currentTime, 30); // Default 30-minute intervals
        }
      }
      
      // Filter out already booked slots
      const filteredSlots = slots.filter(slot => !bookedSlots.includes(slot.time));
      setBookingSlots(filteredSlots);
    } catch (error) {
      console.error("Error generating time slots:", error);
      setBookingSlots([]);
    }
  }, [selectedDate, availableTimeSlots, recurringSchedules, bookedSlots]);
  
  // Helper to parse time strings like "09:00" into Date objects
  const parseTimeString = (timeStr: string): Date => {
    const today = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    
    return date;
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    if (onChange) {
      onChange(time);
    }
  };

  if (!selectedDate) {
    return <div className="text-center text-gray-500">Please select a date first</div>;
  }

  if (loading) {
    return <div className="text-center text-gray-500">Loading available time slots...</div>;
  }

  if (bookingSlots.length === 0) {
    return <div className="text-center text-gray-500">No available slots for this date</div>;
  }

  const formattedDay = format(selectedDate, "EEEE, MMMM dd");

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <button className="text-[#1A1F2C] hover:text-[#6E59A5]" onClick={() => {/* Previous day navigation */}}>
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h3 className="text-lg font-medium text-[#1A1F2C]">{formattedDay}</h3>
        <button className="text-[#1A1F2C] hover:text-[#6E59A5]" onClick={() => {/* Next day navigation */}}>
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {bookingSlots.map((slot, index) => (
          <button
            key={index}
            className={`rounded-md border py-3 px-4 transition-colors ${
              selectedTime === slot.time 
                ? 'bg-[#1A1F2C] text-white border-[#1A1F2C]' 
                : 'bg-white text-[#1A1F2C] border-gray-300 hover:border-[#1A1F2C]'
            }`}
            onClick={() => handleTimeSelect(slot.time)}
            disabled={disabled || !slot.available}
          >
            {slot.time}
          </button>
        ))}
      </div>

      {/* Hidden select for form submission compatibility */}
      <select 
        id="time" 
        name="booking_time"
        className="sr-only"
        required
        disabled={!selectedDate || disabled || loading}
        value={selectedTime || ''}
        onChange={(e) => handleTimeSelect(e.target.value)}
      >
        <option value="">Select a time</option>
        {bookingSlots.map((slot, index) => (
          <option key={index} value={slot.time}>{slot.time}</option>
        ))}
      </select>
    </div>
  );
};

export default TimeSlotSelector;
