
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import { Resend } from 'https://esm.sh/resend@2.0.0'

// Configuration
const SUPABASE_URL = 'https://qnasrupzjxawilizwelf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY'
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''

const resend = new Resend(RESEND_API_KEY);

interface BookingData {
  name: string
  email: string
  phone: string
  service: string
  booking_date: string
  booking_time: string
  notes: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  try {
    // Create a Supabase client with your credentials
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    );

    // Get booking data from request
    const booking: BookingData = await req.json();

    // Validate booking data
    if (!booking.name || !booking.email || !booking.phone || !booking.service || !booking.booking_date || !booking.booking_time) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking information' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Processing booking:', JSON.stringify(booking));

    // Check if there's already a booking for this time slot
    const { data: existingBookings, error: queryError } = await supabaseClient
      .from('bookings')
      .select('*')
      .eq('booking_date', booking.booking_date)
      .eq('booking_time', booking.booking_time);

    if (queryError) {
      console.error('Error checking for existing bookings:', queryError);
      return new Response(
        JSON.stringify({ error: 'Failed to check availability', details: queryError }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    if (existingBookings && existingBookings.length > 0) {
      return new Response(
        JSON.stringify({ error: 'This time slot is already booked. Please select a different time.' }),
        {
          status: 409, // Conflict
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    // Save booking to Supabase
    const { data, error } = await supabaseClient
      .from('bookings')
      .insert([
        {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          service: booking.service,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          notes: booking.notes || '',
          status: 'pending',
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save booking to database', details: error }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      );
    }

    console.log('Booking saved to Supabase successfully');

    // Send confirmation email using Resend
    try {
      const emailResponse = await resend.emails.send({
        from: 'HOMEBOY Barbing <onboarding@resend.dev>',
        to: booking.email,
        subject: 'Your HOMEBOY Barbing Appointment',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1A1F2C;">Your booking is being processed</h1>
            <p>Dear ${booking.name},</p>
            <p>Thank you for booking an appointment with HOMEBOY Barbing Saloon!</p>
            <p><strong>Service:</strong> ${booking.service}</p>
            <p><strong>Date:</strong> ${booking.booking_date}</p>
            <p><strong>Time:</strong> ${booking.booking_time}</p>
            <p>ML will get back to you shortly to confirm your appointment.</p>
            <p>Best regards,<br/>HOMEBOY Barbing Saloon Team</p>
          </div>
        `,
      });
      
      console.log('Email sent successfully:', emailResponse);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // We continue even if email fails, just log it
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking created successfully',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (err) {
    console.error('Error processing request:', err);
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
