import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration provided by user
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fcqtnpqcgzuagrsubhbz.supabase.co';

// UPDATED: Using Anon Key. Service Role Key must NOT be used on client side.
// Ensure your Supabase RLS policies are configured to allow the authenticated admin user to write data.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcXRucHFjZ3p1YWdyc3ViaGJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxODEwMjIsImV4cCI6MjA4NTc1NzAyMn0.pWzVs-Ja_4Huc9PikU3oQiP1Irf72uL6fi6Khn5R4e4';

export const isSupabaseConfigured = () => {
    return supabaseUrl.length > 0 && supabaseKey.length > 0;
}

// Helper to prevent runtime crashes if Supabase is not configured
// This returns a dummy client that rejects promises instead of throwing "undefined is not a function"
const createDummyClient = (): SupabaseClient => {
  const dummyPromise = () => Promise.resolve({ data: null, error: { message: 'Supabase is not configured in lib/supabase.ts' } });
  
  return {
    from: () => ({
      select: () => ({
        eq: () => ({ 
          single: dummyPromise,
          maybeSingle: dummyPromise,
        }),
        neq: () => ({
            ilike: () => ({ limit: dummyPromise })
        }),
        order: () => ({ range: () => Promise.resolve({ data: [], error: null }) }),
        range: () => Promise.resolve({ data: [], error: null }),
        contains: () => ({ range: () => Promise.resolve({ data: [], error: null }) }),
        insert: dummyPromise,
        update: dummyPromise,
        delete: dummyPromise,
        upsert: dummyPromise,
      }),
    }),
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: dummyPromise,
      signOut: () => Promise.resolve({ error: null }),
    },
  } as unknown as SupabaseClient;
}

// Initialize Supabase client
// We check configuration status to ensure we don't pass empty strings to createClient
export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseKey)
  : createDummyClient();