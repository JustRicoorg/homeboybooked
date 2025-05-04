
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
  
  const response = await fetch('https://qnasrupzjxawilizwelf.supabase.co/functions/v1/send-booking-confirmation', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(bookingData),
  });

  if (!response.ok) {
    const data = await response.json();
    
    // Handle specific error cases
    if (response.status === 409) {
      throw new Error("This time slot is already booked. Please select a different time.");
    }
    
    throw new Error(data.error || 'Failed to book appointment');
  }

  return response.json();
};
