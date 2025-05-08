
import React from "react";
import { RecurringSchedule } from "@/types/service";
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
import RecurringScheduleForm from "./RecurringScheduleForm";
import { useIsMobile } from "@/hooks/use-mobile";

interface RecurringScheduleListProps {
  schedules: RecurringSchedule[];
  loading: boolean;
  editingSchedule: RecurringSchedule | null;
  onEditSchedule: (schedule: RecurringSchedule) => void;
  onDeleteSchedule: (id: number) => void;
  onUpdateSchedule: () => void;
  onScheduleFormChange: (schedule: RecurringSchedule | null) => void;
}

const RecurringScheduleList: React.FC<RecurringScheduleListProps> = ({
  schedules,
  loading,
  editingSchedule,
  onEditSchedule,
  onDeleteSchedule,
  onUpdateSchedule,
  onScheduleFormChange,
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const isMobile = useIsMobile();

  if (loading) {
    return <div className="p-8 text-center">Loading schedules...</div>;
  }

  if (schedules.length === 0) {
    return <div className="p-8 text-center">No weekly schedules found. Add your first weekly schedule to start.</div>;
  }

  const getDayName = (dayOfWeek: number) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek] || "Unknown";
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour = hours % 12 || 12;
    return `${hour}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <div className="space-y-6">
      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open && editingSchedule) {
          onScheduleFormChange(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Weekly Schedule</DialogTitle>
          </DialogHeader>
          {editingSchedule && (
            <div className="mt-6">
              <RecurringScheduleForm
                schedule={editingSchedule}
                isEditing={true}
                onChange={(updated) => onScheduleFormChange(updated)}
                onSave={() => {
                  onUpdateSchedule();
                  setDialogOpen(false);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted p-3 font-medium">
          Weekly Schedules
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Day</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {getDayName(schedule.dayOfWeek)}
                  </TableCell>
                  <TableCell>
                    {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                  </TableCell>
                  <TableCell>
                    {schedule.available ? (
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
                      <Button 
                        size="sm"
                        onClick={() => {
                          onEditSchedule(schedule);
                          setDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => schedule.id && onDeleteSchedule(schedule.id)}
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
    </div>
  );
};

export default RecurringScheduleList;
