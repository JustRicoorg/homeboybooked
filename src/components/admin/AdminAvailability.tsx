
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TimeSlot } from "@/types/service";
import { fetchAvailability, updateAvailability, createAvailability, deleteAvailability } from "@/services/availabilityApi";
import TimeSlotList from "./availability/TimeSlotList";
import AddTimeSlotButton from "./availability/AddTimeSlotButton";
import { format } from "date-fns";

const AdminAvailability = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [newTimeSlot, setNewTimeSlot] = useState<TimeSlot>({
    date: format(new Date(), "yyyy-MM-dd"),
    startTime: "09:00",
    endTime: "17:00",
    available: true
  });
  const { toast } = useToast();

  useEffect(() => {
    loadAvailability();
  }, []);

  const loadAvailability = async () => {
    setLoading(true);
    try {
      const availabilityData = await fetchAvailability();
      setTimeSlots(availabilityData);
    } catch (error: any) {
      toast({
        title: "Error fetching availability",
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
          available: true
        });
      }
      
      loadAvailability();
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
      
      loadAvailability();
    } catch (error: any) {
      toast({
        title: "Error deleting time slot",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Availability</h2>
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
    </div>
  );
};

export default AdminAvailability;
