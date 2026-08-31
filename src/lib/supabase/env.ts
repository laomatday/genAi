// Public Supabase project configuration.
// The publishable key is intentionally safe for browser use and protected by RLS.
// Environment variables override these defaults when present.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://mgilfojjplgmfuycsekb.supabase.co";

export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_VptKIQ0Elozp5vBG_rGHKQ_V5rfggD1";
