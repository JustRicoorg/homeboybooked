
// Follow the Supabase Edge Functions documentation to deploy this function
// https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

// Notion and Supabase configuration
const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY') || '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'
const NOTION_DATABASE_ID = Deno.env.get('NOTION_DATABASE_ID') || '1e1ea413f11e8020a7b8f6bc17efca57'
const SUPABASE_URL = 'https://qnasrupzjxawilizwelf.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuYXNydXB6anhhd2lsaXp3ZWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU2ODcxMjgsImV4cCI6MjA2MTI2MzEyOH0.kOZ0OHI-OBoo_PQ8o3KUU9T-z9YI42raUHZqnvXwAWY'

interface BookingData {
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
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
    return new Response('ok', { headers: corsHeaders })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
  }

  try {
    // Create a Supabase client with your credentials
    const supabaseClient = createClient(
      SUPABASE_URL,
      SUPABASE_ANON_KEY
    )

    // Get booking data from request
    const booking: BookingData = await req.json()

    // Validate booking data
    if (!booking.name || !booking.email || !booking.phone || !booking.service || !booking.date || !booking.time) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking information' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    console.log('Processing booking:', JSON.stringify(booking))

    // Save booking to Supabase
    const { data, error } = await supabaseClient
      .from('homeboy_booking_client')
      .insert([
        {
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          service: booking.service,
          appointment_date: booking.date,
          appointment_time: booking.time,
          notes: booking.notes || '',
          status: 'pending',
        },
      ])

    if (error) {
      console.error('Supabase error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to save booking to database', details: error }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        }
      )
    }

    console.log('Booking saved to Supabase successfully')

    // Create Notion page in database
    let notionResult = { success: false }
    
    try {
      // Format date and time for Notion
      const appointmentDateTime = `${booking.date}T${booking.time.replace(/\s/g, '')}:00`
      
      console.log('Creating Notion page with appointment time:', appointmentDateTime)
      
      // Create Notion page
      const notionResponse = await fetch(`https://api.notion.com/v1/pages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          parent: { database_id: NOTION_DATABASE_ID },
          properties: {
            Name: {
              title: [
                {
                  text: {
                    content: booking.name,
                  },
                },
              ],
            },
            Email: {
              email: booking.email,
            },
            Phone: {
              rich_text: [
                {
                  text: {
                    content: booking.phone,
                  },
                },
              ],
            },
            Service: {
              rich_text: [
                {
                  text: {
                    content: booking.service,
                  },
                },
              ],
            },
            Date: {
              date: {
                start: appointmentDateTime,
              },
            },
            Notes: {
              rich_text: [
                {
                  text: {
                    content: booking.notes || 'No additional notes',
                  },
                },
              ],
            },
            Status: {
              select: {
                name: 'Pending',
              },
            },
          },
        }),
      })

      const notionData = await notionResponse.json()
      
      if (notionResponse.ok) {
        notionResult.success = true
        console.log('Notion page created successfully')
      } else {
        console.error('Notion API error:', notionData)
      }
    } catch (notionErr) {
      console.error('Notion integration error:', notionErr)
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking created successfully',
        notionSync: notionResult.success ? 'succeeded' : 'failed',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  } catch (err) {
    console.error('Error processing request:', err)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
})
