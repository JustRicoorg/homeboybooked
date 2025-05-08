
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
  
  // Check if the booking is on a Sunday
  const bookingDate = new Date(bookingData.booking_date);
  const isSunday = bookingDate.getDay() === 0; // 0 is Sunday
  
  // If it's Sunday, we need to check if there's an availability slot for this date
  if (isSunday) {
    // Format date to yyyy-MM-dd for comparison with availability table
    const formattedDate = bookingData.booking_date;
    
    // Check if there's an availability for this Sunday
    const availabilityResponse = await fetch(`https://qnasrupzjxawilizwelf.supabase.co/rest/v1/availability?date=eq.${formattedDate}&available=eq.true`, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY',
        'Content-Type': 'application/json'
      }
    });
    
    const availabilityData = await availabilityResponse.json();
    
    if (!availabilityData || availabilityData.length === 0) {
      throw new Error("Booking on Sunday is not available. Please choose another day.");
    }
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
