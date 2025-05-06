
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
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Add New Service</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <ServiceForm
            service={newService}
            isEditing={false}
            onChange={onNewServiceChange}
            onSave={() => {
              onAddService();
              setOpen(false);
            }}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddServiceButton;
