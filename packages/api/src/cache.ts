import { kv } from "@vercel/kv";

const CACHE_TTL = 3600; // 1 hour in seconds

export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  cacheKey: string,
  ttl = CACHE_TTL
): T {
  if (process.env.NODE_ENV === "development") {
    return fn;
  }

  return (async (...args: Parameters<T>) => {
    try {
      // Try to get the cached result
      const cachedResult = await kv.get(cacheKey);
      if (cachedResult !== null) {
        console.log(`Cache hit for key: ${cacheKey}`);
        return cachedResult;
      }

      // If not in cache, call the original function
      console.log(`Cache miss for key: ${cacheKey}`);
      const result = await fn(...args);

      // Store the result in cache
      await kv.set(cacheKey, result, { ex: ttl });

      return result;
    } catch (error) {
      console.error(`Error in cache wrapper: ${error}`);
      // If there's an error with caching, fall back to the original function
      return fn(...args);
    }
  }) as T;
}
