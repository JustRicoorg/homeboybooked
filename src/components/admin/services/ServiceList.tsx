
import React from "react";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ServiceForm from "./ServiceForm";

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
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">Loading...</TableCell>
            </TableRow>
          ) : services.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">No services found</TableCell>
            </TableRow>
          ) : (
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell>{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>₦{service.price}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="icon" onClick={() => onEditService(service)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        {editingService && (
                          <ServiceForm
                            service={editingService}
                            isEditing={true}
                            onChange={onServiceFormChange}
                            onSave={onUpdateService}
                          />
                        )}
                      </SheetContent>
                    </Sheet>
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
