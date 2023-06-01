import { Router } from "express";

import userAuthRoutes from "./user/auth.routes";
import forumRoutes from "./forum/forum.routes";
const router = Router();
router.use("/auth", userAuthRoutes);

router.use("/forum", forumRoutes);

export default router;
