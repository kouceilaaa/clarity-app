"use client";

import type { SimplificationData } from "@/lib/types";

/**
 * IndexedDB-based caching service for simplification results
 *
 * @description Provides local caching of simplification results for:
 * - Faster access to recent simplifications
 * - Offline viewing of cached content
 * - Reduced server load
 *
 * Cache is cleared when:
 * - User logs out
 * - Cache expires (24 hours default)
 * - Storage quota exceeded (LRU eviction)
 */

const DB_NAME = "clarity-cache";
const DB_VERSION = 1;
const STORE_NAME = "simplifications";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_CACHE_ITEMS = 100;

interface CachedSimplification extends SimplificationData {
  cachedAt: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

/**
 * Initialize or get the IndexedDB database connection
 */
function getDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Failed to open IndexedDB:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create simplifications store with indexes
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("cachedAt", "cachedAt", { unique: false });
        store.createIndex("mode", "mode", { unique: false });
        store.createIndex("isFavorite", "isFavorite", { unique: false });
      }
    };
  });

  return dbPromise;
}

/**
 * Cache a simplification result locally
 *
 * @param data - The simplification data to cache
 * @returns Promise<void>
 */
export async function cacheSimplification(
  data: SimplificationData
): Promise<void> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const cachedData: CachedSimplification = {
      ...data,
      cachedAt: Date.now(),
    };

    return new Promise((resolve, reject) => {
      const request = store.put(cachedData);
      request.onsuccess = () => {
        // Enforce max cache size
        enforceCacheLimit().then(resolve).catch(resolve);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("Failed to cache simplification:", error);
  }
}

/**
 * Get a cached simplification by ID
 *
 * @param id - The simplification ID
 * @returns Promise with cached data or null if not found/expired
 */
export async function getCachedSimplification(
  id: string
): Promise<SimplificationData | null> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => {
        const cached = request.result as CachedSimplification | undefined;

        if (!cached) {
          resolve(null);
          return;
        }

        // Check if expired
        if (Date.now() - cached.cachedAt > CACHE_EXPIRY_MS) {
          // Remove expired entry
          deleteCachedSimplification(id);
          resolve(null);
          return;
        }

        // Remove internal cachedAt field before returning
        const { cachedAt, ...data } = cached;
        resolve(data);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("Failed to get cached simplification:", error);
    return null;
  }
}

/**
 * Get all cached simplifications (non-expired)
 *
 * @param options - Filter options
 * @returns Promise with array of cached simplifications
 */
export async function getCachedSimplifications(options?: {
  mode?: "simple" | "accessible" | "summary";
  favoritesOnly?: boolean;
  limit?: number;
}): Promise<SimplificationData[]> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        let results = request.result as CachedSimplification[];
        const now = Date.now();

        // Filter expired entries
        results = results.filter(
          (item) => now - item.cachedAt <= CACHE_EXPIRY_MS
        );

        // Apply filters
        if (options?.mode) {
          results = results.filter((item) => item.mode === options.mode);
        }
        if (options?.favoritesOnly) {
          results = results.filter((item) => item.isFavorite);
        }

        // Sort by cached time (newest first)
        results.sort((a, b) => b.cachedAt - a.cachedAt);

        // Apply limit
        if (options?.limit && options.limit > 0) {
          results = results.slice(0, options.limit);
        }

        // Remove cachedAt from results
        const data = results.map(({ cachedAt, ...rest }) => rest);
        resolve(data);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("Failed to get cached simplifications:", error);
    return [];
  }
}

/**
 * Delete a cached simplification
 *
 * @param id - The simplification ID to delete
 */
export async function deleteCachedSimplification(id: string): Promise<void> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("Failed to delete cached simplification:", error);
  }
}

/**
 * Update favorite status in cache
 *
 * @param id - The simplification ID
 * @param isFavorite - New favorite status
 */
export async function updateCachedFavorite(
  id: string,
  isFavorite: boolean
): Promise<void> {
  try {
    const cached = await getCachedSimplification(id);
    if (cached) {
      await cacheSimplification({ ...cached, isFavorite });
    }
  } catch (error) {
    console.warn("Failed to update cached favorite:", error);
  }
}

/**
 * Clear all cached simplifications
 */
export async function clearCache(): Promise<void> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("Failed to clear cache:", error);
  }
}

/**
 * Clear expired entries from cache
 */
export async function clearExpiredCache(): Promise<void> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("cachedAt");
    const expiryCutoff = Date.now() - CACHE_EXPIRY_MS;

    return new Promise((resolve, reject) => {
      const range = IDBKeyRange.upperBound(expiryCutoff);
      const request = index.openCursor(range);

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.warn("Failed to clear expired cache:", error);
  }
}

/**
 * Enforce maximum cache size using LRU eviction
 */
async function enforceCacheLimit(): Promise<void> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("cachedAt");

    return new Promise((resolve, reject) => {
      const countRequest = store.count();
      countRequest.onsuccess = () => {
        const count = countRequest.result;
        if (count <= MAX_CACHE_ITEMS) {
          resolve();
          return;
        }

        // Delete oldest entries
        const deleteCount = count - MAX_CACHE_ITEMS;
        let deleted = 0;

        const cursorRequest = index.openCursor();
        cursorRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
            .result;
          if (cursor && deleted < deleteCount) {
            cursor.delete();
            deleted++;
            cursor.continue();
          } else {
            resolve();
          }
        };
        cursorRequest.onerror = () => reject(cursorRequest.error);
      };
      countRequest.onerror = () => reject(countRequest.error);
    });
  } catch (error) {
    console.warn("Failed to enforce cache limit:", error);
  }
}

/**
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  count: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}> {
  try {
    const db = await getDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("cachedAt");

    return new Promise((resolve, reject) => {
      const countRequest = store.count();
      let count = 0;
      let oldest: number | null = null;
      let newest: number | null = null;

      countRequest.onsuccess = () => {
        count = countRequest.result;

        if (count === 0) {
          resolve({ count: 0, oldestEntry: null, newestEntry: null });
          return;
        }

        // Get oldest
        const oldestRequest = index.openCursor();
        oldestRequest.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>)
            .result;
          if (cursor) {
            oldest = cursor.value.cachedAt;

            // Get newest
            const newestRequest = index.openCursor(null, "prev");
            newestRequest.onsuccess = (e) => {
              const newestCursor = (e.target as IDBRequest<IDBCursorWithValue>)
                .result;
              if (newestCursor) {
                newest = newestCursor.value.cachedAt;
              }
              resolve({
                count,
                oldestEntry: oldest ? new Date(oldest) : null,
                newestEntry: newest ? new Date(newest) : null,
              });
            };
          } else {
            resolve({ count: 0, oldestEntry: null, newestEntry: null });
          }
        };
      };
      countRequest.onerror = () => reject(countRequest.error);
    });
  } catch (error) {
    console.warn("Failed to get cache stats:", error);
    return { count: 0, oldestEntry: null, newestEntry: null };
  }
}

/**
 * Check if IndexedDB is supported
 */
export function isIndexedDBSupported(): boolean {
  return typeof window !== "undefined" && !!window.indexedDB;
}
