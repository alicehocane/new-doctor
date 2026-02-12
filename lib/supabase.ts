import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Configuration provided by user
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

// UPDATED: Using Service Role Key as requested to bypass RLS for admin uploads.
// WARNING: This key has full admin access. Do not expose this in a public-facing application.
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY;

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