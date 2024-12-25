import { Op } from "sequelize";

import Blog from "@/models/Blog";
import BlogRead from "@/models/BlogRead";
import User from "@/models/User";
import WebVisit from "@/models/WebVisit";
import cacheService from "@/services/cache.service";
import { BlogStatus } from "@/types/BlogStatus";
import { CacheServiceName } from "@/types/Cache";

class StatsService {
    public static async webVisitStats() {
        const today = new Date().toISOString().split("T")[0];

        const stats = await WebVisit.findOne({
            where: { date: today }
        });

        return stats ? stats.visitCount : 0;
    }

    public static async incrWebVisit() {
        const today = new Date().toISOString().split("T")[0];

        const [stats, created] = await WebVisit.findOrCreate({
            where: { date: today },
            defaults: { date: today, visitCount: 1 }
        });

        if (!created) {
            await stats.increment("visitCount");
        }

        return stats;
    }

    public static async blogReadStats() {
        const today = new Date().toISOString().split("T")[0];

        const readCount = await BlogRead.sum("readCount", {
            where: { date: today }
        });

        return readCount ?? 0;
    }

    public static async incrBlogRead(blogId: string) {
        const today = new Date().toISOString().split("T")[0];

        const [stats, created] = await BlogRead.findOrCreate({
            where: { date: today, blogId },
            defaults: { date: today, blogId, readCount: 1 }
        });

        if (!created) {
            await stats.increment("readCount");
        }

        cacheService.deleteKeysWithPrefixFromCache(CacheServiceName.PRIVATE_BLOGS);

        return stats;
    }

    public static async newUserStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setHours(23, 59, 59, 999);

        const count = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: today,
                    [Op.lte]: tomorrow
                }
            }
        });

        return count;
    }

    public static async newBlogStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setHours(23, 59, 59, 999);

        const count = await Blog.count({
            where: {
                status: BlogStatus.PUBLISHED,
                createdAt: {
                    [Op.gte]: today,
                    [Op.lte]: tomorrow
                }
            }
        });

        return count;
    }
}

export default StatsService;
