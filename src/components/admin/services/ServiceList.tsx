
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { Service } from "@/types/service";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import ServiceForm from "./ServiceForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface ServiceListProps {
  services: Service[];
  loading: boolean;
  editingService: Service | null;
  onEditService: (service: Service) => void;
  onDeleteService: (id: number) => void;
  onUpdateService: () => void;
  onServiceFormChange: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  loading,
  editingService,
  onEditService,
  onDeleteService,
  onUpdateService,
  onServiceFormChange,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const handleSave = () => {
    onUpdateService();
    setDialogOpen(false);
  };
  
  return (
    <div className="rounded-md border overflow-x-auto">
      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open && editingService) {
          onEditService(null as unknown as Service);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
          </DialogHeader>
          {editingService && (
            <ServiceForm
              service={editingService}
              isEditing={true}
              onChange={onServiceFormChange}
              onSave={handleSave}
            />
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {!isMobile && <TableHead>Description</TableHead>}
            <TableHead>Price</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 3 : 4} className="text-center py-8">Loading...</TableCell>
            </TableRow>
          ) : services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={isMobile ? 3 : 4} className="text-center py-8">No services found</TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                {!isMobile && <TableCell>{service.description}</TableCell>}
                <TableCell>₦{service.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="default" onClick={() => {
                      onEditService(service);
                      setDialogOpen(true);
                    }}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDeleteService(service.id)}>
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ServiceList;
