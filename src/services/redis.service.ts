import { RedisClientType } from "redis";

import RedisConfig from "@/configs/redis.config"; // Import RedisConfig Singleton

class RedisService {
    private client: RedisClientType;

    constructor() {
        this.client = RedisConfig.getInstance();
    }

    async set(key: string, value: string): Promise<void> {
        try {
            await this.client.set(key, value);
        } catch (error) {
            console.error(`Error setting key ${key}:`, error);
            throw error;
        }
    }

    async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (error) {
            console.error(`Error getting key ${key}:`, error);
            throw error;
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            console.error(`Error deleting key ${key}:`, error);
            throw error;
        }
    }

    async delKeysWithPrefix(prefix: string): Promise<void> {
        try {
            const keys = await this.client.keys(`public_blogs*`);
			console.log("Keys", keys);
            await Promise.all(keys.map((key) => this.client.del(key)));
        } catch (error) {
            console.error(`Error deleting keys with prefix ${prefix}:`, error);
            throw error;
        }
    }

    async exists(key: string): Promise<boolean> {
        try {
            const result = await this.client.exists(key);
            return result > 0;
        } catch (error) {
            console.error(`Error checking existence of key ${key}:`, error);
            throw error;
        }
    }

    async keys(prefix: string): Promise<string[]> {
        try {
            return await this.client.keys(prefix);
        } catch (error) {
            console.error(`Error getting keys with prefix ${prefix}:`, error);
            throw error;
        }
    }

    async setExpire(key: string, ttl: number): Promise<void> {
        try {
            await this.client.expire(key, ttl);
        } catch (error) {
            console.error(`Error setting expire for key ${key}:`, error);
            throw error;
        }
    }

    async close(): Promise<void> {
        try {
            await this.client.quit();
        } catch (error) {
            console.error("Error closing Redis connection:", error);
            throw error;
        }
    }
}

export default new RedisService();
