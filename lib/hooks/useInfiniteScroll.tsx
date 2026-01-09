"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions<T> {
  fetchFn: (page: number) => Promise<{ data: T[]; total: number } | null>;
  initialPage?: number;
  threshold?: number;
}

interface UseInfiniteScrollResult<T> {
  items: T[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  reset: () => void;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  total: number;
}

export function useInfiniteScroll<T>({
  fetchFn,
  initialPage = 1,
  threshold = 200,
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initial load
  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    loadingRef.current = true;

    try {
      const result = await fetchFn(initialPage);
      if (result) {
        setItems(result.data);
        setTotal(result.total);
        setHasMore(result.data.length < result.total);
        setPage(initialPage + 1);
      } else {
        setItems([]);
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setItems([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [fetchFn, initialPage]);

  // Load more
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    setIsLoadingMore(true);
    loadingRef.current = true;

    try {
      const result = await fetchFn(page);
      if (result) {
        setItems((prev) => [...prev, ...result.data]);
        setTotal(result.total);
        setHasMore(items.length + result.data.length < result.total);
        setPage((p) => p + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more data");
    } finally {
      setIsLoadingMore(false);
      loadingRef.current = false;
    }
  }, [fetchFn, page, hasMore, items.length]);

  // Reset
  const reset = useCallback(() => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setTotal(0);
    loadInitial();
  }, [initialPage, loadInitial]);

  // Initial load on mount
  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  // Setup intersection observer for sentinel element
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const callback: IntersectionObserverCallback = (entries) => {
      if (entries[0]?.isIntersecting && !loadingRef.current) {
        loadMore();
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin: `${threshold}px`,
    });

    // Return cleanup function
    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasMore, isLoading, loadMore, threshold]);

  return {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    reset,
    setItems,
    total,
  };
}

// Sentinel component to observe for infinite scroll
export function ScrollSentinel({
  onIntersect,
  isLoading,
  hasMore,
}: {
  onIntersect: () => void;
  isLoading: boolean;
  hasMore: boolean;
}) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: "200px" }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }

    return () => {
      if (sentinel) {
        observer.unobserve(sentinel);
      }
      observer.disconnect();
    };
  }, [onIntersect, isLoading, hasMore]);

  if (!hasMore) return null;

  return <div ref={sentinelRef} className="h-4" aria-hidden="true" />;
}
