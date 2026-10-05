/**
 * AI-POWERED PERSONALIZED LEARNING PLATFORM
 * Frontend Configuration File (config.js)
 * 
 * IMPORTANT:
 * Only use the public/anon key in the frontend.
 * Never expose: service_role key, database password, or Gemini API key.
 */

// Supabase Configuration (Connected to live project)
const SUPABASE_URL = "https://ltvemrtohqrfqangwtmj.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_4UBdq6o1AevhdMl6trNtqQ_fffnxU_B";

// Backend Express API URL
const API_BASE_URL = "http://localhost:5000/api";

// Platform Global Config
const APP_CONFIG = {
  appName: "AI-Powered Personalized Learning & Skill Development Platform",
  version: "1.0.0",
  apiBaseUrl: API_BASE_URL,
  supabaseUrl: SUPABASE_URL,
  supabaseAnonKey: SUPABASE_ANON_KEY,
  // When live backend or Supabase is offline, the app uses graceful client-side demo mode
  enableDemoModeFallback: true
};

window.APP_CONFIG = APP_CONFIG;
