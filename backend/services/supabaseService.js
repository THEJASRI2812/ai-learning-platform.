const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;
const supabaseKey = (serviceRoleKey && !serviceRoleKey.includes('mock') && !serviceRoleKey.includes('your-'))
  ? serviceRoleKey
  : anonKey;

let supabase = null;

const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== 'https://your-project.supabase.co' &&
    supabaseUrl !== 'https://mock-supabase.supabase.co' &&
    !supabaseUrl.includes('mock')
  );
};

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('[SupabaseService] Initialized with Supabase URL:', supabaseUrl);
  } catch (err) {
    console.error('[SupabaseService] Failed to initialize Supabase client:', err.message);
  }
} else {
  console.log('[SupabaseService] Supabase credentials not set or using mock mode. In-memory fallback active.');
}

module.exports = {
  supabase,
  isSupabaseConfigured
};
