import type { UserProfile } from "./types";

const STORAGE_KEY = "ct_consultores_users";
const SESSION_KEY = "ct_consultores_session";

function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export function getAllUsers(): Record<string, UserProfile> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveUser(profile: UserProfile): void {
  const users = getAllUsers();
  users[profile.username.toLowerCase()] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export function generateUsername(nombre: string): string {
  const firstName = nombre.trim().split(" ")[0];
  const digits = String(Math.floor(Math.random() * 900) + 100);
  const candidate = firstName + digits;
  const users = getAllUsers();
  if (users[candidate.toLowerCase()]) {
    return generateUsername(nombre);
  }
  return candidate;
}

export function loginUser(username: string, password: string): UserProfile | null {
  const users = getAllUsers();
  const profile = users[username.toLowerCase()];
  if (!profile) return null;
  if (profile.passwordHash !== simpleHash(password)) return null;
  return profile;
}

export function hashPassword(password: string): string {
  return simpleHash(password);
}

export function setSession(username: string): void {
  sessionStorage.setItem(SESSION_KEY, username);
}

export function getSession(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function clearSession(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function getUser(username: string): UserProfile | null {
  const users = getAllUsers();
  return users[username.toLowerCase()] ?? null;
}
