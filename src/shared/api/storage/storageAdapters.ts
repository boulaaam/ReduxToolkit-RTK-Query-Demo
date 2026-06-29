import localforage from "localforage";

export type CacheStrategy = "session" | "persistent" | "memory";

export interface CacheEnvelope<T> {
  value: T;
  timestamp: number;
}

export interface StorageAdapter {
  get<T>(key: string): Promise<CacheEnvelope<T> | null>;
  set<T>(key: string, envelope: CacheEnvelope<T>): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

const memoryStore = new Map<string, CacheEnvelope<unknown>>();

const inBrowser = typeof window !== "undefined";

if (inBrowser) {
  localforage.config({
    name: "rtk-demo",
    storeName: "rtk-cache",
  });
}

const sessionAdapter: StorageAdapter = {
  async get<T>(key: string) {
    if (!inBrowser) {
      return (memoryStore.get(`session:${key}`) as CacheEnvelope<T> | undefined) ?? null;
    }
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as CacheEnvelope<T>) : null;
  },
  async set<T>(key: string, envelope: CacheEnvelope<T>) {
    if (!inBrowser) {
      memoryStore.set(`session:${key}`, envelope);
      return;
    }
    window.sessionStorage.setItem(key, JSON.stringify(envelope));
  },
  async remove(key: string) {
    if (!inBrowser) {
      memoryStore.delete(`session:${key}`);
      return;
    }
    window.sessionStorage.removeItem(key);
  },
  async clear() {
    if (!inBrowser) {
      for (const key of memoryStore.keys()) {
        if (key.startsWith("session:")) {
          memoryStore.delete(key);
        }
      }
      return;
    }
    window.sessionStorage.clear();
  },
};

const persistentAdapter: StorageAdapter = {
  async get<T>(key: string) {
    try {
      const raw = await localforage.getItem<string>(key);
      return raw ? (JSON.parse(raw) as CacheEnvelope<T>) : null;
    } catch {
      return (memoryStore.get(`persistent:${key}`) as CacheEnvelope<T> | undefined) ?? null;
    }
  },
  async set<T>(key: string, envelope: CacheEnvelope<T>) {
    try {
      await localforage.setItem(key, JSON.stringify(envelope));
    } catch {
      memoryStore.set(`persistent:${key}`, envelope);
    }
  },
  async remove(key: string) {
    try {
      await localforage.removeItem(key);
    } catch {
      memoryStore.delete(`persistent:${key}`);
    }
  },
  async clear() {
    try {
      await localforage.clear();
    } catch {
      for (const key of memoryStore.keys()) {
        if (key.startsWith("persistent:")) {
          memoryStore.delete(key);
        }
      }
    }
  },
};

const memoryAdapter: StorageAdapter = {
  async get<T>(key: string) {
    return (memoryStore.get(`memory:${key}`) as CacheEnvelope<T> | undefined) ?? null;
  },
  async set<T>(key: string, envelope: CacheEnvelope<T>) {
    memoryStore.set(`memory:${key}`, envelope);
  },
  async remove(key: string) {
    memoryStore.delete(`memory:${key}`);
  },
  async clear() {
    for (const key of memoryStore.keys()) {
      if (key.startsWith("memory:")) {
        memoryStore.delete(key);
      }
    }
  },
};

export const createStorageAdapter = (strategy: CacheStrategy): StorageAdapter => {
  switch (strategy) {
    case "session":
      return sessionAdapter;
    case "persistent":
      return persistentAdapter;
    default:
      return memoryAdapter;
  }
};

export const wrapValue = <T>(value: T): CacheEnvelope<T> => ({
  value,
  timestamp: Date.now(),
});

export const isExpired = (envelope: CacheEnvelope<unknown>, ttlMs?: number): boolean => {
  if (!ttlMs) {
    return false;
  }
  return Date.now() - envelope.timestamp > ttlMs;
};
