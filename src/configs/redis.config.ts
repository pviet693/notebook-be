import { RedisClientType, createClient } from "redis";

import { envConfig } from "@/configs/env.config"; // Giả sử envConfig đã được cấu hình đúng

class RedisConfig {
    private static instance: RedisClientType;

    private constructor() {}

    public static getInstance(): RedisClientType {
        if (!RedisConfig.instance) {
            const redisUrl = `redis://:${envConfig?.REDIS_PASSWORD}@${envConfig?.REDIS_HOST}:${envConfig?.REDIS_HOST_PORT}`;

            RedisConfig.instance = createClient({
                url: redisUrl
            });

            RedisConfig.instance.on("connect", () => {
                console.log("Connected to Redis!");
            });

            RedisConfig.instance.on("error", (err) => {
                console.error("Redis connection error:", err);
            });

            RedisConfig.instance.connect().catch((err) => {
                console.error("Error connecting to Redis:", err);
            });
        }

        return RedisConfig.instance;
    }
}

export default RedisConfig;
