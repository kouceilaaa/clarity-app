import { LRUCache } from "lru-cache";

// Rate limiter using LRU cache to track request counts
interface RateLimitOptions {
  /** Time window in milliseconds */
  windowMs?: number;
  /** Maximum requests per window */
  max?: number;
  /** Message to return when rate limited */
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const DEFAULT_OPTIONS: Required<RateLimitOptions> = {
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
  message: "Too many requests. Please try again later.",
};

// Global rate limit cache - stores request counts per IP/user
const rateLimitCache = new LRUCache<string, RateLimitEntry>({
  max: 10000, // Store up to 10k unique keys
  ttl: 60 * 60 * 1000, // 1 hour TTL
});

/**
 * Check if a request should be rate limited
 */
export function rateLimit(
  key: string,
  options: RateLimitOptions = {}
): { success: boolean; remaining: number; resetTime: number; error?: string } {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();

  const existing = rateLimitCache.get(key);

  // If no existing entry or window has expired, create new entry
  if (!existing || now > existing.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitCache.set(key, { count: 1, resetTime });
    return {
      success: true,
      remaining: config.max - 1,
      resetTime,
    };
  }

  // If within window, increment count
  existing.count += 1;
  rateLimitCache.set(key, existing);

  // Check if over limit
  if (existing.count > config.max) {
    return {
      success: false,
      remaining: 0,
      resetTime: existing.resetTime,
      error: config.message,
    };
  }

  return {
    success: true,
    remaining: config.max - existing.count,
    resetTime: existing.resetTime,
  };
}

/**
 * Get rate limit status without incrementing
 */
export function getRateLimitStatus(
  key: string,
  options: RateLimitOptions = {}
): { count: number; remaining: number; resetTime: number } {
  const config = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();

  const existing = rateLimitCache.get(key);

  if (!existing || now > existing.resetTime) {
    return {
      count: 0,
      remaining: config.max,
      resetTime: now + config.windowMs,
    };
  }

  return {
    count: existing.count,
    remaining: Math.max(0, config.max - existing.count),
    resetTime: existing.resetTime,
  };
}

/**
 * Reset rate limit for a key
 */
export function resetRateLimit(key: string): void {
  rateLimitCache.delete(key);
}

// Pre-configured rate limiters for different use cases
export const rateLimiters = {
  // Simplification: 10 per minute for unauthenticated, 30 for authenticated
  simplification: (userId?: string | null) =>
    rateLimit(userId ? `simplify:${userId}` : `simplify:anonymous`, {
      max: userId ? 30 : 10,
      windowMs: 60 * 1000,
    }),

  // Auth attempts: 5 per minute
  auth: (ip: string) =>
    rateLimit(`auth:${ip}`, { max: 5, windowMs: 60 * 1000 }),

  // API general: 100 per minute
  api: (userId?: string | null, ip?: string) =>
    rateLimit(userId ? `api:${userId}` : `api:${ip ?? "unknown"}`, {
      max: 100,
      windowMs: 60 * 1000,
    }),

  // Share links: 20 per minute
  share: (userId: string) =>
    rateLimit(`share:${userId}`, { max: 20, windowMs: 60 * 1000 }),
};

export type RateLimitResult = ReturnType<typeof rateLimit>;
