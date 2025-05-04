
import React from "react";
import { format } from "date-fns";

interface TimeSlotSelectorProps {
  selectedDate: Date | undefined;
  disabled?: boolean;
}

const TimeSlotSelector: React.FC<TimeSlotSelectorProps> = ({ selectedDate, disabled }) => {
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

  return (
    <select 
      id="time" 
      className="w-full h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2" 
      required
      disabled={!selectedDate || disabled}
    >
      <option value="">{selectedDate ? "Select a time" : "Select a date first"}</option>
      {availableTimeSlots.map((time, index) => 
        <option key={index} value={time}>{time}</option>
      )}
    </select>
  );
};

export default TimeSlotSelector;
