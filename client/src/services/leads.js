import { supabase } from "../lib/supabase";

export async function fetchLeads() {
  return supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function createLead(lead) {
  return supabase.from("leads").insert([lead]).select().single();
}

export async function updateLead(id, updates) {
  return supabase
    .from("leads")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteLead(id) {
  return supabase.from("leads").delete().eq("id", id);
}