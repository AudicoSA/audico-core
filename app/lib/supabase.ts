
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// For development/demo purposes, use placeholder values if not configured
const isConfigured = supabaseUrl && supabaseAnonKey && 
                     supabaseUrl !== 'your_supabase_url' && 
                     supabaseAnonKey !== 'your_supabase_anon_key';

const defaultUrl = 'https://placeholder.supabase.co';
const defaultKey = 'placeholder_key';

export const supabase = createClient(
  isConfigured ? supabaseUrl : defaultUrl,
  isConfigured ? supabaseAnonKey : defaultKey
);

// For server-side operations
export const createServerSupabaseClient = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  
  if (!isConfigured || !supabaseServiceKey || supabaseServiceKey === 'your_supabase_service_key') {
    // Return a mock client for development
    return createClient(defaultUrl, defaultKey);
  }
  
  return createClient(supabaseUrl!, supabaseServiceKey);
};

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => isConfigured;
