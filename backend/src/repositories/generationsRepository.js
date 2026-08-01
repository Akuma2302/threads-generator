const { getSupabaseClient } = require('../services/supabaseClient');

const TABLE = 'generations';
const HISTORY_LIMIT = 30;

/**
 * Saves a completed generation for a given device. Best-effort — if
 * Supabase isn't configured or the write fails, this resolves quietly
 * rather than throwing, since history persistence should never block the
 * actual generate response the user is waiting on.
 */
async function saveGeneration(deviceId, form, result) {
  const supabase = getSupabaseClient();
  if (!supabase || !deviceId) return;

  const { error } = await supabase.from(TABLE).insert({
    device_id: deviceId,
    form,
    result,
  });

  if (error) {
    console.error('[generationsRepository] saveGeneration failed:', error.message);
  }
}

/**
 * Fetches this device's most recent generations, newest first.
 * Returns [] if Supabase isn't configured, rather than throwing.
 */
async function getHistory(deviceId) {
  const supabase = getSupabaseClient();
  if (!supabase || !deviceId) return [];

  const { data, error } = await supabase
    .from(TABLE)
    .select('id, form, result, created_at')
    .eq('device_id', deviceId)
    .order('created_at', { ascending: false })
    .limit(HISTORY_LIMIT);

  if (error) {
    console.error('[generationsRepository] getHistory failed:', error.message);
    return [];
  }

  return data || [];
}

/**
 * Deletes all history rows for this device only — the WHERE clause on
 * device_id is what keeps this scoped to a single anonymous user.
 */
async function clearHistory(deviceId) {
  const supabase = getSupabaseClient();
  if (!supabase || !deviceId) return;

  const { error } = await supabase.from(TABLE).delete().eq('device_id', deviceId);

  if (error) {
    console.error('[generationsRepository] clearHistory failed:', error.message);
  }
}

module.exports = { saveGeneration, getHistory, clearHistory };
