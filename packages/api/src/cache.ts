import { kv } from "@vercel/kv";

const CACHE_TTL = 3600; // 1 hour in seconds

export const useCache = (key: string, ttl: number = CACHE_TTL) => {
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
