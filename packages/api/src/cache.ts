import { kv } from "@vercel/kv";

const CACHE_TTL = 3600; // 1 hour in seconds

const _useProdCache = (key: string, ttl: number = CACHE_TTL) => {
  return {
    getCache: async () => {
      const cachedData = await kv.get(key);
      if (cachedData) {
        console.log("Data fetched from cache");
        return cachedData;
      }
      return null;
    },
    setCache: async (data: any) => {
      await kv.set(key, data, {
        ex: CACHE_TTL,
      });
      console.log("Data stored in cache");
    },
    deleteCache: async () => {
      await kv.del(key);
      console.log("Data deleted from cache");
    },
  };
};

const _useDevCache = (key: string, ttl: number = CACHE_TTL) => {
  let cache: any = null;
  return {
    getCache: async () => {
      if (cache) {
        console.log("Data fetched from cache");
        return cache;
      }
      return null;
    },
    setCache: async (data: any) => {
      cache = data;
      console.log("Data stored in cache");
    },
    deleteCache: async () => {
      cache = null;
      console.log("Data deleted from cache");
    },
  };
};

export const useCache =
  process.env.NODE_ENV === "production" ? _useProdCache : _useDevCache;
