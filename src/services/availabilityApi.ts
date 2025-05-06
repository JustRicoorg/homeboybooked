
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot } from "@/types/service";

export async function fetchTimeSlots(): Promise<TimeSlot[]> {
  const { data, error } = await supabase
    .from('availability')
    .select('*')
    .order('date');
  
  if (error) throw error;
  
  // Transform from database schema to TimeSlot interface
  return (data || []).map(slot => ({
    id: slot.id,
    date: slot.date,
    startTime: slot.starttime,
    endTime: slot.endtime,
    available: slot.available
  }));
}

export async function updateTimeSlot(timeSlot: TimeSlot): Promise<void> {
  if (!timeSlot.date || !timeSlot.startTime || !timeSlot.endTime) {
    throw new Error("Please fill in all required fields");
  }
  
  const { error } = await supabase
    .from('availability')
    .update({
      date: timeSlot.date,
      starttime: timeSlot.startTime,
      endtime: timeSlot.endTime,
      available: timeSlot.available
    })
    .eq('id', timeSlot.id);
  
  if (error) throw error;
}

export async function createTimeSlot(timeSlot: Omit<TimeSlot, "id">): Promise<void> {
  if (!timeSlot.date || !timeSlot.startTime || !timeSlot.endTime) {
    throw new Error("Please fill in all required fields");
  }
  
  const { error } = await supabase
    .from('availability')
    .insert({
      date: timeSlot.date,
      starttime: timeSlot.startTime,
      endtime: timeSlot.endTime,
      available: timeSlot.available
    });
  
  if (error) throw error;
}

export async function deleteTimeSlot(id: number): Promise<void> {
  const { error } = await supabase
    .from('availability')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// These are aliases for the AdminAvailability component to use
export const fetchAvailability = fetchTimeSlots;
export const updateAvailability = updateTimeSlot;
export const createAvailability = createTimeSlot;
export const deleteAvailability = deleteTimeSlot;
