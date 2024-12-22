import express from "express";

import { StatsController } from "@/controllers";

const router = express.Router();

router.get("/web-visit-stats", StatsController.webVisitStats);
router.post("/increase-web-visit", StatsController.incrWebVisit);
router.get("/blog-read-stats", StatsController.blogReadStats);
router.post("/increase-blog-read", StatsController.incrBlogRead);
router.get("/new-user-stats", StatsController.newUserStats);
router.get("/new-blog-stats", StatsController.newBlogStats);

export default router;
