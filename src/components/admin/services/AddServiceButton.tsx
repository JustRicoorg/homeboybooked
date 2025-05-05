
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Service } from "@/types/service";
import ServiceForm from "./ServiceForm";

interface AddServiceButtonProps {
  newService: Partial<Service>;
  onNewServiceChange: (service: Partial<Service>) => void;
  onAddService: () => void;
}

const AddServiceButton: React.FC<AddServiceButtonProps> = ({
  newService,
  onNewServiceChange,
  onAddService,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add New Service</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ServiceForm
            service={newService}
            isEditing={false}
            onChange={onNewServiceChange}
            onSave={onAddService}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddServiceButton;
