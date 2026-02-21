import { api } from "./index";
import type { User } from "../types/api.types";

/** Dev-mode login: POST /api/login { username } */
export async function login(username: string): Promise<void> {
  await api.post("/api/login", { username });
}

/** Fetch authenticated user profile */
export async function getUser(): Promise<User> {
  const { data } = await api.get<User>("/api/auth/user");
  return data;
}
