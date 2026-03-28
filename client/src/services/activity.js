import { supabase } from "../lib/supabase";

export async function fetchLeadActivity() {
  return supabase
    .from("lead_activity")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function createLeadActivity(activity) {
  return supabase.from("lead_activity").insert([activity]).select().single();
}