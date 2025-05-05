
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Edit, Trash, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

// Define our Service interface to match the database structure
interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
}

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
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setServices(data || []);
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
        const { error } = await supabase
          .from('services')
          .update({
            name: editingService.name,
            description: editingService.description,
            price: editingService.price
          })
          .eq('id', editingService.id);
        
        if (error) throw error;
        
        toast({
          title: "Service updated",
          description: "The service has been updated successfully"
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert([newService]);
        
        if (error) throw error;
        
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
      
      fetchServices();
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
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Service deleted",
        description: "The service has been deleted successfully"
      });
      
      fetchServices();
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
            <div className="space-y-4 mt-6">
              <div className="space-y-2">
                <label htmlFor="name">Service Name</label>
                <Input
                  id="name"
                  value={newService.name}
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Textarea
                  id="description"
                  value={newService.description}
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="price">Price (NGN)</label>
                <Input
                  id="price"
                  type="number"
                  value={newService.price?.toString() || "0"}
                  onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                />
              </div>
              <Button className="w-full" onClick={handleSaveService}>
                Add Service
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
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
                          <Button variant="outline" size="icon" onClick={() => setEditingService(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent>
                          <SheetHeader>
                            <SheetTitle>Edit Service</SheetTitle>
                          </SheetHeader>
                          {editingService && (
                            <div className="space-y-4 mt-6">
                              <div className="space-y-2">
                                <label htmlFor="edit-name">Service Name</label>
                                <Input
                                  id="edit-name"
                                  value={editingService.name}
                                  onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-description">Description</label>
                                <Textarea
                                  id="edit-description"
                                  value={editingService.description}
                                  onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                                />
                              </div>
                              <div className="space-y-2">
                                <label htmlFor="edit-price">Price (NGN)</label>
                                <Input
                                  id="edit-price"
                                  type="number"
                                  value={editingService.price.toString()}
                                  onChange={(e) => setEditingService({...editingService, price: parseFloat(e.target.value)})}
                                />
                              </div>
                              <Button className="w-full" onClick={handleSaveService}>
                                Update Service
                              </Button>
                            </div>
                          )}
                        </SheetContent>
                      </Sheet>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteService(service.id)}>
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
    </div>
  );
};

export default AdminServices;
