import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration provided by user
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcqtnpqcgzuagrsubhbz.supabase.co';

// UPDATED: Using Service Role Key as requested to bypass RLS for admin uploads.
// WARNING: This key has full admin access. Do not expose this in a public-facing application.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcXRucHFjZ3p1YWdyc3ViaGJ6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDE4MTAyMiwiZXhwIjoyMDg1NzU3MDIyfQ.WHXDyCMOF_TZKffdj4uH-dWTdW_XCGi6nM3-M4gyZ7E';

export const isSupabaseConfigured = () => {
    return supabaseUrl.length > 0 && supabaseKey.length > 0;
}

// Initialize Supabase client
// We check configuration status to ensure we don't pass empty strings to createClient
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : ({} as SupabaseClient);