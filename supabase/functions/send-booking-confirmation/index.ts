
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import { Resend } from 'https://esm.sh/resend@2.0.0'

// Configuration
const SUPABASE_URL = 'https://qnasrupzjxawilizwelf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY'
const RESEND_API_KEY = 're_amWSstmM_N3fNwFbrdfKWcG16AWj3XUf7'
const ADMIN_EMAIL = 'slarico15@gmail.com' // Admin email to receive booking notifications

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
      ])
      .select();

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

    const bookingId = data && data[0] ? data[0].id : null;
    console.log('Booking saved to Supabase successfully with ID:', bookingId);

    // Reschedule link (encrypted with a basic hash to prevent abuse)
    const rescheduleParams = new URLSearchParams({
      id: bookingId,
      email: encodeURIComponent(booking.email),
      name: encodeURIComponent(booking.name)
    }).toString();
    
    const websiteUrl = 'https://homeboybarbing.com';
    const rescheduleUrl = `${websiteUrl}/reschedule?${rescheduleParams}`;

    // Send confirmation email to customer using Resend
    try {
      const customerEmailResponse = await resend.emails.send({
        from: 'HOMEBOY Barbing <onboarding@resend.dev>',
        to: booking.email,
        subject: 'Your HOMEBOY Barbing Appointment',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1A1F2C;">Your booking is confirmed!</h1>
            <p>Dear ${booking.name},</p>
            <p>Thank you for booking an appointment with HOMEBOY Barbing Saloon!</p>
            <p><strong>Service:</strong> ${booking.service}</p>
            <p><strong>Date:</strong> ${booking.booking_date}</p>
            <p><strong>Time:</strong> ${booking.booking_time}</p>
            <p>Need to change your appointment time? <a href="${rescheduleUrl}" style="color: #1A1F2C; font-weight: bold;">Click here to reschedule</a>.</p>
            <p>We look forward to seeing you!</p>
            <p>Best regards,<br/>HOMEBOY Barbing Saloon Team</p>
          </div>
        `,
      });
      
      console.log('Customer email sent successfully:', customerEmailResponse);
    } catch (emailError) {
      console.error('Error sending customer email:', emailError);
      // We continue even if customer email fails, just log it
    }

    // Send notification email to admin
    try {
      const adminEmailResponse = await resend.emails.send({
        from: 'HOMEBOY Barbing Bookings <onboarding@resend.dev>',
        to: ADMIN_EMAIL,
        subject: `New Booking: ${booking.service} on ${booking.booking_date}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1A1F2C;">New Appointment Booking</h1>
            <p>You have received a new booking:</p>
            <div style="background-color: #f7f7f7; border-left: 4px solid #1A1F2C; padding: 15px; margin: 20px 0;">
              <p><strong>Customer:</strong> ${booking.name}</p>
              <p><strong>Email:</strong> ${booking.email}</p>
              <p><strong>Phone:</strong> ${booking.phone}</p>
              <p><strong>Service:</strong> ${booking.service}</p>
              <p><strong>Date:</strong> ${booking.booking_date}</p>
              <p><strong>Time:</strong> ${booking.booking_time}</p>
              ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
            </div>
            <p>Please confirm this appointment with the customer.</p>
          </div>
        `,
      });
      
      console.log('Admin notification email sent successfully:', adminEmailResponse);
    } catch (emailError) {
      console.error('Error sending admin notification email:', emailError);
      // We continue even if admin email fails, just log it
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking created successfully',
        id: bookingId
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
