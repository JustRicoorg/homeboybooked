
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@/types/service";
import { fetchServices, updateService, createService, deleteService } from "@/services/serviceApi";
import ServiceList from "./services/ServiceList";
import AddServiceButton from "./services/AddServiceButton";

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: "",
    description: "",
    price: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const servicesData = await fetchServices();
      setServices(servicesData);
    } catch (error: any) {
      toast({
        title: "Error fetching services",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveService = async () => {
    try {
      if (editingService) {
        await updateService(editingService as Service);
        toast({
          title: "Service updated",
          description: "The service has been updated successfully"
        });
      } else {
        await createService(newService as Omit<Service, "id">);
        toast({
          title: "Service added",
          description: "The new service has been added successfully"
        });
        setNewService({
          name: "",
          description: "",
          price: 0
        });
      }
      
      loadServices();
      setEditingService(null);
    } catch (error: any) {
      toast({
        title: "Error saving service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    try {
      await deleteService(id);
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully"
      });
      
      loadServices();
    } catch (error: any) {
      toast({
        title: "Error deleting service",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Services</h2>
        <AddServiceButton
          newService={newService}
          onNewServiceChange={setNewService}
          onAddService={handleSaveService}
        />
      </div>
      
      <ServiceList
        services={services}
        loading={loading}
        editingService={editingService}
        onEditService={setEditingService}
        onDeleteService={handleDeleteService}
        onUpdateService={handleSaveService}
        onServiceFormChange={setEditingService}
      />
    </div>
  );
};

export default AdminServices;
