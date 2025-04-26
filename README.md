
# Homeboy Barbing Saloon Website

A modern website for Homeboy Barbing Saloon with a booking system that integrates with Notion.

## Features

- Responsive design
- Service/pricing display
- Online booking form
- Notion integration via Supabase Edge Functions

## Setup Instructions

### 1. Set up Notion Integration

1. Create a new integration at https://www.notion.so/my-integrations
   - Give it a name (e.g., "Homeboy Booking System")
   - Select the workspace where you want to use the integration
   - Get the `Internal Integration Token`

2. Create a new database in Notion with the following properties:
   - Name (Title)
   - Email (Email)
   - Phone (Phone Number)
   - Service (Text)
   - Date (Date, with time enabled)
   - Notes (Text)
   - Status (Select, with options like "Pending", "Confirmed", "Completed", "Cancelled")

3. Share your database with the integration you created:
   - Open the database
   - Click "Share" in the top right
   - Add the integration by name
   - Copy the database ID from the URL (it's the part after the workspace name and before the question mark)

### 2. Set up Supabase

1. Create a new table in Supabase called `bookings` with the following columns:
   - id (uuid, primary key)
   - created_at (timestamp with time zone, default: now())
   - name (text)
   - email (text)
   - phone (text)
   - service (text)
   - appointment_date (date)
   - appointment_time (text)
   - notes (text)
   - status (text, default: 'pending')

2. Add your Notion API key as a secret in Supabase:
   - Go to the Supabase dashboard
   - Navigate to Project Settings > API
   - Under "Project Secrets", add:
     - `NOTION_API_KEY`: Your Notion integration token
     - `NOTION_DATABASE_ID`: Your Notion database ID

3. Deploy the Edge Function:
   - Install Supabase CLI if you haven't already
   - Run `supabase functions deploy create-notion-booking`

### 3. Connect the Frontend to the Edge Function

Update the `handleBookingSubmit` function in your `Index.tsx` file to call the Edge Function:

```typescript
const handleBookingSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Get form data
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  
  // Create booking data object
  const bookingData = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    service: formData.get('service'),
    date: formData.get('date'),
    time: formData.get('time'),
    notes: formData.get('notes'),
  };

  try {
    // Call the Supabase Edge Function
    const response = await fetch('https://[YOUR_PROJECT_REF].supabase.co/functions/v1/create-notion-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to book appointment');
    }
    
    // Show success message using toast
    toast({
      title: "Success!",
      description: "Your appointment has been booked. We'll contact you to confirm shortly.",
    });
    
    // Reset form
    form.reset();
    
  } catch (error) {
    console.error('Error booking appointment:', error);
    
    // Show error message using toast
    toast({
      title: "Booking Failed",
      description: "There was an error booking your appointment. Please try again.",
      variant: "destructive",
    });
  }
};
```

Replace `[YOUR_PROJECT_REF]` with your actual Supabase project reference.

## Deployment

1. Deploy your frontend using Lovable's publishing feature
2. Make sure your Supabase Edge Function is deployed
3. Test the booking form to ensure it's correctly creating entries in both Supabase and Notion
