import { supabase } from "../lib/supabase";

export async function fetchMyProfile(userId) {
  return supabase
    .from("profiles")
    .select("id, email, full_name, role, manager_id, created_at")
    .eq("id", userId)
    .maybeSingle();
}

export async function createProfile(profile) {
  return supabase
    .from("profiles")
    .insert(profile)
    .select()
    .single();
}

export async function updateMyProfile(userId, updates) {
  const safeUpdates = { ...updates };
  delete safeUpdates.role;

  return supabase
    .from("profiles")
    .update(safeUpdates)
    .eq("id", userId)
    .select()
    .single();
}

export async function fetchTeamProfiles() {
  return supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
}