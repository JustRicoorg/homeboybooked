
import React from "react";
import { TimeSlot } from "@/types/service";
import { Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TimeSlotForm from "./TimeSlotForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface TimeSlotListProps {
  timeSlots: TimeSlot[];
  loading: boolean;
  editingTimeSlot: TimeSlot | null;
  onEditTimeSlot: (timeSlot: TimeSlot) => void;
  onDeleteTimeSlot: (id: number) => void;
  onUpdateTimeSlot: () => void;
  onTimeSlotFormChange: (timeSlot: TimeSlot | null) => void;
}

const TimeSlotList: React.FC<TimeSlotListProps> = ({
  timeSlots,
  loading,
  editingTimeSlot,
  onEditTimeSlot,
  onDeleteTimeSlot,
  onUpdateTimeSlot,
  onTimeSlotFormChange,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (loading) {
    return <div className="p-8 text-center">Loading availability...</div>;
  }

  if (timeSlots.length === 0) {
    return <div className="p-8 text-center">No time slots found. Add your first time slot to start.</div>;
  }

  // Group time slots by date
  const timeSlotsByDate = timeSlots.reduce((acc, timeSlot) => {
    const date = timeSlot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(timeSlot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="space-y-6">
      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open && editingTimeSlot) {
          onTimeSlotFormChange(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Time Slot</DialogTitle>
          </DialogHeader>
          {editingTimeSlot && (
            <div className="mt-6">
              <TimeSlotForm
                timeSlot={editingTimeSlot}
                isEditing={true}
                onChange={(updated) => onTimeSlotFormChange(updated)}
                onSave={() => {
                  onUpdateTimeSlot();
                  setDialogOpen(false);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      {Object.entries(timeSlotsByDate).map(([date, slots]) => (
        <div key={date} className="border rounded-md overflow-hidden">
          <div className="bg-muted p-3 font-medium">
            {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slots.map((timeSlot) => (
                  <TableRow key={timeSlot.id}>
                    <TableCell>
                      {timeSlot.startTime} - {timeSlot.endTime}
                    </TableCell>
                    <TableCell>
                      {timeSlot.available ? (
                        <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                          Unavailable
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button onClick={() => {
                          onEditTimeSlot(timeSlot);
                          setDialogOpen(true);
                        }}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => timeSlot.id && onDeleteTimeSlot(timeSlot.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimeSlotList;
