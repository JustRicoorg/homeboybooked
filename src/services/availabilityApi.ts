
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/types/service";

export async function fetchAvailability(): Promise<TimeSlot[]> {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .order('date', { ascending: true })
    .order('startTime', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

export async function updateAvailability(timeslot: TimeSlot): Promise<void> {
  if (!timeslot.date || !timeslot.startTime || !timeslot.endTime) {
    throw new Error("Please fill in all required fields");
  }
  
  if (timeslot.id) {
    const { error } = await supabase
      .from('availability')
      .update({
        date: timeslot.date,
        startTime: timeslot.startTime,
        endTime: timeslot.endTime,
        available: timeslot.available
      })
      .eq('id', timeslot.id);
    
    if (error) throw error;
  }
}

export async function createAvailability(timeslot: TimeSlot): Promise<void> {
  if (!timeslot.date || !timeslot.startTime || !timeslot.endTime) {
    throw new Error("Please fill in all required fields");
  }
  
  const { error } = await supabase
    .from('availability')
    .insert({
      date: timeslot.date,
      startTime: timeslot.startTime,
      endTime: timeslot.endTime,
      available: timeslot.available !== undefined ? timeslot.available : true
    });
  
  if (error) throw error;
}

export async function deleteAvailability(id: number): Promise<void> {
  const { error } = await supabase
    .from('availability')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}
