const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: "redis",
        port: '6379'
    }
});
redisClient.connect().catch(console.error);

const setCache = (cacheKey, value, ttl) => {
    redisClient.set(cacheKey,value, redis.print, ttl);
}

const getCache = async (cacheKey,) => {
    return redisClient.get(cacheKey,redis.print).then(foundCache => {
        return foundCache;
    });  
}

module.exports = {setCache, getCache}