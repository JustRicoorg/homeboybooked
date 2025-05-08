
import React, { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isBefore, isAfter, startOfToday, endOfMonth, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, setSelectedDate, disabled }) => {
  // Date range limits
  const today = startOfToday();
  const endOfCurrentMonth = endOfMonth(today);
  const [availableDates, setAvailableDates] = useState<Record<string, boolean>>({});
  const [recurringSchedules, setRecurringSchedules] = useState<Record<number, boolean>>({});
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  // Load available dates and recurring schedules
  useEffect(() => {
    const fetchAvailability = async () => {
      setLoadingAvailability(true);
      try {
        // Fetch specific day availability
        const { data: availabilityData, error } = await supabase
          .from('availability')
          .select('date, available');
        
        if (error) {
          console.error('Error fetching availability:', error);
          return;
        }
        
        // Create an object mapping dates to their availability status
        const dateAvailability = availabilityData.reduce((acc, item) => {
          acc[item.date] = item.available;
          return acc;
        }, {} as Record<string, boolean>);
        
        setAvailableDates(dateAvailability);
        
        // Fetch recurring schedules
        const { data: recurringData, error: recurringError } = await supabase
          .from('recurring_availability')
          .select('day_of_week, available');
        
        if (recurringError) {
          console.error('Error fetching recurring schedules:', recurringError);
          return;
        }
        
        // Create an object mapping days of week to their availability status
        const weeklyAvailability = recurringData.reduce((acc, item) => {
          acc[item.day_of_week] = item.available;
          return acc;
        }, {} as Record<number, boolean>);
        
        setRecurringSchedules(weeklyAvailability);
      } catch (error) {
        console.error('Error in fetchAvailability:', error);
      } finally {
        setLoadingAvailability(false);
      }
    };
    
    fetchAvailability();
  }, []);
  
  // Allow booking in the next month if we're in the last week of current month
  const isLastWeekOfMonth = isAfter(today, addDays(endOfCurrentMonth, -7));
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const bookingEndDate = isLastWeekOfMonth ? endOfMonth(nextMonth) : endOfCurrentMonth;

  // Function to check if a date should be disabled
  const isDateDisabled = (date: Date) => {
    // Always disable dates before today
    if (isBefore(date, today)) return true;
    
    // Always disable dates after booking end date
    if (isAfter(date, bookingEndDate)) return true;
    
    const dateString = format(date, 'yyyy-MM-dd');
    const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday, etc.
    
    // Check if this date has a specific availability set
    if (dateString in availableDates) {
      return !availableDates[dateString]; // Disable if not available
    }
    
    // If no specific availability, check the recurring schedule for this day of week
    if (dayOfWeek in recurringSchedules) {
      return !recurringSchedules[dayOfWeek]; // Disable if not available
    }
    
    // Default business days (Mon-Sat) are available, Sunday is unavailable
    return dayOfWeek === 0; // Disable Sundays by default
  };

  return (
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
            disabled={disabled || loadingAvailability}
            className="flex items-center w-full h-10 rounded-md border border-gray-300 bg-white pl-3 pr-3 py-2 text-left text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
            {loadingAvailability ? (
              <span className="text-gray-400">Loading availability...</span>
            ) : selectedDate ? (
              format(selectedDate, 'PPP')
            ) : (
              <span className="text-gray-400">Select a date</span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={isDateDisabled}
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
