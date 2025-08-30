import Redis from 'ioredis';

// Redis connection
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
});

// Redis key prefix for webhook results
const WEBHOOK_PREFIX = 'webhook:';
const WEBHOOK_TTL = 3600; // 1 hour TTL

export const setWebhookResult = async (requestId: string, result: any) => {
  try {
    const key = `${WEBHOOK_PREFIX}${requestId}`;
    await redis.setex(key, WEBHOOK_TTL, JSON.stringify(result));
    console.log('Webhook result stored in Redis:', requestId);
  } catch (error) {
    console.error('Error storing webhook result in Redis:', error);
  }
};

export const getWebhookResult = async (requestId: string) => {
  try {
    const key = `${WEBHOOK_PREFIX}${requestId}`;
    const result = await redis.get(key);
    return result ? JSON.parse(result) : null;
  } catch (error) {
    console.error('Error getting webhook result from Redis:', error);
    return null;
  };
};

export const hasWebhookResult = async (requestId: string) => {
  try {
    const key = `${WEBHOOK_PREFIX}${requestId}`;
    return await redis.exists(key) === 1;
  } catch (error) {
    console.error('Error checking webhook result in Redis:', error);
    return false;
  }
};

// Get any completed webhook result
export const getCompletedWebhookResult = async () => {
  try {
    const keys = await redis.keys(`${WEBHOOK_PREFIX}*`);
    for (const key of keys) {
      const result = await redis.get(key);
      if (result) {
        const parsed = JSON.parse(result);
        if (parsed && parsed.status === 'COMPLETED') {
          const requestId = key.replace(WEBHOOK_PREFIX, '');
          return { requestId, result: parsed };
        }
      }
    }
    return null;
  } catch (error) {
    console.error('Error getting completed webhook from Redis:', error);
    return null;
  }
};

// Get all webhook results
export const getAllWebhookResults = async () => {
  try {
    const keys = await redis.keys(`${WEBHOOK_PREFIX}*`);
    const results = [];
    
    for (const key of keys) {
      const result = await redis.get(key);
      if (result) {
        const requestId = key.replace(WEBHOOK_PREFIX, '');
        results.push({
          requestId,
          result: JSON.parse(result)
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error getting all webhook results from Redis:', error);
    return [];
  }
};

// Clean up old webhook results (Redis handles TTL automatically)
export const cleanupOldWebhooks = async () => {
  try {
    // Redis automatically expires keys after TTL, so no manual cleanup needed
    console.log('Redis TTL cleanup is automatic');
  } catch (error) {
    console.error('Error in Redis cleanup:', error);
  }
};

// Health check for Redis connection
export const checkRedisHealth = async () => {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};
