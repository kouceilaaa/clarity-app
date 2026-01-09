"use client";

import { useCallback, useEffect, useState } from "react";
import type { SimplificationData } from "@/lib/types";
import {
  cacheSimplification,
  getCachedSimplification,
  getCachedSimplifications,
  deleteCachedSimplification,
  updateCachedFavorite,
  clearCache,
  clearExpiredCache,
  getCacheStats,
  isIndexedDBSupported,
} from "@/lib/services/cache.service";

interface CacheStats {
  count: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

interface UseSimplificationCacheReturn {
  /** Whether IndexedDB caching is supported */
  isSupported: boolean;
  /** Cache a new simplification */
  cache: (data: SimplificationData) => Promise<void>;
  /** Get a cached simplification by ID */
  get: (id: string) => Promise<SimplificationData | null>;
  /** Get all cached simplifications with optional filters */
  getAll: (options?: {
    mode?: "simple" | "accessible" | "summary";
    favoritesOnly?: boolean;
    limit?: number;
  }) => Promise<SimplificationData[]>;
  /** Delete a cached simplification */
  remove: (id: string) => Promise<void>;
  /** Update favorite status in cache */
  updateFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  /** Clear all cached data */
  clear: () => Promise<void>;
  /** Clear expired entries */
  clearExpired: () => Promise<void>;
  /** Get cache statistics */
  stats: CacheStats | null;
  /** Refresh cache statistics */
  refreshStats: () => Promise<void>;
}

/**
 * Hook for managing local simplification cache
 *
 * @description Provides a React-friendly interface to the IndexedDB cache service.
 * Automatically clears expired entries on mount.
 *
 * @example
 * ```tsx
 * const { cache, get, isSupported, stats } = useSimplificationCache();
 *
 * // Cache a new simplification
 * await cache(simplificationData);
 *
 * // Get cached data
 * const cached = await get(id);
 *
 * // Check cache stats
 * console.log(`${stats?.count} items cached`);
 * ```
 */
export function useSimplificationCache(): UseSimplificationCacheReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [stats, setStats] = useState<CacheStats | null>(null);

  // Check support and clear expired on mount
  useEffect(() => {
    const supported = isIndexedDBSupported();
    setIsSupported(supported);

    if (supported) {
      // Clear expired entries on mount
      clearExpiredCache().catch(console.warn);
      // Fetch initial stats
      getCacheStats().then(setStats).catch(console.warn);
    }
  }, []);

  const cache = useCallback(async (data: SimplificationData) => {
    await cacheSimplification(data);
    // Refresh stats after caching
    getCacheStats().then(setStats).catch(console.warn);
  }, []);

  const get = useCallback(async (id: string) => {
    return getCachedSimplification(id);
  }, []);

  const getAll = useCallback(
    async (options?: {
      mode?: "simple" | "accessible" | "summary";
      favoritesOnly?: boolean;
      limit?: number;
    }) => {
      return getCachedSimplifications(options);
    },
    []
  );

  const remove = useCallback(async (id: string) => {
    await deleteCachedSimplification(id);
    // Refresh stats after deletion
    getCacheStats().then(setStats).catch(console.warn);
  }, []);

  const updateFavorite = useCallback(
    async (id: string, isFavorite: boolean) => {
      await updateCachedFavorite(id, isFavorite);
    },
    []
  );

  const clear = useCallback(async () => {
    await clearCache();
    setStats({ count: 0, oldestEntry: null, newestEntry: null });
  }, []);

  const clearExpired = useCallback(async () => {
    await clearExpiredCache();
    getCacheStats().then(setStats).catch(console.warn);
  }, []);

  const refreshStats = useCallback(async () => {
    const newStats = await getCacheStats();
    setStats(newStats);
  }, []);

  return {
    isSupported,
    cache,
    get,
    getAll,
    remove,
    updateFavorite,
    clear,
    clearExpired,
    stats,
    refreshStats,
  };
}
