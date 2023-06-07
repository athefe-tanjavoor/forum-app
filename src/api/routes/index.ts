import { Router } from "express";

import userAuthRoutes from "./user/auth.routes";
import postRoutes from "./post/post.routes";
import commentRoutes from "./comment/comment.routes";
const router = Router();
router.use("/auth", userAuthRoutes);

router.use("/post", postRoutes);

router.use("/comment", commentRoutes);

export default router;
