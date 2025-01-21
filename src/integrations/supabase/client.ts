import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://vdnbihrqujhmmgnshhhn.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZkbmJpaHJxdWpobW1nbnNoaGhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM4MDc1MDksImV4cCI6MjA0OTM4MzUwOX0.8_j4MMocXgT3CRS9PPdwEeeKj9_ShGkZArWSltfc_m0";

// Add error handling and retry logic
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
});

// Add a helper to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      console.error('Supabase connection error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to connect to Supabase:', err);
    return false;
  }
};