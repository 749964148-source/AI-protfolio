import type { GardenProfile, GardenTask } from "@/lib/types";

const PROFILE_KEY = "garden-guardian:profile:v1";
const TASKS_KEY = "garden-guardian:tasks:v1";

export function loadProfile(): GardenProfile | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(PROFILE_KEY) || "null") as GardenProfile | null; } catch { return null; }
}
export function saveProfile(profile: GardenProfile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(profile)); }
export function loadTasks(): GardenTask[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(TASKS_KEY) || "[]") as GardenTask[]; } catch { return []; }
}
export function saveTasks(tasks: GardenTask[]) { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)); }
