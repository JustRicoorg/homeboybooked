
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot, RecurringSchedule } from "@/types/service";
import { 
  fetchAvailability, updateAvailability, createAvailability, deleteAvailability,
  fetchRecurringSchedules, createRecurringSchedule, updateRecurringSchedule, deleteRecurringSchedule 
} from "@/services/availabilityApi";
import TimeSlotList from "./availability/TimeSlotList";
import AddTimeSlotButton from "./availability/AddTimeSlotButton";
import RecurringScheduleList from "./availability/RecurringScheduleList";
import AddRecurringScheduleButton from "./availability/AddRecurringScheduleButton";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminAvailability = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [recurringSchedules, setRecurringSchedules] = useState<RecurringSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [editingRecurringSchedule, setEditingRecurringSchedule] = useState<RecurringSchedule | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot>({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    available: true,
    slotInterval: 30
  });
  const [newRecurringSchedule, setNewRecurringSchedule] = useState<RecurringSchedule>({
    dayOfWeek: 1, // Default to Monday
    startTime: "09:00",
    endTime: "17:00",
    available: true
  });
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("specific-days");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [availabilityData, recurringData] = await Promise.all([
        fetchAvailability(),
        fetchRecurringSchedules()
      ]);
      setTimeSlots(availabilityData);
      setRecurringSchedules(recurringData);
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTimeSlot = async () => {
    try {
      if (editingTimeSlot) {
        await updateAvailability(editingTimeSlot);
        toast({
          title: "Time slot updated",
          description: "The time slot has been updated successfully"
        });
      } else {
        await createAvailability(newTimeSlot);
        toast({
          title: "Time slot added",
          description: "The new time slot has been added successfully"
        });
        setNewTimeSlot({
          date: format(new Date(), "yyyy-MM-dd"),
          startTime: "09:00",
          endTime: "17:00",
          available: true,
          slotInterval: 30
        });
      }
      
      loadData();
      setEditingTimeSlot(null);
    } catch (error: any) {
      toast({
        title: "Error saving time slot",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTimeSlot = async (id: number) => {
    if (!confirm("Are you sure you want to delete this time slot?")) return;
    
    try {
      await deleteAvailability(id);
      toast({
        title: "Time slot deleted",
        description: "The time slot has been deleted successfully"
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: "Error deleting time slot",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSaveRecurringSchedule = async () => {
    try {
      if (editingRecurringSchedule) {
        await updateRecurringSchedule(editingRecurringSchedule);
        toast({
          title: "Weekly schedule updated",
          description: "The weekly schedule has been updated successfully"
        });
      } else {
        await createRecurringSchedule(newRecurringSchedule);
        toast({
          title: "Weekly schedule added",
          description: "The new weekly schedule has been added successfully"
        });
        setNewRecurringSchedule({
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "17:00",
          available: true
        });
      }
      
      loadData();
      setEditingRecurringSchedule(null);
    } catch (error: any) {
      toast({
        title: "Error saving weekly schedule",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteRecurringSchedule = async (id: number) => {
    if (!confirm("Are you sure you want to delete this weekly schedule?")) return;
    
    try {
      await deleteRecurringSchedule(id);
      toast({
        title: "Weekly schedule deleted",
        description: "The weekly schedule has been deleted successfully"
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: "Error deleting weekly schedule",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Availability</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="specific-days">Specific Days</TabsTrigger>
          <TabsTrigger value="weekly-schedule">Weekly Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="specific-days" className="space-y-6">
          <div className="flex justify-end">
            <AddTimeSlotButton
              newTimeSlot={newTimeSlot}
              onNewTimeSlotChange={setNewTimeSlot}
              onAddTimeSlot={handleSaveTimeSlot}
            />
          </div>
          
          <TimeSlotList
            timeSlots={timeSlots}
            loading={loading}
            editingTimeSlot={editingTimeSlot}
            onEditTimeSlot={setEditingTimeSlot}
            onDeleteTimeSlot={handleDeleteTimeSlot}
            onUpdateTimeSlot={handleSaveTimeSlot}
            onTimeSlotFormChange={setEditingTimeSlot}
          />
        </TabsContent>
        
        <TabsContent value="weekly-schedule" className="space-y-6">
          <div className="flex justify-end">
            <AddRecurringScheduleButton
              newSchedule={newRecurringSchedule}
              onNewScheduleChange={setNewRecurringSchedule}
              onAddSchedule={handleSaveRecurringSchedule}
            />
          </div>
          
          <RecurringScheduleList
            schedules={recurringSchedules}
            loading={loading}
            editingSchedule={editingRecurringSchedule}
            onEditSchedule={setEditingRecurringSchedule}
            onDeleteSchedule={handleDeleteRecurringSchedule}
            onUpdateSchedule={handleSaveRecurringSchedule}
            onScheduleFormChange={setEditingRecurringSchedule}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminAvailability;
