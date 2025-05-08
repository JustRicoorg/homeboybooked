
import { supabase } from "@/integrations/supabase/client";
import { TimeSlot, RecurringSchedule } from "@/types/service";

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
    available: slot.available,
    slotInterval: slot.slot_interval,
    isSpecialDay: slot.is_special_day,
    specialDayName: slot.special_day_name
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
      available: timeSlot.available,
      slot_interval: timeSlot.slotInterval || 30,
      is_special_day: timeSlot.isSpecialDay || false,
      special_day_name: timeSlot.specialDayName
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
      available: timeSlot.available,
      slot_interval: timeSlot.slotInterval || 30,
      is_special_day: timeSlot.isSpecialDay || false,
      special_day_name: timeSlot.specialDayName
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

// New functions for recurring schedules
export async function fetchRecurringSchedules(): Promise<RecurringSchedule[]> {
  const { data, error } = await supabase
    .from('recurring_availability')
    .select('*')
    .order('day_of_week');
  
  if (error) throw error;
  
  // Transform from database schema to RecurringSchedule interface
  return (data || []).map(schedule => ({
    id: schedule.id,
    dayOfWeek: schedule.day_of_week,
    startTime: schedule.start_time,
    endTime: schedule.end_time,
    available: schedule.available
  }));
}

export async function createRecurringSchedule(schedule: Omit<RecurringSchedule, "id">): Promise<void> {
  if (schedule.dayOfWeek === undefined || !schedule.startTime || !schedule.endTime) {
    throw new Error("Please fill in all required fields");
  }
  
  const { error } = await supabase
    .from('recurring_availability')
    .insert({
      day_of_week: schedule.dayOfWeek,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      available: schedule.available
    });
  
  if (error) throw error;
}

export async function updateRecurringSchedule(schedule: RecurringSchedule): Promise<void> {
  if (schedule.dayOfWeek === undefined || !schedule.startTime || !schedule.endTime) {
    throw new Error("Please fill in all required fields");
  }
  
  const { error } = await supabase
    .from('recurring_availability')
    .update({
      day_of_week: schedule.dayOfWeek,
      start_time: schedule.startTime,
      end_time: schedule.endTime,
      available: schedule.available
    })
    .eq('id', schedule.id);
  
  if (error) throw error;
}

export async function deleteRecurringSchedule(id: number): Promise<void> {
  const { error } = await supabase
    .from('recurring_availability')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// These are aliases for the AdminAvailability component to use
export const fetchAvailability = fetchTimeSlots;
export const updateAvailability = updateTimeSlot;
export const createAvailability = createTimeSlot;
export const deleteAvailability = deleteTimeSlot;
