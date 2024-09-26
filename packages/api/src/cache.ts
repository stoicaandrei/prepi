import { kv } from "@vercel/kv";

type CacheableFunction<T> = (...args: any[]) => Promise<T>;

export async function cacheable<T>(
  fn: CacheableFunction<T>,
  key: string,
  ttl: number = 3600 // Default TTL of 1 hour
): Promise<T> {
  if (process.env.NODE_ENV === "development") {
    return fn();
  }

  // Try to get the cached value
  const cachedValue = await kv.get<T>(key);

  if (cachedValue !== null) {
    return cachedValue;
  }

  // If not in cache, execute the function
  const result = await fn();

  // Store the result in cache
  await kv.set(key, result, { ex: ttl });

  return result;
}
