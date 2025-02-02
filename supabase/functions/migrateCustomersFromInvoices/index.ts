import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all invoices from February 2, 2025
    const { data: invoices, error: invoicesError } = await supabaseClient
      .from('invoices')
      .select('*')
      .eq('sale_date', '2025-02-02')

    if (invoicesError) {
      throw invoicesError
    }

    console.log(`Found ${invoices.length} invoices from February 2, 2025`)

    for (const invoice of invoices) {
      // Check if customer already exists
      const { data: existingCustomer } = await supabaseClient
        .from('customers')
        .select('*')
        .eq('phone', invoice.customer_phone)
        .maybeSingle()

      if (!existingCustomer) {
        // Create new customer
        const { error: insertError } = await supabaseClient
          .from('customers')
          .insert({
            name: invoice.customer_name,
            email: invoice.customer_email,
            phone: invoice.customer_phone,
            birth_date: invoice.customer_birth_date,
            address: invoice.customer_address,
            join_date: invoice.sale_date,
            membership_type: 'Classic',
            is_active: true,
          })

        if (insertError) {
          console.error('Error inserting customer:', insertError)
          continue
        }

        console.log(`Created new customer: ${invoice.customer_name}`)
      } else {
        console.log(`Customer ${invoice.customer_name} already exists`)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Customer migration completed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})