
export interface BookingData {
  name: string;
  email: string;
  phone: string;
  service: string;
  booking_date: string;
  booking_time: string;
  notes: string;
}

export const submitBooking = async (bookingData: BookingData) => {
  console.log('Submitting booking data:', bookingData);
  
  // Prepare for date checking
  const bookingDate = new Date(bookingData.booking_date);
  const dayOfWeek = bookingDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const formattedDate = bookingData.booking_date;
  
  // Step 1: Check specific date availability
  const availabilityResponse = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/availability?date=eq.${formattedDate}`, {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
      'Content-Type': 'application/json'
    }
  });
  
  const specificDateAvailability = await availabilityResponse.json();
  
  // Step 2: If no specific date entry, check recurring schedule for this day of week
  if (!specificDateAvailability || specificDateAvailability.length === 0) {
    const recurringResponse = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/recurring_availability?day_of_week=eq.${dayOfWeek}&available=eq.true`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
        'Content-Type': 'application/json'
      }
    });
    
    const recurringAvailability = await recurringResponse.json();
    
    // For Sunday, explicitly require an availability entry
    if (dayOfWeek === 0 && (!recurringAvailability || recurringAvailability.length === 0)) {
      throw new Error("Booking on Sunday is not available. Please choose another day.");
    }
    
    // For other days, if no recurring schedule and it's a weekday (Mon-Sat), we allow booking
  }
  // If specific date entry exists, ensure it's marked as available
  else if (!specificDateAvailability[0].available) {
    throw new Error(`This day is not available for booking${specificDateAvailability[0].is_special_day ? ` (${specificDateAvailability[0].special_day_name})` : ''}. Please choose another day.`);
  }
  
  // Check for existing bookings at the same time
  const checkExistingResponse = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/bookings?booking_date=eq.${bookingData.booking_date}&booking_time=eq.${bookingData.booking_time}&status=neq.cancelled`, {
    headers: {
      'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
      'Content-Type': 'application/json'
    }
  });
  
  const existingBookings = await checkExistingResponse.json();
  
  if (existingBookings && existingBookings.length > 0) {
    throw new Error("This time slot is already booked. Please select a different time.");
  }
  
  // All checks passed, proceed with booking
  const response = await fetch('https://qnasrupzjxawilizwelf.supabase.co/functions/v1/send-booking-confirmation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Failed to book appointment');
  }

  return response.json();
};

export const deleteBooking = async (id: string) => {
  try {
    const response = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/bookings?id=eq.${id}`, {
      method: 'DELETE',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete booking');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    throw error;
  }
};

export const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
  try {
    const response = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/bookings?id=eq.${id}`, {
      method: 'PATCH',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update booking status to ${status}`);
    }
    
    const data = await response.json();
    
    // If status is completed or cancelled, we should also create a record in the client table before deleting
    if (status === 'completed' || status === 'cancelled') {
      // First get the full booking details
      const bookingResponse = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/bookings?id=eq.${id}`, {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
          'Content-Type': 'application/json'
        }
      });
      
      if (!bookingResponse.ok) {
        throw new Error('Failed to retrieve booking details');
      }
      
      const bookingData = await bookingResponse.json();
      if (bookingData && bookingData.length > 0) {
        const booking = bookingData[0];
        
        // Then insert into the client table
        const clientResponse = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/homeboy%20Booking%20client`, {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: booking.name,
            email: booking.email,
            phone: booking.phone,
            service: booking.service,
            date: booking.booking_date,
            time: booking.booking_time,
            notes: booking.notes
          })
        });
        
        if (!clientResponse.ok) {
          throw new Error('Failed to add booking to client history');
        }
        
        // Then delete from the bookings table
        await deleteBooking(id);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
};
