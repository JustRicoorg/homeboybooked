
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Time Slot
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Availability</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <TimeSlotForm
            timeSlot={newTimeSlot}
            isEditing={false}
            onChange={onNewTimeSlotChange}
            onSave={onAddTimeSlot}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddTimeSlotButton;
