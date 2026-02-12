import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Fail immediately if variables are missing to prevent confusing errors later
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase Environment Variables are missing. Check your .env file or Vercel Settings.");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);