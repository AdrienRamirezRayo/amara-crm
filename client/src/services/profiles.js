import { supabase } from "../lib/supabase";

export async function fetchMyProfile(userId) {
  return supabase.from("profiles").select("*").eq("id", userId).single();
}

export async function upsertProfile(profile) {
  return supabase.from("profiles").upsert(profile).select().single();
}

export async function fetchTeamProfiles() {
  return supabase.from("profiles").select("*").order("created_at", { ascending: false });
}