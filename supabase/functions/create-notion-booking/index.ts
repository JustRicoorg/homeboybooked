
// Follow the Supabase Edge Functions documentation to deploy this function
// https://supabase.com/docs/guides/functions

import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'

const NOTION_API_KEY = Deno.env.get('NOTION_API_KEY')
const NOTION_DATABASE_ID = Deno.env.get('NOTION_DATABASE_ID')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

interface BookingData {
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
  notes: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!
    )

    // Get booking data from request
    const booking: BookingData = await req.json()

    // Validate booking data
    if (!booking.name || !booking.email || !booking.phone || !booking.service || !booking.date || !booking.time) {
      return new Response(
        JSON.stringify({ error: 'Missing required booking information' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // Check if Notion API key and database ID are set
    if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
      return new Response(
        JSON.stringify({ error: 'Notion API configuration is missing' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // Create Notion page in database
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
            phone_number: booking.phone,
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
              start: `${booking.date}T${booking.time.replace(/\s/g, '')}:00`,
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

    if (!notionResponse.ok) {
      const errorData = await notionResponse.json()
      console.error('Notion API error:', errorData)
      
      return new Response(
        JSON.stringify({ error: 'Failed to create booking in Notion' }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
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
          appointment_date: booking.date,
          appointment_time: booking.time,
          notes: booking.notes,
          status: 'pending',
        },
      ])

    if (error) {
      console.error('Supabase error:', error)
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Booking created successfully',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (err) {
    console.error('Error processing request:', err)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})
