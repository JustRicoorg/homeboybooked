
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
        <ServiceForm
          service={newService}
          isEditing={false}
          onChange={onNewServiceChange}
          onSave={onAddService}
        />
      </SheetContent>
    </Sheet>
  );
};

export default AddServiceButton;
