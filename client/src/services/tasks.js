import { supabase } from "../lib/supabase";

export async function fetchTasks() {
  return supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });
}

export async function createTask(task) {
  return supabase.from("tasks").insert([task]).select().single();
}

export async function updateTask(id, updates) {
  return supabase
    .from("tasks")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
}

export async function deleteTask(id) {
  return supabase.from("tasks").delete().eq("id", id);
}