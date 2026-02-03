export type Consent = {
  necessary: true; // always true
  analytics: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  version: string; // increment when consent categories change
  ts: string; // ISO timestamp
  consent: Consent;
};

const STORAGE_KEY = "fabiel_cookie_consent";
const CURRENT_VERSION = "v1";

export function getConsentFromStorage(): ConsentRecord | null {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentRecord;
    return parsed;
  } catch (e) {
    return null;
  }
}

export function saveConsentToStorage(c: Consent) {
  try {
    if (typeof window === "undefined") return;
    const record: ConsentRecord = { version: CURRENT_VERSION, ts: new Date().toISOString(), consent: c };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
  } catch (e) {}
}

export function clearConsentStorage() {
  try {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

export function buildDefaultConsent(): Consent {
  return { necessary: true, analytics: false, marketing: false };
}
