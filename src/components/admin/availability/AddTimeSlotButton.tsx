
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { TimeSlot } from "@/types/service";
import TimeSlotForm from "./TimeSlotForm";

interface AddTimeSlotButtonProps {
  newTimeSlot: TimeSlot;
  onNewTimeSlotChange: (timeSlot: TimeSlot) => void;
  onAddTimeSlot: () => void;
}

const AddTimeSlotButton: React.FC<AddTimeSlotButtonProps> = ({
  newTimeSlot,
  onNewTimeSlotChange,
  onAddTimeSlot,
}) => {
  const [open, setOpen] = React.useState(false);

  const handleSave = () => {
    onAddTimeSlot();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Time Slot
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Availability</DialogTitle>
        </DialogHeader>
        <div className="px-1 mt-4">
          <TimeSlotForm
            timeSlot={newTimeSlot}
            isEditing={false}
            onChange={onNewTimeSlotChange}
            onSave={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimeSlotButton;
