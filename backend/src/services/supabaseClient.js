const { createClient } = require('@supabase/supabase-js');
const { supabaseUrl, supabaseServiceRoleKey } = require('../config/env');

let client = null;
let warned = false;

/**
 * Returns a Supabase client using the service role key (server-side only,
 * never expose this key to the frontend). Returns null if Supabase hasn't
 * been configured — callers should treat that as "history persistence is
 * disabled" rather than an error, so the app keeps working without it.
 */
function getSupabaseClient() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    if (!warned) {
      console.warn('[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — history will not be saved.');
      warned = true;
    }
    return null;
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }

  return client;
}

module.exports = { getSupabaseClient };
