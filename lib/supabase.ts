import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY!;

export const isSupabaseConfigured = () => {
    return !!supabaseUrl && !!supabaseKey;
}

// Initialize Supabase client
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : ({} as SupabaseClient);