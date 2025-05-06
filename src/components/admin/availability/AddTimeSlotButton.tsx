
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
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
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Time Slot
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="overflow-y-auto w-full sm:max-w-md">
        <SheetHeader className="mb-6">
          <SheetTitle>Add New Availability</SheetTitle>
        </SheetHeader>
        <div className="px-1">
          <TimeSlotForm
            timeSlot={newTimeSlot}
            isEditing={false}
            onChange={onNewTimeSlotChange}
            onSave={handleSave}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddTimeSlotButton;
