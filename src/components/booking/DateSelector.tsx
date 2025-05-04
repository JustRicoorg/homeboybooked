
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isBefore, isAfter, startOfToday, endOfMonth, addDays } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectorProps {
  selectedDate: Date | undefined;
  setSelectedDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, setSelectedDate, disabled }) => {
  // Date range limits
  const today = startOfToday();
  const endOfCurrentMonth = endOfMonth(today);
  
  // Allow booking in the next month if we're in the last week of current month
  const isLastWeekOfMonth = isAfter(today, addDays(endOfCurrentMonth, -7));
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const bookingEndDate = isLastWeekOfMonth ? endOfMonth(nextMonth) : endOfCurrentMonth;

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
            disabled={disabled}
            className="flex items-center w-full h-10 rounded-md border border-gray-300 bg-white pl-3 pr-3 py-2 text-left text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1F2C] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
              isBefore(date, today) || isAfter(date, bookingEndDate)
            }
            initialFocus
            className="pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateSelector;
