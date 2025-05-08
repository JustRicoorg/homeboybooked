
import React from "react";
import { Button } from "@/components/ui/button";
import { CalendarClock } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { RecurringSchedule } from "@/types/service";
import RecurringScheduleForm from "./RecurringScheduleForm";

interface AddRecurringScheduleButtonProps {
  newSchedule: RecurringSchedule;
  onNewScheduleChange: (schedule: RecurringSchedule) => void;
  onAddSchedule: () => void;
}

const AddRecurringScheduleButton: React.FC<AddRecurringScheduleButtonProps> = ({
  newSchedule,
  onNewScheduleChange,
  onAddSchedule,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSave = () => {
    onAddSchedule();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <CalendarClock className="mr-2 h-4 w-4" /> Add Weekly Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Weekly Schedule</DialogTitle>
        </DialogHeader>
        <div className="px-1 mt-4">
          <RecurringScheduleForm
            schedule={newSchedule}
            isEditing={false}
            onChange={onNewScheduleChange}
            onSave={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecurringScheduleButton;
