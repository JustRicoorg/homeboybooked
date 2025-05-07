
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

  const handleSave = () => {
    onAddService();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Service
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
        </DialogHeader>
        <div className="px-1 mt-4">
          <ServiceForm
            service={newService}
            isEditing={false}
            onChange={onNewServiceChange}
            onSave={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceButton;
