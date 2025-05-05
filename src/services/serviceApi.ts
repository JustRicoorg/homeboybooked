
import { supabase } from "@/integrations/supabase/client";
import { Service } from "@/types/service";

export async function fetchServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('id');
  
  if (error) throw error;
  return data || [];
}

export async function updateService(service: Service): Promise<void> {
  if (!service.name || !service.description || service.price === undefined) {
    throw new Error("Please fill in all required fields");
  }
  
  const { error } = await supabase
    .from('services')
    .update({
      name: service.name,
      description: service.description,
      price: service.price
    })
    .eq('id', service.id);
  
  if (error) throw error;
}

export async function createService(service: Omit<Service, "id">): Promise<void> {
  if (!service.name || !service.description || service.price === undefined) {
    throw new Error("Please fill in all required fields");
  }
  
  const { error } = await supabase
    .from('services')
    .insert({
      name: service.name,
      description: service.description,
      price: service.price
    });
  
  if (error) throw error;
}

export async function deleteService(id: number): Promise<void> {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
