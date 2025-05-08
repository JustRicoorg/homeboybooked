
import React from "react";
import { Button } from "@/components/ui/button";
import { RecurringSchedule } from "@/types/service";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface RecurringScheduleFormProps {
  schedule: RecurringSchedule;
  isEditing: boolean;
  onChange: (schedule: RecurringSchedule) => void;
  onSave: () => void;
}

const days = [
  { value: 0, label: "Sunday" },
  { value: 1, label: "Monday" },
  { value: 2, label: "Tuesday" },
  { value: 3, label: "Wednesday" },
  { value: 4, label: "Thursday" },
  { value: 5, label: "Friday" },
  { value: 6, label: "Saturday" },
];

const RecurringScheduleForm: React.FC<RecurringScheduleFormProps> = ({
  schedule,
  isEditing,
  onChange,
  onSave,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="dayOfWeek" className="block text-sm font-medium">Day of Week</label>
        <Select
          value={String(schedule.dayOfWeek)}
          onValueChange={(value) => onChange({ ...schedule, dayOfWeek: parseInt(value, 10) })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select day of week" />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day.value} value={String(day.value)}>
                {day.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label htmlFor="startTime" className="block text-sm font-medium">Start Time</label>
        <Input
          id="startTime"
          type="time"
          value={schedule.startTime}
          onChange={(e) => onChange({ ...schedule, startTime: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="endTime" className="block text-sm font-medium">End Time</label>
        <Input
          id="endTime"
          type="time"
          value={schedule.endTime}
          onChange={(e) => onChange({ ...schedule, endTime: e.target.value })}
          className="w-full"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="available"
          checked={schedule.available}
          onCheckedChange={(checked) => onChange({ ...schedule, available: checked })}
        />
        <Label htmlFor="available">Available for bookings</Label>
      </div>

      <Button 
        className="w-full mt-4"
        onClick={onSave}
        disabled={schedule.dayOfWeek === undefined || !schedule.startTime || !schedule.endTime}
      >
        {isEditing ? "Update" : "Add"} Weekly Schedule
      </Button>
    </div>
  );
};

export default RecurringScheduleForm;
