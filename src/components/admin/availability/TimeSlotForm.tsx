
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TimeSlot } from "@/types/service";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TimeSlotFormProps {
  timeSlot: TimeSlot;
  isEditing: boolean;
  onChange: (timeSlot: TimeSlot) => void;
  onSave: () => void;
}

const TimeSlotForm: React.FC<TimeSlotFormProps> = ({
  timeSlot,
  isEditing,
  onChange,
  onSave,
}) => {
  const [date, setDate] = React.useState<Date | undefined>(
    timeSlot.date ? new Date(timeSlot.date) : undefined
  );

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (newDate) {
      // Format date without modifying day of week
      const formattedDate = format(newDate, "yyyy-MM-dd");
      onChange({
        ...timeSlot,
        date: formattedDate,
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="date" className="block text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-2">
        <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
        <Input
          id="startTime"
          type="time"
          value={timeSlot.startTime}
          onChange={(e) => onChange({ ...timeSlot, startTime: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
        <Input
          id="endTime"
          type="time"
          value={timeSlot.endTime}
          onChange={(e) => onChange({ ...timeSlot, endTime: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={timeSlot.available}
          onCheckedChange={(checked) => onChange({ ...timeSlot, available: checked })}
        />
        <Label htmlFor="available">Available for bookings</Label>
      </div>

      <Button 
        className="w-full mt-4"
        onClick={onSave}
        disabled={!timeSlot.date || !timeSlot.startTime || !timeSlot.endTime}
      >
        {isEditing ? "Update" : "Add"} Time Slot
      </Button>
    </div>
  );
};

export default TimeSlotForm;
