
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Service } from "@/types/service";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface ServiceFormProps {
  service: Partial<Service>;
  isEditing: boolean;
  onChange: (service: Partial<Service>) => void;
  onSave: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ service, isEditing, onChange, onSave }) => {
  return (
    <>
      <SheetHeader>
        <SheetTitle>{isEditing ? "Edit Service" : "Add New Service"}</SheetTitle>
      </SheetHeader>
      
      <div className="space-y-4 mt-6">
        <div className="space-y-2">
          <label htmlFor={isEditing ? "edit-name" : "name"}>Service Name</label>
          <Input
            id={isEditing ? "edit-name" : "name"}
            value={service.name || ""}
            onChange={(e) => onChange({ ...service, name: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor={isEditing ? "edit-description" : "description"}>Description</label>
          <Textarea
            id={isEditing ? "edit-description" : "description"}
            value={service.description || ""}
            onChange={(e) => onChange({ ...service, description: e.target.value })}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor={isEditing ? "edit-price" : "price"}>Price (NGN)</label>
          <Input
            id={isEditing ? "edit-price" : "price"}
            type="number"
            value={service.price?.toString() || "0"}
            onChange={(e) => onChange({ ...service, price: parseFloat(e.target.value) })}
          />
        </div>
        
        <Button className="w-full" onClick={onSave}>
          {isEditing ? "Update Service" : "Add Service"}
        </Button>
      </div>
    </>
  );
};

export default ServiceForm;
