
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { TimeSlot } from "@/types/service";
import { supabase } from "@/integrations/supabase/client";

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
  const [loading, setLoading] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    const getAvailability = async () => {
      if (!selectedDate) return;
      
      setLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        
        // Fetch all availability slots for the selected date
        const { data: availabilityData, error } = await supabase
          .from('availability')
          .select('*')
          .eq('date', formattedDate)
          .eq('available', true);
        
        if (error) throw error;
        
        // Transform from database schema to TimeSlot interface
        const slots = (availabilityData || []).map(slot => ({
          id: slot.id,
          date: slot.date,
          startTime: slot.starttime,
          endTime: slot.endtime,
          available: slot.available
        }));
        
        setAvailableTimeSlots(slots);

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

  // Generate formatted time slots for display
  const formatTimeSlot = (timeSlot: TimeSlot) => {
    // Format the time for display (e.g., "09:00 AM")
    const formatTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const period = hours >= 12 ? 'PM' : 'AM';
      const hour = hours % 12 || 12; // Convert to 12-hour format
      return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`;
    };
    
    const startFormatted = formatTime(timeSlot.startTime);
    const endFormatted = formatTime(timeSlot.endTime);
    
    return `${startFormatted} - ${endFormatted}`;
  };

  // Fallback to generate time slots if none are in the database
  const generateDefaultTimeSlots = () => {
    const timeSlots = [];
    const currentDate = new Date();
    const isToday = selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(currentDate, 'yyyy-MM-dd');
    
    const startHour = isToday ? currentDate.getHours() + 1 : 9; // If today, start from next hour
    const endHour = 19; // End at 7 PM
    
    for (let hour = Math.max(9, startHour); hour < endHour; hour++) {
      const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
      const ampm = hour < 12 ? 'AM' : 'PM';
      timeSlots.push(`${formattedHour}:00 ${ampm}`);
      if (hour < endHour - 1) { // Don't add 30 min for the last hour
        timeSlots.push(`${formattedHour}:30 ${ampm}`);
      }
    }
    
    return timeSlots;
  };

  // For Sunday, only use slots from the database
  // For other days, use database slots if available, otherwise fall back to generated slots
  const isSunday = selectedDate ? selectedDate.getDay() === 0 : false;
  const displayTimeSlots = isSunday
    ? availableTimeSlots.map(formatTimeSlot) // Sunday: only use database slots
    : availableTimeSlots.length > 0
      ? availableTimeSlots.map(formatTimeSlot) // Other days: use database slots if available
      : generateDefaultTimeSlots(); // Other days fallback: generate default slots
  
  // Filter out already booked slots
  const availableDisplayTimeSlots = displayTimeSlots.filter(slot => !bookedSlots.includes(slot));

  return (
    <select 
      id="time" 
      name="booking_time"
      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed" 
      required
      disabled={!selectedDate || disabled || loading}
      onChange={(e) => onChange && onChange(e.target.value)}
    >
      <option value="">
        {loading ? "Loading time slots..." : 
          !selectedDate ? "Select a date first" : 
          availableDisplayTimeSlots.length === 0 ? "No available slots for this date" :
          "Select a time"
        }
      </option>
      {availableDisplayTimeSlots.map((time, index) => 
        <option key={index} value={time}>{time}</option>
      )}
    </select>
  );
};

export default TimeSlotSelector;
