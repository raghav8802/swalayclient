import { NextRequest } from "next/server";

// Enhanced in-memory cache for API responses
class ApiCache {
  private cache = new Map<string, { data: any; expiry: number }>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes
  private maxSize = 1000; // Prevent memory leaks

  set(key: string, data: any, ttl: number = this.defaultTTL) {
    // Prevent cache from growing too large
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize
    };
  }

  // Auto-cleanup expired entries
  cleanup() {
    const now = Date.now();
    this.cache.forEach((item, key) => {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    });
  }
}

export const apiCache = new ApiCache();

// Cleanup every 10 minutes
setInterval(() => {
  apiCache.cleanup();
}, 10 * 60 * 1000);

// ✅ Improved helper for generating cache keys
export function generateCacheKey(prefix: string, params: Record<string, any>): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${prefix}:${sortedParams}`;
}

// Cache decorator for API routes
export function withCache(key: string, ttl?: number) {
  return function(handler: Function) {
    return async (...args: any[]) => {
      const cached = apiCache.get(key);
      if (cached) {
        console.log(`✅ Cache hit: ${key}`);
        return cached;
      }

      const result = await handler(...args);
      apiCache.set(key, result, ttl);
      console.log(`💾 Cache set: ${key}`);
      return result;
    };
  };
}