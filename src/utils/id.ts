/**
 * Generates a unique ID. Uses crypto.randomUUID() when available (e.g. with expo-crypto),
 * otherwise falls back to a time-based + random string.
 */
export function generateId(): string {
  if (
    typeof globalThis !== 'undefined' &&
    typeof (globalThis as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID ===
      'function'
  ) {
    return (globalThis as { crypto: { randomUUID: () => string } }).crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
