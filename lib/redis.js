// ============================
// ÉCLAT — Upstash Redis Client
// Cache, webhook idempotency, job queue
// ============================

const { Redis } = require('@upstash/redis');

let redis = null;

function getRedis() {
    if (redis) return redis;

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
        return null; // Graceful fallback if not configured
    }

    redis = new Redis({ url, token });
    return redis;
}

module.exports = { getRedis };
