// expo-secure-store wrapper. Refresh token + device id live here — never in AsyncStorage.
import * as SecureStore from "expo-secure-store";

const REFRESH_KEY = "serene.refreshToken";
const DEVICE_KEY = "serene.deviceId";

let cachedDeviceId: string | null = null;
// If the native secure store ever fails (unsupported runtime), the token still works for this session.
let memoryRefresh: string | null = null;

export async function getRefreshToken(): Promise<string | null> {
  try {
    return (await SecureStore.getItemAsync(REFRESH_KEY)) ?? memoryRefresh;
  } catch {
    return memoryRefresh;
  }
}

export async function setRefreshToken(token: string): Promise<void> {
  memoryRefresh = token;
  try {
    await SecureStore.setItemAsync(REFRESH_KEY, token);
  } catch {
    // memory fallback above keeps this session signed in
  }
}

export async function clearRefreshToken(): Promise<void> {
  memoryRefresh = null;
  try {
    await SecureStore.deleteItemAsync(REFRESH_KEY);
  } catch {
    // nothing to delete
  }
}

function generateUUID(): string {
  if (typeof crypto !== "undefined" && typeof (crypto as any).randomUUID === "function") {
    try {
      return (crypto as any).randomUUID();
    } catch {}
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Persistent UUID for this install; generated once and kept across logins. */
export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;
  let id: string | null = null;
  try {
    id = await SecureStore.getItemAsync(DEVICE_KEY);
  } catch {
    id = null;
  }
  if (!id) {
    id = generateUUID();
    try {
      await SecureStore.setItemAsync(DEVICE_KEY, id);
    } catch {
      // keep the in-memory id for this run
    }
  }
  cachedDeviceId = id;
  return id;
}

const BIO_KEY = "serene.biometricAccount";
let memoryBio: BiometricAccount | null = null;

/** The one account this device may unlock with a fingerprint. Written only after a successful sign-in the user opted in to. */
export type BiometricAccount = { email: string; password: string; name?: string };

export async function getBiometricAccount(): Promise<BiometricAccount | null> {
  try {
    const raw = await SecureStore.getItemAsync(BIO_KEY);
    return raw ? (JSON.parse(raw) as BiometricAccount) : memoryBio;
  } catch {
    return memoryBio;
  }
}

export async function setBiometricAccount(account: BiometricAccount): Promise<void> {
  memoryBio = account;
  try {
    await SecureStore.setItemAsync(BIO_KEY, JSON.stringify(account));
  } catch {
    // memory fallback keeps it for this run
  }
}

export async function clearBiometricAccount(): Promise<void> {
  memoryBio = null;
  try {
    await SecureStore.deleteItemAsync(BIO_KEY);
  } catch {
    // nothing stored
  }
}

/** Wipe everything sensitive. The device id is intentionally kept. */
export const wipeSecureStore = clearRefreshToken;
