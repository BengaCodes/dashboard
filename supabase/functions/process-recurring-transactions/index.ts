// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

Deno.serve(async (req) => {
  const { name } = await req.json()
  const data = {
    message: `Hello ${name}!`,
  }

  return new Response(
    JSON.stringify(data),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-recurring-transactions' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

function calculateNextDate(currentDate: string, frequency: string) {
  const date = new Date(currentDate)


  switch(frequency) {
    case 'daily':
      date.setDate(date.getDate() + 1)
      break
    case 'weekly':
      date.setDate(date.getDate() + 7)
      break
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      break
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1)
      break
    default:
      date.setMonth(date.getMonth() + 1)
  }

  return date.toISOString().split('T')[0]
}


serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {headers: corsHeaders})
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    const today = new Date().toISOString().split('T')[0]

    console.log(`Processing recurring transactions for date: ${today}`)

    // Get all recurring transactions that need to be created
    const {data: recurringTransactions, error: fetchError} = await supabaseClient
    .from('transactions')
    .select('*')
    .eq('recurring', true)
    .lte('recurring_next_date', today)
    .or(`recurring_end_date.is.null, recurring_end_date.gte${today}`)


    if (fetchError) {
      console.error('Error fetching recurring transactions: ', fetchError)
      throw fetchError
    }


    console.log(` Found ${recurringTransactions?.length || 0} recurring transactions to process`)

    const newTransactions = []
    const updates = []

    for (const transaction of recurringTransactions || []) {
      console.log(`Processing transaction: ${transaction.id}`)

      // Create new transaction instance
      const newTransaction = {
        date: transaction.recurring_next_date,
        description: transaction.description,
        amount: transaction.amount,
        category: transaction.category,
        type: transaction.type,
        user_id: transaction.user_id,
        parent_recurring_id: transaction.id,
        recurring: false
      }

      newTransactions.push(newTransaction)

      // Calculate next occurrence date
      const nextDate = calculateNextDate(transaction.recurring_next_date!, transaction.recurring.frequency)

      updates.push({
        id: transaction.id,
        recurring_next_date: nextDate
      })

    }

    // Insert new transactions
    if (newTransactions.length > 0) {
      const {error: insertError} = await supabaseClient
      .from('transactions')
      .insert(newTransactions)

      if (insertError) {
        console.error('Error inserting new transactions: ', insertError)
        throw insertError
      }

      console.log(`Successfully inserted ${newTransactions.length} new transactions`)
    }

    // Update recurring_next_date for parent transactions
    for (const update of updates) {
      const {error: updateError} = await supabaseClient
      .from('transactions')
      .update({recurring_next_date: update.recurring_next_date})
      .eq('id', update.id)

      if (updateError) {
        console.error(`Error updating transaction ${update.id}`, updateError)
      }
    }

    console.log(`Updated ${updated.length} recurring transactions with next dates`)

    return new Response(
      JSON.stringify({
        success: true,
        created: newTransactions.length,
        updated: updated.length,
        message: `Created ${newTransactions.length} recurring transactions `
      }),
      {
        headers: {...corsHeaders, 'Content-Type': 'application/json'},
        status: 200
      }
    )
  } catch (error) {
    console.error('Error in process-recurring-transactions', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: {...corsHeaders, 'Content-Type': 'application/json'},
        status: 400
      }
    )
  }
})
