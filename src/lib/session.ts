export const SESSION_KEYS = {
  birthdateResult: "selfscape:birthdateResult",
  bigFiveScores: "selfscape:bigFiveScores",
  enneagramResult: "selfscape:enneagramResult",
  mbtiResult: "selfscape:mbtiResult",
  narrativeResult: "selfscape:narrativeResult",
} as const;

export function saveToSession(key: string, value: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // sessionStorage unavailable (SSR, private browsing quota exceeded)
  }
}

export function loadFromSession<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function removeFromSession(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // ignore
  }
}
