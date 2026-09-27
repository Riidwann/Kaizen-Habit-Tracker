export class LocalStorageDriver {
  private readonly prefix: string;

  constructor(prefix: string = "") {
    this.prefix = prefix;
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  public getItem<T>(key: string, fallback: T | null = null): T | null {
    if (typeof window === "undefined" || !window.localStorage) {
      return fallback;
    }

    try {
      const raw = window.localStorage.getItem(this.getKey(key));
      if (raw === null || raw === undefined) {
        return fallback;
      }
      return JSON.parse(raw) as T;
    } catch (err) {
      console.warn(`[LocalStorageDriver] Failed to parse item "${key}":`, err);
      return fallback;
    }
  }

  public setItem<T>(key: string, value: T): boolean {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (err) {
      console.error(`[LocalStorageDriver] Failed to set item "${key}":`, err);
      return false;
    }
  }

  public removeItem(key: string): boolean {
    if (typeof window === "undefined" || !window.localStorage) {
      return false;
    }

    try {
      window.localStorage.removeItem(this.getKey(key));
      return true;
    } catch (err) {
      console.error(`[LocalStorageDriver] Failed to remove item "${key}":`, err);
      return false;
    }
  }

  public clear(): void {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }

    try {
      if (!this.prefix) {
        window.localStorage.clear();
        return;
      }

      const keysToRemove: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (k && k.startsWith(this.prefix)) {
          keysToRemove.push(k);
        }
      }
      for (const k of keysToRemove) {
        window.localStorage.removeItem(k);
      }
    } catch (err) {
      console.error(`[LocalStorageDriver] Failed to clear items:`, err);
    }
  }
}

export const localStorageDriver = new LocalStorageDriver();
