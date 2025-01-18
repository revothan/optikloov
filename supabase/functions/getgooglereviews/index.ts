import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PLACE_ID = 'ChIJB4mHgUf9aS4R7iaKRW0At0I';
    const API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');

    if (!API_KEY) {
      throw new Error('Google Places API key not found');
    }

    // Added language=id parameter to get reviews in Indonesian
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews&language=id&key=${API_KEY}`;
    
    console.log('Fetching reviews from Google Places API...');
    const response = await fetch(url);
    const data = await response.json();

    console.log('Reviews fetched successfully');
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});