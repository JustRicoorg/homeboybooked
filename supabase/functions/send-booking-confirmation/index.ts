
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BookingData {
  name: string;
  email: string;
  phone: string;
  service: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const bookingData: BookingData = await req.json();
    
    // 1. Store booking data in Supabase
    const { data: bookingRecord, error: insertError } = await supabaseClient
      .from("bookings")
      .insert({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        service: bookingData.service,
        booking_date: bookingData.booking_date,
        booking_time: bookingData.booking_time,
        notes: bookingData.notes || null,
      })
      .select()
      .single();
    
    if (insertError) {
      console.error("Error inserting booking:", insertError);
      return new Response(JSON.stringify({ error: "Failed to create booking" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // 2. Send confirmation email
    // In a production environment, you'd use a service like Resend, SendGrid, or AWS SES
    // For now, we'll log the email content
    console.log(`
      Would send email to: ${bookingData.email}
      Subject: Booking Confirmation - HOMEBOY Barbing Saloon
      Body: 
      Dear ${bookingData.name},
      
      Your booking is being processed. ML will get back to you shortly to confirm your appointment.
      
      Booking Details:
      - Service: ${bookingData.service}
      - Date: ${bookingData.booking_date}
      - Time: ${bookingData.booking_time}
      
      If you need to make any changes, please contact us.
      
      Thank you for choosing HOMEBOY Barbing Saloon.
    `);
    
    return new Response(JSON.stringify({ success: true, data: bookingRecord }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error processing booking:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
