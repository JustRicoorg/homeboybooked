
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Calendar, Check, Filter, RefreshCw, Trash, X } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  booking_date: string;
  booking_time: string;
  notes: string | null;
  status: string;
  created_at: string;
}

const AdminSchedule = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [confirmDialog, setConfirmDialog] = useState<{open: boolean, id: string, action: 'complete' | 'cancel' | null}>({
    open: false,
    id: '',
    action: null
  });
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('booking_date', { ascending: sortOrder === 'oldest' });
      
      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [sortOrder]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleStatusChange = (id: string, status: string) => {
    if (status === 'completed' || status === 'cancelled') {
      setConfirmDialog({
        open: true,
        id,
        action: status === 'completed' ? 'complete' : 'cancel'
      });
    } else {
      updateBookingStatus(id, status);
    }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    try {
      if (status === 'completed' || status === 'cancelled') {
        // Delete from the bookings table
        const { error: deleteError } = await supabase
          .from('bookings')
          .delete()
          .eq('id', id);
          
        if (deleteError) throw deleteError;
        
        toast({
          title: status === 'completed' ? "Appointment Completed" : "Appointment Cancelled",
          description: `The appointment has been ${status === 'completed' ? 'completed' : 'cancelled'} and removed from the schedule`
        });
      } else {
        // Just update the status
        const { error } = await supabase
          .from('bookings')
          .update({ status })
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Status updated",
          description: `Booking status changed to ${status}`
        });
      }
      
      fetchBookings();
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setConfirmDialog({ open: false, id: '', action: null });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Appointment Schedule</h2>
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOrder('newest')}>
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('oldest')}>
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" onClick={fetchBookings}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              {!isMobile && <TableHead>Service</TableHead>}
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-8">Loading...</TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={isMobile ? 5 : 6} className="text-center py-8">No bookings found</TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.name}</TableCell>
                  <TableCell>{formatDate(booking.booking_date)}</TableCell>
                  <TableCell>{booking.booking_time}</TableCell>
                  {!isMobile && <TableCell>{booking.service}</TableCell>}
                  <TableCell>{getStatusBadge(booking.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                        >
                          <Check className="h-4 w-4 mr-1" /> Complete
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                        >
                          <X className="h-4 w-4 mr-1" /> Cancel
                        </Button>
                      </div>
                      <select
                        className="text-sm border rounded p-1 mt-2"
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                      </select>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog 
        open={confirmDialog.open} 
        onOpenChange={(open) => {
          if (!open) setConfirmDialog({...confirmDialog, open: false});
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === 'complete' ? 'Complete Appointment' : 'Cancel Appointment'}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action === 'complete' 
                ? 'Are you sure you want to mark this appointment as completed? This will remove it from the schedule.'
                : 'Are you sure you want to cancel this appointment? This will remove it from the schedule.'}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({open: false, id: '', action: null})}
            >
              No, keep it
            </Button>
            <Button
              variant={confirmDialog.action === 'complete' ? 'default' : 'destructive'}
              onClick={() => {
                if (confirmDialog.id && confirmDialog.action) {
                  updateBookingStatus(
                    confirmDialog.id, 
                    confirmDialog.action === 'complete' ? 'completed' : 'cancelled'
                  );
                }
              }}
            >
              Yes, {confirmDialog.action === 'complete' ? 'complete it' : 'cancel it'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSchedule;
