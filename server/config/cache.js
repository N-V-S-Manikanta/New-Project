// Simple in-memory cache to reduce API calls
const cache = new Map();

const CACHE_TTL = parseInt(process.env.CACHE_TTL_SECONDS || '600', 10) * 1000; // default 10 minutes

const cacheService = {
  get(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      cache.delete(key);
      return null;
    }
    return entry.data;
  },

  set(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
  },

  delete(key) {
    cache.delete(key);
  },

  clear() {
    cache.clear();
  },
};

module.exports = cacheService;
