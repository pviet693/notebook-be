import redisService from "@/services/redis.service"; // Import Redis Service
import { type CacheParams } from "@/types/Cache";

class CacheService {
    private generateCacheKey(params: CacheParams): string {
        let key = "";
        key += `${params.serviceName}`;
        if (params.limit) {
            key += `.limit_${params.limit}`;
        }
        if (params.page) {
            key += `.page_${params.page}`;
        }
        if (params.title) {
            key += `.title_${params.title.replace(/ /g, "_")}`;
        }
        if (params.categories && params.categories.length > 0) {
            key += `.categories_${params.categories.sort().join("_")}`;
        }
        if (params.username) {
            key += `.username_${params.username}`;
        }
        if (params.excludeBlogSlug) {
            key += `.exclude_blog_slug_${params.excludeBlogSlug}`;
        }
        if (params.statuses && params.statuses.length > 0) {
            key += `.statuses_${params.statuses.sort().join("_")}`;
        }
        if (params.authors && params.authors.length > 0) {
            key += `.authors_${params.authors.sort().join("_")}`;
        }
        if (params.id) {
            key += `.id_${params.id}`;
        }
        if (params.userId) {
            key += `.user_id_${params.userId}`;
        }
        if (params.slug) {
            key += `.slug_${params.slug}`;
        }

        return key.toLowerCase();
    }

    async getFromCache(params: CacheParams): Promise<string | null> {
        const cacheKey = this.generateCacheKey(params);
        const cachedData = await redisService.get(cacheKey);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    async setToCache<T>(params: CacheParams, data: T, expiration: number = 3600): Promise<void> {
        const cacheKey = this.generateCacheKey(params);
        await redisService.set(cacheKey, JSON.stringify(data));

        await redisService.setExpire(cacheKey, expiration);
    }

    async deleteFromCache(params: CacheParams): Promise<void> {
        const cacheKey = this.generateCacheKey(params);
        await redisService.del(cacheKey);
    }

    async deleteKeysWithPrefixFromCache(prefix: string): Promise<void> {
        await redisService.delKeysWithPrefix(prefix);
    }
}

export default new CacheService();
